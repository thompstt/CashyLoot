import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rollPrize, getVaultConfig, VALID_TIERS } from "@/lib/vault";
import type { VaultOpenResponse, VaultTier } from "@/types/api";

const vaultOpenSchema = z.object({
  tier: z.enum(["bronze", "silver", "gold"]),
});

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json(
      { success: false, prize: 0, cost: 0, newBalance: 0, error: "Unauthorized" } satisfies VaultOpenResponse,
      { status: 401 },
    );
  }

  const parseResult = vaultOpenSchema.safeParse(await request.json().catch(() => null));

  if (!parseResult.success) {
    return NextResponse.json(
      { success: false, prize: 0, cost: 0, newBalance: 0, error: "Invalid request body" } satisfies VaultOpenResponse,
      { status: 400 },
    );
  }

  const { tier } = parseResult.data;
  const config = getVaultConfig(tier);
  const prize = rollPrize(tier);
  const netChange = prize - config.cost;

  // Atomic debit: `updateMany` with `balance: { gte: cost }` compiles to a
  // single UPDATE ... WHERE ... statement. Under Postgres READ COMMITTED,
  // concurrent updates acquire a row-level lock and re-evaluate the WHERE
  // predicate after the lock is acquired, so two requests reading the same
  // starting balance cannot both debit it. The check and the write are one
  // operation — no TOCTOU window.
  //
  // The vault_opening + transaction records must be created only when the
  // debit succeeded, and atomically with it. We wrap everything in an
  // interactive $transaction so if any step fails the debit rolls back.
  const result = await prisma.$transaction(async (tx) => {
    const debit = await tx.user.updateMany({
      where: { id: session.user.id, balance: { gte: config.cost } },
      data: { balance: { increment: netChange } },
    });

    if (debit.count === 0) {
      return { ok: false as const };
    }

    await tx.vaultOpening.create({
      data: {
        userId: session.user.id,
        tier,
        cost: config.cost,
        prize,
      },
    });

    await tx.transaction.create({
      data: {
        userId: session.user.id,
        type: "vault",
        amount: netChange,
        status: "completed",
      },
    });

    const updated = await tx.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: { balance: true },
    });

    return { ok: true as const, newBalance: updated.balance };
  });

  if (!result.ok) {
    const current = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true },
    });
    return NextResponse.json(
      {
        success: false,
        prize: 0,
        cost: config.cost,
        newBalance: current?.balance ?? 0,
        error: "Insufficient balance",
      } satisfies VaultOpenResponse,
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    prize,
    cost: config.cost,
    newBalance: result.newBalance,
  } satisfies VaultOpenResponse);
}

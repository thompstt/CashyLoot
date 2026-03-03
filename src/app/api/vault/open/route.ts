import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rollPrize, getVaultConfig, VALID_TIERS } from "@/lib/vault";
import type { VaultOpenRequest, VaultOpenResponse, VaultTier } from "@/types/api";

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

  let body: VaultOpenRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, prize: 0, cost: 0, newBalance: 0, error: "Invalid request body" } satisfies VaultOpenResponse,
      { status: 400 },
    );
  }

  if (!VALID_TIERS.includes(body.tier as VaultTier)) {
    return NextResponse.json(
      { success: false, prize: 0, cost: 0, newBalance: 0, error: "Invalid tier" } satisfies VaultOpenResponse,
      { status: 400 },
    );
  }

  const tier = body.tier;
  const config = getVaultConfig(tier);
  const prize = rollPrize(tier);
  const netChange = prize - config.cost;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true },
  });

  if (!user || user.balance < config.cost) {
    return NextResponse.json(
      { success: false, prize: 0, cost: config.cost, newBalance: user?.balance ?? 0, error: "Insufficient balance" } satisfies VaultOpenResponse,
      { status: 400 },
    );
  }

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { balance: { increment: netChange } },
      select: { balance: true },
    }),
    prisma.vaultOpening.create({
      data: {
        userId: session.user.id,
        tier,
        cost: config.cost,
        prize,
      },
    }),
    prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: "vault",
        amount: netChange,
        status: "completed",
      },
    }),
  ]);

  return NextResponse.json({
    success: true,
    prize,
    cost: config.cost,
    newBalance: updatedUser.balance,
  } satisfies VaultOpenResponse);
}

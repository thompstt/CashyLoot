import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Gift,
  CreditCard,
  Gamepad2,
  ShoppingBag,
  DollarSign,
  CircleDollarSign,
  Sparkles,
  ArrowRight,
  Apple,
  Target,
} from "lucide-react";
import VaultSection from "@/components/vault/vault-section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const giftCards = [
  { name: "Amazon", icon: ShoppingBag, min: "$1.00", points: 100, color: "bg-amber/10 text-amber", borderColor: "border-amber/10" },
  { name: "Visa", icon: CreditCard, min: "$5.00", points: 500, color: "bg-cyan/10 text-cyan", borderColor: "border-cyan/10" },
  { name: "Steam", icon: Gamepad2, min: "$5.00", points: 500, color: "bg-purple/10 text-purple", borderColor: "border-purple/10" },
  { name: "Google Play", icon: Gift, min: "$5.00", points: 500, color: "bg-green/10 text-green", borderColor: "border-green/10" },
  { name: "Apple", icon: Apple, min: "$5.00", points: 500, color: "bg-foreground/10 text-foreground", borderColor: "border-foreground/10" },
  { name: "Target", icon: Target, min: "$5.00", points: 500, color: "bg-red/10 text-red", borderColor: "border-red/10" },
];

export default async function WithdrawPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true },
  });
  const balance = user?.balance ?? 0;
  const dollars = (balance / 100).toFixed(2);

  const paypalMinimum = 500;
  const paypalProgress = Math.min((balance / paypalMinimum) * 100, 100);
  const paypalPointsNeeded = Math.max(paypalMinimum - balance, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight">Rewards</h1>
        <p className="text-muted-foreground mt-2">
          Your points, your way — vaults, gift cards, or cold hard cash.
        </p>
      </div>

      {/* Balance hero */}
      <Card className="mb-10 bg-gradient-to-br from-purple/[0.08] via-transparent to-cyan/[0.05] border-purple/10 overflow-hidden relative">
        <CardContent className="py-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green/10 border border-green/20">
              <CircleDollarSign className="h-8 w-8 text-green" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Your Balance</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-display font-bold text-green">
                  {balance.toLocaleString()}
                </span>
                <span className="text-xl text-muted-foreground">pts</span>
                <span className="text-xl text-muted-foreground">·</span>
                <span className="text-xl font-semibold">${dollars}</span>
              </div>
            </div>
            {balance === 0 && (
              <Button className="btn-gradient shrink-0" asChild>
                <Link href="/offers">
                  Start earning
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mystery Vaults — the star section */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-amber" />
          <h2 className="text-xl font-display font-semibold">Mystery Vaults</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Feeling lucky? Crack open a vault for a chance to multiply your points.
        </p>
        <VaultSection balance={balance} />
      </div>

      {/* Gift Cards */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <Gift className="h-5 w-5 text-purple-soft" />
          <h2 className="text-xl font-display font-semibold">Gift Cards</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Over 1,000 brands via Tremendous. $0 platform fee.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {giftCards.map((card) => {
            const canAfford = balance >= card.points;
            return (
              <Card
                key={card.name}
                className={`card-glow group ${card.borderColor}`}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.color} transition-transform duration-300 group-hover:scale-110`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{card.name}</p>
                    <p className="text-xs text-muted-foreground">
                      From {card.min}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {canAfford ? (
                      <span className="text-xs font-semibold text-green bg-green/10 rounded-full px-2.5 py-1 border border-green/20">
                        {card.points} pts
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground">
                        {card.points} pts
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {balance < 100 && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-purple/[0.04] border border-purple/10 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Earn <span className="text-purple-soft font-semibold">{(100 - balance).toLocaleString()} more pts</span> to unlock your first gift card.
            </p>
            <Button variant="ghost" size="sm" className="ml-auto text-purple-soft shrink-0" asChild>
              <Link href="/offers">
                Earn now
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* PayPal Cash */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="h-5 w-5 text-cyan" />
          <h2 className="text-xl font-display font-semibold">PayPal Cash</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Cash out directly to your PayPal account.
        </p>
        <Card className="border-cyan/10">
          <CardContent className="py-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan/10">
                <DollarSign className="h-5 w-5 text-cyan" />
              </div>
              <div className="flex-1">
                <p className="font-medium">PayPal Payout</p>
                <p className="text-sm text-muted-foreground">Minimum $5.00 (500 pts)</p>
              </div>
              {balance >= paypalMinimum ? (
                <Button className="btn-gradient shrink-0">
                  Cash out
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground shrink-0">
                  {paypalPointsNeeded.toLocaleString()} pts needed
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="relative h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan/80 to-cyan transition-all duration-500"
                style={{ width: `${paypalProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>{balance.toLocaleString()} / {paypalMinimum.toLocaleString()} pts</span>
              <span>${dollars} / $5.00</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Gift,
  CreditCard,
  Gamepad2,
  ShoppingBag,
  DollarSign,
  CircleDollarSign,
} from "lucide-react";
import VaultSection from "@/components/vault/vault-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const giftCards = [
  { name: "Amazon", icon: ShoppingBag, min: "$1.00", points: 100 },
  { name: "Visa", icon: CreditCard, min: "$5.00", points: 500 },
  { name: "Steam", icon: Gamepad2, min: "$5.00", points: 500 },
  { name: "Google Play", icon: Gift, min: "$5.00", points: 500 },
  { name: "Apple", icon: Gift, min: "$5.00", points: 500 },
  { name: "Target", icon: ShoppingBag, min: "$5.00", points: 500 },
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight">Withdraw</h1>
        <p className="text-muted-foreground mt-2">
          Redeem your points for gift cards or PayPal cash.
        </p>
      </div>

      {/* Current Balance */}
      <Card className="mb-8 bg-gradient-to-br from-purple/[0.07] to-cyan/[0.035] border-purple/10">
        <CardContent className="flex items-center gap-4 py-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CircleDollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Your Balance</p>
            <p className="text-2xl font-display font-bold">0 Points ($0.00)</p>
          </div>
        </CardContent>
      </Card>

      {/* Mystery Vaults */}
      <VaultSection balance={balance} />

      {/* Gift Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-display font-semibold mb-4">Gift Cards</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Powered by Tremendous. $0 platform fee.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {giftCards.map((card) => (
            <Card
              key={card.name}
              className="card-glow cursor-pointer"
            >
              <CardContent className="flex items-center gap-4 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <card.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{card.name} Gift Card</p>
                  <p className="text-sm text-muted-foreground">
                    From {card.min}
                  </p>
                </div>
                <Badge variant="secondary">{card.points} pts</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* PayPal */}
      <div>
        <h2 className="text-xl font-display font-semibold mb-4">PayPal Cash</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg font-display">PayPal Payout</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Cash out directly to your PayPal account
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
              <p className="text-muted-foreground">
                Minimum withdrawal: $5.00 (500 Points)
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                PayPal payouts available once you reach the minimum balance
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

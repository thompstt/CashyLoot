import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Coins,
  ArrowRight,
  Wallet,
  TrendingUp,
  Target,
  Flame,
  Zap,
  Gift,
  Swords,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const topOffers = [
  {
    title: "Raid: Shadow Legends",
    points: 1200,
    meta: "~7 days · game",
    icon: Swords,
    iconColor: "bg-cyan/10 text-cyan",
  },
  {
    title: "Grocery Delivery Deal",
    points: 600,
    meta: "~5 min · shopping",
    icon: Gift,
    iconColor: "bg-green/10 text-green",
  },
  {
    title: "Finance App Install",
    points: 500,
    meta: "~3 min · app install",
    icon: Smartphone,
    iconColor: "bg-purple/10 text-purple",
  },
];

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true, name: true },
  });

  // Query real stats from the database
  const [offersCompleted, totalEarned, recentActivity] = await Promise.all([
    prisma.transaction.count({
      where: { userId: session.user.id, type: "earn", status: "completed" },
    }),
    prisma.transaction.aggregate({
      where: { userId: session.user.id, type: "earn", status: "completed" },
      _sum: { amount: true },
    }),
    prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const balance = user?.balance ?? 0;
  const dollars = (balance / 100).toFixed(2);
  const lifetimeEarned = ((totalEarned._sum.amount ?? 0) / 100).toFixed(2);
  const name = user?.name || session.user.name || "User";

  // Milestone thresholds
  const milestones = [
    { label: "Bronze Vault", points: 100, icon: "🔒" },
    { label: "Silver Vault", points: 300, icon: "🔒" },
    { label: "Gold Vault", points: 500, icon: "🔒" },
    { label: "$5 PayPal", points: 500, icon: "💰" },
    { label: "$10 Gift Card", points: 1000, icon: "🎁" },
  ];

  // Find next milestone the user hasn't reached
  const nextMilestone = milestones.find((m) => balance < m.points);
  const milestoneProgress = nextMilestone
    ? Math.min((balance / nextMilestone.points) * 100, 100)
    : 100;
  const pointsToGo = nextMilestone ? nextMilestone.points - balance : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight">
          Welcome back, {name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your earning overview
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Balance */}
        <Card className="card-glow col-span-2 bg-gradient-to-br from-purple/[0.07] to-cyan/[0.035] border-purple/10">
          <CardContent className="pt-6 pb-5">
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green/10">
                <Coins className="h-5 w-5 text-green" />
              </div>
              <p className="text-sm text-muted-foreground">Your Balance</p>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-4xl font-display font-bold text-green">
                {balance.toLocaleString()}
              </span>
              <span className="text-lg text-muted-foreground">pts</span>
              <span className="text-lg text-muted-foreground">·</span>
              <span className="text-lg font-semibold">${dollars}</span>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber/[0.06] border border-amber/10 px-3 py-2">
              <Flame className="h-3.5 w-3.5 text-amber shrink-0" />
              <p className="text-xs text-muted-foreground">
                <span className="text-amber font-medium">Daily Bonus:</span> Complete an offer today to start your streak!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Offers Completed */}
        <Card className="card-glow">
          <CardContent className="pt-6 pb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Completed</p>
              <TrendingUp className="h-4 w-4 text-purple" />
            </div>
            <div className="text-3xl font-display font-bold">{offersCompleted}</div>
            <p className="text-xs text-muted-foreground mt-1">offers</p>
          </CardContent>
        </Card>

        {/* Total Earned */}
        <Card className="card-glow">
          <CardContent className="pt-6 pb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Total Earned</p>
              <Wallet className="h-4 w-4 text-cyan" />
            </div>
            <div className="text-3xl font-display font-bold">${lifetimeEarned}</div>
            <p className="text-xs text-muted-foreground mt-1">lifetime</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress toward next milestone */}
      {nextMilestone && (
        <Card className="mb-8 card-glow">
          <CardContent className="pt-6 pb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-soft" />
                <p className="text-sm font-medium">Next Reward</p>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="text-green font-semibold">{pointsToGo}</span> pts to go
              </p>
            </div>
            <div className="relative h-3 rounded-full bg-muted overflow-hidden mb-3">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple to-cyan transition-all duration-500"
                style={{ width: `${milestoneProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {balance.toLocaleString()} / {nextMilestone.points.toLocaleString()} pts
              </span>
              <span className="font-medium">
                {nextMilestone.icon} {nextMilestone.label}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top earning offers */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber" />
            <h2 className="text-lg font-display font-semibold">Top Earning Offers</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground group" asChild>
            <Link href="/offers">
              View all
              <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {topOffers.map((offer) => (
            <Card key={offer.title} className="card-glow group cursor-pointer" asChild>
              <Link href="/offers">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${offer.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                      <offer.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm leading-tight">{offer.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{offer.meta}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="offer-reward text-green font-bold text-lg">+{offer.points} pts</span>
                    <span className="text-xs text-muted-foreground">${(offer.points / 100).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="mb-8">
        <CardContent className="pt-6 pb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold">Recent Activity</h2>
            {recentActivity.length > 0 && (
              <span className="text-xs text-muted-foreground">{recentActivity.length} transactions</span>
            )}
          </div>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((tx) => {
                const isEarn = tx.type === "earn";
                const amount = tx.amount;
                const dollarVal = (Math.abs(amount) / 100).toFixed(2);
                return (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isEarn ? "bg-green/10" : "bg-purple/10"}`}>
                        {isEarn ? (
                          <TrendingUp className="h-4 w-4 text-green" />
                        ) : (
                          <Gift className="h-4 w-4 text-purple" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {tx.provider ? `${tx.provider} offer` : tx.type === "earn" ? "Earned" : "Redeemed"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${isEarn ? "text-green" : "text-foreground"}`}>
                        {isEarn ? "+" : "-"}{Math.abs(amount).toLocaleString()} pts
                      </p>
                      <p className="text-xs text-muted-foreground">${dollarVal}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No activity yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Complete your first offer to see your earnings here
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Button size="lg" className="btn-gradient h-auto py-4" asChild>
          <Link href="/offers" className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Browse All Offers</div>
              <div className="text-sm opacity-80">
                {balance === 0 ? "Complete your first offer!" : "Keep earning points"}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="h-auto py-4" asChild>
          <Link href="/withdraw" className="flex items-center gap-3">
            <Gift className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Rewards</div>
              <div className="text-sm opacity-80">
                Vaults, gift cards, PayPal
              </div>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

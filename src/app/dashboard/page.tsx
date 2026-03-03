import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Coins, ArrowRight, ClipboardList, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user.name || "User"}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <Card className="card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your Balance
            </CardTitle>
            <Coins className="h-4 w-4 text-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">0 Points</div>
            <p className="text-sm text-muted-foreground mt-1">($0.00)</p>
          </CardContent>
        </Card>

        {/* Offers Completed */}
        <Card className="card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Offers Completed
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">0</div>
            <p className="text-sm text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        {/* Total Earned */}
        <Card className="card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earned
            </CardTitle>
            <Wallet className="h-4 w-4 text-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">$0.00</div>
            <p className="text-sm text-muted-foreground mt-1">Lifetime</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Button size="lg" className="btn-gradient h-auto py-4" asChild>
          <Link href="/offers" className="flex items-center gap-3">
            <ClipboardList className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Browse Offers</div>
              <div className="text-sm opacity-80">
                Complete tasks to earn points
              </div>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="h-auto py-4" asChild>
          <Link href="/withdraw" className="flex items-center gap-3">
            <Wallet className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Withdraw</div>
              <div className="text-sm opacity-80">
                Cash out your earnings
              </div>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>
        </Button>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <div className="py-8 text-center text-muted-foreground">
            <p>No activity yet.</p>
            <p className="text-sm mt-1">
              Complete offers to start earning points!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

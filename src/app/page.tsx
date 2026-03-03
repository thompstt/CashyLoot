import Link from "next/link";
import {
  UserPlus,
  ClipboardList,
  Wallet,
  Gift,
  CreditCard,
  Gamepad2,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up Free",
    description: "Create your account in seconds. No credit card required.",
  },
  {
    icon: ClipboardList,
    title: "Complete Offers",
    description:
      "Earn points by completing surveys, trying apps, and finishing tasks.",
  },
  {
    icon: Wallet,
    title: "Cash Out",
    description: "Redeem your points for gift cards or PayPal cash.",
  },
];

const rewards = [
  {
    icon: Gift,
    name: "Amazon Gift Card",
    minimum: "$1.00",
    points: "100 Points",
  },
  {
    icon: CreditCard,
    name: "Visa Gift Card",
    minimum: "$5.00",
    points: "500 Points",
  },
  {
    icon: Gamepad2,
    name: "Steam Gift Card",
    minimum: "$5.00",
    points: "500 Points",
  },
  {
    icon: DollarSign,
    name: "PayPal Cash",
    minimum: "$5.00",
    points: "500 Points",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Earn Rewards for
            <br />
            <span className="text-primary">Completing Tasks</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete offers, surveys, and tasks to earn points. Redeem them for
            gift cards or PayPal cash — it&apos;s that simple.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Sign Up Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/offers">Browse Offers</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <Card key={step.title} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Step {i + 1}
                  </p>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Choose Your Reward
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            100 points = $1.00. Redeem your earnings for popular gift cards or
            cash out via PayPal.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {rewards.map((reward) => (
              <Card key={reward.name}>
                <CardContent className="pt-6 text-center">
                  <reward.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold">{reward.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Starting at {reward.minimum}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ({reward.points})
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Thousands of Users Earning Rewards
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            CashyLoot partners with leading offer providers to bring you the
            best earning opportunities. Start earning today.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">
              Start Earning Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

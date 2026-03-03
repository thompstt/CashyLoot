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
  Smartphone,
  Sparkles,
  Clock,
  Users,
  ListChecks,
  Zap,
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

const stats = [
  { label: "Payout Speed", value: "<24hr", icon: Clock, color: "text-green" },
  { label: "Active Users", value: "2,400+", icon: Users, color: "text-purple" },
  { label: "Available Offers", value: "500+", icon: ListChecks, color: "text-cyan" },
  { label: "Min. Withdrawal", value: "$1.00", icon: Zap, color: "text-amber" },
];

const rewards = [
  { icon: Gift, name: "Amazon", color: "bg-amber/10 text-amber" },
  { icon: CreditCard, name: "Visa", color: "bg-cyan/10 text-cyan" },
  { icon: Gamepad2, name: "Steam", color: "bg-purple/10 text-purple" },
  { icon: DollarSign, name: "PayPal", color: "bg-green/10 text-green" },
  { icon: Smartphone, name: "Apple", color: "bg-pink/10 text-pink" },
  { icon: Sparkles, name: "+1000 more", color: "bg-purple-soft/10 text-purple-soft" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/5 px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
            </span>
            <span className="text-sm text-green font-medium">People are earning right now</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight">
            Earn Rewards for
            <br />
            <span className="text-gradient-main">Completing Tasks</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete offers, surveys, and tasks to earn points. Redeem them for
            gift cards or PayPal cash — it&apos;s that simple.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-gradient" asChild>
              <Link href="/register">
                Start Earning Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/offers">Browse Offers</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <Card key={stat.label} className="card-glow text-center">
                <CardContent className="pt-6 pb-5">
                  <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                  <div className={`text-2xl font-display font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <p className="section-label text-muted-foreground text-center mb-3">
            Simple Process
          </p>
          <h2 className="text-3xl font-display font-bold text-center tracking-tight mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center">
                <Card className="card-glow text-center w-full">
                  <CardContent className="pt-6">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                    <p className="text-sm font-display font-bold text-gradient-main mb-1">
                      Step {i + 1}
                    </p>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block h-5 w-5 text-muted-foreground mt-4 rotate-0 md:absolute md:right-0 md:top-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <p className="section-label text-muted-foreground text-center mb-3">
            Cash Out
          </p>
          <h2 className="text-3xl font-display font-bold text-center tracking-tight mb-4">
            Choose Your Reward
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            100 points = $1.00. Redeem your earnings for popular gift cards or
            cash out via PayPal.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {rewards.map((reward) => (
              <Card key={reward.name} className="card-glow">
                <CardContent className="pt-6 pb-5 text-center">
                  <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${reward.color}`}>
                    <reward.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-sm">{reward.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-purple/[0.07] to-cyan/[0.035] border-purple/10">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-display font-bold tracking-tight mb-4">
                Ready to get started?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Join thousands of users already earning rewards. Create your free
                account and start earning in minutes.
              </p>
              <Button size="lg" className="btn-gradient" asChild>
                <Link href="/register">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

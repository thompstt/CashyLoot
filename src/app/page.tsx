import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LiveTicker } from "@/components/landing/live-ticker";

const stats = [
  { label: "avg payout", value: "<24hr", color: "text-green" },
  { label: "active users", value: "2,400+", color: "text-purple-soft" },
  { label: "live offers", value: "500+", color: "text-cyan" },
  { label: "minimum cashout", value: "$1.00", color: "text-amber" },
];

const offers = [
  { name: "Temu", emoji: "\u{1F4F1}", badge: "popular", badgeColor: "bg-purple/10 text-purple border-purple/20", reward: "+$3.50", meta: "~2 min \u00b7 signup" },
  { name: "Royal Match", emoji: "\u{1F3AE}", badge: "high reward", badgeColor: "bg-green/10 text-green border-green/20", reward: "+$35.00", meta: "~7 days \u00b7 game" },
  { name: "Cash App", emoji: "\u{1F4B3}", badge: "quick", badgeColor: "bg-cyan/10 text-cyan border-cyan/20", reward: "+$5.00", meta: "~5 min \u00b7 signup" },
  { name: "Audible", emoji: "\u{1F3A7}", badge: "new", badgeColor: "bg-amber/10 text-amber border-amber/20", reward: "+$8.00", meta: "~3 min \u00b7 trial" },
  { name: "Raid: Shadow Legends", emoji: "\u2694\uFE0F", badge: "high reward", badgeColor: "bg-green/10 text-green border-green/20", reward: "+$18.00", meta: "~4 days \u00b7 game" },
  { name: "Consumer habits", emoji: "\u{1F4CA}", badge: "quick", badgeColor: "bg-cyan/10 text-cyan border-cyan/20", reward: "+$1.25", meta: "~8 min \u00b7 survey" },
  { name: "Factor Meals", emoji: "\u{1F957}", badge: "popular", badgeColor: "bg-purple/10 text-purple border-purple/20", reward: "+$12.00", meta: "~5 min \u00b7 signup" },
  { name: "Coin Master", emoji: "\u{1F3F0}", badge: "new", badgeColor: "bg-amber/10 text-amber border-amber/20", reward: "+$6.50", meta: "~3 days \u00b7 game" },
];

const rewards = [
  { letter: "A", name: "Amazon", color: "bg-amber/10 text-amber", min: "from $1" },
  { letter: "P", name: "PayPal", color: "bg-cyan/10 text-cyan", min: "from $5" },
  { letter: "S", name: "Steam", color: "bg-purple/10 text-purple", min: "from $1" },
  { letter: "V", name: "Visa", color: "bg-green/10 text-green", min: "from $1" },
  { letter: "A", name: "Apple", color: "bg-foreground/10 text-foreground", min: "from $1" },
  { letter: "+", name: "1,000+", color: "bg-muted text-muted-foreground", min: "more options" },
];

const tiers = [
  { name: "Starter", rate: "5%", referrals: "0+", color: "#34d399", bonus: null },
  { name: "Bronze", rate: "7%", referrals: "5+", color: "#3ec9a0", bonus: "+$2" },
  { name: "Silver", rate: "10%", referrals: "10+", color: "#5cb8d4", bonus: "+$5" },
  { name: "Gold", rate: "12%", referrals: "25+", color: "#7e9cf0", bonus: "+$15" },
  { name: "Diamond", rate: "15%", referrals: "50+", color: "#a78bfa", bonus: "+$40", highlighted: true },
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
            <span className="text-sm text-green font-medium">2,413 people earning right now</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight">
            Get paid for
            <br />
            <span className="text-gradient-main">stuff you already do</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Take surveys, try apps, play games. Cash out to PayPal or gift cards from $1.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-gradient" asChild>
              <Link href="/register">
                Start earning for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <a href="#steps">See how it works</a>
            </Button>
          </div>

          <LiveTicker />
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <Card key={stat.label} className="card-glow text-center">
                <CardContent className="pt-6 pb-5">
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

      {/* Featured Offers */}
      <section id="offers" className="py-16">
        <div className="container mx-auto px-4">
          <p className="section-label text-cyan text-center mb-3">Featured offers</p>
          <h2 className="text-3xl font-display font-bold text-center tracking-tight mb-4">
            Popular right now
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            Real offers from real brands. Pick one, complete it, get paid.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {offers.map((offer) => (
              <Card key={offer.name} className="card-glow">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-card border border-border text-xl">
                      {offer.emoji}
                    </div>
                    <span className={`text-[0.65rem] font-semibold rounded-full border px-2 py-0.5 ${offer.badgeColor}`}>
                      {offer.badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{offer.name}</h3>
                  <p className="text-green font-bold text-lg mb-2">{offer.reward}</p>
                  <p className="text-xs text-muted-foreground">{offer.meta}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="ghost" asChild>
              <Link href="/offers">
                See all 500+ offers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="steps" className="py-16">
        <div className="container mx-auto px-4">
          <p className="section-label text-purple-soft text-center mb-3">How it works</p>
          <h2 className="text-3xl font-display font-bold text-center tracking-tight mb-12">
            Three steps to your first payout
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex-1 text-center">
              <p className="text-5xl font-display font-extrabold text-gradient-main opacity-35 mb-3">01</p>
              <h3 className="text-xl font-semibold mb-2">Sign up</h3>
              <p className="text-muted-foreground text-sm">Takes 30 seconds. No credit card needed.</p>
            </div>

            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground/40 shrink-0" />

            {/* Step 2 */}
            <div className="flex-1 text-center">
              <p className="text-5xl font-display font-extrabold text-gradient-main opacity-35 mb-3">02</p>
              <h3 className="text-xl font-semibold mb-2">Do tasks</h3>
              <p className="text-muted-foreground text-sm">Surveys, app signups, mobile games. Pick what you like.</p>
            </div>

            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground/40 shrink-0" />

            {/* Step 3 */}
            <div className="flex-1 text-center">
              <p className="text-5xl font-display font-extrabold text-gradient-main opacity-35 mb-3">03</p>
              <h3 className="text-xl font-semibold mb-2">Get paid</h3>
              <p className="text-muted-foreground text-sm">Cash out to PayPal, Amazon, Steam, or Visa from $1.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards */}
      <section id="rewards" className="py-16">
        <div className="container mx-auto px-4">
          <p className="section-label text-green text-center mb-3">Rewards</p>
          <h2 className="text-3xl font-display font-bold text-center tracking-tight mb-4">
            Pick how you get paid
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            PayPal cash, gift cards, prepaid Visa. Over 1,000 options starting at $1.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {rewards.map((reward) => (
              <Card key={reward.name} className="card-glow">
                <CardContent className="pt-6 pb-5 text-center">
                  <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${reward.color} text-xl font-bold`}>
                    {reward.letter}
                  </div>
                  <h3 className="font-semibold text-sm">{reward.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{reward.min}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Program */}
      <section id="referral" className="py-16">
        <div className="container mx-auto px-4">
          <p className="section-label text-purple-soft text-center mb-3">Referral program</p>
          <h2 className="text-3xl font-display font-bold text-center tracking-tight mb-4">
            Your friends earn. You earn more.
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Get $0.50 for every friend who signs up &mdash; plus an ongoing cut of everything they earn.
            The more you refer, the higher your rate.
          </p>

          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple/[0.07] to-cyan/[0.035] border-purple/10">
            <CardContent className="py-10 px-6 md:px-10">
              <h3 className="text-xl font-display font-bold text-center mb-8">
                Earn up to 15% of everything your referrals make
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                {tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`rounded-xl border border-border/50 bg-card/50 p-4 text-center ${tier.highlighted ? "tier-highlighted" : ""}`}
                  >
                    <p className="text-2xl font-display font-bold" style={{ color: tier.color }}>
                      {tier.rate}
                    </p>
                    <p className="text-sm font-semibold mt-1">{tier.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{tier.referrals} referrals</p>
                    {tier.bonus && (
                      <span className="inline-block mt-2 text-[0.65rem] font-semibold rounded-full bg-green/10 text-green border border-green/20 px-2 py-0.5">
                        {tier.bonus} bonus
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-center text-sm text-muted-foreground mb-6">
                Plus <span className="text-green font-semibold">$0.50</span> instant bonus for every signup
              </p>

              <div className="text-center">
                <Button className="btn-gradient" asChild>
                  <Link href="/register">
                    Start referring
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
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
                Join for free. No card needed. Withdraw anytime.
              </p>
              <Button size="lg" className="btn-gradient" asChild>
                <Link href="/register">
                  Create your account
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

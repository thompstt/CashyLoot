import Link from "next/link";
import { ArrowRight, Zap, Gift, Users, Star, Quote } from "lucide-react";
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

const steps = [
  { num: "01", title: "Sign up", desc: "Takes 30 seconds. No credit card needed.", icon: Zap },
  { num: "02", title: "Do tasks", desc: "Surveys, app signups, mobile games. Pick what you like.", icon: Gift },
  { num: "03", title: "Get paid", desc: "Cash out to PayPal, Amazon, Steam, or Visa from $1.", icon: Users },
];

const testimonials = [
  {
    name: "Sarah M.",
    earned: "$340",
    duration: "2 months",
    quote: "I do a few surveys during lunch and play a game or two at night. It adds up way faster than I expected.",
    color: "text-green",
  },
  {
    name: "Jason T.",
    earned: "$1,200",
    duration: "6 months",
    quote: "The referral program is insane. I shared my link on Reddit once and now I earn passive income every day.",
    color: "text-purple-soft",
  },
  {
    name: "Emily R.",
    earned: "$85",
    duration: "3 weeks",
    quote: "Got my first Amazon gift card in two days. Actually legit, unlike the other sites I've tried.",
    color: "text-cyan",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="hero-glow" />
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-up delay-1 inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/5 px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
            </span>
            <span className="text-sm text-green font-medium">2,413 people earning right now</span>
          </div>

          <h1 className="animate-fade-up delay-2 text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight leading-[0.9]">
            Get paid for
            <br />
            <span className="text-gradient-main">stuff you already do</span>
          </h1>

          <p className="animate-fade-up delay-3 mt-8 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Take surveys, try apps, play games.
            <br className="hidden sm:block" />
            Cash out to PayPal or gift cards from <span className="text-green font-semibold">$1</span>.
          </p>

          <div className="animate-fade-up delay-4 mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-gradient text-base px-8 py-6" asChild>
              <Link href="/register">
                Start earning for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="text-base px-8 py-6 text-muted-foreground" asChild>
              <a href="#steps">See how it works</a>
            </Button>
          </div>

          <div className="animate-fade-in delay-6">
            <LiveTicker />
          </div>

          {/* Trust bar */}
          <div className="animate-fade-in delay-7 mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["M", "S", "J", "E", "A"].map((initial, i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full border-2 border-background bg-purple/20 flex items-center justify-center text-[10px] font-bold text-purple-soft"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <span className="font-medium text-foreground">2,400+</span> users earning
            </div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber text-amber" />
              ))}
              <span className="ml-1"><span className="font-medium text-foreground">4.8</span>/5 rating</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <span><span className="font-medium text-green">$180k+</span> paid out</span>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <Card key={stat.label} className="card-glow text-center animate-scale-in" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
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

      <div className="section-divider my-8" />

      {/* How It Works */}
      <section id="steps" className="py-20">
        <div className="container mx-auto px-4">
          <p className="section-label text-purple-soft text-center mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center tracking-tight mb-16">
            Three steps to your first payout
          </h2>
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={step.num} className="flex-1 text-center relative">
                <div className="step-number font-display mb-4">{step.num}</div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple/10 border border-purple/20 mb-4">
                  <step.icon className="h-5 w-5 text-purple-soft" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm max-w-[220px] mx-auto">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-12 -right-6 h-5 w-5 text-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider my-4" />

      {/* Featured Offers */}
      <section id="offers" className="py-16">
        <div className="container mx-auto px-4">
          <p className="section-label text-cyan text-center mb-3">Featured offers</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center tracking-tight mb-4">
            Popular right now
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            Real offers from real brands. Pick one, complete it, get paid.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {offers.map((offer) => (
              <Card key={offer.name} className="card-glow group">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-card border border-border text-xl transition-transform duration-300 group-hover:scale-110">
                      {offer.emoji}
                    </div>
                    <span className={`text-[0.65rem] font-semibold rounded-full border px-2 py-0.5 ${offer.badgeColor}`}>
                      {offer.badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{offer.name}</h3>
                  <p className="offer-reward text-green font-bold text-lg mb-2 transition-all duration-300">{offer.reward}</p>
                  <p className="text-xs text-muted-foreground">{offer.meta}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="ghost" className="group" asChild>
              <Link href="/offers">
                See all 500+ offers
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="section-divider my-4" />

      {/* Rewards */}
      <section id="rewards" className="py-16">
        <div className="container mx-auto px-4">
          <p className="section-label text-green text-center mb-3">Rewards</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center tracking-tight mb-4">
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

      <div className="section-divider my-4" />

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <p className="section-label text-amber text-center mb-3">What users say</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center tracking-tight mb-12">
            Real people, real earnings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <Card key={t.name} className="card-glow relative">
                <CardContent className="pt-8 pb-6">
                  <Quote className="absolute top-5 right-5 h-8 w-8 text-purple/15" />
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-purple/15 border border-purple/20 flex items-center justify-center text-sm font-bold text-purple-soft">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">member for {t.duration}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${t.color}`}>{t.earned}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">earned</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border-purple/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple/[0.08] via-transparent to-cyan/[0.05]" />
            <CardContent className="relative py-14 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
                Ready to get started?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Join for free. No card needed. Cash out anytime.
              </p>
              <Button size="lg" className="btn-gradient text-base px-8 py-6" asChild>
                <Link href="/register">
                  Create your account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="mt-6 text-sm text-muted-foreground">
                Love CashyLoot? <Link href="/referral" className="text-purple-soft hover:underline">Earn up to 15%</Link> by referring friends.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

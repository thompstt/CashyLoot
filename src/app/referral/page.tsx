"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Users,
  TrendingUp,
  Gift,
  ArrowRight,
  Share2,
  Link as LinkIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tiers = [
  { name: "None", rate: "0%", referrals: 0, color: "#666", bonus: null },
  { name: "Starter", rate: "3%", referrals: 1, color: "#34d399", bonus: null },
  { name: "Bronze", rate: "5%", referrals: 5, color: "#3ec9a0", bonus: "+$2" },
  { name: "Silver", rate: "8%", referrals: 15, color: "#5cb8d4", bonus: "+$5" },
  { name: "Gold", rate: "12%", referrals: 30, color: "#7e9cf0", bonus: "+$15" },
  { name: "Diamond", rate: "15%", referrals: 50, color: "#a78bfa", bonus: "+$40", highlighted: true },
];

const steps = [
  { num: "1", title: "Share your link", desc: "Send your unique referral link to friends", icon: Share2 },
  { num: "2", title: "They sign up", desc: "Your friend creates an account using your link", icon: Users },
  { num: "3", title: "You both earn", desc: "Get $0.50 + ongoing commission on their earnings", icon: TrendingUp },
];

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);

  // TODO: Replace with real data from API
  const referralCount = 0;
  const referralEarnings = 0;
  const referralLink = "https://www.cashyloot.com/ref/your-code";

  // Determine current tier
  const currentTierIndex = [...tiers].reverse().findIndex((t) => referralCount >= t.referrals);
  const activeTierIndex = currentTierIndex === -1 ? 0 : tiers.length - 1 - currentTierIndex;
  const nextTier = activeTierIndex < tiers.length - 1 ? tiers[activeTierIndex + 1] : null;
  const referralsToNext = nextTier ? nextTier.referrals - referralCount : 0;

  function handleCopy() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight">Referral Program</h1>
        <p className="text-muted-foreground mt-2">
          Invite friends, earn passive income. It&apos;s that simple.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="card-glow">
          <CardContent className="pt-5 pb-4 text-center">
            <Users className="h-4 w-4 text-purple-soft mx-auto mb-2" />
            <div className="text-2xl font-display font-bold">{referralCount}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Referrals</p>
          </CardContent>
        </Card>
        <Card className="card-glow">
          <CardContent className="pt-5 pb-4 text-center">
            <TrendingUp className="h-4 w-4 text-green mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-green">${(referralEarnings / 100).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Earned</p>
          </CardContent>
        </Card>
        <Card className="card-glow">
          <CardContent className="pt-5 pb-4 text-center">
            <Gift className="h-4 w-4 text-amber mx-auto mb-2" />
            <div className="text-2xl font-display font-bold" style={{ color: tiers[activeTierIndex].color }}>
              {tiers[activeTierIndex].rate}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{tiers[activeTierIndex].name} tier</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral link + share */}
      <Card className="mb-8 bg-gradient-to-br from-purple/[0.06] to-cyan/[0.03] border-purple/10">
        <CardContent className="py-6">
          <div className="flex items-center gap-2 mb-3">
            <LinkIcon className="h-4 w-4 text-purple-soft" />
            <p className="text-sm font-medium">Your referral link</p>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm text-muted-foreground font-mono truncate">
              {referralLink}
            </div>
            <Button
              variant="outline"
              className={`shrink-0 transition-all ${copied ? "border-green/50 text-green" : "border-purple/30 text-purple-soft hover:bg-purple/10"}`}
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-xs border-border/50" onClick={handleCopy}>
              <Share2 className="h-3 w-3 mr-1.5" />
              Share on X
            </Button>
            <Button variant="outline" size="sm" className="text-xs border-border/50" onClick={handleCopy}>
              <Share2 className="h-3 w-3 mr-1.5" />
              Share on Reddit
            </Button>
            <Button variant="outline" size="sm" className="text-xs border-border/50" onClick={handleCopy}>
              <Share2 className="h-3 w-3 mr-1.5" />
              WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How it works */}
      <div className="mb-8">
        <h2 className="text-lg font-display font-semibold mb-5">How referrals work</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {steps.map((step) => (
            <Card key={step.num} className="card-glow">
              <CardContent className="pt-5 pb-4 text-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple/10 border border-purple/20 mb-3">
                  <step.icon className="h-5 w-5 text-purple-soft" />
                </div>
                <h3 className="text-sm font-semibold mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tier ladder */}
      <Card className="bg-gradient-to-br from-purple/[0.06] to-cyan/[0.03] border-purple/10">
        <CardContent className="py-8 px-6 md:px-10">
          <h2 className="text-xl font-display font-bold text-center mb-2">
            Earn up to <span className="text-gradient-main">15%</span> of everything your referrals make
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-8">
            Plus <span className="text-green font-semibold">$0.50</span> instant bonus for every signup
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {tiers.map((tier, i) => {
              const isActive = i === activeTierIndex;
              const isLocked = i > activeTierIndex;
              return (
                <div
                  key={tier.name}
                  className={`rounded-xl border p-4 text-center transition-all duration-300 relative ${
                    isActive
                      ? "border-purple/40 bg-purple/[0.08] shadow-[0_0_20px_rgba(139,92,246,0.12)]"
                      : tier.highlighted
                        ? "tier-highlighted border-border/50 bg-card/50"
                        : "border-border/50 bg-card/50"
                  } ${!isLocked ? "hover:scale-[1.03]" : "opacity-60"}`}
                >
                  {isActive && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[0.6rem] font-semibold bg-purple text-white px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                  <p className="text-2xl font-display font-bold" style={{ color: tier.color }}>
                    {tier.rate}
                  </p>
                  <p className="text-sm font-semibold mt-1">{tier.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tier.referrals}+ referrals</p>
                  {tier.bonus && (
                    <span className="inline-block mt-2 text-[0.65rem] font-semibold rounded-full bg-green/10 text-green border border-green/20 px-2 py-0.5">
                      {tier.bonus} bonus
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress to next tier */}
          {nextTier && (
            <div className="rounded-lg bg-background/30 border border-border/50 px-4 py-3 text-center">
              <p className="text-sm text-muted-foreground">
                <span className="text-purple-soft font-semibold">{referralsToNext} more referral{referralsToNext !== 1 ? "s" : ""}</span> to reach{" "}
                <span className="font-semibold" style={{ color: nextTier.color }}>{nextTier.name}</span> tier ({nextTier.rate} commission)
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

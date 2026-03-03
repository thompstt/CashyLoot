import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

const tiers = [
  { name: "Starter", rate: "5%", referrals: "0+", color: "#34d399", bonus: null },
  { name: "Bronze", rate: "7%", referrals: "5+", color: "#3ec9a0", bonus: "+$2" },
  { name: "Silver", rate: "10%", referrals: "10+", color: "#5cb8d4", bonus: "+$5" },
  { name: "Gold", rate: "12%", referrals: "25+", color: "#7e9cf0", bonus: "+$15" },
  { name: "Diamond", rate: "15%", referrals: "50+", color: "#a78bfa", bonus: "+$40", highlighted: true },
];

export default function ReferralPage() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <p className="section-label text-purple-soft text-center mb-3">Referral program</p>
        <h1 className="text-3xl font-display font-bold text-center tracking-tight mb-4">
          Refer friends, earn more
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Get $0.50 for every friend who signs up &mdash; plus an ongoing cut of everything they earn.
        </p>

        {/* Referral link */}
        <Card className="mb-8">
          <CardContent className="py-6">
            <p className="text-sm font-medium mb-3">Your referral link</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground font-mono truncate">
                https://cashyloot.com/ref/your-code
              </div>
              <Button variant="outline" size="icon" disabled title="Coming soon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Referral tracking coming soon
            </p>
          </CardContent>
        </Card>

        {/* Tier grid */}
        <Card className="bg-gradient-to-br from-purple/[0.07] to-cyan/[0.035] border-purple/10">
          <CardContent className="py-10 px-6 md:px-10">
            <h2 className="text-xl font-display font-bold text-center mb-8">
              Earn up to 15% of everything your referrals make
            </h2>

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

            <p className="text-center text-sm text-muted-foreground">
              Plus <span className="text-green font-semibold">$0.50</span> instant bonus for every signup
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

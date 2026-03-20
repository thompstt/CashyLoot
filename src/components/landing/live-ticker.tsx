"use client";

const tickerItems = [
  { user: "mike_r23", action: "earned", amount: "+$2.50", color: "text-green", bg: "bg-green/10" },
  { user: "jessicaB", action: "withdrew", amount: "$25 Amazon", color: "text-amber", bg: "bg-amber/10" },
  { user: "tyler_m", action: "earned", amount: "+$35.00", color: "text-green", bg: "bg-green/10" },
  { user: "samantha", action: "withdrew", amount: "$10 PayPal", color: "text-cyan", bg: "bg-cyan/10" },
  { user: "chris99", action: "earned", amount: "+$5.00", color: "text-green", bg: "bg-green/10" },
  { user: "emma_k", action: "withdrew", amount: "$50 Visa", color: "text-green", bg: "bg-green/10" },
  { user: "alex_dev", action: "earned", amount: "+$8.00", color: "text-green", bg: "bg-green/10" },
  { user: "nina22", action: "withdrew", amount: "$15 Steam", color: "text-purple", bg: "bg-purple/10" },
];

function UserAvatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple/15 border border-purple/20 text-xs font-bold text-purple-soft">
      {initial}
    </div>
  );
}

export function LiveTicker() {
  return (
    <div className="ticker-mask overflow-hidden mt-12 max-w-3xl mx-auto">
      <div
        className="flex gap-4 w-max"
        style={{ animation: "scroll-ticker 40s linear infinite" }}
      >
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card/80 px-4 py-2.5 text-sm whitespace-nowrap"
          >
            <UserAvatar name={item.user} />
            <span className="text-muted-foreground font-medium">{item.user}</span>
            <span className="text-muted-foreground/60">{item.action}</span>
            <span className={`font-bold ${item.color} ${item.bg} rounded-md px-2 py-0.5 text-xs`}>{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

const tickerItems = [
  { user: "mike_r23", action: "earned", amount: "+$2.50", color: "text-green" },
  { user: "jessicaB", action: "withdrew", amount: "$25 Amazon", color: "text-amber" },
  { user: "tyler_m", action: "earned", amount: "+$35.00", color: "text-green" },
  { user: "samantha", action: "withdrew", amount: "$10 PayPal", color: "text-cyan" },
  { user: "chris99", action: "earned", amount: "+$5.00", color: "text-green" },
  { user: "emma_k", action: "withdrew", amount: "$50 Visa", color: "text-green" },
  { user: "alex_dev", action: "earned", amount: "+$8.00", color: "text-green" },
  { user: "nina22", action: "withdrew", amount: "$15 Steam", color: "text-purple" },
];

export function LiveTicker() {
  return (
    <div className="ticker-mask overflow-hidden mt-10 max-w-2xl mx-auto">
      <div
        className="flex gap-6 w-max"
        style={{ animation: "scroll-ticker 35s linear infinite" }}
      >
        {/* Render items twice for seamless loop */}
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-1.5 text-sm whitespace-nowrap"
          >
            <span className="text-muted-foreground">{item.user}</span>
            <span className="text-muted-foreground">{item.action}</span>
            <span className={`font-semibold ${item.color}`}>{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Coins } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t relative z-[1]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coins className="h-4 w-4" />
              <span className="font-semibold">CashyLoot</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red/20 bg-red/5 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-red">
              18+
            </span>
          </div>

          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/privacy#do-not-sell" className="hover:text-foreground transition-colors">
              Do Not Sell My Info
            </Link>
          </nav>
        </div>

        <Separator className="my-4" />

        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} CashyLoot. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

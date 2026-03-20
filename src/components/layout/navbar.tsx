"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, CircleDollarSign, LogOut, Bell, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession, signOut } from "@/lib/auth-client";

const signedInLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/offers", label: "Earn" },
  { href: "/withdraw", label: "Rewards" },
  { href: "/referral", label: "Referral" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const isSignedIn = !!session;
  const isRewardsPage = pathname === "/withdraw";
  const navLinks = isSignedIn ? signedInLinks : [];

  const isActive = (href: string) => pathname === href;

  // TODO: Replace with real balance from API
  const balance = 5000;
  const dollars = (balance / 100).toFixed(2);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[rgba(5,5,9,0.95)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={isSignedIn ? "/dashboard" : "/"} className="flex items-center gap-2 font-display font-extrabold text-xl tracking-tight">
          <CircleDollarSign className="h-6 w-6 text-purple" />
          <span className="text-gradient-main">CashyLoot</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-[0.8rem] font-medium transition-colors hover:text-primary ${
                isActive(link.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-2">
          {isSignedIn ? (
            <>
              {/* Balance pill — hidden on rewards page */}
              {!isRewardsPage && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 rounded-full border border-green/20 bg-green/5 px-3 py-1.5 text-sm font-medium text-green transition-colors hover:bg-green/10"
                >
                  <Coins className="h-3.5 w-3.5" />
                  <span>{balance.toLocaleString()} pts</span>
                  <span className="text-green/60">&middot;</span>
                  <span>${dollars}</span>
                </Link>
              )}

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground"
              >
                <Bell className="h-4 w-4" />
                {/* Dot for unread — uncomment when notifications are live */}
                {/* <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-purple" /> */}
              </Button>

              {/* Logout */}
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => signOut().then(() => router.push("/"))}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button variant="outline" className="border-purple/30 text-purple-soft hover:bg-purple/10 hover:border-purple/50 transition-all" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          )}
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="flex flex-col gap-4 mt-8">
              {isSignedIn && (
                <>
                  {/* Mobile balance */}
                  {!isRewardsPage && (
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-xl border border-green/20 bg-green/5 px-4 py-3 text-sm font-medium text-green"
                    >
                      <Coins className="h-4 w-4" />
                      <span>{balance.toLocaleString()} pts &middot; ${dollars}</span>
                    </Link>
                  )}

                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`text-lg font-medium ${
                        isActive(link.href) ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => {
                      signOut();
                      setOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              )}
              {!isSignedIn && (
                <div className="flex flex-col gap-2 mt-4">
                  <Button variant="outline" asChild>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

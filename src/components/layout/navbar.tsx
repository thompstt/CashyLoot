"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession, signOut } from "@/lib/auth-client";

function getNavLinks(isSignedIn: boolean, isHome: boolean) {
  if (isSignedIn) {
    return [
      { href: "/offers", label: "Earn" },
      { href: "/withdraw", label: "Rewards" },
      { href: "/referral", label: "Refer" },
    ];
  }
  // Signed out: anchor to landing page sections
  const prefix = isHome ? "" : "/";
  return [
    { href: `${prefix}#offers`, label: "Earn" },
    { href: `${prefix}#rewards`, label: "Rewards" },
    { href: `${prefix}#referral`, label: "Refer" },
  ];
}

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const isHome = pathname === "/";
  const isSignedIn = !!session;
  const navLinks = getNavLinks(isSignedIn, isHome);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[rgba(5,5,9,0.72)] backdrop-blur-[24px] backdrop-saturate-[180%]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-display font-extrabold text-xl tracking-tight">
          <CircleDollarSign className="h-6 w-6 text-purple" />
          <span className="text-gradient-main">CashyLoot</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const isAnchor = link.href.includes("#");
            const El = isAnchor ? "a" : Link;
            return (
              <El
                key={link.label}
                href={link.href}
                className={`text-[0.8rem] font-medium transition-colors hover:text-primary ${
                  !isAnchor && isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </El>
            );
          })}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button size="sm" className="btn-gradient" asChild>
                <Link href="/withdraw">Withdraw</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button className="btn-gradient" asChild>
                <Link href="/register">Get started</Link>
              </Button>
            </>
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
              {navLinks.map((link) => {
                const isAnchor = link.href.includes("#");
                const El = isAnchor ? "a" : Link;
                return (
                  <El
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`text-lg font-medium ${
                      !isAnchor && isActive(link.href) ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </El>
                );
              })}
              {isSignedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-muted-foreground"
                  >
                    Dashboard
                  </Link>
                  <Button className="btn-gradient" asChild>
                    <Link href="/withdraw" onClick={() => setOpen(false)}>
                      Withdraw
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      signOut();
                      setOpen(false);
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-4">
                  <Button variant="outline" asChild>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button className="btn-gradient" asChild>
                    <Link href="/register" onClick={() => setOpen(false)}>
                      Get started
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

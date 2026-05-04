"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Gamepad2,
  Smartphone,
  PlayCircle,
  ShoppingCart,
  UserPlus,
  LayoutGrid,
  BarChart3,
  Swords,
  ClipboardList,
  ShieldCheck,
  Film,
  CreditCard,
  Gift,
  Clock,
  ArrowUpDown,
  Flame,
  HeartPulse,
  Car,
  Home,
  Briefcase,
  GraduationCap,
  Plane,
  Utensils,
  Baby,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  AyetProfiler,
  AyetSurveysApiResponse,
  AyetSurveyOffer,
} from "@/types/ayet";

type Category =
  | "all"
  | "surveys"
  | "games"
  | "app-installs"
  | "videos"
  | "shopping"
  | "sign-ups";

type SortOption = "highest" | "quickest" | "newest";

const categories: { value: Category; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All", icon: LayoutGrid },
  { value: "surveys", label: "Surveys", icon: MessageSquare },
  { value: "games", label: "Games", icon: Gamepad2 },
  { value: "app-installs", label: "App Installs", icon: Smartphone },
  { value: "videos", label: "Videos", icon: PlayCircle },
  { value: "shopping", label: "Shopping", icon: ShoppingCart },
  { value: "sign-ups", label: "Sign-ups", icon: UserPlus },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "highest", label: "Highest paying" },
  { value: "quickest", label: "Quickest" },
  { value: "newest", label: "Newest" },
];

type Provider = "AdGem" | "Lootably" | "BitLabs" | "ayeT";

const providerStyles: Record<Provider, string> = {
  AdGem: "bg-cyan/10 text-cyan border-cyan/20",
  Lootably: "bg-purple/10 text-purple border-purple/20",
  BitLabs: "bg-green/10 text-green border-green/20",
  ayeT: "bg-amber/10 text-amber border-amber/20",
};

// Maps ayeT category slugs (lowercased) to a lucide icon. Unknown slugs
// fall back to ClipboardList.
const ayetCategoryIcons: Record<string, React.ElementType> = {
  health: HeartPulse,
  "health & medical": HeartPulse,
  shopping: ShoppingCart,
  finance: CreditCard,
  "finance & banking": CreditCard,
  automotive: Car,
  "home & garden": Home,
  work: Briefcase,
  business: Briefcase,
  education: GraduationCap,
  travel: Plane,
  "food & drink": Utensils,
  family: Baby,
  entertainment: Film,
  gaming: Gamepad2,
  technology: Smartphone,
};

interface MockOffer {
  id: number | string;
  title: string;
  description: string;
  category: Category;
  provider: Provider;
  points: number;
  minutes: number;
  icon: React.ElementType;
  iconColor: string;
  featured?: boolean;
  hot?: boolean;
  startUrl?: string;
}

function ayetToMockOffer(o: AyetSurveyOffer): MockOffer {
  const Icon = ayetCategoryIcons[o.iconSlug] ?? ClipboardList;
  return {
    id: o.id,
    title: o.title,
    description: o.description,
    category: "surveys",
    provider: "ayeT",
    points: o.points,
    minutes: o.minutes,
    icon: Icon,
    iconColor: "bg-amber/10 text-amber",
    hot: o.isNew,
    startUrl: o.startUrl,
  };
}

function sortOffersNewest(offers: MockOffer[]): MockOffer[] {
  // "newest" sorts by numeric id desc for mocks; ayeT ids ("ayet-123") sort
  // lexicographically after all numeric ids, which keeps them at the top.
  return [...offers].sort((a, b) => {
    const aStr = String(a.id);
    const bStr = String(b.id);
    if (aStr < bStr) return 1;
    if (aStr > bStr) return -1;
    return 0;
  });
}

const mockOffers: MockOffer[] = [
  {
    id: 1,
    title: "Consumer Habits Survey",
    description: "Share your shopping preferences in a 10-min survey",
    category: "surveys",
    provider: "BitLabs",
    points: 150,
    minutes: 10,
    icon: MessageSquare,
    iconColor: "bg-green/10 text-green",
  },
  {
    id: 2,
    title: "Raid: Shadow Legends",
    description: "Install and reach level 10 within 7 days",
    category: "games",
    provider: "AdGem",
    points: 1200,
    minutes: 10080,
    icon: Swords,
    iconColor: "bg-cyan/10 text-cyan",
    featured: true,
    hot: true,
  },
  {
    id: 3,
    title: "Cashback Shopping Trip",
    description: "Make a purchase through our partner store",
    category: "shopping",
    provider: "Lootably",
    points: 300,
    minutes: 5,
    icon: ShoppingCart,
    iconColor: "bg-purple/10 text-purple",
  },
  {
    id: 4,
    title: "Finance App Install",
    description: "Download and create an account on the app",
    category: "app-installs",
    provider: "AdGem",
    points: 500,
    minutes: 3,
    icon: Smartphone,
    iconColor: "bg-cyan/10 text-cyan",
    hot: true,
  },
  {
    id: 5,
    title: "Watch & Earn",
    description: "Watch short video ads to earn points",
    category: "videos",
    provider: "Lootably",
    points: 25,
    minutes: 2,
    icon: Film,
    iconColor: "bg-purple/10 text-purple",
  },
  {
    id: 6,
    title: "Free Trial Sign-up",
    description: "Sign up for a 7-day free trial of a streaming service",
    category: "sign-ups",
    provider: "AdGem",
    points: 400,
    minutes: 3,
    icon: UserPlus,
    iconColor: "bg-cyan/10 text-cyan",
  },
  {
    id: 7,
    title: "Product Opinion Poll",
    description: "Rate products and share your opinion in 5 minutes",
    category: "surveys",
    provider: "Lootably",
    points: 80,
    minutes: 5,
    icon: ClipboardList,
    iconColor: "bg-purple/10 text-purple",
  },
  {
    id: 8,
    title: "Puzzle Quest Challenge",
    description: "Complete 50 puzzle levels to earn your reward",
    category: "games",
    provider: "BitLabs",
    points: 750,
    minutes: 4320,
    icon: Gamepad2,
    iconColor: "bg-green/10 text-green",
  },
  {
    id: 9,
    title: "Credit Score Check",
    description: "Check your credit score for free — no impact",
    category: "sign-ups",
    provider: "BitLabs",
    points: 350,
    minutes: 3,
    icon: ShieldCheck,
    iconColor: "bg-green/10 text-green",
  },
  {
    id: 10,
    title: "Video Reviews Playlist",
    description: "Watch 5 product review videos",
    category: "videos",
    provider: "AdGem",
    points: 50,
    minutes: 8,
    icon: PlayCircle,
    iconColor: "bg-cyan/10 text-cyan",
  },
  {
    id: 11,
    title: "Grocery Delivery Deal",
    description: "Place your first order with a grocery partner",
    category: "shopping",
    provider: "AdGem",
    points: 600,
    minutes: 5,
    icon: CreditCard,
    iconColor: "bg-cyan/10 text-cyan",
    hot: true,
  },
  {
    id: 12,
    title: "Health & Wellness Survey",
    description: "Answer questions about your health habits",
    category: "surveys",
    provider: "BitLabs",
    points: 200,
    minutes: 12,
    icon: BarChart3,
    iconColor: "bg-green/10 text-green",
  },
  {
    id: 13,
    title: "VPN App Download",
    description: "Install a VPN app and complete setup",
    category: "app-installs",
    provider: "Lootably",
    points: 450,
    minutes: 5,
    icon: Smartphone,
    iconColor: "bg-purple/10 text-purple",
  },
  {
    id: 14,
    title: "Newsletter Sign-up",
    description: "Subscribe to a partner newsletter and confirm email",
    category: "sign-ups",
    provider: "Lootably",
    points: 75,
    minutes: 2,
    icon: Gift,
    iconColor: "bg-purple/10 text-purple",
  },
];

function formatTime(minutes: number): string {
  if (minutes < 60) return `~${minutes} min`;
  if (minutes < 1440) return `~${Math.round(minutes / 60)} hrs`;
  return `~${Math.round(minutes / 1440)} days`;
}

function sortOffers(offers: MockOffer[], sort: SortOption): MockOffer[] {
  switch (sort) {
    case "highest":
      return [...offers].sort((a, b) => b.points - a.points);
    case "quickest":
      return [...offers].sort((a, b) => a.minutes - b.minutes);
    case "newest":
      return sortOffersNewest(offers);
  }
}

export default function OffersPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [activeSort, setActiveSort] = useState<SortOption>("highest");
  const [ayetOffers, setAyetOffers] = useState<AyetSurveyOffer[]>([]);
  const [ayetProfiler, setAyetProfiler] = useState<AyetProfiler | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/surveys/ayet")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: AyetSurveysApiResponse) => {
        if (cancelled || !data.success) return;
        setAyetOffers(data.surveys ?? []);
        setAyetProfiler(data.profiler ?? null);
      })
      .catch(() => {
        // Silent — ayeT being unreachable shouldn't break the page.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allOffers: MockOffer[] = [
    ...ayetOffers.map(ayetToMockOffer),
    ...mockOffers,
  ];

  const filtered =
    activeCategory === "all"
      ? allOffers
      : allOffers.filter((o) => o.category === activeCategory);

  const sorted = sortOffers(filtered, activeSort);

  // Featured offer is always the highest-paying one with featured flag
  const featuredOffer = mockOffers.find((o) => o.featured);
  const regularOffers = sorted.filter((o) => o.id !== featuredOffer?.id);

  const showProfilerPrompt =
    (activeCategory === "all" || activeCategory === "surveys") &&
    ayetProfiler?.missing_profiler === true &&
    ayetOffers.length === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight">
          Earn Points
        </h1>
        <p className="text-muted-foreground mt-2">
          Complete offers from our partner networks to earn points. The more you
          complete, the more you earn.
        </p>
      </div>

      {/* Featured offer */}
      {featuredOffer && activeCategory === "all" && (
        <Card className="mb-8 card-glow group border-amber/20 bg-gradient-to-br from-amber/[0.04] to-transparent overflow-hidden relative">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${featuredOffer.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                <featuredOffer.icon className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber/10 text-amber border border-amber/20 px-2 py-0.5 text-[0.65rem] font-semibold">
                    <Flame className="h-3 w-3" />
                    Featured
                  </span>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold ${providerStyles[featuredOffer.provider]}`}>
                    {featuredOffer.provider}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{featuredOffer.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{featuredOffer.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(featuredOffer.minutes)}
                  </span>
                  <span>·</span>
                  <span>{categories.find((c) => c.value === featuredOffer.category)?.label}</span>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
                <div className="text-right">
                  <p className="offer-reward text-2xl font-bold text-green">+{featuredOffer.points} pts</p>
                  <p className="text-sm text-muted-foreground">${(featuredOffer.points / 100).toFixed(2)}</p>
                </div>
                <Button className="btn-gradient px-6">
                  Start offer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters + sort row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? "btn-gradient"
                    : "border border-input bg-input/30 text-muted-foreground hover:text-foreground hover:bg-input/50"
                }`}
              >
                <cat.icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value as SortOption)}
            className="bg-input/30 border border-input rounded-full px-3 py-1.5 text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-purple/50 cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Profiler prompt — shown when ayeT says we need a survey profile */}
      {showProfilerPrompt && (
        <Card className="mb-6 border-amber/20 bg-gradient-to-br from-amber/[0.04] to-transparent">
          <CardContent className="pt-6 pb-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber/10 text-amber">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Unlock more surveys</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Complete your survey profile to qualify for higher-paying surveys.
              </p>
            </div>
            <Button variant="outline" disabled>
              Coming soon
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Offer Grid */}
      {regularOffers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {regularOffers.map((offer) => {
            const isHighValue = offer.points >= 500;
            return (
              <Card
                key={offer.id}
                className={`card-glow group ${isHighValue ? "border-green/10" : ""}`}
              >
                <CardContent className="pt-5 pb-4">
                  {/* Top row: badges */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="secondary" className="text-xs">
                        {categories.find((c) => c.value === offer.category)?.label}
                      </Badge>
                      {offer.hot && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber/10 text-amber border border-amber/20 px-1.5 py-0.5 text-[0.6rem] font-semibold">
                          <Flame className="h-2.5 w-2.5" />
                          Hot
                        </span>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold ${providerStyles[offer.provider]}`}
                    >
                      {offer.provider}
                    </span>
                  </div>

                  {/* Icon + info */}
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${offer.iconColor} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <offer.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm leading-tight">
                        {offer.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {offer.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom row: points + time + CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="offer-reward text-green font-bold">
                        +{offer.points} pts
                      </span>
                      <span className="text-xs text-muted-foreground ml-1.5">
                        (${(offer.points / 100).toFixed(2)})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTime(offer.minutes)}
                      </span>
                      <Button
                        size="sm"
                        className={`h-7 text-xs ${isHighValue ? "btn-gradient" : ""}`}
                        variant={isHighValue ? "default" : "outline"}
                        onClick={() => {
                          if (offer.startUrl) {
                            window.open(
                              offer.startUrl,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }
                        }}
                      >
                        Start
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center">
          <p className="text-muted-foreground">
            No offers available in this category right now.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Check back soon or try a different category.
          </p>
        </div>
      )}
    </div>
  );
}

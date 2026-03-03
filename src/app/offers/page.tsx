"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Category =
  | "all"
  | "surveys"
  | "games"
  | "app-installs"
  | "videos"
  | "shopping"
  | "sign-ups";

const categories: { value: Category; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All", icon: LayoutGrid },
  { value: "surveys", label: "Surveys", icon: MessageSquare },
  { value: "games", label: "Games", icon: Gamepad2 },
  { value: "app-installs", label: "App Installs", icon: Smartphone },
  { value: "videos", label: "Videos", icon: PlayCircle },
  { value: "shopping", label: "Shopping", icon: ShoppingCart },
  { value: "sign-ups", label: "Sign-ups", icon: UserPlus },
];

type Provider = "AdGem" | "Lootably" | "BitLabs";

const providerStyles: Record<Provider, string> = {
  AdGem: "bg-cyan/10 text-cyan border-cyan/20",
  Lootably: "bg-purple/10 text-purple border-purple/20",
  BitLabs: "bg-green/10 text-green border-green/20",
};

interface MockOffer {
  id: number;
  title: string;
  description: string;
  category: Category;
  provider: Provider;
  points: number;
  icon: React.ElementType;
  iconColor: string;
}

const mockOffers: MockOffer[] = [
  {
    id: 1,
    title: "Consumer Habits Survey",
    description: "Share your shopping preferences in a 10-min survey",
    category: "surveys",
    provider: "BitLabs",
    points: 150,
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
    icon: Swords,
    iconColor: "bg-cyan/10 text-cyan",
  },
  {
    id: 3,
    title: "Cashback Shopping Trip",
    description: "Make a purchase through our partner store",
    category: "shopping",
    provider: "Lootably",
    points: 300,
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
    icon: Smartphone,
    iconColor: "bg-cyan/10 text-cyan",
  },
  {
    id: 5,
    title: "Watch & Earn",
    description: "Watch short video ads to earn points",
    category: "videos",
    provider: "Lootably",
    points: 25,
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
    icon: CreditCard,
    iconColor: "bg-cyan/10 text-cyan",
  },
  {
    id: 12,
    title: "Health & Wellness Survey",
    description: "Answer questions about your health habits",
    category: "surveys",
    provider: "BitLabs",
    points: 200,
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
    icon: Gift,
    iconColor: "bg-purple/10 text-purple",
  },
];

export default function OffersPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filtered =
    activeCategory === "all"
      ? mockOffers
      : mockOffers.filter((o) => o.category === activeCategory);

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

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none">
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

      <p className="text-sm text-muted-foreground mb-6">
        Showing {filtered.length} offer{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Offer Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((offer) => (
            <Card key={offer.id} className="card-glow">
              <CardContent className="pt-5 pb-4">
                {/* Top row: category + provider */}
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {categories.find((c) => c.value === offer.category)?.label}
                  </Badge>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold ${providerStyles[offer.provider]}`}
                  >
                    {offer.provider}
                  </span>
                </div>

                {/* Icon + info */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${offer.iconColor}`}
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

                {/* Bottom row: points + CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-green">
                    +{offer.points} pts
                  </span>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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

import "server-only";
import type { VaultTier } from "@/types/api";

interface PrizeEntry {
  amount: number;
  weight: number;
}

interface VaultConfig {
  cost: number;
  minPrize: number;
  maxPrize: number;
  color: string;
}

const PRIZE_TABLES: Record<VaultTier, PrizeEntry[]> = {
  bronze: [
    { amount: 50, weight: 25 },
    { amount: 60, weight: 20 },
    { amount: 70, weight: 15 },
    { amount: 80, weight: 12 },
    { amount: 90, weight: 8 },
    { amount: 100, weight: 6 },
    { amount: 120, weight: 5 },
    { amount: 150, weight: 4 },
    { amount: 200, weight: 3 },
    { amount: 250, weight: 2 },
  ],
  silver: [
    { amount: 100, weight: 20 },
    { amount: 150, weight: 18 },
    { amount: 200, weight: 14 },
    { amount: 250, weight: 10 },
    { amount: 300, weight: 8 },
    { amount: 350, weight: 7 },
    { amount: 400, weight: 6 },
    { amount: 500, weight: 5 },
    { amount: 600, weight: 4 },
    { amount: 750, weight: 3 },
  ],
  gold: [
    { amount: 150, weight: 18 },
    { amount: 250, weight: 15 },
    { amount: 350, weight: 12 },
    { amount: 400, weight: 10 },
    { amount: 500, weight: 8 },
    { amount: 600, weight: 7 },
    { amount: 700, weight: 6 },
    { amount: 800, weight: 5 },
    { amount: 1000, weight: 4 },
    { amount: 1500, weight: 2 },
  ],
};

const VAULT_CONFIGS: Record<VaultTier, VaultConfig> = {
  bronze: { cost: 100, minPrize: 50, maxPrize: 250, color: "amber" },
  silver: { cost: 300, minPrize: 100, maxPrize: 750, color: "cyan" },
  gold: { cost: 500, minPrize: 150, maxPrize: 1500, color: "purple" },
};

export function rollPrize(tier: VaultTier): number {
  const table = PRIZE_TABLES[tier];
  const totalWeight = table.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const entry of table) {
    roll -= entry.weight;
    if (roll <= 0) return entry.amount;
  }

  return table[table.length - 1].amount;
}

export function getVaultConfig(tier: VaultTier): VaultConfig {
  return VAULT_CONFIGS[tier];
}

export const VALID_TIERS: VaultTier[] = ["bronze", "silver", "gold"];

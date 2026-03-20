"use client";

import { useState, useCallback } from "react";
import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { VaultTier, VaultOpenResponse } from "@/types/api";

interface VaultDef {
  tier: VaultTier;
  label: string;
  cost: number;
  minPrize: number;
  maxPrize: number;
  iconClass: string;
  borderClass: string;
  bgClass: string;
  badgeClass: string;
  buttonClass: string;
}

const VAULTS: VaultDef[] = [
  {
    tier: "bronze",
    label: "Bronze",
    cost: 100,
    minPrize: 50,
    maxPrize: 250,
    iconClass: "text-amber-500",
    borderClass: "border-amber-500/20",
    bgClass: "bg-amber-500/5",
    badgeClass: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/10",
    buttonClass:
      "bg-amber-600 text-white hover:bg-amber-700 disabled:bg-amber-600/40",
  },
  {
    tier: "silver",
    label: "Silver",
    cost: 300,
    minPrize: 100,
    maxPrize: 750,
    iconClass: "text-cyan-500",
    borderClass: "border-cyan-500/20",
    bgClass: "bg-cyan-500/5",
    badgeClass: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/10",
    buttonClass:
      "bg-cyan-600 text-white hover:bg-cyan-700 disabled:bg-cyan-600/40",
  },
  {
    tier: "gold",
    label: "Gold",
    cost: 500,
    minPrize: 150,
    maxPrize: 1500,
    iconClass: "text-purple-500",
    borderClass: "border-purple-500/20",
    bgClass: "bg-purple-500/5",
    badgeClass: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/10",
    buttonClass:
      "bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-600/40",
  },
];

type DialogState =
  | { stage: "idle" }
  | { stage: "opening"; vault: VaultDef }
  | { stage: "result"; vault: VaultDef; prize: number; newBalance: number }
  | { stage: "error"; vault: VaultDef; message: string };

export default function VaultSection({ balance }: { balance: number }) {
  const [localBalance, setLocalBalance] = useState(balance);
  const [dialog, setDialog] = useState<DialogState>({ stage: "idle" });
  const [loading, setLoading] = useState(false);

  const openVault = useCallback(async (vault: VaultDef) => {
    setLoading(true);
    setDialog({ stage: "opening", vault });

    try {
      const res = await fetch("/api/vault/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: vault.tier }),
      });

      const data: VaultOpenResponse = await res.json();

      // Artificial delay so the shimmer feels intentional
      await new Promise((r) => setTimeout(r, 1500));

      if (data.success) {
        setLocalBalance(data.newBalance);
        setDialog({ stage: "result", vault, prize: data.prize, newBalance: data.newBalance });
      } else {
        setDialog({ stage: "error", vault, message: data.error ?? "Something went wrong" });
      }
    } catch {
      setDialog({ stage: "error", vault, message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }, []);

  const closeDialog = () => setDialog({ stage: "idle" });

  const activeVault = dialog.stage !== "idle" ? dialog.vault : null;

  return (
    <div>
      <div className="grid sm:grid-cols-3 gap-4">
        {VAULTS.map((vault) => (
          <Card
            key={vault.tier}
            className={`${vault.borderClass} ${vault.bgClass}`}
          >
            <CardContent className="flex flex-col items-center gap-3 py-5">
              <Lock className={`h-8 w-8 ${vault.iconClass}`} />
              <p className="font-display font-semibold text-lg">{vault.label} Vault</p>
              <Badge className={vault.badgeClass}>{vault.cost} pts</Badge>
              <p className="text-xs text-muted-foreground">
                Win {vault.minPrize}–{vault.maxPrize} pts
              </p>
              <Button
                className={vault.buttonClass}
                disabled={localBalance < vault.cost || loading}
                onClick={() => openVault(vault)}
              >
                Open Vault
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialog.stage !== "idle"} onOpenChange={(open) => { if (!open && !loading) closeDialog(); }}>
        <DialogContent showCloseButton={!loading}>
          {dialog.stage === "opening" && activeVault && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="relative">
                <Lock className={`h-16 w-16 ${activeVault.iconClass} animate-pulse`} />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent animate-pulse" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-center">Opening {activeVault.label} Vault...</DialogTitle>
                <DialogDescription className="text-center">
                  Cracking the lock...
                </DialogDescription>
              </DialogHeader>
            </div>
          )}

          {dialog.stage === "result" && activeVault && (
            <div className="flex flex-col items-center gap-4 py-6">
              <Lock className={`h-16 w-16 ${activeVault.iconClass}`} />
              <DialogHeader>
                <DialogTitle className="text-center">
                  You won{" "}
                  <span className="text-green-500">{dialog.prize} points</span>!
                </DialogTitle>
                <DialogDescription className="text-center">
                  Cost: {activeVault.cost} pts &middot; Net:{" "}
                  {dialog.prize - activeVault.cost >= 0 ? "+" : ""}
                  {dialog.prize - activeVault.cost} pts
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                New balance: <span className="font-semibold text-foreground">{dialog.newBalance} pts</span>
              </p>
              <DialogFooter>
                <Button onClick={closeDialog}>Nice!</Button>
              </DialogFooter>
            </div>
          )}

          {dialog.stage === "error" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <DialogHeader>
                <DialogTitle className="text-center">Oops</DialogTitle>
                <DialogDescription className="text-center">
                  {dialog.message}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// API contract types — shared between Person A (backend) and Person B (frontend)
// See SPLIT.md for the full API contract specification

// GET /api/user/balance
export interface BalanceResponse {
  points: number;
  dollars: string; // Formatted: "$4.25"
}

// GET /api/user/transactions?page=1&limit=20
export interface TransactionsResponse {
  transactions: TransactionItem[];
  total: number;
}

export interface TransactionItem {
  id: string;
  type: "earn" | "withdraw";
  amount: number; // Points
  provider?: string; // "adgem" | "lootably" | "bitlabs" (for earn type)
  campaignId?: string;
  status: string;
  createdAt: string; // ISO 8601
}

// GET /api/user/offerwall-urls
export interface OfferwallUrlsResponse {
  adgem: string | null;
  lootably: string | null;
  bitlabs: string | null;
}

// POST /api/withdraw
export interface WithdrawRequest {
  method: "paypal" | "gift_card";
  amount_points: number;
  paypal_email?: string;
  gift_card_type?: string; // "amazon" | "visa" | "steam" etc.
}

export interface WithdrawResponse {
  success: boolean;
  withdrawal_id: string;
  status: string;
}

// Postback data (server-side, parsed from provider callbacks)
export interface PostbackData {
  provider: "adgem" | "lootably" | "bitlabs";
  playerId: string;
  amount: number; // Points to credit
  requestId: string; // For deduplication
  campaignId?: string;
  campaignName?: string;
  payout?: number; // Publisher revenue (USD)
  rawPayload: string;
}

// Payout result (from Tremendous/PayPal)
export interface PayoutResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

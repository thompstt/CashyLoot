# CashyLoot: Two-Person Build Split

## Principle
Minimize file conflicts by giving each person **exclusive ownership of directories**. The contract between them is the API — agree on request/response shapes on Day 1 and work independently.

---

## Person A: Backend — API Routes, Integrations, Data Layer

### Owns
```
src/lib/                    # All shared logic
  ├── providers/            # Offerwall abstraction + all 3 implementations
  │   ├── interface.ts
  │   ├── registry.ts
  │   ├── adgem.ts
  │   ├── lootably.ts
  │   └── bitlabs.ts
  ├── payouts/              # Payout abstraction + Tremendous + PayPal
  │   ├── interface.ts
  │   ├── tremendous.ts
  │   └── paypal.ts
  ├── fraud/                # Rate limiter, dedup, fingerprinting
  │   ├── rate-limiter.ts
  │   ├── dedup.ts
  │   └── fingerprint.ts
  ├── db.ts                 # Database connection
  └── auth.ts               # Better Auth configuration
src/app/api/                # All API routes
  ├── postback/
  │   ├── adgem/route.ts
  │   ├── lootably/route.ts
  │   └── bitlabs/route.ts
  ├── auth/[...all]/route.ts
  ├── user/
  │   ├── balance/route.ts
  │   ├── transactions/route.ts
  │   └── offerwall-urls/route.ts
  └── withdraw/route.ts
src/types/                  # Shared TypeScript types
prisma/schema.prisma        # Database schema (Person A owns, Person B reviews)
```

### Phase-by-Phase Work

#### Phase 0
- No backend work (Person B handles site shell + deploy)

#### Phase 1: Foundation
- Design and create Prisma schema (users, transactions, withdrawals, postback_logs, fraud_events)
- Run initial migration
- Set up `db.ts` database connection
- Configure Better Auth (`auth.ts` + `/api/auth/` route)
- Create shared types in `src/types/` (User, Transaction, PostbackData, PayoutResult, etc.)
- Build fraud utilities: rate limiter, dedup checker, device fingerprint logger
- **Deliver to Person B:** Auth config ready to consume, API types for frontend

#### Phase 2: Offerwall Integration
- Build `OfferwallProvider` interface and provider registry
- Implement AdGem provider (iframe URL generation, postback parsing, Hashing v2, IP whitelist, request_id dedup)
- Implement Lootably provider (iframe URL, postback parsing, hash verification, dedup)
- Implement BitLabs provider (JS embed URL, postback parsing, hash verification, dedup)
- Build all 3 postback API routes (`/api/postback/adgem`, `/lootably`, `/bitlabs`)
- Build `/api/user/offerwall-urls` endpoint (returns iframe URLs per provider for current user)
- Build point crediting logic (postback → validate → credit user balance → log)
- Test all postback handlers with curl simulating provider callbacks
- **Deliver to Person B:** Offerwall URL endpoint ready, postback handlers live

#### Phase 3: Payouts
- Build `PayoutProvider` interface
- Integrate Tremendous API (build against sandbox at `testflight.tremendous.com`)
- Integrate PayPal Payouts API (build against sandbox at `api-m.sandbox.paypal.com`)
- Build `/api/withdraw` endpoint (validate balance, check W-9 status, process payout)
- Build `/api/user/transactions` endpoint (earn + withdraw history)
- Build `/api/user/balance` endpoint
- **Deliver to Person B:** Withdraw API contract ready, balance/transactions endpoints ready

#### Phase 4: Production
- Switch Tremendous from sandbox to production keys
- Switch PayPal from sandbox to production keys
- Register postback URLs with each approved provider
- Test postback handlers with live provider test tools
- Verify end-to-end: offer completion → postback → point credit → balance update

---

## Person B: Frontend — UI Pages, Components, Infrastructure

### Owns
```
src/app/
  ├── page.tsx              # Landing/home page
  ├── layout.tsx            # Root layout
  ├── (auth)/               # Login, register, forgot password
  ├── dashboard/            # Dashboard page
  ├── offers/               # Offers page (iframe embeds, tabs)
  ├── withdraw/             # Withdrawal page
  ├── privacy/              # Privacy Policy page
  └── terms/                # Terms of Service page
src/components/             # All reusable UI components
  ├── layout/               # Navbar, footer, sidebar
  ├── auth/                 # Login form, register form, Turnstile widget
  ├── dashboard/            # Balance card, transaction list, activity feed
  ├── offers/               # Provider tabs, iframe container
  ├── withdraw/             # Gift card selector, PayPal form, W-9 gate
  └── shared/               # Buttons, modals, cookie banner, loading states
public/                     # Static assets (logo, images, favicon)
amplify.yml                 # Amplify build configuration
next.config.js              # Next.js configuration
tailwind.config.js          # Tailwind configuration
package.json                # Dependencies
```

### Phase-by-Phase Work

#### Phase 0B: Site Shell + Deploy
- Initialize Next.js project with TypeScript + Tailwind
- Build landing page (what the site is, how it works, call to action)
- Build layout (navbar, footer, responsive)
- Add Privacy Policy and Terms of Service pages
- Add placeholder pages (offers, dashboard, withdraw — "Coming Soon" or login-gated)
- Configure `amplify.yml` build spec
- Create Amplify app, connect Git repo, connect custom domain
- Deploy to Amplify — verify live at `https://yourdomain.com`
- **After deploy:** Person A or B submits all provider applications (needs live URL)

#### Phase 1: Auth + Dashboard + Anti-Fraud UI
- Build auth pages (login, register, forgot password) consuming Person A's Better Auth config
- Add Cloudflare Turnstile widget to registration form
- Add age verification (date of birth field, 18+ enforcement)
- Build dashboard page:
  - Balance display: `425 Points ($4.25)`
  - Recent activity feed (placeholder data until API ready, then wire up)
- Cookie consent banner with "Do Not Sell or Share" opt-out
- Upgrade layout from Phase 0 shell to full polished UI
- **Blocked on from Person A:** Auth config, shared types

#### Phase 2: Offers Page
- Build offers page with tabbed provider display (AdGem, Lootably, BitLabs tabs)
- Each tab loads an iframe with the provider's offerwall URL (fetched from Person A's `/api/user/offerwall-urls`)
- Handle loading states, error states, provider-unavailable states
- Show only approved/enabled providers (provider registry drives this)
- **Blocked on from Person A:** `/api/user/offerwall-urls` endpoint

#### Phase 3: Withdraw Page
- Build withdrawal page:
  - Gift card selection (grid of options: Amazon, Visa, Steam, etc.)
  - PayPal cash out form (enter PayPal email, $5 minimum)
  - Balance display + conversion (points → dollar equivalent)
  - W-9 collection gate (block payout if threshold exceeded without W-9)
- Add withdrawal history to dashboard (consuming Person A's `/api/user/transactions`)
- **Blocked on from Person A:** `/api/withdraw` endpoint, `/api/user/transactions` endpoint

#### Phase 4: Infrastructure + Production
- Provision RDS PostgreSQL (db.t4g.micro, VPC, security group)
- Configure AWS SES production (verify domain, confirm sandbox removal)
- Configure Amplify environment variables (all API keys, DB connection string, secrets)
- Set up CloudWatch alarms (5xx rates, postback failures, auth errors)
- Set up EventBridge Scheduler rule (rate 5 min) to keep Lambda warm ($0/month)
- Enable Amplify WAF with rate-based rules and managed rule groups
- Smoke test full user flow end-to-end

---

## Shared / Coordination

### Files Both Touch (Minimize)
| File | Owner | Other Person |
|------|-------|-------------|
| `prisma/schema.prisma` | Person A | Person B reviews, requests changes |
| `src/types/` | Person A creates core types | Person B may add UI-specific types |
| `package.json` | Both add dependencies | Coordinate before adding to avoid conflicts |
| `.env.local` | Both add their own vars | Use separate prefixes or coordinate |

### Day 1 Kickoff (Do Together)
1. Person A creates the repo, initializes Next.js (or Person B does in Phase 0B)
2. Agree on Prisma schema — all table names, column names, relationships
3. Person A writes `src/types/` with all shared interfaces:
   - `User`, `Transaction`, `Withdrawal`, `PostbackData`
   - `OfferwallProvider`, `PayoutProvider`, `PayoutResult`
   - API response shapes: `BalanceResponse`, `TransactionsResponse`, `WithdrawRequest`, `WithdrawResponse`, `OfferwallUrlsResponse`
4. Agree on API route contracts:

```typescript
// GET /api/user/balance
// → { points: number, dollars: string }

// GET /api/user/transactions?page=1&limit=20
// → { transactions: Transaction[], total: number }

// GET /api/user/offerwall-urls
// → { adgem: string | null, lootably: string | null, bitlabs: string | null }

// POST /api/withdraw
// body: { method: "paypal" | "gift_card", amount_points: number, paypal_email?: string, gift_card_type?: string }
// → { success: boolean, withdrawal_id: string, status: string }

// GET /api/postback/adgem?player_id=...&amount=...&verifier=...
// → 200 OK (server-to-server, no frontend involvement)
```

5. Both commit this contract to `src/types/api.ts` — this is the handshake

### Ongoing Sync Points
| When | What | Who Initiates |
|------|------|---------------|
| Person A finishes auth config | Notify Person B: "Auth is ready, here's how to use it" | Person A |
| Person A finishes offerwall URLs endpoint | Notify Person B: "Offers API is live, here's the response shape" | Person A |
| Person A finishes withdraw endpoint | Notify Person B: "Withdraw API is live, here's the contract" | Person A |
| Person B needs a schema change | Request via PR or message, Person A implements | Person B |
| Either person adds a dependency | Message the other before `npm install` | Either |
| Phase 4 deploy | Do together — env vars, RDS, postback URLs all need to line up | Both |

### Git Workflow
- `main` — production (Amplify auto-deploys)
- `dev` — integration branch (both merge here, test together)
- `person-a/*` — Person A's feature branches
- `person-b/*` — Person B's feature branches
- Merge to `dev` frequently (at least daily) to catch integration issues early
- Merge `dev` → `main` only after both test the integrated result

---

## Timeline Overview

```
Week 1:
  Person B: Phase 0B (site shell + deploy + submit applications)
  Person A: Phase 1 (schema, auth, fraud, types)
  Together: Day 1 kickoff (schema + API contracts)

Week 2:
  Person A: Phase 2 (all 3 provider integrations + postback handlers)
  Person B: Phase 1 (auth pages, dashboard, anti-fraud UI)

Week 3:
  Person A: Phase 3 (payout integrations against sandboxes)
  Person B: Phase 2 (offers page) + Phase 3 (withdraw page)

Week 4:
  Both: Phase 4 (production deploy, provider credentials, end-to-end testing)

Background: Provider approvals processing throughout weeks 1-3
```

---

## Workload Balance

| Area | Person A | Person B |
|------|----------|----------|
| Complex logic | Postback validation, hash verification, payout processing, fraud detection | — |
| UI surface area | — | 6+ pages, many components, responsive design |
| Integrations | 5 external APIs (3 offerwalls + 2 payout providers) | 1 external API (Cloudflare Turnstile) |
| Infrastructure | — | RDS, SES, Amplify, CloudWatch, WAF |
| Files owned | ~20 files | ~30+ files |
| Estimated effort | ~50% | ~50% |

Person A has deeper complexity per file. Person B has more files and broader surface area plus all infra. Roughly balanced.

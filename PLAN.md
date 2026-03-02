# CashyLoot: Pay-for-Action Rewards Website — Research & Decision Brief

## Context
Building a rewards/GPT (get-paid-to) website similar to Swagbucks and GemsLoot, using AdGem, Lootably, and BitLabs as offerwall providers, hosted on AWS Amplify with Route 53 for DNS. The project directory is currently empty — this is a greenfield build.

---

## Decisions Made

### 1. Tech Stack (Decided)

| Layer | Choice | Why |
|-------|--------|-----|
| **Frontend + Backend** | Next.js (App Router) | SSR + API routes in one project |
| **Database** | PostgreSQL via AWS RDS | Financial transaction integrity; same AWS account; IAM Compute Roles |
| **ORM** | Prisma | Auto-generated TypeScript types; visual schema language; large community |
| **Auth** | Better Auth | Type-safe, App Router native, actively developed successor to NextAuth/Auth.js |
| **Hosting** | AWS Amplify | Managed CI/CD, auto CloudFront/SSL, git-push deploys, WAF support |
| **DNS** | Route 53 | First-class Amplify integration, auto CNAME setup |
| **Offerwalls** | AdGem + Lootably + BitLabs | Three providers from launch to de-risk revenue |
| **Payouts** | Tremendous (primary) + PayPal | Tremendous: $0 fees for gift cards; PayPal: direct cash |
| **Currency** | Points (100 = $1.00) | Transparent; users see points + dollar equivalent; easy conversion |
| **CAPTCHA** | Cloudflare Turnstile | Free, unlimited, frictionless (no puzzles), privacy-focused |
| **Email** | AWS SES | Same AWS ecosystem; cheapest at scale; 62,000 free emails/month from Lambda |

### 2. Offerwall Providers (Decided)
**Three providers from launch to de-risk revenue and maximize offer availability:**

| Provider | Trustpilot | Strength | Integration |
|----------|-----------|----------|-------------|
| **AdGem** | 2.9/5 (767 reviews) | CPI/CPA offers, web iframe | Web Offer Wall (iframe/redirect) |
| **Lootably** | 4.3/5 (19,842 reviews) | Broad task variety, shopping, surveys, video | Web iframe, Freecash partner network |
| **BitLabs** | Mixed (BitBurst GmbH) | Survey-focused, higher eCPM, 70+ countries | JS embed, Survey API, Static Offer API |

**Why three providers:**
- AdGem alone is a single point of failure with the worst trust signals of the three
- Lootably has the strongest user trust (4.3/5 with 20K reviews)
- BitLabs adds dedicated survey monetization with strong international coverage
- Multiple walls give users more earning options, increasing engagement and retention
- If one provider flags/suspends your account, revenue continues from the others

**Future expansion candidates:** AdGate Media (Prodege-backed), Torox/OfferToro (volume), CPX Research (surveys), AyeT Studios (emerging markets)

### 3. User Payout Methods (Decided)
- **Tremendous** (primary — free platform, 1,000+ redemption options including gift cards + PayPal + bank transfer)
- **PayPal** (via Payouts API — most recognized, but $0.25/tx fee)
- **Gift cards** (via Tremendous API — Amazon, Steam, Visa, etc. — $0 platform fee)

### 4. Minimum User Payout Threshold (Decided)

| Method | Minimum | Fee Impact | Competitive Context |
|--------|---------|-----------|-------------------|
| **Gift cards** (via Tremendous) | $1.00 | 0% fee | Attracts users, no fee overhead |
| **PayPal** | $5.00 | 5% fee ($0.25 on $5) | Freecash: $2, Swagbucks: $25 |

Lower gift card minimums attract users while keeping PayPal minimums high enough to absorb transaction fees.

### 5. AWS Amplify Architecture (Decided)

**What Amplify handles automatically:**

| Concern | Amplify Manages It? | Notes |
|---------|---------------------|-------|
| **CloudFront CDN** | Yes — auto-provisioned | No manual setup; limited customization of behaviors/origins |
| **SSL/HTTPS** | Yes — ACM cert auto-provisioned | Renews automatically every 13 months |
| **Static asset hosting** | Yes — S3 auto-provisioned | Part of the managed infrastructure |
| **SSR compute** | Yes — Lambda under the hood | Cold starts of 3-12 seconds on idle functions |
| **CI/CD** | Yes — git push auto-deploys | Branch-to-environment mapping, PR previews |
| **Custom domain (Route 53)** | Yes — auto CNAME creation | Same-account Route 53 is one-click setup |
| **WAF** | Yes — GA as of March 2025 | $15/month per app + standard WAF charges |

**What you still provision separately:**

| Service | Purpose | Required? |
|---------|---------|-----------|
| **Route 53** | DNS hosted zone | Yes |
| **RDS PostgreSQL** | Database | Yes — Amplify does not include a database |
| **AWS SES** | Transactional email | Yes — request production access early (sandbox by default) |
| **CloudWatch** | Monitoring & logging | Yes (comes with your AWS account) |

**Architecture diagram:**
```
User → Route 53 → Amplify (managed CloudFront + SSL)
                      ├── Static assets (managed S3)
                      └── SSR + API routes (managed Lambda)
                              ↓
                        RDS PostgreSQL (db.t4g.micro)
                              ↓
AdGem postback    ─┐
Lootably postback  ├→ Amplify SSR → /api/postback/{provider} → PostgreSQL
BitLabs postback  ─┘
```

**Deployment flow:**
```bash
git push origin main → Amplify auto-builds → deploys to production
git push origin staging → Amplify auto-builds → deploys to staging URL
PR opened → Amplify builds preview → ephemeral URL (e.g., pr-42.yourdomain.com)
```

**Amplify environment variables:**
- `NEXT_PUBLIC_` prefixed vars are injected at build time into the frontend bundle
- Server-side secrets (DB passwords, API keys) must be written to `.env.production` in `amplify.yml` build spec or stored in AWS Systems Manager Parameter Store
- IAM Compute Roles (Feb 2025) allow SSR Lambda to access RDS directly without embedding credentials

**Amplify pricing (estimated):**

| Traffic Level | Monthly Cost |
|--------------|-------------|
| Low (~50K requests/month) | $0-5 (within free tier) |
| Moderate (~5M requests/month) | $12-30 |
| + WAF | +$15/month per app + WAF charges |

**Amplify limitations to be aware of:**

| Limitation | Impact on This Project |
|-----------|----------------------|
| **Cold starts (3-12 sec)** | First request after idle is slow. Mitigate with periodic health-check pings. Postback endpoints are fine (server-to-server, latency tolerant). |
| **No on-demand ISR** | `revalidatePath()`/`revalidateTag()` not supported. Not an issue — our pages are user-specific (dashboard, balance), not cached static pages. Time-based ISR works fine. |
| **No Edge Runtime** | `export const runtime = 'edge'` not supported. Not needed — all our API routes use Node.js runtime. |
| **No streaming** | HTTP streaming responses not supported. Not needed for this project. |
| **50 MB SSR package limit** | Must keep server bundle lean. Monitor dependency size. |
| **No `output: standalone`** | Must use default `.next` output. This is the default anyway. |
| **Limited CloudFront control** | Cannot add custom CloudFront behaviors. Not needed. |
| **Node.js 20/22 only** | Node.js 18 and below blocked since Sept 2025. Use Node.js 22. |

### 6. Legal / Business Structure (Decided)
- **LLC is required before launch** — needed for AdGem/Lootably/BitLabs publisher accounts, PayPal Business account, and 1099 issuance
- **EIN (Employer Identification Number)** — free, instant from IRS, required for business bank account and tax filings
- **Business bank account** — required for PayPal Business, separates personal/business liability
- **Privacy Policy & Terms of Service** — legally required before collecting user data. Use Termly or TermsFeed, or consult a lawyer.
- **Age restriction** — restrict to 18+ (simplest COPPA compliance path; avoids needing parental consent mechanisms)
- **Geographic scope** — US initially; expanding internationally adds GDPR, additional state privacy laws, and currency conversion complexity

### 7. Tax Reporting (Decided)
Updated thresholds per the One Big Beautiful Bill Act (signed July 2025):

| Form | 2025 Tax Year | 2026 Tax Year | Who Issues |
|------|--------------|--------------|-----------|
| **1099-MISC** | $600/user/year | **$2,000/user/year** (inflation-adjusted from 2027) | You, to users |
| **1099-K** | $20,000 + 200 txns | Same | PayPal/Tremendous, to users |

**Action items:**
- Collect **W-9 forms** from US users before their first payout exceeding the threshold
- Issue **1099-MISC** by January 31 of the following year for qualifying payouts
- Gift cards to major retailers (Amazon, Visa) count as taxable income
- Consider integrating a tax compliance service (e.g., Tax1099.com API) once user volume justifies it

### 8. Database Hosting (Decided)
- **AWS RDS PostgreSQL** — db.t4g.micro instance for launch (~$15-30/month)
- Same AWS account as Amplify; IAM Compute Roles allow credential-free access from SSR Lambda
- Managed backups, Multi-AZ failover available for production hardening
- Requires VPC networking setup and security group allowing Amplify Lambda access

### 9. Virtual Currency (Decided)
- **Points with dollar display** — 100 points = $1.00
- Display format: `425 Points ($4.25)`
- Offer completion display: `+50 Points`
- Withdrawal display: `$5.00 Amazon Gift Card — Cost: 500 Points`
- Points are stored as integers in the database (avoids floating-point issues)
- Points are **non-transferable** between users (avoids money transmitter law triggers)

### 10. ORM (Decided)
- **Prisma** — schema defined in `prisma/schema.prisma`, auto-generated TypeScript types
- Prisma Studio available for data browsing during development
- Built-in migrations for schema changes
- **Bundle size warning:** Prisma's Rust query engine adds ~15-20 MB to the bundle. With Amplify's 50 MB SSR limit, monitor total bundle size. Fallback options if needed: Prisma `--no-engine` mode with Prisma Accelerate, or switching to Drizzle ORM.

### 11. CAPTCHA (Decided)
- **Cloudflare Turnstile** — free, unlimited, no visual puzzles in most cases
- Requires a free Cloudflare account to obtain site key and secret key
- Invisible verification for most users — minimal registration friction
- Server-side validation via Turnstile's siteverify API endpoint

### 12. Email (Decided)
- **AWS SES** — transactional email (verification, payout notifications, password reset)
- 62,000 free emails/month when sending from Lambda
- Then $0.10 per 1,000 emails
- **Requires production access approval** — sandbox mode only allows sending to verified email addresses. Request production access in Phase 0 (takes 1-2 days).
- IAM-based auth (no API keys needed) via `@aws-sdk/client-ses`
- Build email templates in code (no built-in template UI)

---

## Key Limitations & Risks

### Provider-Specific Limitations

#### AdGem
| Limitation | Impact |
|-----------|--------|
| **$100 minimum publisher payout** | You need to generate $100+ before you get paid |
| **Net 30 payment terms** | Cash flow delay — you pay users before AdGem pays you |
| **USD only** | International publishers may face conversion fees |
| **Postback requires server-side endpoint** | Must build and host a callback URL that handles GET requests |
| **Player ID format restricted** | Lowercase alphanumeric + hyphens only (no special chars/emojis) |
| **Content restrictions** | No adult, gambling, weapons, alcohol, or misleading content |
| **Fraud monitoring** | Accounts flagged/suspended if click-through or conversion rates exceed industry averages — #1 publisher complaint |
| **SDK discontinuation risk** | Older SDK versions dropped without long notice (Android <v4.0.2 dropped July 2025) |
| **Offer Wall API being phased out** | New publishers pushed to newer "Offer API" with different data model; legacy "Static API" also deprecated in 2025 |
| **API changelog stale since July 2023** | Signals slower active development on publisher API surface |
| **Mixed support quality** | Reports of AI-generated support responses, slow ticket resolution |

#### Lootably
| Limitation | Impact |
|-----------|--------|
| **Part of Freecash ecosystem** | Publisher onboarding may go through Freecash partner portal |
| **Documentation less extensive than AdGem** | May require more support interaction during integration |
| **Net payment terms vary** | Confirm specific payment terms during publisher signup |

#### BitLabs
| Limitation | Impact |
|-----------|--------|
| **Survey-focused** | Offer variety is narrower than AdGem/Lootably (primarily surveys) |
| **German company (BitBurst GmbH)** | Contracts/support may follow EU business hours and GDPR-first approach |
| **Net 30 payment terms** | Same cash flow delay as AdGem |
| **Survey disqualification rates** | Users may get frustrated by survey DQs — BitLabs mitigates this by paying small rewards for DQs |

### Integration Methods

#### AdGem (Web)
- Use the **Web Offer Wall** (embedded iframe/redirect) for launch — the legacy Offer Wall API is being phased out for new publishers
- The newer **Offer API** is available but requires more development effort
- **Postback Hashing v2** is strongly recommended for security (prevents spoofed callbacks)
- Must whitelist AdGem's static IP for postback verification

#### Lootably (Web)
- Web iframe embed similar to AdGem
- Postback URL with server-side validation
- Confirm current integration docs during publisher onboarding

#### BitLabs (Web)
- **JS embed** for quick integration (surveywall widget)
- **User-Based Survey API** for custom UI
- **Static Offer API** for full control
- Postback URL with hash verification
- Developer docs at developer.bitlabs.ai

### Business/Financial Risks
1. **Cash flow gap**: Users complete offers → you credit them immediately → providers pay you Net 30. You need reserves to cover this gap across all three providers.
2. **Fraud from users**: Bots, VPNs, multi-accounting. Need anti-fraud measures from day one (IP tracking, device fingerprinting, rate limiting, CAPTCHA).
3. **Provider fraud flags on your account**: If your traffic looks suspicious to any provider, they can suspend your account. This is the #1 complaint from AdGem publishers. Basic anti-fraud protections at launch protect you from this.
4. **User chargebacks**: If paying via PayPal, users can dispute transactions.
5. **PayPal account limitations**: New accounts sending many small payments trigger fraud flags. Build transaction history gradually. Pre-fund your PayPal balance with 2-4 weeks of expected payouts.
6. **Amplify cold starts**: Lambda-based SSR can produce 3-12 second cold starts on idle functions. Postback endpoints are server-to-server (latency tolerant). For user-facing pages, implement a periodic health-check ping (e.g., cron job or external uptime monitor hitting your homepage every 5 minutes) to keep the function warm.

### Legal/Compliance Risks
- **FTC**: All earnings claims must be truthful and substantiated. Penalties exceed $50,000/violation. Never state specific dollar amounts users can earn without substantiation of typical results. The proposed Earnings Claim Rule is paused but underlying Section 5 authority is fully active. Recent enforcement: $6.7M in refunds for deceptive earnings claims (August 2025).
- **COPPA**: Amended rule effective April 22, 2026. Restrict to 18+ to avoid parental consent requirements entirely. Do not collect data from users under 13 under any circumstance.
- **State money transmitter laws**: Keep points non-transferable between users and pay out through licensed third-party processors (PayPal, Tremendous). Closed-loop rewards + third-party payout = likely exempt in most states (27 states have adopted MTMA with exemptions for closed-loop digital assets).
- **CCPA**: The 100,000 consumer threshold counts every unique California visitor, not just registered users. If you use Google Analytics or any tracking pixel, ~275 California visitors/day hits that threshold in a year. Implement a "Do Not Sell or Share My Personal Information" link and cookie consent banner. New CCPA regulations effective January 2026 add automated decision-making disclosure requirements.
- **State privacy laws**: 19 states now have comprehensive consumer privacy laws as of 2026. Indiana, Kentucky, Rhode Island effective January 1, 2026.
- **FTC Consumer Reviews Rule**: If you incentivize users to leave reviews about your site, you must disclose the incentive. Warning letters sent to 10 companies in December 2025.

---

## Postback Architecture (All Providers)

```
User completes offer → Provider server → GET/POST request to YOUR postback URL
                                          ↓
                                Your server validates:
                                1. IP whitelist check (provider-specific)
                                2. Postback hash/signature verification
                                3. Duplicate check (request_id deduplication)
                                4. Rate limit check
                                5. Process reward (credit user points)
                                6. Log raw payload to postback_logs
                                7. Return HTTP 200
```

### AdGem Postback Macros
- `{player_id}` — your internal user ID
- `{amount}` — reward amount
- `{payout}` — your revenue (decimal USD)
- `{campaign_id}`, `{campaign_name}` — offer details
- `{goal_id}`, `{goal_name}` — for multi-reward tracking
- `{request_id}`, `{verifier}` — for hash validation (Postback Hashing v2)
- `{country}`, `{platform}`, `{ip}` — geo/device info
- `{c1}` through `{c5}` — custom parameters

### BitLabs Postback
- Similar structure with hash verification
- Includes survey-specific fields (survey ID, CPI, LOI)
- Developer docs: developer.bitlabs.ai

### Lootably Postback
- Confirm exact macro format during publisher onboarding
- Standard fields: user ID, amount, offer ID, transaction ID, hash

---

## Project Structure (Planned)
```
AdSite/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Login, register, forgot password
│   │   ├── dashboard/          # User dashboard (points, history)
│   │   ├── offers/             # Offerwall display page (tabbed: all providers)
│   │   ├── withdraw/           # Payout/withdrawal page
│   │   └── api/                # API routes
│   │       ├── postback/
│   │       │   ├── adgem/      # AdGem postback handler
│   │       │   ├── lootably/   # Lootably postback handler
│   │       │   └── bitlabs/    # BitLabs postback handler
│   │       ├── auth/           # Better Auth routes
│   │       ├── user/           # User profile, balance
│   │       └── withdraw/       # Payout processing
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Shared utilities
│   │   ├── db.ts               # Database connection
│   │   ├── providers/          # Offerwall provider abstraction
│   │   │   ├── interface.ts    # Common provider interface
│   │   │   ├── registry.ts     # Provider registry
│   │   │   ├── adgem.ts        # AdGem implementation
│   │   │   ├── lootably.ts     # Lootably implementation
│   │   │   └── bitlabs.ts      # BitLabs implementation
│   │   ├── payouts/            # Payout provider abstraction
│   │   │   ├── interface.ts    # Common payout interface
│   │   │   ├── tremendous.ts   # Tremendous integration
│   │   │   └── paypal.ts       # PayPal Payouts API integration
│   │   ├── fraud/              # Anti-fraud utilities
│   │   │   ├── rate-limiter.ts # Rate limiting
│   │   │   ├── dedup.ts        # Duplicate postback detection
│   │   │   └── fingerprint.ts  # Device/IP fingerprinting
│   │   └── auth.ts             # Better Auth configuration
│   └── types/                  # TypeScript types
├── prisma/
│   └── schema.prisma           # Database schema
├── public/                     # Static assets
├── amplify.yml                 # Amplify build configuration
├── .env.local                  # Local environment variables
├── next.config.js
├── package.json
└── tailwind.config.js
```

### Database Schema (Core Tables)
- **users** — id, email, password_hash, username, balance (points), created_at, status, date_of_birth, ip_address, device_fingerprint
- **transactions** — id, user_id, type (earn/withdraw), amount, provider (adgem/lootably/bitlabs), campaign_id, status, created_at
- **withdrawals** — id, user_id, method (paypal/gift_card), amount_points, amount_usd, paypal_email, status, processed_at, payout_provider (tremendous/paypal)
- **postback_logs** — id, raw_payload, provider, player_id, request_id (for dedup), verified, processed, ip_address, created_at (audit trail)
- **fraud_events** — id, user_id, event_type, details, created_at (tracks suspicious activity)

### Provider Abstraction Pattern
```typescript
// lib/providers/interface.ts
interface OfferwallProvider {
  name: string;
  validatePostback(req: Request): Promise<boolean>;
  parsePostback(req: Request): Promise<PostbackData>;
  getOfferwallUrl(userId: string): string;
  getWhitelistedIPs(): string[];
}

// lib/providers/adgem.ts     — implements interface for AdGem
// lib/providers/lootably.ts  — implements interface for Lootably
// lib/providers/bitlabs.ts   — implements interface for BitLabs
```

### Payout Abstraction Pattern
```typescript
// lib/payouts/interface.ts
interface PayoutProvider {
  name: string;
  sendPayout(userId: string, amount: number, recipient: PayoutRecipient): Promise<PayoutResult>;
  getAvailableMethods(): PayoutMethod[];
  getMinimumAmount(): number;
  getFeeForAmount(amount: number): number;
}

// lib/payouts/tremendous.ts — gift cards + cash via Tremendous API
// lib/payouts/paypal.ts     — direct PayPal via Payouts API
```

This pattern means adding a new provider (offerwall or payout) is just:
1. Create a new file implementing the interface
2. Register it in the provider registry
3. Add a new postback API route (offerwalls) or payout option (payouts)

---

## Implementation Plan (Phases)

### Phase 0: Business Setup + Deployable Shell (Enables Provider Applications)
> **Goal:** Get the business entity formed, build a presentable live site, deploy it, and submit all provider applications. Offerwall providers require a live URL to review — this phase gives them one. Provider approvals run in the background while you build Phases 1-3.

#### 0A. Business & Legal Foundation
1. Form LLC and obtain EIN from IRS (free, online, immediate)
2. Open dedicated business bank account
3. Acquire domain and configure Route 53 hosted zone
4. Generate Privacy Policy and Terms of Service (Termly or TermsFeed)
5. Create free Cloudflare account and generate Turnstile site key + secret key
6. Request AWS SES production access (sandbox removal takes 1-2 days)

#### 0B. Build Deployable Site Shell
> A real, live site that provider reviewers will see when evaluating your application.

7. Initialize Next.js project with TypeScript + Tailwind
8. Build landing/home page explaining what the site is (earn rewards by completing offers, surveys, etc.)
9. Build basic layout (navbar, footer, responsive design)
10. Add Privacy Policy and Terms of Service pages (content from step 4)
11. Add placeholder pages: offers, dashboard, withdraw (can show "Coming Soon" or require login)
12. Configure `amplify.yml` build spec
13. Create Amplify app in AWS console, connect Git repo, connect custom domain
14. Deploy to Amplify — verify live at `https://yourdomain.com` with HTTPS working

#### 0C. Submit All Provider Applications
> Submit these **after** the site is live so reviewers can see a real URL.

15. **AdGem** — Register at `dashboard.adgem.com/register`, add your domain as a property. Approval is manual and discretionary. You'll be assigned a Publisher Support Advocate — follow up with them directly. No sandbox exists; offers won't serve until they manually enable your property. *(Timeline: multiple business days, unspecified)*
16. **Lootably** — Submit application at their signup page, then **proactively email `publishers@lootably.com`** to alert them. This is not a queue-based system — if you don't follow up, your application may sit. No sandbox; credentials come only from approved dashboard. *(Timeline: multiple business days, unspecified)*
17. **BitLabs** — Register at `dashboard.bitlabs.ai`, create a Company Workspace. Workspace must pass "verification" — they evaluate site quality, traffic, and audience fit for surveys. **Riskiest approval: may reject new/low-traffic sites, and denied applications have no standard reapplication path.** Contact `partnerships@bitlabs.ai` proactively if needed. *(Timeline: up to 3 business days)*
18. **PayPal** — Create PayPal Business account (requires verified email, phone, linked bank account, completed Business Identity profile). Then separately request Payouts API access via dashboard (Pay & Get Paid → Make Payments → Payouts). **Sandbox and production approvals are independent** — sandbox works immediately, but production Payouts must be separately approved. *(Timeline: instant to 72+ hours; longer for new accounts with no transaction history)*
19. **Tremendous** — Sign up at `tremendous.com` (sandbox is instant, no approval needed). For production: go to Team Settings → Developers → "Request production API access". Must submit KYC document (W-9 is easiest for US companies). Crypto/gambling businesses are prohibited. *(Timeline: 1-2 business days, up to 1 week if follow-up needed)*

#### 0D. Begin Development with Sandboxes
> While waiting for offerwall approvals, you can build and test against available sandboxes.

- **Tremendous sandbox**: Available immediately — build and test full payout integration at `https://testflight.tremendous.com`
- **PayPal sandbox**: Available immediately at `developer.paypal.com` — build and test full Payouts API flow
- **Offerwall postback handlers**: Build against documented API structures, test with manual curl/HTTP requests simulating postback callbacks (no sandbox available from any of the three providers)

### Phase 1: Foundation + Core Anti-Fraud
> **Goal:** Full working app with auth, dashboard, and fraud protections. Built while waiting for offerwall approvals.

1. Set up Prisma + PostgreSQL schema (including fraud_events table)
2. Implement Better Auth (email/password registration + login)
3. Upgrade landing page and layout from Phase 0 shell into full UI
4. Create user dashboard page (shows balance in points + dollar equivalent, recent activity)
5. Implement core anti-fraud:
   - Rate limiting on all API endpoints
   - Cloudflare Turnstile on registration (invisible verification, server-side validation via siteverify API)
   - IP logging and basic device fingerprinting on registration
   - Age verification (date of birth field, 18+ enforcement)
6. Cookie consent banner with "Do Not Sell or Share" opt-out link
7. Deploy updated site to Amplify (continuous — every git push auto-deploys)

### Phase 2: Offerwall Integration (All Three Providers)
> **Goal:** Users can complete offers from AdGem, Lootably, and BitLabs and earn points. Build postback handlers immediately (testable via curl); wire up real provider credentials as approvals come in.

8. Build provider abstraction interface (`OfferwallProvider`)
9. Build provider registry with enable/disable per provider
10. Implement AdGem provider:
    - Web Offer Wall URL generation (iframe embed)
    - Postback parsing with Hashing v2 verification
    - IP whitelist validation
    - `request_id` deduplication
11. Implement Lootably provider:
    - Web iframe integration
    - Postback parsing with hash verification
    - Deduplication
12. Implement BitLabs provider:
    - JS embed / Survey API integration
    - Postback parsing with hash verification
    - Deduplication
13. Create unified offers page with tabbed/sectioned provider display
14. Wire up point crediting on successful postback (all providers)
15. Build postback logging and monitoring (all raw payloads to postback_logs)
16. As each provider approves: plug in real credentials, register postback URLs, test with live offers

### Phase 3: Payouts
> **Goal:** Users can withdraw earnings via gift cards or PayPal. Tremendous and PayPal sandboxes are available from Phase 0D — build against those, switch to production keys once approved.

17. Build payout abstraction interface (`PayoutProvider`)
18. Integrate Tremendous API (gift cards + cash options) — build against sandbox, switch to production after KYC approval
19. Integrate PayPal Payouts API — build against sandbox, switch to production after Payouts API approval
20. Build withdrawal page:
    - Gift card selection (Amazon, Visa, Steam, etc. via Tremendous)
    - PayPal cash out (enter PayPal email, $5 minimum)
21. Implement withdrawal processing (manual approval initially, batch daily)
22. Add withdrawal history to dashboard
23. Implement W-9 collection gate (require before first payout exceeding threshold)

### Phase 4: Production Deployment
> **Goal:** Production-ready on AWS Amplify with monitoring. By this point, provider approvals should be in.

24. Provision RDS PostgreSQL instance (db.t4g.micro), configure VPC, security group allowing Amplify Lambda access
25. Configure AWS SES production (verify domain, confirm production access approved from Phase 0)
26. Configure Amplify environment variables for production:
    - Database connection string (via Parameter Store or `.env.production` in build spec)
    - AdGem, Lootably, BitLabs API keys and secrets (from approved accounts)
    - Tremendous production API key (from KYC-approved account)
    - PayPal production client ID and secret (from Payouts-approved account)
    - Better Auth secret
    - Cloudflare Turnstile keys
27. Configure all provider postback URLs to production endpoints:
    - AdGem: `https://yourdomain.com/api/postback/adgem`
    - Lootably: `https://yourdomain.com/api/postback/lootably`
    - BitLabs: `https://yourdomain.com/api/postback/bitlabs`
28. Set up CloudWatch alarms for:
    - Postback endpoint errors (5xx rate)
    - Postback processing failures
    - High error rates on auth endpoints
29. Set up EventBridge Scheduler rule (`rate(5 minutes)`) to invoke SSR Lambda and reduce cold starts ($0/month within free tier)
30. Enable Amplify WAF with rate-based rules and managed rule groups
31. Test all postback endpoints with each provider's live test tools
32. Smoke test full user flow: register → complete offer → earn points → withdraw
33. Switch Tremendous and PayPal from sandbox to production keys, verify payouts work

### Phase 5 (Optional): Advanced Anti-Fraud & Compliance Hardening
> **Goal:** Enhanced protections for scale. Implement when traffic/revenue justifies the complexity.

34. Advanced fraud detection:
    - VPN/proxy detection (IP reputation API)
    - Multi-accounting detection (shared device fingerprints, email pattern analysis)
    - Suspicious earning pattern detection (too-fast completions, geographic anomalies)
    - Automated account flagging and review queue
35. Automated 1099 issuance (integrate Tax1099.com API or similar)
36. Enhanced KYC:
    - ID verification for payouts above a threshold
    - Phone number verification
37. Abuse reporting system (users can flag suspicious offers/activity)
38. Admin dashboard for manual review of flagged accounts and transactions

---

## Remaining Limitations to Be Aware Of

1. **Cash flow**: You pay users immediately but providers pay you Net 30 (AdGem at $100 minimum). Budget reserves to cover this gap across all three providers.
2. **AdGem reputation risk**: 2.9/5 Trustpilot. Having Lootably (4.3/5) and BitLabs as alternatives mitigates this — if AdGem suspends your account, revenue continues.
3. **Amplify cold starts**: Lambda-based SSR produces 3-12 second cold starts on idle functions. Mitigate with a periodic uptime ping every 5 minutes. Postback endpoints are server-to-server and latency-tolerant, so cold starts there are acceptable.
4. **Tax compliance**: 1099-MISC threshold is $2,000/user/year for 2026 tax year. Build W-9 collection into your payout flow before it becomes urgent.
5. **PayPal Payouts API**: Requires a PayPal Business account. Apply early as approval can take time. New accounts sending many small payments trigger fraud flags — build transaction history gradually. Pre-fund balance with 2-4 weeks of expected payouts.
6. **PayPal fee math**: $0.25/tx domestic makes sub-$5 payouts expensive. Route small payouts through Tremendous gift cards ($0 fee) and reserve PayPal for $5+ cashouts.
7. **Legal docs**: Privacy Policy + Terms of Service must be live before collecting any user data. Generate in Phase 0.
8. **CCPA**: May apply sooner than expected if California traffic crosses 100,000 unique visitors/year. Cookie consent banner + "Do Not Sell" link needed from launch.
9. **AdGem API deprecation**: The legacy Offer Wall API and Static API are being phased out. Use the Web Offer Wall (iframe) for launch; be prepared to migrate to the newer Offer API if required.
10. **Auth library**: Better Auth requires a database (no stateless sessions). This is fine since we already have PostgreSQL, but be aware it's a hard dependency.
11. **Amplify SSR package limit**: 50 MB max for the SSR function bundle. Prisma's Rust query engine adds ~15-20 MB. Monitor total bundle size. Fallback options if needed: Prisma `--no-engine` mode with Prisma Accelerate, or switching to Drizzle ORM.
12. **Amplify environment variables for SSR**: Server-side env vars are not automatically available to SSR runtime. Must explicitly write them to `.env.production` in `amplify.yml` build spec or use Parameter Store + IAM Compute Roles.

---

## Verification Plan

### Per-Provider Testing
- Test postback handlers using manual curl/HTTP requests simulating provider callbacks (no sandbox available from AdGem, Lootably, or BitLabs)
- Once approved: test AdGem Web Offer Wall loads correctly with real property credentials
- Once approved: test Lootably offerwall loads with real placement credentials
- Once approved: test BitLabs survey wall loads with real workspace credentials
- Test each provider's postback endpoint receives and validates callbacks
- Test duplicate postback rejection (send same `request_id` twice)
- Test postback with invalid hash — should reject
- Test postback from non-whitelisted IP — should reject
- Test Tremendous payout flow using sandbox (`testflight.tremendous.com`)
- Test PayPal Payouts flow using sandbox (`api-m.sandbox.paypal.com`)

### Core Flow Testing
- Test user point crediting end-to-end (postback → balance update → shows in dashboard)
- Test withdrawal flow: gift card via Tremendous (sandbox)
- Test withdrawal flow: PayPal payout (sandbox credentials)
- Test auth flow (register, login, logout, password reset)
- Test age verification rejects users under 18
- Test CAPTCHA blocks automated registration

### Amplify-Specific Testing
- Verify `amplify.yml` build spec correctly exposes server-side env vars
- Verify Amplify auto-deploys on git push to main
- Verify custom domain + HTTPS works after Route 53 setup
- Verify PR preview environments build and deploy correctly
- Test cold start latency — measure time-to-first-byte after 15+ minutes of inactivity
- Verify WAF rate-based rules block excessive requests
- Load test postback endpoints for concurrent callbacks from multiple providers

### Infrastructure Testing
- Verify CloudWatch alarms fire on postback failures
- Verify uptime monitor pings keep SSR Lambda warm
- Test rate limiting under load
- Test on mobile browsers (responsive design)

### Compliance Testing
- Verify Privacy Policy and Terms of Service pages render correctly
- Verify cookie consent banner appears on first visit
- Verify "Do Not Sell or Share" opt-out functions correctly
- Verify W-9 collection gate blocks payouts above threshold for users without W-9 on file

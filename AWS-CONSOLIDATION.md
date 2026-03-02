# CashyLoot: AWS Service Consolidation Review

## Goal
Evaluate every non-AWS service in the stack and determine if consolidating to an AWS equivalent improves cost, reliability, or operational simplicity.

---

## Current Service Map

### Already AWS (8 services)
| Service | Purpose | Cost |
|---------|---------|------|
| **AWS Amplify** | Hosting, CI/CD, CloudFront CDN, SSL | ~$0-5/month at low traffic |
| **AWS RDS PostgreSQL** | Primary database (db.t4g.micro) | ~$15-30/month |
| **AWS SES** | Transactional email (verification, payout notifications) | 62K free/month from Lambda |
| **AWS Route 53** | DNS + domain management | ~$0.50/month per hosted zone |
| **AWS CloudWatch** | Logging, metrics, alarms (5xx rates, postback failures) | Free tier covers basic usage |
| **AWS WAF** | Rate-based rules, managed rule groups on Amplify | ~$6/month (ACL + rules) |
| **AWS ACM** | SSL/TLS certificates | Free |
| **AWS Parameter Store** | Secrets management (API keys, DB credentials) | Free (standard tier) |

### Non-AWS Services
| Service | Purpose | Cost | AWS Alternative |
|---------|---------|------|-----------------|
| **Better Auth** | Authentication (login, register, sessions) | $0 (open source) | AWS Cognito |
| **Cloudflare Turnstile** | Bot protection on registration | $0 (free tier) | AWS WAF CAPTCHA / Challenge |
| **UptimeRobot** | Lambda warming (ping every 5 min) | $0 (free tier) | EventBridge Scheduler |
| **Prisma** | ORM / database client | $0 (code library) | N/A (not a service) |
| **Tremendous** | Gift card payouts | $0 platform fee | N/A (business partner) |
| **PayPal** | Cash payouts | $0.25/transaction | N/A (business partner) |
| **AdGem / Lootably / BitLabs** | Offerwall providers | N/A (revenue source) | N/A (business partners) |

---

## Consolidation Candidates

### 1. Better Auth vs AWS Cognito

**Recommendation: KEEP BETTER AUTH**

#### Why Cognito looks appealing
- Native Amplify integration with pre-built `<Authenticator>` UI component
- Eliminates password hash storage liability — AWS manages all credentials
- 10,000 MAU free tier (new "Lite" pricing since Dec 2024)
- Built-in MFA, social login, SAML, and adaptive authentication
- One less open-source dependency to maintain

#### Why we're keeping Better Auth
- **Cost at scale:** Cognito costs **$495/month at 100,000 MAU** vs $0 for Better Auth at any scale. A rewards site can grow users fast — this becomes a real cost quickly.
- **SSR token refresh bug:** Confirmed issue with Amplify's `runWithAmplifyServerContext` — server-side tokens don't auto-refresh, requiring manual workaround code. This affects every authenticated API route and server component.
- **Verbose DX:** Every server-side auth check requires wrapping in `runWithAmplifyServerContext({ nextServerContext: { cookies } })` boilerplate. Better Auth's `auth.api.getSession()` is a single call.
- **Vendor lock-in:** Cognito passwords cannot be exported. Migrating away means forcing all users to reset passwords.
- **Customization:** Better Auth gives full control over the auth flow, email templates, and session handling. Cognito's hosted UI is limited in customization.

#### When to reconsider
If CashyLoot handles sensitive financial data beyond gift cards (e.g., bank transfers), the reduced password liability from Cognito might justify the cost and DX trade-offs.

---

### 2. Cloudflare Turnstile vs AWS WAF CAPTCHA / Challenge

**Recommendation: KEEP CLOUDFLARE TURNSTILE**

#### Why WAF CAPTCHA/Challenge looks appealing
- Single vendor — already using WAF for rate-based rules
- WAF "Challenge" action is invisible (similar to Turnstile)
- Centralized security configuration in one place

#### Why we're keeping Turnstile
- **WAF CAPTCHA cannot fire on POST requests** — this is a hard limitation. Registration forms POST data. You'd need a two-step pattern: Challenge on GET (page load) → collect token → validate on POST. Extra complexity for no benefit.
- **Cost:** WAF CAPTCHA/Challenge with Bot Control adds **~$20+/month** ($5 WAF ACL + $1/rule + $10+ Bot Control). Turnstile is **$0, unlimited**.
- **Purpose-built:** Turnstile is specifically designed for form protection. Drop-in React component, works natively with HTML forms, zero friction for users.
- **Privacy:** Turnstile is privacy-focused by design — no tracking cookies, GDPR-friendly out of the box.
- **Already using WAF for other things:** WAF stays for rate-based rules and managed rule groups. Turnstile handles form-level bot protection. Different layers, complementary.

#### When to reconsider
If Cloudflare changes Turnstile's free tier or if WAF Bot Control adds native POST support, revisit.

---

### 3. UptimeRobot vs EventBridge Scheduler

**Recommendation: SWITCH TO EVENTBRIDGE SCHEDULER**

#### Why EventBridge wins
| Factor | UptimeRobot | EventBridge Scheduler |
|--------|-------------|----------------------|
| **Cost** | $0 (free tier) | $0 (14M invocations/month free) |
| **Setup** | External account, configure URL | AWS-native, IAM-based |
| **Reliability** | External HTTP round-trip | Internal AWS network invocation |
| **Latency** | Higher (external ping) | Lower (same-region invocation) |
| **Monitoring** | Separate dashboard | CloudWatch integration built-in |
| **Vendor count** | +1 external service | Already in AWS ecosystem |

#### Implementation
- Create an EventBridge Scheduler rule with a `rate(5 minutes)` schedule
- Target: HTTP invoke to the Amplify SSR endpoint (e.g., `GET /api/health`)
- IAM role with permission to invoke the target
- CloudWatch alarm if the warming invocation fails

#### What this eliminates
- UptimeRobot account
- External dependency for a simple cron task
- External HTTP latency on warming pings

---

## Final Summary

| Service | Decision | Rationale |
|---------|----------|-----------|
| Better Auth | **Keep** | $0 at any scale, cleaner DX, no SSR token bug, no vendor lock-in |
| Cloudflare Turnstile | **Keep** | $0, frictionless, works with POST forms, WAF CAPTCHA has hard limitations |
| UptimeRobot | **Replace with EventBridge Scheduler** | Same cost ($0), AWS-native, more reliable, fewer external dependencies |

### Post-Consolidation Service Count
- **AWS services:** 9 (added EventBridge Scheduler)
- **Non-AWS services:** 2 (Better Auth, Cloudflare Turnstile)
- **Business partners:** 5 (Tremendous, PayPal, AdGem, Lootably, BitLabs)
- **Code libraries:** 1 (Prisma — not a service)

---

## Services That Cannot Be AWS
These are business relationships, not infrastructure choices:
- **Tremendous** — gift card fulfillment marketplace. No AWS equivalent.
- **PayPal** — user-facing payout method. Users expect PayPal as an option.
- **AdGem / Lootably / BitLabs** — offerwall providers that supply the offers. These are the revenue source.
- **Prisma** — an npm package (ORM), not a hosted service. Runs inside the Lambda function.

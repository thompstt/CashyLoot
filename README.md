# CashyLoot

**Earn rewards for stuff you already do.** Take surveys, try apps, play games — cash out to PayPal or gift cards from $1.

[www.cashyloot.com](https://www.cashyloot.com)

---

## What is CashyLoot?

CashyLoot is a get-paid-to (GPT) rewards platform. Users earn points by completing offers from offerwall providers and redeem them for gift cards (Amazon, Visa, Steam, and 1,000+ more) or PayPal cash.

**Key features:**
- Mystery Vaults — gamified loot boxes with randomized point prizes
- 3 offerwall providers (AdGem, Lootably, BitLabs)
- $1 minimum cashout (gift cards), $5 minimum (PayPal)
- 6-tier referral program with ongoing commission (up to 15%)
- Email verification + Cloudflare Turnstile anti-bot protection

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, SSR) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| Database | PostgreSQL (AWS Aurora Serverless v2) |
| ORM | Prisma 7 |
| Auth | Better Auth (email/password + email verification) |
| Anti-bot | Cloudflare Turnstile |
| Email | AWS SES |
| Hosting | AWS Amplify |
| IaC | Terraform (6 modules, 22 resources) |
| CI/CD | GitHub Actions (7 pipeline jobs) |

## Security

CashyLoot handles real money, so security is built into every layer:

**Application security:**
- Email verification required before login (AWS SES)
- Cloudflare Turnstile on login and registration (managed mode, fail-open)
- Rate-limited verification email resend (3 per 15 min, database-backed)
- Zod validation on all environment variables and API inputs
- Security headers: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Age verification (18+) on registration

**CI/CD security pipeline** (runs on every PR):
- **Snyk** — dependency vulnerability scanning (high/critical threshold)
- **Semgrep** — pattern-based SAST (Next.js, TypeScript, OWASP Top 10 rulesets)
- **CodeQL** — dataflow SAST (taint tracking across function boundaries)
- **Gitleaks** — secret detection in code and git history
- **Terraform Validate** — infrastructure code syntax and formatting

**Infrastructure as Code:**
- All AWS resources managed via Terraform (VPC, RDS, SES, Route 53, IAM, Amplify)
- Full GitOps — `terraform plan` on PRs, auto-apply on merge to main
- OIDC authentication (GitHub Actions to AWS, no stored credentials)
- S3 backend with DynamoDB state locking
- Scoped IAM permissions per service (no wildcard write access)

**Branch protection:**
- `main` (production): PRs required, all checks must pass, conversations resolved, no force push
- `dev` (integration): PRs required, all checks must pass, flexible merge rules

**Dependency management:**
- Dependabot monitors npm + GitHub Actions weekly
- Automated PRs for vulnerable dependencies

## Development Flow

```
feature branch → PR to dev (7 security checks) → PR to main (7 checks) → Amplify auto-deploys
```

Infrastructure changes through the same flow get `terraform plan` posted as a PR comment, then auto-applied on merge to main.

## Project Structure

```
src/           # Next.js application (69 source files)
  app/         # 12 pages (SSR + client components)
  lib/         # Auth, database, email, turnstile, vault logic
  components/  # UI components (shadcn/ui + custom)
infra/         # Terraform IaC (6 modules, 22 managed resources)
  modules/     # networking, database, email, dns, iam, amplify
.github/       # CI/CD workflows (security + terraform)
```

## License

Private — all rights reserved.

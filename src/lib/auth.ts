import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./db";
import { sendVerificationEmail } from "./ses";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, user.name, url);
    },
  },
  // Rate limiting is backed by our Postgres RateLimit model so state persists
  // across Amplify SSR worker cold starts. Default `memory` storage would
  // reset per-instance and be effectively useless on serverless.
  //
  // enabled: true overrides Better Auth's default of `isProduction`, so
  // limits are active in dev builds too — catches regressions before they
  // ship.
  //
  // customRules override Better Auth's built-in defaults (3/10s on sign-in,
  // 3/60s on send-verification-email, etc.). Our values are slightly more
  // forgiving for legitimate typos but still block abuse.
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email":            { window: 60,  max: 10 },
      "/sign-up/email":            { window: 3600, max: 5 },
      "/send-verification-email":  { window: 900, max: 3 },
      "/request-password-reset":   { window: 900, max: 3 },
      "/forget-password":          { window: 900, max: 3 },
      "/change-password":          { window: 900, max: 5 },
      "/change-email":             { window: 900, max: 5 },
    },
  },
  advanced: {
    ipAddress: {
      // Amplify's CloudFront distribution populates x-forwarded-for with the
      // real client IP as the leftmost entry. Better Auth's default includes
      // this header already, but listed explicitly so the trusted header set
      // is visible in the config.
      ipAddressHeaders: ["x-forwarded-for"],
    },
  },
  plugins: [nextCookies()],
});

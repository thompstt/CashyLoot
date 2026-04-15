import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  SES_REGION: z.string().min(1),
  SES_FROM_EMAIL: z.string().email(),
  AYET_API_KEY: z.string().min(1),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsed = serverSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Missing or invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Missing or invalid environment variables");
}

export const env = parsed.data;

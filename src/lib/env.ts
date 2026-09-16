import { z } from "zod";

const envSchema = z.object({
  FAKE_STORE_API_URL: z.url().default("https://fakestoreapi.com"),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

function readEnv(): Env {
  const parsed = envSchema.safeParse({
    FAKE_STORE_API_URL: process.env.FAKE_STORE_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    throw new Error(`Invalid environment variables: ${details}`);
  }

  return parsed.data;
}

/**
 * Validated application environment.
 * Defaults keep local/stub builds working; set real values via `.env.local` or Vercel.
 */
export const env = readEnv();

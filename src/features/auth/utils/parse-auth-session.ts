import { z } from "zod";

import type { AuthSession } from "../types/auth";

const authUserSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(1),
  email: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  image: z.string().optional(),
});

const authSessionSchema = z.object({
  token: z.string().min(1),
  user: authUserSchema,
});

/**
 * Recover a valid AuthSession from unknown persisted state.
 * Returns null for malformed payloads.
 */
export function parseAuthSession(value: unknown): AuthSession | null {
  const parsed = authSessionSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

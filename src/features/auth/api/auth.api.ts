"use server";

import { ApiError } from "@/lib/api/errors";
import { request } from "@/lib/api/http";

import { toAuthSession } from "../mappers/auth.mapper";
import { authLoginDtoSchema } from "../schemas/auth.schema";
import type { LoginCredentials, LoginResult } from "../types/auth";
import { mapAuthError } from "../utils/map-auth-error";

/**
 * Authenticate against the DummyJSON mock provider.
 * Returns a serializable Result — never throws ApiError across the server/client boundary.
 * Passwords are not logged or persisted.
 */
export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  const username = credentials.username.trim();
  const password = credentials.password;

  if (!username || !password) {
    return { ok: false, error: "invalid_credentials" };
  }

  try {
    const dto = await request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
      schema: authLoginDtoSchema,
    });

    return { ok: true, session: toAuthSession(dto) };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: mapAuthError(error) };
    }

    return { ok: false, error: "unknown" };
  }
}

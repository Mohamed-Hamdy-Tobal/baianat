import { ApiError } from "@/lib/api/errors";

import type { AuthErrorCode } from "../types/auth";

/**
 * Map API / transport failures to safe UI error codes.
 * Never expose raw messages, tokens, or response bodies.
 */
export function mapAuthError(error: unknown): AuthErrorCode {
  if (error instanceof ApiError) {
    if (error.code === "network" || error.code === "timeout") {
      return "network";
    }

    if (error.code === "http" && (error.status === 400 || error.status === 401)) {
      return "invalid_credentials";
    }
  }

  return "unknown";
}

import type { AuthSession, AuthUiState } from "../types/auth";

/**
 * Derive UI auth state. Before hydration completes, treat as unknown
 * to avoid flashes and premature redirects.
 */
export function getAuthUiState(hydrated: boolean, session: AuthSession | null): AuthUiState {
  if (!hydrated) return "unknown";
  return session ? "authenticated" : "guest";
}

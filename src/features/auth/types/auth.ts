export type AuthUser = {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

/** Safe, serializable failure codes returned to the UI. Never include raw API details. */
export type AuthErrorCode = "invalid_credentials" | "network" | "unknown";

export type LoginResult =
  | { ok: true; session: AuthSession }
  | { ok: false; error: AuthErrorCode };

export type AuthUiState = "unknown" | "guest" | "authenticated";

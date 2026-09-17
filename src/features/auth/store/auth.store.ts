"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuthSession } from "../types/auth";
import { parseAuthSession } from "../utils/parse-auth-session";

type AuthState = {
  session: AuthSession | null;
  /** Persist the authenticated session. Do not store passwords. */
  login: (session: AuthSession) => void;
  /** Clear the demo session. Does not touch cart or wishlist. */
  logout: () => void;
  clearSession: () => void;
  isAuthenticated: () => boolean;
};

/**
 * Client-side demo auth session (Zustand + localStorage).
 * This is intentionally NOT production-secure authentication:
 * the token is readable by client JS and is not an HttpOnly cookie.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,

      login: (session) => {
        set({ session });
      },

      logout: () => {
        set({ session: null });
      },

      clearSession: () => {
        set({ session: null });
      },

      isAuthenticated: () => get().session !== null,
    }),
    {
      name: "baianat-auth",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ session: state.session }),
      merge: (persisted, current) => {
        const raw =
          persisted && typeof persisted === "object" && "session" in persisted
            ? (persisted as { session: unknown }).session
            : undefined;
        return {
          ...current,
          session: parseAuthSession(raw),
        };
      },
    },
  ),
);

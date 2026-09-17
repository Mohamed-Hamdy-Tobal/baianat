export type {
  AuthUser,
  AuthSession,
  LoginCredentials,
  AuthErrorCode,
  LoginResult,
  AuthUiState,
} from "./types/auth";

export {
  authLoginDtoSchema,
  loginFormSchema,
  registerFormSchema,
  type AuthLoginDto,
  type LoginFormValues,
  type RegisterFormValues,
} from "./schemas/auth.schema";

export { toAuthSession } from "./mappers/auth.mapper";
export { useAuthStore } from "./store/auth.store";
export { parseAuthSession } from "./utils/parse-auth-session";
export { mapAuthError } from "./utils/map-auth-error";
export { getAuthUiState } from "./utils/auth-ui-state";
export {
  getSafeRedirect,
  toLocaleHref,
  buildLoginRedirectHref,
} from "./utils/safe-redirect";

export { AuthGuard } from "./components/auth-guard";
export { GuestOnly } from "./components/guest-only";
export { LoginForm } from "./components/login-form";
export { RegisterForm } from "./components/register-form";
export { AuthHeaderControl } from "./components/auth-header-control";
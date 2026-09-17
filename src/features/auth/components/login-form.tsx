"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { login } from "@/features/auth/api/auth.api";
import { DemoCredentialsHint } from "@/features/auth/components/demo-credentials-hint";
import { loginFormSchema, type LoginFormValues } from "@/features/auth/schemas/auth.schema";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { AuthErrorCode } from "@/features/auth/types/auth";
import { DEMO_LOGIN_PASSWORD, DEMO_LOGIN_USERNAME } from "@/features/auth/utils/demo-credentials";
import { getSafeRedirect, toLocaleHref } from "@/features/auth/utils/safe-redirect";
import { Link, useRouter } from "@/i18n/navigation";

function errorMessageKey(code: AuthErrorCode): string {
  switch (code) {
    case "invalid_credentials":
      return "errors.invalidCredentials";
    case "network":
      return "errors.network";
    default:
      return "errors.unknown";
  }
}

export function LoginForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeLogin = useAuthStore((state) => state.login);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
    mode: "onSubmit",
  });

  const fillDemoAccount = () => {
    setFormError(null);
    clearErrors();
    setValue("username", DEMO_LOGIN_USERNAME, { shouldDirty: true, shouldValidate: false });
    setValue("password", DEMO_LOGIN_PASSWORD, { shouldDirty: true, shouldValidate: false });
  };

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);

    const result = await login({
      username: values.username,
      password: values.password,
    });

    if (!result.ok) {
      setFormError(t(errorMessageKey(result.error)));
      return;
    }

    storeLogin(result.session);

    const redirectParam = searchParams.get("redirect");
    const safe = getSafeRedirect(redirectParam, locale);
    router.replace(toLocaleHref(safe, locale));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <DemoCredentialsHint onUseDemo={fillDemoAccount} disabled={isSubmitting} />

      {formError ? (
        <p role="alert" className="rounded-md border border-error/30 bg-error/5 px-3 py-2 text-sm text-error">
          {formError}
        </p>
      ) : null}

      <Field id="login-username" label={t("fields.username")} required error={errors.username ? t("validation.required") : undefined}>
        <Input
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          disabled={isSubmitting}
          {...register("username")}
        />
      </Field>

      <Field id="login-password" label={t("fields.password")} required error={errors.password ? t("validation.required") : undefined}>
        <PasswordInput autoComplete="current-password" disabled={isSubmitting} {...register("password")} />
      </Field>

      <Button type="submit" className="w-full" loading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? t("login.submitting") : t("login.submit")}
      </Button>

      <p className="text-center text-sm text-text-secondary">
        {t("login.noAccount")}{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {t("login.createAccount")}
        </Link>
      </p>
    </form>
  );
}

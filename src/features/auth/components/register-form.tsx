"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { registerFormSchema, type RegisterFormValues } from "@/features/auth/schemas/auth.schema";
import { Link } from "@/i18n/navigation";

function fieldErrorMessage(
  t: ReturnType<typeof useTranslations<"auth">>,
  message: string | undefined,
): string | undefined {
  if (!message) return undefined;
  if (message === "passwordMismatch") return t("validation.passwordMismatch");
  if (message === "email") return t("validation.email");
  return t("validation.required");
}

/**
 * Registration UI for the take-home demo.
 * DummyJSON does not persist new users — this form never claims success.
 */
export function RegisterForm() {
  const t = useTranslations("auth");
  const [noticeVisible, setNoticeVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async () => {
    // Demo backend has no real registration. Keep the form truthful.
    setNoticeVisible(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <p role="status" className="rounded-md border border-border bg-background px-3 py-2 text-sm text-text-secondary">
        {t("register.unavailable")}
      </p>

      {noticeVisible ? (
        <p role="alert" className="rounded-md border border-border bg-background px-3 py-2 text-sm text-text-secondary">
          {t("register.submitNotice")}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="register-first-name"
          label={t("fields.firstName")}
          required
          error={fieldErrorMessage(t, errors.firstName?.message)}
        >
          <Input type="text" autoComplete="given-name" disabled={isSubmitting} {...register("firstName")} />
        </Field>

        <Field
          id="register-last-name"
          label={t("fields.lastName")}
          required
          error={fieldErrorMessage(t, errors.lastName?.message)}
        >
          <Input type="text" autoComplete="family-name" disabled={isSubmitting} {...register("lastName")} />
        </Field>
      </div>

      <Field id="register-email" label={t("fields.email")} required error={fieldErrorMessage(t, errors.email?.message)}>
        <Input type="email" autoComplete="email" disabled={isSubmitting} {...register("email")} />
      </Field>

      <Field
        id="register-username"
        label={t("fields.username")}
        required
        error={fieldErrorMessage(t, errors.username?.message)}
      >
        <Input
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          disabled={isSubmitting}
          {...register("username")}
        />
      </Field>

      <Field
        id="register-password"
        label={t("fields.password")}
        required
        error={fieldErrorMessage(t, errors.password?.message)}
      >
        <PasswordInput autoComplete="new-password" disabled={isSubmitting} {...register("password")} />
      </Field>

      <Field
        id="register-confirm-password"
        label={t("fields.confirmPassword")}
        required
        error={fieldErrorMessage(t, errors.confirmPassword?.message)}
      >
        <PasswordInput autoComplete="new-password" disabled={isSubmitting} {...register("confirmPassword")} />
      </Field>

      <Button type="submit" className="w-full" loading={isSubmitting} disabled={isSubmitting}>
        {t("register.submit")}
      </Button>

      <p className="text-center text-sm text-text-secondary">
        {t("register.hasAccount")}{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {t("register.signIn")}
        </Link>
      </p>
    </form>
  );
}

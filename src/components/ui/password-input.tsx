"use client";

import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { cn } from "@/lib/utils";

export type PasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

/**
 * Password field with an accessible show/hide toggle.
 * Forwards ref and a11y props so it works with Field.
 */
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, disabled, ...props }, ref) => {
    const t = useTranslations("auth");
    const [visible, setVisible] = React.useState(false);

    return (
      <div className="relative w-full">
        <input
          type={visible ? "text" : "password"}
          className={cn(
            "flex h-10 w-full rounded-md border border-border bg-surface py-2 pe-10 ps-3 text-sm text-text shadow-none transition-colors",
            "placeholder:text-text-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "aria-invalid:border-error aria-invalid:focus-visible:ring-error",
            className,
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        <button
          type="button"
          disabled={disabled}
          aria-label={visible ? t("password.hide") : t("password.show")}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
          className={cn(
            "absolute end-1 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-text-muted",
            "transition-colors hover:bg-background hover:text-text",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {visible ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };

"use client";

import { useTranslations } from "next-intl";
import type { UseFormRegister } from "react-hook-form";

import type { CheckoutFormValues } from "@/features/checkout/schemas/checkout.schema";
import type { PaymentMethod } from "@/features/checkout/types/order";
import { cn } from "@/lib/utils";

type CheckoutPaymentProps = {
  register: UseFormRegister<CheckoutFormValues>;
  value: PaymentMethod | undefined;
  error?: string;
  disabled?: boolean;
};

const OPTIONS: { value: PaymentMethod; labelKey: "payment.card" | "payment.cashOnDelivery" }[] = [
  { value: "card", labelKey: "payment.card" },
  { value: "cash_on_delivery", labelKey: "payment.cashOnDelivery" },
];

export function CheckoutPayment({ register, value, error, disabled }: CheckoutPaymentProps) {
  const t = useTranslations("checkout");
  const errorId = error ? "checkout-payment-error" : undefined;

  return (
    <fieldset className="flex flex-col gap-3" disabled={disabled} aria-describedby={errorId}>
      <legend className="text-base font-semibold text-text">{t("payment.title")}</legend>

      <div className="flex flex-col gap-2" role="radiogroup" aria-label={t("payment.title")}>
        {OPTIONS.map((option) => {
          const selected = value === option.value;
          const optionId = `payment-${option.value}`;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-surface",
                selected
                  ? "border-primary bg-primary-soft text-text"
                  : "border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-background",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <input
                id={optionId}
                type="radio"
                value={option.value}
                className="size-4 shrink-0 accent-primary"
                disabled={disabled}
                {...register("paymentMethod")}
              />
              <span className={cn("font-medium", selected ? "text-text" : "text-text-secondary")}>
                {t(option.labelKey)}
              </span>
            </label>
          );
        })}
      </div>

      {value === "card" ? (
        <p className="text-sm text-text-muted">{t("payment.simulated")}</p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="text-sm text-error">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

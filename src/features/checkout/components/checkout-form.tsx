"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { buildLoginRedirectHref } from "@/features/auth/utils/safe-redirect";
import type { CartItem } from "@/features/cart/types/cart-item";
import { useCartStore } from "@/features/cart/store/cart.store";
import {
  checkoutFormSchema,
  type CheckoutFormValues,
} from "@/features/checkout/schemas/checkout.schema";
import { useOrderStore } from "@/features/checkout/store/order.store";
import type { PlaceOrderError } from "@/features/checkout/types/order";
import { placeCheckoutOrder } from "@/features/checkout/utils/place-order";
import { useRouter } from "@/i18n/navigation";

import { CheckoutPayment } from "./checkout-payment";
import { CheckoutSummary } from "./checkout-summary";

type CheckoutFormProps = {
  items: CartItem[];
};

function validationMessage(
  t: ReturnType<typeof useTranslations<"checkout">>,
  message: string | undefined,
): string | undefined {
  if (!message) return undefined;
  if (message === "email") return t("validation.email");
  return t("validation.required");
}

function errorMessage(
  t: ReturnType<typeof useTranslations<"checkout">>,
  code: PlaceOrderError,
): string {
  if (code === "unauthenticated") return t("errors.unauthenticated");
  return t("errors.unknown");
}

function redirectToLogin(
  router: ReturnType<typeof useRouter>,
  locale: string,
) {
  const intended = `/${locale}/checkout`;
  const loginHref = buildLoginRedirectHref(intended, locale);
  const [path, queryString] = loginHref.split("?");
  const query = queryString ? Object.fromEntries(new URLSearchParams(queryString)) : undefined;
  router.replace({ pathname: (path || "/login") as "/login", query });
}

export function CheckoutForm({ items }: CheckoutFormProps) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const clearCart = useCartStore((state) => state.clearCart);
  const setLastOrder = useOrderStore((state) => state.setLastOrder);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: session?.user.firstName ?? "",
      lastName: session?.user.lastName ?? "",
      email: session?.user.email ?? "",
      phone: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
      paymentMethod: "card",
    },
    mode: "onSubmit",
  });

  const paymentMethod = useWatch({ control, name: "paymentMethod" });

  const onSubmit = async (values: CheckoutFormValues) => {
    setFormError(null);

    try {
      // Brief delay so loading state is visible; then re-read live state.
      await new Promise((resolve) => setTimeout(resolve, 400));

      const liveSession = useAuthStore.getState().session;
      const liveItems = useCartStore.getState().items;

      if (!liveSession) {
        redirectToLogin(router, locale);
        return;
      }

      const result = placeCheckoutOrder({
        values,
        items: liveItems,
        session: liveSession,
        submitting: false,
      });

      if (!result.ok) {
        if (result.error === "duplicate") return;
        if (result.error === "unauthenticated") {
          redirectToLogin(router, locale);
          return;
        }
        if (result.error === "empty_cart") {
          setFormError(t("empty.description"));
          return;
        }
        setFormError(errorMessage(t, result.error));
        return;
      }

      setLastOrder(result.order);
      clearCart();
      router.replace("/checkout/success");
    } catch {
      setFormError(t("errors.unknown"));
    }
  };

  const submitButton = (
    <Button
      type="submit"
      form="checkout-form"
      className="w-full min-h-11"
      loading={isSubmitting}
      disabled={isSubmitting}
    >
      {isSubmitting ? t("processing") : t("placeOrder")}
    </Button>
  );

  return (
    <form
      id="checkout-form"
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start"
      noValidate
    >
      <div className="order-2 flex flex-col gap-6 lg:order-1">
        {formError ? (
          <p role="alert" className="rounded-md border border-error/30 bg-error/5 px-3 py-2 text-sm text-error">
            {formError}
          </p>
        ) : null}

        <section
          aria-labelledby="checkout-shipping-heading"
          className="rounded-lg border border-border bg-surface p-5 sm:p-6"
        >
          <h2 id="checkout-shipping-heading" className="text-base font-semibold text-text">
            {t("shipping.title")}
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              id="checkout-first-name"
              label={t("fields.firstName")}
              required
              error={validationMessage(t, errors.firstName?.message)}
            >
              <Input
                type="text"
                autoComplete="given-name"
                className="h-11"
                disabled={isSubmitting}
                {...register("firstName")}
              />
            </Field>

            <Field
              id="checkout-last-name"
              label={t("fields.lastName")}
              required
              error={validationMessage(t, errors.lastName?.message)}
            >
              <Input
                type="text"
                autoComplete="family-name"
                className="h-11"
                disabled={isSubmitting}
                {...register("lastName")}
              />
            </Field>

            <Field
              id="checkout-email"
              label={t("fields.email")}
              required
              error={validationMessage(t, errors.email?.message)}
            >
              <Input
                type="email"
                autoComplete="email"
                className="h-11"
                disabled={isSubmitting}
                {...register("email")}
              />
            </Field>

            <Field
              id="checkout-phone"
              label={t("fields.phone")}
              required
              error={validationMessage(t, errors.phone?.message)}
            >
              <Input
                type="tel"
                autoComplete="tel"
                className="h-11"
                disabled={isSubmitting}
                {...register("phone")}
              />
            </Field>

            <Field
              id="checkout-address"
              label={t("fields.address")}
              required
              className="sm:col-span-2"
              error={validationMessage(t, errors.address?.message)}
            >
              <Input
                type="text"
                autoComplete="street-address"
                className="h-11"
                disabled={isSubmitting}
                {...register("address")}
              />
            </Field>

            <Field
              id="checkout-city"
              label={t("fields.city")}
              required
              error={validationMessage(t, errors.city?.message)}
            >
              <Input
                type="text"
                autoComplete="address-level2"
                className="h-11"
                disabled={isSubmitting}
                {...register("city")}
              />
            </Field>

            <Field
              id="checkout-country"
              label={t("fields.country")}
              required
              error={validationMessage(t, errors.country?.message)}
            >
              <Input
                type="text"
                autoComplete="country-name"
                className="h-11"
                disabled={isSubmitting}
                {...register("country")}
              />
            </Field>

            <Field
              id="checkout-postal-code"
              label={t("fields.postalCode")}
              className="sm:col-span-2 sm:max-w-xs"
              error={validationMessage(t, errors.postalCode?.message)}
            >
              <Input
                type="text"
                autoComplete="postal-code"
                className="h-11"
                disabled={isSubmitting}
                {...register("postalCode")}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface p-5 sm:p-6">
          <CheckoutPayment
            register={register}
            value={paymentMethod}
            error={validationMessage(t, errors.paymentMethod?.message)}
            disabled={isSubmitting}
          />
        </section>

        <div className="lg:hidden">{submitButton}</div>
      </div>

      <div className="order-1 lg:order-2">
        <CheckoutSummary items={items} actions={<div className="hidden lg:block">{submitButton}</div>} />
      </div>
    </form>
  );
}

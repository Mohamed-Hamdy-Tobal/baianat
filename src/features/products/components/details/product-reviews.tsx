import { getLocale, getTranslations } from "next-intl/server";

import { ProductRating } from "@/features/products/components/product-rating";
import type { ProductReview } from "@/features/products/types/product";

type ProductReviewsProps = {
  reviews: ProductReview[];
};

export async function ProductReviews({ reviews }: ProductReviewsProps) {
  const t = await getTranslations("catalogue");
  const locale = await getLocale();

  return (
    <section className="flex flex-col gap-4 border-t border-border pt-8" aria-labelledby="product-reviews">
      <h2 id="product-reviews" className="text-lg font-semibold text-text">
        {t("product.reviews")}
      </h2>

      {reviews.length === 0 ? (
        <p className="text-sm text-text-secondary">{t("product.reviewsEmpty")}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {reviews.map((review, index) => {
            const dateLabel = formatReviewDate(review.date, locale);
            return (
              <li
                key={`${review.reviewerName}-${review.date}-${index}`}
                className="flex flex-col gap-2 border-b border-border pb-4 last:border-b-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-text">{review.reviewerName}</p>
                  {dateLabel ? <time className="text-xs text-text-muted">{dateLabel}</time> : null}
                </div>
                <ProductRating rate={review.rating} showCount={false} />
                <p className="text-sm leading-relaxed text-text-secondary">{review.comment}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function formatReviewDate(value: string, locale: string): string | null {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return null;
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(parsed));
}

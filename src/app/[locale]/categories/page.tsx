import { getTranslations } from "next-intl/server";
import { connection } from "next/server";

import { CategoryCard } from "@/features/products/components/category-card";
import { getCategories } from "@/features/products";

export default async function CategoriesPage() {
  await connection();

  const t = await getTranslations("catalogue");
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-8 py-2">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text">{t("categoriesPage.title")}</h1>
        <p className="max-w-2xl text-sm text-text-secondary">{t("categoriesPage.description")}</p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <li key={category.slug}>
            <CategoryCard category={category} />
          </li>
        ))}
      </ul>
    </div>
  );
}

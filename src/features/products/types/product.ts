import type { Category } from "./category";

export type Product = {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

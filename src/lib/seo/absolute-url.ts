import { env } from "@/lib/env";

export function absoluteUrl(path: string): string {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

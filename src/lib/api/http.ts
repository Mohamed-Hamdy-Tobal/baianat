import type { z } from "zod";

import { env } from "@/lib/env";

import { ApiError, NotFoundError } from "./errors";

const DEFAULT_TIMEOUT_MS = 10_000;

export const CATALOGUE_FETCH_OPTIONS = {
  next: {
    revalidate: 3600,
    tags: ["products"],
  },
} as const satisfies RequestInit;

export type RequestOptions<T> = RequestInit & {
  schema?: z.ZodType<T>;
  timeoutMs?: number;
};

function joinUrl(base: string, path: string): string {
  const normalizedBase = base.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export async function request<T>(path: string, options: RequestOptions<T> = {}): Promise<T> {
  const { schema, timeoutMs = DEFAULT_TIMEOUT_MS, signal: userSignal, ...init } = options;
  const url = joinUrl(env.PRODUCTS_API_URL, path);
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const signal = userSignal ? AbortSignal.any([userSignal, timeoutSignal]) : timeoutSignal;

  let response: Response;

  try {
    response = await fetch(url, { ...init, signal });
  } catch (cause) {
    if (cause instanceof Error && (cause.name === "TimeoutError" || cause.name === "AbortError")) {
      throw new ApiError(`Request timed out: ${path}`, { code: "timeout", cause });
    }

    throw new ApiError(`Network request failed: ${path}`, { code: "network", cause });
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new NotFoundError(`Resource not found: ${path}`);
    }

    throw new ApiError(`HTTP ${response.status} for ${path}`, {
      code: "http",
      status: response.status,
    });
  }

  let json: unknown;

  try {
    json = await response.json();
  } catch (cause) {
    throw new ApiError(`Invalid JSON for ${path}`, { code: "invalid_json", cause });
  }

  if (!schema) {
    return json as T;
  }

  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    throw new ApiError(`Invalid response shape for ${path}`, {
      code: "invalid_shape",
      cause: parsed.error,
    });
  }

  return parsed.data;
}

import type { Metadata } from "next";
import Link from "next/link";

import { fontVariables } from "@/styles/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "BAIANAT — Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center bg-background px-6 font-sans text-text">
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-2 text-center text-sm text-text-secondary">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/en"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-surface hover:bg-primary-hover"
        >
          Back to home
        </Link>
      </body>
    </html>
  );
}

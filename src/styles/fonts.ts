import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

/** Combined CSS variable class names for the root layout. */
export const fontVariables = `${inter.variable} ${ibmPlexSansArabic.variable}`;

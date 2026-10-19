import { Cormorant_Garamond, Jost } from "next/font/google";

// Display serif for headings
export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

// UI sans-serif for body text
export const jost = Jost({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jost",
});

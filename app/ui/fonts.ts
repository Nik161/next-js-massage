import { Cormorant_Garamond, Inter } from "next/font/google";
import { Lusitana } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });
export const cormorant = Cormorant_Garamond({ subsets: ["latin"] });
export const lusitana = Lusitana({
  weight: ["400", "700"],
  subsets: ["latin"],
});

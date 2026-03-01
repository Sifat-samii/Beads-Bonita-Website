import "@beads-bonita/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { CartProvider } from "./_components/cart-provider";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "BEADS BONITA",
  description:
    "Handcrafted jewelry shaped by art, sustainability, and authentic handmade creation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

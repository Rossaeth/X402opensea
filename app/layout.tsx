import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "x402 OpenSea — Pay-per-item onchain marketplace",
  description: "Discover digital collectibles and access them with x402 payments in USDC.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
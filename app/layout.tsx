import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPOTTR | The J.A.R.V.I.S. for Lifting",
  description: "A deterministic, science-backed AI fitness coach powered by hybrid expert systems.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#0d1117] text-[#c9d1d9] antialiased min-h-screen selection:bg-[#238636] selection:text-white overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
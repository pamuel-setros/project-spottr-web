import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Display face. Variable on weight AND width: headings use the condensed end
// of the wdth axis (font-stretch in globals.css), so load that axis too.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://spottrfit.com"),
  title: "SPOTTR | Programmed for the gym you actually train in",
  description:
    "An AI lifting coach that builds every session around your gym, your body, and your injuries, then coaches you through it set by set.",
  openGraph: {
    title: "SPOTTR | Programmed for the gym you actually train in",
    description:
      "An AI lifting coach that builds every session around your gym, your body, and your injuries, then coaches you through it set by set.",
    url: "https://spottrfit.com",
    siteName: "SPOTTR",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SPOTTR | Programmed for the gym you actually train in",
    description:
      "An AI lifting coach that builds every session around your gym, your body, and your injuries, then coaches you through it set by set.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable} scroll-smooth`}>
      <body className="bg-base text-fg font-sans antialiased min-h-screen selection:bg-spottr selection:text-black overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

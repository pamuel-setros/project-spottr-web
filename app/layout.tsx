import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://spottrfit.com"),
  title: "SPOTTR | 5 Features, 1 App. Your Personalized AI Coach.",
  description:
    "An AI lifting coach that builds every session around your gym, your body, and your injuries — then coaches you through it in real time.",
  openGraph: {
    title: "SPOTTR | 5 Features, 1 App. Your Personalized AI Coach.",
    description:
      "An AI lifting coach that builds every session around your gym, your body, and your injuries — then coaches you through it in real time.",
    url: "https://spottrfit.com",
    siteName: "SPOTTR",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 1115,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SPOTTR | 5 Features, 1 App. Your Personalized AI Coach.",
    description:
      "An AI lifting coach that builds every session around your gym, your body, and your injuries — then coaches you through it in real time.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} scroll-smooth`}>
      <body className="bg-base text-fg font-sans antialiased min-h-screen selection:bg-spottr selection:text-black overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

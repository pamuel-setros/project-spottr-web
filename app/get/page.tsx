// app/get/page.tsx
//
// The metered download landing — the ONE URL every promo QR, printed link, and
// site CTA funnels through (spottrfit.com/get?src=<tag>). Each arrival is
// reported to the backend meter (POST /promo/scan) via after(), so logging adds
// zero latency and can never break the page. What renders depends on
// lib/download.ts: a one-tap download button once the TestFlight/App Store link
// is set, the waitlist otherwise — and Android always gets the waitlist, since
// a TestFlight link would just bounce them.

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import { after } from 'next/server';
import WaitlistInline from '@/components/WaitlistInline';
import { DOWNLOAD_URL, IS_BETA } from '@/lib/download';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.spottrfit.com';

// Same charset the backend meter accepts; anything else renders fine, just unmetered.
const SRC_RX = /^[a-z0-9-]{1,64}$/;

export const metadata: Metadata = {
  title: 'Get SPOTTR | Your AI lifting coach',
  description:
    'SPOTTR builds every workout around your goals, your gym, and your body — then coaches you through it in real time.',
};

function detectPlatform(ua: string): 'ios' | 'android' | 'desktop' {
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'desktop';
}

export default async function GetPage({
  searchParams,
}: {
  searchParams: Promise<{ src?: string }>;
}) {
  const [{ src }, hdrs] = await Promise.all([searchParams, headers()]);
  const platform = detectPlatform(hdrs.get('user-agent') ?? '');

  const cleanSrc = (src ?? '').trim().toLowerCase();
  if (SRC_RX.test(cleanSrc)) {
    after(async () => {
      try {
        await fetch(`${API_URL}/promo/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ src: cleanSrc, platform }),
          signal: AbortSignal.timeout(3000),
          cache: 'no-store',
        });
      } catch {
        // Metering is best-effort; the visitor already has their page.
      }
    });
  }

  const showDownload = DOWNLOAD_URL !== null && platform !== 'android';

  return (
    <div className="relative flex min-h-screen flex-col bg-base text-fg overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-16 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-spottr/10 blur-3xl"></div>
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-ice/10 blur-3xl"></div>
      </div>

      <header className="border-b border-line bg-surface/80 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 select-none rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice focus-visible:ring-offset-2 focus-visible:ring-offset-base"
          >
            <Image src="/web/mark.png" alt="SPOTTR" width={30} height={30} priority className="rounded-lg" />
            <Image src="/spottr_text.png" alt="SPOTTR" width={108} height={25} priority className="object-contain w-auto h-auto" />
          </Link>
          <Link
            href="/"
            className="text-sm text-muted hover:text-white transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice focus-visible:ring-offset-2 focus-visible:ring-offset-base"
          >
            What is SPOTTR?
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-16">
        <div className="max-w-xl w-full text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/70 border border-line text-xs font-medium text-muted mb-6">
            <span className="w-2 h-2 rounded-full bg-spottr animate-pulse"></span>
            Your AI lifting coach
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-[1.08]">
            Never lift <span className="gradient-text">alone</span> again.
          </h1>

          <p className="md:text-lg text-[#c9d1d9] leading-relaxed mb-10">
            SPOTTR builds every workout around your goals, your gym, and your body — then coaches you
            through it in real time and breaks down exactly how it went. No generic spreadsheets. No
            made-up advice.
          </p>

          {showDownload ? (
            <>
              <a
                href={DOWNLOAD_URL!}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-spottr to-ice px-10 py-4 text-lg font-semibold text-black shadow-[0_14px_36px_rgba(52,208,88,0.25)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice focus-visible:ring-offset-2 focus-visible:ring-offset-base"
              >
                {IS_BETA ? 'Download the beta' : 'Download SPOTTR'} <span className="text-xl">→</span>
              </a>
              {IS_BETA && (
                <p className="text-xs text-muted mt-6">
                  Free beta via Apple&apos;s TestFlight — takes two taps. iPhone-first; Android is coming.
                </p>
              )}
            </>
          ) : platform === 'android' && DOWNLOAD_URL !== null ? (
            <>
              <p className="text-white font-semibold mb-6">
                SPOTTR is iPhone-first right now — Android is coming.
              </p>
              <WaitlistInline />
              <p className="text-xs text-muted mt-6">Drop your email and you&apos;ll be first to know.</p>
            </>
          ) : (
            <>
              <p className="text-white font-semibold mb-6">SPOTTR is in early access.</p>
              <WaitlistInline />
              <p className="text-xs text-muted mt-6">No spam — just the invite, the moment it opens up.</p>
            </>
          )}
        </div>
      </main>

      <footer className="border-t border-line bg-base px-6 py-6 text-center text-xs text-muted">
        <p>© 2026 SPOTTR · Never lift alone.</p>
      </footer>
    </div>
  );
}

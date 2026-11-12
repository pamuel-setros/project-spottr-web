// app/w/[slug]/page.tsx
//
// The web landing behind every shared workout link (spottrfit.com/w/<slug>),
// usually tapped from an iMessage preview card. Phones WITH the app + universal
// links go straight into SPOTTR's SharedWorkout screen; this page catches
// everyone else: it shows the workout (from the public snapshot — see
// lib/shares.ts) and pitches the download so they can run it themselves.

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { byline, formatShareDate, getShare, setLine, summaryLine } from '@/lib/shares';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const share = await getShare(slug);
  if (!share) return { title: 'Workout not found | SPOTTR', robots: { index: false } };
  const s = share.snapshot;
  const title = `${s.name} — ${byline(s)} | SPOTTR`;
  const description = `${summaryLine(s)}. Open it in SPOTTR to run this workout yourself.`;
  return {
    title,
    description,
    // Shared links are personal; keep them out of search results.
    robots: { index: false, follow: false },
    openGraph: { title, description, url: `/w/${share.slug}`, siteName: 'SPOTTR', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function SharedWorkoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const share = await getShare(slug);
  if (!share) notFound();

  const s = share.snapshot;
  const date = formatShareDate(s.date);

  const stats = [
    s.duration_min ? { value: `${s.duration_min}m`, label: 'Time' } : null,
    { value: String(s.totals.lifts), label: 'Lifts' },
    { value: String(s.totals.sets), label: 'Sets' },
    s.totals.tonnage ? { value: Math.round(s.totals.tonnage).toLocaleString('en-US'), label: 'Lbs' } : null,
    s.totals.prs ? { value: String(s.totals.prs), label: 'PRs' } : null,
  ].filter((x): x is { value: string; label: string } => x !== null);

  return (
    <div className="relative flex min-h-screen flex-col bg-base text-fg overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-16 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-spottr/10 blur-3xl"></div>
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-ice/10 blur-3xl"></div>
      </div>

      <header className="border-b border-line bg-surface/80 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 select-none">
            <Image src="/web/mark.png" alt="SPOTTR" width={30} height={30} priority className="rounded-lg" />
            <Image src="/spottr_text.png" alt="SPOTTR" width={108} height={25} priority className="object-contain w-auto h-auto" />
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-white transition-colors">
            What is SPOTTR?
          </Link>
        </div>
      </header>

      <main className="flex-grow px-6 py-12">
        <div className="max-w-xl w-full mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/70 border border-line text-xs font-medium text-muted mb-6">
              <span className="w-2 h-2 rounded-full bg-spottr animate-pulse"></span>
              {s.sharer_name ? `Shared by ${s.sharer_name}` : 'Shared workout'}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2 leading-[1.08]">
              <span className="gradient-text">{s.name}</span>
            </h1>
            {date && <p className="text-sm text-muted mb-6">{date}</p>}

            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {stats.map((st) => (
                <div key={st.label} className="min-w-[72px] rounded-xl border border-line bg-surface px-4 py-2.5">
                  <div className="text-xl font-extrabold text-white tabular-nums">{st.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted">{st.label}</div>
                </div>
              ))}
            </div>
          </div>

          <ol className="space-y-3 mb-10">
            {s.exercises.map((ex, i) => (
              <li key={`${ex.block ?? ''}-${ex.name}-${i}`} className="rounded-2xl border border-line bg-surface p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-bold text-white">{ex.name}</h2>
                  {ex.block && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted shrink-0">{ex.block}</span>
                  )}
                </div>
                {ex.target_muscle && <p className="text-xs text-muted mt-0.5">{ex.target_muscle}</p>}
                <ul className="mt-2 divide-y divide-line">
                  {ex.sets.map((set, j) => (
                    <li key={j} className="flex items-center gap-3 py-1.5 text-sm">
                      <span className="w-5 text-muted tabular-nums">{j + 1}</span>
                      <span className="flex-1 text-[#c9d1d9] tabular-nums">{setLine(set, ex.tracking_type)}</span>
                      {set.is_pr && (
                        <span className="rounded bg-yellow-400 px-1.5 py-0.5 text-[10px] font-black text-black">PR</span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`spottr://w/${share.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-spottr to-ice px-8 py-3.5 font-semibold text-black shadow-[0_20px_70px_rgba(52,208,88,0.28)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Start this in SPOTTR <span className="text-lg">→</span>
              </a>
              <Link
                href="/get?src=shared-workout"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-8 py-3.5 font-semibold text-white transition-colors hover:border-spottr/50"
              >
                Get SPOTTR
              </Link>
            </div>
            <p className="text-xs text-muted mt-6">
              {s.show_weights ? '' : 'Weights hidden by the sharer — SPOTTR suggests yours. '}
              New to SPOTTR? Install it, then tap this link again to load the workout.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-line bg-base px-6 py-6 text-center text-xs text-muted">
        <p>© 2026 SPOTTR · Never lift alone.</p>
      </footer>
    </div>
  );
}

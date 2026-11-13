// app/w/[slug]/page.tsx
//
// The web fallback behind every shared workout link (spottrfit.com/w/<slug>).
// People WITH the app never land here: the universal link opens SPOTTR's own
// SharedWorkout screen. Everyone else gets a compact teaser of the workout
// (headline stats + a one-line summary per exercise, first few only) and a
// sticky call to action to get the app and run it themselves. The full
// set-by-set view, start, save and (later) reactions live in the app.

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { byline, exerciseSummary, formatShareDate, getShare, summaryLine } from '@/lib/shares';

const PREVIEW_COUNT = 5;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const share = await getShare(slug);
  if (!share) return { title: 'Workout not found | SPOTTR', robots: { index: false } };
  const s = share.snapshot;
  const title = `${s.name} — ${byline(s)}`;
  const description = `${summaryLine(s)}. Run it yourself in SPOTTR.`;
  return {
    title: `${title} | SPOTTR`,
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
  const shown = s.exercises.slice(0, PREVIEW_COUNT);
  const hidden = s.exercises.length - shown.length;

  const stats = [
    s.duration_min ? { value: `${s.duration_min}`, unit: 'min', label: 'Duration' } : null,
    s.totals.tonnage
      ? { value: Math.round(s.totals.tonnage).toLocaleString('en-US'), unit: 'lbs', label: 'Volume' }
      : { value: String(s.totals.lifts), unit: '', label: 'Exercises' },
    { value: String(s.totals.sets), unit: '', label: 'Sets' },
  ].filter((x): x is { value: string; unit: string; label: string } => x !== null);

  return (
    <div className="relative flex min-h-screen flex-col bg-base text-fg overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-spottr/10 blur-3xl"></div>
      </div>

      <header className="px-4 sm:px-6 py-3.5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 select-none">
            <Image src="/web/mark.png" alt="SPOTTR" width={28} height={28} priority className="rounded-lg" />
            <Image src="/spottr_text.png" alt="SPOTTR" width={96} height={22} priority className="object-contain w-auto h-auto" />
          </Link>
          <Link href="/" className="text-xs text-muted hover:text-white transition-colors">
            What is SPOTTR?
          </Link>
        </div>
      </header>

      {/* pb-40 leaves room for the sticky CTA bar */}
      <main className="flex-grow px-4 pt-2 pb-40">
        <article className="max-w-md mx-auto rounded-3xl border border-line bg-surface/80 p-5 sm:p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-spottr">
            {s.sharer_name ? `${s.sharer_name}'s workout` : 'Shared workout'}
            {date && <span className="text-muted"> · {date}</span>}
          </p>
          <h1 className="mt-1.5 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white leading-[1.02]">
            {s.name}
          </h1>
          <div className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-spottr to-ice" />

          <div className="mt-5 grid grid-cols-3 gap-2">
            {stats.map((st) => (
              <div key={st.label} className="min-w-0 rounded-2xl border border-line bg-base/60 px-2.5 py-2.5">
                <div className="text-lg font-extrabold text-white tabular-nums leading-none tracking-tight whitespace-nowrap">
                  {st.value}
                  {st.unit && <span className="ml-0.5 text-xs font-semibold text-muted">{st.unit}</span>}
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted">{st.label}</div>
              </div>
            ))}
          </div>

          <ul className="mt-5 divide-y divide-line">
            {shown.map((ex, i) => (
              <li key={`${ex.block ?? ''}-${ex.name}-${i}`} className="flex items-baseline justify-between gap-3 py-2.5">
                <span className="font-semibold text-white text-sm">{ex.name}</span>
                <span className="shrink-0 text-xs text-[#c9d1d9] tabular-nums">{exerciseSummary(ex)}</span>
              </li>
            ))}
          </ul>
          {hidden > 0 && (
            <p className="mt-2 text-xs font-semibold text-spottr">
              +{hidden} more {hidden === 1 ? 'exercise' : 'exercises'} — see every set in the app
            </p>
          )}
          {!s.show_weights && (
            <p className="mt-3 text-xs text-muted">Weights hidden by the sharer. SPOTTR suggests yours.</p>
          )}
        </article>

        <p className="max-w-md mx-auto mt-6 text-center text-sm text-muted leading-relaxed">
          SPOTTR is an AI lifting coach. It turns this workout into a session built for your gym and your
          numbers, then coaches you through every set.
        </p>
      </main>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-base/90 backdrop-blur-md px-4 pt-3 pb-[max(env(safe-area-inset-bottom),12px)]">
        <div className="max-w-md mx-auto flex flex-col gap-2">
          <Link
            href="/get?src=shared-workout"
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-spottr to-ice px-6 py-3.5 font-bold text-black"
          >
            Get SPOTTR and run this workout <span aria-hidden>→</span>
          </Link>
          <a
            href={`spottr://w/${share.slug}`}
            className="text-center text-xs font-semibold text-muted hover:text-white transition-colors py-1"
          >
            Already have SPOTTR? Open it in the app
          </a>
        </div>
      </div>
    </div>
  );
}

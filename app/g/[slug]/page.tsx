// app/g/[slug]/page.tsx
//
// The web landing behind every printed gym QR poster (spottrfit.com/g/<slug>).
// Phones WITH the app + universal links go straight into SPOTTR's scanner; this
// page catches everyone else: it resolves the gym via the public backend API and
// pitches the download. The ?i=<issue> query on posters is a print-ledger number
// and is deliberately ignored here.

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PhotoCarousel from './carousel';

type Gym = {
  slug: string;
  name: string;
  city: string | null;
  logo_url: string | null;
  equipment: string[];
  verified: boolean;
  description?: string | null;
  photos?: string[];
  website?: string | null;
  instagram?: string | null;
  phone?: string | null;
  members_count?: number | null;
};

// Env override exists for local dev against a mock API; production always
// falls through to the real host.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.spottrfit.com';

async function getGym(slug: string): Promise<Gym | null> {
  const clean = slug.trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(clean)) return null;
  try {
    // Gyms change rarely; a 5-minute cache keeps poster scans fast without
    // hammering the API.
    const res = await fetch(`${API_URL}/gyms/${encodeURIComponent(clean)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as Gym;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const gym = await getGym(slug);
  if (!gym) return { title: 'Gym not found | SPOTTR' };
  return {
    title: `Train at ${gym.name} | SPOTTR`,
    description: `${gym.name} is a SPOTTR partner gym — scan in and your AI coach builds every workout around its exact equipment.`,
  };
}

export default async function GymPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gym = await getGym(slug);
  if (!gym) notFound();

  const equipmentCount = gym.equipment?.length ?? 0;
  const preview = (gym.equipment ?? []).slice(0, 8);

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

      <main className="flex-grow flex items-center justify-center px-6 py-16">
        <div className="max-w-xl w-full text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/70 border border-line text-xs font-medium text-muted mb-6">
            <span className="w-2 h-2 rounded-full bg-spottr animate-pulse"></span>
            {gym.verified ? 'Verified SPOTTR partner gym' : 'SPOTTR partner gym'}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 leading-[1.08]">
            Train at <span className="gradient-text">{gym.name}</span>
          </h1>
          {gym.city && <p className="text-sm text-muted mb-2">{gym.city}</p>}
          {(gym.members_count ?? 0) >= 3 && (
            <p className="text-xs font-semibold text-spottr mb-6">
              {gym.members_count} SPOTTR members train here
            </p>
          )}
          {!((gym.members_count ?? 0) >= 3) && <div className="mb-6" />}

          <PhotoCarousel photos={gym.photos ?? []} gymName={gym.name} />

          {/* NB: no `text-base` on these paragraphs — the theme has a COLOR named
              base, so text-base paints near-black and (by utility sort order)
              beats arbitrary hex text colors. Default 16px is what it meant. */}
          {gym.description && (
            <p className="text-[#c9d1d9] leading-relaxed mb-8 whitespace-pre-line">
              {gym.description}
            </p>
          )}

          <p className="md:text-lg text-[#c9d1d9] leading-relaxed mb-8">
            This gym&apos;s full equipment loadout lives in SPOTTR. Scan the poster in the app and your
            AI coach builds every session around what&apos;s actually on this floor —{' '}
            <span className="text-white font-semibold">{equipmentCount} pieces of equipment</span>, nothing invented.
          </p>

          {preview.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {preview.map((e) => (
                <span key={e} className="text-xs font-medium text-fg bg-surface-2 border border-line rounded-full px-3 py-1.5">
                  {e}
                </span>
              ))}
              {equipmentCount > preview.length && (
                <span className="text-xs font-medium text-muted border border-line rounded-full px-3 py-1.5">
                  +{equipmentCount - preview.length} more
                </span>
              )}
            </div>
          )}

          {(gym.website || gym.instagram || gym.phone) && (
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-sm">
              {gym.website && (
                <a href={gym.website} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-muted hover:text-white hover:border-spottr/50 transition-colors">
                  🌐 Website
                </a>
              )}
              {gym.instagram && (
                <a href={`https://instagram.com/${gym.instagram}`} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-muted hover:text-white hover:border-spottr/50 transition-colors">
                  📸 @{gym.instagram}
                </a>
              )}
              {gym.phone && (
                <a href={`tel:${gym.phone.replace(/[^+\d]/g, '')}`}
                   className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-muted hover:text-white hover:border-spottr/50 transition-colors">
                  📞 {gym.phone}
                </a>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`spottr://g/${gym.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-spottr to-ice px-8 py-3.5 text-base font-semibold text-black shadow-[0_20px_70px_rgba(52,208,88,0.28)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Open in the SPOTTR app <span className="text-lg">→</span>
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-8 py-3.5 text-base font-semibold text-white transition-colors hover:border-spottr/50"
            >
              Get SPOTTR
            </Link>
          </div>
          <p className="text-xs text-muted mt-6">
            Don&apos;t have the app yet? SPOTTR is in early access — join the list and we&apos;ll send your invite.
          </p>
        </div>
      </main>

      <footer className="border-t border-line bg-base px-6 py-6 text-center text-xs text-muted">
        <p>© 2026 SPOTTR · Never lift alone.</p>
      </footer>
    </div>
  );
}

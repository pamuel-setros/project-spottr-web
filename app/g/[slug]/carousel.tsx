'use client';

// Auto-rotating photo gallery for partner gym pages. Owner-uploaded photos come
// from the SPOTTR API (Supabase storage, already resized server-side), so plain
// <img> is deliberate — no Next image-optimizer config or per-host allowlist.

import { useEffect, useState } from 'react';

export default function PhotoCarousel({ photos, gymName }: { photos: string[]; gymName: string }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (photos.length < 2 || paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % photos.length), 4500);
    return () => clearInterval(t);
  }, [photos.length, paused]);

  if (!photos.length) return null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-line bg-surface mb-10"
      style={{ aspectRatio: '16 / 9' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {photos.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={`${gymName} — photo ${i + 1}`}
          loading={i === 0 ? 'eager' : 'lazy'}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: i === idx ? 1 : 0 }}
        />
      ))}
      {photos.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {photos.map((_, i) => (
            <button
              key={i}
              aria-label={`Photo ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === idx ? 'w-6 bg-spottr' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

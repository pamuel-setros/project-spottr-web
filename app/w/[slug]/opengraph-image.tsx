// app/w/[slug]/opengraph-image.tsx
//
// The preview card iMessage (and every other link unfurler) shows when a lifter
// shares a workout: workout name, who shared it, the headline stats and the
// first few exercises. Falls back to a generic SPOTTR card for a dead link.

import { ImageResponse } from 'next/og';
import { byline, getShare, summaryLine } from '@/lib/shares';

export const alt = 'A workout shared on SPOTTR';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BG = '#0a0b0d';
const SURFACE = '#131519';
const LINE = '#262a31';
const FG = '#e8eaed';
const MUTED = '#9aa1ab';
const GREEN = '#34d058';
const ICE = '#38bdf8';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const share = await getShare(slug);
  const s = share?.snapshot;

  const names = s ? s.exercises.map((e) => e.name) : [];
  const preview = names.slice(0, 4);
  const extra = names.length - preview.length;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', background: BG, color: FG, padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: GREEN, display: 'flex' }} />
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 6, color: FG, display: 'flex' }}>SPOTTR</div>
          <div style={{ fontSize: 26, color: MUTED, marginLeft: 12, display: 'flex' }}>
            {s ? byline(s) : 'Shared workout'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 92, fontWeight: 900, lineHeight: 1.02, letterSpacing: -2,
              backgroundImage: `linear-gradient(100deg, ${GREEN}, ${ICE})`,
              backgroundClip: 'text', color: 'transparent', display: 'flex',
            }}
          >
            {(s?.name ?? 'Train smarter with SPOTTR').slice(0, 40)}
          </div>
          <div style={{ fontSize: 34, color: FG, marginTop: 18, display: 'flex' }}>
            {s ? summaryLine(s) : 'Your personalized AI lifting coach'}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {preview.map((n) => (
            <div
              key={n}
              style={{
                display: 'flex', fontSize: 26, color: FG, background: SURFACE,
                border: `2px solid ${LINE}`, borderRadius: 999, padding: '10px 24px',
              }}
            >
              {n.slice(0, 28)}
            </div>
          ))}
          {extra > 0 && (
            <div style={{ display: 'flex', fontSize: 26, color: MUTED, padding: '10px 12px' }}>+{extra} more</div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}

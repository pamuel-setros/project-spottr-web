// app/w/[slug]/opengraph-image.tsx
//
// The preview card iMessage (and every other link unfurler) shows when a lifter
// shares a workout. Punchy but restrained: the app's condensed Archivo display
// face for the title and numbers, three stat tiles, a few exercise chips, one
// thin brand-gradient accent. Deliberately no glow borders, grid textures or
// badges. Falls back to a generic SPOTTR card for a dead link.

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { getShare, type SharedSnapshot } from '@/lib/shares';

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

type Tile = { value: string; unit?: string; label: string };

function tilesFor(s: SharedSnapshot): Tile[] {
  const t = s.totals;
  const tiles: Tile[] = [];
  if (s.duration_min) tiles.push({ value: String(s.duration_min), unit: 'min', label: 'DURATION' });
  if (t.tonnage) {
    tiles.push({ value: Math.round(t.tonnage).toLocaleString('en-US'), unit: 'lbs', label: 'VOLUME' });
    tiles.push({ value: String(t.sets), unit: t.sets === 1 ? 'set' : 'sets', label: `${t.lifts} ${t.lifts === 1 ? 'LIFT' : 'LIFTS'}` });
  } else {
    // Weights hidden (or a bodyweight session): sets and lifts get a tile each.
    tiles.push({ value: String(t.sets), unit: t.sets === 1 ? 'set' : 'sets', label: 'SETS' });
    tiles.push({ value: String(t.lifts), unit: t.lifts === 1 ? 'lift' : 'lifts', label: 'EXERCISES' });
  }
  return tiles.slice(0, 3);
}

// Long names step the title down so it always fits on one or two lines.
function titleSize(name: string): number {
  const n = name.length;
  if (n <= 16) return 112;
  if (n <= 22) return 96;
  if (n <= 30) return 80;
  return 66;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [share, black, extraBold] = await Promise.all([
    getShare(slug),
    readFile(join(process.cwd(), 'assets/fonts/ArchivoCondensed-Black.ttf')),
    readFile(join(process.cwd(), 'assets/fonts/ArchivoCondensed-ExtraBold.ttf')),
  ]);
  const s = share?.snapshot;

  const name = (s?.name ?? 'Train smarter').slice(0, 40);
  const owner = s?.sharer_name ? `${s.sharer_name.toUpperCase()}'S WORKOUT` : 'SHARED WORKOUT';
  const tiles = s ? tilesFor(s) : [];
  const names = s ? s.exercises.map((e) => e.name) : [];
  const preview = names.slice(0, 3);
  const extra = names.length - preview.length;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          background: BG, color: FG, padding: '56px 68px', position: 'relative',
          backgroundImage: `radial-gradient(circle at 0% 0%, rgba(52,208,88,0.16), rgba(10,11,13,0) 55%)`,
        }}
      >
        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: GREEN, display: 'flex' }} />
            <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 30, letterSpacing: 6, display: 'flex' }}>SPOTTR</div>
          </div>
          <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 24, letterSpacing: 3, color: MUTED, display: 'flex' }}>
            {s ? owner : 'YOUR AI LIFTING COACH'}
          </div>
        </div>

        {/* Title + accent */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 34 }}>
          <div
            style={{
              fontFamily: 'Archivo', fontWeight: 900, fontSize: titleSize(name), lineHeight: 0.98,
              letterSpacing: -1, textTransform: 'uppercase', color: '#ffffff', display: 'flex',
            }}
          >
            {name}
          </div>
          <div
            style={{
              width: 150, height: 7, borderRadius: 4, marginTop: 18, display: 'flex',
              backgroundImage: `linear-gradient(90deg, ${GREEN}, ${ICE})`,
            }}
          />
        </div>

        {/* Stat tiles */}
        {tiles.length > 0 && (
          <div style={{ display: 'flex', gap: 18, marginTop: 'auto' }}>
            {tiles.map((t) => (
              <div
                key={t.label}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', background: SURFACE,
                  border: `2px solid ${LINE}`, borderRadius: 18, padding: '18px 24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: 60, lineHeight: 1, display: 'flex' }}>{t.value}</div>
                  {t.unit && (
                    <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 30, color: MUTED, display: 'flex' }}>{t.unit}</div>
                  )}
                </div>
                <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 20, letterSpacing: 3, color: MUTED, marginTop: 6, display: 'flex' }}>
                  {t.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Exercise chips */}
        {preview.length > 0 && (
          <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
            {preview.map((n) => (
              <div
                key={n}
                style={{
                  display: 'flex', fontSize: 23, color: FG, border: `2px solid ${LINE}`,
                  borderRadius: 999, padding: '8px 20px',
                }}
              >
                {n.length > 26 ? `${n.slice(0, 25)}…` : n}
              </div>
            ))}
            {extra > 0 && (
              <div
                style={{
                  display: 'flex', fontSize: 23, fontWeight: 700, color: GREEN,
                  border: `2px solid rgba(52,208,88,0.45)`, borderRadius: 999, padding: '8px 20px',
                }}
              >
                +{extra} more
              </div>
            )}
          </div>
        )}
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Archivo', data: black, style: 'normal', weight: 900 },
        { name: 'Archivo', data: extraBold, style: 'normal', weight: 800 },
      ],
    }
  );
}

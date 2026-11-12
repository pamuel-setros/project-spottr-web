// lib/shares.ts
//
// Shared workout links (spottrfit.com/w/<slug>). The SPOTTR backend freezes a
// public-safe snapshot of one session (backend/logic/share.py) and serves it at
// GET /shares/{slug} — no auth, no private fields. This file is the website's
// read side, shared by the page and its preview image.

export type SharedSet = {
  reps: number;
  weight?: number; // absent when the sharer hid weights (weight_reps only)
  is_pr?: boolean;
  distance_unit?: string;
  cardio_level?: number;
  level_kind?: string;
};

export type SharedExercise = {
  name: string;
  block: string | null;
  tracking_type: 'weight_reps' | 'reps_only' | 'time' | 'distance_time' | string;
  target_muscle: string | null;
  sets: SharedSet[];
};

export type SharedSnapshot = {
  v: number;
  name: string;
  date: string | null; // YYYY-MM-DD
  duration_min: number | null;
  sharer_name: string | null;
  show_weights: boolean;
  exercises: SharedExercise[];
  totals: { sets: number; lifts: number; tonnage: number | null; prs: number | null };
};

export type Share = {
  slug: string;
  url: string;
  snapshot: SharedSnapshot;
  created_at: string | null;
  clone_count: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.spottrfit.com';

// Mirrors backend logic/share.py SLUG_RE.
const SLUG_RX = /^[A-Za-z0-9_-]{6,32}$/;

export async function getShare(slug: string): Promise<Share | null> {
  const clean = (slug ?? '').trim();
  if (!SLUG_RX.test(clean)) return null;
  try {
    // Snapshots are frozen, but a sharer can turn a link off — keep the cache
    // short so a revoked link stops resolving within a minute.
    const res = await fetch(`${API_URL}/shares/${encodeURIComponent(clean)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Share;
    return data?.snapshot ? data : null;
  } catch {
    return null;
  }
}

const UNIT_LABEL: Record<string, string> = { mi: 'mi', km: 'km', m: 'm', floors: 'floors', steps: 'steps' };

export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.round(seconds || 0));
  if (s <= 0) return '–';
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// One set as a readable line, matching the app's SharedWorkout screen.
export function setLine(set: SharedSet, tracking: string): string {
  if (tracking === 'time') return formatClock(set.weight ?? 0);
  if (tracking === 'distance_time') {
    const unit = UNIT_LABEL[set.distance_unit ?? 'mi'] ?? 'mi';
    const level = set.cardio_level ? ` · L${set.cardio_level}` : '';
    return `${set.weight ?? 0} ${unit} · ${formatClock((set.reps || 0) * 60)}${level}`;
  }
  if (tracking === 'reps_only' || set.weight === undefined) return `${set.reps || 0} reps`;
  return `${set.weight} lb × ${set.reps || 0}`;
}

export function formatShareDate(iso: string | null): string | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export function byline(s: SharedSnapshot): string {
  return s.sharer_name ? `${s.sharer_name}'s workout` : 'A SPOTTR workout';
}

export function summaryLine(s: SharedSnapshot): string {
  const parts = [
    s.duration_min ? `${s.duration_min} min` : null,
    `${s.totals.lifts} ${s.totals.lifts === 1 ? 'lift' : 'lifts'}`,
    `${s.totals.sets} ${s.totals.sets === 1 ? 'set' : 'sets'}`,
    s.totals.tonnage ? `${Math.round(s.totals.tonnage).toLocaleString('en-US')} lbs moved` : null,
  ].filter(Boolean);
  return parts.join(' · ');
}

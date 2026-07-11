'use client';

// 3D ring gallery for partner gym pages: every photo lives on a slowly spinning
// carousel (CSS preserve-3d cylinder driven by rAF). Depth is sold by lighting —
// the front-facing card is bright and saturated, cards swing dim as they rotate
// away. Drag (mouse or touch) spins the ring with inertia; hover pauses the
// auto-spin; prefers-reduced-motion disables it entirely (drag still works).
// Owner photos come from the SPOTTR API pre-resized, so plain <img> is deliberate.

import { useEffect, useRef } from 'react';

const AUTO_DEG_PER_SEC = -8;      // slow clockwise cruise
const DRAG_DEG_PER_PX = 0.35;
const INERTIA_DECAY = 0.93;       // per-frame velocity retention (60fps basis)

export default function PhotoCarousel({ photos, gymName }: { photos: string[]; gymName: string }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const n = photos.length;

  useEffect(() => {
    const scene = sceneRef.current;
    const ring = ringRef.current;
    if (!scene || !ring || n < 2) return;

    const cards = Array.from(ring.children) as HTMLElement[];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = { angle: 0, vel: 0, dragging: false, hover: false, lastX: 0, lastT: 0, radius: 200 };

    const layout = () => {
      const w = cards[0].offsetWidth;
      // Ring radius so cards clear each other, with breathing room; a 2-photo
      // "ring" is a front/back orbit instead of a degenerate zero-radius pair.
      s.radius = n === 2 ? w * 0.42 : w / 2 / Math.tan(Math.PI / n) + 28;
      cards.forEach((c, i) => {
        c.style.transform = `rotateY(${(360 / n) * i}deg) translateZ(${s.radius}px)`;
      });
    };
    layout();
    window.addEventListener('resize', layout);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(48, now - last) / 1000;
      last = now;
      if (!s.dragging) {
        const auto = reduced || s.hover ? 0 : AUTO_DEG_PER_SEC;
        s.angle += (auto + s.vel) * dt;
        s.vel *= Math.pow(INERTIA_DECAY, dt * 60);
      }
      ring.style.transform = `rotateY(${s.angle}deg)`;
      cards.forEach((c, i) => {
        const rel = (((s.angle + (360 / n) * i) % 360) + 360) % 360;
        const facing = (Math.cos((rel * Math.PI) / 180) + 1) / 2; // 1 = front, 0 = back
        c.style.opacity = (0.38 + 0.62 * facing).toFixed(3);
        c.style.filter = `brightness(${(0.52 + 0.52 * facing).toFixed(3)}) saturate(${(0.7 + 0.3 * facing).toFixed(3)})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const down = (e: PointerEvent) => {
      s.dragging = true;
      s.vel = 0;
      s.lastX = e.clientX;
      s.lastT = performance.now();
      scene.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!s.dragging) return;
      const dx = e.clientX - s.lastX;
      const dtMs = Math.max(8, performance.now() - s.lastT);
      s.angle += dx * DRAG_DEG_PER_PX;
      s.vel = (dx * DRAG_DEG_PER_PX * 1000) / dtMs; // deg/s at release
      s.lastX = e.clientX;
      s.lastT = performance.now();
    };
    const up = () => { s.dragging = false; };
    const enter = () => { s.hover = true; };
    const leave = () => { s.hover = false; s.dragging = false; };

    scene.addEventListener('pointerdown', down);
    scene.addEventListener('pointermove', move);
    scene.addEventListener('pointerup', up);
    scene.addEventListener('pointercancel', up);
    scene.addEventListener('mouseenter', enter);
    scene.addEventListener('mouseleave', leave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', layout);
      scene.removeEventListener('pointerdown', down);
      scene.removeEventListener('pointermove', move);
      scene.removeEventListener('pointerup', up);
      scene.removeEventListener('pointercancel', up);
      scene.removeEventListener('mouseenter', enter);
      scene.removeEventListener('mouseleave', leave);
    };
  }, [n]);

  if (!n) return null;

  if (n === 1) {
    return (
      <div className="relative mx-auto mb-10 overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
           style={{ width: 'min(80vw, 480px)', aspectRatio: '4 / 3' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos[0]} alt={`${gymName} — photo`} className="h-full w-full object-cover" draggable={false} />
      </div>
    );
  }

  // --cw drives every card dimension so JS only ever measures, never sizes.
  // Sized so the ring's widest sweep stays inside small viewports (no page
  // horizontal scroll): ~1.7x card width total for 5 cards.
  return (
    <div className="relative mb-12 select-none" aria-label={`${gymName} photo gallery`} role="img">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-52 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-spottr/10 blur-3xl" />
      <div
        ref={sceneRef}
        className="cursor-grab active:cursor-grabbing"
        style={{ perspective: '1200px', height: 'calc(min(46vw, 290px) * 0.75 + 40px)', touchAction: 'pan-y', ['--cw' as never]: 'min(46vw, 290px)' }}
      >
        <div
          ref={ringRef}
          className="relative h-full w-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {photos.map((src, i) => (
            <div
              key={src}
              className="absolute left-1/2 top-1/2 overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
              style={{
                width: 'var(--cw)',
                height: 'calc(var(--cw) * 0.75)',
                marginLeft: 'calc(var(--cw) / -2)',
                marginTop: 'calc(var(--cw) * -0.375)',
                backfaceVisibility: 'hidden',
                transform: `rotateY(${(360 / n) * i}deg) translateZ(200px)`, // JS re-lays-out on mount
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${gymName} — photo ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
      {/* grounding shadow */}
      <div className="pointer-events-none mx-auto -mt-2 h-5 w-56 rounded-[50%] bg-black/50 blur-md" />
      <p className="mt-3 text-center text-[11px] font-medium tracking-wide text-muted">
        DRAG TO SPIN · {n} PHOTOS
      </p>
    </div>
  );
}

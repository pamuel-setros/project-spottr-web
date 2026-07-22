// app/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Tab = 'home' | 'about' | 'community' | 'waitlist';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  // Waitlist form state
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  // Live waitlist counter — honest real Supabase count (no inflation).
  const WAITLIST_SEED = 0;
  // Only show the number once it's actually impressive; below this we lean on
  // "founding access" exclusivity instead of a weak count.
  const WAITLIST_THRESHOLD = 250;
  const [waitlistCount, setWaitlistCount] = useState<number>(WAITLIST_SEED);

  // Interactive product demo: which step is active, and whether auto-advance
  // is paused (hover/focus = the user is reading, so stop the clock).
  const [activeStep, setActiveStep] = useState<number>(0);
  const [demoPaused, setDemoPaused] = useState<boolean>(false);

  const refreshCount = useCallback(async () => {
    try {
      const response = await fetch('/api/waitlist', {
        method: 'GET',
        cache: 'no-store',
        headers: { Pragma: 'no-cache' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (typeof data.count === 'number') {
        setWaitlistCount(WAITLIST_SEED + data.count);
      }
    } catch (error) {
      console.error('Failed to refresh waitlist count:', error);
    }
  }, []);

  // Covers initial mount too — activeTab starts on 'home'.
  useEffect(() => {
    if (activeTab === 'waitlist' || activeTab === 'home') {
      void refreshCount();
    }
  }, [activeTab, refreshCount]);

  // Each step is backed by a real screenshot from the app — the demo walks
  // through an actual session loop: plan → train & debrief → recover.
  const demoSteps = [
    {
      tag: 'Built around you',
      accent: 'spottr' as const,
      title: 'Tell it your reality',
      body: 'Your goal, your equipment, your time, and any injuries. SPOTTR assembles a session from real strength science that fits what is actually true for you today — and automatically trains around anything you can’t load.',
      points: ['Equipment-aware', 'Injury-aware', 'Fits your time'],
      shot: '/web/shot-coach.jpg',
      shotAlt: "SPOTTR Coach's Plan screen showing a workout automatically adjusted around a shoulder injury",
      caption: 'A real plan — already adjusted around a bad shoulder.',
    },
    {
      tag: 'During & after',
      accent: 'ice' as const,
      title: 'Lift with a coach in your ear',
      body: 'Form and tempo cues the moment you need them, then a clear debrief the moment you rack the last set: what you did, what to fix, and exactly what comes next.',
      points: ['Real-time cues', 'Post-workout debrief', 'Always progressing'],
      shot: '/web/shot-debrief.jpg',
      shotAlt: 'SPOTTR post-workout debrief screen with fuel, hydration and sleep guidance',
      caption: 'The post-workout debrief, in plain language.',
    },
    {
      tag: 'Fuel & recovery',
      accent: 'spottr' as const,
      title: 'Recover like it matters',
      body: 'DietTech reads your actual meals and hydration, scores your recovery, and feeds it all back into your next session — so your plan is never frozen.',
      points: ['Meals, scored', 'Hydration tracked', 'Feeds your next plan'],
      shot: '/web/shot-diet.jpg',
      shotAlt: 'SPOTTR DietTech nutrition screen tracking calories, macros and hydration',
      caption: 'Fuel and hydration, tracked against your targets.',
    },
  ];

  const accentChip = (a: 'spottr' | 'ice') =>
    a === 'spottr'
      ? 'text-spottr border-spottr/30 bg-spottr/10'
      : 'text-ice border-ice/30 bg-ice/10';

  // The 5 features behind the "5 features, 1 app" headline.
  const features = [
    {
      title: 'Adaptive AI workout engine',
      body: 'Programming built around your goal — strength, hypertrophy, or athleticism — your experience level, and a proven split like PPL or Upper/Lower. It orders every session around your equipment and injuries, so it never prescribes a lift you can’t actually do.',
      accent: 'spottr' as const,
    },
    {
      title: '"DietTech" nutrition suite',
      body: 'Snap a photo and it’s logged — no manual entry. Personalized calorie and macro targets, a real-time dashboard for macros and hydration, a plate-quality score, and a weekly AI report with what to adjust.',
      accent: 'ice' as const,
    },
    {
      title: 'Real-time coaching, every set',
      body: 'Form and tempo cues while you lift, then a plain-language debrief the moment you rack the last set — what you did, what to fix, and what’s next.',
      accent: 'spottr' as const,
    },
    {
      title: 'Apple Watch companion',
      body: 'Train phone-free with your workout cached on your wrist. Real-time heart rate and calorie burn, plus set completion, load adjustments, and rest-timer control from the watch.',
      accent: 'ice' as const,
    },
    {
      title: 'Progress that stays in view',
      body: 'Streaks that account for recovery, not just gym visits. Live Activities, Dynamic Island, and home-screen widgets keep your session visible without opening the app.',
      accent: 'spottr' as const,
    },
  ];

  const differentiators = [
    {
      title: "Won't invent equipment you don't have",
      body: 'If it is not in your gym, it is not in your workout. Every movement is checked against what you actually have access to.',
    },
    {
      title: "Won't push you through injuries",
      body: 'Tell it where you are hurt and it trains around it — swapping or skipping anything that loads the wrong thing.',
    },
    {
      title: 'Re-adapts every single session',
      body: 'It learns from how the last workout went and adjusts the next one. Your plan is never frozen.',
    },
  ];

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus({ type: 'loading', message: 'Joining…' });

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus({ type: 'error', message: data.error || 'Something went wrong.' });
      } else {
        setStatus({ type: 'success', message: data.message || "You're on the list!" });
        setEmail('');
        setWaitlistCount((prev) => prev + 1);
        setTimeout(() => refreshCount(), 500);
      }
    } catch (err) {
      console.error('Network error:', err);
      setStatus({ type: 'error', message: 'Could not reach the server. Please try again.' });
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen justify-between bg-base text-fg overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-16 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-spottr/10 blur-3xl animate-float-slow"></div>
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-ice/10 blur-3xl"></div>
      </div>

      {/* Navigation */}
      <header className="border-b border-line bg-surface/80 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => setActiveTab('home')}>
            <Image src="/web/mark.png" alt="SPOTTR" width={30} height={30} loading="eager" className="rounded-lg" />
            <Image
              src="/spottr_text.png"
              alt="SPOTTR"
              width={108}
              height={25}
              loading="eager"
              className="object-contain w-auto h-auto"
            />
          </div>

          <nav className="flex items-center space-x-1 text-sm">
            {([
              ['home', 'Home'],
              ['about', 'About'],
              ['community', 'Community'],
            ] as [Tab, string][]).map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  activeTab === tab ? 'bg-line text-white font-semibold' : 'text-muted hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <Link
            href="/get?src=site"
            className="hidden sm:block rounded-full bg-gradient-to-r from-spottr to-ice px-4 py-2 text-sm font-semibold text-black shadow-[0_10px_40px_rgba(52,208,88,0.18)] transition-transform duration-300 hover:-translate-y-0.5 cursor-pointer"
          >
            Get SPOTTR
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        {/* HOME */}
        {activeTab === 'home' && (
          <>
            <section className="relative overflow-hidden animate-fade">
              {/* Real weight-room photo, darkened for legibility */}
              <div className="absolute inset-0 -z-10">
                <Image
                  src="/web/hero.jpg"
                  alt="SPOTTR athlete training in the weight room"
                  fill
                  preload
                  sizes="100vw"
                  className="object-cover object-[62%_center]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-base via-base/90 to-base/25" />
                <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-base/40" />
              </div>

              <div className="max-w-6xl mx-auto px-6 pt-28 pb-28 md:pt-36 md:pb-36">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/70 backdrop-blur border border-line text-xs font-medium text-muted mb-6">
                    <span className="w-2 h-2 rounded-full bg-spottr animate-pulse"></span>
                    Your AI lifting coach
                  </div>
                  <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.05] text-glow">
                    5 features, 1 app. Your personalized <span className="gradient-text">AI coach</span>.
                  </h1>
                  <p className="text-lg md:text-xl text-[#c9d1d9] max-w-xl mb-10 leading-relaxed">
                    SPOTTR builds every workout around your goals, your gym, and your body — then coaches you through it in
                    real time and breaks down exactly how it went. No generic spreadsheets. No made-up advice.
                  </p>
                  <Link
                    href="/get?src=site"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-spottr to-ice px-8 py-3.5 text-base font-semibold text-black shadow-[0_20px_70px_rgba(52,208,88,0.28)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Get SPOTTR <span className="text-lg">→</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* 5 features, 1 app — the headline's promise, spelled out */}
            <section className="max-w-6xl mx-auto px-6 pt-4 pb-20 animate-fade">
              <div className="text-center mb-10">
                <h2 className="text-xs tracking-widest text-spottr uppercase mb-2">Everything in one app</h2>
                <h3 className="text-2xl md:text-3xl font-bold text-white">5 features. 1 app.</h3>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className={`bg-surface border border-line rounded-xl p-6 flex flex-col gap-4 ${
                      i === features.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''
                    }`}
                  >
                    <div
                      className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm border ${accentChip(
                        f.accent
                      )}`}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white mb-2">{f.title}</h4>
                      <p className="text-sm text-muted leading-relaxed">{f.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* How it works — interactive demo driven by real app screens */}
            <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 animate-fade">
              <div className="text-center mb-10">
                <h2 className="text-xs tracking-widest text-spottr uppercase mb-2">How it works</h2>
                <h3 className="text-2xl md:text-3xl font-bold text-white">One loop, every session</h3>
                <p className="text-sm text-muted mt-3 max-w-md mx-auto">
                  These are real screens from the app — click through the loop.
                </p>
              </div>

              <div
                className="relative overflow-hidden rounded-[2rem] premium-card shadow-[0_30px_90px_rgba(0,0,0,.32)]"
                onMouseEnter={() => setDemoPaused(true)}
                onMouseLeave={() => setDemoPaused(false)}
                onFocusCapture={() => setDemoPaused(true)}
                onBlurCapture={() => setDemoPaused(false)}
              >
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-spottr/10 blur-3xl" />
                <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-ice/10 blur-3xl" />

                <div className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-14 items-center px-6 py-8 md:px-12 md:py-12">
                  {/* Step selector — click a step, watch the phone change */}
                  <div className="flex flex-col gap-3 order-last md:order-first">
                    {demoSteps.map((step, idx) => {
                      const active = idx === activeStep;
                      return (
                        <button
                          key={idx}
                          type="button"
                          aria-expanded={active}
                          onClick={() => setActiveStep(idx)}
                          className={`relative overflow-hidden text-left rounded-2xl border transition-colors cursor-pointer ${
                            active
                              ? 'border-line bg-surface-2/80'
                              : 'border-transparent bg-transparent hover:bg-surface-2/40'
                          }`}
                        >
                          <div className="flex items-start gap-4 px-5 py-4">
                            <span
                              className={`shrink-0 w-9 h-9 rounded-full border flex items-center justify-center text-sm font-bold transition-colors ${
                                active
                                  ? 'border-transparent bg-gradient-to-br from-spottr to-ice text-black'
                                  : 'border-line text-muted'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className={`font-display text-base md:text-lg font-bold tracking-tight ${active ? 'text-white' : 'text-muted'}`}>
                                  {step.title}
                                </span>
                                {active && (
                                  <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-md border ${accentChip(step.accent)}`}>
                                    {step.tag}
                                  </span>
                                )}
                              </div>
                              <div
                                className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                                  active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                                }`}
                              >
                                <div className="overflow-hidden">
                                  <p className="text-sm text-muted leading-relaxed mt-2 mb-4">{step.body}</p>
                                  <div className="flex flex-wrap gap-2 pb-1">
                                    {step.points.map((pt, i) => (
                                      <span
                                        key={i}
                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-fg bg-surface border border-line rounded-full px-3 py-1.5"
                                      >
                                        <span className={`w-1.5 h-1.5 rounded-full ${step.accent === 'spottr' ? 'bg-spottr' : 'bg-ice'}`}></span>
                                        {pt}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Auto-advance clock: when the bar fills, the demo moves on.
                              Pausing the animation pauses the whole demo. */}
                          {active && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-line/60">
                              <span
                                key={activeStep}
                                onAnimationEnd={() => setActiveStep((p) => (p + 1) % demoSteps.length)}
                                className="block h-full bg-gradient-to-r from-spottr to-ice animate-progress"
                                style={{ animationPlayState: demoPaused ? 'paused' : 'running' }}
                              />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Phone showing the real screen for the active step */}
                  <div className="justify-self-center order-first md:order-last">
                    <div className="relative isolate">
                      <div className="pointer-events-none absolute inset-0 -z-10 scale-110 rounded-full bg-spottr/10 blur-3xl" />
                      <div className="w-[240px] md:w-[280px] rounded-[2.6rem] border border-line bg-surface p-2 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                        <div className="relative overflow-hidden rounded-[2.1rem] aspect-[720/1561]">
                          {demoSteps.map((step, idx) => (
                            <Image
                              key={step.shot}
                              src={step.shot}
                              alt={step.shotAlt}
                              fill
                              sizes="280px"
                              className={`object-cover transition-opacity duration-500 ${
                                idx === activeStep ? 'opacity-100' : 'opacity-0'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted text-center mt-4 max-w-[280px] mx-auto" aria-live="polite">
                        {demoSteps[activeStep].caption}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Honest differentiators — promises on the left, a real partner
                floor on the right as the proof */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
              <div className="grid lg:grid-cols-[1fr_420px] gap-4 lg:gap-6 items-stretch">
                <div className="flex flex-col gap-4">
                  {differentiators.map((d, i) => (
                    <div key={i} className="flex-1 bg-surface border border-line rounded-xl p-6 flex gap-5 items-start">
                      <div className="shrink-0 w-9 h-9 rounded-lg bg-spottr/10 border border-spottr/20 flex items-center justify-center text-spottr">
                        <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white mb-2">{d.title}</h4>
                        <p className="text-sm text-muted leading-relaxed">{d.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="relative overflow-hidden rounded-xl border border-line min-h-[280px] shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                  <Image
                    src="/web/gym-floor.jpg"
                    alt="Inside Raffa's Gym, a SPOTTR partner floor with racks, plates and dumbbells"
                    fill
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-5 pt-14 pb-4">
                    <p className="text-sm font-semibold text-white">Raffa&apos;s Gym — a SPOTTR partner floor.</p>
                    <p className="text-xs text-[#c9d1d9] mt-1">If it&apos;s not on this floor, it&apos;s not in the workout.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Full-bleed photo band — real weight room, real athletes.
                `isolate` keeps the -z-10 photo above the page background. */}
            <section className="relative isolate overflow-hidden">
              <div className="absolute inset-0 -z-10">
                <Image
                  src="/web/hero-alt.jpg"
                  alt="Athlete strapping in at the rack before a lift"
                  fill
                  sizes="100vw"
                  className="object-cover object-[center_30%]"
                />
                <div className="absolute inset-0 bg-base/45" />
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-base to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-base to-transparent" />
              </div>

              <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
                {/* Frosted panel so the copy stays readable over any part of
                    the photo, including the bright areas. */}
                <div className="inline-block max-w-2xl rounded-[2rem] bg-base/70 backdrop-blur-md border border-white/10 px-7 py-9 md:px-14 md:py-12 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
                  <h2 className="text-xs tracking-widest text-ice uppercase mb-3">Built in the weight room</h2>
                  <h3 className="text-3xl md:text-5xl font-extrabold text-white text-glow mb-5">Never lift alone.</h3>
                  {/* No `text-base` here: the theme has a *color* named `base`,
                      so `text-base` paints the text near-black instead of
                      sizing it. 1rem is the default size anyway. */}
                  <p className="md:text-lg text-[#c9d1d9] max-w-xl mx-auto mb-9 leading-relaxed">
                    SPOTTR was built by athletes who got tired of apps that guess — a coach in your pocket for every
                    session, not a spreadsheet.
                  </p>
                  <Link
                    href="/get?src=site"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-spottr to-ice px-8 py-3.5 text-base font-semibold text-black shadow-[0_20px_70px_rgba(52,208,88,0.28)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Get SPOTTR <span className="text-lg">→</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* For gym owners — the B2B funnel into the partner portal */}
            <section className="max-w-5xl mx-auto px-6 py-24">
              <div className="relative overflow-hidden rounded-[2rem] premium-card shadow-[0_30px_90px_rgba(0,0,0,.32)]">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-spottr/10 blur-3xl" />
                <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12 px-8 py-10 md:px-14 md:py-14">
                  <div className="flex-1">
                    <h2 className="text-xs tracking-widest text-spottr uppercase mb-2">For gym owners</h2>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Put SPOTTR on your gym floor.</h3>
                    <p className="text-base text-muted leading-relaxed max-w-xl mb-6">
                      One QR poster at your front desk. Members scan it and their AI coach instantly builds
                      every workout around your exact equipment — every rack, every machine, nothing they
                      can&apos;t find.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {['Free to apply', 'Print-ready branded poster', 'You control your equipment list'].map((pt) => (
                        <span
                          key={pt}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-fg bg-surface-2 border border-line rounded-full px-3 py-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-spottr"></span>
                          {pt}
                        </span>
                      ))}
                    </div>
                    <a
                      href="https://api.spottrfit.com/partner"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-spottr to-ice px-8 py-3.5 text-base font-semibold text-black shadow-[0_20px_70px_rgba(52,208,88,0.28)] transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      Become a partner gym <span className="text-lg">→</span>
                    </a>
                  </div>
                  <div className="shrink-0 md:w-[300px]">
                    <div className="relative overflow-hidden rounded-2xl border border-line shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                      <Image
                        src="/web/qr-gym.jpg"
                        alt="A SPOTTR scan-to-train QR placard standing on a windowsill at Raffa's Gym"
                        width={1100}
                        height={1375}
                        sizes="(min-width: 768px) 300px, 100vw"
                        className="object-cover w-full h-auto"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 pt-10 pb-3">
                        <p className="text-xs text-[#c9d1d9]">Live at Raffa&apos;s Gym — placard Nº 011.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ABOUT */}
        {activeTab === 'about' && (
          <section className="max-w-4xl mx-auto px-6 py-20 text-left animate-fade">
            <h2 className="text-xs tracking-widest text-spottr uppercase mb-2">Why we built it</h2>
            <h3 className="text-3xl font-bold text-white mb-6">Most fitness apps either guess or charge a fortune.</h3>

            <div className="grid md:grid-cols-[1fr_300px] gap-10 items-start mb-16">
              <div className="space-y-6 text-muted text-base leading-relaxed">
                <p>
                  A great coach is expensive, and most fitness apps hand you a one-size-fits-all spreadsheet or a chatbot
                  that confidently makes things up. Neither knows your gym, your body, or your history — so neither can
                  actually coach you.
                </p>
                <p>
                  SPOTTR is the in-between we wanted ourselves: the structure and accountability of a real strength coach,
                  built on a science-backed engine that never invents exercises, never ignores an injury, and adapts to
                  you every time you train.
                </p>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-line shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                <Image
                  src="/web/founders.jpg"
                  alt="Sam and Grayson Petros in the gym between sets"
                  width={1109}
                  height={1600}
                  sizes="(min-width: 768px) 300px, 100vw"
                  className="object-cover w-full h-auto"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-base/95 to-transparent px-4 pt-12 pb-3">
                  <p className="text-xs text-muted">Sam (right) and Grayson (left) — SPOTTR came from the gym floor, not in a boardroom.</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-line shadow-[0_20px_60px_rgba(0,0,0,0.4)] mb-16 h-56 md:h-72">
              <Image
                src="/web/gym-room.jpg"
                alt="A partner home gym with racks, benches, cardio machines and a whiteboard of PRs"
                fill
                sizes="(min-width: 896px) 896px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pt-12 pb-4">
                <p className="text-xs text-[#c9d1d9]">
                  Real gyms aren&apos;t showrooms. SPOTTR is built for rooms like this one.
                </p>
              </div>
            </div>

            <div className="border-t border-line pt-12">
              <h3 className="text-xs tracking-widest text-muted uppercase mb-8">The team</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-surface border border-line p-8 rounded-xl flex flex-col justify-between shadow-lg relative overflow-hidden group min-h-[300px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-ice/5 rounded-bl-full pointer-events-none group-hover:bg-ice/10 transition-colors"></div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-xl font-bold text-white">Samuel Petros</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-spottr border border-spottr/30 bg-spottr/10 rounded-full px-2 py-0.5">
                        D1 Athlete
                      </span>
                    </div>
                    <span className="text-sm text-ice block mb-4">Founder &amp; Engineer</span>
                    <p className="text-sm text-muted leading-relaxed mb-8">
                      A Division I football player who got tired of fitness apps that don&apos;t train like an athlete.
                      Builds the brains behind SPOTTR — the coaching engine, the AI, and the security that keeps your
                      data yours. Cyber Security and AI &amp; Data Science grad, making sure the app never gives advice
                      it can&apos;t stand behind.
                    </p>
                  </div>
                  <a
                    href="https://www.linkedin.com/in/samuel-petros/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-sm font-semibold text-ice hover:text-white cursor-pointer transition-colors mt-auto"
                  >
                    More about Sam <span className="ml-1.5 transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </div>

                <div className="bg-surface/40 border border-line/50 p-8 rounded-xl flex flex-col justify-between shadow-sm relative opacity-70 select-none min-h-[300px]">
                  <div>
                    <h4 className="text-xl font-semibold text-muted mb-1">Grayson Petros</h4>
                    <span className="text-sm text-spottr/70 block mb-4">Head of Training</span>
                    <p className="text-sm text-muted/80 leading-relaxed">
                      The training mind behind SPOTTR&apos;s programming — how sessions are built, progressed, and kept
                      honest to real strength science.
                    </p>
                  </div>
                  <div className="inline-flex items-center text-sm font-medium text-spottr uppercase tracking-wider mt-auto pt-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-spottr animate-pulse mr-2"></span>
                    Profile coming soon
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* COMMUNITY */}
        {activeTab === 'community' && (
          <section className="max-w-3xl mx-auto px-6 py-20 text-center animate-fade">
            <h2 className="text-xs tracking-widest text-ice uppercase mb-2">Get involved</h2>
            <h3 className="text-2xl font-bold text-white mb-10">Join the SPOTTR community</h3>

            <div className="grid gap-4 max-w-md mx-auto text-left">
              <a
                href="https://discord.gg/zmJJHY5mv7"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between p-4 bg-surface border border-line rounded-lg hover:border-ice/50 transition-all cursor-pointer shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-md bg-ice/10 border border-ice/20 flex items-center justify-center text-ice">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 127.14 96.36">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53a105.73,105.73,0,0,0,32,16.14,79.11,79.11,0,0,0,6.73-11,68.43,68.43,0,0,1-10.61-5.11c.91-.66,1.8-1.34,2.65-2a75.58,75.58,0,0,0,71,0c.85.69,1.74,1.37,2.65,2a68.43,68.43,0,0,1-10.61,5.11,79.11,79.11,0,0,0,6.73,11,105.73,105.73,0,0,0,32-16.14C129.3,54.65,123.5,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-ice transition-colors">Discord</h4>
                    <p className="text-xs text-muted mt-0.5">Talk training, get help, and shape what we build next.</p>
                  </div>
                </div>
                <span className="text-muted group-hover:text-ice text-sm transition-colors mr-1">→</span>
              </a>

              <a
                href="https://www.instagram.com/spottrfitness.app/?utm_source=ig_web_button_share_sheet"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between p-4 bg-surface border border-line rounded-lg hover:border-spottr/50 transition-all cursor-pointer shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-md bg-spottr/10 border border-spottr/20 flex items-center justify-center text-spottr">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-spottr transition-colors">Instagram</h4>
                    <p className="text-xs text-muted mt-0.5">Form tips, progress, and behind-the-scenes on the build.</p>
                  </div>
                </div>
                <span className="text-muted group-hover:text-spottr text-sm transition-colors mr-1">→</span>
              </a>

              <a
                href="https://www.tiktok.com/@spottrfit"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between p-4 bg-surface border border-line rounded-lg hover:border-ice/50 transition-all cursor-pointer shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-md bg-ice/10 border border-ice/20 flex items-center justify-center text-ice">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.6c.27 0 .53.04.78.12V9.66a5.7 5.7 0 0 0-.78-.05 5.7 5.7 0 1 0 5.69 5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.25-1.48z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-ice transition-colors">TikTok</h4>
                    <p className="text-xs text-muted mt-0.5">Quick lifts, form breakdowns, and SPOTTR in action.</p>
                  </div>
                </div>
                <span className="text-muted group-hover:text-ice text-sm transition-colors mr-1">→</span>
              </a>
            </div>
          </section>
        )}

        {/* WAITLIST */}
        {activeTab === 'waitlist' && (
          <section className="max-w-3xl mx-auto px-6 py-24 text-center animate-fade">
            <h2 className="text-xs tracking-widest text-spottr uppercase mb-2">Early access</h2>
            <h3 className="text-3xl font-bold text-white mb-6">Be first in line</h3>
            <p className="text-base text-muted max-w-xl mx-auto mb-10 leading-relaxed">
              Drop your email and we&apos;ll let you know the moment SPOTTR opens up. No spam — just the invite.
            </p>

            <form
              onSubmit={handleWaitlistSubmit}
              className="max-w-md mx-auto p-2 sm:p-1 bg-surface border border-line rounded-lg flex flex-col sm:flex-row items-center shadow-xl gap-2 sm:gap-0"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status.type === 'loading'}
                placeholder="you@email.com"
                className="bg-transparent text-white px-4 py-3 w-full focus:outline-none text-sm placeholder-muted disabled:opacity-50 text-center sm:text-left"
                required
              />
              <button
                type="submit"
                disabled={status.type === 'loading'}
                className="bg-spottr hover:bg-spottr-deep disabled:opacity-50 whitespace-nowrap text-black font-semibold text-sm px-6 py-3 sm:py-2.5 rounded-md transition-colors w-full sm:w-auto sm:mr-1 cursor-pointer"
              >
                {status.type === 'loading' ? 'Joining…' : 'Join'}
              </button>
            </form>

            {status.message && (
              <p className={`text-xs mt-4 font-medium ${status.type === 'error' ? 'text-[#ff7b72]' : 'text-spottr'}`}>
                {status.message}
              </p>
            )}

            {waitlistCount >= WAITLIST_THRESHOLD ? (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-muted bg-surface/80 border border-line max-w-full w-fit mx-auto px-4 py-2.5 rounded-full shadow-md select-none">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-spottr to-spottr-deep border-2 border-surface"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-ice to-ice-deep border-2 border-surface"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-spottr to-ice border-2 border-surface"></div>
                </div>
                <span>
                  Join <span className="text-white font-bold tracking-wide">{waitlistCount.toLocaleString()}</span>{' '}
                  lifters on the early-access list
                </span>
              </div>
            ) : (
              <div className="mt-10 flex items-center justify-center gap-2.5 text-xs sm:text-sm text-muted bg-surface/80 border border-line max-w-full w-fit mx-auto px-4 py-2.5 rounded-full shadow-md select-none">
                <span className="w-2 h-2 rounded-full bg-spottr animate-pulse"></span>
                <span>
                  <span className="text-white font-bold">Founding access</span> — get in before we open to everyone
                </span>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-base px-6 py-6 text-center text-xs text-muted">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 SPOTTR · Never lift alone.</p>
          <div className="flex space-x-6">
            <a href="https://api.spottrfit.com/partner" className="hover:text-white">
              Gym Partners
            </a>
            <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('community')}>
              Community
            </span>
            <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('about')}>
              About
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

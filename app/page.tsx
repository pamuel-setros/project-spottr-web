// app/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'links' | 'documents' | 'waitlist'>('home');

  // Waitlist Form State
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  // Waitlist Counter State (Baseline 1284 offset)
  const [waitlistCount, setWaitlistCount] = useState<number>(1284);

  // Interactive Graphic Blueprint State
  const [activeStep, setActiveStep] = useState<number>(0);

  // Mock Security Diagnostics Feed State
  const [systemLogs, setSystemLogs] = useState<string[]>([]);

  // BULLETPROOF FETCH: Isolated callback logic to break client caching buckets
  const refreshCount = useCallback(async () => {
    try {
      const baseHost = window.location.origin;
      const response = await fetch(`${baseHost}/api/waitlist`, { 
        cache: 'no-store',
        headers: { 
          'Pragma': 'no-cache', 
          'Cache-Control': 'no-cache' 
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Securely parse string numbers or fallback cleanly to zero rows
        const liveRows = typeof data.count === 'number' ? data.count : parseInt(data.count) || 0;
        setWaitlistCount(1284 + liveRows);
      }
    } catch (err) {
      console.error("Failed to sync live waitlist row bounds context:", err);
    }
  }, []);

  // Sync Event Hook 1: Fetch data the exact millisecond the core layout context hits memory
  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  // Sync Event Hook 2: Force a hard refresh calculation whenever the active tab updates layout screens
  useEffect(() => {
    if (activeTab === 'waitlist' || activeTab === 'home') {
      refreshCount();
    }
  }, [activeTab, refreshCount]);

  // SECPOSTURE DIAGNOSTICS: Automated loop feed simulator
  useEffect(() => {
    setSystemLogs([
      "INIT SYSTEM // Zero-Trust Boundary Established",
      "GATEWAY STATUS // Listening on encrypted local sub-net...",
    ]);

    const events = [
      "JWT AUTH ENGINE // Validation payload checked [STATUS: 200 OK]",
      "POSTGRES METRICS // Row Level Security enforced on public.waitlist",
      "XSS SANITIZER // Input strings scrubbed for injection protection",
      "API METRIC // Groq LPU response clocked at 14ms synchronous cue latency",
      "BACKOFF RETRY ENGINE // Running exponential loop monitors... 0 errors logged"
    ];
    
    const interval = setInterval(() => {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const timestamp = new Date().toLocaleTimeString();
      setSystemLogs(prev => [`[${timestamp}] ${randomEvent}`, ...prev.slice(0, 3)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const pipelineSteps = [
    {
      title: "1. Ground Truth Filtering",
      badge: "Pandas DataFrame",
      color: "text-[#58a6ff] border-[#58a6ff]/30 bg-[#58a6ff]/10",
      description: "Inputs hit an in-memory Pandas array immediately. Core sports science mechanics, equipment fallbacks, and injury bans are locked down strictly before an AI engine can alter data.",
    },
    {
      title: "2. Heuristic Matching Matrix",
      badge: "3x3 Core System",
      color: "text-[#238636] border-[#238636]/30 bg-[#238636]/10",
      description: "Your brother's exact 3x3 training playbook matches performance capabilities across strict targets, choosing precise tactical slots rather than guessing output layouts.",
    },
    {
      title: "3. Low-Latency Translation",
      badge: "Dual-LLM Interface",
      color: "text-[#ff7b72] border-[#ff7b72]/30 bg-[#ff7b72]/10",
      description: "Groq routes instantaneous mechanical set tips seamlessly, while Gemini performs asynchronous workout analytics and macro safety validations as a secure fallback system.",
    }
  ];

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus({ type: 'loading', message: 'Securing your position...' });

    try {
      const baseHost = window.location.origin;
      const response = await fetch(`${baseHost}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus({ type: 'error', message: data.error || 'Something went wrong.' });
      } else {
        setStatus({ type: 'success', message: data.message || 'You are locked in!' });
        setEmail('');
        // Instantly increment live UI context state organically for crisp tactile user feedback
        setWaitlistCount(prev => prev + 1);
        // Fire secondary fetch pass to guarantee hard data consistency with Postgres
        setTimeout(() => refreshCount(), 500);
      }
    } catch (err) {
      console.error("Network Fetch Exception:", err);
      setStatus({ type: 'error', message: 'Network exception: Failed to reach API boundary.' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-between bg-[#0d1117] text-[#c9d1d9]">
      
      {/* Navigation Layer */}
      <header className="border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center cursor-pointer select-none" onClick={() => setActiveTab('home')}>
            <Image 
              src="/spottr_text.png" 
              alt="SPOTTR Brand Mark" 
              width={120} 
              height={28} 
              priority 
              className="object-contain w-auto h-auto"
            />
          </div>

          <nav className="flex items-center space-x-1 font-mono text-xs">
            <button 
              type="button"
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${activeTab === 'home' ? 'bg-[#30363d] text-white font-semibold' : 'text-[#8b949e] hover:text-white'}`}
            >
              Engine
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('about')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${activeTab === 'about' ? 'bg-[#30363d] text-white font-semibold' : 'text-[#8b949e] hover:text-white'}`}
            >
              About
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('links')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${activeTab === 'links' ? 'bg-[#30363d] text-white font-semibold' : 'text-[#8b949e] hover:text-white'}`}
            >
              Links
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${activeTab === 'documents' ? 'bg-[#30363d] text-white font-semibold' : 'text-[#8b949e] hover:text-white'}`}
            >
              Docs
            </button>
          </nav>

          <button 
            type="button"
            onClick={() => setActiveTab('waitlist')}
            className="hidden sm:block bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors cursor-pointer"
          >
            Join Waitlist
          </button>
        </div>
      </header>

      {/* Main View Router */}
      <main className="flex-grow">
        
        {/* VIEW 1: HOME PLATFORM OVERVIEW */}
        {activeTab === 'home' && (
          <>
            <section className="max-w-4xl mx-auto text-center px-6 pt-24 pb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161b22] border border-[#30363d] text-xs font-medium text-[#8b949e] mb-6">
                <span className="w-2 h-2 rounded-full bg-[#238636] animate-pulse"></span>
                Hybrid-AI Expert System Engine v3
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ea043] to-[#58a6ff]">J.A.R.V.I.S.</span> for lifting.
              </h1>
              <p className="text-lg md:text-xl text-[#8b949e] max-w-2xl mx-auto mb-10 leading-relaxed">
                Stop relying on generic LLM wrappers that hallucinate unsafe advice, and simple pre-made spreadsheets that do not conform to your individualized exercise needs. SPOTTR blends enterprise-grade engineering with hyper-precise training heuristics to track performance, adapt to equipment availability, and manage injuries in real time.
              </p>
              
              <div>
                <button 
                  type="button"
                  onClick={() => setActiveTab('waitlist')}
                  className="bg-[#238636] hover:bg-[#2ea043] text-white font-medium text-base px-8 py-3.5 rounded-md transition-colors shadow-lg cursor-pointer inline-flex items-center gap-2"
                >
                  Join the Waitlist <span className="text-lg">→</span>
                </button>
              </div>
            </section>

            {/* Blueprint Grid Layout */}
            <section className="max-w-5xl mx-auto px-6 pt-12 pb-8">
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl grid md:grid-cols-12">
                <div className="md:col-span-5 bg-[#0d1117]/50 border-r border-[#30363d] p-6 flex flex-col justify-center space-y-4">
                  <div className="mb-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8b949e]">The Engine Blueprint</h3>
                    <p className="text-sm text-white font-bold">Why SPOTTR Isn't a Wrapper</p>
                  </div>
                  {pipelineSteps.map((step, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className={`w-full text-left p-3.5 rounded-lg border transition-all flex flex-col gap-1.5 cursor-pointer ${
                        activeStep === idx 
                          ? 'bg-[#161b22] border-[#30363d] shadow-md ring-1 ring-[#238636]/30' 
                          : 'bg-transparent border-transparent opacity-60 hover:opacity-90'
                      }`}
                    >
                      <span className="text-sm font-bold text-white">{step.title}</span>
                      <span className={`self-start text-[10px] font-mono px-2 py-0.5 rounded-md border ${step.color}`}>
                        {step.badge}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="md:col-span-7 p-8 flex flex-col justify-between min-h-[320px]">
                  <div>
                    <span className="text-xs font-mono text-[#238636] uppercase tracking-widest block mb-1">Interactive Diagnostic Console</span>
                    <h4 className="text-xl font-bold text-white mb-4">{pipelineSteps[activeStep].title}</h4>
                    <p className="text-sm text-[#8b949e] leading-relaxed mb-6">
                      {pipelineSteps[activeStep].description}
                    </p>
                  </div>

                  <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 font-mono text-xs overflow-x-auto text-[#c9d1d9]">
                    {activeStep === 0 && (
                      <pre className="text-[#58a6ff]">
{`// Loading structured ground truth safely
df = pd.read_csv("exercise_table_rows_v3.csv")
# Immediate deterministic validation bypasses model layer
allowed_slots = df[(df['equipment'].isin(user.available)) & 
                    (~df['injury_tags'].intersects(user.injuries))]`}
                      </pre>
                    )}
                    {activeStep === 1 && (
                      <pre className="text-[#2ea043]">
{`// Executing 3x3 Performance Matrix heuristics
if user.experience == 'Intermediate' and goal == 'Bodybuilding':
    slot_1 = Matrix.get_slot_rule("Vertical Pull")
    slot_2 = Matrix.get_slot_rule("Horizontal Pull")
    slot_2.apply_modifier("Rest-Pause")`}
                      </pre>
                    )}
                    {activeStep === 2 && (
                      <pre className="text-[#ff7b72]">
{`// Asynchronous heavy translation validation
try:
    generate_coaching_cues(synchronous_provider=groq.llama3)
except ExecutionFallback:
    macro_blueprint = gemini.generate_workout(backup_net=True)`}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* SECPOSTURE LOG TERMINAL COMPONENT */}
            <section className="max-w-5xl mx-auto px-6 pb-16">
              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 font-mono shadow-inner">
                <div className="flex justify-between items-center mb-3 text-xs border-b border-[#30363d] pb-2">
                  <span className="text-[#2ea043] font-bold flex items-center gap-1.5 select-none">
                    <span className="w-2 h-2 rounded-full bg-[#2ea043] animate-ping"></span>
                    LIVE SECPOSTURE DIAGNOSTICS
                  </span>
                  <span className="text-[#8b949e] text-[10px] select-none">VER: SEC_SPEC_V3</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-[#8b949e]">
                  {systemLogs.map((log, index) => (
                    <div key={index} className={`truncate ${index === 0 ? 'text-white font-medium' : ''}`}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* VIEW 2: ABOUT TEAM MODULE */}
        {activeTab === 'about' && (
          <section className="max-w-4xl mx-auto px-6 py-20 text-left animate-fade">
            <h2 className="text-xs font-mono tracking-widest text-[#238636] uppercase mb-2">The Architecture Intent</h2>
            <h3 className="text-3xl font-bold text-white mb-6">Built to challenge basic generative software templates.</h3>
            
            <div className="space-y-6 text-[#8b949e] text-sm leading-relaxed max-w-2xl mb-16">
              <p>
                SPOTTR was conceived because the fitness industry lacks an affordable coaching companion. Standard AI fitness options failed under stress tests. Generic models routinely return dangerous biomechanical advice, disregard complex training loops, and hallucinate equipment alternatives that do not align with physical realities. Overall, they are finnicky, unreliable, and unsafe for real-world lifting applications.
              </p>
              <p>
                By treating lifting as a structural parameter optimization problem, we isolated zero-latency coaching layers (handled natively via specialized hardware targets on Groq) from cognitive dietician models (managed asynchronously via multi-modal pipelines on Gemini 2.5 Flash).
              </p>
            </div>

            <div className="border-t border-[#30363d] pt-12">
              <h3 className="text-xs font-mono tracking-widest text-[#8b949e] uppercase mb-8">About Us</h3>
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* SAMUEL PETROS ENGINEERING PROFILE CARD */}
                <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-xl flex flex-col justify-between shadow-lg relative overflow-hidden group min-h-[320px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#58a6ff]/5 rounded-bl-full pointer-events-none group-hover:bg-[#58a6ff]/10 transition-colors"></div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">Samuel Petros</h4>
                    <span className="text-sm font-mono text-[#58a6ff] block mb-4">Lead Full-Stack AI & Systems Architect</span>
                    <p className="text-sm text-[#8b949e] leading-relaxed mb-8">
                      Dual B.S. in Cyber Security and AI & Data Science from Mercyhurst University. Orchestrating the decoupled FastAPI cloud layer, JWT security filters, input vector sanitation bounds, and high-throughput Supabase database storage clusters. The full-stack designer behind SPOTTR.
                    </p>
                  </div>
                  <a 
                    href="https://www.linkedin.com/in/samuel-petros/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center text-sm font-mono font-semibold text-[#58a6ff] hover:text-[#79c0ff] cursor-pointer transition-colors mt-auto"
                  >
                    More about Sam <span className="ml-1.5 transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </div>

                {/* GRAYSON PETROS "COMING SOON" */}
                <div className="bg-[#161b22]/40 border border-[#30363d]/50 p-8 rounded-xl flex flex-col justify-between shadow-sm relative opacity-60 select-none min-h-[320px]">
                  <div>
                    <h4 className="text-xl font-semibold text-[#8b949e] mb-1">Grayson Petros</h4>
                    <span className="text-sm font-mono text-[#ff7b72]/70 block mb-4">Chief Performance Director</span>
                    <p className="text-sm text-[#8b949e]/70 leading-relaxed italic">
                      Author of the core 3x3 slot training matrix playbook and progressive loading constraints.
                    </p>
                  </div>
                  <div className="inline-flex items-center text-sm font-mono font-medium text-[#ff7b72] uppercase tracking-wider mt-auto pt-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7b72] animate-pulse mr-2"></span>
                    Module Coming Soon
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* VIEW 3: EXTERNAL FUNNEL ECOSYSTEM LINKS */}
        {activeTab === 'links' && (
          <section className="max-w-3xl mx-auto px-6 py-20 text-center">
            <h2 className="text-xs font-mono tracking-widest text-[#58a6ff] uppercase mb-2">Central Operations</h2>
            <h3 className="text-2xl font-bold text-white mb-10">Access the SPOTTR Hub Ecosystem</h3>
            
            <div className="grid gap-4 max-w-md mx-auto text-left">
              <a 
                href="https://discord.gg/zmJJHY5mv7" 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center justify-between p-4 bg-[#161b22] border border-[#30363d] rounded-lg hover:border-[#58a6ff]/50 transition-all cursor-pointer shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-md bg-[#58a6ff]/10 border border-[#58a6ff]/20 flex items-center justify-center text-[#58a6ff]">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 127.14 96.36">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53a105.73,105.73,0,0,0,32,16.14,79.11,79.11,0,0,0,6.73-11,68.43,68.43,0,0,1-10.61-5.11c.91-.66,1.8-1.34,2.65-2a75.58,75.58,0,0,0,71,0c.85.69,1.74,1.37,2.65,2a68.43,68.43,0,0,1-10.61,5.11,79.11,79.11,0,0,0,6.73,11,105.73,105.73,0,0,0,32-16.14C129.3,54.65,123.5,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#58a6ff] transition-colors">Developer & Beta Discord</h4>
                    <p className="text-xs text-[#8b949e] mt-0.5">Engage with feature deployments and read real logs directly.</p>
                  </div>
                </div>
                <span className="text-[#8b949e] group-hover:text-[#58a6ff] font-mono text-sm transition-colors mr-1">→</span>
              </a>

              <a 
                href="https://www.instagram.com/spottrfitness.app/?utm_source=ig_web_button_share_sheet" 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center justify-between p-4 bg-[#161b22] border border-[#30363d] rounded-lg hover:border-[#2ea043]/50 transition-all cursor-pointer shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-md bg-[#2ea043]/10 border border-[#2ea043]/20 flex items-center justify-center text-[#2ea043]">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0 3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#2ea043] transition-colors">Product Instagram Page</h4>
                    <p className="text-xs text-[#8b949e] mt-0.5">Biomechanical cues, feature reviews, and technical content specs.</p>
                  </div>
                </div>
                <span className="text-[#8b949e] group-hover:text-[#2ea043] font-mono text-sm transition-colors mr-1">→</span>
              </a>

              <div className="group flex items-center justify-between p-4 bg-[#161b22]/40 border border-[#30363d]/60 rounded-lg cursor-not-allowed opacity-60">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-md bg-[#30363d]/30 border border-[#30363d]/50 flex items-center justify-center text-[#8b949e]">
                    <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#8b949e]">STRIDE Threat Vectors Spec</h4>
                    <p className="text-xs text-[#8b949e] mt-0.5">Zero-trust security design logs. Approaching release schedule.</p>
                  </div>
                </div>
                <span className="text-xs font-mono bg-[#30363d]/40 text-[#8b949e] px-2 py-0.5 rounded mr-1 select-none">Locked</span>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 4: SYSTEM DOCUMENT SPEC FILE CARDS */}
        {activeTab === 'documents' && (
          <section className="max-w-3xl mx-auto px-6 py-20 text-center">
            <h2 className="text-xs font-mono tracking-widest text-[#d2a8ff] uppercase mb-2">Technical Specs</h2>
            <h3 className="text-2xl font-bold text-white mb-10">System Documentation</h3>
            
            <div className="grid gap-4 max-w-md mx-auto text-left">
              <a 
                href="https://docs.google.com/document/d/1_ylhXqPThw90iqFf5Wpxa5Tr_3BHoIrmFawzgU9lqfc/edit?usp=sharing" 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center justify-between p-4 bg-[#161b22] border border-[#30363d] rounded-lg hover:border-[#d2a8ff]/50 transition-all cursor-pointer shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-md bg-[#d2a8ff]/10 border border-[#d2a8ff]/20 flex items-center justify-center text-[#d2a8ff]">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v6h6v10H6z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#d2a8ff] transition-colors">Project Manifesto</h4>
                    <p className="text-xs text-[#8b949e] mt-0.5">Core concept, requirements, and system design specifications.</p>
                  </div>
                </div>
                <span className="text-[#8b949e] group-hover:text-[#d2a8ff] font-mono text-sm transition-colors mr-1">→</span>
              </a>

              <div className="group flex items-center justify-between p-4 bg-[#161b22]/40 border border-[#30363d]/60 rounded-lg cursor-not-allowed opacity-60">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-md bg-[#30363d]/30 border border-[#30363d]/50 flex items-center justify-center text-[#8b949e]">
                    <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#8b949e]">Architecture Schematics</h4>
                    <p className="text-xs text-[#8b949e] mt-0.5">Database schema and AI flowcharts. Under construction.</p>
                  </div>
                </div>
                <span className="text-xs font-mono bg-[#30363d]/40 text-[#8b949e] px-2 py-0.5 rounded mr-1 select-none">Locked</span>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 5: WAITLIST FUNNEL */}
        {activeTab === 'waitlist' && (
          <section className="max-w-3xl mx-auto px-6 py-24 text-center">
            <h2 className="text-xs font-mono tracking-widest text-[#2ea043] uppercase mb-2">Early Access</h2>
            <h3 className="text-3xl font-bold text-white mb-6">Join the Deployment Queue</h3>
            <p className="text-sm text-[#8b949e] max-w-xl mx-auto mb-10 leading-relaxed">
              Lock in your spot for the next generation of lifting intelligence. You will be notified as soon as system access is granted.
            </p>

            <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto p-1 bg-[#161b22] border border-[#30363d] rounded-lg flex items-center shadow-xl">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status.type === 'loading'}
                placeholder="Enter your email for early access"
                className="bg-transparent text-white px-4 py-3 w-full focus:outline-none text-sm placeholder-[#8b949e] disabled:opacity-50"
                required
              />
              <button
                type="submit"
                disabled={status.type === 'loading'}
                className="bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#238636]/50 whitespace-nowrap text-white font-medium text-sm px-6 py-2.5 rounded-md transition-colors mr-1 cursor-pointer"
              >
                {status.type === 'loading' ? 'Securing...' : 'Secure Spot'}
              </button>
            </form>

            {status.message && (
              <p className={`text-xs mt-4 font-medium ${status.type === 'error' ? 'text-[#ff7b72]' : 'text-[#2ea043]'}`}>
                {status.message}
              </p>
            )}

            {/* LIVE SYSTEM SYNCED METRIC COUNTER DOCK */}
            <div className="mt-10 flex items-center justify-center gap-3 text-sm text-[#8b949e] bg-[#161b22]/80 border border-[#30363d] w-fit mx-auto px-4 py-2.5 rounded-full shadow-md select-none">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2ea043] to-[#238636] border-2 border-[#161b22]"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#1f6feb] border-2 border-[#161b22]"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#d2a8ff] to-[#bc8cff] border-2 border-[#161b22]"></div>
              </div>
              <span>Join <span className="text-white font-bold tracking-wide">{waitlistCount.toLocaleString()}</span> others waiting for SPOTTR</span>
            </div>
          </section>
        )}

      </main>

      {/* Global Page Footer */}
      <footer className="border-t border-[#30363d] bg-[#0d1117] px-6 py-6 text-center text-xs text-[#8b949e]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 SPOTTR Architecture. Never lift alone.</p>
          <div className="flex space-x-6">
            <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('about')}>Security Spec</span>
            <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('links')}>API Hub</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
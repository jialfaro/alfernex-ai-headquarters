'use client';

import React, { useEffect, useState } from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import { Sparkles, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { soundFX } from '../audio/soundEffects';

export const IntroSplash: React.FC = () => {
  const isIntroFinished = useOfficeStore((s) => s.isIntroFinished);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);
  const setIntroFinished = useOfficeStore((s) => s.setIntroFinished);

  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isIntroFinished) return;

    soundFX.playIntroRiser(soundEnabled);

    const timer1 = setTimeout(() => setStep(1), 600);
    const timer2 = setTimeout(() => setStep(2), 1400);
    const timer3 = setTimeout(() => setStep(3), 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isIntroFinished, soundEnabled]);

  if (isIntroFinished) return null;

  const handleEnter = () => {
    soundFX.playSuccess(soundEnabled);
    setIntroFinished(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030611] p-6 text-center select-none overflow-hidden">
      {/* Background Cyber Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15)_0%,rgba(3,6,17,0.98)_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0284c715_1px,transparent_1px),linear-gradient(to_bottom,#0284c715_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 max-w-xl">
        {/* Holographic Logo Shield */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-sky-400/60 bg-gradient-to-br from-sky-500/20 via-indigo-600/30 to-purple-600/20 shadow-[0_0_50px_rgba(56,189,248,0.4)] animate-pulse">
          <Sparkles className="h-10 w-10 text-sky-300" />
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-indigo-100 to-purple-200 font-mono">
          ALFERNEX
        </h1>

        {/* AI Headquarters Badge */}
        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-indigo-500/10 px-4 py-1 text-xs font-black tracking-widest text-sky-300 font-mono shadow-[0_0_20px_rgba(56,189,248,0.25)]">
          <Cpu className="h-3.5 w-3.5 text-sky-400" />
          <span>AI HEADQUARTERS // AUTONOMOUS ENTERPRISE</span>
        </div>

        {/* Welcome Tagline */}
        <div className="mt-6 space-y-1">
          <p className="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-300 italic">
            &ldquo;Where Intelligence Works.&rdquo;
          </p>
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            SMART GADGETS &bull; TECH &bull; INNOVATION
          </p>
        </div>

        {/* System Checks Telemetry */}
        <div className="mx-auto mt-8 max-w-sm rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-mono text-xs text-left space-y-2 shadow-inner">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Neural Mesh Architecture
            </span>
            <span className={step >= 1 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
              {step >= 1 ? '[ ONLINE ]' : 'SYNCING...'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-sky-400" /> 12 Corporate Sectors
            </span>
            <span className={step >= 2 ? 'text-sky-400 font-bold' : 'text-slate-600'}>
              {step >= 2 ? '[ MAPPED ]' : 'LOADING...'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-purple-400" /> 10 Autonomous AI Agents
            </span>
            <span className={step >= 3 ? 'text-purple-400 font-bold' : 'text-slate-600'}>
              {step >= 3 ? '[ READY ]' : 'INITIALIZING...'}
            </span>
          </div>
        </div>

        {/* Enter Button */}
        <div className="mt-8">
          <button
            onClick={handleEnter}
            className="group inline-flex items-center gap-3 rounded-2xl border-2 border-sky-400 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 px-8 py-4 text-sm font-black tracking-widest text-white shadow-[0_0_40px_rgba(56,189,248,0.5)] hover:brightness-110 active:scale-95 transition"
          >
            <span>ENTER VIRTUAL HEADQUARTERS</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        <div className="mt-4 text-[11px] font-mono text-slate-500">
          SMART GADGETS | TECH | INNOVATION &bull; ALFERNEX CORP. 2026
        </div>
      </div>
    </div>
  );
};

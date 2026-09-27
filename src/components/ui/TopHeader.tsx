'use client';

import React from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import {
  Users,
  Activity,
  CheckCircle2,
  Clock,
  Plus,
  Volume2,
  VolumeX,
  Crosshair,
  RotateCcw,
  Sparkles,
  Layers,
  Globe2,
  Users2,
  ArrowLeft,
  Crown,
  Gamepad2,
  Mic
} from 'lucide-react';
import { soundFX } from '../audio/soundEffects';
import { SupportedLanguage } from '../../types/office';

export const TopHeader: React.FC = () => {
  const agents = useOfficeStore((s) => s.agents);
  const selectedAgentId = useOfficeStore((s) => s.selectedAgentId);
  const camera = useOfficeStore((s) => s.camera);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);
  const shopifyMetrics = useOfficeStore((s) => s.shopifyMetrics);
  const hqMetrics = useOfficeStore((s) => s.hqMetrics);
  const activeMeeting = useOfficeStore((s) => s.activeMeeting);
  const languagePreference = useOfficeStore((s) => s.languagePreference);
  const viewMode = useOfficeStore((s) => s.viewMode);
  const setViewMode = useOfficeStore((s) => s.setViewMode);
  const appVersion = useOfficeStore((s) => s.appVersion);
  const setAppVersion = useOfficeStore((s) => s.setAppVersion);

  const resetCamera = useOfficeStore((s) => s.resetCamera);
  const toggleFollowAgent = useOfficeStore((s) => s.toggleFollowAgent);
  const toggleSound = useOfficeStore((s) => s.toggleSound);
  const setCreateAgentModalOpen = useOfficeStore((s) => s.setCreateAgentModalOpen);
  const setMeetingModalOpen = useOfficeStore((s) => s.setMeetingModalOpen);
  const setLanguagePreference = useOfficeStore((s) => s.setLanguagePreference);
  const returnToHQ = useOfficeStore((s) => s.returnToHQ);
  const enterCeoOffice = useOfficeStore((s) => s.enterCeoOffice);
  const startVoiceSession = useOfficeStore((s) => s.startVoiceSession);
  const voiceSession = useOfficeStore((s) => s.voiceSession);

  const isFollowing = !!camera.followingAgentId;
  const selectedAgent = agents.find((a) => a.id === selectedAgentId);
  const isOfficeMode = camera.viewMode === 'office';
  const focusedAgent = agents.find((a) => a.id === camera.focusedOfficeAgentId);

  return (
    <header className="relative z-30 flex flex-wrap items-center justify-between gap-3 border-b border-sky-500/20 bg-[#050711]/95 px-4 py-2.5 backdrop-blur-xl shadow-2xl">
      {/* Brand & Luxury Headquarters Identity */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-sky-400/40 bg-gradient-to-br from-sky-500/25 via-indigo-600/20 to-purple-700/30 shadow-[0_0_20px_rgba(56,189,248,0.35)]">
          <Sparkles className="h-5 w-5 text-sky-300 animate-pulse" />
          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#050711] shadow-[0_0_10px_#34d399]" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-300 font-mono">
              ALFERNEX
            </span>
            <span className="rounded-md bg-gradient-to-r from-sky-500/20 to-purple-500/20 px-2 py-0.5 text-[10px] font-extrabold tracking-widest text-sky-300 border border-sky-400/40 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
              AI HEADQUARTERS
            </span>
            {isOfficeMode && (
              <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/40 animate-pulse">
                OFFICE: {focusedAgent?.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10.5px] font-medium tracking-wider text-slate-400">
            <span className="text-sky-400/90 font-semibold italic">Where Intelligence Works.</span>
            <span className="text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-400">SMART GADGETS | TECH | INNOVATION</span>
          </div>
        </div>
      </div>

      {/* Corporate Telemetry HUD (Autonomous HQ status) */}
      <div className="hidden xl:flex items-center gap-4 rounded-xl border border-sky-500/20 bg-slate-950/80 px-4 py-1.5 shadow-[inset_0_1px_10px_rgba(0,0,0,0.8)] backdrop-blur-md">
        {/* Agents Online */}
        <div className="flex items-center gap-2 border-r border-slate-800 pr-3.5">
          <Users className="h-3.5 w-3.5 text-sky-400" />
          <div className="text-xs">
            <span className="text-slate-400 text-[9.5px] uppercase tracking-wider block leading-none">Agents Online</span>
            <span className="font-bold text-white font-mono">{hqMetrics.agentsOnline}</span>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="flex items-center gap-2 border-r border-slate-800 pr-3.5">
          <Activity className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
          <div className="text-xs">
            <span className="text-slate-400 text-[9.5px] uppercase tracking-wider block leading-none">Active Tasks</span>
            <span className="font-bold text-sky-300 font-mono">{hqMetrics.activeTasks}</span>
          </div>
        </div>

        {/* Completed Today */}
        <div className="flex items-center gap-2 border-r border-slate-800 pr-3.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
          <div className="text-xs">
            <span className="text-slate-400 text-[9.5px] uppercase tracking-wider block leading-none">Completed Today</span>
            <span className="font-bold text-purple-300 font-mono">{hqMetrics.completedToday}</span>
          </div>
        </div>

        {/* AI Utilization */}
        <div className="flex items-center gap-2 border-r border-slate-800 pr-3.5">
          <Clock className="h-3.5 w-3.5 text-amber-400" />
          <div className="text-xs">
            <span className="text-slate-400 text-[9.5px] uppercase tracking-wider block leading-none">AI Utilization</span>
            <span className="font-bold text-amber-300 font-mono">{hqMetrics.aiUtilization}%</span>
          </div>
        </div>

        {/* Shopify Real Revenue */}
        <div className="flex items-center gap-2 border-r border-slate-800 pr-3.5">
          <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          <div className="text-xs">
            <span className="text-slate-400 text-[9.5px] uppercase tracking-wider block leading-none">Ventas Reales</span>
            <span className="font-bold text-emerald-400 font-mono">S/. {shopifyMetrics.gross_revenue_pen.toFixed(0)}</span>
          </div>
        </div>

        {/* System Status */}
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
          <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-widest uppercase">
            ● OPERATIONAL
          </span>
        </div>
      </div>

      {/* Action Controls & Toggles */}
      <div className="flex items-center gap-2">
        {/* Return to HQ button (if inside an agent personal luxury office) */}
        {isOfficeMode && (
          <button
            onClick={() => {
              returnToHQ();
              soundFX.playClick(soundEnabled);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-400 bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-500/30 transition animate-pulse"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>RETURN TO HQ</span>
          </button>
        )}

        {/* Version Switcher: SIM (3D Life-Simulation) vs V2 (ArchViz Realista) vs V1 (Campus Clásico) */}
        <div className="flex items-center rounded-xl border border-sky-500/40 bg-gradient-to-r from-indigo-950/50 via-slate-900 to-sky-950/50 p-1 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
          <button
            onClick={() => {
              setAppVersion('sim');
              soundFX.playSuccess(soundEnabled);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-black transition ${
              appVersion === 'sim'
                ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Modo Life-Simulation 3D: Torre Corporativa con robots autónomos, necesidades y vistas Dollhouse / Piso"
          >
            <Gamepad2 className="h-3.5 w-3.5" />
            <span>🎮 LIFE-SIM 3D</span>
          </button>

          <button
            onClick={() => {
              setAppVersion('v2');
              soundFX.playSuccess(soundEnabled);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-black transition ${
              appVersion === 'v2'
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Versión V2: ArchViz Fotorealista 8K, iluminación y tour cinematográfico de 10 espacios"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>🏢 ARCHVIZ V2</span>
          </button>

          <button
            onClick={() => {
              setAppVersion('v1');
              soundFX.playClick(soundEnabled);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-black transition ${
              appVersion === 'v1'
                ? 'bg-sky-500/30 text-sky-200 border border-sky-400/50 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Versión V1 Guardada: Campus Clásico / 2.5D Isométrico"
          >
            <span>📐 V1 CAMPUS</span>
          </button>
        </div>

        {/* 3D Realista vs 2.5D Mode Toggle (For V1 mode) */}
        {appVersion === 'v1' && (
          <button
            onClick={() => {
              setViewMode(viewMode === '3d' ? '2.5d' : '3d');
              soundFX.playClick(soundEnabled);
            }}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-black transition-all shadow-md ${
              viewMode === '3d'
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
            }`}
            title="Alternar entre Vista 3D Realista (WebGL) y 2.5D Isométrica"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>{viewMode === '3d' ? '3D REALISTA' : '2.5D CLÁSICO'}</span>
          </button>
        )}

        {/* CEO Presidential Suite Trigger */}
        <button
          onClick={() => {
            enterCeoOffice();
            soundFX.playClick(soundEnabled);
          }}
          className="flex items-center gap-1.5 rounded-lg border border-amber-400/60 bg-gradient-to-r from-amber-500/20 via-yellow-500/25 to-amber-600/20 px-3 py-1.5 text-xs font-black text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:brightness-110 active:scale-95 transition"
          title="Despacho del Gerente General & Dueño (Alexis) - Emitir Directivas Prioritarias"
        >
          <Crown className="h-3.5 w-3.5 text-amber-400" />
          <span>DESPACHO CEO</span>
        </button>

        {/* Boardroom Collaboration Meeting trigger */}
        <button
          onClick={() => {
            setMeetingModalOpen(true);
            soundFX.playClick(soundEnabled);
          }}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all shadow-md ${
            activeMeeting
              ? 'border-purple-400 bg-purple-600/30 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse'
              : 'border-slate-800 bg-slate-900/90 text-slate-300 hover:border-purple-500/40 hover:text-white'
          }`}
          title="Executive Boardroom & Multi-Agent Collaboration Pipeline"
        >
          <Users2 className="h-3.5 w-3.5 text-purple-400" />
          <span className="hidden sm:inline">
            {activeMeeting ? 'MEETING IN SESSION' : 'BOARDROOM'}
          </span>
        </button>

        {/* Language Preference Switcher (Auto / ES / EN) */}
        <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950/80 p-0.5 text-[11px]">
          <span className="px-2 text-slate-500 flex items-center gap-1">
            <Globe2 className="h-3 w-3 text-slate-400" />
          </span>
          {(['auto', 'es', 'en'] as SupportedLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguagePreference(lang);
                soundFX.playClick(soundEnabled);
              }}
              className={`rounded px-2 py-0.5 font-bold uppercase transition ${
                languagePreference === lang
                  ? 'bg-sky-500/30 text-sky-300 border border-sky-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'auto' ? 'Auto' : lang === 'es' ? '🇪🇸 ES' : '🇺🇸 EN'}
            </button>
          ))}
        </div>

        {/* Follow Agent Toggle */}
        <button
          onClick={() => {
            toggleFollowAgent();
            soundFX.playClick(soundEnabled);
          }}
          disabled={!selectedAgentId}
          title={selectedAgentId ? `Follow ${selectedAgent?.name}` : 'Select an agent first to follow'}
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-all ${
            isFollowing
              ? 'border-sky-400 bg-sky-500/20 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.4)]'
              : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 disabled:opacity-40'
          }`}
        >
          <Crosshair className={`h-3.5 w-3.5 ${isFollowing ? 'animate-spin' : ''}`} />
          <span className="hidden lg:inline">
            {isFollowing ? `FOLLOWING ${selectedAgent?.name}` : 'FOLLOW'}
          </span>
        </button>

        {/* Reset Camera View */}
        <button
          onClick={() => {
            resetCamera();
            soundFX.playClick(soundEnabled);
          }}
          title="Reset Camera to HQ Overview"
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-700 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Reset</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          className="rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:text-white transition"
        >
          {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-sky-400" /> : <VolumeX className="h-3.5 w-3.5 text-slate-500" />}
        </button>

        {/* Primary Real-Time Voice Conversation Button */}
        <button
          onClick={() => {
            startVoiceSession(selectedAgentId || 'vyra-growth');
            soundFX.playSuccess(soundEnabled);
          }}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-black transition shadow-md ${
            voiceSession.isActive
              ? 'border-cyan-300 bg-cyan-400 text-black shadow-[0_0_20px_#38bdf8] animate-pulse'
              : 'border-cyan-500/50 bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-blue-500/20 text-cyan-300 hover:bg-cyan-500/30'
          }`}
          title="Iniciar conversación continua por voz en tiempo real con agentes IA"
        >
          <Mic className={`h-3.5 w-3.5 ${voiceSession.isActive ? 'animate-bounce' : ''}`} />
          <span>{voiceSession.isActive ? 'VOZ ACTIVA' : '🎙 TALK TO AGENT'}</span>
        </button>

        {/* Create AI Agent Modal Trigger */}
        <button
          onClick={() => {
            setCreateAgentModalOpen(true);
            soundFX.playClick(soundEnabled);
          }}
          className="flex items-center gap-1.5 rounded-lg border border-sky-400 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:brightness-110 active:scale-95 transition"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">CREATE AGENT</span>
        </button>
      </div>
    </header>
  );
};

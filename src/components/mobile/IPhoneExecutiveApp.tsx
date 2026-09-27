'use client';

import React, { useState, useEffect } from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import {
  Sparkles,
  Crown,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  ClipboardList,
  TrendingUp,
  Users,
  CheckCircle2,
  Activity,
  Clock,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  Eye,
  Search,
  ShoppingBag,
  DollarSign,
  Flame,
  LayoutDashboard,
  Cpu,
  Monitor,
  PhoneCall,
  Sliders,
  ChevronRight,
  Radio,
  BatteryCharging,
  Brain
} from 'lucide-react';
import { soundFX } from '../audio/soundEffects';
import { ROBOT_PROFILES } from '../../data/robotProfiles';
import { DEPARTMENT_LIST } from '../../data/departments';
import { SHOPIFY_STORE_URL } from '../../data/shopifyData';
import { DepartmentId } from '../../types/office';

export const IPhoneExecutiveApp: React.FC = () => {
  // Store bindings
  const agents = useOfficeStore((s) => s.agents);
  const selectedAgentId = useOfficeStore((s) => s.selectedAgentId);
  const selectAgent = useOfficeStore((s) => s.selectAgent);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);
  const liveActivities = useOfficeStore((s) => s.liveActivities);
  const shopifyMetrics = useOfficeStore((s) => s.shopifyMetrics);
  const hqMetrics = useOfficeStore((s) => s.hqMetrics);
  const ceoDirectives = useOfficeStore((s) => s.ceoDirectives);
  const voiceSession = useOfficeStore((s) => s.voiceSession);
  const startVoiceSession = useOfficeStore((s) => s.startVoiceSession);
  const endVoiceSession = useOfficeStore((s) => s.endVoiceSession);
  const setVoiceMuted = useOfficeStore((s) => s.setVoiceMuted);
  const interruptVoice = useOfficeStore((s) => s.interruptVoice);
  const setChatModalOpen = useOfficeStore((s) => s.setChatModalOpen);
  const setAssignTaskModalOpen = useOfficeStore((s) => s.setAssignTaskModalOpen);
  const setShopifyOrdersModalOpen = useOfficeStore((s) => s.setShopifyOrdersModalOpen);
  const setCeoOfficeModalOpen = useOfficeStore((s) => s.setCeoOfficeModalOpen);
  const setMeetingModalOpen = useOfficeStore((s) => s.setMeetingModalOpen);
  const mobileTab = useOfficeStore((s) => s.mobileTab);
  const setMobileTab = useOfficeStore((s) => s.setMobileTab);
  const setIsMobileExecutiveView = useOfficeStore((s) => s.setIsMobileExecutiveView);

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<DepartmentId | 'all'>('all');
  const [dynamicIslandExpanded, setDynamicIslandExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('es-PE', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeVoiceAgent = agents.find((a) => a.id === voiceSession.activeAgentId) || agents[0];

  // Filtered agents
  const filteredAgents = agents.filter((ag) => {
    const matchesSearch =
      ag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ag.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ag.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = selectedDept === 'all' || ag.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleAgentVoice = (agentId: string) => {
    selectAgent(agentId);
    startVoiceSession(agentId);
    setMobileTab('voice');
    soundFX.playSuccess(soundEnabled);
  };

  const handleAgentChat = (agentId: string) => {
    selectAgent(agentId);
    setChatModalOpen(true);
    soundFX.playClick(soundEnabled);
  };

  const handleAgentAssign = (agentId: string) => {
    selectAgent(agentId);
    setAssignTaskModalOpen(true);
    soundFX.playClick(soundEnabled);
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-[#030611] text-slate-100 select-none overflow-hidden font-sans">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0c1633_0%,#030611_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c70a_1px,transparent_1px),linear-gradient(to_bottom,#0284c70a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

      {/* ========================================================================= */}
      {/* 1. DYNAMIC ISLAND (iPhone 15 Pro Max Floating Interactive Pill) */}
      {/* ========================================================================= */}
      <header className="relative z-40 pt-2 px-4 flex flex-col items-center shrink-0">
        <div
          onClick={() => {
            if (voiceSession.isActive) {
              setDynamicIslandExpanded(!dynamicIslandExpanded);
              soundFX.playClick(soundEnabled);
            } else {
              setMobileTab('voice');
              soundFX.playClick(soundEnabled);
            }
          }}
          className={`transition-all duration-300 ease-out cursor-pointer mx-auto flex items-center justify-between border border-white/10 bg-black/90 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl ${
            dynamicIslandExpanded
              ? 'w-full max-w-[390px] rounded-[32px] p-4 mt-1 border-cyan-500/40'
              : 'w-[230px] h-[36px] rounded-full px-3.5 hover:scale-105'
          }`}
        >
          {dynamicIslandExpanded ? (
            /* Expanded Dynamic Island */
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    style={{ backgroundColor: activeVoiceAgent.color }}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white font-mono shadow-md"
                  >
                    {activeVoiceAgent.name.slice(0, 2)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white font-mono block">
                      {activeVoiceAgent.name}
                    </span>
                    <span className="text-[10px] text-cyan-300 font-mono">
                      {voiceSession.state === 'speaking' ? 'HABLANDO AHORA...' : 'ESCUCHANDO...'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setVoiceMuted(!voiceSession.isMuted);
                      soundFX.playClick(soundEnabled);
                    }}
                    className={`rounded-full p-2 text-xs transition ${
                      voiceSession.isMuted ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {voiceSession.isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      endVoiceSession();
                      setDynamicIslandExpanded(false);
                      soundFX.playClick(soundEnabled);
                    }}
                    className="rounded-full bg-rose-500/20 text-rose-300 p-2 text-xs hover:bg-rose-500/30 transition"
                  >
                    <PhoneOff className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Dynamic Waveform Bars */}
              <div className="flex items-center justify-center gap-1 h-5 px-2">
                {[...Array(24)].map((_, i) => {
                  const h = voiceSession.state === 'speaking'
                    ? Math.max(4, Math.sin(i * 0.4 + Date.now() * 0.01) * 16 + 10)
                    : 4;
                  return (
                    <div
                      key={i}
                      style={{ height: `${h}px`, backgroundColor: activeVoiceAgent.color }}
                      className="w-1 rounded-full transition-all duration-75"
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            /* Compact Pill */
            <>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-black text-white font-mono tracking-wider">
                  {voiceSession.isActive ? activeVoiceAgent.name : 'ALFERNEX'}
                </span>
              </div>

              {voiceSession.isActive ? (
                <div className="flex items-center gap-1">
                  <span className="h-2 w-1 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="h-3.5 w-1 rounded-full bg-cyan-300 animate-bounce" />
                  <span className="h-2.5 w-1 rounded-full bg-cyan-400 animate-pulse" />
                </div>
              ) : (
                <span className="text-[10px] font-bold text-sky-400 font-mono tracking-widest">
                  {agents.length} AGENTES
                </span>
              )}
            </>
          )}
        </div>

        {/* Top Status & Desktop View Switcher */}
        <div className="w-full flex items-center justify-between mt-2 pt-1 border-b border-slate-800/60 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-400/40 bg-amber-500/20 text-amber-300 shadow-sm">
              <Crown className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-black text-white font-mono leading-none block">
                Alexis &bull; CEO
              </span>
              <span className="text-[9.5px] font-mono text-slate-400 leading-tight">
                {currentTime || 'Lima, Perú'} &bull; DEFCON OPTIMAL
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setIsMobileExecutiveView(false);
              soundFX.playClick(soundEnabled);
            }}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[10px] font-mono text-slate-300 hover:text-white transition"
            title="Cambiar a Vista 3D Desktop Completa"
          >
            <Monitor className="h-3 w-3 text-sky-400" />
            <span>3D DESKTOP</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN SCROLLABLE EXECUTIVE BODY */}
      {/* ========================================================================= */}
      <main className="relative flex-1 overflow-y-auto no-scrollbar px-4 pt-3 pb-24 space-y-4">
        
        {/* ===================================================================== */}
        {/* TAB 1: DASHBOARD / COMANDO EJECUTIVO */}
        {/* ===================================================================== */}
        {mobileTab === 'dashboard' && (
          <div className="space-y-4 animate-fade-in">
            {/* Real-time Hero Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Shopify Real Revenue */}
              <div
                onClick={() => setShopifyOrdersModalOpen(true)}
                className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-950/80 to-slate-950 p-3.5 shadow-lg active:scale-98 transition cursor-pointer"
              >
                <div className="flex items-center justify-between text-emerald-400 mb-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Shopify Ventas</span>
                  </div>
                  <ArrowUpRight className="h-3 w-3" />
                </div>
                <div className="text-lg font-black text-white font-mono">
                  S/. {shopifyMetrics.gross_revenue_pen.toFixed(0)}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                  <span>● COD Dropi Perú</span>
                  <span className="text-slate-400">&bull; 142 órdenes</span>
                </div>
              </div>

              {/* TRADIUM Quant Trading Portfolio */}
              <div
                onClick={() => setMobileTab('trading')}
                className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-950/80 to-slate-950 p-3.5 shadow-lg active:scale-98 transition cursor-pointer"
              >
                <div className="flex items-center justify-between text-cyan-400 mb-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Hyperliquid PnL</span>
                  </div>
                  <span className="rounded bg-cyan-500/20 px-1 py-0.2 text-[8px] font-mono font-bold text-cyan-300">
                    TRADIUM
                  </span>
                </div>
                <div className="text-lg font-black text-white font-mono">
                  $102,450
                </div>
                <div className="text-[10px] text-cyan-300 font-mono mt-0.5 flex items-center gap-1">
                  <span>+18.4% MoM</span>
                  <span className="text-slate-400">&bull; Sharpe 2.85</span>
                </div>
              </div>
            </div>

            {/* Quick Action Matrix for Alexis */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <span className="text-[10.5px] font-mono font-bold uppercase text-slate-400 block mb-2.5">
                Acciones Presidenciales Inmediatas
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setCeoOfficeModalOpen(true);
                    soundFX.playClick(soundEnabled);
                  }}
                  className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-2.5 text-left hover:bg-amber-500/20 transition active:scale-95"
                >
                  <Crown className="h-4 w-4 text-amber-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-amber-200 block truncate">Directiva CEO</span>
                    <span className="text-[9px] text-slate-400 block truncate">A los 11 agentes</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setMeetingModalOpen(true);
                    soundFX.playClick(soundEnabled);
                  }}
                  className="flex items-center gap-2 rounded-xl border border-purple-500/40 bg-purple-500/10 p-2.5 text-left hover:bg-purple-500/20 transition active:scale-95"
                >
                  <Users className="h-4 w-4 text-purple-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-purple-200 block truncate">Boardroom</span>
                    <span className="text-[9px] text-slate-400 block truncate">Reunión general</span>
                  </div>
                </button>

                <button
                  onClick={() => handleAgentVoice('tradium-trading')}
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-2.5 text-left hover:bg-emerald-500/20 transition active:scale-95"
                >
                  <Zap className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-emerald-200 block truncate">Hablar con Tradium</span>
                    <span className="text-[9px] text-slate-400 block truncate">Portfolio & Trades</span>
                  </div>
                </button>

                <button
                  onClick={() => handleAgentVoice('vyra-growth')}
                  className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-2.5 text-left hover:bg-rose-500/20 transition active:scale-95"
                >
                  <Flame className="h-4 w-4 text-rose-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-rose-200 block truncate">Hablar con Vyra</span>
                    <span className="text-[9px] text-slate-400 block truncate">TikTok Ads & Ganchos</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Active Master Directives */}
            {ceoDirectives.length > 0 && (
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 to-slate-950 p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Directiva Suprema Activa
                  </span>
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-mono font-bold text-amber-300">
                    {ceoDirectives[0].priority}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">{ceoDirectives[0].title}</h4>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {ceoDirectives[0].description}
                </p>
              </div>
            )}

            {/* Live Activity Feed Stream */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10.5px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-sky-400" />
                  Transmisión de Eventos en Tiempo Real
                </span>
                <span className="text-[9.5px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE
                </span>
              </div>

              <div className="space-y-2">
                {liveActivities.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    onClick={() => handleAgentChat(act.agentId)}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900/50 p-2.5 text-xs active:bg-slate-800/80 transition cursor-pointer"
                  >
                    <div
                      style={{ backgroundColor: act.agentColor }}
                      className="h-2 w-2 rounded-full mt-1.5 shrink-0 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white font-mono text-[11px] truncate">
                          {act.agentName}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {act.timestamp}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-300 line-clamp-2 mt-0.5 leading-snug">
                        {act.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: AGENTES (11 Ejecutivos) */}
        {/* ===================================================================== */}
        {mobileTab === 'agents' && (
          <div className="space-y-3 animate-fade-in">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar agente, rol o especialidad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none font-mono"
              />
            </div>

            {/* Department Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => setSelectedDept('all')}
                className={`rounded-full px-2.5 py-1 text-[10.5px] font-mono font-bold transition shrink-0 ${
                  selectedDept === 'all'
                    ? 'bg-sky-500/30 text-sky-200 border border-sky-400/50'
                    : 'text-slate-400 bg-slate-900 border border-slate-800'
                }`}
              >
                Todos ({agents.length})
              </button>
              {DEPARTMENT_LIST.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDept(d.id)}
                  style={{
                    borderColor: selectedDept === d.id ? d.color : undefined,
                    color: selectedDept === d.id ? '#ffffff' : undefined,
                    backgroundColor: selectedDept === d.id ? `${d.color}25` : undefined
                  }}
                  className="rounded-full px-2.5 py-1 text-[10.5px] font-mono font-bold transition shrink-0 bg-slate-900 border border-slate-800 text-slate-400"
                >
                  {d.shortName}
                </button>
              ))}
            </div>

            {/* Agent Cards Roster */}
            <div className="space-y-3 pt-1">
              {filteredAgents.map((ag) => {
                const profile = ROBOT_PROFILES[ag.id];
                const isTradium = ag.id === 'tradium-trading';

                return (
                  <div
                    key={ag.id}
                    className={`rounded-2xl border p-3.5 shadow-md transition ${
                      isTradium
                        ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-slate-950/90 to-slate-950'
                        : 'border-slate-800/80 bg-slate-950/80'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          style={{ backgroundColor: ag.color, boxShadow: `0 0 12px ${ag.color}50` }}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white font-mono"
                        >
                          {ag.name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-sm font-black text-white">
                              {ag.name}
                            </span>
                            {isTradium && (
                              <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[8px] font-mono font-bold text-emerald-300 border border-emerald-500/40 animate-pulse">
                                QUANT TRADING
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-300 font-medium block">
                            {ag.role}
                          </span>
                          <span className="text-[9.5px] font-mono text-slate-500">
                            Clearance: {profile?.badge.clearance || 'NIVEL 4'} &bull; Dept: {ag.department.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <span className="rounded-full bg-slate-900 border border-slate-800 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {ag.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Current Task / Speech Bubble */}
                    <div className="mt-3 rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5 text-[11px] text-slate-300 font-sans leading-relaxed">
                      &ldquo;{ag.speechBubble || ag.currentTask}&rdquo;
                    </div>

                    {/* Life-Sim Meters */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div>
                        <div className="flex items-center justify-between text-slate-400 mb-1">
                          <span className="flex items-center gap-1">
                            <BatteryCharging className="h-3 w-3 text-emerald-400" /> Energía
                          </span>
                          <span className="text-emerald-400 font-bold">{ag.simStats?.energy ?? 95}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                          <div
                            style={{ width: `${ag.simStats?.energy ?? 95}%` }}
                            className="h-full bg-emerald-400 rounded-full"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-slate-400 mb-1">
                          <span className="flex items-center gap-1">
                            <Brain className="h-3 w-3 text-sky-400" /> Enfoque
                          </span>
                          <span className="text-sky-400 font-bold">{ag.simStats?.focus ?? 92}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                          <div
                            style={{ width: `${ag.simStats?.focus ?? 92}%` }}
                            className="h-full bg-sky-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3.5 pt-2.5 border-t border-slate-800/60 flex items-center gap-2">
                      <button
                        onClick={() => handleAgentVoice(ag.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-cyan-400/80 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 py-2 text-xs font-mono font-black text-black shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:brightness-110 active:scale-95 transition"
                      >
                        <Mic className="h-3.5 w-3.5 text-black" />
                        <span>HABLAR (VOZ)</span>
                      </button>

                      <button
                        onClick={() => handleAgentChat(ag.id)}
                        className="flex items-center justify-center gap-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>CHAT</span>
                      </button>

                      <button
                        onClick={() => handleAgentAssign(ag.id)}
                        className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95"
                        title="Asignar Tarea"
                      >
                        <ClipboardList className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: VOZ DIRECTA EN TIEMPO REAL */}
        {/* ===================================================================== */}
        {mobileTab === 'voice' && (
          <div className="flex flex-col items-center justify-between min-h-[520px] py-4 space-y-6 animate-fade-in text-center">
            {/* Agent Active Profile Banner */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 flex items-center justify-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                CONEXIÓN NEURONAL EN TIEMPO REAL &bull; ULTRA-BAJA LATENCIA
              </span>
              <h2 className="text-2xl font-black text-white font-mono">
                {activeVoiceAgent.name}
              </h2>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                {activeVoiceAgent.role}
              </p>
            </div>

            {/* Glowing Holographic Audio Orb */}
            <div className="relative flex items-center justify-center my-6">
              <div
                style={{
                  boxShadow: `0 0 70px ${activeVoiceAgent.color}60`,
                  borderColor: activeVoiceAgent.color
                }}
                className={`flex h-40 w-40 items-center justify-center rounded-full border-2 bg-gradient-to-br from-slate-950 via-[#0a1128] to-slate-950 transition-transform duration-300 ${
                  voiceSession.state === 'speaking' ? 'scale-110 animate-pulse' : 'scale-100'
                }`}
              >
                <div className="flex flex-col items-center">
                  <Mic className="h-10 w-10 text-cyan-300 animate-pulse" />
                  <span className="text-[9px] font-black font-mono tracking-widest text-white mt-2 uppercase">
                    {voiceSession.state === 'speaking' ? 'HABLANDO' : voiceSession.isActive ? 'ESCUCHANDO' : 'LISTO'}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Transcript Bubble */}
            <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs font-mono text-slate-300 shadow-inner min-h-[90px] flex items-center justify-center">
              {voiceSession.transcripts.length > 0 ? (
                <div className="text-left w-full space-y-1.5">
                  {voiceSession.transcripts.slice(-2).map((t, idx) => (
                    <div key={idx} className="leading-snug">
                      <span className="font-bold text-cyan-300 uppercase">{t.sender}: </span>
                      <span>{t.text}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-slate-500 italic text-center">
                  Di algo como: &ldquo;Tradium, ¿cómo va el portafolio de trading?&rdquo; o &ldquo;Vyra, genera un gancho de TikTok para TurboJet&rdquo;
                </span>
              )}
            </div>

            {/* Controls Bar */}
            <div className="flex items-center gap-4">
              {voiceSession.isActive ? (
                <>
                  <button
                    onClick={() => {
                      setVoiceMuted(!voiceSession.isMuted);
                      soundFX.playClick(soundEnabled);
                    }}
                    className={`flex h-14 w-14 items-center justify-center rounded-full border shadow-lg transition ${
                      voiceSession.isMuted
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                        : 'border-slate-700 bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                  >
                    {voiceSession.isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </button>

                  <button
                    onClick={() => {
                      interruptVoice();
                      soundFX.playClick(soundEnabled);
                    }}
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-purple-500 bg-purple-600/30 text-purple-200 shadow-lg hover:bg-purple-600/50 transition active:scale-95"
                    title="Interrumpir"
                  >
                    <Sliders className="h-6 w-6" />
                  </button>

                  <button
                    onClick={() => {
                      endVoiceSession();
                      soundFX.playClick(soundEnabled);
                    }}
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-rose-500 bg-rose-600 text-white shadow-[0_0_30px_rgba(244,63,94,0.5)] active:scale-95 transition"
                    title="Colgar llamada"
                  >
                    <PhoneOff className="h-7 w-7" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    startVoiceSession(activeVoiceAgent.id);
                    soundFX.playSuccess(soundEnabled);
                  }}
                  className="flex items-center gap-3 rounded-2xl border-2 border-cyan-400 bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 px-8 py-4 text-sm font-black tracking-widest text-black shadow-[0_0_35px_rgba(56,189,248,0.5)] hover:brightness-110 active:scale-95 transition"
                >
                  <PhoneCall className="h-5 w-5 text-black" />
                  <span>INICIAR LLAMADA CON {activeVoiceAgent.name}</span>
                </button>
              )}
            </div>

            {/* Quick Agent Switcher Pills */}
            <div className="w-full">
              <span className="text-[10px] font-mono text-slate-400 block mb-2 uppercase">
                Cambiar de Ejecutivo para hablar:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {agents.map((ag) => (
                  <button
                    key={ag.id}
                    onClick={() => handleAgentVoice(ag.id)}
                    style={{ borderColor: ag.id === activeVoiceAgent.id ? ag.color : undefined }}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-mono shrink-0 transition ${
                      ag.id === activeVoiceAgent.id
                        ? 'bg-slate-800 text-white font-bold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span
                      style={{ backgroundColor: ag.color }}
                      className="h-2 w-2 rounded-full"
                    />
                    <span>{ag.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: WAR ROOM (Trading Hyperliquid + E-Commerce Dropi) */}
        {/* ===================================================================== */}
        {mobileTab === 'trading' && (
          <div className="space-y-4 animate-fade-in">
            {/* TRADIUM Live Terminal Card */}
            <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/30 via-slate-950/90 to-slate-950 p-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/50 bg-emerald-500/20 text-emerald-300 font-mono font-black shadow-md">
                    TR
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-white font-mono">TRADIUM</span>
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[8.5px] font-mono font-bold text-emerald-300 border border-emerald-500/40">
                        HYPERLIQUID QUANT
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Mesa de Arbitraje & Compounding 50%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleAgentVoice('tradium-trading')}
                  className="rounded-xl border border-emerald-400/50 bg-emerald-500/20 p-2 text-emerald-300 hover:bg-emerald-500/30 transition active:scale-95"
                  title="Hablar por voz con Tradium"
                >
                  <Mic className="h-4 w-4" />
                </button>
              </div>

              {/* Key Trading Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
                  <span className="text-[9.5px] font-mono text-slate-400 block uppercase">Equity Total</span>
                  <span className="text-base font-black text-white font-mono">$102,450</span>
                  <span className="text-[9px] text-emerald-400 font-mono block mt-0.5">+18.4% MoM</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
                  <span className="text-[9.5px] font-mono text-slate-400 block uppercase">Win Rate</span>
                  <span className="text-base font-black text-emerald-400 font-mono">68.4%</span>
                  <span className="text-[9px] text-slate-500 font-mono block mt-0.5">384 Trades</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
                  <span className="text-[9.5px] font-mono text-slate-400 block uppercase">Sharpe Ratio</span>
                  <span className="text-base font-black text-cyan-300 font-mono">2.85</span>
                  <span className="text-[9px] text-slate-500 font-mono block mt-0.5">Bajo Drawdown</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
                  <span className="text-[9.5px] font-mono text-slate-400 block uppercase">Take Profit</span>
                  <span className="text-base font-black text-purple-300 font-mono">+2.0%</span>
                  <span className="text-[9px] text-slate-500 font-mono block mt-0.5">High Frequency</span>
                </div>
              </div>

              {/* Active Positions */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  Posiciones Activas en Hyperliquid:
                </span>
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">LONG</span>
                    <span className="text-white font-bold">ETH-PERP</span>
                  </div>
                  <span className="text-emerald-400 font-bold">+$1,420.50 (+3.8%)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">LONG</span>
                    <span className="text-white font-bold">SOL-PERP</span>
                  </div>
                  <span className="text-emerald-400 font-bold">+$840.20 (+4.9%)</span>
                </div>
              </div>
            </div>

            {/* Shopify COD Perú War Room */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-md">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="font-mono text-xs font-black uppercase tracking-wider text-white">
                    Dropi Perú & Shopify COD
                  </span>
                </div>
                <a
                  href={SHOPIFY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Ver Tienda</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Ventas Brutas PEN:</span>
                  <span className="font-black text-white">S/. {shopifyMetrics.gross_revenue_pen.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Margen Promedio:</span>
                  <span className="font-black text-emerald-400">54.2%</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Despachos Olva Courier:</span>
                  <span className="font-bold text-white">68 órdenes en tránsito</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Efectividad Contra Entrega:</span>
                  <span className="font-bold text-emerald-400">92.4%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 3. NATIVE iOS BOTTOM FLOATING TAB BAR (Glassmorphism) */}
      {/* ========================================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-2 bg-[#030611]/90 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_35px_rgba(0,0,0,0.8)]">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* Tab 1: Comando */}
          <button
            onClick={() => {
              setMobileTab('dashboard');
              soundFX.playClick(soundEnabled);
            }}
            className={`flex flex-col items-center gap-1 transition ${
              mobileTab === 'dashboard' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[10px] font-mono font-bold tracking-tight">Comando</span>
          </button>

          {/* Tab 2: 11 Agentes */}
          <button
            onClick={() => {
              setMobileTab('agents');
              soundFX.playClick(soundEnabled);
            }}
            className={`flex flex-col items-center gap-1 transition relative ${
              mobileTab === 'agents' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <Users className="h-5 w-5" />
              <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-400 text-[8.5px] font-black text-black font-mono">
                11
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold tracking-tight">Agentes</span>
          </button>

          {/* Tab 3: Voz Directa */}
          <button
            onClick={() => {
              setMobileTab('voice');
              soundFX.playClick(soundEnabled);
            }}
            className={`flex flex-col items-center gap-1 transition relative ${
              mobileTab === 'voice' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className={`flex h-10 w-10 -mt-3 items-center justify-center rounded-full border shadow-lg transition-transform ${
              voiceSession.isActive
                ? 'border-cyan-300 bg-cyan-400 text-black shadow-[0_0_20px_#38bdf8] scale-110 animate-pulse'
                : 'border-cyan-500/50 bg-gradient-to-br from-cyan-500 via-sky-500 to-indigo-600 text-black'
            }`}>
              <Mic className="h-5 w-5 text-black" />
            </div>
            <span className="text-[10px] font-mono font-black tracking-tight">Voz</span>
          </button>

          {/* Tab 4: War Room */}
          <button
            onClick={() => {
              setMobileTab('trading');
              soundFX.playClick(soundEnabled);
            }}
            className={`flex flex-col items-center gap-1 transition ${
              mobileTab === 'trading' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-[10px] font-mono font-bold tracking-tight">War Room</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

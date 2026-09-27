'use client';

import React, { useState } from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import {
  X,
  Users2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Play,
  Square,
  MessageSquare,
  Flame,
  Zap,
  ShieldCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { soundFX } from '../audio/soundEffects';

export const MeetingRoomModal: React.FC = () => {
  const isMeetingModalOpen = useOfficeStore((s) => s.isMeetingModalOpen);
  const activeMeeting = useOfficeStore((s) => s.activeMeeting);
  const agents = useOfficeStore((s) => s.agents);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);

  const setMeetingModalOpen = useOfficeStore((s) => s.setMeetingModalOpen);
  const startCollaborationMeeting = useOfficeStore((s) => s.startCollaborationMeeting);
  const endCollaborationMeeting = useOfficeStore((s) => s.endCollaborationMeeting);
  const setChatModalOpen = useOfficeStore((s) => s.setChatModalOpen);
  const selectAgent = useOfficeStore((s) => s.selectAgent);

  const [customTopic, setCustomTopic] = useState('');

  if (!isMeetingModalOpen) return null;

  const defaultTopic = 'Escalamiento Agresivo en Soles: TikTok Ads + COD Dropi Express + Upsell Post-Compra';

  const participatingAgents = activeMeeting
    ? agents.filter((a) => activeMeeting.participatingAgentIds.includes(a.id))
    : agents.slice(0, 4);

  const handleStart = (topic?: string) => {
    const chosenTopic = topic || customTopic || defaultTopic;
    startCollaborationMeeting(chosenTopic);
    soundFX.playSuccess(soundEnabled);
  };

  const handleEnd = () => {
    endCollaborationMeeting();
    soundFX.playClick(soundEnabled);
  };

  const handleClose = () => {
    setMeetingModalOpen(false);
    soundFX.playClick(soundEnabled);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl animate-fade-in">
      <div className="relative flex h-[88vh] max-h-[860px] w-full max-w-5xl flex-col rounded-3xl border border-purple-500/40 bg-[#070916] shadow-[0_0_90px_rgba(168,85,247,0.25)] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-500/20 bg-[#050612]/95 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/50 bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.35)]">
              <Users2 className="h-6 w-6 text-purple-300 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-black tracking-wider text-white">
                  EXECUTIVE BOARDROOM
                </span>
                <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-[10px] font-extrabold tracking-widest text-purple-300 border border-purple-400/40">
                  MULTI-AGENT COLLABORATION
                </span>
                {activeMeeting && (
                  <span className="flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    IN SESSION
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400">
                Floor 44 &bull; Central Obsidian Dome &bull; ALFERNEX Core Sync
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Boardroom Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          
          {/* Active Meeting Banner / Goal */}
          <div className="relative rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-950/40 p-5 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-purple-300 font-mono">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  Strategic Objective & Consensus Target
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-white font-mono">
                  {activeMeeting ? activeMeeting.topic : defaultTopic}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {activeMeeting ? (
                  <button
                    onClick={handleEnd}
                    className="flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/20 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-500/30 transition shadow-md"
                  >
                    <Square className="h-3.5 w-3.5" />
                    <span>CONCLUDE MEETING</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStart()}
                    className="flex items-center gap-1.5 rounded-xl border border-purple-400 bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-xs font-extrabold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:brightness-110 active:scale-95 transition"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>LAUNCH COLLABORATIVE SESSION</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Holographic Obsidian Boardroom Table Visualization */}
          <div className="relative h-60 w-full rounded-3xl border border-purple-500/25 bg-gradient-to-b from-[#080a1c] via-[#050612] to-[#03040b] p-4 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden">
            {/* Grid Floor */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#a855f715_1px,transparent_1px),linear-gradient(to_bottom,#a855f715_1px,transparent_1px)] [background-size:24px_24px]" />
            
            {/* Central Holographic Core */}
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-purple-400/50 bg-purple-500/10 shadow-[0_0_40px_rgba(168,85,247,0.4)] animate-pulse">
              <div className="flex flex-col items-center text-center">
                <Cpu className="h-6 w-6 text-purple-300 animate-spin" />
                <span className="text-[9px] font-black text-white font-mono tracking-widest mt-1">ALFERNEX</span>
                <span className="text-[7.5px] font-bold text-purple-400 font-mono">CORE SYNC</span>
              </div>
            </div>

            {/* Participating Agents Orbiting around table */}
            {participatingAgents.map((ag, i) => {
              const total = participatingAgents.length;
              const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
              const rx = 180;
              const ry = 80;
              const x = Math.cos(angle) * rx;
              const y = Math.sin(angle) * ry;

              return (
                <div
                  key={ag.id}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    borderColor: ag.color,
                    boxShadow: `0 0 15px ${ag.color}40`
                  }}
                  className="absolute flex items-center gap-2 rounded-xl border-2 bg-slate-950/90 px-3 py-1.5 backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
                  onClick={() => {
                    selectAgent(ag.id);
                    setChatModalOpen(true);
                  }}
                  title={`Click to talk directly to ${ag.name}`}
                >
                  <div
                    style={{ backgroundColor: ag.color }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black text-white"
                  >
                    {ag.name.slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <span className="font-extrabold text-white text-xs block font-mono leading-none">
                      {ag.name}
                    </span>
                    <span className="text-[9px] text-slate-400 block leading-tight">
                      {ag.role}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sequential Task Pipeline (The Workflow) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Autonomous Multi-Agent Task Pipeline
                </h3>
              </div>
              <span className="text-[10px] font-mono text-purple-400">STAGE PROGRESSION &bull; AUTOMATED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Stage 1: VYRA */}
              <div className="rounded-2xl border border-rose-500/30 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-rose-400">STAGE 01 &bull; VYRA</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> READY
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">Growth & Viral Ad Ganchos</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Generación de 10 hooks de 3s en TikTok Ads para TurboJet demostrando limpieza y secado de autos.
                </p>
              </div>

              {/* Stage 2: MAX */}
              <div className="rounded-2xl border border-sky-500/30 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-sky-400">STAGE 02 &bull; MAX</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-sky-400">
                    <Clock className="h-3 w-3 animate-spin" /> ACTIVE
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">1-Click Fast COD Checkout</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Integración del modal de compra rápida contra entrega con upsell post-compra inmediato de S/. 25.
                </p>
              </div>

              {/* Stage 3: NEX */}
              <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-emerald-400">STAGE 03 &bull; NEX</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    QUEUED
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">Net Margin & ROAS Control</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Modelado del margen real con flete Dropi para garantizar utilidad neta mínima de S/. 45 por orden.
                </p>
              </div>

              {/* Stage 4: EVA */}
              <div className="rounded-2xl border border-amber-500/30 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-amber-400">STAGE 04 &bull; EVA</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    QUEUED
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">WhatsApp Conversion Closer</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Confirmación inmediata de dirección con geolocalización y confirmación de recepción de pedidos.
                </p>
              </div>
            </div>
          </div>

          {/* Boardroom Live Consensus Log */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold uppercase text-purple-300">
              <MessageSquare className="h-4 w-4 text-purple-400" />
              <span>Executive Meeting Debate & Strategic Consensus</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-rose-400 font-mono min-w-[70px]">VYRA:</span>
                <span className="text-slate-300">
                  &ldquo;Nuestra meta inmediata son 50 órdenes diarias. En TikTok Ads el gancho de encendido de parrilla en 30s tiene un CTR de 4.8%. Necesitamos que Max optimice el botón de compra para no perder tráfico móvil.&rdquo;
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-sky-400 font-mono min-w-[70px]">MAX:</span>
                <span className="text-slate-300">
                  &ldquo;El botón de pedido contra entrega ya procesa en 1 solo paso sin salir de la página. El modal de upsell de boquillas y estuche rígido sube el ticket de S/. 139 a S/. 164.&rdquo;
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-400 font-mono min-w-[70px]">NEX:</span>
                <span className="text-slate-300">
                  &ldquo;Confirmado. Con el flete de Dropi de S/. 18 y el costo del producto de S/. 52, cada orden deja S/. 69 de margen neto. A 50 ventas/día son S/. 3,450 de ganancia neta diaria.&rdquo;
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-amber-400 font-mono min-w-[70px]">EVA:</span>
                <span className="text-slate-300">
                  &ldquo;Mi equipo de confirmación por WhatsApp valida el DNI y dirección en menos de 4 minutos para despachar el mismo día con Olva Courier.&rdquo;
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-purple-500/20 bg-[#050612] px-6 py-4">
          <div className="text-xs text-slate-400">
            Agents in Sync: <strong className="text-purple-300 font-mono">{participatingAgents.length} Executives</strong> &bull; ALFERNEX Autonomous Governance
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              CERRAR PANEL
            </button>
            <button
              onClick={() => handleStart()}
              className="flex items-center gap-1.5 rounded-xl border border-purple-400 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 px-5 py-2 text-xs font-extrabold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:brightness-110 active:scale-95 transition"
            >
              <Zap className="h-4 w-4" />
              <span>SINCRONIZAR DIRECTIVAS</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

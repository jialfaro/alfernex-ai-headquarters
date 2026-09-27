'use client';

import React, { useState } from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import {
  X,
  Crown,
  Sparkles,
  Send,
  Users2,
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  MessageSquare,
  Coffee,
  Flame,
  Globe2,
  Radio
} from 'lucide-react';
import { soundFX } from '../audio/soundEffects';
import { SHOPIFY_STORE_URL } from '../../data/shopifyData';

export const CEOOfficeModal: React.FC = () => {
  const isCeoOfficeModalOpen = useOfficeStore((s) => s.isCeoOfficeModalOpen);
  const ceoProfile = useOfficeStore((s) => s.ceoProfile);
  const ceoDirectives = useOfficeStore((s) => s.ceoDirectives);
  const agents = useOfficeStore((s) => s.agents);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);

  const setCeoOfficeModalOpen = useOfficeStore((s) => s.setCeoOfficeModalOpen);
  const broadcastCeoDirective = useOfficeStore((s) => s.broadcastCeoDirective);
  const startCollaborationMeeting = useOfficeStore((s) => s.startCollaborationMeeting);
  const setMeetingModalOpen = useOfficeStore((s) => s.setMeetingModalOpen);
  const selectAgent = useOfficeStore((s) => s.selectAgent);
  const setChatModalOpen = useOfficeStore((s) => s.setChatModalOpen);

  const [directiveTitle, setDirectiveTitle] = useState('');
  const [directiveDesc, setDirectiveDesc] = useState('');
  const [priority, setPriority] = useState<'MÁXIMA' | 'CRÍTICA' | 'ALTA'>('MÁXIMA');
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(['vyra-growth', 'max-developer', 'atlas-ops']);

  if (!isCeoOfficeModalOpen) return null;

  const toggleAgent = (id: string) => {
    setSelectedAgentIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directiveTitle.trim()) return;

    soundFX.playSuccess(soundEnabled);
    broadcastCeoDirective(directiveTitle, directiveDesc, priority, selectedAgentIds);
    setDirectiveTitle('');
    setDirectiveDesc('');
  };

  const handleSummonBoardroom = () => {
    setCeoOfficeModalOpen(false);
    startCollaborationMeeting('Sesión Extraordinaria convocada por Gerencia General (Alexis)');
    setMeetingModalOpen(true);
    soundFX.playClick(soundEnabled);
  };

  const handleTalkToAgent = (agentId: string) => {
    selectAgent(agentId);
    setCeoOfficeModalOpen(false);
    setChatModalOpen(true);
    soundFX.playClick(soundEnabled);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-2xl animate-fade-in">
      <div className="relative flex h-[90vh] max-h-[880px] w-full max-w-5xl flex-col rounded-3xl border-2 border-amber-500/50 bg-[#060810] shadow-[0_0_100px_rgba(245,158,11,0.25)] overflow-hidden">
        
        {/* Supreme Luxury Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 bg-gradient-to-r from-[#0d0f1a] via-[#121017] to-[#0d0f1a] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-500/30 via-yellow-600/20 to-amber-700/30 text-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
              <Crown className="h-7 w-7 text-amber-300 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">
                  {ceoProfile.name.toUpperCase()} &bull; {ceoProfile.title.toUpperCase()}
                </span>
                <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold tracking-widest text-amber-300 border border-amber-400/50 shadow-sm">
                  DUEÑO & FUNDADOR
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-amber-400/90 font-semibold">{ceoProfile.company}</span>
                <span>&bull;</span>
                <span className="italic text-slate-300">&ldquo;{ceoProfile.motto}&rdquo;</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSummonBoardroom}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-purple-500/50 bg-purple-600/20 px-3.5 py-2 text-xs font-bold text-purple-300 hover:bg-purple-600/30 transition shadow-md"
            >
              <Users2 className="h-4 w-4" />
              <span>CONVOCAR A TODOS AL DIRECTORIO</span>
            </button>

            <button
              onClick={() => {
                setCeoOfficeModalOpen(false);
                soundFX.playClick(soundEnabled);
              }}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Penthouse Suite Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          
          {/* Panoramic Penthouse Horizon */}
          <div className="relative h-48 w-full rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#131124] via-[#090b14] to-[#04060c] p-6 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col justify-between">
            {/* Gold Cyber Grid */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#f59e0b15_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b15_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-mono font-bold tracking-widest text-amber-300 uppercase">
                <Sparkles className="h-4 w-4 text-amber-400" />
                PENTHOUSE SUITE &bull; PISO 50 &bull; VISTA PANORÁMICA 360°
              </span>
              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                <span>Estado:</span>
                <span className="font-bold text-emerald-400 uppercase flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  EN SU DESPACHO
                </span>
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white font-mono tracking-tight">
                  Alexis &bull; Despacho de Presidencia
                </h2>
                <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
                  Desde aquí supervisas a los {agents.length} agentes ejecutivos, ordenas prioridades de venta en Shopify, controlas la logística contra entrega con Dropi Perú y diriges la expansión.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={SHOPIFY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition shadow-sm"
                >
                  <span>Ver Tienda Abierta (8bhsfq-gz)</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Master Directive Console (Emitir Orden a los Agentes) */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-950/60 to-purple-950/20 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-amber-400 animate-pulse" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white font-mono">
                  EMITIR DIRECTIVA PRIORITARIA A TUS AGENTES (ORDEN DEL DUEÑO)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400 font-bold">
                CANAL DE COMUNICACIÓN DIRECTA
              </span>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="text-[11px] font-mono text-slate-300 block mb-1.5 font-bold">
                    Título de la Directiva o Meta Inmediata:
                  </label>
                  <input
                    type="text"
                    value={directiveTitle}
                    onChange={(e) => setDirectiveTitle(e.target.value)}
                    placeholder="Ej: Prioridad absoluta a la campaña del Cargador 3-en-1 en TikTok Ads..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1.5 font-bold">
                    Nivel de Prioridad:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['MÁXIMA', 'CRÍTICA', 'ALTA'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`rounded-xl py-2.5 text-[11px] font-bold font-mono transition border ${
                          priority === p
                            ? p === 'MÁXIMA'
                              ? 'border-red-500 bg-red-500/20 text-red-300 shadow-md'
                              : p === 'CRÍTICA'
                              ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-md'
                              : 'border-sky-500 bg-sky-500/20 text-sky-300 shadow-md'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1.5 font-bold">
                  Instrucciones Específicas / Rango de Operación:
                </label>
                <textarea
                  value={directiveDesc}
                  onChange={(e) => setDirectiveDesc(e.target.value)}
                  placeholder="Detalla qué quieres que haga el equipo (ej: Vyra optimiza creativos, Max revisa botones de compra, Atlas asegura stock con Dropi...)"
                  rows={2}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>

              {/* Agent Selection Chips */}
              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1.5 font-bold">
                  Agentes que deben ejecutar esta orden:
                </label>
                <div className="flex flex-wrap gap-2">
                  {agents.map((ag) => {
                    const isSelected = selectedAgentIds.includes(ag.id);
                    return (
                      <button
                        key={ag.id}
                        type="button"
                        onClick={() => toggleAgent(ag.id)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-bold transition border ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-sm'
                            : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span
                          style={{ backgroundColor: ag.color }}
                          className="h-2 w-2 rounded-full"
                        />
                        <span>{ag.name} ({ag.role.split(' ')[0]})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!directiveTitle.trim()}
                  className="flex items-center gap-2 rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-600 px-6 py-3 text-xs font-black tracking-wider text-black shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:brightness-110 active:scale-95 transition disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                  <span>EMITIR DIRECTIVA CON AUTORIDAD TOTAL</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Directives in Progress */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Directivas Activas del Gerente General en Ejecución ({ceoDirectives.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400">EN TIEMPO REAL</span>
            </div>

            <div className="space-y-3">
              {ceoDirectives.map((dir) => (
                <div
                  key={dir.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 font-mono text-xs hover:border-amber-500/30 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-amber-400">{dir.id}</span>
                      <span className="text-white font-bold">{dir.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-[9.5px] font-bold ${
                          dir.priority === 'MÁXIMA'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : dir.priority === 'CRÍTICA'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}
                      >
                        {dir.priority}
                      </span>
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[9.5px] font-bold text-emerald-300 border border-emerald-500/30">
                        {dir.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                    {dir.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Agentes asignados:</span>
                      <div className="flex items-center gap-1">
                        {dir.assignedAgentIds.map((agId) => {
                          const ag = agents.find((a) => a.id === agId);
                          return (
                            <button
                              key={agId}
                              onClick={() => handleTalkToAgent(agId)}
                              className="rounded-md border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-[9.5px] text-sky-300 hover:border-amber-400 hover:text-white transition"
                              title={`Hablar con ${ag?.name || agId}`}
                            >
                              {ag?.name || agId}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <span>{dir.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick 1-on-1 Executive Summon */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 font-mono text-xs">
            <span className="text-slate-400 block mb-2 font-bold uppercase text-[10.5px]">
              Llamar a un Ejecutivo a tu Despacho para Briefing Privado:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {agents.map((ag) => (
                <button
                  key={ag.id}
                  onClick={() => handleTalkToAgent(ag.id)}
                  style={{ borderColor: `${ag.color}40` }}
                  className="flex items-center gap-2 rounded-xl border bg-slate-900/80 p-2 text-left hover:scale-[1.03] transition"
                >
                  <div
                    style={{ backgroundColor: ag.color }}
                    className="flex h-6 w-6 items-center justify-center rounded-lg text-xs font-black text-white"
                  >
                    {ag.name.slice(0, 2)}
                  </div>
                  <div className="overflow-hidden">
                    <span className="font-bold text-white block truncate leading-none">{ag.name}</span>
                    <span className="text-[9px] text-slate-400 truncate block mt-0.5">{ag.role.split(' ')[0]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-amber-500/30 bg-[#080a14] px-6 py-4">
          <div className="text-xs text-slate-400 font-mono">
            Mando Ejecutivo: <strong className="text-amber-300">Alexis (Gerente General & Dueño)</strong> &bull; ALFERNEX Autonomous Enterprise
          </div>

          <button
            onClick={() => {
              setCeoOfficeModalOpen(false);
              soundFX.playClick(soundEnabled);
            }}
            className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2 text-xs font-bold text-white hover:bg-slate-700 transition"
          >
            VOLVER AL CAMPUS HQ
          </button>
        </div>

      </div>
    </div>
  );
};

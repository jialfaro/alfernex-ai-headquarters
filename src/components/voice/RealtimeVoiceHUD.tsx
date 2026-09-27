'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import { ROBOT_PROFILES } from '../../data/robotProfiles';
import { soundFX } from '../audio/soundEffects';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  MessageSquare,
  Sparkles,
  Brain,
  Zap,
  Radio,
  FileText,
  Users2,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Activity
} from 'lucide-react';

export const RealtimeVoiceHUD: React.FC = () => {
  const voiceSession = useOfficeStore((s) => s.voiceSession);
  const endVoiceSession = useOfficeStore((s) => s.endVoiceSession);
  const setVoiceMuted = useOfficeStore((s) => s.setVoiceMuted);
  const setVoiceVolume = useOfficeStore((s) => s.setVoiceVolume);
  const startVoiceSession = useOfficeStore((s) => s.startVoiceSession);
  const setChatModalOpen = useOfficeStore((s) => s.setChatModalOpen);
  const addVoiceColleague = useOfficeStore((s) => s.addVoiceColleague);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);

  const [showTranscript, setShowTranscript] = useState(true);
  const [showColleagueMenu, setShowColleagueMenu] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  const activeAgentId = voiceSession.activeAgentId || 'vyra-growth';
  const profile = ROBOT_PROFILES[activeAgentId] || ROBOT_PROFILES['vyra-growth'];

  // Scroll transcript to bottom on new items
  useEffect(() => {
    if (showTranscript) {
      transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [voiceSession.transcripts, showTranscript]);

  // Audio Waveform Visualizer Canvas Animation
  useEffect(() => {
    if (!voiceSession.isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const renderWave = () => {
      animId = requestAnimationFrame(renderWave);
      phase += 0.08;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Determine active energy
      const isAgentSpeaking = voiceSession.state === 'speaking';
      const isUserSpeaking = voiceSession.state === 'listening' && voiceSession.userVolume > 0.05;
      const amplitude = isAgentSpeaking
        ? Math.max(12, voiceSession.agentVolume * 28)
        : isUserSpeaking
        ? Math.max(10, voiceSession.userVolume * 26)
        : voiceSession.state === 'thinking'
        ? 6 + Math.sin(phase * 2) * 4
        : 2;

      const waveColor = isAgentSpeaking
        ? profile.ledHex
        : isUserSpeaking
        ? '#38bdf8'
        : voiceSession.state === 'thinking'
        ? '#a855f7'
        : '#64748b';

      // Draw Multi-Bar Audio Equalizer
      const numBars = 32;
      const barWidth = 4;
      const gap = (width - numBars * barWidth) / (numBars - 1);

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + gap);
        const distFromCenter = Math.abs(i - numBars / 2) / (numBars / 2);
        const factor = Math.cos(distFromCenter * (Math.PI / 2));
        const barHeight = Math.max(3, amplitude * factor * (0.4 + Math.sin(phase + i * 0.4) * 0.6));

        ctx.fillStyle = waveColor;
        ctx.beginPath();
        ctx.roundRect(x, centerY - barHeight / 2, barWidth, barHeight, 2);
        ctx.fill();
      }
    };

    renderWave();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [voiceSession.isActive, voiceSession.state, voiceSession.userVolume, voiceSession.agentVolume, profile.ledHex]);

  if (!voiceSession.isActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md select-none animate-slide-up">
      {/* Main Glassmorphic Floating HUD Dock */}
      <div
        style={{
          borderColor: `${profile.ledHex}60`,
          boxShadow: `0 0 35px ${profile.ledHex}25, 0 20px 40px rgba(0,0,0,0.85)`
        }}
        className="relative flex flex-col rounded-3xl border bg-[#050816]/95 p-4 backdrop-blur-2xl"
      >
        {/* Header Bar: Identity & Status */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                style={{ backgroundColor: profile.ledHex }}
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-base font-black text-black shadow-lg"
              >
                {profile.name.slice(0, 2)}
              </div>
              <div
                style={{ backgroundColor: profile.ledHex }}
                className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#050816] shadow-sm animate-pulse"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-white">{profile.name}</span>
                <span
                  style={{ borderColor: `${profile.ledHex}50`, color: profile.ledHex }}
                  className="rounded-md border bg-black/40 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase"
                >
                  {profile.badge.title}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">{profile.role}</div>
            </div>
          </div>

          {/* Real-Time Voice State Pill */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-mono font-bold transition shadow-sm ${
                voiceSession.state === 'listening'
                  ? 'border border-cyan-400/50 bg-cyan-500/20 text-cyan-300 animate-pulse'
                  : voiceSession.state === 'thinking'
                  ? 'border border-purple-400/50 bg-purple-500/20 text-purple-300 animate-pulse'
                  : voiceSession.state === 'speaking'
                  ? 'border border-emerald-400/50 bg-emerald-500/20 text-emerald-300'
                  : voiceSession.state === 'connecting'
                  ? 'border border-amber-400/50 bg-amber-500/20 text-amber-300 animate-pulse'
                  : 'border border-slate-700 bg-slate-800/60 text-slate-300'
              }`}
            >
              {voiceSession.state === 'listening' && (
                <>
                  <Mic className="h-3 w-3 text-cyan-400" />
                  <span>🎙 LISTENING</span>
                </>
              )}
              {voiceSession.state === 'thinking' && (
                <>
                  <Brain className="h-3 w-3 text-purple-400" />
                  <span>🧠 THINKING</span>
                </>
              )}
              {voiceSession.state === 'speaking' && (
                <>
                  <Radio className="h-3 w-3 text-emerald-400 animate-spin" />
                  <span>🔊 SPEAKING</span>
                </>
              )}
              {voiceSession.state === 'ready' && (
                <>
                  <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  <span>🟢 READY</span>
                </>
              )}
              {voiceSession.state === 'connecting' && <span>CONECTANDO...</span>}
              {voiceSession.state === 'error' && <span>ERROR</span>}
            </div>

            {/* End Conversation Button */}
            <button
              onClick={() => {
                endVoiceSession();
                soundFX.playClick(soundEnabled);
              }}
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-300 hover:bg-rose-500/20 transition"
              title="Finalizar sesión de voz"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Real-time Tool Execution Feedback Banner */}
        {voiceSession.currentTool && (
          <div className="mt-3 flex items-center justify-between rounded-xl border border-sky-500/30 bg-sky-950/40 px-3 py-1.5 text-xs font-mono text-sky-300 animate-fade-in">
            <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>
                <strong>{profile.name}</strong> ●{' '}
                {voiceSession.currentTool.status === 'running'
                  ? voiceSession.currentTool.description || `Ejecutando ${voiceSession.currentTool.name}...`
                  : voiceSession.currentTool.result || 'Completado'}
              </span>
            </div>
            {voiceSession.currentTool.status === 'done' && (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            )}
          </div>
        )}

        {/* Error / Permission Guidance */}
        {voiceSession.state === 'error' && (
          <div className="mt-3 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs font-mono text-rose-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{voiceSession.errorMessage || 'Error en conexión de audio'}</span>
            </div>
            <button
              onClick={() => startVoiceSession(activeAgentId)}
              className="flex items-center gap-1 rounded-lg bg-rose-500/30 px-2 py-1 text-[11px] font-bold text-white hover:bg-rose-500/40"
            >
              <RotateCcw className="h-3 w-3" />
              <span>REINTENTAR</span>
            </button>
          </div>
        )}

        {/* Audio Waveform Canvas */}
        <div className="my-3 flex flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-950/80 p-2 shadow-inner">
          <canvas ref={canvasRef} width={380} height={44} className="w-full h-11" />
          <div className="flex items-center justify-between w-full px-2 text-[10px] font-mono text-slate-500">
            <span>{voiceSession.isMuted ? 'Micrófono Silenciado' : 'Micrófono Bidireccional Activo'}</span>
            <span>Interrupción Natural Activada</span>
          </div>
        </div>

        {/* Live Streaming Transcript Panel */}
        {showTranscript && (
          <div className="mb-3 max-h-40 overflow-y-auto rounded-2xl border border-slate-800 bg-black/50 p-3 text-xs font-mono space-y-2 no-scrollbar">
            {voiceSession.transcripts.length === 0 ? (
              <div className="text-center text-slate-500 italic py-2">
                Habla con {profile.name}... puedes interrumpir en cualquier momento.
              </div>
            ) : (
              voiceSession.transcripts.slice(-6).map((t) => (
                <div key={t.id} className="flex gap-2 leading-relaxed">
                  <span
                    style={{ color: t.sender === 'user' ? '#38bdf8' : profile.ledHex }}
                    className="font-bold shrink-0 uppercase"
                  >
                    {t.sender === 'user' ? 'TÚ:' : `${t.agentName || profile.name}:`}
                  </span>
                  <span className={t.sender === 'user' ? 'text-slate-200' : 'text-slate-100'}>{t.text}</span>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>
        )}

        {/* Multi-Agent Colleague Summoning Drawer */}
        {showColleagueMenu && (
          <div className="mb-3 rounded-2xl border border-purple-500/30 bg-purple-950/50 p-2.5 text-xs font-mono space-y-2 animate-fade-in">
            <span className="text-[10px] text-purple-300 font-bold block uppercase">
              Invitar Colega a la Conversación:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'max-developer', name: 'MAX', role: 'Software' },
                { id: 'alex-architect', name: 'ALEX', role: 'Arquitectura' },
                { id: 'nex-data', name: 'NEX', role: 'Finanzas' },
                { id: 'nova-research', name: 'NOVA', role: 'Investigación' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    addVoiceColleague(c.id);
                    setShowColleagueMenu(false);
                    soundFX.playSuccess(soundEnabled);
                  }}
                  className="flex items-center justify-between rounded-xl border border-purple-400/30 bg-purple-900/40 px-2.5 py-1.5 text-slate-200 hover:bg-purple-800/50 text-[11px]"
                >
                  <span className="font-bold text-white">{c.name}</span>
                  <span className="text-purple-300 text-[10px]">{c.role}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Control Buttons */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {/* Mute Mic */}
            <button
              onClick={() => {
                setVoiceMuted(!voiceSession.isMuted);
                soundFX.playClick(soundEnabled);
              }}
              className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-mono font-bold transition ${
                voiceSession.isMuted
                  ? 'border-amber-500/40 bg-amber-500/20 text-amber-300'
                  : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white'
              }`}
              title={voiceSession.isMuted ? 'Activar micrófono' : 'Silenciar micrófono'}
            >
              {voiceSession.isMuted ? <MicOff className="h-3.5 w-3.5 text-amber-400" /> : <Mic className="h-3.5 w-3.5 text-cyan-400" />}
              <span className="hidden sm:inline">{voiceSession.isMuted ? 'MUTED' : 'MIC ON'}</span>
            </button>

            {/* Toggle Transcript */}
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-mono font-bold transition ${
                showTranscript
                  ? 'border-sky-500/30 bg-sky-500/10 text-sky-300'
                  : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white'
              }`}
              title="Mostrar u ocultar transcripción en vivo"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{showTranscript ? 'TRANSCRIPT' : 'SUBTÍTULOS'}</span>
            </button>

            {/* Summon Colleague */}
            <button
              onClick={() => setShowColleagueMenu(!showColleagueMenu)}
              className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-mono font-bold text-slate-300 hover:text-white hover:border-purple-500/40 transition"
              title="Invitar a otro agente a la conversación"
            >
              <Users2 className="h-3.5 w-3.5 text-purple-400" />
              <span className="hidden sm:inline">COLEGA</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Switch to Text Chat */}
            <button
              onClick={() => {
                setChatModalOpen(true);
                soundFX.playClick(soundEnabled);
              }}
              className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-mono font-bold text-slate-300 hover:text-white transition"
              title="Abrir chat en modo texto"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">TEXTO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

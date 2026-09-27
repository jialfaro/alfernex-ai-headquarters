'use client';

import React from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import {
  X,
  ArrowLeft,
  MessageSquare,
  PlusCircle,
  Users2,
  Sparkles,
  Monitor,
  Activity,
  Coffee,
  Brain,
  Zap,
  Globe2
} from 'lucide-react';
import { soundFX } from '../audio/soundEffects';

export const OfficeViewModal: React.FC = () => {
  const isOfficeViewModalOpen = useOfficeStore((s) => s.isOfficeViewModalOpen);
  const selectedAgentId = useOfficeStore((s) => s.selectedAgentId);
  const camera = useOfficeStore((s) => s.camera);
  const agents = useOfficeStore((s) => s.agents);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);

  const setOfficeViewModalOpen = useOfficeStore((s) => s.setOfficeViewModalOpen);
  const setChatModalOpen = useOfficeStore((s) => s.setChatModalOpen);
  const setAssignTaskModalOpen = useOfficeStore((s) => s.setAssignTaskModalOpen);
  const startCollaborationMeeting = useOfficeStore((s) => s.startCollaborationMeeting);
  const setMeetingModalOpen = useOfficeStore((s) => s.setMeetingModalOpen);
  const returnToHQ = useOfficeStore((s) => s.returnToHQ);

  const activeAgentId = camera.focusedOfficeAgentId || selectedAgentId;
  const agent = agents.find((a) => a.id === activeAgentId);

  if (!isOfficeViewModalOpen || !agent) return null;

  const office = agent.officeDetails;

  const handleClose = () => {
    setOfficeViewModalOpen(false);
    returnToHQ();
    soundFX.playClick(soundEnabled);
  };

  const handleOpenChat = () => {
    setOfficeViewModalOpen(false);
    setChatModalOpen(true);
    soundFX.playClick(soundEnabled);
  };

  const handleOpenAssignTask = () => {
    setOfficeViewModalOpen(false);
    setAssignTaskModalOpen(true);
    soundFX.playClick(soundEnabled);
  };

  const handleInviteToMeeting = () => {
    setOfficeViewModalOpen(false);
    startCollaborationMeeting(`Strategic Session with ${agent.name} (${agent.role})`, [agent.id]);
    setMeetingModalOpen(true);
    soundFX.playClick(soundEnabled);
  };

  // Human-readable desk style descriptions
  const deskDescriptions: Record<string, string> = {
    executive_marble: 'Italian Smoked Marble & Titanium Arc',
    dev_dual_pod: 'Curved Matte Titanium Dual-Station',
    creative_glass: 'Acoustic Frosted Glass & Neon Cove',
    research_holo: 'Floating Quartz Holographic Console',
    trading_wall: 'Multi-Feed Smoked Obsidian Bloomberg-Tier'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl animate-fade-in">
      <div className="relative flex h-[86vh] max-h-[840px] w-full max-w-5xl flex-col rounded-3xl border border-sky-500/30 bg-[#060814] shadow-[0_0_80px_rgba(56,189,248,0.2)] overflow-hidden">
        
        {/* Luxury Suite Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-[#04060f]/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-slate-300 hover:border-sky-400 hover:text-white transition"
              title="Return to Headquarters Panoramic Map"
            >
              <ArrowLeft className="h-4 w-4 text-sky-400" />
              <span>RETURN TO HQ</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-800" />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-wide font-mono">
                  {agent.name.toUpperCase()}&apos;S EXECUTIVE SUITE
                </span>
                <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300 border border-sky-400/30">
                  {office.suiteName}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Floor 42 &bull; West Executive Wing &bull; ALFERNEX Cyber-Tower
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span className="font-mono text-emerald-400 font-bold uppercase">{agent.status}</span>
            </div>

            <button
              onClick={handleClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Panoramic Office View Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          
          {/* Panoramic Window & Skyline Simulation */}
          <div className="relative h-48 w-full rounded-2xl border border-sky-500/20 bg-gradient-to-b from-[#0a1128] via-[#060814] to-[#04060f] p-5 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Cyber city background horizon */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#04060f] to-transparent pointer-events-none" />
            
            {/* Sky lighting accent */}
            <div 
              style={{ backgroundColor: `${agent.color}30` }}
              className="absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl pointer-events-none" 
            />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sky-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-300 font-mono">
                    Panoramic Skyline &bull; Cyber-Metropolis View
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Skyline: <span className="text-white font-bold">{office.panoramicView}</span>
                </div>
              </div>

              {/* Agent Persona badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    style={{ borderColor: agent.color, backgroundColor: `${agent.color}25` }}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 font-mono text-2xl font-black text-white shadow-[0_0_25px_rgba(56,189,248,0.3)]"
                  >
                    {agent.name.slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white font-mono">{agent.name}</h2>
                    <p className="text-xs font-semibold text-sky-400">{agent.role}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{agent.specialty}</p>
                  </div>
                </div>

                <div className="hidden md:flex flex-col items-end text-right">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Engine & Intelligence</span>
                  <span className="text-sm font-bold text-purple-300 font-mono">{agent.model}</span>
                  <span className="text-[11px] text-slate-400">{agent.personality}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Live Holographic Displays (Personalized Workspace) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-sky-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Active Holographic Telemetry & Live Feeds
                </h3>
              </div>
              <span className="text-[10px] font-mono text-sky-400">ACTIVE FEED &bull; REAL-TIME</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {office.hologramDisplays.map((holo, idx) => (
                <div
                  key={idx}
                  style={{ borderColor: `${agent.color}40`, boxShadow: `0 0 20px ${agent.color}15` }}
                  className="rounded-2xl border bg-slate-950/70 p-4 backdrop-blur-md transition hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-mono uppercase font-bold tracking-wider">{holo.title}</span>
                    <span style={{ color: agent.color }}>
                      <Activity className="h-3.5 w-3.5 animate-pulse" />
                    </span>
                  </div>
                  <div style={{ color: agent.color }} className="text-xl font-black font-mono tracking-tight mb-1">
                    {holo.value}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {holo.subtext || holo.badge || 'Live telemetry stream'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Directive & Task Telemetry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Task Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 font-bold uppercase text-sky-300">
                  <Zap className="h-3.5 w-3.5 text-sky-400" /> Current Executive Task
                </span>
                <span className="text-sky-400 font-bold">{agent.taskProgress}%</span>
              </div>
              <p className="text-sm font-semibold text-white mb-3">
                &ldquo;{agent.currentTask}&rdquo;
              </p>
              
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  style={{ width: `${agent.taskProgress}%`, backgroundColor: agent.color }}
                  className="h-full rounded-full transition-all duration-500 shadow-[0_0_10px_currentColor]"
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Completed Today: <strong className="text-white">{agent.tasksCompleted}</strong></span>
                <span>Active Tasks: <strong className="text-white">{agent.runningTasks}</strong></span>
              </div>
            </div>

            {/* Suite Ergonomics & Luxury Furnishings */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-sky-300 mb-2.5">
                <Coffee className="h-3.5 w-3.5 text-amber-400" />
                <span>Executive Office Specifications</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-2">
                  <span className="text-slate-400 block text-[9.5px] uppercase">Executive Desk</span>
                  <span className="font-semibold text-slate-200">{deskDescriptions[office.deskStyle] || office.deskStyle}</span>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-2">
                  <span className="text-slate-400 block text-[9.5px] uppercase">Wall Finish</span>
                  <span className="font-semibold text-slate-200">{office.wallColor}</span>
                </div>
                <div className="col-span-2 rounded-xl border border-slate-800/80 bg-slate-900/60 p-2">
                  <span className="text-slate-400 block text-[9.5px] uppercase">Suite Appointments</span>
                  <span className="font-semibold text-slate-200">{office.decorItems.join(' • ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Long-Term Memory Excerpts */}
          {agent.memoryItems && agent.memoryItems.length > 0 && (
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
              <div className="flex items-center gap-2 mb-2 text-xs font-mono font-bold uppercase text-purple-300">
                <Brain className="h-4 w-4 text-purple-400" />
                <span>Contextual Memory Recall (Shopify, Scale & Decisions)</span>
              </div>
              <div className="space-y-1.5">
                {agent.memoryItems.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-xs text-slate-300"
                  >
                    <span>{item.content}</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{item.category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Suite Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-[#04060f] px-6 py-4">
          <div className="text-xs text-slate-400">
            Selected Agent: <strong className="text-white font-mono">{agent.name}</strong> &bull; {agent.role}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleInviteToMeeting}
              className="flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-600/20 px-4 py-2 text-xs font-bold text-purple-300 hover:bg-purple-600/30 transition shadow-md"
            >
              <Users2 className="h-4 w-4" />
              <span>INVITE TO BOARDROOM</span>
            </button>

            <button
              onClick={handleOpenAssignTask}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition"
            >
              <PlusCircle className="h-4 w-4 text-sky-400" />
              <span>ASSIGN TASK</span>
            </button>

            <button
              onClick={handleOpenChat}
              className="flex items-center gap-1.5 rounded-xl border border-sky-400 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 px-5 py-2 text-xs font-extrabold text-white shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:brightness-110 active:scale-95 transition"
            >
              <MessageSquare className="h-4 w-4" />
              <span>TALK TO {agent.name.toUpperCase()}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

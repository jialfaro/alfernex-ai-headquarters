'use client';

import React, { useState } from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import { DEPARTMENTS, DEPARTMENT_LIST } from '../../data/departments';
import { DepartmentId } from '../../types/office';
import {
  X,
  MessageSquare,
  PlusCircle,
  Crosshair,
  Home,
  Navigation,
  Cpu,
  Wrench,
  Clock,
  CheckCircle2,
  Activity,
  Sparkles,
  Eye,
  Database,
  Sliders,
  History,
  Shield,
  Mic
} from 'lucide-react';
import { soundFX } from '../audio/soundEffects';

export const AgentDetailModal: React.FC = () => {
  const selectedAgentId = useOfficeStore((s) => s.selectedAgentId);
  const agents = useOfficeStore((s) => s.agents);
  const camera = useOfficeStore((s) => s.camera);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);

  const selectAgent = useOfficeStore((s) => s.selectAgent);
  const toggleFollowAgent = useOfficeStore((s) => s.toggleFollowAgent);
  const recallAgentToDesk = useOfficeStore((s) => s.recallAgentToDesk);
  const sendAgentToRoom = useOfficeStore((s) => s.sendAgentToRoom);
  const setAssignTaskModalOpen = useOfficeStore((s) => s.setAssignTaskModalOpen);
  const setChatModalOpen = useOfficeStore((s) => s.setChatModalOpen);
  const startVoiceSession = useOfficeStore((s) => s.startVoiceSession);
  const enterAgentOffice = useOfficeStore((s) => s.enterAgentOffice);
  const focusDepartment = useOfficeStore((s) => s.focusDepartment);

  const [activeTab, setActiveTab] = useState<'profile' | 'memory' | 'history'>('profile');

  const agent = agents.find((a) => a.id === selectedAgentId);
  if (!agent) return null;

  const dept = DEPARTMENTS[agent.department];
  const isFollowing = camera.followingAgentId === agent.id;

  // Status mapping
  const statusMeta: Record<string, { label: string; color: string; dotClass: string }> = {
    online: { label: 'ONLINE', color: '#10b981', dotClass: 'bg-emerald-400' },
    working: { label: 'WORKING', color: '#3b82f6', dotClass: 'bg-blue-400' },
    thinking: { label: 'THINKING', color: '#a855f7', dotClass: 'bg-purple-400 animate-pulse' },
    waiting: { label: 'WAITING', color: '#eab308', dotClass: 'bg-amber-400' },
    'in-meeting': { label: 'IN MEETING', color: '#f97316', dotClass: 'bg-orange-400' },
    error: { label: 'ERROR', color: '#ef4444', dotClass: 'bg-rose-400' },
    offline: { label: 'OFFLINE', color: '#64748b', dotClass: 'bg-slate-400' }
  };

  const statusInfo = statusMeta[agent.status] || statusMeta.online;

  return (
    <aside className="fixed top-14 right-0 bottom-10 z-30 w-full max-w-md border-l border-slate-800 bg-[#040815]/95 p-6 shadow-2xl backdrop-blur-2xl overflow-y-auto no-scrollbar transition-all duration-300 animate-slide-in-right">
      {/* Top Bar with Close Button */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${statusInfo.dotClass}`} />
          <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
            ALFERNEX // AGENT DOSSIER
          </span>
        </div>
        <button
          onClick={() => {
            selectAgent(null);
            soundFX.playClick(soundEnabled);
          }}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Agent Identity Hero */}
      <div className="mt-5 flex items-start gap-4">
        <div
          style={{ borderColor: agent.color, boxShadow: `0 0 25px ${agent.color}40` }}
          className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border-2 bg-gradient-to-br from-slate-900 to-slate-950 font-mono text-2xl font-black text-white"
        >
          {agent.name.slice(0, 2)}
          <span
            className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#060913]"
            style={{ backgroundColor: statusInfo.color }}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-wide text-white font-mono">{agent.name}</h2>
            <span
              style={{ backgroundColor: `${statusInfo.color}20`, borderColor: `${statusInfo.color}60`, color: statusInfo.color }}
              className="rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider font-mono"
            >
              ● {statusInfo.label}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide">{agent.role}</div>
          <button
            onClick={() => focusDepartment(agent.department)}
            className="mt-1 flex items-center gap-1.5 text-xs text-sky-400 hover:underline"
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dept.color }} />
            <span>{dept.name}</span>
          </button>
        </div>
      </div>

      {/* Primary Action Buttons: REALTIME VOICE & TEXT & ASSIGN TASK */}
      <div className="mt-5 space-y-2.5">
        <button
          onClick={() => {
            startVoiceSession(agent.id);
            soundFX.playClick(soundEnabled);
          }}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-cyan-400/80 bg-gradient-to-r from-cyan-500/25 via-sky-600/30 to-blue-600/30 py-3 text-xs font-black uppercase tracking-wider text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:brightness-125 hover:shadow-[0_0_25px_rgba(6,182,212,0.55)] transition active:scale-95 group"
        >
          <Mic className="h-4 w-4 text-cyan-300 animate-pulse group-hover:scale-110 transition-transform" />
          <span>🎙 TALK TO AGENT (VOZ EN VIVO)</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              setChatModalOpen(true);
              soundFX.playClick(soundEnabled);
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-sky-400/50 bg-gradient-to-r from-sky-500/25 to-indigo-600/25 py-2.5 text-xs font-bold text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.25)] hover:bg-sky-500/35 transition active:scale-95"
          >
            <MessageSquare className="h-4 w-4" />
            <span>CHAT ESCRITO</span>
          </button>

          <button
            onClick={() => {
              setAssignTaskModalOpen(true);
              soundFX.playClick(soundEnabled);
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-purple-400/50 bg-gradient-to-r from-purple-500/25 to-pink-600/25 py-2.5 text-xs font-bold text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:bg-purple-500/35 transition active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>ASSIGN TASK</span>
          </button>
        </div>
      </div>

      {/* Secondary Quick Buttons: VIEW OFFICE, FOLLOW, RECALL */}
      <div className="mt-2.5 grid grid-cols-3 gap-2">
        <button
          onClick={() => {
            enterAgentOffice(agent.id);
          }}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 py-2 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>VIEW OFFICE</span>
        </button>

        <button
          onClick={() => {
            toggleFollowAgent();
            soundFX.playClick(soundEnabled);
          }}
          className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-[11px] font-bold transition ${
            isFollowing
              ? 'border-sky-400 bg-sky-500/25 text-white'
              : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
          }`}
        >
          <Crosshair className="h-3.5 w-3.5" />
          <span>{isFollowing ? 'LOCKED' : 'FOLLOW'}</span>
        </button>

        <button
          onClick={() => {
            recallAgentToDesk(agent.id);
            soundFX.playClick(soundEnabled);
          }}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 py-2 text-[11px] font-bold text-slate-300 hover:border-slate-700 transition"
        >
          <Home className="h-3.5 w-3.5" />
          <span>RECALL</span>
        </button>
      </div>

      {/* Sub Tabs: Profile, Memory, History */}
      <div className="mt-5 flex border-b border-slate-800 text-xs font-mono font-bold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-2.5 mr-4 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'profile' ? 'border-sky-400 text-sky-300' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>PROFILE</span>
        </button>
        <button
          onClick={() => setActiveTab('memory')}
          className={`pb-2.5 mr-4 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'memory' ? 'border-purple-400 text-purple-300' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Database className="h-3.5 w-3.5" />
          <span>MEMORY ({agent.memoryCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'history' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <History className="h-3.5 w-3.5" />
          <span>TASKS ({agent.tasks.length})</span>
        </button>
      </div>

      {/* Tab 1: Profile View */}
      {activeTab === 'profile' && (
        <div className="space-y-4 mt-4">
          {/* Current Task HUD Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono">
                CURRENT TASK
              </span>
              <span className="font-mono font-bold text-sky-400">{agent.taskProgress}%</span>
            </div>

            <p className="mt-2 text-xs font-semibold text-white leading-relaxed font-mono">
              &ldquo;{agent.currentTask}&rdquo;
            </p>

            {/* Progress Bar */}
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                style={{ width: `${agent.taskProgress}%`, backgroundColor: agent.color }}
                className="h-full rounded-full transition-all duration-300 shadow-[0_0_10px_currentColor]"
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Activity Rate: {agent.activityLevel}%</span>
              <span>Last seen: {agent.lastActivity}</span>
            </div>
          </div>

          {/* Performance Statistics Grid */}
          <div className="grid grid-cols-4 gap-2 text-center font-mono">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2">
              <span className="text-[9px] text-slate-500 uppercase block">Today</span>
              <span className="text-sm font-bold text-white">{agent.tasksToday}</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2">
              <span className="text-[9px] text-slate-500 uppercase block">Done</span>
              <span className="text-sm font-bold text-emerald-400">{agent.tasksCompleted}</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2">
              <span className="text-[9px] text-slate-500 uppercase block">Running</span>
              <span className="text-sm font-bold text-amber-400">{agent.runningTasks}</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2">
              <span className="text-[9px] text-slate-500 uppercase block">Waiting</span>
              <span className="text-sm font-bold text-slate-400">{agent.waitingTasks}</span>
            </div>
          </div>

          {/* Model Architecture & Personality */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">MODEL ARCHITECTURE</span>
              <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-bold font-mono text-purple-300 uppercase border border-purple-500/30">
                {agent.modelProvider}
              </span>
            </div>
            <div className="font-mono text-xs font-bold text-purple-300">{agent.model}</div>
            <p className="text-[11px] text-slate-400 leading-relaxed italic">&ldquo;{agent.personality}&rdquo;</p>
          </div>

          {/* Skills & Integrated Tools */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">SKILLS</span>
            <div className="flex flex-wrap gap-1.5">
              {agent.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-slate-800 bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>

            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block pt-1">TOOLS & APIS</span>
            <div className="flex flex-wrap gap-1.5">
              {agent.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-mono text-sky-300"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Security Permissions */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase font-mono">
              <Shield className="h-3 w-3 text-emerald-400" />
              <span>ACTIVE PERMISSIONS</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {agent.permissions.map((perm) => (
                <span
                  key={perm}
                  className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-300 border border-emerald-500/20"
                >
                  ✓ {perm}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Memory View */}
      {activeTab === 'memory' && (
        <div className="space-y-3 mt-4">
          <div className="text-[11px] text-slate-400 leading-relaxed">
            Memoria contextual y preferencias almacenadas por <span className="text-white font-bold">{agent.name}</span>.
          </div>

          <div className="space-y-2">
            {agent.memoryItems.map((mem) => (
              <div
                key={mem.id}
                className="rounded-xl border border-purple-500/20 bg-purple-950/15 p-3 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="rounded bg-purple-500/30 px-1.5 py-0.2 text-purple-300 uppercase font-bold">
                    {mem.category}
                  </span>
                  <span className="text-slate-500">{mem.timestamp}</span>
                </div>
                <p className="text-slate-200 text-[11px] leading-relaxed">{mem.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Tasks History */}
      {activeTab === 'history' && (
        <div className="space-y-2.5 mt-4">
          {agent.tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-xs space-y-1"
            >
              <div className="flex items-center justify-between font-semibold text-white">
                <span className="truncate pr-2 font-mono text-xs">{task.title}</span>
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold font-mono ${
                    task.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{task.description}</p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Priority: {task.priority}</span>
                <span>{task.assignedAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

'use client';

import React, { useState } from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import { X, CheckCircle, AlertTriangle, Flame, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../audio/soundEffects';

export const AssignTaskModal: React.FC = () => {
  const isAssignTaskModalOpen = useOfficeStore((s) => s.isAssignTaskModalOpen);
  const selectedAgentId = useOfficeStore((s) => s.selectedAgentId);
  const agents = useOfficeStore((s) => s.agents);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);

  const setAssignTaskModalOpen = useOfficeStore((s) => s.setAssignTaskModalOpen);
  const assignTaskToAgent = useOfficeStore((s) => s.assignTaskToAgent);

  const agent = agents.find((a) => a.id === selectedAgentId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');

  if (!isAssignTaskModalOpen || !agent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    assignTaskToAgent(agent.id, title.trim(), description.trim(), priority);

    // Trigger celebration confetti
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });

    soundFX.playSuccess(soundEnabled);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-purple-500/40 bg-[#090e1d] p-6 shadow-[0_0_50px_rgba(168,85,247,0.25)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black tracking-wide text-white font-mono">
              ASSIGN MISSION DIRECTIVE
            </h3>
            <p className="text-xs text-slate-400">
              Assigning to <span className="font-bold text-sky-400">{agent.name}</span> ({agent.role})
            </p>
          </div>

          <button
            onClick={() => setAssignTaskModalOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Task Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
              Mission Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design event-driven Redis cache invalidation layer"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
              Operational Scope & Specifications
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, constraints, required tools, and target metrics..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
              Execution Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'low', label: 'Low', icon: CheckCircle, color: 'text-slate-400 border-slate-700' },
                { id: 'medium', label: 'Medium', icon: ShieldAlert, color: 'text-blue-400 border-blue-500/40' },
                { id: 'high', label: 'High', icon: AlertTriangle, color: 'text-amber-400 border-amber-500/40' },
                { id: 'critical', label: 'Critical', icon: Flame, color: 'text-rose-400 border-rose-500/40' }
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id as typeof priority)}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-2.5 text-xs font-bold transition ${
                      isSelected
                        ? 'bg-purple-500/25 border-purple-400 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : `bg-slate-900/60 ${p.color} hover:bg-slate-850`
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setAssignTaskModalOpen(false)}
              className="rounded-xl border border-slate-800 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl border border-purple-400 bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:brightness-110 active:scale-95 transition"
            >
              DISPATCH DIRECTIVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

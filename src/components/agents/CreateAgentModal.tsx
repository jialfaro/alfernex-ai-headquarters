'use client';

import React, { useState } from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import { DEPARTMENT_LIST } from '../../data/departments';
import { DepartmentId } from '../../types/office';
import { X, Bot, Sparkles, Cpu, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../audio/soundEffects';

const PRESET_COLORS = [
  '#00f0ff', // Electric Cyan
  '#38bdf8', // Sky Blue
  '#8b5cf6', // Violet
  '#ec4899', // Magenta
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#f43f5e'  // Rose
];

export const CreateAgentModal: React.FC = () => {
  const isCreateAgentModalOpen = useOfficeStore((s) => s.isCreateAgentModalOpen);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);
  const setCreateAgentModalOpen = useOfficeStore((s) => s.setCreateAgentModalOpen);
  const createAgent = useOfficeStore((s) => s.createAgent);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState<DepartmentId>('development');
  const [personality, setPersonality] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [model, setModel] = useState('Claude 3.5 Sonnet (Production Node)');
  const [tools, setTools] = useState('Python, Git, Docker, FastApi');
  const [skills, setSkills] = useState('Autonomous Workflow, API Integration, Clean Code');
  const [color, setColor] = useState('#00f0ff');

  if (!isCreateAgentModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    createAgent({
      name: name.trim().toUpperCase(),
      role: role.trim(),
      department,
      personality: personality.trim() || 'High-performance autonomous intelligence.',
      specialty: specialty.trim() || 'Strategic task automation and system synthesis.',
      model,
      color,
      tools: tools.split(',').map((t) => t.trim()).filter(Boolean),
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean)
    });

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 }
    });

    soundFX.playSuccess(soundEnabled);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-sky-500/40 bg-[#090e1d] p-6 shadow-[0_0_60px_rgba(56,189,248,0.25)] overflow-y-auto max-h-[90vh] no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/40 bg-sky-500/10 text-sky-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-wide text-white font-mono">
                SYNTHESIZE NEW AI AGENT
              </h3>
              <p className="text-xs text-slate-400">Deploy an autonomous digital employee into ALFERNEX HQ</p>
            </div>
          </div>

          <button
            onClick={() => setCreateAgentModalOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Create Agent Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                Agent Codename / Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CYBER, VALKYRIE, KRONOS"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                Corporate Cargo / Role
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. AI Prompt Optimizer, Growth Hacker"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                Department Office
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as DepartmentId)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition cursor-pointer"
              >
                {DEPARTMENT_LIST.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                Neural Model Engine
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition cursor-pointer"
              >
                <option value="Claude 3.5 Sonnet (Architecture Engine)">Claude 3.5 Sonnet</option>
                <option value="GPT-4o (Omni Reasoning Core)">GPT-4o Omni</option>
                <option value="Gemini 1.5 Pro (Deep Research Matrix)">Gemini 1.5 Pro</option>
                <option value="DeepSeek R1 (Statistical Reasoning)">DeepSeek R1</option>
                <option value="Custom Fine-Tuned LoRA Node">Custom LLM / Fine-Tuned Node</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
              Specialty & Primary Mandate
            </label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="e.g. Automated conversion rate optimization on TikTok & Reels"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
              Personality Matrix & Directives
            </label>
            <textarea
              rows={2}
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="e.g. Meticulous, relentless optimizer with zero tolerance for inefficiencies."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                Integrated Tools (comma-separated)
              </label>
              <input
                type="text"
                value={tools}
                onChange={(e) => setTools(e.target.value)}
                placeholder="Python, Git, Docker, Terminal"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                Core Skills (comma-separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="API Design, Data Cleaning, Copywriting"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-400 transition"
              />
            </div>
          </div>

          {/* Accent Color Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
              Cyber Armor Accent Color
            </label>
            <div className="flex items-center gap-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c, boxShadow: color === c ? `0 0 15px ${c}` : 'none' }}
                  className={`h-7 w-7 rounded-full border-2 transition ${
                    color === c ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCreateAgentModalOpen(false)}
              className="rounded-xl border border-slate-800 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl border border-sky-400 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:brightness-110 active:scale-95 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>SPAWN AGENT INTO HQ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

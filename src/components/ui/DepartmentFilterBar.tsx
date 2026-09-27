'use client';

import React from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import { DEPARTMENT_LIST } from '../../data/departments';
import { AgentStatus, DepartmentId } from '../../types/office';
import { soundFX } from '../audio/soundEffects';

const STATUS_FILTERS: { id: AgentStatus | 'all'; label: string; dotColor: string }[] = [
  { id: 'all', label: 'All Status', dotColor: 'bg-slate-400' },
  { id: 'working', label: 'Working', dotColor: 'bg-emerald-400' },
  { id: 'thinking', label: 'Thinking', dotColor: 'bg-purple-400' },
  { id: 'waiting', label: 'Waiting', dotColor: 'bg-amber-400' },
  { id: 'online', label: 'Online', dotColor: 'bg-blue-400' }
];

export const DepartmentFilterBar: React.FC = () => {
  const filterDepartment = useOfficeStore((s) => s.filterDepartment);
  const filterStatus = useOfficeStore((s) => s.filterStatus);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);

  const setFilterDepartment = useOfficeStore((s) => s.setFilterDepartment);
  const setFilterStatus = useOfficeStore((s) => s.setFilterStatus);
  const focusDepartment = useOfficeStore((s) => s.focusDepartment);

  return (
    <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-[#060913]/70 px-4 py-1.5 backdrop-blur-sm">
      {/* Department horizontal pill scroller */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => {
            setFilterDepartment('all');
            soundFX.playClick(soundEnabled);
          }}
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide transition ${
            filterDepartment === 'all'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-[0_0_8px_rgba(56,189,248,0.2)]'
              : 'text-slate-400 hover:text-white border border-transparent'
          }`}
        >
          All Departments
        </button>

        {DEPARTMENT_LIST.map((dept) => {
          const isActive = filterDepartment === dept.id;
          return (
            <button
              key={dept.id}
              onClick={() => {
                setFilterDepartment(dept.id);
                focusDepartment(dept.id);
                soundFX.playClick(soundEnabled);
              }}
              style={{
                borderColor: isActive ? dept.color : 'transparent',
                backgroundColor: isActive ? `${dept.color}20` : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8'
              }}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border transition hover:text-white whitespace-nowrap"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: dept.color }}
              />
              {dept.shortName}
            </button>
          );
        })}
      </div>

      {/* Status Filter Chips */}
      <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-800 pl-3">
        {STATUS_FILTERS.map((s) => {
          const isActive = filterStatus === s.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                setFilterStatus(s.id);
                soundFX.playClick(soundEnabled);
              }}
              className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase transition ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${s.dotColor}`} />
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

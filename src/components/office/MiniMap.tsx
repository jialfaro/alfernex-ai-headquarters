'use client';

import React, { useState } from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import { DEPARTMENT_LIST } from '../../data/departments';
import { DepartmentId } from '../../types/office';
import { MapPin, Maximize2, Minimize2 } from 'lucide-react';
import { soundFX } from '../audio/soundEffects';

export const MiniMap: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const agents = useOfficeStore((s) => s.agents);
  const camera = useOfficeStore((s) => s.camera);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);

  const focusDepartment = useOfficeStore((s) => s.focusDepartment);
  const setCamera = useOfficeStore((s) => s.setCamera);

  // Map world space (width: 2400, height: 2000) to mini-map coordinates (width: 220, height: 160)
  const mapW = isExpanded ? 320 : 200;
  const mapH = isExpanded ? 240 : 150;
  const worldW = 2400;
  const worldH = 2000;

  const scaleX = mapW / worldW;
  const scaleY = mapH / worldH;

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetWorldX = clickX / scaleX;
    const targetWorldY = clickY / scaleY;

    setCamera({
      targetX: targetWorldX,
      targetY: targetWorldY,
      followingAgentId: null
    });

    soundFX.playClick(soundEnabled);
  };

  return (
    <div className="absolute bottom-16 left-4 z-20 flex flex-col items-start gap-1">
      {/* Radar HUD Frame */}
      <div
        style={{ width: mapW, height: mapH }}
        onClick={handleMapClick}
        className="relative cursor-crosshair overflow-hidden rounded-xl border border-sky-500/40 bg-[#060913]/90 shadow-[0_0_20px_rgba(0,240,255,0.2)] backdrop-blur-md transition-all duration-200"
      >
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c710_1px,transparent_1px),linear-gradient(to_bottom,#0284c710_1px,transparent_1px)] bg-[size:16px_16px]" />

        {/* Sweep radar line animation */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-400/10 to-transparent animate-radar-sweep" />

        {/* Departments wireframes */}
        {DEPARTMENT_LIST.map((dept) => {
          const dx = dept.bounds.x * scaleX;
          const dy = dept.bounds.y * scaleY;
          const dw = dept.bounds.width * scaleX;
          const dh = dept.bounds.height * scaleY;

          return (
            <div
              key={dept.id}
              onClick={(e) => {
                e.stopPropagation();
                focusDepartment(dept.id as DepartmentId);
                soundFX.playSelect(soundEnabled);
              }}
              title={dept.name}
              style={{
                left: dx,
                top: dy,
                width: dw,
                height: dh,
                borderColor: `${dept.color}60`,
                backgroundColor: `${dept.color}15`
              }}
              className="absolute rounded border text-[8px] font-mono text-slate-400 hover:border-white transition flex items-center justify-center pointer-events-auto"
            >
              {isExpanded && (
                <span className="truncate px-0.5" style={{ color: dept.color }}>
                  {dept.shortName}
                </span>
              )}
            </div>
          );
        })}

        {/* Real-time Agents Dots */}
        {agents.map((agent) => {
          const ax = agent.position.x * scaleX;
          const ay = agent.position.y * scaleY;

          return (
            <div
              key={agent.id}
              title={`${agent.name} (${agent.role})`}
              style={{
                left: ax - 3,
                top: ay - 3,
                backgroundColor: agent.color,
                boxShadow: `0 0 6px ${agent.color}`
              }}
              className="absolute h-2 w-2 rounded-full animate-ping pointer-events-none"
            />
          );
        })}

        {/* Camera Viewport Indicator */}
        <div
          style={{
            left: camera.x * scaleX - 18,
            top: camera.y * scaleY - 14,
            width: 36 / camera.zoom,
            height: 28 / camera.zoom
          }}
          className="pointer-events-none absolute rounded border border-white/60 bg-white/5"
        />

        {/* Top Mini-map Header */}
        <div className="pointer-events-none absolute top-1 left-2 flex items-center gap-1.5 text-[9px] font-bold tracking-wider text-sky-400 font-mono">
          <MapPin className="h-2.5 w-2.5" />
          <span>HQ RADAR // LIVE</span>
        </div>

        {/* Expand / Minimize Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
            soundFX.playClick(soundEnabled);
          }}
          className="absolute top-1 right-1 rounded p-1 text-slate-400 hover:text-white transition bg-slate-900/60"
        >
          {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
        </button>
      </div>
    </div>
  );
};

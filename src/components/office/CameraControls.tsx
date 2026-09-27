'use client';

import React from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import { Plus, Minus, RotateCcw, Maximize, Compass } from 'lucide-react';
import { soundFX } from '../audio/soundEffects';

export const CameraControls: React.FC = () => {
  const zoomCamera = useOfficeStore((s) => s.zoomCamera);
  const resetCamera = useOfficeStore((s) => s.resetCamera);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
    soundFX.playClick(soundEnabled);
  };

  return (
    <div className="absolute bottom-16 right-4 z-20 flex flex-col gap-1.5 rounded-xl border border-slate-800 bg-[#060913]/90 p-1.5 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md">
      <button
        onClick={() => {
          zoomCamera(1.2);
          soundFX.playClick(soundEnabled);
        }}
        title="Zoom In"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-sky-400 hover:text-white transition active:scale-95"
      >
        <Plus className="h-4 w-4" />
      </button>

      <button
        onClick={() => {
          zoomCamera(0.83);
          soundFX.playClick(soundEnabled);
        }}
        title="Zoom Out"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-sky-400 hover:text-white transition active:scale-95"
      >
        <Minus className="h-4 w-4" />
      </button>

      <button
        onClick={() => {
          resetCamera();
          soundFX.playClick(soundEnabled);
        }}
        title="Reset Camera Center"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-sky-400 hover:text-white transition active:scale-95"
      >
        <Compass className="h-4 w-4" />
      </button>

      <button
        onClick={toggleFullscreen}
        title="Toggle Fullscreen"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-sky-400 hover:text-white transition active:scale-95"
      >
        <Maximize className="h-4 w-4" />
      </button>
    </div>
  );
};

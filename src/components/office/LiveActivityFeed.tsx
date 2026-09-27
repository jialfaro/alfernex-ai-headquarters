'use client';

import React from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import { Activity, Radio } from 'lucide-react';

export const LiveActivityFeed: React.FC = () => {
  const liveActivities = useOfficeStore((s) => s.liveActivities);
  const selectAgent = useOfficeStore((s) => s.selectAgent);

  const latestActivities = liveActivities.slice(0, 5);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 flex h-10 items-center justify-between border-t border-slate-800/90 bg-[#060913]/95 px-4 backdrop-blur-md">
      {/* Ticker Title */}
      <div className="flex items-center gap-2 pr-4 border-r border-slate-800 flex-shrink-0">
        <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
        <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 font-mono">
          LIVE ACTIVITY
        </span>
      </div>

      {/* Stream of Real-time Events */}
      <div className="flex flex-1 items-center gap-6 overflow-x-auto no-scrollbar px-3">
        {latestActivities.map((act) => (
          <div
            key={act.id}
            onClick={() => selectAgent(act.agentId)}
            className="flex items-center gap-2 text-xs cursor-pointer hover:opacity-80 transition flex-shrink-0"
          >
            <span
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: act.agentColor, boxShadow: `0 0 6px ${act.agentColor}` }}
            />
            <span className="font-bold text-white font-mono">{act.agentName}:</span>
            <span className="text-slate-300 truncate max-w-[280px]">{act.message}</span>
            <span className="text-[10px] text-slate-500 font-mono">{act.timestamp}</span>
          </div>
        ))}
      </div>

      {/* Network Heartbeat Rate */}
      <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800 text-[10px] text-slate-400 font-mono flex-shrink-0">
        <Activity className="h-3 w-3 text-sky-400" />
        <span>EVENTS: 4.8 EPS</span>
      </div>
    </div>
  );
};

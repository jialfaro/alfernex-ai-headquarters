'use client';

import React from 'react';
import { OfficeCanvas } from '../components/office/OfficeCanvas';
import { Office3DCanvas } from '../components/office/Office3DCanvas';
import { RealisticRoboticsHQ } from '../components/office/v2/RealisticRoboticsHQ';
import { LifeSimOfficeHQ } from '../components/office/sim/LifeSimOfficeHQ';
import { useOfficeStore } from '../store/useOfficeStore';
import { TopHeader } from '../components/ui/TopHeader';
import { ShopifyWarRoomBar } from '../components/shopify/ShopifyWarRoomBar';
import { DepartmentFilterBar } from '../components/ui/DepartmentFilterBar';
import { MiniMap } from '../components/office/MiniMap';
import { LiveActivityFeed } from '../components/office/LiveActivityFeed';
import { CameraControls } from '../components/office/CameraControls';
import { AgentDetailModal } from '../components/agents/AgentDetailModal';
import { AgentChatModal } from '../components/agents/AgentChatModal';
import { AssignTaskModal } from '../components/agents/AssignTaskModal';
import { CreateAgentModal } from '../components/agents/CreateAgentModal';
import { ShopifyOrdersModal } from '../components/shopify/ShopifyOrdersModal';
import { OfficeViewModal } from '../components/office/OfficeViewModal';
import { MeetingRoomModal } from '../components/office/MeetingRoomModal';
import { CEOOfficeModal } from '../components/office/CEOOfficeModal';
import { RealtimeVoiceHUD } from '../components/voice/RealtimeVoiceHUD';
import { IntroSplash } from '../components/ui/IntroSplash';
import { IPhoneExecutiveApp } from '../components/mobile/IPhoneExecutiveApp';

export default function Home() {
  const viewMode = useOfficeStore((s) => s.viewMode);
  const appVersion = useOfficeStore((s) => s.appVersion);
  const isMobileExecutiveView = useOfficeStore((s) => s.isMobileExecutiveView);
  const setIsMobileExecutiveView = useOfficeStore((s) => s.setIsMobileExecutiveView);

  // Auto-detect mobile devices on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobileDevice =
        window.innerWidth < 768 ||
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobileDevice) {
        setIsMobileExecutiveView(true);
      }
    }
  }, [setIsMobileExecutiveView]);

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#030712]">
      {/* Intro Splash Screen */}
      <IntroSplash />

      {isMobileExecutiveView ? (
        /* Native iPhone 15 Pro Max Executive App */
        <IPhoneExecutiveApp />
      ) : (
        /* Full Desktop Virtual Office Headquarters */
        <>
          {/* Top Application Navigation & Metrics Bar */}
          <TopHeader />

          {/* Live Shopify E-Commerce War Room & Sales Bar */}
          <ShopifyWarRoomBar />

          {/* Sub-Header Department & Status Filters (V1 mode) */}
          {appVersion === 'v1' && <DepartmentFilterBar />}

          {/* Main Interactive Virtual Office Canvas (V2 Robots Humanoides vs V1 Campus) */}
          <div className="relative flex-1 w-full h-full overflow-hidden">
            {appVersion === 'sim' ? (
              <LifeSimOfficeHQ />
            ) : appVersion === 'v2' ? (
              <RealisticRoboticsHQ />
            ) : viewMode === '3d' ? (
              <Office3DCanvas />
            ) : (
              <OfficeCanvas />
            )}

            {/* Floating Mini-Map (Bottom-Left in 2.5D mode) */}
            {appVersion === 'v1' && viewMode === '2.5d' && <MiniMap />}

            {/* Camera Navigation Controls (Bottom-Right in 2.5D mode) */}
            {appVersion === 'v1' && viewMode === '2.5d' && <CameraControls />}
          </div>

          {/* Real-time Event Stream Ticker (Fixed Bottom) */}
          <LiveActivityFeed />

          {/* Real-time Bidirectional AI Voice HUD Dock */}
          <RealtimeVoiceHUD />
        </>
      )}

      {/* Slide-out Agent Inspector Drawer */}
      <AgentDetailModal />

      {/* Interactive Chat Modal with Agent */}
      <AgentChatModal />

      {/* Assign Task Directive Modal */}
      <AssignTaskModal />

      {/* Create New AI Agent Modal */}
      <CreateAgentModal />

      {/* Shopify Live Orders & Products Modal */}
      <ShopifyOrdersModal />

      {/* Dedicated Luxury Office Suite Inspection Modal */}
      <OfficeViewModal />

      {/* Executive Boardroom & Collaborative Pipeline Modal */}
      <MeetingRoomModal />

      {/* Supreme Presidential CEO Office & Master Directive Suite */}
      <CEOOfficeModal />

      {/* Real-time Bidirectional AI Voice HUD Dock */}
      <RealtimeVoiceHUD />
    </main>
  );
}

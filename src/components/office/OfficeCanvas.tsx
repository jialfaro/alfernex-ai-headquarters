'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import { DEPARTMENT_LIST } from '../../data/departments';
import { Agent, Department, MeetingSession, WorldPoint } from '../../types/office';
import { soundFX } from '../audio/soundEffects';

// Isometric / 2.5D World Projection Constants
const ISO_ANGLE = Math.PI / 6; // 30 degrees
const COS_A = Math.cos(ISO_ANGLE);
const SIN_A = Math.sin(ISO_ANGLE);

export function worldToIso(wx: number, wy: number): WorldPoint {
  return {
    x: (wx - wy) * COS_A,
    y: (wx + wy) * SIN_A * 0.75 // 2.5D architectural slant ratio
  };
}

export function isoToWorld(ix: number, iy: number): WorldPoint {
  const scaledY = iy / 0.75;
  const wx = (ix / COS_A + scaledY / SIN_A) / 2;
  const wy = (scaledY / SIN_A - ix / COS_A) / 2;
  return { x: wx, y: wy };
}

export const OfficeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Store bindings
  const agents = useOfficeStore((s) => s.agents);
  const selectedAgentId = useOfficeStore((s) => s.selectedAgentId);
  const filterDepartment = useOfficeStore((s) => s.filterDepartment);
  const filterStatus = useOfficeStore((s) => s.filterStatus);
  const camera = useOfficeStore((s) => s.camera);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);
  const activeMeeting = useOfficeStore((s) => s.activeMeeting);

  const selectAgent = useOfficeStore((s) => s.selectAgent);
  const panCamera = useOfficeStore((s) => s.panCamera);
  const zoomCamera = useOfficeStore((s) => s.zoomCamera);
  const tickSimulation = useOfficeStore((s) => s.tickSimulation);
  const setCeoOfficeModalOpen = useOfficeStore((s) => s.setCeoOfficeModalOpen);
  const setMeetingModalOpen = useOfficeStore((s) => s.setMeetingModalOpen);

  // Interaction State
  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);
  const [hoveredDeptId, setHoveredDeptId] = useState<string | null>(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const animTimeRef = useRef(0);

  // Filtered agents list
  const visibleAgents = agents.filter((agent) => {
    if (filterDepartment !== 'all' && agent.department !== filterDepartment) return false;
    if (filterStatus !== 'all' && agent.status !== filterStatus) return false;
    return true;
  });

  // Coordinate transforms
  const screenToWorld = useCallback((screenX: number, screenY: number, canvas: HTMLCanvasElement): WorldPoint => {
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const isoCam = worldToIso(camera.x, camera.y);
    const isoX = (screenX - centerX) / camera.zoom + isoCam.x;
    const isoY = (screenY - centerY) / camera.zoom + isoCam.y;

    return isoToWorld(isoX, isoY);
  }, [camera.x, camera.y, camera.zoom]);

  // Handle Mouse Down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  // Handle Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      panCamera(dx, dy);
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // Hit test against agents
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const worldMouse = screenToWorld(mouseX, mouseY, canvas);

    let foundAgent: string | null = null;
    for (const agent of visibleAgents) {
      const dist = Math.hypot(agent.position.x - worldMouse.x, agent.position.y - worldMouse.y);
      if (dist < 38) {
        foundAgent = agent.id;
        break;
      }
    }
    setHoveredAgentId(foundAgent);

    // Hit test against departments
    let foundDept: string | null = null;
    for (const dept of DEPARTMENT_LIST) {
      if (
        worldMouse.x >= dept.bounds.x &&
        worldMouse.x <= dept.bounds.x + dept.bounds.width &&
        worldMouse.y >= dept.bounds.y &&
        worldMouse.y <= dept.bounds.y + dept.bounds.height
      ) {
        foundDept = dept.id;
        break;
      }
    }
    setHoveredDeptId(foundDept);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Handle Click
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const worldMouse = screenToWorld(mouseX, mouseY, canvas);

    for (const agent of visibleAgents) {
      const dist = Math.hypot(agent.position.x - worldMouse.x, agent.position.y - worldMouse.y);
      if (dist < 42) {
        selectAgent(agent.id);
        soundFX.playSelect(soundEnabled);
        return;
      }
    }

    if (!hoveredAgentId) {
      if (hoveredDeptId === 'executive') {
        setCeoOfficeModalOpen(true);
        soundFX.playSuccess(soundEnabled);
        return;
      }
      if (hoveredDeptId === 'meeting') {
        setMeetingModalOpen(true);
        soundFX.playClick(soundEnabled);
        return;
      }
      selectAgent(null);
    }
  };

  // Handle Wheel Zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    zoomCamera(zoomFactor);
  };

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animFrameId: number;
    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const deltaTime = now - lastTimestamp;
      lastTimestamp = now;
      animTimeRef.current += deltaTime * 0.001;

      tickSimulation(deltaTime);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Luxury Metropolis Night Skyline Background with Atmospheric Glow
      drawSkylineAtmosphere(ctx, width, height, animTimeRef.current);

      // Camera transformation
      const centerX = width / 2;
      const centerY = height / 2;
      const isoCam = worldToIso(camera.x, camera.y);

      ctx.translate(centerX, centerY);
      ctx.scale(camera.zoom, camera.zoom);
      ctx.translate(-isoCam.x, -isoCam.y);

      const time = animTimeRef.current;

      // 2. High-End Italian Dark Marble & Titanium Floor Grid
      drawLuxuryFloorGrid(ctx, time);

      // 3. Departments & Architectural Glass Enclosures
      for (const dept of DEPARTMENT_LIST) {
        const isHovered = hoveredDeptId === dept.id;
        drawLuxuryDepartment(ctx, dept, isHovered, time);
      }

      // 4. Data Energy Packets & Inter-Department Transit Arteries
      drawDataPipelines(ctx, time);

      // 5. Active Meeting Laser Pipeline Connection Lines
      if (activeMeeting) {
        drawMeetingCollaborationLasers(ctx, activeMeeting, agents, time);
      }

      // 6. Draw Agents' Personalized Luxury Desks & Hologram Displays
      for (const agent of agents) {
        drawAgentLuxuryDeskAndHolograms(ctx, agent, selectedAgentId === agent.id, time);
      }

      // 7. Sort & Draw Character Avatars (Isometric Y-Sort)
      const sortedAgents = [...visibleAgents].sort((a, b) => {
        return (a.position.x + a.position.y) - (b.position.x + b.position.y);
      });

      for (const agent of sortedAgents) {
        const isSelected = selectedAgentId === agent.id;
        const isHovered = hoveredAgentId === agent.id;
        drawAgent(ctx, agent, isSelected, isHovered, time);
      }

      ctx.restore();

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [camera, visibleAgents, selectedAgentId, hoveredAgentId, hoveredDeptId, activeMeeting, tickSimulation]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#02040a]">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
      />
    </div>
  );
};

// =========================================================================
// LUXURY VISUAL RENDERERS
// =========================================================================

function drawSkylineAtmosphere(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  // Deep space-grade gradient
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, width * 0.8);
  bgGrad.addColorStop(0, '#0a1024');
  bgGrad.addColorStop(0.5, '#040713');
  bgGrad.addColorStop(1, '#010207');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle distant atmospheric horizon lights
  ctx.save();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.03)';
  ctx.lineWidth = 1;
  const horizonY = height * 0.45;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(0, horizonY + i * 40);
    ctx.lineTo(width, horizonY + i * 40);
    ctx.stroke();
  }
  ctx.restore();
}

function drawLuxuryFloorGrid(ctx: CanvasRenderingContext2D, time: number) {
  ctx.save();
  ctx.lineWidth = 1;

  const step = 80;
  const startX = 350;
  const endX = 2050;
  const startY = 180;
  const endY = 2120;

  // Dark marble grid lines with hairline neon accents
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
  ctx.beginPath();
  for (let x = startX; x <= endX; x += step) {
    const p1 = worldToIso(x, startY);
    const p2 = worldToIso(x, endY);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
  }
  for (let y = startY; y <= endY; y += step) {
    const p1 = worldToIso(startX, y);
    const p2 = worldToIso(endX, y);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
  }
  ctx.stroke();

  // Subtle illuminated diamond nodes
  ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
  for (let x = startX + step; x < endX; x += step * 2) {
    for (let y = startY + step; y < endY; y += step * 2) {
      const pt = worldToIso(x, y);
      ctx.fillRect(pt.x - 1, pt.y - 1, 2, 2);
    }
  }

  ctx.restore();
}

function drawLuxuryDepartment(ctx: CanvasRenderingContext2D, dept: Department, isHovered: boolean, time: number) {
  ctx.save();

  const { x, y, width, height } = dept.bounds;

  // Isometric floor points
  const pTop = worldToIso(x, y);
  const pRight = worldToIso(x + width, y);
  const pBottom = worldToIso(x + width, y + height);
  const pLeft = worldToIso(x, y + height);

  // Luxury Polished Marble Floor Plate with Specular Sheen
  ctx.beginPath();
  ctx.moveTo(pTop.x, pTop.y);
  ctx.lineTo(pRight.x, pRight.y);
  ctx.lineTo(pBottom.x, pBottom.y);
  ctx.lineTo(pLeft.x, pLeft.y);
  ctx.closePath();

  const floorGrad = ctx.createLinearGradient(pTop.x, pTop.y, pBottom.x, pBottom.y);
  floorGrad.addColorStop(0, isHovered ? 'rgba(15, 23, 42, 0.95)' : 'rgba(11, 16, 30, 0.85)');
  floorGrad.addColorStop(1, isHovered ? 'rgba(7, 11, 22, 0.92)' : 'rgba(5, 8, 16, 0.82)');
  ctx.fillStyle = floorGrad;
  ctx.fill();

  // Glowing Titanium Edge Borders
  ctx.lineWidth = isHovered ? 2.5 : 1.2;
  ctx.strokeStyle = isHovered ? dept.color : dept.neonBorder;
  ctx.shadowColor = dept.glowColor;
  ctx.shadowBlur = isHovered ? 24 : 10;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Glass Wall Highlights (Extruded 3D Wall Effect on top edges)
  const wallH = 26;
  ctx.beginPath();
  ctx.moveTo(pTop.x, pTop.y);
  ctx.lineTo(pTop.x, pTop.y - wallH);
  ctx.lineTo(pRight.x, pRight.y - wallH);
  ctx.lineTo(pRight.x, pRight.y);
  ctx.closePath();
  ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';
  ctx.strokeStyle = dept.neonBorder;
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pTop.x, pTop.y);
  ctx.lineTo(pTop.x, pTop.y - wallH);
  ctx.lineTo(pLeft.x, pLeft.y - wallH);
  ctx.lineTo(pLeft.x, pLeft.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Department Thematic Architecture
  const centerIso = worldToIso(dept.center.x, dept.center.y);
  drawDepartmentThematicFurniture(ctx, dept, centerIso, time);

  // Department Title Badge (Floating Executive Hologram)
  const labelY = pTop.y - 30;
  ctx.font = '800 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const badgeWidth = dept.name.length * 7 + 26;
  ctx.fillStyle = 'rgba(4, 7, 16, 0.94)';
  ctx.strokeStyle = dept.color;
  ctx.lineWidth = 1;
  roundRect(ctx, pTop.x - badgeWidth / 2, labelY - 11, badgeWidth, 22, 5);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isHovered ? '#ffffff' : dept.color;
  ctx.fillText(dept.shortName.toUpperCase(), pTop.x, labelY);

  ctx.restore();
}

function drawDepartmentThematicFurniture(
  ctx: CanvasRenderingContext2D,
  dept: Department,
  center: WorldPoint,
  time: number
) {
  ctx.save();

  switch (dept.ambientTheme) {
    case 'executive': {
      // Supreme Presidential CEO Penthouse Suite
      // 1. Gold Embroidered CEO Executive Carpet
      ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(center.x, center.y + 4, 86, 42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 2. High-End CEO Executive Obsidian & Gold Desk
      ctx.fillStyle = '#0f1322';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
      ctx.shadowBlur = 18;

      ctx.beginPath();
      ctx.ellipse(center.x, center.y - 12, 64, 26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Executive Gold Inset Trim
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(center.x, center.y - 12, 50, 18, 0, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Presidential Ergonomic High-Back Chair (Throne)
      ctx.fillStyle = '#1e1b2e';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      roundRect(ctx, center.x - 14, center.y - 44, 28, 22, 6);
      ctx.fill();
      ctx.stroke();

      // 4. Floating Holographic Golden Crown / Master Directive Seal
      const pulse = Math.sin(time * 2.5) * 4;
      ctx.save();
      ctx.translate(center.x, center.y - 50 + pulse);
      ctx.strokeStyle = '#fef08a';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 16;
      ctx.lineWidth = 1.8;

      // Golden Crown 2.5D hologram outline
      ctx.beginPath();
      ctx.moveTo(-16, 6);
      ctx.lineTo(-20, -10);
      ctx.lineTo(-8, -2);
      ctx.lineTo(0, -16);
      ctx.lineTo(8, -2);
      ctx.lineTo(20, -10);
      ctx.lineTo(16, 6);
      ctx.closePath();
      ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.fill();
      ctx.stroke();

      // Master Directive Emblem Text
      ctx.font = '900 8.5px monospace';
      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.fillText('ALEXIS • CEO', 0, 18);
      ctx.restore();

      // 5. Dual Panoramic Curved Executive Displays
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
      ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.lineWidth = 1.2;
      roundRect(ctx, center.x - 48, center.y - 30 + Math.sin(time * 2) * 2, 30, 16, 3);
      ctx.fill();
      ctx.stroke();

      roundRect(ctx, center.x + 18, center.y - 30 + Math.cos(time * 2) * 2, 30, 16, 3);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'hologram-hub': {
      // AI Command Center: Holographic rotating Earth & multi-ring data gyro
      const radius = 52;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
      ctx.shadowBlur = 20;

      for (let i = 0; i < 3; i++) {
        const r = radius - i * 14;
        const rot = time * (0.7 + i * 0.3) * (i % 2 === 0 ? 1 : -1);
        ctx.beginPath();
        ctx.ellipse(center.x, center.y - 18, r, r * 0.48, rot, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Central glowing Earth core
      const pulse = Math.sin(time * 3) * 3;
      const grad = ctx.createRadialGradient(center.x, center.y - 18, 3, center.x, center.y - 18, 16 + pulse);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, '#00f0ff');
      grad.addColorStop(0.8, '#0284c7');
      grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(center.x, center.y - 18, 16 + pulse, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'conference-table': {
      // AI Executive Meeting Boardroom Table
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(139, 92, 246, 0.6)';
      ctx.shadowBlur = 18;

      ctx.beginPath();
      ctx.ellipse(center.x, center.y, 72, 34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Recessed glowing purple glass inset
      ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
      ctx.beginPath();
      ctx.ellipse(center.x, center.y, 50, 22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Holographic ALFERNEX logo centerpiece
      const sweep = (time * 1.5) % (Math.PI * 2);
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(center.x, center.y - 12, 16, 0, sweep);
      ctx.stroke();
      break;
    }

    case 'luxury-lounge': {
      // Cyber Lounge & Cafeteria: Curved bar counter & velvet seating
      ctx.fillStyle = '#0d1627';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;

      // Curved espresso bar
      ctx.beginPath();
      ctx.ellipse(center.x, center.y - 10, 58, 22, 0, 0, Math.PI);
      ctx.stroke();

      // High bar stools
      for (let s = -2; s <= 2; s++) {
        const sx = center.x + s * 22;
        const sy = center.y + 6;
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(sx, sy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Warm coffee pod steam
      const steam = Math.sin(time * 4) * 4;
      ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.beginPath();
      ctx.arc(center.x, center.y - 28 + steam, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'server-racks': {
      // Server Vault with blinking quantum LEDs
      const rackW = 22;
      const rackH = 38;
      for (let i = -2; i <= 2; i++) {
        const rx = center.x + i * 28;
        const ry = center.y - 10;

        ctx.fillStyle = '#0a0f1d';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1;
        roundRect(ctx, rx - rackW / 2, ry - rackH, rackW, rackH, 3);
        ctx.fill();
        ctx.stroke();

        for (let row = 0; row < 5; row++) {
          const blink = Math.sin(time * 8 + i * 3 + row) > 0.1;
          ctx.fillStyle = blink ? '#38bdf8' : '#0369a1';
          ctx.fillRect(rx - 7, ry - rackH + 6 + row * 6, 4, 2);
          ctx.fillStyle = blink ? '#10b981' : '#065f46';
          ctx.fillRect(rx + 3, ry - rackH + 6 + row * 6, 4, 2);
        }
      }
      break;
    }

    default:
      break;
  }

  ctx.restore();
}

// Draw the agent's personalized luxury workstation and floating holographic displays
function drawAgentLuxuryDeskAndHolograms(
  ctx: CanvasRenderingContext2D,
  agent: Agent,
  isSelected: boolean,
  time: number
) {
  ctx.save();

  const deskIso = worldToIso(agent.homeStation.x, agent.homeStation.y);
  const { x, y } = deskIso;

  // 1. Executive Desk Surface (Matte Obsidian or Carbon Wood)
  ctx.fillStyle = '#0c1322';
  ctx.strokeStyle = isSelected ? '#38bdf8' : agent.color;
  ctx.lineWidth = isSelected ? 1.8 : 1;
  ctx.shadowColor = agent.color;
  ctx.shadowBlur = isSelected ? 12 : 4;

  roundRect(ctx, x - 26, y - 10, 52, 18, 4);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 2. Specialized Floating Holographic Displays for each Agent
  const floatBob = Math.sin(time * 3 + agent.name.charCodeAt(0)) * 3;

  if (agent.id === 'vyra-growth') {
    // VYRA's TikTok & ROAS Holographic Display
    ctx.strokeStyle = '#f43f5e';
    ctx.fillStyle = 'rgba(244, 63, 94, 0.12)';
    ctx.lineWidth = 1.2;
    roundRect(ctx, x - 18, y - 36 + floatBob, 36, 22, 3);
    ctx.fill();
    ctx.stroke();

    // Mini ROAS chart bar lines
    ctx.fillStyle = '#fb7185';
    ctx.fillRect(x - 14, y - 24 + floatBob, 6, 8);
    ctx.fillRect(x - 6, y - 28 + floatBob, 6, 12);
    ctx.fillRect(x + 2, y - 32 + floatBob, 6, 16);
    ctx.fillRect(x + 10, y - 30 + floatBob, 4, 14);
  } else if (agent.id === 'max-developer') {
    // MAX's Ultra-wide Curved IDE & Code Matrix
    ctx.strokeStyle = '#3b82f6';
    ctx.fillStyle = 'rgba(59, 130, 246, 0.12)';
    ctx.lineWidth = 1.2;
    roundRect(ctx, x - 22, y - 38 + floatBob, 44, 24, 3);
    ctx.fill();
    ctx.stroke();

    // Glowing syntax lines
    ctx.fillStyle = '#60a5fa';
    for (let l = 0; l < 4; l++) {
      const w = 12 + Math.sin(time * 6 + l) * 8;
      ctx.fillRect(x - 18, y - 34 + l * 5 + floatBob, w, 2);
    }
  } else if (agent.id === 'alex-architect') {
    // ALEX's 3D Cloud Architecture Diagram
    ctx.strokeStyle = '#38bdf8';
    ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1.2;
    roundRect(ctx, x - 20, y - 38 + floatBob, 40, 24, 3);
    ctx.fill();
    ctx.stroke();

    // Connected nodes
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(x - 10, y - 26 + floatBob, 3, 0, Math.PI * 2);
    ctx.arc(x + 10, y - 26 + floatBob, 3, 0, Math.PI * 2);
    ctx.arc(x, y - 32 + floatBob, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (agent.id === 'nex-data') {
    // NEX's Financial Candlestick Candlesticks in Soles
    ctx.strokeStyle = '#14b8a6';
    ctx.fillStyle = 'rgba(20, 184, 166, 0.12)';
    ctx.lineWidth = 1.2;
    roundRect(ctx, x - 20, y - 36 + floatBob, 40, 22, 3);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#2dd4bf';
    ctx.fillRect(x - 12, y - 28 + floatBob, 4, 10);
    ctx.fillRect(x - 4, y - 32 + floatBob, 4, 14);
    ctx.fillRect(x + 4, y - 26 + floatBob, 4, 8);
    ctx.fillRect(x + 12, y - 34 + floatBob, 4, 16);
  }

  ctx.restore();
}

function drawMeetingCollaborationLasers(
  ctx: CanvasRenderingContext2D,
  meeting: MeetingSession,
  agents: Agent[],
  time: number
) {
  ctx.save();

  const meetingAgents = agents.filter((a) => meeting.participatingAgentIds.includes(a.id));
  if (meetingAgents.length < 2) return;

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#a855f7';
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 12;

  // Draw laser connections along the collaboration pipeline
  for (let i = 0; i < meetingAgents.length - 1; i++) {
    const p1 = worldToIso(meetingAgents[i].position.x, meetingAgents[i].position.y);
    const p2 = worldToIso(meetingAgents[i + 1].position.x, meetingAgents[i + 1].position.y);

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y - 15);
    ctx.lineTo(p2.x, p2.y - 15);
    ctx.stroke();

    // Pulse particle traveling between agents
    const tNorm = (time * 1.8 + i * 0.3) % 1;
    const px = p1.x + (p2.x - p1.x) * tNorm;
    const py = (p1.y - 15) + ((p2.y - 15) - (p1.y - 15)) * tNorm;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawDataPipelines(ctx: CanvasRenderingContext2D, time: number) {
  ctx.save();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.16)';

  const nodes = [
    { x: 1200, y: 440 },
    { x: 1200, y: 830 },
    { x: 1200, y: 1260 },
    { x: 1200, y: 1640 },
    { x: 1200, y: 1960 }
  ];

  ctx.beginPath();
  for (let i = 0; i < nodes.length - 1; i++) {
    const p1 = worldToIso(nodes[i].x, nodes[i].y);
    const p2 = worldToIso(nodes[i + 1].x, nodes[i + 1].y);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
  }
  ctx.stroke();

  // Energy packet animations
  const tNorm = (time * 0.45) % 1;
  for (let i = 0; i < nodes.length - 1; i++) {
    const p1 = worldToIso(nodes[i].x, nodes[i].y);
    const p2 = worldToIso(nodes[i + 1].x, nodes[i + 1].y);
    const px = p1.x + (p2.x - p1.x) * tNorm;
    const py = p1.y + (p2.y - p1.y) * tNorm;

    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawAgent(
  ctx: CanvasRenderingContext2D,
  agent: Agent,
  isSelected: boolean,
  isHovered: boolean,
  time: number
) {
  ctx.save();

  const isoPos = worldToIso(agent.position.x, agent.position.y);
  const { x, y } = isoPos;

  // 1. Floor Targeting Rings
  if (isSelected || isHovered) {
    ctx.save();
    ctx.strokeStyle = isSelected ? '#00f0ff' : agent.color;
    ctx.lineWidth = isSelected ? 2.5 : 1.5;
    ctx.shadowColor = isSelected ? '#00f0ff' : agent.color;
    ctx.shadowBlur = isSelected ? 24 : 12;

    const rot = time * 2;
    ctx.beginPath();
    ctx.ellipse(x, y + 2, 28, 14, rot, 0, Math.PI * 2);
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.ellipse(x, y + 2, 20, 10, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 2. Soft Character Shadow
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  ctx.ellipse(x, y + 2, 14, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Movement kinematics
  const isWalking = agent.action === 'walking';
  const walkBob = isWalking ? Math.sin(agent.walkCycle * 2) * 2.5 : Math.sin(time * 2.5) * 0.8;
  const legSwing = isWalking ? Math.sin(agent.walkCycle) * 6 : 0;
  const armSwing = isWalking ? -Math.sin(agent.walkCycle) * 5 : 0;

  const charY = y - 10 + walkBob;

  // Legs & Cyber Boots
  ctx.fillStyle = '#0a0f1d';
  ctx.strokeStyle = agent.color;
  ctx.lineWidth = 1;
  ctx.fillRect(x - 5, charY + 8 + legSwing, 4, 9);
  ctx.fillRect(x + 1, charY + 8 - legSwing, 4, 9);

  // Torso / High-Tech Suit
  ctx.fillStyle = '#162033';
  roundRect(ctx, x - 9, charY - 10, 18, 18, 4);
  ctx.fill();

  // Chest Department Armor Accent Stripe
  ctx.fillStyle = agent.color;
  ctx.shadowColor = agent.color;
  ctx.shadowBlur = 8;
  ctx.fillRect(x - 5, charY - 8, 10, 4);
  ctx.shadowBlur = 0;

  // Arms / Shoulders
  ctx.fillStyle = '#243247';
  ctx.fillRect(x - 12, charY - 9 + armSwing, 3.5, 12);
  ctx.fillRect(x + 8.5, charY - 9 - armSwing, 3.5, 12);

  // Head & Visor
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.arc(x, charY - 18, 7.5, 0, Math.PI * 2);
  ctx.fill();

  // Visor
  ctx.fillStyle = isSelected ? '#00f0ff' : agent.color;
  ctx.shadowColor = isSelected ? '#00f0ff' : agent.color;
  ctx.shadowBlur = 8;
  ctx.fillRect(x - 4.5, charY - 20, 9, 3.5);
  ctx.shadowBlur = 0;

  // 4. Overhead Status Beacon
  const beaconY = charY - 32;
  let statusColor = '#3b82f6'; // working blue
  if (agent.status === 'online') statusColor = '#10b981'; // green
  if (agent.status === 'thinking') statusColor = '#a855f7'; // purple
  if (agent.status === 'waiting') statusColor = '#eab308'; // yellow
  if (agent.status === 'in-meeting') statusColor = '#f97316'; // orange
  if (agent.status === 'error') statusColor = '#ef4444'; // red
  if (agent.status === 'offline') statusColor = '#64748b'; // slate

  ctx.fillStyle = statusColor;
  ctx.shadowColor = statusColor;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(x, beaconY, 3.5, 0, Math.PI * 2);
  ctx.fill();

  const haloR = 5.5 + Math.sin(time * 5) * 1.5;
  ctx.strokeStyle = statusColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, beaconY, haloR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Thinking Aura Waves
  if (agent.status === 'thinking') {
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, charY - 18, 14 + Math.sin(time * 6) * 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 5. Overhead Name HUD Badge
  ctx.font = '700 11px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';

  const nameText = `${agent.name}`;
  const textWidth = ctx.measureText(nameText).width;

  ctx.fillStyle = 'rgba(4, 7, 16, 0.92)';
  ctx.strokeStyle = isSelected ? '#00f0ff' : 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 1;
  roundRect(ctx, x - textWidth / 2 - 8, beaconY - 20, textWidth + 16, 16, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.fillText(nameText, x, beaconY - 7);

  // 6. Speech Bubble
  if (agent.speechBubble) {
    drawSpeechBubble(ctx, x, beaconY - 30, agent.speechBubble);
  }

  ctx.restore();
}

function drawSpeechBubble(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
  ctx.save();
  ctx.font = '600 11px system-ui, -apple-system, sans-serif';
  const width = Math.min(230, ctx.measureText(text).width + 20);
  const height = 24;

  ctx.fillStyle = 'rgba(6, 10, 22, 0.96)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
  ctx.shadowBlur = 12;

  roundRect(ctx, x - width / 2, y - height, width, height, 6);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - 5, y);
  ctx.lineTo(x + 5, y);
  ctx.lineTo(x, y + 5);
  ctx.closePath();
  ctx.fillStyle = 'rgba(6, 10, 22, 0.96)';
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowBlur = 0;

  let display = text;
  if (ctx.measureText(display).width > width - 12) {
    display = display.slice(0, 26) + '...';
  }
  ctx.fillText(display, x, y - height / 2);

  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

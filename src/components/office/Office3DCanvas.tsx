'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useOfficeStore } from '../../store/useOfficeStore';
import { DEPARTMENT_LIST, DEPARTMENTS } from '../../data/departments';
import { Agent, Department, DepartmentId } from '../../types/office';
import { soundFX } from '../audio/soundEffects';
import {
  Crown,
  Eye,
  Camera,
  Maximize2,
  Compass,
  Sparkles,
  Users2,
  Code2,
  TrendingUp,
  Boxes,
  Layers
} from 'lucide-react';

// World 2D to 3D Space Coordinates converter
// Center of world: ~1100, 1150
export function worldTo3D(x: number, y: number): THREE.Vector3 {
  const scale = 0.12;
  return new THREE.Vector3((x - 1100) * scale, 0, (y - 1150) * scale);
}

// Procedural Canvas Texture Generators for Ultra-Realistic Materials
function createMarbleFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian marble base
  ctx.fillStyle = '#080c16';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle marble vein noise
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    let x = Math.random() * 1024;
    let y = Math.random() * 1024;
    ctx.moveTo(x, y);
    for (let j = 0; j < 6; j++) {
      x += (Math.random() - 0.5) * 160;
      y += (Math.random() - 0.5) * 160;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Modern architectural floor grid seams
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
  ctx.lineWidth = 2;
  const tileSize = 128;
  for (let x = 0; x <= 1024; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Corner metallic fasteners
  ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
  for (let x = 0; x <= 1024; x += tileSize) {
    for (let y = 0; y <= 1024; y += tileSize) {
      ctx.fillRect(x - 2, y - 2, 4, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

// Procedural Skyline Texture for 360 Metropolis Backdrop
function createMetropolisSkylineTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep night sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#02040a');
  grad.addColorStop(0.5, '#050a18');
  grad.addColorStop(0.85, '#0b162f');
  grad.addColorStop(1, '#111e3b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 512);

  // Distant stars & nebulae
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 300;
    const r = Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Skyscraper Silhouettes
  let currentX = 0;
  while (currentX < 2048) {
    const bWidth = 30 + Math.random() * 60;
    const bHeight = 120 + Math.random() * 300;
    const bY = 512 - bHeight;

    ctx.fillStyle = '#060a16';
    ctx.fillRect(currentX, bY, bWidth, bHeight);

    // Glowing window lights
    ctx.fillStyle = Math.random() > 0.3 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(251, 191, 36, 0.45)';
    for (let wy = bY + 15; wy < 490; wy += 12) {
      for (let wx = currentX + 6; wx < currentX + bWidth - 6; wx += 8) {
        if (Math.random() > 0.45) {
          ctx.fillRect(wx, wy, 4, 6);
        }
      }
    }

    // Rooftop cyber beacon antenna
    if (Math.random() > 0.6) {
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(currentX + bWidth / 2, bY);
      ctx.lineTo(currentX + bWidth / 2, bY - 30);
      ctx.stroke();
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(currentX + bWidth / 2, bY - 30, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    currentX += bWidth + 4;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// Procedural Hologram Screen Textures
function createHoloScreenTexture(title: string, metrics: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(6, 12, 28, 0.88)';
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, 504, 248);

  ctx.fillStyle = color;
  ctx.font = 'bold 28px monospace';
  ctx.fillText(title, 24, 48);

  ctx.font = '18px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(metrics, 24, 90);

  // Synthetic charts
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(24, 210);
  for (let i = 0; i < 15; i++) {
    const x = 24 + i * 32;
    const y = 210 - Math.sin(i * 0.8) * 50 - Math.random() * 20;
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}

// 3D Billboards for Floating Name Badges
function createAgentNameSprite(name: string, role: string, color: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 100;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(4, 7, 16, 0.92)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;

  // Rounded rectangle
  const r = 16;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(320 - r, 0);
  ctx.arcTo(320, 0, 320, 100, r);
  ctx.arcTo(320, 100, 0, 100, r);
  ctx.arcTo(0, 100, 0, 0, r);
  ctx.arcTo(0, 0, 320, 0, r);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Name
  ctx.font = 'bold 30px system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(name, 160, 44);

  // Role
  ctx.font = 'bold 20px monospace';
  ctx.fillStyle = color;
  ctx.fillText(role.toUpperCase(), 160, 78);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(7.5, 2.3, 1);
  return sprite;
}

export const Office3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Store Bindings
  const agents = useOfficeStore((s) => s.agents);
  const selectedAgentId = useOfficeStore((s) => s.selectedAgentId);
  const filterDepartment = useOfficeStore((s) => s.filterDepartment);
  const filterStatus = useOfficeStore((s) => s.filterStatus);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);
  const activeMeeting = useOfficeStore((s) => s.activeMeeting);
  const viewMode = useOfficeStore((s) => s.viewMode);

  const selectAgent = useOfficeStore((s) => s.selectAgent);
  const setCeoOfficeModalOpen = useOfficeStore((s) => s.setCeoOfficeModalOpen);
  const setMeetingModalOpen = useOfficeStore((s) => s.setMeetingModalOpen);
  const setViewMode = useOfficeStore((s) => s.setViewMode);
  const tickSimulation = useOfficeStore((s) => s.tickSimulation);

  // Interactive Hover State
  const [hoveredAgent, setHoveredAgent] = useState<Agent | null>(null);
  const [cameraPreset, setCameraPreset] = useState<string>('overview');

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetLookAtRef = useRef<THREE.Vector3 | null>(null);

  // Agent 3D Meshes Cache
  const agentMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const clickableObjectsRef = useRef<THREE.Object3D[]>([]);

  // Filtered agents
  const visibleAgents = agents.filter((agent) => {
    if (filterDepartment !== 'all' && agent.department !== filterDepartment) return false;
    if (filterStatus !== 'all' && agent.status !== filterStatus) return false;
    return true;
  });

  // Camera Presets
  const applyCameraPreset = (preset: string) => {
    setCameraPreset(preset);
    soundFX.playClick(soundEnabled);

    if (!cameraRef.current || !controlsRef.current) return;

    if (preset === 'overview') {
      targetCamPosRef.current = new THREE.Vector3(0, 110, 140);
      targetLookAtRef.current = new THREE.Vector3(0, 0, 0);
    } else if (preset === 'ceo') {
      const ceoPos = worldTo3D(DEPARTMENTS.executive.center.x, DEPARTMENTS.executive.center.y);
      targetCamPosRef.current = new THREE.Vector3(ceoPos.x, 32, ceoPos.z + 42);
      targetLookAtRef.current = new THREE.Vector3(ceoPos.x, 10, ceoPos.z);
    } else if (preset === 'meeting') {
      const mPos = worldTo3D(DEPARTMENTS.meeting.center.x, DEPARTMENTS.meeting.center.y);
      targetCamPosRef.current = new THREE.Vector3(mPos.x, 36, mPos.z + 46);
      targetLookAtRef.current = new THREE.Vector3(mPos.x, 8, mPos.z);
    } else if (preset === 'marketing') {
      const mPos = worldTo3D(DEPARTMENTS.marketing.center.x, DEPARTMENTS.marketing.center.y);
      targetCamPosRef.current = new THREE.Vector3(mPos.x, 30, mPos.z + 38);
      targetLookAtRef.current = new THREE.Vector3(mPos.x, 6, mPos.z);
    } else if (preset === 'dev') {
      const dPos = worldTo3D(DEPARTMENTS.development.center.x, DEPARTMENTS.development.center.y);
      targetCamPosRef.current = new THREE.Vector3(dPos.x, 30, dPos.z + 38);
      targetLookAtRef.current = new THREE.Vector3(dPos.x, 6, dPos.z);
    } else if (preset === 'ops') {
      const oPos = worldTo3D(DEPARTMENTS.operations.center.x, DEPARTMENTS.operations.center.y);
      targetCamPosRef.current = new THREE.Vector3(oPos.x, 30, oPos.z + 38);
      targetLookAtRef.current = new THREE.Vector3(oPos.x, 6, oPos.z);
    }
  };

  // Main Scene Initialization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712');
    scene.fog = new THREE.FogExp2('#040714', 0.0035);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      4000
    );
    camera.position.set(0, 110, 140);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Keep camera above floor
    controls.minDistance = 15;
    controls.maxDistance = 350;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. Lighting Architecture
    // Ambient / Hemisphere Fill
    const hemiLight = new THREE.HemisphereLight('#38bdf8', '#020617', 0.7);
    scene.add(hemiLight);

    // Primary Directional Sun/Sky Light
    const dirLight = new THREE.DirectionalLight('#ffffff', 1.8);
    dirLight.position.set(60, 120, 80);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 400;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
    dirLight.shadow.camera.top = 120;
    dirLight.shadow.camera.bottom = -120;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // Secondary Accent Light
    const accentLight = new THREE.PointLight('#00f0ff', 2, 180);
    accentLight.position.set(0, 45, 0);
    scene.add(accentLight);

    // 6. Metropolis 360 Cylinder Backdrop
    const skylineGeo = new THREE.CylinderGeometry(280, 280, 140, 48, 1, true);
    const skylineMat = new THREE.MeshBasicMaterial({
      map: createMetropolisSkylineTexture(),
      side: THREE.BackSide,
      fog: false
    });
    const skylineMesh = new THREE.Mesh(skylineGeo, skylineMat);
    skylineMesh.position.y = 50;
    scene.add(skylineMesh);

    // 7. High-End Polished Obsidian Marble Main Floor
    const floorGeo = new THREE.PlaneGeometry(240, 240);
    const floorMat = new THREE.MeshStandardMaterial({
      map: createMarbleFloorTexture(),
      roughness: 0.15,
      metalness: 0.45
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Floor Glowing Perimeter Cyber Band
    const floorBandGeo = new THREE.RingGeometry(120, 122, 64);
    const floorBandMat = new THREE.MeshBasicMaterial({ color: '#38bdf8', side: THREE.DoubleSide });
    const floorBandMesh = new THREE.Mesh(floorBandGeo, floorBandMat);
    floorBandMesh.rotation.x = -Math.PI / 2;
    floorBandMesh.position.y = 0.05;
    scene.add(floorBandMesh);

    // 8. Build All Departments Architecture & Specialized 3D Furniture
    clickableObjectsRef.current = [];
    buildDepartments3D(scene, clickableObjectsRef.current);

    // 9. Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      tickSimulation(delta * 1000);

      // Smooth Camera Transitions (Slerp / Lerp)
      if (targetCamPosRef.current && targetLookAtRef.current && cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, 0.045);
        controlsRef.current.target.lerp(targetLookAtRef.current, 0.045);
        controlsRef.current.update();

        if (cameraRef.current.position.distanceTo(targetCamPosRef.current) < 0.2) {
          targetCamPosRef.current = null;
          targetLookAtRef.current = null;
        }
      } else {
        controls.update();
      }

      // Rotate 3D Crown & Floating Seals
      const crown = scene.getObjectByName('ceo-floating-crown');
      if (crown) {
        crown.rotation.y = elapsed * 1.2;
        crown.position.y = 8 + Math.sin(elapsed * 2.5) * 0.5;
      }

      const holoEarth = scene.getObjectByName('command-holo-earth');
      if (holoEarth) {
        holoEarth.rotation.y = elapsed * 0.8;
      }

      // Update 3D Agent Avatars
      updateAgentMeshes(scene, agents, elapsed, agentMeshesRef.current, selectedAgentId);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Raycasting Click & Hover Interaction
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // Test agent avatars
    const agentHits: { agentId: string; distance: number }[] = [];
    agentMeshesRef.current.forEach((group, agentId) => {
      const intersects = raycaster.intersectObjects(group.children, true);
      if (intersects.length > 0) {
        agentHits.push({ agentId, distance: intersects[0].distance });
      }
    });

    if (agentHits.length > 0) {
      agentHits.sort((a, b) => a.distance - b.distance);
      selectAgent(agentHits[0].agentId);
      soundFX.playSelect(soundEnabled);

      // Focus camera on selected agent
      const hitAgent = agents.find((a) => a.id === agentHits[0].agentId);
      if (hitAgent) {
        const aPos = worldTo3D(hitAgent.position.x, hitAgent.position.y);
        targetCamPosRef.current = new THREE.Vector3(aPos.x + 12, aPos.y + 14, aPos.z + 18);
        targetLookAtRef.current = new THREE.Vector3(aPos.x, aPos.y + 4, aPos.z);
      }
      return;
    }

    // Test departments / Desks
    const deptIntersects = raycaster.intersectObjects(clickableObjectsRef.current, true);
    if (deptIntersects.length > 0) {
      const topObj = deptIntersects[0].object;
      let curr: THREE.Object3D | null = topObj;
      while (curr) {
        if (curr.name === 'dept-executive') {
          setCeoOfficeModalOpen(true);
          soundFX.playSuccess(soundEnabled);
          return;
        }
        if (curr.name === 'dept-meeting') {
          setMeetingModalOpen(true);
          soundFX.playClick(soundEnabled);
          return;
        }
        curr = curr.parent;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    let foundAgent: Agent | null = null;
    agentMeshesRef.current.forEach((group, agentId) => {
      const intersects = raycaster.intersectObjects(group.children, true);
      if (intersects.length > 0) {
        const ag = agents.find((a) => a.id === agentId);
        if (ag) foundAgent = ag;
      }
    });

    setHoveredAgent(foundAgent);
    if (containerRef.current) {
      containerRef.current.style.cursor = foundAgent ? 'pointer' : 'grab';
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#02040a]">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full h-full"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      />

      {/* Floating 3D HUD & Cinematic Camera Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 rounded-2xl border border-sky-500/30 bg-[#060913]/90 p-2 shadow-2xl backdrop-blur-md">
        <span className="flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-black text-amber-300 border-r border-slate-800">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>VISTA 3D REALISTA</span>
        </span>

        {/* Camera Quick-Jumps */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => applyCameraPreset('overview')}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition ${
              cameraPreset === 'overview'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Vista General</span>
          </button>

          <button
            onClick={() => applyCameraPreset('ceo')}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition ${
              cameraPreset === 'ceo'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-sm'
                : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            <Crown className="h-3.5 w-3.5" />
            <span>Despacho Alexis (CEO)</span>
          </button>

          <button
            onClick={() => applyCameraPreset('meeting')}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition ${
              cameraPreset === 'meeting'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users2 className="h-3.5 w-3.5" />
            <span>Directorio</span>
          </button>

          <button
            onClick={() => applyCameraPreset('marketing')}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition ${
              cameraPreset === 'marketing'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Marketing TikTok</span>
          </button>

          <button
            onClick={() => applyCameraPreset('dev')}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition ${
              cameraPreset === 'dev'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Lab Sistemas</span>
          </button>
        </div>

        {/* View Mode Toggle: 3D Realista vs 2.5D Clásico */}
        <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
          <button
            onClick={() => {
              setViewMode('2.5d');
              soundFX.playClick(soundEnabled);
            }}
            className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-bold text-slate-300 hover:border-slate-500 hover:text-white transition"
            title="Cambiar a Modo 2.5D Isométrico Clásico"
          >
            <Layers className="h-3.5 w-3.5 text-sky-400" />
            <span>2.5D Clásico</span>
          </button>
        </div>
      </div>

      {/* Hovered Agent Floating Card */}
      {hoveredAgent && (
        <div className="pointer-events-none absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 rounded-2xl border border-sky-400/40 bg-[#060916]/95 px-5 py-3 shadow-[0_0_30px_rgba(56,189,248,0.3)] backdrop-blur-xl animate-fade-in">
          <div
            style={{ backgroundColor: hoveredAgent.color }}
            className="flex h-10 w-10 items-center justify-center rounded-xl font-mono text-sm font-black text-white shadow-md"
          >
            {hoveredAgent.name.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-white">{hoveredAgent.name}</span>
              <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300 border border-sky-400/30">
                {hoveredAgent.role}
              </span>
            </div>
            <p className="text-xs text-slate-300 italic max-w-sm truncate mt-0.5">
              &ldquo;{hoveredAgent.speechBubble || hoveredAgent.currentTask || 'Ejecutando operaciones en curso...'}&rdquo;
            </p>
          </div>
          <span className="text-[10px] font-mono text-sky-400 uppercase font-bold border-l border-slate-700 pl-3">
            Clic para Inspeccionar
          </span>
        </div>
      )}

      {/* Navigation Instruction Hints */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 font-mono text-[11px] text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800/80">
        <span>Rotar: <strong>Clic Izq + Arrastrar</strong></span>
        <span>&bull;</span>
        <span>Desplazar: <strong>Clic Der + Arrastrar</strong></span>
        <span>&bull;</span>
        <span>Zoom: <strong>Rueda</strong></span>
      </div>
    </div>
  );
};

// =========================================================================
// 3D ARCHITECTURE & DEPARTMENT BUILDER
// =========================================================================

function buildDepartments3D(scene: THREE.Scene, clickableObjects: THREE.Object3D[]) {
  // Shared Materials
  const glassWallMat = new THREE.MeshPhysicalMaterial({
    color: '#38bdf8',
    transparent: true,
    opacity: 0.18,
    roughness: 0.08,
    transmission: 0.82,
    thickness: 0.5,
    reflectivity: 0.9
  });

  const titaniumMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    roughness: 0.3,
    metalness: 0.8
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    roughness: 0.2,
    metalness: 0.9,
    emissive: '#d97706',
    emissiveIntensity: 0.25
  });

  // Build each department
  DEPARTMENT_LIST.forEach((dept) => {
    const deptCenter = worldTo3D(dept.center.x, dept.center.y);
    const deptGroup = new THREE.Group();
    deptGroup.name = `dept-${dept.id}`;
    deptGroup.position.copy(deptCenter);

    const w = dept.bounds.width * 0.12;
    const d = dept.bounds.height * 0.12;

    // 1. Department Floor Slab
    const slabGeo = new THREE.BoxGeometry(w, 0.4, d);
    const slabMat = new THREE.MeshStandardMaterial({
      color: dept.id === 'executive' ? '#0f172a' : '#080e1e',
      roughness: 0.2,
      metalness: 0.6
    });
    const slabMesh = new THREE.Mesh(slabGeo, slabMat);
    slabMesh.position.y = 0.2;
    slabMesh.receiveShadow = true;
    deptGroup.add(slabMesh);

    // Glowing Neon Perimeter Border
    const borderGeo = new THREE.BoxGeometry(w + 0.3, 0.45, d + 0.3);
    const borderEdges = new THREE.EdgesGeometry(borderGeo);
    const borderMat = new THREE.LineBasicMaterial({
      color: dept.color,
      linewidth: 2
    });
    const borderLines = new THREE.LineSegments(borderEdges, borderMat);
    borderLines.position.y = 0.22;
    deptGroup.add(borderLines);

    // 2. Specialized Thematic 3D Furniture
    if (dept.id === 'executive') {
      // ==========================================
      // PRESIDENTIAL CEO PENTHOUSE (ALEXIS)
      // ==========================================
      const execPodiumGeo = new THREE.CylinderGeometry(16, 17, 0.6, 32);
      const execPodiumMat = new THREE.MeshStandardMaterial({
        color: '#080a14',
        roughness: 0.1,
        metalness: 0.7
      });
      const execPodium = new THREE.Mesh(execPodiumGeo, execPodiumMat);
      execPodium.position.y = 0.5;
      execPodium.receiveShadow = true;
      deptGroup.add(execPodium);

      // Gold Perimeter Trim
      const goldRingGeo = new THREE.TorusGeometry(16.5, 0.2, 16, 64);
      const goldRing = new THREE.Mesh(goldRingGeo, goldAccentMat);
      goldRing.rotation.x = Math.PI / 2;
      goldRing.position.y = 0.8;
      deptGroup.add(goldRing);

      // Curved Executive Obsidian & Gold Desk
      const deskGeo = new THREE.BoxGeometry(18, 2.4, 6.5);
      const deskMat = new THREE.MeshStandardMaterial({
        color: '#0b0f19',
        roughness: 0.15,
        metalness: 0.85
      });
      const deskMesh = new THREE.Mesh(deskGeo, deskMat);
      deskMesh.position.set(0, 2, -2);
      deskMesh.castShadow = true;
      deskMesh.receiveShadow = true;
      deptGroup.add(deskMesh);

      // Gold Inlaid Desk Rim
      const deskGoldRimGeo = new THREE.BoxGeometry(18.2, 0.3, 6.7);
      const deskGoldRim = new THREE.Mesh(deskGoldRimGeo, goldAccentMat);
      deskGoldRim.position.set(0, 3.1, -2);
      deptGroup.add(deskGoldRim);

      // Dual Curved Ultra-Wide Hologram Screens
      const screenMat = new THREE.MeshBasicMaterial({
        map: createHoloScreenTexture('ALFERNEX HOLDING', 'Shopify: 8bhsfq-gz • Dropi: #132455', '#fbbf24'),
        side: THREE.DoubleSide
      });
      const screenGeo = new THREE.PlaneGeometry(9, 4.5);
      const screen1 = new THREE.Mesh(screenGeo, screenMat);
      screen1.position.set(-5, 5.5, -2);
      screen1.rotation.y = 0.25;
      deptGroup.add(screen1);

      const screen2Mat = new THREE.MeshBasicMaterial({
        map: createHoloScreenTexture('DIRECTIVAS PRESIDENCIA', 'Alexis • Gerente General & Dueño', '#fbbf24'),
        side: THREE.DoubleSide
      });
      const screen2 = new THREE.Mesh(screenGeo, screen2Mat);
      screen2.position.set(5, 5.5, -2);
      screen2.rotation.y = -0.25;
      deptGroup.add(screen2);

      // High-Back Executive Leather Chair (Throne)
      const chairGroup = new THREE.Group();
      chairGroup.position.set(0, 1.8, -7);

      const seatGeo = new THREE.BoxGeometry(4.5, 0.8, 4.5);
      const seatMat = new THREE.MeshStandardMaterial({ color: '#161927', roughness: 0.4 });
      const seat = new THREE.Mesh(seatGeo, seatMat);
      seat.position.y = 1.6;
      chairGroup.add(seat);

      const backGeo = new THREE.BoxGeometry(4.5, 6, 0.8);
      const back = new THREE.Mesh(backGeo, seatMat);
      back.position.set(0, 4.8, -1.8);
      chairGroup.add(back);

      deptGroup.add(chairGroup);

      // Floating 3D Golden Crown / Master Directive Seal
      const crownGroup = new THREE.Group();
      crownGroup.name = 'ceo-floating-crown';
      crownGroup.position.set(0, 10, -2);

      const crownBaseGeo = new THREE.CylinderGeometry(2.5, 3.2, 2, 8);
      const crownMesh = new THREE.Mesh(crownBaseGeo, goldAccentMat);
      crownGroup.add(crownMesh);

      // Golden Point Light emitting from Crown
      const crownLight = new THREE.PointLight('#f59e0b', 3, 35);
      crownLight.position.set(0, 0, 0);
      crownGroup.add(crownLight);

      deptGroup.add(crownGroup);

      // Add to clickable objects
      clickableObjects.push(deptGroup);
    } else if (dept.id === 'meeting') {
      // ==========================================
      // EXECUTIVE BOARDROOM (DIRECTORIO)
      // ==========================================
      const tableGeo = new THREE.CylinderGeometry(14, 14, 1.6, 32);
      const tableMat = new THREE.MeshStandardMaterial({
        color: '#0e1424',
        roughness: 0.1,
        metalness: 0.85
      });
      const table = new THREE.Mesh(tableGeo, tableMat);
      table.position.y = 1.8;
      table.castShadow = true;
      deptGroup.add(table);

      // Glowing Purple Ring in Center
      const ringGeo = new THREE.TorusGeometry(8, 0.3, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: '#8b5cf6' });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 2.7;
      deptGroup.add(ring);

      // 10 Boardroom Executive Chairs around table
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const cx = Math.cos(angle) * 19;
        const cz = Math.sin(angle) * 19;

        const chairGeo = new THREE.BoxGeometry(2.5, 3, 2.5);
        const chair = new THREE.Mesh(chairGeo, titaniumMat);
        chair.position.set(cx, 2, cz);
        chair.lookAt(deptCenter.x, 2, deptCenter.z);
        deptGroup.add(chair);
      }

      clickableObjects.push(deptGroup);
    } else if (dept.id === 'command-center') {
      // ==========================================
      // AI COMMAND CENTER (HOLOGRAM GYRO)
      // ==========================================
      const earthGeo = new THREE.SphereGeometry(6, 24, 24);
      const earthMat = new THREE.MeshBasicMaterial({
        color: '#00f0ff',
        wireframe: true,
        transparent: true,
        opacity: 0.65
      });
      const holoEarth = new THREE.Mesh(earthGeo, earthMat);
      holoEarth.name = 'command-holo-earth';
      holoEarth.position.y = 9;
      deptGroup.add(holoEarth);

      // Dual Orbiting Gyro Rings
      const gyroRing1Geo = new THREE.TorusGeometry(9, 0.15, 16, 64);
      const gyroMat = new THREE.MeshBasicMaterial({ color: '#38bdf8' });
      const gyroRing1 = new THREE.Mesh(gyroRing1Geo, gyroMat);
      gyroRing1.position.y = 9;
      gyroRing1.rotation.x = 0.8;
      deptGroup.add(gyroRing1);
    } else if (dept.id === 'server-room') {
      // ==========================================
      // QUANTUM SERVER RACKS
      // ==========================================
      for (let r = -2; r <= 2; r++) {
        const rackGeo = new THREE.BoxGeometry(3.5, 9, 7);
        const rackMat = new THREE.MeshStandardMaterial({
          color: '#080d1a',
          roughness: 0.2,
          metalness: 0.8
        });
        const rack = new THREE.Mesh(rackGeo, rackMat);
        rack.position.set(r * 5.5, 4.5, 0);
        rack.castShadow = true;
        deptGroup.add(rack);
      }
    } else if (dept.id === 'marketing') {
      // ==========================================
      // MARKETING & TIKTOK ADS SUITE
      // ==========================================
      const deskGeo = new THREE.BoxGeometry(14, 2, 6);
      const desk = new THREE.Mesh(deskGeo, titaniumMat);
      desk.position.set(0, 1.5, 0);
      desk.castShadow = true;
      deptGroup.add(desk);

      // TikTok Vertical Screen Hologram
      const phoneScreenGeo = new THREE.PlaneGeometry(3.5, 7);
      const phoneMat = new THREE.MeshBasicMaterial({
        map: createHoloScreenTexture('TIKTOK ADS', 'ROAS: 4.8x • Ad ID: 769002633', '#f43f5e'),
        side: THREE.DoubleSide
      });
      const phoneScreen = new THREE.Mesh(phoneScreenGeo, phoneMat);
      phoneScreen.position.set(0, 6, 0);
      deptGroup.add(phoneScreen);
    } else {
      // Standard Executive Department Workstation
      const deskGeo = new THREE.BoxGeometry(12, 1.8, 5.5);
      const desk = new THREE.Mesh(deskGeo, titaniumMat);
      desk.position.set(0, 1.5, 0);
      desk.castShadow = true;
      deptGroup.add(desk);
    }

    scene.add(deptGroup);
  });
}

// =========================================================================
// 3D AGENT CHARACTERS ANIMATION & RENDERING
// =========================================================================

function updateAgentMeshes(
  scene: THREE.Scene,
  agents: Agent[],
  time: number,
  meshesMap: Map<string, THREE.Group>,
  selectedAgentId: string | null
) {
  agents.forEach((agent) => {
    let group = meshesMap.get(agent.id);

    // Target 3D Position
    const targetPos = worldTo3D(agent.position.x, agent.position.y);

    if (!group) {
      // Build 3D Character Avatar
      group = new THREE.Group();
      group.name = `agent-${agent.id}`;

      // 1. Torso (Tailored Cyber Suit)
      const torsoGeo = new THREE.BoxGeometry(2.4, 3.2, 1.4);
      const torsoMat = new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.3,
        metalness: 0.6
      });
      const torso = new THREE.Mesh(torsoGeo, torsoMat);
      torso.position.y = 3.6;
      torso.castShadow = true;
      group.add(torso);

      // Department Color Chest Inlay
      const stripeGeo = new THREE.BoxGeometry(1.4, 0.6, 1.45);
      const stripeMat = new THREE.MeshBasicMaterial({ color: agent.color });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.y = 4.2;
      group.add(stripe);

      // 2. Head with Glowing Cyber Visor
      const headGeo = new THREE.SphereGeometry(1.1, 16, 16);
      const headMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.4 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 6.0;
      head.castShadow = true;
      group.add(head);

      const visorGeo = new THREE.BoxGeometry(1.4, 0.45, 0.7);
      const visorMat = new THREE.MeshBasicMaterial({ color: agent.color });
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.set(0, 6.0, 0.85);
      group.add(visor);

      // 3. Legs
      const legGeo = new THREE.BoxGeometry(0.7, 2.4, 0.7);
      const legMat = new THREE.MeshStandardMaterial({ color: '#090d16' });

      const leftLeg = new THREE.Mesh(legGeo, legMat);
      leftLeg.name = 'left-leg';
      leftLeg.position.set(-0.6, 1.2, 0);
      group.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeo, legMat);
      rightLeg.name = 'right-leg';
      rightLeg.position.set(0.6, 1.2, 0);
      group.add(rightLeg);

      // 4. Overhead Floating 3D Name Badge
      const nameSprite = createAgentNameSprite(agent.name, agent.role.split(' ')[0], agent.color);
      nameSprite.name = 'name-badge';
      nameSprite.position.set(0, 9.5, 0);
      group.add(nameSprite);

      // 5. Overhead Status Beacon
      const beaconGeo = new THREE.SphereGeometry(0.35, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({ color: '#10b981' });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.name = 'status-beacon';
      beacon.position.set(0, 7.8, 0);
      group.add(beacon);

      // 6. Floor Selection Ring
      const ringGeo = new THREE.RingGeometry(2.4, 2.8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: agent.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const selRing = new THREE.Mesh(ringGeo, ringMat);
      selRing.name = 'sel-ring';
      selRing.rotation.x = -Math.PI / 2;
      selRing.position.y = 0.05;
      group.add(selRing);

      group.position.copy(targetPos);
      scene.add(group);
      meshesMap.set(agent.id, group);
    }

    // Kinematic Animation
    const isWalking = agent.action === 'walking';
    const leftLeg = group.getObjectByName('left-leg');
    const rightLeg = group.getObjectByName('right-leg');

    if (isWalking) {
      // Step cycle
      const legSwing = Math.sin(agent.walkCycle * 2.5) * 0.45;
      if (leftLeg) leftLeg.rotation.x = legSwing;
      if (rightLeg) rightLeg.rotation.x = -legSwing;
      group.position.y = Math.sin(agent.walkCycle * 5) * 0.15;
    } else {
      // Idle breathing
      if (leftLeg) leftLeg.rotation.x = 0;
      if (rightLeg) rightLeg.rotation.x = 0;
      group.position.y = Math.sin(time * 2.5 + agent.name.charCodeAt(0)) * 0.08;
    }

    // Smooth movement interpolation
    group.position.x += (targetPos.x - group.position.x) * 0.15;
    group.position.z += (targetPos.z - group.position.z) * 0.15;

    // Selection ring visibility
    const selRing = group.getObjectByName('sel-ring');
    if (selRing) {
      selRing.visible = selectedAgentId === agent.id;
      if (selRing.visible) {
        selRing.rotation.z = time * 2;
      }
    }
  });
}

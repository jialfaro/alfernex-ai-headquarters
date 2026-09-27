'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useOfficeStore } from '../../../store/useOfficeStore';
import { ROBOT_PROFILES, CORPORATE_FLOORS, RobotProfile, CorporateFloor } from '../../../data/robotProfiles';
import { soundFX } from '../../audio/soundEffects';
import {
  Building2,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Users2,
  Crown,
  Laptop,
  MessageSquare,
  Crosshair,
  ClipboardList,
  Eye,
  Activity,
  Zap,
  Brain,
  TrendingUp,
  Layers,
  ChevronRight,
  Maximize2,
  Volume2,
  VolumeX,
  FastForward,
  Award,
  CheckCircle2,
  Clock,
  BatteryCharging,
  Compass,
  ArrowRight,
  ShieldCheck,
  Server,
  Flower2,
  Mic
} from 'lucide-react';

// =========================================================================
// PROCEDURAL ARCHITECTURAL TEXTURES (PBR 1024x1024)
// =========================================================================

function createSimMarbleTexture(dark: boolean = false): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = dark ? '#070b14' : '#f1f5f9';
  ctx.fillRect(0, 0, 1024, 1024);

  // Marble Veins
  const veins = dark ? 30 : 40;
  for (let i = 0; i < veins; i++) {
    ctx.beginPath();
    let x = Math.random() * 1024;
    let y = Math.random() * 1024;
    ctx.moveTo(x, y);

    const length = 300 + Math.random() * 500;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.7;

    ctx.strokeStyle = dark
      ? Math.random() > 0.5 ? 'rgba(56, 189, 248, 0.05)' : 'rgba(245, 158, 11, 0.04)'
      : Math.random() > 0.5 ? 'rgba(148, 163, 184, 0.12)' : 'rgba(217, 119, 6, 0.08)';
    ctx.lineWidth = 1 + Math.random() * 2.5;

    for (let step = 0; step < length; step += 30) {
      x += Math.cos(angle) * 30 + (Math.random() - 0.5) * 25;
      y += Math.sin(angle) * 30 + (Math.random() - 0.5) * 25;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Architectural tile grid
  const tileSize = 256;
  ctx.strokeStyle = dark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(100, 116, 139, 0.18)';
  ctx.lineWidth = 2;
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

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

function createSimWoodSlatsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#080a0f';
  ctx.fillRect(0, 0, 512, 512);

  const slatWidth = 16;
  const gap = 6;
  for (let x = 0; x < 512; x += slatWidth + gap) {
    ctx.fillStyle = '#23150e';
    ctx.fillRect(x, 0, slatWidth, 512);
    ctx.fillStyle = '#2f1c13';
    ctx.fillRect(x + 2, 0, slatWidth - 4, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// Procedural Software UI Texture for Monitors
function createSimScreenTexture(title: string, kpis: { label: string; val: string }[], accentColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#090d1a';
  ctx.fillRect(0, 0, 1024, 640);

  // Title bar
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, 1024, 48);

  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(24, 24, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(44, 24, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(64, 24, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 18px monospace';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(title, 90, 31);

  ctx.fillStyle = accentColor;
  ctx.font = 'bold 14px monospace';
  ctx.fillText('● LIVE AUTONOMOUS', 820, 31);

  // Cards
  kpis.forEach((kpi, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const bx = 30 + col * 490;
    const by = 70 + row * 130;

    ctx.fillStyle = '#131b2e';
    ctx.fillRect(bx, by, 470, 110);
    ctx.strokeStyle = `${accentColor}55`;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx, by, 470, 110);

    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(kpi.label, bx + 16, by + 35);

    ctx.font = 'bold 28px system-ui';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(kpi.val, bx + 16, by + 80);
  });

  // Chart Wave
  ctx.fillStyle = '#0c1222';
  ctx.fillRect(30, 350, 964, 260);

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(50, 560);
  const pts = [560, 520, 480, 500, 440, 390, 410, 370];
  pts.forEach((y, idx) => {
    ctx.lineTo(50 + idx * 125, y);
  });
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// =========================================================================
// AGENT SIMULATION DYNAMICS INTERFACES
// =========================================================================

interface SimAgentState {
  id: string;
  profile: RobotProfile;
  homeFloor: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  currentFloor: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  homePos: THREE.Vector3;
  currentPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  currentRotY: number;
  targetRotY: number;
  state: 'sitting' | 'walking' | 'coffee' | 'meeting' | 'talking' | 'celebrating';
  mesh: THREE.Group;
  seatedMesh: THREE.Group;
  standingMesh: THREE.Group;
  headMesh: THREE.Group | null;
  armLeft: THREE.Mesh | null;
  armRight: THREE.Mesh | null;
  walkCycleTime: number;
  actionTimer: number;
  speechText: string | null;
  speechTimer: number;
}

interface ProjectedBubble {
  id: string;
  name: string;
  text: string;
  ledHex: string;
  screenX: number;
  screenY: number;
  visible: boolean;
}

// Schedule Phases Definition
interface SchedulePhase {
  startHour: number;
  endHour: number;
  title: string;
  icon: string;
  activity: string;
}

const DAILY_SCHEDULE: SchedulePhase[] = [
  { startHour: 8, endHour: 9, title: 'Llegada & Planificación', icon: '🌅', activity: 'Revisión de directivas' },
  { startHour: 9, endHour: 10.5, title: 'Enfoque Profundo & Código', icon: '💻', activity: 'Ejecución en estaciones' },
  { startHour: 10.5, endHour: 12, title: 'Directorio Ejecutivo (P5)', icon: '🏛', activity: 'Reunión de estrategia' },
  { startHour: 12, endHour: 13.5, title: 'Almuerzo & Sky Lounge (Rooftop)', icon: '☕', activity: 'Café & recarga' },
  { startHour: 13.5, endHour: 15.5, title: 'Escalado TikTok & Dropi', icon: '🚀', activity: 'Campañas y optimización' },
  { startHour: 15.5, endHour: 17, title: 'Sinergia Inter-Agente', icon: '🤝', activity: 'Colaboración transversal' },
  { startHour: 17, endHour: 18.5, title: 'Cierre de Metas & Métricas', icon: '📊', activity: 'Evaluación de resultados' },
  { startHour: 18.5, endHour: 24, title: 'Guardia & Bóveda Cuántica', icon: '🛡', activity: 'Ciberdefensa y mantenimiento' },
  { startHour: 0, endHour: 8, title: 'Recarga Cuántica Nocturna', icon: '🌙', activity: 'Optimización de modelos' }
];

// =========================================================================
// COMPONENT: LifeSimOfficeHQ
// =========================================================================

export const LifeSimOfficeHQ: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Store bindings
  const agents = useOfficeStore((s) => s.agents);
  const selectedAgentId = useOfficeStore((s) => s.selectedAgentId);
  const selectAgent = useOfficeStore((s) => s.selectAgent);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);
  const activeFloor = useOfficeStore((s) => s.activeFloor);
  const setActiveFloor = useOfficeStore((s) => s.setActiveFloor);
  const simTime = useOfficeStore((s) => s.simTime);
  const setSimTimeSpeed = useOfficeStore((s) => s.setSimTimeSpeed);
  const simCameraMode = useOfficeStore((s) => s.simCameraMode);
  const setSimCameraMode = useOfficeStore((s) => s.setSimCameraMode);
  const simBuildingView = useOfficeStore((s) => s.simBuildingView);
  const setSimBuildingView = useOfficeStore((s) => s.setSimBuildingView);
  const simFollowingAgentId = useOfficeStore((s) => s.simFollowingAgentId);
  const startFollowingAgent = useOfficeStore((s) => s.startFollowingAgent);
  const stopFollowingAgent = useOfficeStore((s) => s.stopFollowingAgent);
  const triggerRobotCoffeeBreak = useOfficeStore((s) => s.triggerRobotCoffeeBreak);
  const triggerRobotCollaboration = useOfficeStore((s) => s.triggerRobotCollaboration);
  const setMeetingModalOpen = useOfficeStore((s) => s.setMeetingModalOpen);
  const setChatModalOpen = useOfficeStore((s) => s.setChatModalOpen);
  const setAssignTaskModalOpen = useOfficeStore((s) => s.setAssignTaskModalOpen);
  const enterCeoOffice = useOfficeStore((s) => s.enterCeoOffice);
  const enterAgentOffice = useOfficeStore((s) => s.enterAgentOffice);
  const startVoiceSession = useOfficeStore((s) => s.startVoiceSession);

  // Local HUD state
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [hoveredAgentName, setHoveredAgentName] = useState<string | null>(null);
  const [projectedBubbles, setProjectedBubbles] = useState<ProjectedBubble[]>([]);

  // Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const simAgentsRef = useRef<Map<string, SimAgentState>>(new Map());
  const interactiveObjectsRef = useRef<THREE.Object3D[]>([]);
  const elevatorCarRef = useRef<THREE.Group | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Selected Agent Object
  const selectedAgent = agents.find((a) => a.id === selectedAgentId);
  const selectedProfile = selectedAgentId ? ROBOT_PROFILES[selectedAgentId] : null;

  // Sound handler helper
  const playClick = useCallback(() => soundFX.playClick(soundEnabled), [soundEnabled]);
  const playSuccess = useCallback(() => soundFX.playSuccess(soundEnabled), [soundEnabled]);

  // Current Schedule Phase Calculation
  const currentSchedulePhase = useMemo(() => {
    const timeVal = simTime.hour + simTime.minute / 60;
    const phase = DAILY_SCHEDULE.find((p) => timeVal >= p.startHour && timeVal < p.endHour);
    return phase || DAILY_SCHEDULE[0];
  }, [simTime.hour, simTime.minute]);

  // =========================================================================
  // CAMERA POSITION PRESETS
  // =========================================================================
  const setCameraPreset = useCallback((preset: 'overview' | 'follow' | 'meeting' | 'ceo' | 'lounge' | 'servers' | 'floor') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const controls = controlsRef.current;
    const camera = cameraRef.current;

    playClick();

    if (preset === 'overview') {
      stopFollowingAgent();
      setSimCameraMode('overview');
      setSimBuildingView('cutaway');
      camera.position.set(48, 38, 62);
      controls.target.set(0, 18, 0);
    } else if (preset === 'floor') {
      stopFollowingAgent();
      setSimCameraMode('overview');
      setSimBuildingView('floor');
      const floorY = (activeFloor - 1) * 6;
      camera.position.set(22, floorY + 14, 25);
      controls.target.set(0, floorY + 2.5, 0);
    } else if (preset === 'meeting') {
      stopFollowingAgent();
      setSimCameraMode('meeting');
      setActiveFloor(5);
      setSimBuildingView('floor');
      camera.position.set(0, 29, 20);
      controls.target.set(0, 26, 6);
    } else if (preset === 'ceo') {
      stopFollowingAgent();
      setSimCameraMode('command');
      setActiveFloor(5);
      setSimBuildingView('floor');
      camera.position.set(0, 28, -6);
      controls.target.set(0, 26.5, -14);
    } else if (preset === 'lounge') {
      stopFollowingAgent();
      setActiveFloor(7);
      setSimBuildingView('floor');
      camera.position.set(16, 42, 20);
      controls.target.set(0, 38, 0);
    } else if (preset === 'servers') {
      stopFollowingAgent();
      setActiveFloor(6);
      setSimBuildingView('floor');
      camera.position.set(18, 36, 18);
      controls.target.set(0, 32, 0);
    } else if (preset === 'follow' && selectedAgentId) {
      startFollowingAgent(selectedAgentId);
    }
  }, [activeFloor, playClick, selectedAgentId, setActiveFloor, setSimBuildingView, setSimCameraMode, startFollowingAgent, stopFollowingAgent]);

  // =========================================================================
  // SIMULATION EVENTS (BOARDROOM MEETING & COLLABORATION)
  // =========================================================================

  // 1. Trigger Company Boardroom Meeting Event
  const triggerBoardroomMeetingEvent = useCallback(() => {
    playSuccess();
    setSimBuildingView('floor');
    setActiveFloor(5);
    setCameraPreset('meeting');

    // Move key department leaders (Vyra, Max, Nex, Alex) to Floor 5 Boardroom
    const leaders = ['vyra-growth', 'max-developer', 'nex-data', 'alex-architect'];
    const meetingSeats = [
      new THREE.Vector3(-4, 24, 6),
      new THREE.Vector3(4, 24, 6),
      new THREE.Vector3(-2.5, 24, 9),
      new THREE.Vector3(2.5, 24, 9)
    ];

    leaders.forEach((id, idx) => {
      const ag = simAgentsRef.current.get(id);
      if (ag) {
        ag.state = 'walking';
        ag.seatedMesh.visible = false;
        ag.standingMesh.visible = true;
        ag.currentFloor = 5;
        ag.targetPos.copy(meetingSeats[idx]);
        ag.speechText = idx === 0 ? 'Iniciando reporte de ROAS TikTok...' : idx === 1 ? 'API y Docker listos.' : 'Métricas validadas.';
        ag.speechTimer = 12;
      }
    });
  }, [playSuccess, setActiveFloor, setCameraPreset, setSimBuildingView]);

  // 2. Trigger Inter-Agent Collaboration (Vyra visits Max)
  const triggerVyraMaxCollaboration = useCallback(() => {
    playSuccess();
    triggerRobotCollaboration('vyra-growth', 'max-developer', 'MAX, necesito landing para escalar hoy!');
    setActiveFloor(3);
    setSimBuildingView('floor');

    const vyra = simAgentsRef.current.get('vyra-growth');
    const max = simAgentsRef.current.get('max-developer');
    if (vyra && max) {
      vyra.state = 'walking';
      vyra.seatedMesh.visible = false;
      vyra.standingMesh.visible = true;
      vyra.currentFloor = 3;
      // Walk to Max's desk on Floor 3
      vyra.targetPos.set(max.homePos.x + 2.5, max.homePos.y, max.homePos.z);
      vyra.speechText = 'MAX, requiero la landing page optimizada!';
      vyra.speechTimer = 14;

      max.speechText = '¡Entendido VYRA, la compilo en 2 min!';
      max.speechTimer = 14;
    }
  }, [playSuccess, setActiveFloor, setSimBuildingView, triggerRobotCollaboration]);

  // 3. Trigger Rooftop Coffee Break
  const triggerGroupCoffeeBreak = useCallback(() => {
    playSuccess();
    setActiveFloor(7);
    setSimBuildingView('floor');
    setCameraPreset('lounge');

    // Send agents to Rooftop Sky Lounge
    const group = ['vyra-growth', 'echo-sales', 'nova-research', 'sol-support'];
    group.forEach((id, idx) => {
      const ag = simAgentsRef.current.get(id);
      if (ag) {
        ag.state = 'walking';
        ag.seatedMesh.visible = false;
        ag.standingMesh.visible = true;
        ag.currentFloor = 7;
        ag.targetPos.set(2 + idx * 2.2, 36, 4 + (Math.random() - 0.5) * 3);
        ag.speechText = 'Recargando celdas con espresso doble...';
        ag.speechTimer = 12;
        triggerRobotCoffeeBreak(id);
      }
    });
  }, [playSuccess, setActiveFloor, setCameraPreset, setSimBuildingView, triggerRobotCoffeeBreak]);

  // =========================================================================
  // THREE.JS SCENE INITIALIZATION & 7-LEVEL ARCHITECTURE BUILD
  // =========================================================================
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene & Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712');
    scene.fog = new THREE.FogExp2('#030712', 0.0065);
    sceneRef.current = scene;

    // 2. Camera (Isometric Life-Sim perspective)
    const camera = new THREE.PerspectiveCamera(
      42,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.5,
      1000
    );
    camera.position.set(48, 38, 62);
    cameraRef.current = camera;

    // 3. Renderer with ACESFilmicToneMapping & Soft Shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    containerRef.current.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls with Life-Sim damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent going underground
    controls.minDistance = 6;
    controls.maxDistance = 150;
    controls.target.set(0, 18, 0);
    controlsRef.current = controls;

    // 5. Environmental Lighting (Dynamic based on Sim Time)
    const ambientLight = new THREE.AmbientLight('#e0f2fe', 0.85);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight = new THREE.DirectionalLight('#fffbeb', 2.8);
    dirLight.position.set(45, 75, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 180;
    dirLight.shadow.camera.left = -45;
    dirLight.shadow.camera.right = 45;
    dirLight.shadow.camera.top = 45;
    dirLight.shadow.camera.bottom = -45;
    dirLight.shadow.bias = -0.0004;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Central Core Chandelier Light (Atrium)
    const coreLight = new THREE.PointLight('#38bdf8', 1.8, 70);
    coreLight.position.set(0, 21, 0);
    scene.add(coreLight);

    // =========================================================================
    // MATERIALS REPOSITORY
    // =========================================================================
    const marbleDarkMat = new THREE.MeshStandardMaterial({
      map: createSimMarbleTexture(true),
      roughness: 0.18,
      metalness: 0.25
    });

    const marbleLightMat = new THREE.MeshStandardMaterial({
      map: createSimMarbleTexture(false),
      roughness: 0.22,
      metalness: 0.15
    });

    const woodSlatsMat = new THREE.MeshStandardMaterial({
      map: createSimWoodSlatsTexture(),
      roughness: 0.45,
      metalness: 0.1
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      transmission: 0.88,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.5,
      thickness: 0.6
    });

    const brushedTitaniumMat = new THREE.MeshStandardMaterial({
      color: '#94a3b8',
      roughness: 0.3,
      metalness: 0.85
    });

    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: '#f59e0b',
      roughness: 0.25,
      metalness: 0.95
    });

    const ceramicWhiteMat = new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.15,
      metalness: 0.1
    });

    const carbonJointMat = new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.5,
      metalness: 0.5
    });

    // =========================================================================
    // 6. MULTI-FLOOR ARCHITECTURAL TOWER (7 LEVELS • 6M HEIGHT EACH)
    // =========================================================================
    const floorHeight = 6.0;
    const buildingWidth = 36;
    const buildingDepth = 30;
    const totalFloors = 7;

    // Base Ground / Plaza Foundation
    const groundGeo = new THREE.BoxGeometry(95, 1.2, 95);
    const ground = new THREE.Mesh(groundGeo, new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.6 }));
    ground.position.y = -0.6;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid Floor Line Accents on Ground
    const grid = new THREE.GridHelper(95, 45, '#38bdf8', '#1e293b');
    grid.position.y = 0.02;
    scene.add(grid);

    // Build 7 Corporate Floors
    for (let f = 1; f <= totalFloors; f++) {
      const floorY = (f - 1) * floorHeight;
      const floorGroup = new THREE.Group();
      floorGroup.name = `floor-${f}`;

      // Floor Slab (Suelo de cada piso)
      const slabMat = f === 5 ? marbleDarkMat : f === 7 ? woodSlatsMat : marbleLightMat;
      const slabGeo = new THREE.BoxGeometry(buildingWidth, 0.4, buildingDepth);
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.position.set(0, floorY + 0.2, 0);
      slab.receiveShadow = true;
      floorGroup.add(slab);

      // Floor Ceiling / Structural Beams (Floors 1 to 6)
      if (f < totalFloors) {
        const ceilGeo = new THREE.BoxGeometry(buildingWidth - 1, 0.3, buildingDepth - 1);
        const ceil = new THREE.Mesh(ceilGeo, woodSlatsMat);
        ceil.position.set(0, floorY + floorHeight - 0.15, 0);
        floorGroup.add(ceil);
      }

      // Back & Side Architectural Glass Curtain Walls
      const backWallGeo = new THREE.BoxGeometry(buildingWidth, floorHeight - 0.5, 0.4);
      const backWall = new THREE.Mesh(backWallGeo, glassMat);
      backWall.position.set(0, floorY + floorHeight / 2, -buildingDepth / 2);
      floorGroup.add(backWall);

      const leftWallGeo = new THREE.BoxGeometry(0.4, floorHeight - 0.5, buildingDepth);
      const leftWall = new THREE.Mesh(leftWallGeo, glassMat);
      leftWall.position.set(-buildingWidth / 2, floorY + floorHeight / 2, 0);
      floorGroup.add(leftWall);

      const rightWall = leftWall.clone();
      rightWall.position.set(buildingWidth / 2, floorY + floorHeight / 2, 0);
      floorGroup.add(rightWall);

      // Front Cutaway Edge / Glass Balustrade (Low barrier for dollhouse cross-section view)
      const balustradeGeo = new THREE.BoxGeometry(buildingWidth, 1.2, 0.15);
      const balustrade = new THREE.Mesh(balustradeGeo, glassMat);
      balustrade.position.set(0, floorY + 0.8, buildingDepth / 2);
      floorGroup.add(balustrade);

      // Floor Level Marker Holographic Ring
      const markerTorus = new THREE.Mesh(
        new THREE.TorusGeometry(1.2, 0.05, 12, 32),
        new THREE.MeshBasicMaterial({ color: f === 5 ? '#f59e0b' : f === 7 ? '#10b981' : '#38bdf8' })
      );
      markerTorus.rotation.x = Math.PI / 2;
      markerTorus.position.set(-buildingWidth / 2 + 2, floorY + 1.2, buildingDepth / 2 - 2);
      floorGroup.add(markerTorus);

      scene.add(floorGroup);
    }

    // =========================================================================
    // 7. CENTRAL GLASS ELEVATOR SHAFT & ANIMATED CAB (CONNECTING ALL 7 FLOORS)
    // =========================================================================
    const shaftGeo = new THREE.BoxGeometry(4.2, floorHeight * totalFloors, 4.2);
    const shaft = new THREE.Mesh(shaftGeo, glassMat);
    shaft.position.set(0, (floorHeight * totalFloors) / 2, -buildingDepth / 2 + 3.5);
    scene.add(shaft);

    // Elevator Car (Cabina panorámica transparente con aro LED)
    const carGroup = new THREE.Group();
    const carBodyGeo = new THREE.BoxGeometry(3.6, 4.8, 3.6);
    const carBody = new THREE.Mesh(carBodyGeo, glassMat);
    carGroup.add(carBody);

    const carFloor = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.3, 3.8), brushedTitaniumMat);
    carFloor.position.y = -2.4;
    carGroup.add(carFloor);

    const carCeil = carFloor.clone();
    carCeil.position.y = 2.4;
    carGroup.add(carCeil);

    const carLed = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.06, 12, 32),
      new THREE.MeshBasicMaterial({ color: '#38bdf8' })
    );
    carLed.rotation.x = Math.PI / 2;
    carLed.position.y = 2.2;
    carGroup.add(carLed);

    carGroup.position.set(0, 3, -buildingDepth / 2 + 3.5);
    scene.add(carGroup);
    elevatorCarRef.current = carGroup;

    // =========================================================================
    // 8. FLOOR SPECIFIC LUXURY ENVIRONMENTS & INTERACTIVE HOTSPOTS
    // =========================================================================

    // Level 1: Reception & AI Holographic Earth Sphere
    const globe = new THREE.Mesh(new THREE.SphereGeometry(1.6, 32, 32), new THREE.MeshBasicMaterial({ color: '#0ea5e9', wireframe: true }));
    globe.position.set(0, 2.8, 0);
    globe.name = 'hotspot-globe';
    scene.add(globe);
    interactiveObjectsRef.current.push(globe);

    // Level 5: Boardroom Table & Alexis CEO Penthouse
    const f5Y = 4 * floorHeight;
    const tableMesh = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 0.25, 32), marbleDarkMat);
    tableMesh.position.set(0, f5Y + 1.8, 6);
    tableMesh.scale.set(1.4, 1, 0.85);
    tableMesh.name = 'hotspot-boardroom';
    scene.add(tableMesh);
    interactiveObjectsRef.current.push(tableMesh);

    // Boardroom Chairs around table
    for (let c = 0; c < 10; c++) {
      const angle = (c / 10) * Math.PI * 2;
      const chairMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.8), carbonJointMat);
      chairMesh.position.set(Math.cos(angle) * 5.4, f5Y + 1.2, 6 + Math.sin(angle) * 3.4);
      chairMesh.lookAt(0, f5Y + 1.2, 6);
      scene.add(chairMesh);
    }

    // Boardroom Large Presentation Screen
    const boardScreenTex = createSimScreenTexture('ALFERNEX • EXECUTIVE STRATEGY & DIRECTIVES', [
      { label: 'OBJETIVO MENSUAL', val: 'S/. 150,000' },
      { label: 'RETENCIÓN TIKTOK', val: '44% Hook' },
      { label: 'INTEGRIDAD LOGÍSTICA', val: '99.4%' },
      { label: 'STATUS', val: 'AUTONOMOUS' }
    ], '#a855f7');
    const boardScreen = new THREE.Mesh(new THREE.BoxGeometry(7.2, 3.6, 0.1), new THREE.MeshBasicMaterial({ map: boardScreenTex }));
    boardScreen.position.set(0, f5Y + 4.0, 14.5);
    scene.add(boardScreen);

    // CEO Alexis Penthouse Desk (Floor 5 Back Section)
    const ceoDesk = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.35, 3.2), marbleDarkMat);
    ceoDesk.position.set(0, f5Y + 1.8, -8);
    ceoDesk.name = 'hotspot-ceo';
    scene.add(ceoDesk);
    interactiveObjectsRef.current.push(ceoDesk);

    // Suspended Gold Crown (CEO Alexis Badge)
    const crownMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.7, 0.6, 7), goldAccentMat);
    crownMesh.position.set(0, f5Y + 4.2, -8);
    crownMesh.rotation.z = Math.PI;
    crownMesh.name = 'hotspot-ceo-crown';
    scene.add(crownMesh);
    interactiveObjectsRef.current.push(crownMesh);

    // Level 6: Quantum Server Vault & Racks (Cipher)
    const f6Y = 5 * floorHeight;
    for (let r = -2; r <= 2; r++) {
      const rackGeo = new THREE.BoxGeometry(1.8, 4.5, 1.2);
      const rackMat = new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.3, metalness: 0.8 });
      const rack = new THREE.Mesh(rackGeo, rackMat);
      rack.position.set(r * 2.8, f6Y + 2.4, -6);
      scene.add(rack);

      // Blinking Rack LEDs
      const rackLed = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.1), new THREE.MeshBasicMaterial({ color: '#ef4444' }));
      rackLed.position.set(r * 2.8, f6Y + 3.8, -5.35);
      scene.add(rackLed);
    }

    // Level 7: ROOFTOP Sky Lounge & Italian Espresso Bar
    const f7Y = 6 * floorHeight;
    const barCounter = new THREE.Mesh(new THREE.BoxGeometry(9.0, 2.0, 1.8), marbleDarkMat);
    barCounter.position.set(4, f7Y + 1.1, 4);
    scene.add(barCounter);

    const coffeeMachine = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 1.2), brushedTitaniumMat);
    coffeeMachine.position.set(4, f7Y + 2.8, 4);
    coffeeMachine.name = 'hotspot-coffee';
    scene.add(coffeeMachine);
    interactiveObjectsRef.current.push(coffeeMachine);

    // Planters & Zen Garden on Rooftop
    [-12, 12].forEach((px) => {
      const planter = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.8, 8.0), woodSlatsMat);
      planter.position.set(px, f7Y + 0.6, 0);
      scene.add(planter);

      const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2), new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.8 }));
      bush.position.set(px, f7Y + 1.8, 0);
      scene.add(bush);
    });

    // =========================================================================
    // 9. ROBOT AGENTS CREATION & DYNAMIC RIGGING
    // =========================================================================

    // Seated Robot Builder
    function buildSimSeatedRobot(profile: RobotProfile): { group: THREE.Group; head: THREE.Group } {
      const g = new THREE.Group();
      const ledMat = new THREE.MeshBasicMaterial({ color: profile.ledHex });

      const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 0.3, 12), carbonJointMat);
      pelvis.position.y = 1.35;
      g.add(pelvis);

      const isSlim = profile.silhouette === 'feminine-slim';
      const chest = new THREE.Mesh(new THREE.BoxGeometry(isSlim ? 1.05 : 1.25, 1.2, 0.7), ceramicWhiteMat);
      chest.position.set(0, 2.6, 0);
      g.add(chest);

      const chestLed = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.72), ledMat);
      chestLed.position.set(0, 2.7, 0);
      g.add(chestLed);

      const head = new THREE.Group();
      head.position.set(0, 3.65, 0);

      const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 16), ceramicWhiteMat);
      head.add(helmet);

      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.35), new THREE.MeshBasicMaterial({ color: '#090d16' }));
      visor.position.set(0, 0.05, 0.32);
      head.add(visor);

      const eyeLed = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.38), ledMat);
      eyeLed.position.set(0, 0.05, 0.34);
      head.add(eyeLed);

      g.add(head);

      // Typing Arms extended towards keyboard
      [-0.55, 0.55].forEach((sx) => {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.9, 8), ceramicWhiteMat);
        arm.rotation.x = -1.2;
        arm.position.set(sx, 2.2, 0.45);
        g.add(arm);

        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), carbonJointMat);
        hand.position.set(sx, 1.9, 0.85);
        g.add(hand);
      });

      return { group: g, head };
    }

    // Standing / Walking Robot Builder
    function buildSimStandingRobot(profile: RobotProfile): { group: THREE.Group; leftArm: THREE.Mesh; rightArm: THREE.Mesh; head: THREE.Group } {
      const g = new THREE.Group();
      const ledMat = new THREE.MeshBasicMaterial({ color: profile.ledHex });

      const chest = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.35, 0.75), ceramicWhiteMat);
      chest.position.set(0, 2.8, 0);
      g.add(chest);

      const chestLed = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.78), ledMat);
      chestLed.position.set(0, 2.9, 0);
      g.add(chestLed);

      const head = new THREE.Group();
      head.position.set(0, 3.9, 0);

      const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 16), ceramicWhiteMat);
      head.add(helmet);

      const eyeLed = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.38), ledMat);
      eyeLed.position.set(0, 0.05, 0.34);
      head.add(eyeLed);

      g.add(head);

      const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 1.1, 8), ceramicWhiteMat);
      leftArm.position.set(-0.7, 2.5, 0);
      g.add(leftArm);

      const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 1.1, 8), ceramicWhiteMat);
      rightArm.position.set(0.7, 2.5, 0);
      g.add(rightArm);

      [-0.32, 0.32].forEach((lx) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 1.6, 8), ceramicWhiteMat);
        leg.position.set(lx, 1.1, 0);
        g.add(leg);

        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.15, 0.45), carbonJointMat);
        foot.position.set(lx, 0.1, 0.1);
        g.add(foot);
      });

      return { group: g, leftArm, rightArm, head };
    }

    // Workstation configurations across the corporate tower
    const workstationsConfig = [
      { id: 'vyra-growth', floor: 2, x: -7, z: -2, rotY: 0, title: 'TIKTOK ADS MANAGER • PERU', kpis: [{ label: 'ROAS ESTIMADO', val: '4.82x' }, { label: 'CTR PROMEDIO', val: '4.91%' }, { label: 'PEDIDOS DROPI', val: '30 SKUs' }, { label: 'CPA LIMA', val: 'S/. 11.40' }] },
      { id: 'echo-sales', floor: 2, x: -7, z: 7, rotY: 0, title: 'DROPI PERÚ SALES & LOGISTICS', kpis: [{ label: 'ORDENES HOY', val: '142' }, { label: 'EFECTIVIDAD COD', val: '92.4%' }, { label: 'STOCK LIMA', val: '850 uds' }, { label: 'TICKET MEDIO', val: 'S/. 149' }] },
      { id: 'sol-support', floor: 2, x: 7, z: -2, rotY: Math.PI, title: 'WHATSAPP AI CRM DISPATCH', kpis: [{ label: 'CHATS ACTIVOS', val: '28' }, { label: 'TIEMPO RESPUESTA', val: '1.2s' }, { label: 'CSAT SATISFACCIÓN', val: '98%' }, { label: 'LIMA METRO', val: '74%' }] },
      { id: 'atlas-ops', floor: 2, x: 7, z: 7, rotY: Math.PI, title: 'SUPPLY CHAIN & FULFILLMENT', kpis: [{ label: 'DESPACHOS LIMA', val: '68' }, { label: 'OLVA COURIER', val: '99.1%' }, { label: 'RETRASOS', val: '0%' }, { label: 'ALMACÉN', val: 'Activo' }] },
      { id: 'max-developer', floor: 3, x: -7, z: -2, rotY: 0, title: 'VS CODE • CORE SYSTEMS', kpis: [{ label: 'API LATENCY', val: '28ms' }, { label: 'BUILD STATUS', val: 'PASSING' }, { label: 'CPU USAGE', val: '14%' }, { label: 'UPTIME', val: '99.99%' }] },
      { id: 'alex-architect', floor: 3, x: 7, z: -2, rotY: Math.PI, title: 'C4 ARCHITECTURE TOPOLOGY', kpis: [{ label: 'MICROSERVICIOS', val: '8 Pods' }, { label: 'REDIS CACHE', val: '98% Hit' }, { label: 'SECURITY POSTURE', val: 'ZERO TRUST' }, { label: 'DOCKER', val: 'Sync' }] },
      { id: 'nova-research', floor: 4, x: -7, z: -2, rotY: 0, title: 'LLM REASONING RESEARCH', kpis: [{ label: 'ARXIV PAPERS', val: '24' }, { label: 'VECTOR EMBED', val: '1536d' }, { label: 'INFERENCE', val: '98 tok/s' }, { label: 'ACCURACY', val: '96.8%' }] },
      { id: 'nex-data', floor: 4, x: 7, z: -2, rotY: Math.PI, title: 'P&L PERU FINANCIAL ANALYTICS', kpis: [{ label: 'VENTAS SOLES', val: 'S/. 12,450' }, { label: 'MARGEN BRUTO', val: '54.2%' }, { label: 'CASH FLOW', val: '+S/. 4,800' }, { label: 'METRIC', val: 'AUDITED' }] },
      { id: 'maya-creative', floor: 4, x: 7, z: 7, rotY: Math.PI, title: '3D BLENDER & VIRAL ENGINE', kpis: [{ label: 'CREATIVOS HOY', val: '8 Videos' }, { label: 'RETENCIÓN 3s', val: '44%' }, { label: 'RENDER TIME', val: '12s' }, { label: 'TIKTOK', val: 'READY' }] },
      { id: 'cipher-security', floor: 6, x: 0, z: 2, rotY: 0, title: 'ZERO TRUST FIREWALL VAULT', kpis: [{ label: 'THREAT DETECTED', val: '0' }, { label: 'FIREWALL RATE', val: '10 Gbps' }, { label: 'DEFCON', val: 'OPTIMAL' }, { label: 'ENCRYPTION', val: 'Kyber' }] }
    ];

    workstationsConfig.forEach((cfg) => {
      const profile = ROBOT_PROFILES[cfg.id];
      if (!profile) return;

      const floorY = (cfg.floor - 1) * floorHeight;
      const deskGroup = new THREE.Group();
      deskGroup.position.set(cfg.x, floorY, cfg.z);
      deskGroup.rotation.y = cfg.rotY;

      // Desk
      const deskTop = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.22, 2.2), marbleDarkMat);
      deskTop.position.set(0, 1.8, 0);
      deskGroup.add(deskTop);

      [-2.2, 2.2].forEach((lx) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.7, 2.0), brushedTitaniumMat);
        leg.position.set(lx, 0.85, 0);
        deskGroup.add(leg);
      });

      // Monitors with Real Software Screen UI
      const screenTex = createSimScreenTexture(cfg.title, cfg.kpis, profile.ledHex);
      const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });

      const centerMon = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 0.05), screenMat);
      centerMon.position.set(0, 3.0, -0.6);
      deskGroup.add(centerMon);

      const sideMon = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 0.05), screenMat);
      sideMon.position.set(1.9, 3.0, -0.4);
      sideMon.rotation.y = -0.3;
      deskGroup.add(sideMon);

      // Open Laptop
      const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.04, 0.7), brushedTitaniumMat);
      laptopBase.position.set(0, 1.93, 0.1);
      deskGroup.add(laptopBase);

      const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 0.02), screenMat);
      laptopScreen.position.set(0, 2.25, -0.22);
      laptopScreen.rotation.x = -0.25;
      deskGroup.add(laptopScreen);

      // Ergonomic Chair
      const chair = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 1.4), carbonJointMat);
      chair.position.set(0, 1.0, 1.2);
      deskGroup.add(chair);

      scene.add(deskGroup);

      // Agent Entity Group
      const agentGroup = new THREE.Group();
      agentGroup.position.set(cfg.x, floorY, cfg.z + 1.2);
      agentGroup.rotation.y = cfg.rotY + Math.PI;
      agentGroup.name = `agent-${profile.id}`;

      const { group: seatedMesh, head: seatedHead } = buildSimSeatedRobot(profile);
      seatedMesh.visible = true;
      agentGroup.add(seatedMesh);

      const { group: standingMesh, leftArm, rightArm, head: standingHead } = buildSimStandingRobot(profile);
      standingMesh.visible = false;
      agentGroup.add(standingMesh);

      // Clickable collider
      const hitBox = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.2, 4.5, 8),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitBox.position.y = 2.2;
      hitBox.name = `hitbox-${profile.id}`;
      agentGroup.add(hitBox);
      interactiveObjectsRef.current.push(hitBox);

      scene.add(agentGroup);

      const homePos = new THREE.Vector3(cfg.x, floorY, cfg.z + 1.2);
      simAgentsRef.current.set(profile.id, {
        id: profile.id,
        profile,
        homeFloor: cfg.floor as 1 | 2 | 3 | 4 | 5 | 6 | 7,
        currentFloor: cfg.floor as 1 | 2 | 3 | 4 | 5 | 6 | 7,
        homePos: homePos.clone(),
        currentPos: homePos.clone(),
        targetPos: homePos.clone(),
        currentRotY: cfg.rotY + Math.PI,
        targetRotY: cfg.rotY + Math.PI,
        state: 'sitting',
        mesh: agentGroup,
        seatedMesh,
        standingMesh,
        headMesh: seatedHead,
        armLeft: leftArm,
        armRight: rightArm,
        walkCycleTime: Math.random() * 10,
        actionTimer: 8 + Math.random() * 20,
        speechText: null,
        speechTimer: 0
      });
    });

    // =========================================================================
    // 10. RAYCASTING & INTERACTION SYSTEM (HOTSPOTS & ROBOTS)
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjectsRef.current, false);

      if (intersects.length > 0) {
        const hitName = intersects[0].object.name;
        if (hitName.startsWith('hitbox-')) {
          const agentId = hitName.replace('hitbox-', '');
          const p = ROBOT_PROFILES[agentId];
          setHoveredAgentName(p ? `${p.name} • ${p.role}` : null);
          setHoveredHotspot(null);
          containerRef.current.style.cursor = 'pointer';
        } else if (hitName === 'hotspot-coffee') {
          setHoveredHotspot('☕ Máquina de Espresso • Rooftop Sky Lounge');
          setHoveredAgentName(null);
          containerRef.current.style.cursor = 'pointer';
        } else if (hitName === 'hotspot-boardroom') {
          setHoveredHotspot('🏛 Mesa de Directorio • Convocar Sesión Estratégica');
          setHoveredAgentName(null);
          containerRef.current.style.cursor = 'pointer';
        } else if (hitName.includes('ceo')) {
          setHoveredHotspot('👑 Despacho Presidencial • Alexis (Gerente General & Dueño)');
          setHoveredAgentName(null);
          containerRef.current.style.cursor = 'pointer';
        } else if (hitName === 'hotspot-globe') {
          setHoveredHotspot('🌐 Orbe Central de Operaciones Globales ALFERNEX');
          setHoveredAgentName(null);
          containerRef.current.style.cursor = 'pointer';
        }
      } else {
        setHoveredHotspot(null);
        setHoveredAgentName(null);
        containerRef.current.style.cursor = 'default';
      }
    };

    const onClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjectsRef.current, false);

      if (intersects.length > 0) {
        const hitName = intersects[0].object.name;
        if (hitName.startsWith('hitbox-')) {
          const agentId = hitName.replace('hitbox-', '');
          selectAgent(agentId);
          soundFX.playClick(soundEnabled);
        } else if (hitName === 'hotspot-coffee') {
          if (selectedAgentId) {
            triggerRobotCoffeeBreak(selectedAgentId);
            soundFX.playSuccess(soundEnabled);
          } else {
            setActiveFloor(7);
            setSimBuildingView('floor');
          }
        } else if (hitName === 'hotspot-boardroom') {
          setMeetingModalOpen(true);
          soundFX.playSuccess(soundEnabled);
        } else if (hitName.includes('ceo')) {
          enterCeoOffice();
          soundFX.playClick(soundEnabled);
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointermove', onPointerMove);
    domEl.addEventListener('click', onClick);

    // =========================================================================
    // 11. ANIMATION & LIFE SIMULATION GAME LOOP
    // =========================================================================
    let animId: number;
    let lastTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const deltaSec = (now - lastTime) / 1000;
      lastTime = now;

      // Rotate central holographic globe
      if (globe) {
        globe.rotation.y += deltaSec * 0.4;
      }

      // Elevator car movement
      if (elevatorCarRef.current) {
        const elevY = 8 + Math.sin(now * 0.0006) * 16;
        elevatorCarRef.current.position.y = elevY;
      }

      // Read current store simulation speed
      const storeSpeed = useOfficeStore.getState().simTime.speed;
      const currentSimCamera = useOfficeStore.getState().simCameraMode;
      const followingId = useOfficeStore.getState().simFollowingAgentId;

      const activeBubbles: ProjectedBubble[] = [];

      // Update all robot autonomous agents
      simAgentsRef.current.forEach((agent) => {
        // Speech timer reduction
        if (agent.speechTimer > 0) {
          agent.speechTimer -= deltaSec * (storeSpeed > 0 ? storeSpeed : 1);
          if (agent.speechTimer <= 0) {
            agent.speechText = null;
          }
        }

        // Project speech bubbles to 2D screen coordinates
        if (agent.speechText && cameraRef.current && containerRef.current) {
          const worldPos = new THREE.Vector3();
          agent.mesh.getWorldPosition(worldPos);
          worldPos.y += 4.5;

          const projected = worldPos.clone().project(cameraRef.current);
          const isBehind = projected.z > 1;

          if (!isBehind) {
            const widthHalf = containerRef.current.clientWidth / 2;
            const heightHalf = containerRef.current.clientHeight / 2;
            activeBubbles.push({
              id: agent.id,
              name: agent.profile.name,
              text: agent.speechText,
              ledHex: agent.profile.ledHex,
              screenX: projected.x * widthHalf + widthHalf,
              screenY: -(projected.y * heightHalf) + heightHalf,
              visible: true
            });
          }
        }

        // Physical Robot Reaction to Real-Time Voice Conversation
        const voiceSession = useOfficeStore.getState().voiceSession;
        const isVoiceActiveForAgent = voiceSession.isActive && voiceSession.activeAgentId === agent.id;

        if (isVoiceActiveForAgent && cameraRef.current) {
          const cam = cameraRef.current;
          const angleToCam = Math.atan2(cam.position.x - agent.currentPos.x, cam.position.z - agent.currentPos.z);
          agent.targetRotY = angleToCam;

          if (voiceSession.state === 'listening') {
            if (agent.headMesh) {
              agent.headMesh.rotation.x = -0.15;
              agent.headMesh.rotation.z = 0;
            }
            if (agent.armLeft && agent.armRight) {
              agent.armLeft.rotation.x = -0.4;
              agent.armRight.rotation.x = -0.4;
            }
          } else if (voiceSession.state === 'thinking') {
            if (agent.headMesh) {
              agent.headMesh.rotation.z = Math.sin(now * 0.005) * 0.16;
              agent.headMesh.rotation.x = -0.05;
            }
          } else if (voiceSession.state === 'speaking') {
            if (agent.headMesh) {
              agent.headMesh.rotation.x = -0.1 + Math.sin(now * 0.012) * 0.08;
              agent.headMesh.rotation.z = Math.sin(now * 0.006) * 0.05;
            }
            if (agent.armRight) {
              agent.armRight.rotation.x = -0.85 + Math.sin(now * 0.008) * 0.28;
            }
          }
        }

        // Autonomous State Machine (Paused during direct voice conversation)
        if (storeSpeed > 0 && !isVoiceActiveForAgent) {
          agent.actionTimer -= deltaSec * storeSpeed;

          if (agent.actionTimer <= 0) {
            if (agent.state === 'sitting') {
              const randAction = Math.random();
              if (randAction > 0.45) {
                // Stand up and walk
                agent.state = 'walking';
                agent.seatedMesh.visible = false;
                agent.standingMesh.visible = true;
                const targetZ = agent.homePos.z > 0 ? agent.homePos.z + 5 : agent.homePos.z - 5;
                agent.targetPos.set(agent.homePos.x + (Math.random() - 0.5) * 6, agent.homePos.y, targetZ);
                agent.actionTimer = 16;
              } else {
                // Keep working
                agent.actionTimer = 28;
                // Subtle thinking head tilt
                if (agent.headMesh) {
                  agent.headMesh.rotation.z = (Math.random() - 0.5) * 0.2;
                }
              }
            } else if (agent.state === 'walking') {
              // Return to desk
              agent.targetPos.copy(agent.homePos);
              if (agent.currentPos.distanceTo(agent.homePos) < 0.6) {
                agent.state = 'sitting';
                agent.seatedMesh.visible = true;
                agent.standingMesh.visible = false;
                agent.targetRotY = agent.homePos.x > 0 ? Math.PI : 0;
                agent.actionTimer = 35;
              }
            }
          }
        }

        // Interpolate movement towards targetPos if walking
        if (agent.state === 'walking') {
          const dist = agent.currentPos.distanceTo(agent.targetPos);
          if (dist > 0.15) {
            const moveSpeed = 2.4 * (storeSpeed > 0 ? storeSpeed : 1);
            const dir = new THREE.Vector3().subVectors(agent.targetPos, agent.currentPos).normalize();
            agent.currentPos.addScaledVector(dir, Math.min(dist, moveSpeed * deltaSec));

            const targetAngle = Math.atan2(dir.x, dir.z);
            agent.targetRotY = targetAngle;

            // Leg & Arm Walk Cycle animation
            agent.walkCycleTime += deltaSec * 8 * (storeSpeed > 0 ? Math.min(storeSpeed, 3) : 1);
            if (agent.armLeft && agent.armRight) {
              agent.armLeft.rotation.x = Math.sin(agent.walkCycleTime) * 0.6;
              agent.armRight.rotation.x = -Math.sin(agent.walkCycleTime) * 0.6;
            }
          } else {
            if (agent.armLeft && agent.armRight) {
              agent.armLeft.rotation.x = 0;
              agent.armRight.rotation.x = 0;
            }
          }
        }

        // Smoothly lerp position and rotation
        agent.mesh.position.lerp(agent.currentPos, 0.12);
        agent.currentRotY = THREE.MathUtils.lerp(agent.currentRotY, agent.targetRotY, 0.1);
        agent.mesh.rotation.y = agent.currentRotY;
      });

      setProjectedBubbles(activeBubbles);

      // Follow Camera Mode: Interpolate camera target to followed agent
      if (currentSimCamera === 'follow' && followingId) {
        const followedAgent = simAgentsRef.current.get(followingId);
        if (followedAgent && controlsRef.current && cameraRef.current) {
          const p = followedAgent.currentPos;
          controlsRef.current.target.lerp(new THREE.Vector3(p.x, p.y + 2.2, p.z), 0.08);
          const desiredCamPos = new THREE.Vector3(p.x + 12, p.y + 10, p.z + 14);
          cameraRef.current.position.lerp(desiredCamPos, 0.05);
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      domEl.removeEventListener('pointermove', onPointerMove);
      domEl.removeEventListener('click', onClick);
      renderer.dispose();
    };
  }, []);

  // Update Dynamic Lighting when Sim Time changes
  useEffect(() => {
    if (!dirLightRef.current || !ambientLightRef.current) return;
    const hour = simTime.hour;

    if (hour >= 6 && hour < 12) {
      dirLightRef.current.color.set('#fef08a');
      dirLightRef.current.intensity = 2.6;
      ambientLightRef.current.color.set('#e0f2fe');
    } else if (hour >= 12 && hour < 17) {
      dirLightRef.current.color.set('#fffbeb');
      dirLightRef.current.intensity = 3.0;
      ambientLightRef.current.color.set('#f0f9ff');
    } else if (hour >= 17 && hour < 20) {
      dirLightRef.current.color.set('#fb923c');
      dirLightRef.current.intensity = 2.4;
      ambientLightRef.current.color.set('#fed7aa');
    } else {
      dirLightRef.current.color.set('#38bdf8');
      dirLightRef.current.intensity = 0.8;
      ambientLightRef.current.color.set('#0369a1');
    }
  }, [simTime.hour]);

  // Adjust camera when switching floors in Floor View
  useEffect(() => {
    if (simBuildingView === 'floor' && cameraRef.current && controlsRef.current) {
      const floorY = (activeFloor - 1) * 6;
      controlsRef.current.target.set(0, floorY + 2.5, 0);
      cameraRef.current.position.set(22, floorY + 14, 25);
    }
  }, [activeFloor, simBuildingView]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#030712]">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Floating 3D Speech Bubbles anchored to robots */}
      {projectedBubbles.map((b) => (
        <div
          key={b.id}
          style={{
            left: `${b.screenX}px`,
            top: `${b.screenY}px`,
            transform: 'translate(-50%, -100%)'
          }}
          className="pointer-events-none absolute z-30 flex items-center gap-2 rounded-2xl border bg-[#050816]/95 px-3 py-1.5 shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-bounce-subtle"
        >
          <div
            style={{ backgroundColor: b.ledHex }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-black"
          >
            {b.name.slice(0, 1)}
          </div>
          <div className="text-xs font-mono font-medium text-white max-w-xs leading-tight">
            <strong style={{ color: b.ledHex }} className="mr-1.5 font-bold">
              {b.name}:
            </strong>
            {b.text}
          </div>
        </div>
      ))}

      {/* =========================================================================
          TOP SIMULATION BAR (Sim Clock, Speed Controls, Dollhouse vs Floor Toggle)
          ========================================================================= */}
      <div className="absolute top-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Sim Clock & Schedule HUD */}
        <div className="flex items-center gap-3 rounded-2xl border border-sky-500/30 bg-[#060a18]/90 px-4 py-2 shadow-2xl backdrop-blur-xl pointer-events-auto">
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3.5">
            <Clock className="h-4 w-4 text-sky-400 animate-pulse" />
            <div className="font-mono text-sm font-black text-white">
              {String(simTime.hour).padStart(2, '0')}:{String(simTime.minute).padStart(2, '0')}{' '}
              <span className="text-[10px] text-sky-400 font-bold">{simTime.hour >= 12 ? 'PM' : 'AM'}</span>
            </div>
            <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-[9.5px] font-mono font-bold text-sky-300">
              DÍA {simTime.day}
            </span>
          </div>

          {/* Time Speed Controls */}
          <div className="flex items-center gap-1">
            {([0, 1, 2, 4, 8] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  setSimTimeSpeed(spd);
                  playClick();
                }}
                className={`rounded-lg px-2 py-1 text-xs font-mono font-black transition ${
                  simTime.speed === spd
                    ? 'bg-sky-500 text-black shadow-[0_0_10px_#38bdf8]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title={spd === 0 ? 'Pausar Simulación' : `Velocidad ${spd}x`}
              >
                {spd === 0 ? '⏸' : `${spd}x`}
              </button>
            ))}
          </div>

          {/* Live Schedule Phase Pill */}
          <div className="hidden xl:flex items-center gap-1.5 border-l border-slate-800 pl-3.5 text-xs font-mono text-slate-300">
            <span>{currentSchedulePhase.icon}</span>
            <span className="text-sky-300 font-bold">{currentSchedulePhase.title}:</span>
            <span className="text-slate-400 text-[11px]">{currentSchedulePhase.activity}</span>
          </div>
        </div>

        {/* Center: View Mode (Dollhouse Cutaway vs 3D Floor View) */}
        <div className="flex items-center rounded-2xl border border-slate-800 bg-[#060a18]/90 p-1 shadow-2xl backdrop-blur-xl pointer-events-auto">
          <button
            onClick={() => {
              setSimBuildingView('cutaway');
              setCameraPreset('overview');
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-bold transition ${
              simBuildingView === 'cutaway'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>CORTE EDIFICIO (DOLLHOUSE)</span>
          </button>

          <button
            onClick={() => {
              setSimBuildingView('floor');
              setCameraPreset('floor');
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-bold transition ${
              simBuildingView === 'floor'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>PISO INDIVIDUAL</span>
          </button>
        </div>

        {/* Right: Camera Presets & Dynamic Autonomous Simulation Triggers */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-800 bg-[#060a18]/90 p-1.5 shadow-2xl backdrop-blur-xl pointer-events-auto">
          {/* Quick Simulation Triggers */}
          <button
            onClick={triggerBoardroomMeetingEvent}
            className="flex items-center gap-1 rounded-xl bg-purple-500/20 border border-purple-400/40 px-2.5 py-1.5 text-xs font-mono font-bold text-purple-300 hover:bg-purple-500/30 transition shadow-sm"
            title="Convocar a los directores a la reunión del Piso 5"
          >
            <Users2 className="h-3.5 w-3.5 text-purple-400" />
            <span className="hidden lg:inline">Directorio</span>
          </button>

          <button
            onClick={triggerVyraMaxCollaboration}
            className="flex items-center gap-1 rounded-xl bg-pink-500/20 border border-pink-400/40 px-2.5 py-1.5 text-xs font-mono font-bold text-pink-300 hover:bg-pink-500/30 transition shadow-sm"
            title="Activar Sinergia: Vyra visita el laboratorio de Max"
          >
            <Zap className="h-3.5 w-3.5 text-pink-400" />
            <span className="hidden lg:inline">Vyra ➔ Max</span>
          </button>

          <button
            onClick={triggerGroupCoffeeBreak}
            className="flex items-center gap-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-1.5 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-500/30 transition shadow-sm"
            title="Enviar equipo al Sky Lounge & Cafetería en Rooftop"
          >
            <Coffee className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Rooftop Café</span>
          </button>

          <button
            onClick={() => setCameraPreset('ceo')}
            className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-amber-300 hover:bg-slate-800 transition"
            title="Despacho de Alexis (CEO & Dueño)"
          >
            <Crown className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">CEO</span>
          </button>

          {selectedAgentId && (
            <button
              onClick={() => {
                if (simFollowingAgentId === selectedAgentId) {
                  stopFollowingAgent();
                } else {
                  startFollowingAgent(selectedAgentId);
                }
                playClick();
              }}
              className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold transition ${
                simFollowingAgentId === selectedAgentId
                  ? 'bg-sky-500/30 text-sky-300 border border-sky-400 animate-pulse'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Seguir al Agente Seleccionado"
            >
              <Crosshair className="h-3.5 w-3.5 text-sky-400" />
              <span className="hidden sm:inline">Seguir</span>
            </button>
          )}
        </div>
      </div>

      {/* Floor Selector Pills (7 Levels: P1 to P6 + Rooftop) */}
      {simBuildingView === 'floor' && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-2xl border border-sky-500/20 bg-[#060a18]/90 p-1.5 shadow-2xl backdrop-blur-xl">
          {CORPORATE_FLOORS.map((fl) => (
            <button
              key={fl.floorNumber}
              onClick={() => {
                setActiveFloor(fl.floorNumber);
                playClick();
              }}
              className={`rounded-xl px-3 py-1 text-xs font-mono font-bold transition ${
                activeFloor === fl.floorNumber
                  ? 'bg-sky-500 text-black shadow-[0_0_12px_#38bdf8]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {fl.floorNumber === 7 ? 'ROOFTOP' : `P${fl.floorNumber}`}
            </button>
          ))}
        </div>
      )}

      {/* Floating Hover Tooltip */}
      {(hoveredHotspot || hoveredAgentName) && (
        <div className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-xl border border-sky-400/50 bg-[#060a18]/95 px-4 py-2 text-xs font-mono font-bold text-white shadow-2xl backdrop-blur-xl animate-fade-in">
          <Sparkles className="h-4 w-4 text-sky-400 animate-spin" />
          <span>{hoveredAgentName || hoveredHotspot}</span>
        </div>
      )}

      {/* =========================================================================
          SIMS-STYLE CHARACTER INSPECTOR DOCK (BOTTOM HUD PANEL)
          ========================================================================= */}
      {selectedAgent && selectedProfile && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-4 pointer-events-none">
          <div
            style={{ borderColor: `${selectedProfile.ledHex}60` }}
            className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-3xl border bg-[#050816]/95 p-4 shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl pointer-events-auto"
          >
            {/* Left: Avatar & Identity */}
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div
                  style={{ backgroundColor: selectedProfile.ledHex }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-black shadow-lg"
                >
                  {selectedProfile.name.slice(0, 2)}
                </div>
                <div
                  style={{ backgroundColor: selectedProfile.ledHex }}
                  className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#050816] shadow-sm animate-pulse"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-black text-white">{selectedProfile.name}</span>
                  <span
                    style={{ borderColor: `${selectedProfile.ledHex}60`, color: selectedProfile.ledHex }}
                    className="rounded-md border bg-black/40 px-2 py-0.5 text-[9.5px] font-mono font-bold uppercase"
                  >
                    {selectedProfile.badge.title}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium">{selectedProfile.role}</div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  ID: {selectedProfile.badge.idNumber} • Clearance: {selectedProfile.badge.clearance}
                </div>
              </div>
            </div>

            {/* Center: Life-Sim Meters (Energy & Focus & Mood) */}
            <div className="flex items-center gap-4 border-y md:border-y-0 md:border-x border-slate-800 py-2 md:py-0 px-4">
              {/* Energy Meter */}
              <div className="w-28">
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="flex items-center gap-1 text-slate-400">
                    <BatteryCharging className="h-3 w-3 text-emerald-400" />
                    <span>ENERGÍA</span>
                  </span>
                  <span className="font-bold text-emerald-400">{selectedAgent.simStats?.energy ?? 95}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${selectedAgent.simStats?.energy ?? 95}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Focus Meter */}
              <div className="w-28">
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Brain className="h-3 w-3 text-sky-400" />
                    <span>ENFOQUE</span>
                  </span>
                  <span className="font-bold text-sky-400">{selectedAgent.simStats?.focus ?? 92}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${selectedAgent.simStats?.focus ?? 92}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Mood Badge */}
              <div className="hidden lg:flex flex-col items-center">
                <span className="text-[9.5px] font-mono text-slate-400 uppercase">ESTADO DE ÁNIMO</span>
                <span className="mt-0.5 rounded-lg border border-purple-500/40 bg-purple-500/20 px-2 py-0.5 text-xs font-mono font-bold text-purple-300">
                  {selectedAgent.simStats?.mood || 'Focused 🎯'}
                </span>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex items-center gap-1.5">
              {/* PRIMARY REAL-TIME VOICE BUTTON */}
              <button
                onClick={() => {
                  startVoiceSession(selectedAgent.id);
                  playSuccess();
                }}
                className="flex items-center gap-1.5 rounded-xl border border-cyan-400 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 px-3.5 py-2 text-xs font-mono font-black text-black shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:brightness-110 active:scale-95 transition"
                title="Iniciar conversación continua por voz en tiempo real con interrupción inmediata"
              >
                <Mic className="h-4 w-4 text-black animate-pulse" />
                <span>🎙 TALK TO AGENT</span>
              </button>

              <button
                onClick={() => {
                  selectAgent(selectedAgent.id);
                  setChatModalOpen(true);
                  playClick();
                }}
                className="flex items-center gap-1 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs font-mono font-bold text-sky-300 hover:bg-sky-500/20 transition"
                title="Abrir chat en texto"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>CHAT</span>
              </button>

              <button
                onClick={() => {
                  triggerRobotCoffeeBreak(selectedAgent.id);
                  playSuccess();
                }}
                className="flex items-center gap-1 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-mono font-bold text-amber-300 hover:bg-amber-500/20 transition"
                title="Mandar a tomar café / recargar en el Sky Lounge"
              >
                <Coffee className="h-3.5 w-3.5" />
                <span>CAFÉ</span>
              </button>

              <button
                onClick={() => {
                  setAssignTaskModalOpen(true);
                  playClick();
                }}
                className="flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
                title="Asignar nueva directiva"
              >
                <ClipboardList className="h-3.5 w-3.5" />
                <span>ASIGNAR</span>
              </button>

              <button
                onClick={() => {
                  enterAgentOffice(selectedAgent.id);
                  playClick();
                }}
                className="flex items-center gap-1 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs font-mono font-bold text-purple-300 hover:bg-purple-500/20 transition"
                title="Ver oficina privada"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>OFICINA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

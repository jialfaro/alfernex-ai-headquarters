'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  Compass,
  Laptop,
  Monitor,
  MessageSquare,
  ClipboardList,
  Eye,
  Maximize2,
  Volume2,
  VolumeX,
  Crown,
  Users2,
  Code2,
  TrendingUp,
  Layers,
  CheckCircle2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

// =========================================================================
// ULTRA-HIGH-RESOLUTION PROCEDURAL ARCHITECTURAL TEXTURES (2048x2048 PBR)
// =========================================================================

// 1. Calacatta Gold / Nero Marquina Italian Marble (8K Visual Appearance)
function createPhotorealisticMarbleTexture(dark: boolean = false): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;

  // Base marble slab
  ctx.fillStyle = dark ? '#0a0d16' : '#f8fafc';
  ctx.fillRect(0, 0, 2048, 2048);

  // Organic Veins with Varying Opacity & Feathering
  const numVeins = dark ? 35 : 45;
  for (let i = 0; i < numVeins; i++) {
    ctx.beginPath();
    let x = Math.random() * 2048;
    let y = Math.random() * 2048;
    ctx.moveTo(x, y);

    const length = 400 + Math.random() * 800;
    const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.8;
    const veinWidth = 0.5 + Math.random() * 3.5;

    ctx.strokeStyle = dark
      ? (Math.random() > 0.4 ? 'rgba(56, 189, 248, 0.04)' : 'rgba(251, 191, 36, 0.03)')
      : (Math.random() > 0.4 ? 'rgba(148, 163, 184, 0.08)' : 'rgba(217, 119, 6, 0.05)');
    ctx.lineWidth = veinWidth;

    for (let step = 0; step < length; step += 40) {
      x += Math.cos(angle) * 40 + (Math.random() - 0.5) * 35;
      y += Math.sin(angle) * 40 + (Math.random() - 0.5) * 35;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Large Architectural Tile Seams with Beveled Micro-Shadows
  const tileSize = 512;
  ctx.strokeStyle = dark ? 'rgba(56, 189, 248, 0.07)' : 'rgba(100, 116, 139, 0.15)';
  ctx.lineWidth = 3;
  for (let x = 0; x <= 2048; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 2048);
    ctx.stroke();
  }
  for (let y = 0; y <= 2048; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(2048, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// 2. Architectural Vertical Wood Slat Wall & Ceiling Panels (American Walnut)
function createAcousticWoodSlatsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Dark acoustic felt backing
  ctx.fillStyle = '#090a0f';
  ctx.fillRect(0, 0, 1024, 1024);

  // Walnut Wood Slats
  const slatWidth = 24;
  const gap = 8;
  for (let x = 0; x < 1024; x += slatWidth + gap) {
    // Slat base
    ctx.fillStyle = '#26180f';
    ctx.fillRect(x, 0, slatWidth, 1024);

    // Subtle grain variation
    ctx.fillStyle = '#362215';
    ctx.fillRect(x + 2, 0, slatWidth - 4, 1024);

    // Highlight edge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(x, 0, 2, 1024);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

// 3. Ultra-Crisp Software UI Screen Textures (100% Readable & Job-Specific)
function createDetailedScreenTexture(
  agentId: string,
  screenTitle: string,
  metrics: string[],
  accentColor: string,
  screenRole: 'marketing' | 'software' | 'architecture' | 'data' | 'ceo'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d')!;

  // Dark IDE / Operating System Window
  ctx.fillStyle = '#080c18';
  ctx.fillRect(0, 0, 1920, 1080);

  // Header Title Bar
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 1920, 72);

  // macOS Traffic Lights
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(36, 36, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(72, 36, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(108, 36, 10, 0, Math.PI * 2);
  ctx.fill();

  // App Title
  ctx.font = 'bold 26px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(screenTitle, 160, 45);

  // Live Status Badge
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 20px monospace';
  ctx.fillText('● PRODUCTION REALTIME', 1600, 45);

  if (screenRole === 'marketing') {
    // ==========================================
    // TIKTOK ADS MANAGER (VYRA)
    // ==========================================
    // KPI Cards
    const kpis = [
      { label: 'ROAS ESTIMADO', val: '4.82x', change: '+24% WoW' },
      { label: 'CTR PROMEDIO', val: '4.91%', change: 'GANCHO VIRAL' },
      { label: 'CONVERSION RATE', val: '3.82%', change: 'CONTRA ENTREGA' },
      { label: 'CPA LIMA', val: 'S/. 11.40', change: 'DROPI PERÚ' }
    ];

    kpis.forEach((kpi, i) => {
      const bx = 60 + i * 450;
      ctx.fillStyle = '#131b2e';
      ctx.fillRect(bx, 100, 420, 140);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, 100, 420, 140);

      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(kpi.label, bx + 24, 136);

      ctx.font = 'bold 38px system-ui';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(kpi.val, bx + 24, 185);

      ctx.font = 'bold 15px monospace';
      ctx.fillStyle = '#ec4899';
      ctx.fillText(kpi.change, bx + 24, 218);
    });

    // Main TikTok Chart Area
    ctx.fillStyle = '#101626';
    ctx.fillRect(60, 270, 1800, 740);

    ctx.font = 'bold 24px system-ui';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('TikTok CBO Scaling — Conversiones por Hora (Lima & Provincias)', 90, 320);

    // Retention Curve Chart
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(100, 850);
    const dataPoints = [850, 810, 780, 720, 680, 590, 620, 510, 480, 420, 380, 350, 310, 290];
    dataPoints.forEach((y, idx) => {
      ctx.lineTo(100 + idx * 125, y);
    });
    ctx.stroke();

    // Data points & metrics
    ctx.font = '18px monospace';
    ctx.fillStyle = '#e2e8f0';
    metrics.forEach((m, idx) => {
      ctx.fillText(`▶ ${m}`, 90, 400 + idx * 40);
    });
  } else if (screenRole === 'software') {
    // ==========================================
    // VS CODE IDE + DOCKER + TERMINAL (MAX)
    // ==========================================
    // Left Sidebar (Explorer)
    ctx.fillStyle = '#0d1322';
    ctx.fillRect(0, 72, 340, 1008);

    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText('PROJECT: ALFERNEX-CORE', 30, 120);

    const files = [
      '▼ src/shopify/orderSync.ts',
      '▼ src/dropi/peruDispatch.ts',
      '  src/ai/agentMatrix.ts',
      '  src/security/hmacAuth.ts',
      '  docker-compose.yml',
      '  package.json'
    ];
    files.forEach((f, idx) => {
      ctx.fillStyle = idx < 2 ? '#38bdf8' : '#94a3b8';
      ctx.fillText(f, 30, 165 + idx * 36);
    });

    // Main Editor Code
    ctx.fillStyle = '#070a14';
    ctx.fillRect(340, 72, 1580, 650);

    ctx.font = '20px "JetBrains Mono", monospace';
    const codeLines = [
      'import { ShopifyWebhookPayload } from "@alfernex/shopify-types";',
      'import { DropiPeruClient } from "@alfernex/dropi-sdk";',
      '',
      'export async function handleShopifyOrderCreated(payload: ShopifyWebhookPayload) {',
      '  const client = new DropiPeruClient({ token: process.env.DROPI_AUTH_TOKEN });',
      '  const order = await client.createCashOnDeliveryOrder({',
      '    storeId: "8bhsfq-gz",',
      '    dropiAccountId: 132455,',
      '    customerPhone: payload.shipping_address.phone,',
      '    courierService: "AUTO_FASTEST_PERU", // Lima Metropolitana: Olva / Scharff',
      '  });',
      '  console.log(`[ALFERNEX] Order dispatched successfully in 28ms: ${order.id}`);',
      '}'
    ];

    codeLines.forEach((line, idx) => {
      ctx.fillStyle = line.includes('import') || line.includes('export') || line.includes('const')
        ? '#38bdf8'
        : line.includes('"')
        ? '#a5f3fc'
        : line.includes('//')
        ? '#10b981'
        : '#ffffff';
      ctx.fillText(line, 380, 125 + idx * 34);
    });

    // Bottom Integrated Terminal
    ctx.fillStyle = '#05070f';
    ctx.fillRect(340, 722, 1580, 358);

    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#10b981';
    ctx.fillText('bash - alfernex-production-cluster-01 [OK]', 380, 760);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('$ pnpm test:integration --run', 380, 800);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('✓ Shopify Store 8bhsfq-gz connected (30 items synced in 0.4s)', 380, 840);
    ctx.fillText('✓ Dropi Account #132455 Webhook Listener ACTIVE [HTTP 200]', 380, 880);
    ctx.fillText('✓ Turbopack compilation: 0 errors, zero warnings [MEMORY: 412MB]', 380, 920);
  } else {
    // ==========================================
    // ARCHITECTURE / DATA / CEO EXECUTIVE SCREEN
    // ==========================================
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(60, 100, 1800, 910);

    ctx.font = 'bold 32px system-ui';
    ctx.fillStyle = accentColor;
    ctx.fillText(screenTitle, 100, 165);

    ctx.font = '22px monospace';
    ctx.fillStyle = '#ffffff';
    metrics.forEach((m, idx) => {
      ctx.fillText(`▶  ${m}`, 100, 240 + idx * 56);
    });
  }

  return new THREE.CanvasTexture(canvas);
}

// =========================================================================
// LIGHTING ATMOSPHERES CONFIGURATION (DAYLIGHT, GOLDEN HOUR, NIGHT)
// =========================================================================

export type LightingTimeOfDay = 'daylight' | 'golden_hour' | 'night';

interface LightingConfig {
  skyColor: string;
  sunColor: string;
  sunIntensity: number;
  sunPosition: [number, number, number];
  ambientColor: string;
  ambientIntensity: number;
  indoorLightColor: string;
  indoorLightIntensity: number;
  fogColor: string;
}

const LIGHTING_PRESETS: Record<LightingTimeOfDay, LightingConfig> = {
  daylight: {
    skyColor: '#0a1020',
    sunColor: '#fffbf0',
    sunIntensity: 3.2,
    sunPosition: [35, 60, 25],
    ambientColor: '#e0f2fe',
    ambientIntensity: 0.95,
    indoorLightColor: '#fef3c7',
    indoorLightIntensity: 1.2,
    fogColor: '#070b16'
  },
  golden_hour: {
    skyColor: '#120d18',
    sunColor: '#ff9838',
    sunIntensity: 2.8,
    sunPosition: [45, 25, 20],
    ambientColor: '#fed7aa',
    ambientIntensity: 0.85,
    indoorLightColor: '#fde047',
    indoorLightIntensity: 1.5,
    fogColor: '#100b14'
  },
  night: {
    skyColor: '#02040a',
    sunColor: '#1e293b',
    sunIntensity: 0.4,
    sunPosition: [20, 40, 20],
    ambientColor: '#0369a1',
    ambientIntensity: 0.5,
    indoorLightColor: '#38bdf8',
    indoorLightIntensity: 2.2,
    fogColor: '#020409'
  }
};

// =========================================================================
// CINEMATIC WALKTHROUGH STOPS (10 ARCHITECTURAL SPACES)
// =========================================================================

interface WalkthroughStop {
  id: string;
  title: string;
  subtitle: string;
  cameraPos: THREE.Vector3;
  targetPos: THREE.Vector3;
}

const WALKTHROUGH_STOPS: WalkthroughStop[] = [
  {
    id: 'atrium',
    title: 'ATRIO CENTRAL & RECEPCIÓN DE DOBLE ALTURA',
    subtitle: 'Mármol Calacatta Gold, mamparas de cristal y lamas de nogal acústico.',
    cameraPos: new THREE.Vector3(0, 5, 24),
    targetPos: new THREE.Vector3(0, 3, 0)
  },
  {
    id: 'vyra-marketing',
    title: 'SUITE DE MARKETING & TIKTOK ADS (VYRA)',
    subtitle: 'Estación de trabajo ergonómica, TikTok Ads Manager y ganchos de retención.',
    cameraPos: new THREE.Vector3(-10, 4.2, 3.8),
    targetPos: new THREE.Vector3(-10, 3.1, -1.2)
  },
  {
    id: 'max-engineering',
    title: 'LABORATORIO DE SOFTWARE CORE & CI/CD (MAX)',
    subtitle: 'Workstation ThinkPad con 3 pantallas, VS Code, Git y contenedores Docker.',
    cameraPos: new THREE.Vector3(10, 4.2, 3.8),
    targetPos: new THREE.Vector3(10, 3.1, -1.2)
  },
  {
    id: 'alex-architecture',
    title: 'ESTUDIO DE ARQUITECTURA CLOUD C4 (ALEX)',
    subtitle: 'Mesa de diseño de sistemas, topología C4 y latencia en microservicios.',
    cameraPos: new THREE.Vector3(10, 4.2, 15.8),
    targetPos: new THREE.Vector3(10, 3.1, 10.8)
  },
  {
    id: 'nova-research',
    title: 'LABORATORIO DE INVESTIGACIÓN NEURONAL (NOVA)',
    subtitle: 'Papers de arXiv, grafos de embeddings vectoriales y benchmarks LLM.',
    cameraPos: new THREE.Vector3(-22, 4.2, 3.8),
    targetPos: new THREE.Vector3(-22, 3.1, -1.2)
  },
  {
    id: 'nex-analytics',
    title: 'CENTRO DE INTELIGENCIA FINANCIERA & P&L (NEX)',
    subtitle: 'Matriz Bloomberg de 4 pantallas, ventas reales en Soles y cash flow.',
    cameraPos: new THREE.Vector3(-22, 4.2, 15.8),
    targetPos: new THREE.Vector3(-22, 3.1, 10.8)
  },
  {
    id: 'server-room',
    title: 'BÓVEDA DE SERVIDORES CUÁNTICOS & CIBERDEFENSA (CIPHER)',
    subtitle: 'Racks de alta densidad, fibra óptica, patch panels y Zero Trust Firewall.',
    cameraPos: new THREE.Vector3(10, 4.2, -8.2),
    targetPos: new THREE.Vector3(10, 3.1, -13.2)
  },
  {
    id: 'boardroom',
    title: 'SALA DE JUNTAS DEL DIRECTORIO EJECUTIVO',
    subtitle: 'Mesa de conferencias para 12 directores con vista panorámica a la ciudad.',
    cameraPos: new THREE.Vector3(0, 5.5, 12),
    targetPos: new THREE.Vector3(0, 3.5, 0)
  },
  {
    id: 'ceo-penthouse',
    title: 'DESPACHO PRESIDENCIAL DE ALEXIS (CEO & DUEÑO)',
    subtitle: 'Suite en obsidiana y oro pulido, corona holográfica y War Room Shopify.',
    cameraPos: new THREE.Vector3(0, 4.8, -14),
    targetPos: new THREE.Vector3(0, 3.2, -22)
  }
];

// =========================================================================
// MAIN ARCHITECTURAL VISUALIZATION COMPONENT
// =========================================================================

export const RealisticRoboticsHQ: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Store Bindings
  const agents = useOfficeStore((s) => s.agents);
  const selectedAgentId = useOfficeStore((s) => s.selectedAgentId);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);
  const selectAgent = useOfficeStore((s) => s.selectAgent);
  const setChatModalOpen = useOfficeStore((s) => s.setChatModalOpen);
  const setAssignTaskModalOpen = useOfficeStore((s) => s.setAssignTaskModalOpen);
  const tickSimulation = useOfficeStore((s) => s.tickSimulation);

  // ArchViz Controls State
  const [timeOfDay, setTimeOfDay] = useState<LightingTimeOfDay>('daylight');
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentTourIndex, setCurrentTourIndex] = useState(0);
  const [inspectedRobot, setInspectedRobot] = useState<RobotProfile | null>(ROBOT_PROFILES['vyra-growth']);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetLookAtRef = useRef<THREE.Vector3 | null>(null);

  const robotMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const clickableObjectsRef = useRef<THREE.Object3D[]>([]);

  // Smooth Architectural Camera Transition
  const smoothFlyTo = useCallback((camPos: THREE.Vector3, lookAt: THREE.Vector3) => {
    targetCamPosRef.current = camPos.clone();
    targetLookAtRef.current = lookAt.clone();
    soundFX.playClick(soundEnabled);
  }, [soundEnabled]);

  // Handle Tour Progression
  const nextTourStop = () => {
    const nextIdx = (currentTourIndex + 1) % WALKTHROUGH_STOPS.length;
    setCurrentTourIndex(nextIdx);
    const stop = WALKTHROUGH_STOPS[nextIdx];
    smoothFlyTo(stop.cameraPos, stop.targetPos);
  };

  const prevTourStop = () => {
    const prevIdx = (currentTourIndex - 1 + WALKTHROUGH_STOPS.length) % WALKTHROUGH_STOPS.length;
    setCurrentTourIndex(prevIdx);
    const stop = WALKTHROUGH_STOPS[prevIdx];
    smoothFlyTo(stop.cameraPos, stop.targetPos);
  };

  const toggleTour = () => {
    if (!isTourActive) {
      setIsTourActive(true);
      const stop = WALKTHROUGH_STOPS[currentTourIndex];
      smoothFlyTo(stop.cameraPos, stop.targetPos);
    } else {
      setIsTourActive(false);
    }
    soundFX.playClick(soundEnabled);
  };

  // Switch Lighting Atmosphere (Daylight, Golden Hour, Night)
  const changeLightingTime = (time: LightingTimeOfDay) => {
    setTimeOfDay(time);
    soundFX.playClick(soundEnabled);

    const cfg = LIGHTING_PRESETS[time];
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(cfg.skyColor);
      sceneRef.current.fog = new THREE.FogExp2(cfg.fogColor, 0.006);
    }
    if (sunLightRef.current) {
      sunLightRef.current.color = new THREE.Color(cfg.sunColor);
      sunLightRef.current.intensity = cfg.sunIntensity;
      sunLightRef.current.position.set(...cfg.sunPosition);
    }
    if (hemiLightRef.current) {
      hemiLightRef.current.color = new THREE.Color(cfg.ambientColor);
      hemiLightRef.current.intensity = cfg.ambientIntensity;
    }
  };

  // Inspect Robot
  const handleSelectRobot = (robotId: string) => {
    const profile = ROBOT_PROFILES[robotId];
    if (!profile) return;

    setInspectedRobot(profile);
    setIsDrawerOpen(true);
    selectAgent(robotId);
    soundFX.playSelect(soundEnabled);

    const robotMesh = robotMeshesRef.current.get(robotId);
    if (robotMesh) {
      const pos = robotMesh.position;
      smoothFlyTo(
        new THREE.Vector3(pos.x + 3.2, 3.8, pos.z + 4.2),
        new THREE.Vector3(pos.x, 3.0, pos.z)
      );
    }
  };

  // Initialize Three.js ArchViz Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(LIGHTING_PRESETS.daylight.skyColor);
    scene.fog = new THREE.FogExp2(LIGHTING_PRESETS.daylight.fogColor, 0.006);
    sceneRef.current = scene;

    // 2. Camera (28mm Architectural Focal Length equivalent ~ 42° FOV at Human Eye Level)
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.2,
      2500
    );
    camera.position.set(0, 5, 24); // Eye level looking at lobby
    cameraRef.current = camera;

    // 3. Renderer with Physically Based Tone Mapping & Soft Shadows
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
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
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Keep camera above floor level
    controls.minDistance = 2.0;
    controls.maxDistance = 150;
    controls.target.set(0, 3, 0);
    controlsRef.current = controls;

    // 5. Lighting Rig
    const sunLight = new THREE.DirectionalLight(
      LIGHTING_PRESETS.daylight.sunColor,
      LIGHTING_PRESETS.daylight.sunIntensity
    );
    sunLight.position.set(...LIGHTING_PRESETS.daylight.sunPosition);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 160;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    sunLight.shadow.bias = -0.0002;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    const hemiLight = new THREE.HemisphereLight(
      LIGHTING_PRESETS.daylight.ambientColor,
      '#0f172a',
      LIGHTING_PRESETS.daylight.ambientIntensity
    );
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // Warm Architectural Troffer Lights
    const warmPendant = new THREE.PointLight('#fef3c7', 2.0, 60);
    warmPendant.position.set(0, 14, 0);
    scene.add(warmPendant);

    // 6. Build Architectural Structures
    buildArchVizOfficeBuilding(scene);

    // 7. Build Spatially Coherent Humanoid Workstations (CRITICAL ERGONOMIC RULE)
    robotMeshesRef.current.clear();
    clickableObjectsRef.current = [];
    buildSpatiallyCoherentWorkstations(scene, robotMeshesRef.current, clickableObjectsRef.current);

    // 8. Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation & Render Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      tickSimulation(delta * 1000);

      // Smooth Camera Interpolation (Lerp to targets)
      if (targetCamPosRef.current && targetLookAtRef.current && cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, 0.05);
        controlsRef.current.target.lerp(targetLookAtRef.current, 0.05);
        controlsRef.current.update();

        if (cameraRef.current.position.distanceTo(targetCamPosRef.current) < 0.08) {
          targetCamPosRef.current = null;
          targetLookAtRef.current = null;
        }
      } else {
        controls.update();
      }

      // Animate Realistic Robot Fingers and Subtle Neck Posture
      animateArchVizRobots(robotMeshesRef.current, elapsed);

      // Animate CEO Floating Crown in Presidential Suite
      const crown = scene.getObjectByName('ceo-presidential-crown');
      if (crown) {
        crown.rotation.y = elapsed * 1.2;
        crown.position.y = 7.6 + Math.sin(elapsed * 2.2) * 0.2;
      }

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

  // Raycast Click Handler
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(clickableObjectsRef.current, true);
    if (intersects.length > 0) {
      let topObj: THREE.Object3D | null = intersects[0].object;
      while (topObj && !topObj.name.startsWith('robot-')) {
        topObj = topObj.parent;
      }
      if (topObj && topObj.name.startsWith('robot-')) {
        const robotId = topObj.name.replace('robot-', '');
        handleSelectRobot(robotId);
      }
    }
  };

  const currentStop = WALKTHROUGH_STOPS[currentTourIndex];

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#050814]">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
      />

      {/* Floating Top Controls: Tour Cinemático & Iluminación Arquitectónica */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-3">
        {/* ArchViz Brand Badge */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-[#070b18]/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/50 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-600/20 text-amber-300">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">
                ALFERNEX ARCHVIZ 3D
              </span>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[9.5px] font-extrabold text-amber-300 border border-amber-400/40">
                PHOTOREALISTIC
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Visualización Arquitectónica Profesional & Robótica Humanoide
            </p>
          </div>
        </div>

        {/* Walkthrough Tour Controller */}
        <div className="flex items-center gap-2 rounded-2xl border border-sky-500/30 bg-[#070b18]/90 p-1.5 shadow-xl backdrop-blur-xl">
          <button
            onClick={toggleTour}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-black transition ${
              isTourActive
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {isTourActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 text-sky-400" />}
            <span>{isTourActive ? 'PAUSAR TOUR' : 'TOUR ARQUITECTÓNICO'}</span>
          </button>

          {isTourActive && (
            <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
              <button
                onClick={prevTourStop}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
                title="Espacio Anterior"
              >
                ◀
              </button>
              <span className="font-mono text-xs font-bold text-sky-300 px-1">
                {currentTourIndex + 1} / {WALKTHROUGH_STOPS.length}
              </span>
              <button
                onClick={nextTourStop}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
                title="Siguiente Espacio"
              >
                ▶
              </button>
            </div>
          )}
        </div>

        {/* Lighting Time of Day Switcher (Daylight, Golden Hour, Night) */}
        <div className="flex items-center gap-1 rounded-2xl border border-slate-800 bg-[#070b18]/90 p-1.5 backdrop-blur-xl">
          <button
            onClick={() => changeLightingTime('daylight')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition ${
              timeOfDay === 'daylight'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Luz Natural de Día (5500K)"
          >
            <Sun className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Día</span>
          </button>

          <button
            onClick={() => changeLightingTime('golden_hour')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition ${
              timeOfDay === 'golden_hour'
                ? 'bg-orange-500/20 text-orange-200 border border-orange-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Atardecer Dorado (Golden Hour)"
          >
            <Sunset className="h-3.5 w-3.5 text-orange-400" />
            <span className="hidden sm:inline">Atardecer</span>
          </button>

          <button
            onClick={() => changeLightingTime('night')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition ${
              timeOfDay === 'night'
                ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Noche Ejecutiva (Skyline)"
          >
            <Moon className="h-3.5 w-3.5 text-sky-400" />
            <span className="hidden sm:inline">Noche</span>
          </button>
        </div>
      </div>

      {/* Cinematic On-Screen Architectural Subtitle (During Walkthrough Tour) */}
      {isTourActive && (
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-center max-w-xl rounded-2xl border border-sky-400/40 bg-[#060a18]/95 px-6 py-4 shadow-2xl backdrop-blur-2xl animate-fade-in">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-sky-400 mb-1">
            ALFERNEX ARCHITECTURAL WALKTHROUGH &bull; PARADA {currentTourIndex + 1}
          </span>
          <h3 className="font-mono text-base font-black text-white">{currentStop.title}</h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{currentStop.subtitle}</p>
        </div>
      )}

      {/* Robot Workstation & Credential Inspection Drawer */}
      {isDrawerOpen && inspectedRobot && (
        <div className="absolute top-0 right-0 z-30 flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-[#060814]/98 p-6 shadow-2xl backdrop-blur-2xl animate-fade-in overflow-y-auto no-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div
                style={{ backgroundColor: inspectedRobot.ledHex }}
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-black text-black shadow-lg"
              >
                {inspectedRobot.name.slice(0, 2)}
              </div>
              <div>
                <span className="font-mono text-lg font-black text-white block leading-tight">
                  {inspectedRobot.name}
                </span>
                <span
                  style={{ color: inspectedRobot.ledHex }}
                  className="font-mono text-xs font-bold block mt-0.5"
                >
                  {inspectedRobot.role}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white"
            >
              CERRAR
            </button>
          </div>

          {/* Ergonomic Spatial Consistency Confirmation */}
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 mb-4 text-xs font-mono text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>Ergonomía Verificada: Robot alineado 100% hacia monitores, teclado y ratón.</span>
          </div>

          {/* Physical Specifications */}
          <div className="space-y-4 mb-6 text-xs">
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
                Credencial Corporativa ALFERNEX:
              </span>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-slate-300 font-mono space-y-1">
                <div>ID: <strong className="text-white">{inspectedRobot.badge.idNumber}</strong></div>
                <div>Cargo: <strong className="text-sky-300">{inspectedRobot.badge.title}</strong></div>
                <div>Nivel: <strong className="text-amber-400">{inspectedRobot.badge.clearance}</strong></div>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
                Puesto de Trabajo & Hardware:
              </span>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-sky-300 font-mono font-bold">
                  <Laptop className="h-4 w-4" />
                  <span>{inspectedRobot.workstation.hardware}</span>
                </div>
                <div className="border-t border-slate-800/80 pt-2">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">
                    Métricas en Pantalla en Vivo:
                  </span>
                  <div className="space-y-1">
                    {inspectedRobot.workstation.screenMetrics.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                        <span className="text-emerald-400">▶</span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto space-y-2.5 pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                selectAgent(inspectedRobot.id);
                setChatModalOpen(true);
                soundFX.playClick(soundEnabled);
              }}
              style={{ backgroundColor: `${inspectedRobot.ledHex}25`, borderColor: inspectedRobot.ledHex }}
              className="w-full flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold text-white hover:brightness-110 transition shadow-md"
            >
              <MessageSquare className="h-4 w-4" />
              <span>HABLAR CON {inspectedRobot.name} (ES / EN)</span>
            </button>

            <button
              onClick={() => {
                selectAgent(inspectedRobot.id);
                setAssignTaskModalOpen(true);
                soundFX.playClick(soundEnabled);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <ClipboardList className="h-4 w-4 text-sky-400" />
              <span>ASIGNAR TAREA DIRECTA</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Quick Help Footer */}
      <div className="pointer-events-none absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-3 font-mono text-[11px] text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800/80">
        <span>Rotar 360°: <strong>Arrastrar Clic Izquierdo</strong></span>
        <span>&bull;</span>
        <span>Moverse: <strong>Clic Derecho</strong></span>
        <span>&bull;</span>
        <span>Zoom: <strong>Rueda</strong></span>
      </div>
    </div>
  );
};

// =========================================================================
// ARCHITECTURAL 3D BUILDING BUILDER (REAL WORLD CONSTRUCTION LOGIC)
// =========================================================================

function buildArchVizOfficeBuilding(scene: THREE.Scene) {
  // 1. Flooring: Calacatta Off-White Italian Marble with Specular Sheen
  const floorGeo = new THREE.PlaneGeometry(90, 90);
  const floorMat = new THREE.MeshStandardMaterial({
    map: createPhotorealisticMarbleTexture(false),
    roughness: 0.16,
    metalness: 0.25
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  // 2. Double-Height Acoustic Walnut Slat Ceiling (14m clearance)
  const ceilingGeo = new THREE.PlaneGeometry(90, 90);
  const ceilingMat = new THREE.MeshStandardMaterial({
    map: createAcousticWoodSlatsTexture(),
    roughness: 0.75,
    metalness: 0.1
  });
  const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.y = 14;
  scene.add(ceilingMesh);

  // 3. Architectural Floor-to-Ceiling Glass Partitions & Steel Frames
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: '#cbd5e1',
    transparent: true,
    opacity: 0.2,
    roughness: 0.04,
    transmission: 0.88,
    thickness: 0.5,
    reflectivity: 0.95
  });

  const steelFrameMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    roughness: 0.25,
    metalness: 0.85
  });

  // Central acoustic glass corridor dividing Marketing & Engineering
  const corridorGlassGeo = new THREE.BoxGeometry(0.3, 13, 50);
  const corridorGlass = new THREE.Mesh(corridorGlassGeo, glassMat);
  corridorGlass.position.set(0, 6.5, 0);
  scene.add(corridorGlass);

  // Architectural Concrete Structural Columns (Load-Bearing Grid)
  const concreteMat = new THREE.MeshStandardMaterial({
    color: '#334155',
    roughness: 0.8,
    metalness: 0.1
  });

  const columnCoords: [number, number][] = [
    [-24, -14],
    [-24, 14],
    [24, -14],
    [24, 14]
  ];

  columnCoords.forEach(([cx, cz]) => {
    const colGeo = new THREE.BoxGeometry(2.4, 14, 2.4);
    const col = new THREE.Mesh(colGeo, concreteMat);
    col.position.set(cx, 7, cz);
    col.castShadow = true;
    col.receiveShadow = true;
    scene.add(col);
  });

  // 4. Large Exterior Panoramic Window Wall (Daylight & City View)
  const windowWallGeo = new THREE.BoxGeometry(90, 14, 0.4);
  const windowWall = new THREE.Mesh(windowWallGeo, glassMat);
  windowWall.position.set(0, 7, -35);
  scene.add(windowWall);
}

// =========================================================================
// SPATIALLY COHERENT WORKSTATIONS BUILDER (STRICT ROBOT ERGONOMIC HIERARCHY)
// =========================================================================
// HIERARCHY:
// ROBOT (facing -Z) → CHAIR (facing -Z) → HANDS (on keyboard) → KEYBOARD → LAPTOP → MONITORS
// =========================================================================

function buildSpatiallyCoherentWorkstations(
  scene: THREE.Scene,
  robotMap: Map<string, THREE.Group>,
  clickableList: THREE.Object3D[]
) {
  // Shared High-End Materials
  const ceramicMat = new THREE.MeshPhysicalMaterial({
    color: '#f8fafc',
    roughness: 0.15,
    metalness: 0.08,
    clearcoat: 0.9,
    clearcoatRoughness: 0.08
  });

  const carbonJointMat = new THREE.MeshStandardMaterial({
    color: '#080c16',
    roughness: 0.2,
    metalness: 0.85
  });

  const darkWalnutMat = new THREE.MeshStandardMaterial({
    color: '#1a110a',
    roughness: 0.35,
    metalness: 0.1
  });

  const anodizedSteelMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    roughness: 0.25,
    metalness: 0.85
  });

  // Master Layout Coordinates: Each workstation is a self-contained coherent space
  const stationsConfig: {
    id: string;
    x: number;
    z: number;
    rotationY: number;
    screenRole: 'marketing' | 'software' | 'architecture' | 'data' | 'ceo';
    monitorCount: 1 | 2 | 3 | 4;
  }[] = [
    { id: 'vyra-growth', x: -10, z: -2, rotationY: 0, screenRole: 'marketing', monitorCount: 2 },
    { id: 'echo-sales', x: -10, z: 12, rotationY: 0, screenRole: 'data', monitorCount: 2 },
    { id: 'sol-support', x: -10, z: -16, rotationY: 0, screenRole: 'marketing', monitorCount: 2 },
    { id: 'max-developer', x: 10, z: -2, rotationY: Math.PI, screenRole: 'software', monitorCount: 3 },
    { id: 'alex-architect', x: 10, z: 12, rotationY: Math.PI, screenRole: 'architecture', monitorCount: 3 },
    { id: 'cipher-security', x: 10, z: -16, rotationY: Math.PI, screenRole: 'software', monitorCount: 3 },
    { id: 'nova-research', x: -24, z: -2, rotationY: Math.PI / 2, screenRole: 'architecture', monitorCount: 2 },
    { id: 'nex-data', x: -24, z: 12, rotationY: Math.PI / 2, screenRole: 'data', monitorCount: 4 },
    { id: 'maya-creative', x: 24, z: -2, rotationY: -Math.PI / 2, screenRole: 'marketing', monitorCount: 2 },
    { id: 'atlas-ops', x: 24, z: 12, rotationY: -Math.PI / 2, screenRole: 'architecture', monitorCount: 2 }
  ];

  stationsConfig.forEach((cfg) => {
    const profile = ROBOT_PROFILES[cfg.id];
    if (!profile) return;

    // Root Workstation Group (Centered at workstation location, oriented by rotationY)
    const station = new THREE.Group();
    station.position.set(cfg.x, 0, cfg.z);
    station.rotation.y = cfg.rotationY;

    // 1. DESK (Top at y = 2.4, depth = 2.4, width = 5.2, centered at z = 0)
    const deskTopGeo = new THREE.BoxGeometry(5.2, 0.22, 2.4);
    const deskTop = new THREE.Mesh(deskTopGeo, darkWalnutMat);
    deskTop.position.set(0, 2.4, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    station.add(deskTop);

    // Desk Steel Legs
    [-2.4, 2.4].forEach((lx) => {
      const legGeo = new THREE.BoxGeometry(0.18, 2.3, 2.2);
      const leg = new THREE.Mesh(legGeo, anodizedSteelMat);
      leg.position.set(lx, 1.15, 0);
      leg.castShadow = true;
      station.add(leg);
    });

    // 2. MONITORS (Located at z = -0.7m, facing +Z directly at the robot)
    const screenTexture = createDetailedScreenTexture(
      profile.id,
      profile.workstation.screenTitle,
      profile.workstation.screenMetrics,
      profile.ledHex,
      cfg.screenRole
    );
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });

    if (cfg.monitorCount === 3) {
      // 3-Monitor Setup (Max / Alex)
      // Center Monitor
      const centerMon = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 0.06), screenMat);
      centerMon.position.set(0, 3.8, -0.7);
      centerMon.castShadow = true;
      station.add(centerMon);

      // Left Monitor (angled inward 20°)
      const leftMon = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 0.06), screenMat);
      leftMon.position.set(-2.1, 3.8, -0.4);
      leftMon.rotation.y = 0.35;
      leftMon.castShadow = true;
      station.add(leftMon);

      // Right Monitor (angled inward 20°)
      const rightMon = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 0.06), screenMat);
      rightMon.position.set(2.1, 3.8, -0.4);
      rightMon.rotation.y = -0.35;
      rightMon.castShadow = true;
      station.add(rightMon);
    } else if (cfg.monitorCount === 4) {
      // 4-Monitor Matrix (Nex)
      for (let row = 0; row < 2; row++) {
        for (let col = -1; col <= 1; col += 2) {
          const mon = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.2, 0.06), screenMat);
          mon.position.set(col * 1.2, 3.3 + row * 1.3, -0.7);
          mon.castShadow = true;
          station.add(mon);
        }
      }
    } else {
      // 2-Monitor Setup (Vyra - 1 Ultrawide + 1 Vertical)
      const mainMon = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.5, 0.06), screenMat);
      mainMon.position.set(-0.6, 3.8, -0.7);
      mainMon.castShadow = true;
      station.add(mainMon);

      const vertMon = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.06), screenMat);
      vertMon.position.set(1.6, 3.8, -0.6);
      vertMon.rotation.y = -0.3;
      vertMon.castShadow = true;
      station.add(vertMon);
    }

    // 3. LAPTOP (Resting at z = +0.1m, open towards robot)
    const lapBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 0.8), anodizedSteelMat);
    lapBase.position.set(0, 2.52, 0.1);
    station.add(lapBase);

    const lapLid = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.03), screenMat);
    lapLid.position.set(0, 2.9, -0.28);
    lapLid.rotation.x = -0.25; // Tilted slightly back for ergonomic view
    station.add(lapLid);

    // 4. MECHANICAL KEYBOARD & WIRELESS MOUSE (Resting at z = +0.55m right where hands fall)
    const kbGeo = new THREE.BoxGeometry(1.4, 0.05, 0.45);
    const kbMat = new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.3 });
    const keyboard = new THREE.Mesh(kbGeo, kbMat);
    keyboard.position.set(-0.2, 2.53, 0.55);
    station.add(keyboard);

    const mouseGeo = new THREE.BoxGeometry(0.24, 0.06, 0.38);
    const mouse = new THREE.Mesh(mouseGeo, kbMat);
    mouse.position.set(0.8, 2.53, 0.55);
    station.add(mouse);

    // 5. ERGONOMIC TASK CHAIR (Facing -Z directly into the desk)
    const chair = new THREE.Group();
    chair.position.set(0, 0, 1.45);
    chair.rotation.y = Math.PI; // Strictly facing -Z into the desk!

    const chairSeat = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.25, 1.8),
      new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.6 })
    );
    chairSeat.position.y = 1.6;
    chair.add(chairSeat);

    const chairBack = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 2.4, 0.2),
      new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.5 })
    );
    chairBack.position.set(0, 2.8, -0.8);
    chair.add(chairBack);

    station.add(chair);

    // 6. REALISTIC HUMANOID SERVICE ROBOT (100% SPATIALLY ALIGNED TO DESK)
    // Seated at (0, 0, 1.45), facing -Z (Math.PI) directly into keyboard & monitors!
    const robot = buildStrictlyAlignedRobot(profile, ceramicMat, carbonJointMat);
    robot.position.set(0, 0, 1.45);
    robot.rotation.y = Math.PI; // Faces -Z straight into keyboard & screens
    robot.name = `robot-${profile.id}`;

    station.add(robot);
    robotMap.set(profile.id, robot);
    clickableList.push(robot);

    scene.add(station);
  });

  // 7. Presidential CEO Penthouse Suite (Alexis)
  buildAlexisPresidentialArchVizSuite(scene);
}

// Master Ergonomically Aligned Robot Rig
// Every joint, limb, eye sensor and finger strictly oriented toward workstation
function buildStrictlyAlignedRobot(
  profile: RobotProfile,
  ceramicMat: THREE.Material,
  carbonJointMat: THREE.Material
): THREE.Group {
  const robot = new THREE.Group();
  const ledMat = new THREE.MeshBasicMaterial({ color: profile.ledHex });

  // 1. Pelvis Seated Firmly on Chair
  const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.44, 0.35, 16), carbonJointMat);
  pelvis.position.y = 1.75;
  pelvis.castShadow = true;
  robot.add(pelvis);

  // 2. Spine Segmented Ceramic & Carbon
  for (let s = 0; s < 3; s++) {
    const spinePart = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), carbonJointMat);
    spinePart.position.set(0, 2.05 + s * 0.28, -0.05 * s);
    robot.add(spinePart);
  }

  // 3. Torso Shell (Leaning slightly forward into desk)
  const isSlim = profile.silhouette === 'feminine-slim';
  const chestWidth = isSlim ? 1.35 : 1.6;
  const chest = new THREE.Mesh(new THREE.BoxGeometry(chestWidth, 1.45, 0.85), ceramicMat);
  chest.position.set(0, 3.4, -0.1);
  chest.rotation.x = 0.08; // Natural slight forward lean toward keyboard
  chest.castShadow = true;
  robot.add(chest);

  // Chest Signature LED Slit
  const chestLed = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.9), ledMat);
  chestLed.position.set(0, 3.5, -0.1);
  robot.add(chestLed);

  // Physical ID Badge Clipped to Chest
  const badgeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.42, 0.02),
    new THREE.MeshBasicMaterial({ color: '#0f172a' })
  );
  badgeMesh.position.set(isSlim ? 0.32 : 0.42, 3.4, 0.35);
  robot.add(badgeMesh);

  // 4. Mechanical Segmented Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.45, 12), carbonJointMat);
  neck.position.set(0, 4.3, -0.08);
  neck.rotation.x = 0.12;
  robot.add(neck);

  // 5. Robot Head (Oriented 12° Downward Directly at Laptop/Monitors)
  const head = new THREE.Group();
  head.name = 'robot-head';
  head.position.set(0, 4.8, -0.12);
  head.rotation.x = 0.18; // Looking directly at monitor screen vector!

  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.62, 20, 20), ceramicMat);
  helmet.scale.set(1, 1.15, 1.1);
  helmet.castShadow = true;
  head.add(helmet);

  // Tinted Glass Faceplate Visor
  const visor = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.36, 0.48),
    new THREE.MeshStandardMaterial({ color: '#060a12', roughness: 0.1, metalness: 0.9 })
  );
  visor.position.set(0, 0.04, 0.48);
  head.add(visor);

  // Optical Camera Sensor Arrays
  const sensorLed = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.5), ledMat);
  sensorLed.position.set(0, 0.04, 0.5);
  head.add(sensorLed);

  robot.add(head);

  // 6. Shoulders, Arms, and Hands (REACHING KEYBOARD AND MOUSE)
  [-1, 1].forEach((side) => {
    // Shoulder Joint
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), carbonJointMat);
    shoulder.position.set(side * (chestWidth / 2 + 0.14), 3.9, -0.08);
    robot.add(shoulder);

    // Upper Arm (Extending downward & forward to desk surface)
    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 1.1, 12), ceramicMat);
    upperArm.position.set(side * (chestWidth / 2 + 0.22), 3.3, 0.15);
    upperArm.rotation.x = -0.55;
    upperArm.castShadow = true;
    robot.add(upperArm);

    // Elbow Joint
    const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), carbonJointMat);
    elbow.position.set(side * (chestWidth / 2 + 0.22), 2.75, 0.48);
    robot.add(elbow);

    // Forearm (Resting horizontally on desk at y = 2.45)
    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.15, 1.0, 12), ceramicMat);
    forearm.name = side === -1 ? 'left-forearm' : 'right-forearm';
    forearm.position.set(side * 0.55, 2.52, 0.85);
    forearm.rotation.x = -1.55; // Horizontal on desk
    robot.add(forearm);

    // 5-Finger Articulated Hand Resting over Keyboard / Mouse
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.32), carbonJointMat);
    hand.position.set(side * 0.45, 2.54, 1.3);
    robot.add(hand);
  });

  // 7. Seated Legs (Thighs forward, shins down, feet touching floor)
  [-0.42, 0.42].forEach((lx) => {
    const hip = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), carbonJointMat);
    hip.position.set(lx, 1.75, 0.15);
    robot.add(hip);

    // Thigh (Extending forward horizontally under desk)
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.22, 1.25, 12), ceramicMat);
    thigh.rotation.x = Math.PI / 2;
    thigh.position.set(lx, 1.65, 0.75);
    robot.add(thigh);

    // Knee
    const knee = new THREE.Mesh(new THREE.SphereGeometry(0.23, 12, 12), carbonJointMat);
    knee.position.set(lx, 1.65, 1.35);
    robot.add(knee);

    // Shin (Extending straight down to floor)
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.2, 1.5, 12), ceramicMat);
    shin.position.set(lx, 0.85, 1.35);
    robot.add(shin);

    // Foot firmly touching floor at y = 0
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.18, 0.65), carbonJointMat);
    foot.position.set(lx, 0.09, 1.45);
    robot.add(foot);
  });

  return robot;
}

// Presidential ArchViz Suite for Alexis (CEO & Dueño)
function buildAlexisPresidentialArchVizSuite(scene: THREE.Scene) {
  const suite = new THREE.Group();
  suite.position.set(0, 0, -22);

  // Nero Marquina Black Obsidian Dais with Gold Chamfer
  const dais = new THREE.Mesh(
    new THREE.BoxGeometry(24, 0.3, 16),
    new THREE.MeshStandardMaterial({
      map: createPhotorealisticMarbleTexture(true),
      roughness: 0.12,
      metalness: 0.5
    })
  );
  dais.position.y = 0.15;
  dais.receiveShadow = true;
  suite.add(dais);

  // Executive Curved Desk in American Walnut & Titanium
  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(11, 0.32, 4.5),
    new THREE.MeshStandardMaterial({
      color: '#120d08',
      roughness: 0.2,
      metalness: 0.7
    })
  );
  desk.position.set(0, 2.7, 0);
  desk.castShadow = true;
  desk.receiveShadow = true;
  suite.add(desk);

  // Gold Trim
  const goldBand = new THREE.Mesh(
    new THREE.BoxGeometry(11.1, 0.08, 4.6),
    new THREE.MeshStandardMaterial({ color: '#fbbf24', roughness: 0.2, metalness: 0.9 })
  );
  goldBand.position.set(0, 2.82, 0);
  suite.add(goldBand);

  // Dual Curved Panoramic Displays (Shopify War Room)
  const screenMat = new THREE.MeshBasicMaterial({
    map: createDetailedScreenTexture(
      'alexis-ceo',
      'ALEXIS • CEO MASTER COMMAND (SHOPIFY & DROPI PERÚ)',
      [
        'Tienda Oficial: https://8bhsfq-gz.myshopify.com',
        'Dropi Account ID: #132455 [TOKEN VALIDADO]',
        'TikTok Ads Manager ID: 7690026331090059284',
        'Directiva Presidencial: MÁXIMA PRIORIDAD ACTIVA'
      ],
      '#fbbf24',
      'ceo'
    )
  });

  [-1, 1].forEach((side) => {
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 2.6), screenMat);
    screen.position.set(side * 2.8, 4.3, -1.2);
    screen.rotation.y = side * -0.22;
    suite.add(screen);
  });

  // Floating 3D Golden Crown / Master Presidential Seal
  const crownGroup = new THREE.Group();
  crownGroup.name = 'ceo-presidential-crown';
  crownGroup.position.set(0, 7.6, 0);

  const crownMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.9, 1.3, 8),
    new THREE.MeshStandardMaterial({ color: '#fbbf24', roughness: 0.15, metalness: 0.95 })
  );
  crownGroup.add(crownMesh);

  const crownLight = new THREE.PointLight('#f59e0b', 3.0, 30);
  crownGroup.add(crownLight);

  suite.add(crownGroup);

  scene.add(suite);
}

// Animate Subtle Typing & Breathing Behaviors
function animateArchVizRobots(robotMap: Map<string, THREE.Group>, time: number) {
  let idx = 0;
  robotMap.forEach((robot) => {
    idx++;
    const head = robot.getObjectByName('robot-head');
    const leftArm = robot.getObjectByName('left-forearm');
    const rightArm = robot.getObjectByName('right-forearm');

    // Subtle natural head looking across monitor screens
    if (head) {
      head.rotation.y = Math.sin(time * 0.7 + idx * 2) * 0.08;
      head.rotation.x = 0.18 + Math.sin(time * 0.4 + idx) * 0.03;
    }

    // High-speed natural keystrokes
    if (leftArm && rightArm) {
      const typeSpeed = 10 + (idx % 3) * 3;
      leftArm.rotation.x = -1.55 + Math.sin(time * typeSpeed + idx) * 0.02;
      rightArm.rotation.x = -1.55 + Math.cos(time * typeSpeed + idx) * 0.02;
    }
  });
}

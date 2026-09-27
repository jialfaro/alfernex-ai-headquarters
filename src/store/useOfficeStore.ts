import { create } from 'zustand';
import confetti from 'canvas-confetti';
import {
  Agent,
  AgentAction,
  AgentMemoryItem,
  AgentStatus,
  CameraState,
  CEODirective,
  CEOProfile,
  ChatMessage,
  DepartmentId,
  FacingDirection,
  HQMetrics,
  LiveActivity,
  MeetingSession,
  ShopifyMetrics,
  ShopifyOrder,
  SupportedLanguage,
  TaskRecord,
  WorldPoint,
  VoiceSessionData,
  VoiceSessionState,
  VoiceTranscriptItem,
  VoiceToolExecution
} from '../types/office';
import { BrowserRealtimeVoiceProvider } from '../services/voice/BrowserRealtimeVoiceProvider';
import { DEPARTMENTS } from '../data/departments';
import { INITIAL_AGENTS } from '../data/initialAgents';
import { findPath } from '../data/waypoints';
import {
  INITIAL_SHOPIFY_METRICS,
  INITIAL_SHOPIFY_ORDERS,
  SHOPIFY_PRODUCTS,
  SIMULATION_CUSTOMERS
} from '../data/shopifyData';
import { soundFX } from '../components/audio/soundEffects';

interface OfficeStoreState {
  agents: Agent[];
  selectedAgentId: string | null;
  filterDepartment: DepartmentId | 'all';
  filterStatus: AgentStatus | 'all';
  camera: CameraState;
  liveActivities: LiveActivity[];
  chatMessages: Record<string, ChatMessage[]>;
  languagePreference: SupportedLanguage;

  // HQ Telemetry
  hqMetrics: HQMetrics;

  // Meeting & Multi-Agent Collaboration
  activeMeeting: MeetingSession | null;
  isMeetingModalOpen: boolean;

  // Shopify Live Sales State
  shopifyMetrics: ShopifyMetrics;
  shopifyOrders: ShopifyOrder[];
  isShopifyOrdersModalOpen: boolean;

  // CEO & General Management State
  ceoProfile: CEOProfile;
  ceoDirectives: CEODirective[];
  isCeoOfficeModalOpen: boolean;

  // Modal controls
  isCreateAgentModalOpen: boolean;
  isAssignTaskModalOpen: boolean;
  isChatModalOpen: boolean;
  isOfficeViewModalOpen: boolean;
  isIntroFinished: boolean;
  soundEnabled: boolean;
  viewMode: '3d' | '2.5d';
  setViewMode: (mode: '3d' | '2.5d') => void;
  appVersion: 'v1' | 'v2' | 'sim';
  setAppVersion: (v: 'v1' | 'v2' | 'sim') => void;
  activeFloor: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  setActiveFloor: (f: 1 | 2 | 3 | 4 | 5 | 6 | 7) => void;
  selectedRobotDetailId: string | null;
  setSelectedRobotDetailId: (id: string | null) => void;

  // iPhone 15 Pro Max Executive Mode
  isMobileExecutiveView: boolean;
  setIsMobileExecutiveView: (val: boolean) => void;
  mobileTab: 'dashboard' | 'agents' | 'voice' | 'trading' | '3d';
  setMobileTab: (tab: 'dashboard' | 'agents' | 'voice' | 'trading' | '3d') => void;

  // Life Simulation Systems
  simTime: {
    hour: number;
    minute: number;
    day: number;
    speed: 0 | 1 | 2 | 4 | 8;
  };
  simCameraMode: 'overview' | 'follow' | 'office' | 'meeting' | 'command' | 'cutaway';
  simBuildingView: 'cutaway' | 'floor';
  simFollowingAgentId: string | null;
  setSimTimeSpeed: (speed: 0 | 1 | 2 | 4 | 8) => void;
  setSimCameraMode: (mode: 'overview' | 'follow' | 'office' | 'meeting' | 'command' | 'cutaway') => void;
  setSimBuildingView: (view: 'cutaway' | 'floor') => void;
  startFollowingAgent: (agentId: string) => void;
  stopFollowingAgent: () => void;
  triggerRobotCoffeeBreak: (agentId: string) => void;
  triggerRobotCollaboration: (sourceId: string, targetId: string, topic: string) => void;

  // Actions
  selectAgent: (agentId: string | null) => void;
  setFilterDepartment: (dept: DepartmentId | 'all') => void;
  setFilterStatus: (status: AgentStatus | 'all') => void;
  setLanguagePreference: (lang: SupportedLanguage) => void;
  setCamera: (camera: Partial<CameraState>) => void;
  panCamera: (dx: number, dy: number) => void;
  zoomCamera: (delta: number) => void;
  resetCamera: () => void;
  focusDepartment: (deptId: DepartmentId) => void;
  focusAgent: (agentId: string) => void;
  toggleFollowAgent: () => void;

  // CEO Suite Controls
  setCeoOfficeModalOpen: (open: boolean) => void;
  enterCeoOffice: () => void;
  broadcastCeoDirective: (title: string, description: string, priority: 'ALTA' | 'CRÍTICA' | 'MÁXIMA', assignedAgentIds?: string[]) => void;

  // Luxury Office Navigation
  enterAgentOffice: (agentId: string) => void;
  returnToHQ: () => void;

  // Collaboration Meeting
  startCollaborationMeeting: (topic: string, agentIds?: string[]) => void;
  endCollaborationMeeting: () => void;
  setMeetingModalOpen: (open: boolean) => void;

  // Memory & Natural Conversation
  addAgentMemory: (agentId: string, item: Omit<AgentMemoryItem, 'id' | 'timestamp'>) => void;
  sendChatMessage: (agentId: string, text: string) => Promise<void>;

  // Shopify Sales Action
  triggerShopifySale: () => void;
  setShopifyOrdersModalOpen: (open: boolean) => void;

  // Agent Operations
  assignTaskToAgent: (agentId: string, title: string, description: string, priority: TaskRecord['priority']) => void;
  createAgent: (newAgent: Partial<Agent>) => void;
  recallAgentToDesk: (agentId: string) => void;
  sendAgentToRoom: (agentId: string, deptId: DepartmentId) => void;

  // Real-time animation tick
  tickSimulation: (deltaTime: number) => void;

  // Modal setters
  setCreateAgentModalOpen: (open: boolean) => void;
  setAssignTaskModalOpen: (open: boolean) => void;
  setChatModalOpen: (open: boolean) => void;
  setOfficeViewModalOpen: (open: boolean) => void;
  setIntroFinished: (finished: boolean) => void;
  toggleSound: () => void;

  // Real-Time Voice Conversation Systems
  voiceSession: VoiceSessionData;
  startVoiceSession: (agentId?: string) => Promise<void>;
  endVoiceSession: () => void;
  setVoiceMuted: (muted: boolean) => void;
  setVoiceVolume: (volume: number) => void;
  interruptVoice: () => void;
  sendVoiceText: (text: string) => Promise<void>;
  addVoiceTranscript: (item: VoiceTranscriptItem) => void;
  setVoiceToolExecution: (tool: VoiceToolExecution | null) => void;
  setVoiceState: (state: VoiceSessionState) => void;
  setVoiceAudioLevels: (userVol: number, agentVol: number) => void;
  addVoiceColleague: (agentId: string) => void;
}

// Calculate 8-way facing direction from velocity vector
function calculateFacing(dx: number, dy: number): FacingDirection {
  const angle = Math.atan2(dy, dx);
  const octant = Math.round((8 * angle) / (2 * Math.PI) + 8) % 8;
  const directions: FacingDirection[] = ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'];
  return directions[octant] || 'S';
}

// Simple language detector
function detectLanguage(text: string): 'es' | 'en' {
  const spanishIndicators = /\b(hola|quiero|necesito|campaña|ventas|producto|precio|como|cuanto|gracias|bueno|ayuda|equipo|peru|soles|envio|contra|entrega|por|que|favor|buenas)\b/i;
  const englishIndicators = /\b(hello|hi|want|need|campaign|sales|product|price|how|much|thanks|good|help|team|dollar|delivery|for|what|please|morning|evening|increase)\b/i;

  if (spanishIndicators.test(text)) return 'es';
  if (englishIndicators.test(text)) return 'en';
  return 'es'; // default to Spanish
}

let activeVoiceProvider: BrowserRealtimeVoiceProvider | null = null;

export const INITIAL_CEO_PROFILE: CEOProfile = {
  name: 'Alexis',
  title: 'Gerente General & Dueño',
  role: 'Fundador & Chief Executive Officer (CEO)',
  company: 'ALFERNEX HOLDINGS',
  avatarIcon: '👑',
  motto: 'Excelencia, Ejecución y Rentabilidad Absoluta.',
  status: 'IN_OFFICE'
};

export const INITIAL_CEO_DIRECTIVES: CEODirective[] = [
  {
    id: 'DIR-01',
    title: 'Generar Ventas Reales en Shopify mediante TikTok Ads',
    description: 'Enfocar la pauta en los productos probados con CPA menor a S/. 18 y coordinar confirmaciones inmediatas para despacho en 24h.',
    priority: 'MÁXIMA',
    assignedAgentIds: ['vyra-growth', 'max-developer', 'nex-data'],
    status: 'EN_PROGRESO',
    createdAt: 'Hoy 09:00'
  },
  {
    id: 'DIR-02',
    title: 'Sincronización Logística Total con Dropi Perú (Cuenta 132455)',
    description: 'Asegurar que cada orden contra entrega ingrese sin fricción a Dropi y se despache por Olva Courier o Shalom el mismo día.',
    priority: 'CRÍTICA',
    assignedAgentIds: ['atlas-ops', 'sofia-support', 'eva-sales'],
    status: 'ACTIVA',
    createdAt: 'Hoy 10:15'
  },
  {
    id: 'DIR-03',
    title: 'Protección Antifraude y Filtro de Números Falsos en Contra Entrega',
    description: 'Validar 100% de celulares peruanos por WhatsApp antes de autorizar la salida de almacén para proteger el flete.',
    priority: 'ALTA',
    assignedAgentIds: ['orion-security', 'alex-architect'],
    status: 'ACTIVA',
    createdAt: 'Hoy 11:30'
  }
];

const INITIAL_ACTIVITIES: LiveActivity[] = [
  {
    id: 'act-0',
    agentId: 'vyra-growth',
    agentName: 'VYRA',
    agentColor: '#f43f5e',
    type: 'task_start',
    message: 'Optimizando campaña de adquisición TikTok Ads con gancho de parrilla en 30s',
    timestamp: '1 min ago'
  },
  {
    id: 'act-1',
    agentId: 'max-developer',
    agentName: 'MAX',
    agentColor: '#3b82f6',
    type: 'task_complete',
    message: 'Desplegado botón de Pedido Rápido 1-Click con tiempo de carga móvil de 0.8s',
    timestamp: '2 mins ago'
  },
  {
    id: 'act-2',
    agentId: 'alex-architect',
    agentName: 'ALEX',
    agentColor: '#38bdf8',
    type: 'task_start',
    message: 'Sincronizando webhooks de Shopify con Dropi Perú para despacho con Olva/Shalom',
    timestamp: '3 mins ago'
  },
  {
    id: 'act-3',
    agentId: 'sofia-support',
    agentName: 'SOFIA',
    agentColor: '#10b981',
    type: 'task_complete',
    message: 'Confirmado pedido COD de TurboJet en Surco con Olva Courier (PE-5307542)',
    timestamp: '5 mins ago'
  }
];

export const useOfficeStore = create<OfficeStoreState>((set, get) => ({
  agents: INITIAL_AGENTS,
  selectedAgentId: null,
  filterDepartment: 'all',
  filterStatus: 'all',
  languagePreference: 'auto',
  camera: {
    x: 1200,
    y: 950,
    zoom: 0.85,
    targetX: 1200,
    targetY: 950,
    targetZoom: 0.85,
    followingAgentId: null,
    viewMode: 'hq',
    focusedOfficeAgentId: null
  },
  liveActivities: INITIAL_ACTIVITIES,
  chatMessages: {
    'vyra-growth': [
      {
        id: 'msg-vyra-1',
        sender: 'agent',
        agentId: 'vyra-growth',
        text: '¡Hola! Soy Vyra, tu estratega de crecimiento y marketing. Tenemos las métricas de TikTok Ads y Meta Reels corriendo a 4.8x de ROAS con el público de Lima y provincias. ¿Qué estrategia quieres potenciar hoy?',
        timestamp: '10:00 AM',
        detectedLanguage: 'es'
      }
    ],
    'max-developer': [
      {
        id: 'msg-max-1',
        sender: 'agent',
        agentId: 'max-developer',
        text: 'Max en línea. La tienda virtual en alfernex.myshopify.com está optimizada para celulares con LCP en 0.8 segundos. El checkout rápido de pago contra entrega y el popup de upsell están al 100%.',
        timestamp: '10:02 AM',
        detectedLanguage: 'es'
      }
    ],
    'alex-architect': [
      {
        id: 'msg-alex-1',
        sender: 'agent',
        agentId: 'alex-architect',
        text: 'Saludos. Como arquitecto de soluciones de ALFERNEX, la integración entre Shopify y Dropi Perú mantiene una latencia de 38ms sin pérdida de órdenes. Listo para coordinar nuevas integraciones.',
        timestamp: '10:04 AM',
        detectedLanguage: 'es'
      }
    ],
    'nova-research': [
      {
        id: 'msg-nova-1',
        sender: 'agent',
        agentId: 'nova-research',
        text: 'Nova reportándose. He sintetizado las últimas tendencias de consumo tech en Perú. El TurboJet y el proyector 4K mantienen la mayor intención de búsqueda del trimestre.',
        timestamp: '10:06 AM',
        detectedLanguage: 'es'
      }
    ]
  },

  hqMetrics: {
    agentsOnline: INITIAL_AGENTS.length,
    activeTasks: 24,
    completedToday: 137,
    aiUtilization: 87,
    systemStatus: 'OPERATIONAL'
  },

  activeMeeting: null,
  isMeetingModalOpen: false,

  // CEO & General Management State
  ceoProfile: INITIAL_CEO_PROFILE,
  ceoDirectives: INITIAL_CEO_DIRECTIVES,
  isCeoOfficeModalOpen: false,

  shopifyMetrics: INITIAL_SHOPIFY_METRICS,
  shopifyOrders: INITIAL_SHOPIFY_ORDERS,
  isShopifyOrdersModalOpen: false,

  isCreateAgentModalOpen: false,
  isAssignTaskModalOpen: false,
  isChatModalOpen: false,
  isOfficeViewModalOpen: false,
  isIntroFinished: false,
  soundEnabled: true,
  viewMode: '3d',
  setViewMode: (mode) => set({ viewMode: mode }),
  appVersion: 'sim',
  setAppVersion: (v) => set({ appVersion: v }),
  activeFloor: 2,
  setActiveFloor: (f) => set({ activeFloor: f }),
  selectedRobotDetailId: null,
  setSelectedRobotDetailId: (id) => set({ selectedRobotDetailId: id }),

  // iPhone 15 Pro Max Executive Mode State
  isMobileExecutiveView: false,
  setIsMobileExecutiveView: (val) => set({ isMobileExecutiveView: val }),
  mobileTab: 'dashboard',
  setMobileTab: (tab) => set({ mobileTab: tab }),

  // Real-Time Bidirectional Voice Session Initial State
  voiceSession: {
    isActive: false,
    sessionId: null,
    activeAgentId: null,
    secondaryAgentIds: [],
    state: 'idle',
    isMuted: false,
    volume: 1.0,
    userVolume: 0,
    agentVolume: 0,
    errorMessage: null,
    transcripts: [],
    currentTool: null
  },
  simTime: {
    hour: 9,
    minute: 30,
    day: 24,
    speed: 1
  },
  simCameraMode: 'overview',
  simBuildingView: 'cutaway',
  simFollowingAgentId: null,
  setSimTimeSpeed: (speed) =>
    set((state) => ({ simTime: { ...state.simTime, speed } })),
  setSimCameraMode: (mode) => set({ simCameraMode: mode }),
  setSimBuildingView: (view) => set({ simBuildingView: view }),
  startFollowingAgent: (agentId) =>
    set({ simFollowingAgentId: agentId, simCameraMode: 'follow', selectedAgentId: agentId }),
  stopFollowingAgent: () =>
    set({ simFollowingAgentId: null, simCameraMode: 'overview' }),
  triggerRobotCoffeeBreak: (agentId) => {
    set((state) => ({
      agents: state.agents.map((ag) =>
        ag.id === agentId
          ? {
              ...ag,
              status: 'waiting',
              action: 'resting',
              speechBubble: 'Tomando un espresso doble en el Lounge...',
              speechTimer: 250,
              simStats: {
                energy: 100,
                focus: Math.min(100, (ag.simStats?.focus || 85) + 15),
                mood: 'Recharging',
                locationLabel: 'Sky Lounge & Cafetería',
                currentActivity: 'coffee_break'
              }
            }
          : ag
      )
    }));
  },
  triggerRobotCollaboration: (sourceId, targetId, topic) => {
    set((state) => ({
      agents: state.agents.map((ag) => {
        if (ag.id === sourceId) {
          return {
            ...ag,
            speechBubble: `${topic}`,
            speechTimer: 300,
            simStats: {
              energy: ag.simStats?.energy || 90,
              focus: ag.simStats?.focus || 90,
              mood: 'Collaborative',
              locationLabel: 'Colaboración Inter-Agente',
              currentActivity: 'conversing',
              interlocutorId: targetId
            }
          };
        }
        if (ag.id === targetId) {
          return {
            ...ag,
            speechBubble: `¡Entendido! Coordinando...`,
            speechTimer: 300,
            simStats: {
              energy: ag.simStats?.energy || 90,
              focus: ag.simStats?.focus || 90,
              mood: 'Collaborative',
              locationLabel: 'Colaboración Inter-Agente',
              currentActivity: 'conversing',
              interlocutorId: sourceId
            }
          };
        }
        return ag;
      })
    }));
  },

  selectAgent: (agentId) => {
    set((state) => ({
      selectedAgentId: agentId,
      camera: agentId
        ? {
            ...state.camera,
            followingAgentId: agentId
          }
        : state.camera
    }));
  },

  setFilterDepartment: (dept) => set({ filterDepartment: dept }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setLanguagePreference: (lang) => set({ languagePreference: lang }),

  setCamera: (partial) =>
    set((state) => ({
      camera: { ...state.camera, ...partial }
    })),

  panCamera: (dx, dy) =>
    set((state) => {
      const zoom = state.camera.zoom;
      return {
        camera: {
          ...state.camera,
          x: state.camera.x - dx / zoom,
          y: state.camera.y - dy / zoom,
          targetX: state.camera.targetX - dx / zoom,
          targetY: state.camera.targetY - dy / zoom,
          followingAgentId: null
        }
      };
    }),

  zoomCamera: (delta) =>
    set((state) => {
      const newZoom = Math.min(Math.max(state.camera.targetZoom * delta, 0.4), 1.9);
      return {
        camera: {
          ...state.camera,
          targetZoom: newZoom
        }
      };
    }),

  resetCamera: () =>
    set((state) => ({
      camera: {
        ...state.camera,
        targetX: 1200,
        targetY: 950,
        targetZoom: 0.85,
        followingAgentId: null,
        viewMode: 'hq',
        focusedOfficeAgentId: null
      }
    })),

  focusDepartment: (deptId) => {
    const dept = DEPARTMENTS[deptId];
    if (dept) {
      set((state) => ({
        camera: {
          ...state.camera,
          targetX: dept.center.x,
          targetY: dept.center.y,
          targetZoom: 1.15,
          followingAgentId: null,
          viewMode: 'hq'
        }
      }));
    }
  },

  focusAgent: (agentId) => {
    const agent = get().agents.find((a) => a.id === agentId);
    if (agent) {
      set((state) => ({
        selectedAgentId: agentId,
        camera: {
          ...state.camera,
          targetX: agent.position.x,
          targetY: agent.position.y,
          targetZoom: 1.35,
          followingAgentId: agentId
        }
      }));
    }
  },

  toggleFollowAgent: () =>
    set((state) => {
      const isFollowing = !!state.camera.followingAgentId;
      return {
        camera: {
          ...state.camera,
          followingAgentId: isFollowing ? null : state.selectedAgentId
        }
      };
    }),

  // Luxury Personal Office View Mode
  enterAgentOffice: (agentId) => {
    const agent = get().agents.find((a) => a.id === agentId);
    if (!agent) return;

    soundFX.playSelect(get().soundEnabled);
    set((state) => ({
      selectedAgentId: agentId,
      isOfficeViewModalOpen: true,
      camera: {
        ...state.camera,
        targetX: agent.homeStation.x,
        targetY: agent.homeStation.y,
        targetZoom: 1.45,
        followingAgentId: agentId,
        viewMode: 'office',
        focusedOfficeAgentId: agentId
      }
    }));
  },

  returnToHQ: () => {
    soundFX.playClick(get().soundEnabled);
    set((state) => ({
      isOfficeViewModalOpen: false,
      camera: {
        ...state.camera,
        targetX: 1200,
        targetY: 950,
        targetZoom: 0.85,
        followingAgentId: null,
        viewMode: 'hq',
        focusedOfficeAgentId: null
      }
    }));
  },

  // Collaboration Boardroom Meeting
  startCollaborationMeeting: (topic, agentIds) => {
    const { agents, soundEnabled } = get();
    const participatingIds = agentIds || ['vyra-growth', 'max-developer', 'nex-data', 'eva-sales', 'alex-architect'];
    const meetingDept = DEPARTMENTS.meeting;

    soundFX.playSuccess(soundEnabled);
    if (typeof window !== 'undefined') {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.4 } });
    }

    const meetingSession: MeetingSession = {
      id: `meet-${Date.now()}`,
      title: 'Cross-Functional Strategy Summit',
      topic: topic || 'Scaling Q4 Flash Sales Campaign in Peru',
      isActive: true,
      participatingAgentIds: participatingIds,
      pipeline: [
        { agentId: 'vyra-growth', agentName: 'VYRA', role: 'Marketing', taskTitle: 'Viral Video Hooks & TikTok Ads', status: 'in-progress' },
        { agentId: 'max-developer', agentName: 'MAX', role: 'Engineering', taskTitle: '1-Click COD Drawer & Speed', status: 'pending' },
        { agentId: 'nex-data', agentName: 'NEX', role: 'Analytics', taskTitle: 'Net Margin & ROAS Modeling', status: 'pending' },
        { agentId: 'eva-sales', agentName: 'EVA', role: 'Sales', taskTitle: 'Post-Purchase Upsell Matrix', status: 'pending' }
      ],
      transcript: [
        {
          agentId: 'vyra-growth',
          agentName: 'VYRA',
          text: 'Compañeros, la campaña CBO en TikTok Ads está lista para escalar. Necesitamos asegurar que el checkout móvil cargue instantáneo.',
          timestamp: 'Ahora'
        },
        {
          agentId: 'max-developer',
          agentName: 'MAX',
          text: 'Entendido Vyra. La tasa de carga está en 0.8s. El botón flotante de pedido rápido está testeado y libre de fricción.',
          timestamp: 'Ahora'
        }
      ]
    };

    // Send participating agents physically into the Meeting Room
    const updatedAgents = agents.map((agent, idx) => {
      if (participatingIds.includes(agent.id)) {
        // Compute circular seats around conference table
        const angle = (idx / participatingIds.length) * Math.PI * 2;
        const seatCoords = {
          x: meetingDept.center.x + Math.cos(angle) * 75,
          y: meetingDept.center.y + Math.sin(angle) * 45
        };
        const path = findPath(agent.position, seatCoords);
        return {
          ...agent,
          targetPosition: seatCoords,
          path,
          action: 'meeting' as AgentAction,
          status: 'in-meeting' as AgentStatus,
          speechBubble: 'Entrando a la sala de estrategia...',
          speechTimer: 240
        };
      }
      return agent;
    });

    const newActivity: LiveActivity = {
      id: `act-meet-${Date.now()}`,
      agentId: 'vyra-growth',
      agentName: 'BOARDROOM',
      agentColor: '#8b5cf6',
      type: 'meeting',
      message: `Reunión de colaboración iniciada: "${meetingSession.topic}" con ${participatingIds.length} agentes`,
      timestamp: 'Ahora'
    };

    set((state) => ({
      agents: updatedAgents,
      activeMeeting: meetingSession,
      isMeetingModalOpen: true,
      liveActivities: [newActivity, ...state.liveActivities.slice(0, 19)],
      camera: {
        ...state.camera,
        targetX: meetingDept.center.x,
        targetY: meetingDept.center.y,
        targetZoom: 1.25,
        followingAgentId: null
      }
    }));
  },

  endCollaborationMeeting: () => {
    const { agents, activeMeeting } = get();
    if (!activeMeeting) return;

    // Send agents back to their personal workstations
    const updatedAgents = agents.map((agent) => {
      if (activeMeeting.participatingAgentIds.includes(agent.id)) {
        const path = findPath(agent.position, agent.homeStation);
        return {
          ...agent,
          targetPosition: agent.homeStation,
          path,
          action: 'walking' as AgentAction,
          status: 'working' as AgentStatus,
          speechBubble: 'Volviendo a mi oficina para ejecutar...',
          speechTimer: 180
        };
      }
      return agent;
    });

    set({
      agents: updatedAgents,
      activeMeeting: null,
      isMeetingModalOpen: false
    });
  },

  setMeetingModalOpen: (open) => set({ isMeetingModalOpen: open }),
  setOfficeViewModalOpen: (open) => set({ isOfficeViewModalOpen: open }),

  // CEO Suite Controls
  setCeoOfficeModalOpen: (open) => set({ isCeoOfficeModalOpen: open }),

  enterCeoOffice: () => {
    const dept = DEPARTMENTS['executive'];
    set((state) => ({
      isCeoOfficeModalOpen: true,
      camera: {
        ...state.camera,
        targetX: dept.center.x,
        targetY: dept.center.y,
        targetZoom: 1.35,
        followingAgentId: null,
        viewMode: 'hq',
        focusedOfficeAgentId: null
      }
    }));
  },

  broadcastCeoDirective: (title, description, priority, assignedAgentIds = []) => {
    const assigned = assignedAgentIds.length > 0 ? assignedAgentIds : ['vyra-growth', 'max-developer', 'atlas-ops', 'nex-data'];
    const newDir: CEODirective = {
      id: `DIR-${Date.now().toString().slice(-4)}`,
      title,
      description,
      priority,
      assignedAgentIds: assigned,
      status: 'EN_PROGRESO',
      createdAt: 'Ahora'
    };

    const newActivity: LiveActivity = {
      id: `act-ceo-${Date.now()}`,
      agentId: 'ceo-alexis',
      agentName: '👑 GERENTE GENERAL (ALEXIS)',
      agentColor: '#fbbf24',
      type: 'alert',
      message: `ORDEN PRIORITARIA DEL DUEÑO: "${title}" [Prioridad: ${priority}]`,
      timestamp: 'Ahora'
    };

    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.5 }
      });
    }

    set((state) => {
      const updatedAgents = state.agents.map((ag) => {
        if (assigned.includes(ag.id)) {
          return {
            ...ag,
            currentTask: `[ORDEN CEO] ${title}`,
            status: 'working' as AgentStatus,
            taskProgress: 15,
            activityLevel: 98,
            speechBubble: '¡Entendido Gerente! Ejecutando de inmediato.',
            speechTimer: 240
          };
        }
        return ag;
      });

      return {
        ceoDirectives: [newDir, ...state.ceoDirectives],
        liveActivities: [newActivity, ...state.liveActivities.slice(0, 24)],
        agents: updatedAgents
      };
    });
  },

  addAgentMemory: (agentId, item) => {
    const newMemory: AgentMemoryItem = {
      id: `mem-${Date.now()}`,
      category: item.category,
      content: item.content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    set((state) => ({
      agents: state.agents.map((a) => {
        if (a.id === agentId) {
          return {
            ...a,
            memoryCount: a.memoryCount + 1,
            memoryItems: [newMemory, ...a.memoryItems]
          };
        }
        return a;
      })
    }));
  },

  // Simulates a real incoming sale on Shopify
  triggerShopifySale: () => {
    const { soundEnabled, shopifyMetrics, shopifyOrders, agents, liveActivities, hqMetrics } = get();

    const customer = SIMULATION_CUSTOMERS[Math.floor(Math.random() * SIMULATION_CUSTOMERS.length)];
    const product = SHOPIFY_PRODUCTS[Math.floor(Math.random() * (SHOPIFY_PRODUCTS.length - 1))];
    const takeUpsell = Math.random() > 0.45;
    const upsellProduct = SHOPIFY_PRODUCTS.find((p) => p.id === 'upsell_case');

    const basePrice = product.sale_price;
    const upsellPrice = takeUpsell && upsellProduct ? upsellProduct.sale_price : 0;
    const finalPrice = basePrice + upsellPrice;

    const baseCost = product.cogs_dropi + product.shipping_avg;
    const upsellCost = takeUpsell && upsellProduct ? upsellProduct.cogs_dropi : 0;
    const netProfit = finalPrice - (baseCost + upsellCost);

    const courier = customer.city.includes('Lima') ? 'Olva Courier' : 'Shalom Empresarial';
    const trackingCode = `PE-${courier.slice(0, 4).toUpperCase()}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newOrder: ShopifyOrder = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      name: customer.name,
      phone: customer.phone,
      city: customer.city,
      address: customer.address,
      bundle: takeUpsell ? `${product.name} + Estuche EVA` : product.name,
      price: basePrice,
      final_price: finalPrice,
      has_upsell: takeUpsell,
      payment: 'Pago Contra Entrega (Yape / Efectivo)',
      status: 'DESPACHADO CON DROPI',
      suggested_courier: courier,
      tracking_number: trackingCode,
      created_at: 'Hace un momento'
    };

    soundFX.playCashSale(soundEnabled);
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 75,
        spread: 85,
        origin: { y: 0.25 },
        colors: ['#38bdf8', '#a855f7', '#10b981', '#f59e0b', '#ec4899']
      });
    }

    const updatedAgents = agents.map((agent) => {
      if (agent.id === 'vyra-growth') {
        return {
          ...agent,
          speechBubble: `¡Conversión TikTok Ads: S/. ${finalPrice} PEN! 🚀`,
          speechTimer: 240,
          tasksCompleted: agent.tasksCompleted + 1
        };
      }
      if (agent.id === 'sofia-support') {
        return {
          ...agent,
          speechBubble: `WhatsApp enviado a ${customer.name.split(' ')[0]} 📲`,
          speechTimer: 240
        };
      }
      if (agent.id === 'atlas-ops') {
        return {
          ...agent,
          speechBubble: `Guía ${courier} ${trackingCode} emitida 📦`,
          speechTimer: 240
        };
      }
      if (agent.id === 'nex-data') {
        return {
          ...agent,
          speechBubble: `+S/. ${netProfit.toFixed(0)} PEN de ganancia neta! 💰`,
          speechTimer: 240
        };
      }
      return agent;
    });

    const newActivity: LiveActivity = {
      id: `act-sale-${Date.now()}`,
      agentId: 'vyra-growth',
      agentName: 'VYRA',
      agentColor: '#f43f5e',
      type: 'task_complete',
      message: `🎉 VENTA SHOPIFY: ${newOrder.bundle} en ${customer.city} (+S/. ${finalPrice} PEN) - ${courier}`,
      timestamp: 'Ahora mismo'
    };

    set({
      shopifyMetrics: {
        total_orders: shopifyMetrics.total_orders + 1,
        confirmed_orders: shopifyMetrics.confirmed_orders + 1,
        dispatched_orders: shopifyMetrics.dispatched_orders + 1,
        gross_revenue_pen: shopifyMetrics.gross_revenue_pen + finalPrice,
        net_profit_pen: shopifyMetrics.net_profit_pen + netProfit,
        upsell_taken_count: shopifyMetrics.upsell_taken_count + (takeUpsell ? 1 : 0)
      },
      hqMetrics: {
        ...hqMetrics,
        completedToday: hqMetrics.completedToday + 1,
        aiUtilization: Math.min(99, hqMetrics.aiUtilization + 1)
      },
      shopifyOrders: [newOrder, ...shopifyOrders],
      agents: updatedAgents,
      liveActivities: [newActivity, ...liveActivities.slice(0, 19)]
    });
  },

  assignTaskToAgent: (agentId, title, description, priority) => {
    const newTask: TaskRecord = {
      id: `task-${Date.now()}`,
      title,
      description,
      priority,
      status: 'in-progress',
      progress: 5,
      assignedAt: 'Just now'
    };

    set((state) => {
      const updatedAgents = state.agents.map((agent) => {
        if (agent.id === agentId) {
          // Send agent physically back to workstation to execute
          const path = findPath(agent.position, agent.homeStation);
          return {
            ...agent,
            targetPosition: agent.homeStation,
            path,
            currentTask: title,
            taskProgress: 5,
            status: 'working' as AgentStatus,
            action: 'typing' as AgentAction,
            activityLevel: Math.min(100, agent.activityLevel + 10),
            runningTasks: agent.runningTasks + 1,
            tasks: [newTask, ...agent.tasks],
            speechBubble: `Ejecutando en mi oficina: "${title.slice(0, 28)}..."`,
            speechTimer: 240
          };
        }
        return agent;
      });

      const targetAgent = updatedAgents.find((a) => a.id === agentId);
      const newActivity: LiveActivity = {
        id: `act-${Date.now()}`,
        agentId,
        agentName: targetAgent?.name || 'Agent',
        agentColor: targetAgent?.color || '#38bdf8',
        type: 'task_start',
        message: `Nueva tarea asignada: "${title}" (${targetAgent?.name})`,
        timestamp: 'Just now'
      };

      return {
        agents: updatedAgents,
        liveActivities: [newActivity, ...state.liveActivities.slice(0, 19)],
        isAssignTaskModalOpen: false
      };
    });
  },

  // Natural Human-like Conversation with Contextual Memory & Dual-Language Auto-Detection
  sendChatMessage: async (agentId, text) => {
    const { languagePreference, agents } = get();
    const detectedLang = languagePreference === 'auto' ? detectLanguage(text) : languagePreference;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      agentId,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      detectedLanguage: detectedLang
    };

    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [agentId]: [...(state.chatMessages[agentId] || []), userMsg]
      }
    }));

    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;

    // Check if the user mentioned a budget or long-term preference to remember
    const budgetMatch = text.match(/(presupuesto|budget|gasto|spend).*?(\$|s\/|soles)?\s?(\d+[\d,.]*)/i);
    if (budgetMatch && budgetMatch[3]) {
      const budgetVal = budgetMatch[3];
      get().addAgentMemory(agentId, {
        category: 'user_preference',
        content: `Presupuesto especificado por el usuario: ${budgetVal} para campañas publicitarias.`
      });
    }

    // Set agent to "thinking" state visually in the HQ
    set((state) => ({
      agents: state.agents.map((a) => (a.id === agentId ? { ...a, status: 'thinking' as AgentStatus } : a))
    }));

    await new Promise((r) => setTimeout(r, 1100 + Math.random() * 800));

    let responseText = '';
    const lower = text.toLowerCase();

    // Check memory context
    const hasBudgetMemory = agent.memoryItems.some((m) => m.content.toLowerCase().includes('presupuesto') || m.content.toLowerCase().includes('budget'));

    if (detectedLang === 'en') {
      // Natural English Response
      if (agent.id === 'vyra-growth') {
        if (lower.includes('campaign') || lower.includes('tiktok') || lower.includes('ideas') || lower.includes('sales')) {
          responseText = hasBudgetMemory
            ? `Taking into account the monthly budget of S/. 2,000 we established, here is our 5-step aggressive TikTok acquisition plan: 1) Deploy 3-second extreme demo hooks (charcoal ignited in 30s), 2) Focus on broad CBO targeting in Lima & high-density coastal cities, 3) Push cash-on-delivery guarantee badges, 4) Trigger our 1-click EVA case upsell to lift AOV by S/. 25, and 5) Whitelist top-performing UGC videos under Spark Ads.`
            : `Absolutely. After evaluating our recent campaigns, here are 3 high-impact angles: 1) The 30-Second BBQ hook for TurboJet, 2) The "Why spend 2,000 on a TV" ceiling cinema hook for CyberBeam, and 3) Clean desk cable-free setup for NovaCharge MagSafe. Our current blended ROAS is tracking at 4.8x.`;
        } else {
          responseText = `Hello! I'm actively monitoring our TikTok & Meta ad sets. Conversion rates are up +18% week-over-week. What marketing priority should we tackle next?`;
        }
      } else if (agent.id === 'max-developer') {
        responseText = `Max here. Codebase is clean, 0 lints, and mobile LCP is clocked at 0.78s on alfernex.myshopify.com. The 1-click cash-on-delivery drawer and upsell modal are verified across iOS Safari and Android Chrome. Ready to ship updates.`;
      } else if (agent.id === 'alex-architect') {
        responseText = `Architecture status nominal. Our Dropi Perú webhook integration is processing incoming orders with a 38ms response time. Events are buffered to ensure zero missed webhooks even during flash sale spikes.`;
      } else if (agent.id === 'nova-research') {
        responseText = `From a product research standpoint, the compact 130K RPM blower and portable 4K Android projector represent our strongest margins (59.7% and 46.5% respectively). I am synthesizing upcoming Q4 gadget releases.`;
      } else {
        responseText = `Understood. I have logged your request into my neural priority queue and am aligning my operational tasks accordingly.`;
      }
    } else {
      // Natural Spanish Response
      if (agent.id === 'vyra-growth') {
        if (lower.includes('idea') || lower.includes('tiktok') || lower.includes('campaña') || lower.includes('ventas') || lower.includes('aumentar')) {
          responseText = hasBudgetMemory
            ? `Tomando en cuenta el presupuesto de S/. 2,000 que definimos, te propongo esta estrategia de 5 acciones para disparar las ventas en TikTok: 1) Lanzar el hook de 3 segundos del carbón encendido en 30s con pauta CBO de S/. 35/día, 2) Segmentación abierta en Lima y principales provincias, 3) Destacar el sello de "Paga en Casa con Yape o Efectivo", 4) Añadir el upsell post-compra del estuche rígido (+S/. 25) para inflar el ticket promedio, y 5) Activar Spark Ads con testimonios reales de clientes en Surco y Arequipa.`
            : `¡Por supuesto! Analizando nuestras métricas actuales de TikTok Ads, aquí tienes las 3 palancas más rentables: 1) Video de 15s con prueba de potencia extrema (secando auto sin microfibra), 2) Campaña de Proyector 4K con gancho 'Cine en el techo por menos de 200 soles', y 3) Oferta Flash Combo 2x. Nuestro ROAS actual está en 4.8x con CPA menor a S/. 18 soles.`;
        } else {
          responseText = `¡Hola! Estoy analizando el embudo de tráfico de la tienda. El CTR de nuestros anuncios está en 4.91% y la tasa de conversión en móviles subió al 3.82%. ¿En qué campaña o producto nos enfocamos ahora?`;
        }
      } else if (agent.id === 'max-developer') {
        if (lower.includes('tienda') || lower.includes('codigo') || lower.includes('boton') || lower.includes('web') || lower.includes('checkout')) {
          responseText = `El código de la tienda alfernex.myshopify.com está optimizado al milisegundo: el LCP en celulares carga en 0.78s. El botón de 'Pedir Contra Entrega' abre directamente el formulario sin pasar por carritos lentos, lo que redujo el abandono en un 42%.`;
        } else {
          responseText = `Todo el entorno de desarrollo y la plantilla Liquid están limpios. Pruebas automáticas al 100% y conexión directa con los webhooks de Dropi lista para recibir pedidos.`;
        }
      } else if (agent.id === 'alex-architect') {
        if (lower.includes('dropi') || lower.includes('arquitectura') || lower.includes('integracion') || lower.includes('servidor')) {
          responseText = `La arquitectura de integración está operando a la perfección: el formulario de pago contra entrega en Shopify dispara el webhook a nuestro endpoint que valida el teléfono en Perú, verifica el stock en el almacén local de Dropi y crea la remesa para que Olva Courier o Shalom recojan el paquete hoy mismo.`;
        } else {
          responseText = `Sistemas al 100%. La topología distribuida asegura que podamos escalar a más de 3,000 pedidos diarios sin congestión ni duplicados en Dropi Perú.`;
        }
      } else if (agent.id === 'nova-research') {
        responseText = `He revisado las tendencias en TikTok Creative Center y AliExpress. Los gadgets con efecto visual de asombro inmediato (como el TurboJet a 130K RPM y el Proyector 4K en el techo) son los que dominan el mercado peruano con márgenes netos superiores al 60%.`;
      } else if (agent.id === 'sofia-support') {
        responseText = `Todos los pedidos registrados hoy han sido validados por WhatsApp. La confirmación telefónica previa al despacho garantiza que el repartidor encuentre al cliente en su domicilio, logrando un 100% de entregas exitosas.`;
      } else if (agent.id === 'nex-data') {
        responseText = `P&L en vivo: Facturación total S/. ${get().shopifyMetrics.gross_revenue_pen.toFixed(2)} PEN, con un margen neto acumulado de S/. ${get().shopifyMetrics.net_profit_pen.toFixed(2)} PEN (${((get().shopifyMetrics.net_profit_pen / get().shopifyMetrics.gross_revenue_pen) * 100).toFixed(1)}% de rentabilidad neta). Cada combo con estuche nos deja S/. 101 PEN limpios en el bolsillo.`;
      } else if (agent.id === 'eva-sales') {
        responseText = `En el checkout estamos logrando que 1 de cada 3 compradores acepte el 'Estuche Rígido EVA Antigolpes (+S/. 25 PEN)'. Para clientes que dudan en chat, el envío gratis prioritario es el cierre infalible.`;
      } else if (agent.id === 'atlas-ops') {
        responseText = `Almacén central en Callao reporta stock disponible y las guías de Olva Courier y Shalom se están emitiendo automáticamente en cuanto el cliente confirma por WhatsApp. Cero demoras logísticas.`;
      } else if (agent.id === 'orion-security') {
        responseText = `Firewall activo. Filtro regex antifraude (+51 9XXXXXXXX) validando cada teléfono para impedir carritos bot y pedidos de broma. Integridad de webhooks con firma HMAC SHA-256 verificada.`;
      } else if (agent.id === 'mia-creative') {
        responseText = `He renderizado nuevas tomas en 4K del TurboJet con texturas en titanio negro y reflejos de agua en cámara lenta. Los creativos visuales para TikTok y Meta están listos en el CDN.`;
      } else {
        responseText = `Comprendido. Mi prioridad absoluta es optimizar nuestro rendimiento y acelerar el crecimiento de ALFERNEX.`;
      }
    }

    const agentMsg: ChatMessage = {
      id: `agt-${Date.now()}`,
      sender: 'agent',
      agentId,
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      detectedLanguage: detectedLang
    };

    // Return agent to working status
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [agentId]: [...(state.chatMessages[agentId] || []), agentMsg]
      },
      agents: state.agents.map((a) => (a.id === agentId ? { ...a, status: 'working' as AgentStatus } : a))
    }));
  },

  createAgent: (agentData) => {
    const id = `agent-${agentData.name?.toLowerCase().replace(/\s+/g, '-') || Date.now()}`;
    const deptId = (agentData.department as DepartmentId) || 'development';
    const dept = DEPARTMENTS[deptId] || DEPARTMENTS.development;

    const newAgent: Agent = {
      id,
      name: agentData.name || 'AI Executive',
      role: agentData.role || 'Autonomous Specialist',
      department: deptId,
      avatarSeed: id,
      color: agentData.color || dept.color,
      secondaryColor: dept.neonBorder,
      personality: agentData.personality || 'Proactivo, analítico y enfocado en la misión corporativa.',
      communicationStyle: 'Profesional, ejecutivo, directo y orientado a objetivos.',
      specialty: agentData.specialty || 'Optimización de procesos autónomos de ALFERNEX',
      model: agentData.model || 'Claude 3.7 Sonnet',
      modelProvider: 'anthropic',
      tools: agentData.tools || ['API Connect', 'Analytics', 'Terminal'],
      skills: agentData.skills || ['Autonomous Reasoning', 'Workflow Optimization'],
      permissions: ['general_operations', 'analytics_read'],
      status: 'online',
      activityLevel: 100,
      currentTask: 'Sincronizando estado neural con la sede ALFERNEX HQ',
      taskProgress: 10,
      tasksToday: 1,
      tasksCompleted: 0,
      runningTasks: 1,
      waitingTasks: 0,
      lastActivity: 'Just now',
      memoryCount: 120,
      memoryItems: [
        {
          id: `mem-init-${Date.now()}`,
          category: 'system_knowledge',
          content: 'Asignado a la sede central de ALFERNEX AI Headquarters.',
          timestamp: 'Ahora'
        }
      ],
      officeDetails: {
        suiteName: `${dept.shortName} Executive Suite 505`,
        deskStyle: 'executive_marble',
        decorItems: ['Escritorio de titanio pulido', 'Monitor holográfico panorámico', 'Planta purificadora de ambiente'],
        hologramDisplays: [
          { title: 'Status', type: 'metrics', value: 'ONLINE', subtext: 'Neural mesh linked', badge: 'ACTIVE' },
          { title: 'Task Queue', type: 'logs', value: '1 Ready', subtext: 'Onboarding directive', badge: 'PENDING' }
        ],
        wallColor: dept.color,
        panoramicView: 'High-Altitude Metropolis Skyline'
      },
      position: { x: dept.center.x, y: dept.center.y },
      targetPosition: { x: dept.center.x, y: dept.center.y },
      path: [],
      homeStation: { x: dept.center.x + (Math.random() * 40 - 20), y: dept.center.y + (Math.random() * 40 - 20) },
      facing: 'S',
      action: 'sitting',
      actionTimer: 0,
      walkCycle: 0,
      speechBubble: '¡Reportándome al cuartel general de ALFERNEX!',
      speechTimer: 240,
      tasks: [
        {
          id: `task-init-${Date.now()}`,
          title: 'Inicialización de estación de trabajo',
          description: 'Conectar permisos y enlazar con la red de agentes de ALFERNEX.',
          priority: 'medium',
          status: 'in-progress',
          progress: 10,
          assignedAt: 'Just now'
        }
      ]
    };

    set((state) => {
      const newActivity: LiveActivity = {
        id: `act-${Date.now()}`,
        agentId: newAgent.id,
        agentName: newAgent.name,
        agentColor: newAgent.color,
        type: 'alert',
        message: `Nuevo agente incorporado a ALFERNEX HQ: ${newAgent.name} (${newAgent.role})`,
        timestamp: 'Just now'
      };

      return {
        agents: [...state.agents, newAgent],
        liveActivities: [newActivity, ...state.liveActivities.slice(0, 19)],
        isCreateAgentModalOpen: false,
        selectedAgentId: newAgent.id
      };
    });
  },

  recallAgentToDesk: (agentId) => {
    set((state) => {
      const updated = state.agents.map((agent) => {
        if (agent.id === agentId) {
          const path = findPath(agent.position, agent.homeStation);
          return {
            ...agent,
            targetPosition: agent.homeStation,
            path,
            action: 'walking' as AgentAction,
            speechBubble: 'Volviendo a mi oficina privada...',
            speechTimer: 180
          };
        }
        return agent;
      });
      return { agents: updated };
    });
  },

  sendAgentToRoom: (agentId, deptId) => {
    const targetDept = DEPARTMENTS[deptId];
    if (!targetDept) return;

    set((state) => {
      const updated = state.agents.map((agent) => {
        if (agent.id === agentId) {
          const targetCoords = {
            x: targetDept.center.x + (Math.random() * 40 - 20),
            y: targetDept.center.y + (Math.random() * 40 - 20)
          };
          const path = findPath(agent.position, targetCoords);
          return {
            ...agent,
            targetPosition: targetCoords,
            path,
            action: 'walking' as AgentAction,
            speechBubble: `Caminando hacia ${targetDept.shortName}...`,
            speechTimer: 180
          };
        }
        return agent;
      });
      return { agents: updated };
    });
  },

  setShopifyOrdersModalOpen: (open) => set({ isShopifyOrdersModalOpen: open }),

  tickSimulation: (deltaTime) => {
    set((state) => {
      let activities = state.liveActivities;
      const speed = 2.2 * (deltaTime / 16);

      const updatedAgents = state.agents.map((agent) => {
        let { position, targetPosition, path, action, walkCycle, facing, speechBubble, speechTimer, taskProgress, status, tasksCompleted } = agent;

        if (speechTimer > 0) {
          speechTimer -= 1;
          if (speechTimer <= 0) speechBubble = null;
        }

        // Progress simulation for working tasks
        if (status === 'working' || status === 'thinking') {
          if (Math.random() < 0.04) {
            taskProgress = Math.min(100, taskProgress + 1);
            if (taskProgress >= 100) {
              taskProgress = 0;
              tasksCompleted += 1;
              const completedTaskTitle = agent.currentTask;
              activities = [
                {
                  id: `act-${Date.now()}-${Math.random()}`,
                  agentId: agent.id,
                  agentName: agent.name,
                  agentColor: agent.color,
                  type: 'task_complete',
                  message: `Completado: "${completedTaskTitle}" (${agent.name})`,
                  timestamp: 'Hace un momento'
                },
                ...activities.slice(0, 19)
              ];
              speechBubble = '¡Objetivo completado! 100%';
              speechTimer = 180;
            }
          }
        }

        // Autonomous Roaming Logic (visiting Lounge, Command Center, or Meeting Room)
        if (path.length === 0 && Math.random() < 0.0014 && status !== 'in-meeting') {
          const destinationRooms: DepartmentId[] = ['lounge', 'command-center', 'meeting', agent.department];
          const chosenDept = destinationRooms[Math.floor(Math.random() * destinationRooms.length)];
          const targetDept = DEPARTMENTS[chosenDept];
          const dest = {
            x: targetDept.center.x + (Math.random() * 50 - 25),
            y: targetDept.center.y + (Math.random() * 50 - 25)
          };
          path = findPath(position, dest);
          action = 'walking';
          if (chosenDept === 'lounge') {
            speechBubble = 'Tomando una pausa en el Cyber Lounge...';
            speechTimer = 180;
          } else if (chosenDept === 'meeting') {
            speechBubble = 'Consultando en sala de estrategia...';
            speechTimer = 180;
          }
        }

        // Path following movement
        if (path.length > 0) {
          const nextWaypoint = path[0];
          const dx = nextWaypoint.x - position.x;
          const dy = nextWaypoint.y - position.y;
          const dist = Math.hypot(dx, dy);

          if (dist < speed) {
            position = { x: nextWaypoint.x, y: nextWaypoint.y };
            path = path.slice(1);
            if (path.length === 0) {
              action = Math.random() > 0.4 ? 'typing' : 'analyzing';
            }
          } else {
            action = 'walking';
            walkCycle = (walkCycle + 0.18) % (Math.PI * 2);
            facing = calculateFacing(dx, dy);
            position = {
              x: position.x + (dx / dist) * speed,
              y: position.y + (dy / dist) * speed
            };
          }
        }

        return {
          ...agent,
          position,
          targetPosition,
          path,
          action,
          walkCycle,
          facing,
          speechBubble,
          speechTimer,
          taskProgress,
          tasksCompleted
        };
      });

      // Life Simulation Time Progression
      let { hour, minute, day, speed: timeSpeed } = state.simTime;
      if (timeSpeed > 0) {
        const increment = (deltaTime / 1000) * 0.4 * timeSpeed;
        minute += increment;
        if (minute >= 60) {
          hour += Math.floor(minute / 60);
          minute = minute % 60;
          if (hour >= 24) {
            day += Math.floor(hour / 24);
            hour = hour % 24;
          }
        }
      }

      // Camera Smooth Interpolation
      let { x, y, zoom, targetX, targetY, targetZoom, followingAgentId } = state.camera;

      if (followingAgentId) {
        const followed = updatedAgents.find((a) => a.id === followingAgentId);
        if (followed) {
          targetX = followed.position.x;
          targetY = followed.position.y;
        }
      }

      const lerpFactor = 0.08;
      x += (targetX - x) * lerpFactor;
      y += (targetY - y) * lerpFactor;
      zoom += (targetZoom - zoom) * lerpFactor;

      return {
        agents: updatedAgents,
        liveActivities: activities,
        simTime: { hour, minute: Math.floor(minute), day, speed: timeSpeed },
        camera: { ...state.camera, x, y, zoom, targetX, targetY, targetZoom }
      };
    });
  },

  setCreateAgentModalOpen: (open) => set({ isCreateAgentModalOpen: open }),
  setAssignTaskModalOpen: (open) => set({ isAssignTaskModalOpen: open }),
  setChatModalOpen: (open) => set({ isChatModalOpen: open }),
  setIntroFinished: (finished) => set({ isIntroFinished: finished }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  // =========================================================================
  // REAL-TIME VOICE SESSION ACTIONS
  // =========================================================================
  startVoiceSession: async (agentId) => {
    const targetId = agentId || get().selectedAgentId || 'vyra-growth';
    get().selectAgent(targetId);

    if (activeVoiceProvider) {
      await activeVoiceProvider.disconnect();
      activeVoiceProvider = null;
    }

    const provider = new BrowserRealtimeVoiceProvider();
    activeVoiceProvider = provider;

    set((state) => ({
      voiceSession: {
        ...state.voiceSession,
        isActive: true,
        sessionId: `vs-${Date.now()}`,
        activeAgentId: targetId,
        state: 'connecting',
        errorMessage: null,
        transcripts: []
      },
      agents: state.agents.map((ag) =>
        ag.id === targetId
          ? {
              ...ag,
              status: 'waiting',
              action: 'talking',
              speechBubble: '🎙 Conectando sesión de voz en vivo...'
            }
          : ag
      )
    }));

    // Subscribe to State Changes
    provider.onStateChange((state) => {
      set((s) => ({
        voiceSession: { ...s.voiceSession, state },
        agents: s.agents.map((ag) => {
          if (ag.id === targetId) {
            const mappedStatus: AgentStatus =
              state === 'thinking' ? 'thinking' : state === 'speaking' ? 'working' : 'waiting';
            return { ...ag, status: mappedStatus };
          }
          return ag;
        })
      }));
    });

    // Subscribe to Transcripts
    provider.onTranscript((t) => {
      set((s) => {
        const existingIdx = s.voiceSession.transcripts.findIndex((item) => item.id === t.id);
        const updatedTranscripts =
          existingIdx >= 0
            ? s.voiceSession.transcripts.map((item, idx) => (idx === existingIdx ? t : item))
            : [...s.voiceSession.transcripts, t];

        const agentChatMsgs = s.chatMessages[targetId] || [];
        const syncedChat = t.isFinal
          ? [
              ...agentChatMsgs,
              {
                id: t.id,
                sender: t.sender,
                agentId: targetId,
                text: t.text,
                timestamp: t.timestamp
              }
            ]
          : agentChatMsgs;

        return {
          voiceSession: {
            ...s.voiceSession,
            transcripts: updatedTranscripts
          },
          chatMessages: {
            ...s.chatMessages,
            [targetId]: syncedChat
          }
        };
      });
    });

    // Subscribe to Audio Volume
    provider.onAudioVolume(({ userVolume, agentVolume }) => {
      set((s) => ({
        voiceSession: {
          ...s.voiceSession,
          userVolume,
          agentVolume
        }
      }));
    });

    // Subscribe to Tool Execution
    provider.onToolExecution((tool) => {
      set((s) => ({
        voiceSession: {
          ...s.voiceSession,
          currentTool: tool
        }
      }));
    });

    // Subscribe to Errors
    provider.onError((errorMessage) => {
      set((s) => ({
        voiceSession: {
          ...s.voiceSession,
          state: 'error',
          errorMessage
        }
      }));
    });

    await provider.connect(targetId, { language: get().languagePreference });
  },

  endVoiceSession: () => {
    if (activeVoiceProvider) {
      activeVoiceProvider.disconnect();
      activeVoiceProvider = null;
    }
    set((state) => ({
      voiceSession: {
        ...state.voiceSession,
        isActive: false,
        state: 'idle',
        userVolume: 0,
        agentVolume: 0,
        currentTool: null
      },
      agents: state.agents.map((ag) =>
        ag.id === state.voiceSession.activeAgentId
          ? {
              ...ag,
              status: 'working',
              action: 'working',
              speechBubble: null
            }
          : ag
      )
    }));
  },

  setVoiceMuted: (muted) => {
    activeVoiceProvider?.muteMic(muted);
    set((s) => ({ voiceSession: { ...s.voiceSession, isMuted: muted } }));
  },

  setVoiceVolume: (volume) => {
    activeVoiceProvider?.setVolume(volume);
    set((s) => ({ voiceSession: { ...s.voiceSession, volume } }));
  },

  interruptVoice: () => {
    activeVoiceProvider?.interrupt();
  },

  sendVoiceText: async (text) => {
    if (activeVoiceProvider) {
      await activeVoiceProvider.sendText(text);
    }
  },

  addVoiceTranscript: (item) => {
    set((s) => ({
      voiceSession: {
        ...s.voiceSession,
        transcripts: [...s.voiceSession.transcripts, item]
      }
    }));
  },

  setVoiceToolExecution: (tool) => {
    set((s) => ({
      voiceSession: {
        ...s.voiceSession,
        currentTool: tool
      }
    }));
  },

  setVoiceState: (state) => {
    set((s) => ({
      voiceSession: {
        ...s.voiceSession,
        state
      }
    }));
  },

  setVoiceAudioLevels: (userVolume, agentVolume) => {
    set((s) => ({
      voiceSession: {
        ...s.voiceSession,
        userVolume,
        agentVolume
      }
    }));
  },

  addVoiceColleague: (agentId) => {
    set((s) => ({
      voiceSession: {
        ...s.voiceSession,
        secondaryAgentIds: Array.from(new Set([...s.voiceSession.secondaryAgentIds, agentId]))
      }
    }));
  }
}));

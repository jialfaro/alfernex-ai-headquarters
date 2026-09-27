export type AgentStatus =
  | 'online'
  | 'working'
  | 'thinking'
  | 'waiting'
  | 'in-meeting'
  | 'error'
  | 'offline';

export type DepartmentId =
  | 'executive'
  | 'command-center'
  | 'development'
  | 'marketing'
  | 'sales'
  | 'support'
  | 'research'
  | 'analytics'
  | 'operations'
  | 'meeting'
  | 'creative'
  | 'server-room'
  | 'lounge';

export type AgentAction =
  | 'walking'
  | 'sitting'
  | 'typing'
  | 'analyzing'
  | 'meeting'
  | 'resting'
  | 'celebrating'
  | 'talking'
  | 'working';

export type FacingDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

export type SupportedLanguage = 'auto' | 'es' | 'en';

export type LifeSimMood = 'Focused' | 'Inspired' | 'Collaborative' | 'Recharging' | 'Analytical' | 'Optimizing';

export interface LifeSimStats {
  energy: number; // 0 to 100
  focus: number; // 0 to 100
  mood: LifeSimMood;
  locationLabel: string;
  currentActivity: 'working' | 'coffee_break' | 'conversing' | 'meeting' | 'walking' | 'thinking' | 'celebrating';
  interlocutorId?: string | null;
}

export interface WorldPoint {
  x: number;
  y: number;
}

export interface HologramDisplay {
  title: string;
  type: 'metrics' | 'code' | 'diagram' | 'chart' | 'logs' | 'render';
  value: string;
  subtext?: string;
  badge?: string;
}

export interface OfficeDetails {
  suiteName: string;
  deskStyle: 'executive_marble' | 'dev_dual_pod' | 'creative_glass' | 'research_holo' | 'trading_wall';
  decorItems: string[];
  hologramDisplays: HologramDisplay[];
  wallColor: string;
  panoramicView: string;
}

export interface AgentMemoryItem {
  id: string;
  category: 'short_term' | 'long_term' | 'user_preference' | 'system_knowledge';
  content: string;
  timestamp: string;
}

export interface Department {
  id: DepartmentId;
  name: string;
  tagline: string;
  shortName: string;
  description: string;
  color: string;
  neonBorder: string;
  glowColor: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  center: WorldPoint;
  ambientTheme:
    | 'executive'
    | 'hologram-hub'
    | 'code-matrix'
    | 'quantum-lab'
    | 'campaign-screen'
    | 'creative-canvas'
    | 'data-charts'
    | 'server-racks'
    | 'ops-dispatch'
    | 'sales-funnel'
    | 'support-radar'
    | 'conference-table'
    | 'luxury-lounge';
  icon: string;
}

export interface TaskRecord {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  assignedAt: string;
  completedAt?: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  department: DepartmentId;
  avatarSeed: string;
  color: string;
  secondaryColor: string;
  personality: string;
  communicationStyle: string;
  specialty: string;
  model: string;
  modelProvider: 'openai' | 'anthropic' | 'google' | 'deepseek' | 'custom';
  tools: string[];
  skills: string[];
  permissions: string[];
  status: AgentStatus;
  activityLevel: number;
  currentTask: string;
  taskProgress: number;
  tasksToday: number;
  tasksCompleted: number;
  runningTasks: number;
  waitingTasks: number;
  lastActivity: string;

  // Memory & Knowledge
  memoryCount: number;
  memoryItems: AgentMemoryItem[];

  // Luxury Office Customization
  officeDetails: OfficeDetails;

  // Real-time world state
  position: WorldPoint;
  targetPosition: WorldPoint;
  path: WorldPoint[];
  homeStation: WorldPoint;
  facing: FacingDirection;
  action: AgentAction;
  actionTimer: number;
  walkCycle: number;
  speechBubble: string | null;
  speechTimer: number;

  // Task history
  tasks: TaskRecord[];

  // Life Simulation Stats
  simStats?: LifeSimStats;
}

export interface LiveActivity {
  id: string;
  agentId: string;
  agentName: string;
  agentColor: string;
  type: 'task_start' | 'task_complete' | 'meeting' | 'thinking' | 'alert' | 'agent_move';
  message: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  agentId: string;
  text: string;
  timestamp: string;
  isThinking?: boolean;
  detectedLanguage?: 'es' | 'en';
}

export interface CameraState {
  x: number;
  y: number;
  zoom: number;
  targetX: number;
  targetY: number;
  targetZoom: number;
  followingAgentId: string | null;
  viewMode: 'hq' | 'office'; // HQ campus view vs Agent personal luxury office
  focusedOfficeAgentId: string | null;
}

export interface PipelineStage {
  agentId: string;
  agentName: string;
  role: string;
  taskTitle: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface MeetingSession {
  id: string;
  title: string;
  topic: string;
  isActive: boolean;
  participatingAgentIds: string[];
  pipeline: PipelineStage[];
  transcript: Array<{
    agentId: string;
    agentName: string;
    text: string;
    timestamp: string;
  }>;
}

export interface HQMetrics {
  agentsOnline: number;
  activeTasks: number;
  completedToday: number;
  aiUtilization: number;
  systemStatus: 'OPERATIONAL' | 'HIGH_LOAD' | 'MAINTENANCE';
}

export interface ShopifyOrder {
  id: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  bundle: string;
  price: number;
  final_price: number;
  has_upsell: boolean;
  payment: string;
  status: string;
  suggested_courier: string;
  tracking_number: string;
  created_at: string;
}

export interface ShopifyProduct {
  id: string;
  name: string;
  cogs_dropi: number;
  sale_price: number;
  shipping_avg: number;
  margin_pen: number;
  margin_pct: number;
  status: string;
}

export interface ShopifyMetrics {
  total_orders: number;
  confirmed_orders: number;
  dispatched_orders: number;
  gross_revenue_pen: number;
  net_profit_pen: number;
  upsell_taken_count: number;
}

export interface CEODirective {
  id: string;
  title: string;
  description: string;
  priority: 'ALTA' | 'CRÍTICA' | 'MÁXIMA';
  assignedAgentIds: string[];
  status: 'ACTIVA' | 'EN_PROGRESO' | 'CUMPLIDA';
  createdAt: string;
}

export interface CEOProfile {
  name: string;
  title: string;
  role: string;
  company: string;
  avatarIcon: string;
  motto: string;
  status: 'IN_OFFICE' | 'IN_BOARDROOM' | 'INSPECTING_AGENTS';
}

// =========================================================================
// REAL-TIME BIDIRECTIONAL VOICE CONVERSATION TYPES
// =========================================================================

export type VoiceSessionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'ready'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'reconnecting'
  | 'disconnected'
  | 'error';

export interface VoiceTranscriptItem {
  id: string;
  sender: 'user' | 'agent';
  agentId?: string;
  agentName?: string;
  text: string;
  timestamp: string;
  isFinal: boolean;
}

export interface VoiceToolExecution {
  name: string;
  status: 'running' | 'done';
  description?: string;
  result?: string;
}

export interface VoiceSessionData {
  isActive: boolean;
  sessionId: string | null;
  activeAgentId: string | null;
  secondaryAgentIds: string[];
  state: VoiceSessionState;
  isMuted: boolean;
  volume: number;
  userVolume: number;
  agentVolume: number;
  errorMessage: string | null;
  transcripts: VoiceTranscriptItem[];
  currentTool: VoiceToolExecution | null;
}



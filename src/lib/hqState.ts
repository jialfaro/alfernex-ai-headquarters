/**
 * Central In-Memory Headquarter State for Vercel Serverless Sync
 * Synchronizes real-time metrics, directives, activities, and agent states between
 * the Web Headquarters and the iPhone 15 Pro Max Native/PWA App.
 */

export interface HQTelemetry {
  shopify: {
    grossRevenuePEN: number;
    totalOrdersToday: number;
    codSuccessRate: number;
    activeSKUs: number;
    deliveredCount: number;
    pendingCount: number;
  };
  trading: {
    equityUSDC: number;
    todayPnLUSDC: number;
    todayPnLPct: number;
    monthlyReturnPct: number;
    winRatePct: number;
    sharpeRatio: number;
    activePair: string;
    takeProfitPct: number;
    consecutiveWins: number;
  };
}

export interface HQDirective {
  id: string;
  title: string;
  description: string;
  priority: 'MÁXIMA' | 'ALTA' | 'ESTRATÉGICA' | 'NORMAL';
  status: 'EN_PROGRESO' | 'COMPLETADA' | 'PENDIENTE';
  assignedAgentIds: string[];
  timestamp: string;
}

export interface HQActivity {
  id: string;
  agentName: string;
  agentHexColor: string;
  message: string;
  timestamp: string;
}

export interface HQAgentState {
  id: string;
  name: string;
  role: string;
  department: string;
  clearance: string;
  hexColor: string;
  status: 'online' | 'working' | 'thinking' | 'trading' | 'inMeeting';
  speechBubble: string;
  energy: number;
  focus: number;
  mood: string;
  isSpecial?: boolean;
}

// Global serverless cache
let hqTelemetry: HQTelemetry = {
  shopify: {
    grossRevenuePEN: 12450.0,
    totalOrdersToday: 142,
    codSuccessRate: 92.4,
    activeSKUs: 30,
    deliveredCount: 98,
    pendingCount: 44
  },
  trading: {
    equityUSDC: 102450.0,
    todayPnLUSDC: 3420.0,
    todayPnLPct: 3.45,
    monthlyReturnPct: 18.4,
    winRatePct: 68.4,
    sharpeRatio: 2.85,
    activePair: 'ETH-PERP (Hyperliquid)',
    takeProfitPct: 2.0,
    consecutiveWins: 12
  }
};

let hqDirectives: HQDirective[] = [
  {
    id: 'DIR-01',
    title: 'Escalamiento Agresivo en Soles: TikTok Ads + Dropi Express',
    description: 'Enfocar la pauta en TurboJet con CPA menor a S/. 18 y coordinar confirmaciones inmediatas para despacho en 24h.',
    priority: 'MÁXIMA',
    status: 'EN_PROGRESO',
    assignedAgentIds: ['vyra-growth', 'max-developer', 'nex-data'],
    timestamp: 'Hoy, 08:30 AM'
  },
  {
    id: 'DIR-02',
    title: 'Reinversión Algorítmica del 50% de Ganancias en Hyperliquid',
    description: '50% de utilidades de trading retenidas en USDC y 50% compounding automático en ETH y BTC perp con apalancamiento seguro 5x.',
    priority: 'ALTA',
    status: 'EN_PROGRESO',
    assignedAgentIds: ['tradium-trading', 'nex-data'],
    timestamp: 'Hoy, 09:15 AM'
  }
];

let hqActivities: HQActivity[] = [
  {
    id: 'act-1',
    agentName: 'TRADIUM',
    agentHexColor: '#10b981',
    message: 'Take profit ejecutado en ETH-PERP a +2.0%. 50% compounding transferido a USDC.',
    timestamp: '1m ago'
  },
  {
    id: 'act-2',
    agentName: 'VYRA',
    agentHexColor: '#f43f5e',
    message: 'Optimizando pauta de TikTok Ads en Lima con ganchos de 3s para TurboJet.',
    timestamp: '2m ago'
  },
  {
    id: 'act-3',
    agentName: 'MAX',
    agentHexColor: '#3b82f6',
    message: 'Latencia del checkout optimizada a 0.8s en Turbopack con 88% de conversión.',
    timestamp: '3m ago'
  },
  {
    id: 'act-4',
    agentName: 'ECHO',
    agentHexColor: '#10b981',
    message: '142 pedidos contra entrega confirmados con Olva Courier y Shalom.',
    timestamp: '5m ago'
  },
  {
    id: 'act-5',
    agentName: 'NEX',
    agentHexColor: '#059669',
    message: 'Margen neto diario proyectado: S/. 3,450 tras deducción de flete.',
    timestamp: '8m ago'
  }
];

let hqAgents: HQAgentState[] = [
  {
    id: 'tradium-trading',
    name: 'TRADIUM',
    role: 'Hyperliquid Quant Trading • Live PnL',
    department: 'Trading & Finanzas',
    clearance: 'NIVEL 5 (ALPHA)',
    hexColor: '#10b981',
    status: 'trading',
    speechBubble: 'ETH-PERP Take Profit ejecutado (+2.0%). Compounding al 50% activo.',
    energy: 98,
    focus: 99,
    mood: 'Hyperliquid Arbitrage ⚡',
    isSpecial: true
  },
  {
    id: 'vyra-growth',
    name: 'VYRA',
    role: 'TikTok Ads & Viral Marketing Manager',
    department: 'Marketing',
    clearance: 'NIVEL 4',
    hexColor: '#f43f5e',
    status: 'working',
    speechBubble: 'Optimizando ganchos de 3s para TurboJet en Lima. CTR subiendo a 4.9%.',
    energy: 92,
    focus: 94,
    mood: 'Viral Creative 🚀'
  },
  {
    id: 'max-developer',
    name: 'MAX',
    role: 'Lead Software & Core Systems Engineer',
    department: 'Tecnología',
    clearance: 'NIVEL 5',
    hexColor: '#3b82f6',
    status: 'working',
    speechBubble: 'Latencia del checkout móvil optimizada a 0.8s en Next.js Turbopack.',
    energy: 94,
    focus: 96,
    mood: 'Building 💻'
  },
  {
    id: 'echo-sales',
    name: 'ECHO',
    role: 'Dropi Perú Sales & Logistics Dispatcher',
    department: 'Ventas',
    clearance: 'NIVEL 4',
    hexColor: '#10b981',
    status: 'working',
    speechBubble: '142 pedidos confirmados contra entrega con Olva Courier.',
    energy: 90,
    focus: 91,
    mood: 'Sales Closer 🎯'
  },
  {
    id: 'sol-support',
    name: 'SOL',
    role: 'WhatsApp AI CRM & Customer Support',
    department: 'Atención al Cliente',
    clearance: 'NIVEL 3',
    hexColor: '#eab308',
    status: 'online',
    speechBubble: '28 chats activos en WhatsApp. Tiempo de respuesta medio: 1.2 segundos.',
    energy: 95,
    focus: 89,
    mood: 'Friendly 😊'
  },
  {
    id: 'atlas-ops',
    name: 'ATLAS',
    role: 'Supply Chain & Fulfillment Supervisor',
    department: 'Operaciones',
    clearance: 'NIVEL 4',
    hexColor: '#f97316',
    status: 'working',
    speechBubble: 'Stock en almacén de Lima: 850 unidades de TurboJet listas para despacho.',
    energy: 88,
    focus: 95,
    mood: 'Logistics Master 📦'
  },
  {
    id: 'alex-architect',
    name: 'ALEX',
    role: 'Cloud & Microservices Architect',
    department: 'Infraestructura',
    clearance: 'NIVEL 5',
    hexColor: '#06b6d4',
    status: 'working',
    speechBubble: 'Topología C4 en Kubernetes sincronizada con webhooks de Shopify y Dropi.',
    energy: 91,
    focus: 97,
    mood: 'Architecting 🏛️'
  },
  {
    id: 'nova-research',
    name: 'NOVA',
    role: 'LLM Reasoning & Tech Trends Researcher',
    department: 'Investigación',
    clearance: 'NIVEL 4',
    hexColor: '#8b5cf6',
    status: 'thinking',
    speechBubble: 'Analizando papers de arXiv sobre compresión de modelos y benchmarks e-commerce.',
    energy: 87,
    focus: 98,
    mood: 'Deep Thinker 🔬'
  },
  {
    id: 'nex-data',
    name: 'NEX',
    role: 'P&L Financial & Gross Margin Analyst',
    department: 'Finanzas',
    clearance: 'NIVEL 5',
    hexColor: '#059669',
    status: 'working',
    speechBubble: 'Margen neto promedio en Soles: 54.2% tras flete Dropi y costo de producto.',
    energy: 93,
    focus: 94,
    mood: 'Audited 📊'
  },
  {
    id: 'maya-creative',
    name: 'MAYA',
    role: '3D Blender & Viral Visual Content Creator',
    department: 'Creativo',
    clearance: 'NIVEL 3',
    hexColor: '#ec4899',
    status: 'working',
    speechBubble: '8 videos verticales en 4K listos para pauta publicitaria en TikTok e Instagram.',
    energy: 90,
    focus: 92,
    mood: 'Artistic 🎨'
  },
  {
    id: 'cipher-security',
    name: 'CIPHER',
    role: 'Zero Trust Firewall & Cybersecurity Lead',
    department: 'Seguridad',
    clearance: 'NIVEL 5 (DEFCON 1)',
    hexColor: '#6366f1',
    status: 'online',
    speechBubble: 'Bóveda cuántica y cortafuegos en tasa de 10 Gbps. 0 amenazas detectadas.',
    energy: 99,
    focus: 100,
    mood: 'Shield Active 🛡️'
  }
];

export function getFullHQState() {
  return {
    success: true,
    serverTime: new Date().toISOString(),
    telemetry: hqTelemetry,
    directives: hqDirectives,
    liveActivities: hqActivities,
    agents: hqAgents
  };
}

export function broadcastNewDirective(data: {
  title: string;
  description: string;
  priority?: 'MÁXIMA' | 'ALTA' | 'ESTRATÉGICA' | 'NORMAL';
  assignedAgentIds?: string[];
}) {
  const newDir: HQDirective = {
    id: `DIR-${Date.now()}`,
    title: data.title,
    description: data.description || 'Orden presidencial emitida desde iPhone 15 Pro Max',
    priority: data.priority || 'MÁXIMA',
    status: 'EN_PROGRESO',
    assignedAgentIds: data.assignedAgentIds || ['vyra-growth', 'tradium-trading', 'nex-data'],
    timestamp: 'Ahora'
  };

  hqDirectives.unshift(newDir);

  const act: HQActivity = {
    id: `act-${Date.now()}`,
    agentName: 'ALEXIS (CEO)',
    agentHexColor: '#f59e0b',
    message: `ORDEN PRESIDENCIAL: ${data.title}`,
    timestamp: 'Ahora'
  };
  hqActivities.unshift(act);

  return { success: true, directive: newDir, activities: hqActivities };
}

export function processHQChat(agentId: string, message: string) {
  const agent = hqAgents.find((a) => a.id === agentId) || hqAgents[0];
  const q = message.toLowerCase();

  let reply = `${agent.name} a tus órdenes, Alexis. He recibido tu mensaje: "${message}". Procedo a ejecutarlo con máxima prioridad.`;

  if (agentId === 'tradium-trading') {
    if (q.includes('pnl') || q.includes('balance') || q.includes('ganancia') || q.includes('cartera')) {
      reply = `Alexis, el balance de trading en Hyperliquid está en $102,450 USDC con un PnL positivo hoy de +$3,420 (+3.45%). Las posiciones en ETH-PERP y SOL están protegidas con take-profit activo.`;
    } else if (q.includes('compounding') || q.includes('50%') || q.includes('reinversion')) {
      reply = `Regla de compounding activa al 50%: la mitad de las ganancias se bloquea en la tesorería de USDC y la otra mitad se reinvierte automáticamente en el book de órdenes.`;
    } else {
      reply = `TRADIUM reportando en tiempo real desde Hyperliquid. Algoritmos de arbitraje operando con $102,450 USDC en balance. ¿Qué activo revisamos?`;
    }
  } else if (agentId === 'vyra-growth') {
    if (q.includes('10,000') || q.includes('escalar') || q.includes('meta')) {
      reply = `Para alcanzar S/. 10,000 al día en Shopify, estamos activando 5 nuevos ad sets en TikTok Ads con CBO a S/. 200 cada uno y creativos de 3s para Lima y provincias.`;
    } else if (q.includes('cpa') || q.includes('roas')) {
      reply = `CPA actual en TikTok Ads Perú: S/. 14.80 por pedido confirmado. El ROAS promedio se mantiene en 4.2x.`;
    } else {
      reply = `VYRA en línea. La pauta de TikTok Ads para TurboJet está convirtiendo a alta velocidad en Lima. ¿Subimos presupuesto de campaña?`;
    }
  } else if (agentId === 'echo-sales') {
    reply = `Tenemos 142 pedidos contra entrega confirmados hoy en Dropi Perú. 98 en ruta con Olva Courier y 44 para agencias de provincias con Shalom.`;
  } else if (agentId === 'nex-data') {
    reply = `Ganancia neta proyectada de hoy: S/. 3,450 Soles netos libres de flete y producto. El margen neto corporativo es del 54.2%.`;
  }

  // Update agent bubble
  agent.speechBubble = reply.length > 80 ? reply.slice(0, 77) + '...' : reply;

  return {
    success: true,
    agentId,
    agentName: agent.name,
    reply,
    timestamp: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
  };
}

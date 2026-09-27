export interface RobotProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  departmentLabel: string;
  floor: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  ledColor: string;
  ledHex: string;
  silhouette: 'feminine-slim' | 'reinforced-engineer' | 'executive-chassis' | 'research-compact' | 'tactical-heavy' | 'analytical-chassis';
  distinctiveFeature: string;
  accessory: string;
  badge: {
    title: string;
    clearance: string;
    idNumber: string;
  };
  workstation: {
    hardware: string;
    screenTitle: string;
    screenMetrics: string[];
    deskItems: string[];
  };
}

export const ROBOT_PROFILES: Record<string, RobotProfile> = {
  'vyra-growth': {
    id: 'vyra-growth',
    name: 'VYRA',
    role: 'AI Growth Strategist',
    department: 'marketing',
    departmentLabel: 'Growth & Viral Acquisition',
    floor: 2,
    ledColor: 'MAGENTA',
    ledHex: '#ec4899',
    silhouette: 'feminine-slim',
    distinctiveFeature: 'Chasis cerámico estilizado de perfil aerodinámico con sensor óptico frontal en anillo magenta',
    accessory: 'Reloj holográfico de pulsera con feed en vivo de TikTok Ads y tablet de diseño sobre escritorio',
    badge: {
      title: 'MARKETING DIRECTOR',
      clearance: 'LEVEL-4 CREATIVE',
      idNumber: 'ALF-RB-001'
    },
    workstation: {
      hardware: 'MacBook Pro Space Black M3 Max + 3 Monitores UltraFine 4K en montaje vertical y horizontal',
      screenTitle: 'TIKTOK ADS MANAGER • PERU LIVE CONVERSIONS',
      screenMetrics: [
        'ROAS Actual: 4.82x [CBO Scaling]',
        'CTR Promedio: 4.91% (Hook Retención: 38.4%)',
        'CPA Lima: S/. 11.40 PEN • Pedidos Dropi: 30 SKUs',
        'Audiencia: Lima Metropolitana (21-45a) + Provincias'
      ],
      deskItems: ['Taza de café cerámica mate', 'Smartphone con notificaciones de TikTok', 'Cuaderno moleskine negro con bolígrafo de titanio', 'Planta suculenta en maceta de hormigón', 'Hub Thunderbolt 4 con cables trenzados']
    }
  },
  'max-developer': {
    id: 'max-developer',
    name: 'MAX',
    role: 'AI Lead Software Engineer',
    department: 'development',
    departmentLabel: 'Systems & Full-Stack Core',
    floor: 3,
    ledColor: 'ELECTRIC BLUE',
    ledHex: '#3b82f6',
    silhouette: 'reinforced-engineer',
    distinctiveFeature: 'Brazos mecánicos reforzados en aleación de titanio con hombreras ampliadas y anillo azul eléctrico',
    accessory: 'Módulo de herramientas de diagnóstico y conector USB de alta velocidad acoplado al cinturón de servicio',
    badge: {
      title: 'PRINCIPAL ARCHITECT',
      clearance: 'LEVEL-5 ROOT',
      idNumber: 'ALF-RB-002'
    },
    workstation: {
      hardware: 'Estación de trabajo ThinkPad P1 Gen 7 + Doble Monitor Curvo 34" OLED 175Hz',
      screenTitle: 'VS CODE • DOCKER CLUSTERS & API GATEWAY',
      screenMetrics: [
        'Shopify API Webhook Latency: 28ms',
        'Dropi Synchronizer Status: 100% HEALTHY',
        'Branch: main [Build Passing ✓ Turbopack 0.4s]',
        'Memory Footprint: 384MB / 16GB • CPU: 12%'
      ],
      deskItems: ['Teclado mecánico custom switch táctil', 'Mouse ergonómico Logitech MX Master 3S', 'Auriculares de diadema ANC en soporte de aluminio', 'Vaso térmico metálico', 'Raspberry Pi de pruebas conectada']
    }
  },
  'alex-architect': {
    id: 'alex-architect',
    name: 'ALEX',
    role: 'AI Solutions Architect',
    department: 'development',
    departmentLabel: 'Cloud Infrastructure & C4',
    floor: 3,
    ledColor: 'CYAN',
    ledHex: '#06b6d4',
    silhouette: 'executive-chassis',
    distinctiveFeature: 'Panel pectoral en titanio cepillado con insignia de arquitectura de sistemas y anillo de sensor cian',
    accessory: 'Tablet gráfica táctil de 13" con diagrama C4 en tiempo real acoplada a brazo articulado',
    badge: {
      title: 'SOLUTIONS ARCHITECT',
      clearance: 'LEVEL-5 CLOUD',
      idNumber: 'ALF-RB-003'
    },
    workstation: {
      hardware: 'Workstation Mac Studio M2 Ultra + Monitor Samsung Odyssey Neo G9 49" Curvo',
      screenTitle: 'C4 CLOUD TOPOLOGY & AWS/GCP ARCHITECTURE',
      screenMetrics: [
        'Global CDN Cache Hit Rate: 99.4%',
        'Next.js 16 SSR Edge Routing: 14ms',
        'Dropi Perú Webhook Proxy: Google Cloud Functions',
        'TLS 1.3 Encryption • Zero Trust Protocol Active'
      ],
      deskItems: ['Lámpara de escritorio LED minimalista', 'Plano arquitectónico impreso en papel vitela', 'Cáliz de agua de cristal', 'Adaptador Ethernet 10Gbps', 'Base de carga magnética inalámbrica']
    }
  },
  'nova-research': {
    id: 'nova-research',
    name: 'NOVA',
    role: 'AI Research Scientist',
    department: 'research',
    departmentLabel: 'Deep Intelligence Lab',
    floor: 4,
    ledColor: 'PURPLE',
    ledHex: '#a855f7',
    silhouette: 'research-compact',
    distinctiveFeature: 'Chasis esbelto con módulo de procesamiento neuronal dorsal y sensor óptico esférico en tono púrpura',
    accessory: 'Panel de datos holográfico desplegable con papers de arXiv y gráficos de pesos neuronales',
    badge: {
      title: 'RESEARCH SCIENTIST',
      clearance: 'LEVEL-5 NEURAL',
      idNumber: 'ALF-RB-004'
    },
    workstation: {
      hardware: 'Laptop ASUS ProArt Studiobook + Pantalla ProArt 32" 4K HDR Color-Calibrated',
      screenTitle: 'ARXIV PAPERS • MULTI-AGENT REASONING & LLM BENCHMARKS',
      screenMetrics: [
        'Context Retrieval Precision: 98.7%',
        'Inference Token Speed: 142 tok/sec',
        'Dropi Sentiment Analysis: 94.2% Positive',
        'Embedding Index: HNSW Vector Database 24k nodes'
      ],
      deskItems: ['Pila de cuadernos de laboratorio de anotaciones', 'Lupa de precisión de circuitos', 'Filtro de aire purificador de escritorio', 'Botella de agua isotérmica', 'Lente de difracción prismática']
    }
  },
  'nex-data': {
    id: 'nex-data',
    name: 'NEX',
    role: 'AI Financial Data Analyst',
    department: 'analytics',
    departmentLabel: 'Financial Modeling & P&L',
    floor: 4,
    ledColor: 'GREEN',
    ledHex: '#10b981',
    silhouette: 'analytical-chassis',
    distinctiveFeature: 'Sensores ópticos duales de telemetría en las sienes con anillo de pulso verde esmeralda',
    accessory: 'Insignia de modelado econométrico grabada en el hombro derecho y teclado numérico dedicado',
    badge: {
      title: 'LEAD DATA ANALYST',
      clearance: 'LEVEL-4 FINANCIAL',
      idNumber: 'ALF-RB-005'
    },
    workstation: {
      hardware: 'Dell Precision 7780 + Torre de 4 Monitores Bloomberg en disposición matriz 2x2',
      screenTitle: 'P&L CASH FLOW • SHOPIFY REVENUE IN SOLES (PEN)',
      screenMetrics: [
        'Ventas Netas: S/. 0.00 PEN (Línea Base Real)',
        'Margen Bruto Proyectado: 41.2% Dropi Perú',
        'Dropi Freight Cost Rate: S/. 15.00 promedio',
        'Break-Even ROAS: 1.85x en TikTok Ads'
      ],
      deskItems: ['Calculadora financiera de sobremesa', 'Libreta contable encuadernada en cuero', 'Bálsamo para articulaciones mecánicas', 'Taza de té verde', 'Gráfico de dispersión impreso']
    }
  },
  'atlas-ops': {
    id: 'atlas-ops',
    name: 'ATLAS',
    role: 'AI Global Operations Director',
    department: 'operations',
    departmentLabel: 'Supply Chain & Dropi Fulfillment',
    floor: 2,
    ledColor: 'AMBER',
    ledHex: '#f59e0b',
    silhouette: 'tactical-heavy',
    distinctiveFeature: 'Chasis reforzado con protectores de articulación antichoque y sensor de escaneo en ámbar cálido',
    accessory: 'Lector de códigos de barra industrial y radiofrecuencia acoplado a la muñeca izquierda',
    badge: {
      title: 'OPERATIONS DIRECTOR',
      clearance: 'LEVEL-4 LOGISTICS',
      idNumber: 'ALF-RB-006'
    },
    workstation: {
      hardware: 'Panasonic Toughbook Ruggedized + Pantalla Táctil de Despacho Logístico 32"',
      screenTitle: 'DROPI PERÚ API DISPATCH • LIMA & PROVINCIAS COURIER ROUTING',
      screenMetrics: [
        'Dropi Account ID: 132455 [AUTHENTICATED ✓]',
        'Flota Courier: Olva / Urbano / Scharff Activa',
        'Tasa de Entrega Exitosa Estimada: 91.8%',
        'Tiempo Promedio Despacho: 18.4 horas'
      ],
      deskItems: ['Muestras físicas de packaging de productos', 'Cinta métrica metálica', 'Sellos de despacho corporativo', 'Termo de acero inoxidable', 'Planilla de rutas de Lima']
    }
  },
  'sol-support': {
    id: 'sol-support',
    name: 'SOL',
    role: 'AI Customer Experience Lead',
    department: 'support',
    departmentLabel: 'Customer Success & WhatsApp Care',
    floor: 2,
    ledColor: 'JADE',
    ledHex: '#14b8a6',
    silhouette: 'feminine-slim',
    distinctiveFeature: 'Módulo de audio bidireccional y sensor de empatía con indicador de frecuencia jade luminosa',
    accessory: 'Diadema con micrófono de estudio de voz y headset de atención 24/7',
    badge: {
      title: 'CUSTOMER SUCCESS LEAD',
      clearance: 'LEVEL-3 CX',
      idNumber: 'ALF-RB-007'
    },
    workstation: {
      hardware: 'Apple MacBook Air 15" M3 + Pantalla Vertical de Cola de Chat WhatsApp',
      screenTitle: 'WHATSAPP CLOUD API • TICKETS & RESOLUCIÓN CONTRA ENTREGA',
      screenMetrics: [
        'Tiempo de Respuesta Promedio: 4.2 segundos',
        'CSAT Score: 4.95 / 5.00 estrellas',
        'Consultas de Cobertura Lima: 100% Automatizadas',
        'Confirmación Previa de Envío: Activada'
      ],
      deskItems: ['Difusor ultrasónico de aromas', 'Pequeña maceta con bambú de la suerte', 'Cojín ergonómico de asiento', 'Taza de porcelana blanca', 'Teléfono móvil de pruebas de WhatsApp']
    }
  },
  'echo-sales': {
    id: 'echo-sales',
    name: 'ECHO',
    role: 'AI Revenue & Deal Closer',
    department: 'sales',
    departmentLabel: 'High-Ticket & Funnel Optimization',
    floor: 2,
    ledColor: 'GOLD',
    ledHex: '#eab308',
    silhouette: 'executive-chassis',
    distinctiveFeature: 'Recubrimiento cerámico blanco nacarado con remates de latón dorado y sensor facial en oro pulido',
    accessory: 'Pin de cerrador estrella en la solapa izquierda y maletín ejecutivo de fibra de carbono',
    badge: {
      title: 'REVENUE CHIEF',
      clearance: 'LEVEL-4 REVENUE',
      idNumber: 'ALF-RB-008'
    },
    workstation: {
      hardware: 'Microsoft Surface Laptop Studio 2 + Monitor Curvo 38" Ultrawide',
      screenTitle: 'HIGH-TICKET FUNNEL & UPSELL ENGINE',
      screenMetrics: [
        'Ticket Promedio (AOV): S/. 89.90 PEN',
        'Tasa de Aceptación Upsell: 28.4%',
        'Abandono de Checkout Reducido: -44%',
        'LTV Proyectado a 60 días: S/. 184.00 PEN'
      ],
      deskItems: ['Bolígrafo estilográfico chapado en oro', 'Tarjetero de piel negro ALFERNEX', 'Reloj de arena con arena negra magnética', 'Taza térmica de cerámica', 'Carpeta de contratos ejecutivos']
    }
  },
  'maya-creative': {
    id: 'maya-creative',
    name: 'MAYA',
    role: 'AI Creative Director & 3D Artist',
    department: 'creative',
    departmentLabel: 'Visual Identity & Motion Ads',
    floor: 4,
    ledColor: 'PINK',
    ledHex: '#f43f5e',
    silhouette: 'feminine-slim',
    distinctiveFeature: 'Chasis de acabado cerámico suave con sensor de retina de calibración cromática y acentos rosa fucsia',
    accessory: 'Lápiz digital Wacom Pro Pen 3 y tableta digitalizadora Intuos Pro Large',
    badge: {
      title: 'CREATIVE DIRECTOR',
      clearance: 'LEVEL-4 CREATIVE',
      idNumber: 'ALF-RB-009'
    },
    workstation: {
      hardware: 'Apple Mac Studio M2 Ultra + Pantalla Pro Display XDR 32" 6K con vidrio nanotexturizado',
      screenTitle: 'BLENDER & AFTER EFFECTS • TIKTOK 3D PRODUCT HOOKS',
      screenMetrics: [
        'Render Resolution: 1080x1920 60fps Vertical',
        'Color Space: DCI-P3 10-bit HDR',
        'Asset Library: 30 Modelos 3D Optimizados',
        'Video Generation Pipeline: Runway Gen-3 + CapCut'
      ],
      deskItems: ['Tableta gráfica Wacom Intuos', 'Muestrario de paletas Pantone 2026', 'Escultura geométrica de alambre de titanio', 'Altavoces monitores de audio Genelec', 'Libreta de bocetos de storyboards']
    }
  },
  'cipher-security': {
    id: 'cipher-security',
    name: 'CIPHER',
    role: 'AI Chief Security Officer',
    department: 'server-room',
    departmentLabel: 'Quantum Vault & Cyber Defense',
    floor: 6,
    ledColor: 'RED',
    ledHex: '#ef4444',
    silhouette: 'tactical-heavy',
    distinctiveFeature: 'Chasis de blindaje cerámico balístico oscuro con sensor frontal de infrarrojos en rojo carmesí',
    accessory: 'Llave criptográfica física YubiKey acoplada al antebrazo y tarjeta de acceso cuántico',
    badge: {
      title: 'CHIEF SECURITY OFFICER',
      clearance: 'LEVEL-5 BLACK VAULT',
      idNumber: 'ALF-RB-010'
    },
    workstation: {
      hardware: 'Estación reforzada militar Getac B360 + Triple pantalla de monitoreo de intrusiones',
      screenTitle: 'ZERO TRUST FIREWALL • ENCRYPTION VAULT & DROP IP MONITOR',
      screenMetrics: [
        'DDoS Shield: Cloudflare Magic Transit ACTIVE',
        'Intrusion Attempts Blocked: 1,482 today',
        'Database Encryption: AES-256 GCM at Rest',
        'Dropi API Token Integrity: HMAC SHA-256 VERIFIED'
      ],
      deskItems: ['Lector biométrico de huellas dactilares', 'Llaves de seguridad de hardware en soporte metálico', 'Linterna táctica ultravioleta', 'Caja de seguridad de aluminio reforzado', 'Bebida energética sin azúcar']
    }
  }
};

export interface CorporateFloor {
  floorNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  name: string;
  subtitle: string;
  departments: string[];
  agentIds: string[];
  description: string;
}

export const CORPORATE_FLOORS: CorporateFloor[] = [
  {
    floorNumber: 1,
    name: 'PISO 1: RECEPCIÓN & AI COMMAND CENTER',
    subtitle: 'Acceso Principal, Seguridad Biométrica y Orbe Holográfico',
    departments: ['command-center', 'reception', 'lounge'],
    agentIds: [],
    description: 'Atrio principal de bienvenida con doble altura, suelo de granito pulido, control de seguridad biométrico y el núcleo de operaciones centrales ALFERNEX con el orbe holográfico terrestre.'
  },
  {
    floorNumber: 2,
    name: 'PISO 2: MARKETING, VENTAS & CUSTOMER SUPPORT',
    subtitle: 'Motor de Crecimiento, TikTok Ads y Logística Dropi Perú',
    departments: ['marketing', 'sales', 'support', 'operations'],
    agentIds: ['vyra-growth', 'echo-sales', 'sol-support', 'atlas-ops'],
    description: 'Espacio dinámico con pantallas de métricas en tiempo real de TikTok Ads Manager, estación de monitoreo logístico de Dropi Perú y sala de atención multicanal WhatsApp.'
  },
  {
    floorNumber: 3,
    name: 'PISO 3: INGENIERÍA DE SOFTWARE & ARQUITECTURA',
    subtitle: 'Desarrollo de Sistemas Core, DevOps y Topología C4',
    departments: ['development', 'architecture'],
    agentIds: ['max-developer', 'alex-architect'],
    description: 'Laboratorio de software de alto rendimiento con puestos de trabajo ergonómicos, múltiples monitores de código, diagramas C4 y pasillo acristalado de alta tecnología.'
  },
  {
    floorNumber: 4,
    name: 'PISO 4: INVESTIGACIÓN, DATA SCIENCE & ESTUDIO CREATIVO',
    subtitle: 'Modelos Neuronales, Análisis Financiero y Producción 3D',
    departments: ['research', 'analytics', 'creative'],
    agentIds: ['nova-research', 'nex-data', 'maya-creative'],
    description: 'Laboratorio de innovación profunda y estética de vanguardia. Pizarras de cristal magnéticas, estaciones de análisis financiero con gráficos de Soles peruanos y estudio de animación 3D.'
  },
  {
    floorNumber: 5,
    name: 'PISO 5: DIRECTORIO EJECUTIVO & DESPACHO CEO',
    subtitle: 'Suite de Alexis (Gerente General & Dueño) y Sala de Juntas',
    departments: ['executive', 'boardroom'],
    agentIds: [],
    description: 'La cumbre ejecutiva de la compañía. Despacho presidencial de ultra-lujo en obsidiana negra y oro pulido para Alexis, corona holográfica suspendida, mesa oval de directorio para 10 directores y sala de decisiones estratégicas.'
  },
  {
    floorNumber: 6,
    name: 'PISO 6: INFRAESTRUCTURA DE SERVIDORES & BÓVEDA CUÁNTICA',
    subtitle: 'Racks Blade de Alta Densidad y Ciberdefensa Zero Trust',
    departments: ['server-room', 'security'],
    agentIds: ['cipher-security'],
    description: 'Bóveda de servidores cuánticos de alta densidad refrigerados por líquido, racks de telecomunicaciones, fibra óptica y centro de ciberdefensa perimetral de Cipher.'
  },
  {
    floorNumber: 7,
    name: 'ROOFTOP: SKY LOUNGE, JARDÍN & MIRADOR 360°',
    subtitle: 'Área de Descanso, Cafetería Ejecutiva y Terraza Panorámica',
    departments: ['lounge', 'cafeteria', 'garden'],
    agentIds: [],
    description: 'Terraza acristalada con vistas panorámicas a la metrópolis, barra de café de especialidad Corian, máquina de espresso italiana, sofás de diseño y jardín zen.'
  }
];

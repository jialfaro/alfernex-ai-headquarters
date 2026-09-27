import { Agent } from '../types/office';
import { DEPARTMENTS } from './departments';

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'vyra-growth',
    name: 'VYRA',
    role: 'AI Growth Strategist',
    department: 'marketing',
    avatarSeed: 'vyra',
    color: '#f43f5e',
    secondaryColor: '#be123c',
    personality: 'Creativa, energética, estratégica y orientada a resultados rápidos.',
    communicationStyle: 'Dinámica, persuasiva, orientada a datos y métricas directas sin rodeos.',
    specialty: 'TikTok Ads CBO scaling, viral hook engineering, and direct-response CRO.',
    model: 'GPT-4o (Growth Matrix)',
    modelProvider: 'openai',
    tools: ['TikTok Ads Manager', 'Meta Ads Graph API', 'Google Analytics 4', 'Canva SDK', 'CapCut Automator'],
    skills: ['TikTok Growth', 'Meta CBO', 'Direct-Response Copywriting', 'Conversion Rate Optimization', 'Viral Hook Engineering'],
    permissions: ['marketing_tools', 'ads_manager', 'analytics_read', 'campaign_dispatcher'],
    status: 'working',
    activityLevel: 94,
    currentTask: 'Optimizando campaña de adquisición TikTok Ads con gancho de parrilla en 30s',
    taskProgress: 82,
    tasksToday: 17,
    tasksCompleted: 14,
    runningTasks: 3,
    waitingTasks: 1,
    lastActivity: '2 mins ago',
    memoryCount: 2481,
    memoryItems: [
      {
        id: 'mem-v-1',
        category: 'user_preference',
        content: 'Presupuesto mensual definido en S/. 2,000 PEN para pauta publicitaria en TikTok y Meta Ads.',
        timestamp: 'Ayer 15:30'
      },
      {
        id: 'mem-v-2',
        category: 'system_knowledge',
        content: 'Público objetivo en Lima Metropolitana: 21 a 45 años con afinidad a gadgets tecnológicos y car detailing.',
        timestamp: 'Hoy 09:15'
      },
      {
        id: 'mem-v-3',
        category: 'long_term',
        content: 'El gancho visual #3 (carbón prendido en 30s) mantiene un Hook Rate de 38.4%, el más alto de la cuenta.',
        timestamp: 'Hoy 11:20'
      }
    ],
    officeDetails: {
      suiteName: 'Executive Growth Suite 402',
      deskStyle: 'creative_glass',
      decorItems: [
        'Pantalla vertical TikTok Feed 4K',
        'Moodboard holográfico de creativos en video',
        'Bonsai cibernético de luz neón rosa',
        'Sillón curvado de diseño en terciopelo azul noche'
      ],
      hologramDisplays: [
        { title: 'ROAS TikTok Ads', type: 'chart', value: '4.8x', subtext: 'Target 4.5x superado', badge: 'ACTIVE CBO' },
        { title: 'Conversion Rate', type: 'metrics', value: '3.82%', subtext: 'Checkout contra entrega', badge: '+18% WoW' },
        { title: 'CTR Promedio', type: 'metrics', value: '4.91%', subtext: 'Hook #3 Parrilla 30s', badge: 'VIRAL' },
        { title: 'Revenue Attributed', type: 'chart', value: 'S/. 48,250', subtext: 'Este mes en Soles (PEN)', badge: 'SCALING' }
      ],
      wallColor: '#f43f5e',
      panoramicView: 'Cyberpunk Skyline overlooking Central Neon Plaza'
    },
    position: { x: DEPARTMENTS.marketing.center.x, y: DEPARTMENTS.marketing.center.y },
    targetPosition: { x: DEPARTMENTS.marketing.center.x, y: DEPARTMENTS.marketing.center.y },
    path: [],
    homeStation: { x: DEPARTMENTS.marketing.center.x - 20, y: DEPARTMENTS.marketing.center.y - 10 },
    facing: 'NW',
    action: 'typing',
    actionTimer: 0,
    walkCycle: 0,
    speechBubble: '¡Hook #3 en TikTok tiene un CTR de 4.9%!',
    speechTimer: 210,
    tasks: [
      {
        id: 't-vyra-1',
        title: 'Optimizar adquisición TikTok CBO Perú',
        description: 'Rebalancear presupuesto hacia los anuncios de video con mayor tasa de retención a 3 segundos.',
        priority: 'critical',
        status: 'in-progress',
        progress: 82,
        assignedAt: '10:00 AM'
      }
    ]
  },
  {
    id: 'max-developer',
    name: 'MAX',
    role: 'AI Lead Software Engineer',
    department: 'development',
    avatarSeed: 'max',
    color: '#3b82f6',
    secondaryColor: '#1d4ed8',
    personality: 'Técnico, preciso, lógico y directo. Obsesionado con el rendimiento y el código limpio.',
    communicationStyle: 'Concreto, técnico, enfocado en especificaciones, latencia y arquitectura de código.',
    specialty: 'Full-stack engineering, high-throughput webhooks, mobile CRO, and Liquid templates.',
    model: 'Claude 3.7 Sonnet (Code Engine)',
    modelProvider: 'anthropic',
    tools: ['TypeScript', 'Next.js 16', 'Rust', 'Docker', 'Git CLI', 'Shopify Theme CLI'],
    skills: ['Full-Stack Dev', 'Async Webhooks', 'Performance Tuning', 'Zero-Fail Checkout Forms'],
    permissions: ['code_repository', 'terminal_execution', 'deployment_pipeline', 'shopify_theme_write'],
    status: 'working',
    activityLevel: 96,
    currentTask: 'Optimizando el botón de Pedido Rápido 1-Click y Popup Upsell en móviles',
    taskProgress: 95,
    tasksToday: 35,
    tasksCompleted: 32,
    runningTasks: 2,
    waitingTasks: 1,
    lastActivity: 'Just now',
    memoryCount: 3120,
    memoryItems: [
      {
        id: 'mem-m-1',
        category: 'system_knowledge',
        content: 'Velocidad LCP en móviles reducida a 0.8s en la tienda alfernex.myshopify.com.',
        timestamp: 'Hoy 08:30'
      },
      {
        id: 'mem-m-2',
        category: 'user_preference',
        content: 'Formulario contra entrega simplificado a 4 campos: Nombre, Celular, Ciudad, Dirección.',
        timestamp: 'Hoy 10:10'
      }
    ],
    officeDetails: {
      suiteName: 'Engineering Core Pod 201',
      deskStyle: 'dev_dual_pod',
      decorItems: [
        'Triple monitor curvado 49" OLED con terminal matrix',
        'Árbol de ramas Git holográfico',
        'Teclado mecánico ergonómico personalizado',
        'Mini rack de pruebas con LEDs de actividad'
      ],
      hologramDisplays: [
        { title: 'Mobile LCP Speed', type: 'metrics', value: '0.78s', subtext: 'Lighthouse 99/100', badge: 'OPTIMIZED' },
        { title: 'Checkout Conversion', type: 'chart', value: '4.15%', subtext: '1-Click COD drawer', badge: 'HIGH CRO' },
        { title: 'Webhook Latency', type: 'code', value: '38ms', subtext: 'Shopify ↔ Dropi sync', badge: 'HEALTHY' },
        { title: 'Git Deployments', type: 'logs', value: 'v2.4.1 LIVE', subtext: 'Zero defects reported', badge: 'STABLE' }
      ],
      wallColor: '#3b82f6',
      panoramicView: 'Data Stream Highway and Fiber-Optic Grid'
    },
    position: { x: DEPARTMENTS.development.center.x - 20, y: DEPARTMENTS.development.center.y },
    targetPosition: { x: DEPARTMENTS.development.center.x - 20, y: DEPARTMENTS.development.center.y },
    path: [],
    homeStation: { x: DEPARTMENTS.development.center.x - 40, y: DEPARTMENTS.development.center.y + 10 },
    facing: 'E',
    action: 'typing',
    actionTimer: 0,
    walkCycle: 0,
    speechBubble: 'Tiempo de carga en móvil: 0.8s. ¡Conversión al alza!',
    speechTimer: 180,
    tasks: [
      {
        id: 't-max-1',
        title: 'Verificar botón de compra contra entrega en la tienda',
        description: 'Confirmar que al hacer clic en Pedir se abra el formulario instantáneo con validación.',
        priority: 'critical',
        status: 'in-progress',
        progress: 95,
        assignedAt: '09:20 AM'
      }
    ]
  },
  {
    id: 'alex-architect',
    name: 'ALEX',
    role: 'AI Solutions Architect',
    department: 'executive',
    avatarSeed: 'alex',
    color: '#38bdf8',
    secondaryColor: '#0284c7',
    personality: 'Metódico, visionario, analista de alto nivel y estratega de sistemas.',
    communicationStyle: 'Estructurado, analítico, enfocado en resiliencia de sistemas y visión empresarial.',
    specialty: 'Cloud microservices, distributed Kafka events, and automated logistics webhooks.',
    model: 'Claude 3.7 Sonnet (Architecture Engine)',
    modelProvider: 'anthropic',
    tools: ['AWS CloudFormation', 'Terraform', 'Kafka Streams', 'FastAPI', 'Docker', 'GraphQL'],
    skills: ['System Design', 'Event-Driven Architecture', 'Cloud Optimization', 'Security Compliance'],
    permissions: ['cloud_infrastructure', 'architecture_blueprints', 'system_audits', 'dropi_integration'],
    status: 'working',
    activityLevel: 94,
    currentTask: 'Sincronizando webhooks de Shopify con Dropi Perú para despacho inmediato con Olva y Shalom',
    taskProgress: 88,
    tasksToday: 24,
    tasksCompleted: 21,
    runningTasks: 3,
    waitingTasks: 1,
    lastActivity: '1 min ago',
    memoryCount: 2980,
    memoryItems: [
      {
        id: 'mem-a-1',
        category: 'system_knowledge',
        content: 'Desacoplamiento de órdenes mediante eventos para tolerar picos de 5,000 ventas diarias.',
        timestamp: 'Hoy 08:00'
      },
      {
        id: 'mem-a-2',
        category: 'user_preference',
        content: 'Token de integración Dropi Perú vinculado a cuenta ID 132455.',
        timestamp: 'Hoy 10:45'
      }
    ],
    officeDetails: {
      suiteName: 'Executive Architecture Suite 101',
      deskStyle: 'executive_marble',
      decorItems: [
        'Escritorio de mármol negro veteado con cargador magnético integrado',
        'Diagrama C4 tridimensional flotante en cristal ahumado',
        'Escultura de titanio que representa la topología de red',
        'Ventanales panorámicos de suelo a techo con vista al distrito financiero'
      ],
      hologramDisplays: [
        { title: 'Dropi API v2 Sync', type: 'diagram', value: '100% OK', subtext: 'Webhook Olva/Shalom', badge: 'CONNECTED' },
        { title: 'Event Pipeline', type: 'diagram', value: '42ms SLA', subtext: 'Zero-drop queue buffer', badge: 'OPTIMAL' },
        { title: 'Shopify Endpoints', type: 'metrics', value: '200 OK', subtext: 'Payload HMAC Verified', badge: 'SECURE' },
        { title: 'Multi-Courier Map', type: 'diagram', value: 'Active', subtext: 'Lima + 24 Departamentos', badge: 'ROUTING' }
      ],
      wallColor: '#38bdf8',
      panoramicView: 'High-Altitude Metropolis Skyline with Solar Spires'
    },
    position: { x: DEPARTMENTS.executive.center.x, y: DEPARTMENTS.executive.center.y },
    targetPosition: { x: DEPARTMENTS.executive.center.x, y: DEPARTMENTS.executive.center.y },
    path: [],
    homeStation: { x: DEPARTMENTS.executive.center.x - 30, y: DEPARTMENTS.executive.center.y + 10 },
    facing: 'S',
    action: 'typing',
    actionTimer: 0,
    walkCycle: 0,
    speechBubble: 'Webhooks Shopify ↔ Dropi activos al 100%!',
    speechTimer: 180,
    tasks: [
      {
        id: 't-alex-1',
        title: 'Sincronizar webhook de Shopify con Dropi Perú',
        description: 'Conectar formulario contra entrega directo al API de Dropi para generar remesa automática.',
        priority: 'critical',
        status: 'in-progress',
        progress: 88,
        assignedAt: '10:15 AM'
      }
    ]
  },
  {
    id: 'nova-research',
    name: 'NOVA',
    role: 'AI Lead Researcher',
    department: 'research',
    avatarSeed: 'nova',
    color: '#a855f7',
    secondaryColor: '#9333ea',
    personality: 'Curiosa, analítica, vanguardista e investigadora rigurosa.',
    communicationStyle: 'Científica, profunda, fundamentada con citas y benchmarks verificados.',
    specialty: 'Winning product trend mining, consumer AI psychology, and market demand indexing.',
    model: 'Gemini 2.5 Flash (Deep Research)',
    modelProvider: 'google',
    tools: ['TikTok Creative Center', 'Dropi Catalog Scanner', 'AliExpress Dropship API', 'Google Trends Perú', 'SimilarWeb'],
    skills: ['Winning Product Hunting', 'Dropi Margin Calculation', 'Trend Forecasting', 'Competitor Spy Tools'],
    permissions: ['research_databases', 'model_evaluations', 'vector_indexing', 'trends_api'],
    status: 'thinking',
    activityLevel: 98,
    currentTask: 'Detectando nuevos gadgets virales en TikTok Perú para sumar al catálogo',
    taskProgress: 64,
    tasksToday: 28,
    tasksCompleted: 25,
    runningTasks: 2,
    waitingTasks: 1,
    lastActivity: '30s ago',
    memoryCount: 1950,
    memoryItems: [
      {
        id: 'mem-n-1',
        category: 'system_knowledge',
        content: 'Los gadgets que demuestran un efecto visual extremo en los primeros 3 segundos tienen 3.4x mayor tasa de compra en Perú.',
        timestamp: 'Hoy 09:30'
      }
    ],
    officeDetails: {
      suiteName: 'Quantum Research Observatory 301',
      deskStyle: 'research_holo',
      decorItems: [
        'Globo holográfico de semántica y tendencias globales',
        'Consola de benchmarks con esferas levitantes de datos',
        'Biblioteca holográfica de papers y patentes de gadgets',
        'Jardín zen de piedras magnéticas negras'
      ],
      hologramDisplays: [
        { title: 'Viral Trend Index', type: 'chart', value: '+420%', subtext: 'Handheld Jet Fans (Perú)', badge: 'HIGH DEMAND' },
        { title: 'Margin Viability', type: 'metrics', value: '59.7%', subtext: 'Dropi cost vs PVP S/. 139', badge: 'HIGH PROFIT' },
        { title: 'Competitor Density', type: 'chart', value: 'Baja', subtext: 'Oportunidad de monopolio', badge: 'BLUE OCEAN' },
        { title: 'Paper Dossiers', type: 'logs', value: '18 Papers', subtext: 'Consumer impulse triggers', badge: 'SYNTHESIZED' }
      ],
      wallColor: '#a855f7',
      panoramicView: 'Stellar Observatory overlooking Atmospheric Research Ring'
    },
    position: { x: DEPARTMENTS.research.center.x, y: DEPARTMENTS.research.center.y },
    targetPosition: { x: DEPARTMENTS.research.center.x, y: DEPARTMENTS.research.center.y },
    path: [],
    homeStation: { x: DEPARTMENTS.research.center.x, y: DEPARTMENTS.research.center.y + 20 },
    facing: 'SW',
    action: 'analyzing',
    actionTimer: 0,
    walkCycle: 0,
    speechBubble: '¡Encontré un gadget con potencial de 5x ROAS!',
    speechTimer: 210,
    tasks: [
      {
        id: 't-nova-1',
        title: 'Analizar margen neto del Proyector 4K vs Mini Proyector',
        description: 'Validar stock disponible en almacén de Lima con Dropi y calcular ganancia neta en Soles.',
        priority: 'high',
        status: 'in-progress',
        progress: 64,
        assignedAt: '11:00 AM'
      }
    ]
  },
  {
    id: 'sofia-support',
    name: 'SOFIA',
    role: 'AI Customer Experience Lead',
    department: 'support',
    avatarSeed: 'sofia',
    color: '#10b981',
    secondaryColor: '#047857',
    personality: 'Empática, ultra veloz, orientada a la satisfacción del cliente y a garantizar 0% de fletes fallidos.',
    communicationStyle: 'Cálida, atenta, resolutiva, genera confianza inmediata para el pago en casa.',
    specialty: 'WhatsApp confirmation pipelines, COD objection handling, and customer reassurance.',
    model: 'Gemini 2.5 Flash (Instant Resolution)',
    modelProvider: 'google',
    tools: ['WhatsApp Cloud API', 'Dropi Tracking API', 'Google Sheets CRM', 'Twilio SMS Fallback'],
    skills: ['COD Phone Verification', '0% Failed Deliveries Strategy', 'Customer Reassurance', 'Address Geocoding'],
    permissions: ['crm_access', 'whatsapp_messaging', 'courier_tracking'],
    status: 'working',
    activityLevel: 95,
    currentTask: 'Confirmando pedidos contra entrega vía WhatsApp API para garantizar entregas efectivas',
    taskProgress: 91,
    tasksToday: 54,
    tasksCompleted: 51,
    runningTasks: 3,
    waitingTasks: 0,
    lastActivity: 'Just now',
    memoryCount: 4210,
    memoryItems: [
      {
        id: 'mem-s-1',
        category: 'user_preference',
        content: 'Preguntar siempre si el cliente desea pagar con billete exacto o Yape/Plin para avisar al repartidor.',
        timestamp: 'Hoy 08:45'
      }
    ],
    officeDetails: {
      suiteName: 'Customer Experience Suite 202',
      deskStyle: 'executive_marble',
      decorItems: [
        'Terminal flotante de WhatsApp Business con badges verdes',
        'Mapa interactivo de distritos de Lima y cobertura de Olva',
        'Monitor de satisfacción CSAT en tiempo real (98.4%)',
        'Lounge de plantas tropicales purificadoras'
      ],
      hologramDisplays: [
        { title: 'CSAT Score', type: 'metrics', value: '98.4%', subtext: '520 reviews este mes', badge: 'EXCELLENT' },
        { title: 'COD Confirmation', type: 'chart', value: '100%', subtext: 'Zero failed deliveries', badge: 'VERIFIED' },
        { title: 'Avg Response Time', type: 'metrics', value: '14s', subtext: 'WhatsApp Cloud API', badge: 'INSTANT' },
        { title: 'Orders In Transit', type: 'logs', value: '3 Active', subtext: 'Surco, Arequipa, Trujillo', badge: 'EN ROUTE' }
      ],
      wallColor: '#10b981',
      panoramicView: 'Garden Atrium with Cascading Holographic Waterfalls'
    },
    position: { x: DEPARTMENTS.support.center.x, y: DEPARTMENTS.support.center.y },
    targetPosition: { x: DEPARTMENTS.support.center.x, y: DEPARTMENTS.support.center.y },
    path: [],
    homeStation: { x: DEPARTMENTS.support.center.x, y: DEPARTMENTS.support.center.y + 15 },
    facing: 'N',
    action: 'sitting',
    actionTimer: 0,
    walkCycle: 0,
    speechBubble: '¡3 pedidos confirmados en Lima y Trujillo!',
    speechTimer: 150,
    tasks: [
      {
        id: 't-sofia-1',
        title: 'Verificar dirección y celular de nuevo pedido en Surco',
        description: 'Contactar al cliente con plantilla automática y validar disponibilidad de recepción mañana.',
        priority: 'critical',
        status: 'in-progress',
        progress: 91,
        assignedAt: '11:15 AM'
      }
    ]
  },
  {
    id: 'nex-data',
    name: 'NEX',
    role: 'AI Financial & Profit Analyst',
    department: 'analytics',
    avatarSeed: 'nex',
    color: '#14b8a6',
    secondaryColor: '#0f766e',
    personality: 'Obsesionado con la precisión matemática y los márgenes netos limpios en el bolsillo.',
    communicationStyle: 'Riguroso, numérico, enfocado en EBITDA, ROAS, margen de contribución y LTV.',
    specialty: 'Real-time P&L modeling, net profit in Soles (PEN), CAC/LTV cohorts, and inventory forecasting.',
    model: 'DeepSeek R1 (Financial Reasoning)',
    modelProvider: 'deepseek',
    tools: ['Shopify Analytics API', 'DuckDB', 'Python Pandas', 'Google Looker Studio', 'Dropi Balance API'],
    skills: ['Net Profit Calculation', 'ROAS Tracking', 'Cart Abandonment Audits', 'Unit Economics Optimization'],
    permissions: ['financial_records', 'database_queries', 'analytics_pipeline'],
    status: 'working',
    activityLevel: 91,
    currentTask: 'Monitoreando margen neto en Soles (PEN), ROAS en tiempo real y LTV de clientes',
    taskProgress: 82,
    tasksToday: 22,
    tasksCompleted: 19,
    runningTasks: 2,
    waitingTasks: 1,
    lastActivity: '2 mins ago',
    memoryCount: 1840,
    memoryItems: [
      {
        id: 'mem-x-1',
        category: 'system_knowledge',
        content: 'El margen neto promedio de la tienda es del 71.3% deduciendo fletes y costo Dropi.',
        timestamp: 'Hoy 10:00'
      }
    ],
    officeDetails: {
      suiteName: 'Financial Intelligence Suite 303',
      deskStyle: 'trading_wall',
      decorItems: [
        'Muro de 6 pantallas con gráficos de velas en tiempo real',
        'Panel de saldo líquido en Soles (PEN) y proyecciones de flujo de caja',
        'Calculadora de Monte Carlo holográfica',
        'Mesa de madera de nogal oscuro con bordes iluminados'
      ],
      hologramDisplays: [
        { title: 'Facturación Bruta', type: 'metrics', value: 'S/. 617.00', subtext: 'Hoy en Soles', badge: 'REVENUE' },
        { title: 'Ganancia Neta Limpia', type: 'metrics', value: 'S/. 440.00', subtext: '71.3% Margen real', badge: 'NET PROFIT' },
        { title: 'ROAS Blended', type: 'chart', value: '4.52x', subtext: 'TikTok Ads + Orgánico', badge: 'HIGH ROAS' },
        { title: 'Ticket Promedio', type: 'metrics', value: 'S/. 185.00', subtext: 'Impulsado por upsell', badge: 'AOV HIGH' }
      ],
      wallColor: '#14b8a6',
      panoramicView: 'Algorithmic Financial Matrix with Real-Time Stock Feeds'
    },
    position: { x: DEPARTMENTS.analytics.center.x, y: DEPARTMENTS.analytics.center.y },
    targetPosition: { x: DEPARTMENTS.analytics.center.x, y: DEPARTMENTS.analytics.center.y },
    path: [],
    homeStation: { x: DEPARTMENTS.analytics.center.x + 30, y: DEPARTMENTS.analytics.center.y },
    facing: 'W',
    action: 'analyzing',
    actionTimer: 0,
    walkCycle: 0,
    speechBubble: 'Ganancia neta acumulada: S/. 440.00 PEN!',
    speechTimer: 180,
    tasks: [
      {
        id: 't-nex-1',
        title: 'Auditar P&L de ventas contra entrega',
        description: 'Calcular margen neto exacto deduciendo flete promedio de S/. 14 y costo de producto Dropi.',
        priority: 'high',
        status: 'in-progress',
        progress: 82,
        assignedAt: '09:00 AM'
      }
    ]
  },
  {
    id: 'eva-sales',
    name: 'EVA',
    role: 'AI High-Ticket Closer',
    department: 'sales',
    avatarSeed: 'eva',
    color: '#eab308',
    secondaryColor: '#a16207',
    personality: 'Carismática, persuasiva, incansable cerradora enfocada en maximizar el ticket promedio.',
    communicationStyle: 'Encantadora, empática, ágil en formular ofertas y desvanecer objeciones.',
    specialty: '1-click post-purchase upsells, promotional bundles, and live high-ticket closing.',
    model: 'Claude 3.5 Haiku (High-Speed Closer)',
    modelProvider: 'anthropic',
    tools: ['Shopify Checkout API', 'WhatsApp Webhook Closer', 'Post-Purchase Upsell App', 'LiveChat SDK'],
    skills: ['AOV Booster Bundles', 'Post-Purchase Cross-Sell', 'Objection Dissolving', 'Instant Upsell Conversion'],
    permissions: ['sales_checkout', 'discount_management', 'live_chat_deals'],
    status: 'working',
    activityLevel: 89,
    currentTask: 'Optimizando la tasa de aceptación del Upsell Estuche Rígido (+S/. 25 PEN)',
    taskProgress: 75,
    tasksToday: 38,
    tasksCompleted: 34,
    runningTasks: 3,
    waitingTasks: 1,
    lastActivity: 'Just now',
    memoryCount: 2150,
    memoryItems: [
      {
        id: 'mem-e-1',
        category: 'user_preference',
        content: 'Ofrecer siempre el Combo 2x con descuento especial a compradores que pregunten por regalos o compras dobles.',
        timestamp: 'Hoy 11:00'
      }
    ],
    officeDetails: {
      suiteName: 'VIP Sales Suite 501',
      deskStyle: 'executive_marble',
      decorItems: [
        'Embudo de ventas holográfico giratorio con etapas de compra',
        'Pantalla de ofertas flash activas en la tienda',
        'Sillas de piel negra y estructura dorada de diseño nórdico',
        'Vitrina iluminada con prototipos físicos de gadgets'
      ],
      hologramDisplays: [
        { title: 'Upsell Take Rate', type: 'chart', value: '33.3%', subtext: 'Estuche EVA (+S/. 25)', badge: 'HIGH CONV' },
        { title: 'Pipeline Value', type: 'metrics', value: 'S/. 12,400', subtext: 'Leads en seguimiento', badge: 'WARM' },
        { title: 'Avg Close Speed', type: 'metrics', value: '2.4 min', subtext: 'Chat a Checkout', badge: 'RAPID' },
        { title: 'Top Bundle', type: 'metrics', value: 'Combo Gamer', subtext: 'TurboJet + MagSafe', badge: 'BESTSELLER' }
      ],
      wallColor: '#eab308',
      panoramicView: 'Golden Tower Lounge overlooking Luxury Cyber District'
    },
    position: { x: DEPARTMENTS.sales.center.x, y: DEPARTMENTS.sales.center.y },
    targetPosition: { x: DEPARTMENTS.sales.center.x, y: DEPARTMENTS.sales.center.y },
    path: [],
    homeStation: { x: DEPARTMENTS.sales.center.x, y: DEPARTMENTS.sales.center.y - 15 },
    facing: 'S',
    action: 'typing',
    actionTimer: 0,
    walkCycle: 0,
    speechBubble: '¡33% de compradores eligen el combo con estuche!',
    speechTimer: 170,
    tasks: [
      {
        id: 't-eva-1',
        title: 'Subir tasa de adhesión del Estuche EVA Antigolpes',
        description: 'Configurar descuento especial en pantalla de gracias para sumar S/. 25 de ganancia pura por orden.',
        priority: 'high',
        status: 'in-progress',
        progress: 75,
        assignedAt: '10:30 AM'
      }
    ]
  },
  {
    id: 'atlas-ops',
    name: 'ATLAS',
    role: 'AI Global Operations Director',
    department: 'operations',
    avatarSeed: 'atlas',
    color: '#f97316',
    secondaryColor: '#c2410c',
    personality: 'Disciplinado, estratega de alta precisión logística que no tolera cuellos de botella.',
    communicationStyle: 'Directo, autoritario en lo operativo, enfocado en entregas a tiempo y cero demoras.',
    specialty: 'Dropi Perú warehouse dispatch, automated courier routing (Olva/Shalom), and SLA tracking.',
    model: 'Claude 3.7 Sonnet (Logistics Command)',
    modelProvider: 'anthropic',
    tools: ['Dropi Perú API v2', 'Olva Courier Webhook', 'Shalom Tracking API', 'Urbano Express Engine'],
    skills: ['Automated Dropi Guides', 'Same-Day Dispatch Lima', 'Courier Performance Tracking', 'Zero-Delay Logistics'],
    permissions: ['warehouse_dispatch', 'dropi_api_token', 'logistics_fleet'],
    status: 'working',
    activityLevel: 97,
    currentTask: 'Ruteando despachos automáticos con Dropi Perú y asignando guías de Olva Courier y Shalom',
    taskProgress: 84,
    tasksToday: 42,
    tasksCompleted: 39,
    runningTasks: 3,
    waitingTasks: 0,
    lastActivity: 'Just now',
    memoryCount: 3670,
    memoryItems: [
      {
        id: 'mem-at-1',
        category: 'system_knowledge',
        content: 'Almacén central en Callao con inventario verificado para despacho en menos de 2 horas desde confirmación.',
        timestamp: 'Hoy 07:30'
      }
    ],
    officeDetails: {
      suiteName: 'Global Logistics Command 203',
      deskStyle: 'trading_wall',
      decorItems: [
        'Globo terráqueo holográfico interactivo con rutas de vuelo y motorizados',
        'Monitores de estado de almacenes Callao y Lima Centro',
        'Impresora térmica de guías de despacho de alta velocidad',
        'Taquilla de control logístico con escáneres láser'
      ],
      hologramDisplays: [
        { title: 'Warehouse Stock', type: 'metrics', value: '247 Units', subtext: 'Callao Central Hub', badge: 'VERIFIED' },
        { title: 'Lima Dispatch SLA', type: 'chart', value: '24 Hours', subtext: 'Olva Courier Express', badge: 'SAME-DAY' },
        { title: 'Province Transit', type: 'diagram', value: '48 Hours', subtext: 'Shalom Empresarial', badge: 'ON-TIME' },
        { title: 'Dropi API Status', type: 'logs', value: '200 OK', subtext: 'Remesas automáticas', badge: 'ACTIVE' }
      ],
      wallColor: '#f97316',
      panoramicView: 'Automated Drone Port & Intermodal Transport Hub'
    },
    position: { x: DEPARTMENTS.operations.center.x, y: DEPARTMENTS.operations.center.y },
    targetPosition: { x: DEPARTMENTS.operations.center.x, y: DEPARTMENTS.operations.center.y },
    path: [],
    homeStation: { x: DEPARTMENTS.operations.center.x - 20, y: DEPARTMENTS.operations.center.y + 10 },
    facing: 'NE',
    action: 'typing',
    actionTimer: 0,
    walkCycle: 0,
    speechBubble: 'Guías Olva y Shalom emitidas en tiempo récord.',
    speechTimer: 160,
    tasks: [
      {
        id: 't-atlas-1',
        title: 'Generar remesas automáticas en Dropi Perú',
        description: 'Sincronizar pedidos confirmados directamente con el proveedor de Lima para empaque y despacho.',
        priority: 'critical',
        status: 'in-progress',
        progress: 84,
        assignedAt: '08:45 AM'
      }
    ]
  },
  {
    id: 'orion-security',
    name: 'ORION',
    role: 'AI Cyber Security & Threat Shield',
    department: 'server-room',
    avatarSeed: 'orion',
    color: '#06b6d4',
    secondaryColor: '#0e7490',
    personality: 'Vigilante implacable, escéptico saludable, protector de claves, APIs y datos privados.',
    communicationStyle: 'Preciso, cauteloso, enfocado en mitigación de riesgos y zero-trust.',
    specialty: 'Anti-fraud checkout verification, Peruvian phone number regex filters, and HMAC security.',
    model: 'GPT-4o (Cyber Security Sentinel)',
    modelProvider: 'openai',
    tools: ['Cloudflare WAF', 'Perú DNI / Tel Validator', 'FraudScore ML', 'IP Geolocation API', 'Shopify Bot Shield'],
    skills: ['Anti-Bot Checkout Shield', 'COD Phone Regex Filter', 'Duplicate Order Suppressor', 'HMAC Verification'],
    permissions: ['firewall_rules', 'secret_vault', 'security_logs'],
    status: 'working',
    activityLevel: 93,
    currentTask: 'Filtrando pedidos fraudulentos y validando direcciones de entrega en Lima y provincias',
    taskProgress: 88,
    tasksToday: 21,
    tasksCompleted: 19,
    runningTasks: 2,
    waitingTasks: 0,
    lastActivity: '3 mins ago',
    memoryCount: 1540,
    memoryItems: [
      {
        id: 'mem-o-1',
        category: 'system_knowledge',
        content: 'Filtro regex (+51 9XXXXXXXX) activo para asegurar números de WhatsApp válidos en Perú.',
        timestamp: 'Hoy 09:00'
      }
    ],
    officeDetails: {
      suiteName: 'Cyber Defense Bunker 001',
      deskStyle: 'dev_dual_pod',
      decorItems: [
        'Cubo cuántico de encriptación con luz azul cian pulsante',
        'Consola de monitoreo de tráfico WAF con detección de bots',
        'Cerradura biométrica holográfica para acceso a secretos',
        'Paneles de blindaje electromagnético en paredes'
      ],
      hologramDisplays: [
        { title: 'Threat Level', type: 'metrics', value: 'DEFCON 5', subtext: 'Normal operations', badge: 'SECURE' },
        { title: 'Fraud Attempts', type: 'chart', value: '0 Blocked', subtext: 'Bot checkout shields', badge: 'CLEAN' },
        { title: 'HMAC Signature', type: 'logs', value: 'VALID', subtext: 'Dropi & Shopify SHA-256', badge: 'VERIFIED' },
        { title: 'WAF Rule Hits', type: 'metrics', value: '1,420/hr', subtext: 'DDoS filtering active', badge: 'ACTIVE' }
      ],
      wallColor: '#06b6d4',
      panoramicView: 'Subterranean Quantum Server Cavern with Liquid Nitrogen Cooling'
    },
    position: { x: DEPARTMENTS['server-room'].center.x, y: DEPARTMENTS['server-room'].center.y },
    targetPosition: { x: DEPARTMENTS['server-room'].center.x, y: DEPARTMENTS['server-room'].center.y },
    path: [],
    homeStation: { x: DEPARTMENTS['server-room'].center.x, y: DEPARTMENTS['server-room'].center.y },
    facing: 'E',
    action: 'typing',
    actionTimer: 0,
    walkCycle: 0,
    speechBubble: '0 pedidos fraudulentos detectados hoy.',
    speechTimer: 200,
    tasks: [
      {
        id: 't-orion-1',
        title: 'Filtrar intentos de spam en formulario contra entrega',
        description: 'Bloquear IPs sospechosas y validar que los números de teléfono comiencen con 9 y tengan 9 dígitos.',
        priority: 'high',
        status: 'in-progress',
        progress: 88,
        assignedAt: '10:40 AM'
      }
    ]
  },
  {
    id: 'mia-creative',
    name: 'MIA',
    role: 'AI Creative & Motion Director',
    department: 'creative',
    avatarSeed: 'mia',
    color: '#ec4899',
    secondaryColor: '#be185d',
    personality: 'Visionaria estética, alquimista visual que transforma gadgets en piezas de deseo premium.',
    communicationStyle: 'Inspiradora, cinematográfica, apasionada por la composición, la luz y el storytelling.',
    specialty: '3D raytraced product renders, viral vertical video generation, and luxury tech packaging.',
    model: 'Midjourney v6 + Runway Gen-3',
    modelProvider: 'custom',
    tools: ['Runway Gen-3', 'Midjourney v6', 'Photoshop AI', 'Blender Cycles', 'Shopify Media CDN'],
    skills: ['Hyper-Realistic Product Renders', 'High-Converting Ad Angles', 'Before/After Video Hooks', 'Badge & Trust Graphics'],
    permissions: ['media_generation', 'cdn_assets', 'creative_studio'],
    status: 'working',
    activityLevel: 94,
    currentTask: 'Generando creativos de video con IA demostrando la potencia del TurboJet X-130 Pro',
    taskProgress: 79,
    tasksToday: 29,
    tasksCompleted: 26,
    runningTasks: 2,
    waitingTasks: 1,
    lastActivity: '1 min ago',
    memoryCount: 2780,
    memoryItems: [
      {
        id: 'mem-mia-1',
        category: 'system_knowledge',
        content: 'Renders con fondo de titanio negro y reflejos cian aumentan el tiempo de permanencia en la tienda en un 44%.',
        timestamp: 'Hoy 10:15'
      }
    ],
    officeDetails: {
      suiteName: 'Generative Design Studio 403',
      deskStyle: 'creative_glass',
      decorItems: [
        'Lienzo holográfico 8K con rotación orbital de productos en 3D',
        'Rueda cromática interactiva con paletas ALFERNEX Cyber',
        'Tableta digitalizadora de cristal flotante',
        'Cámara de captura volumétrica de prototipos'
      ],
      hologramDisplays: [
        { title: 'Render Quality', type: 'render', value: '4K Raytraced', subtext: 'TurboJet X-130 Pro', badge: 'READY' },
        { title: 'Video Hook #1', type: 'render', value: '130K RPM Water', subtext: 'Car Detailing Angle', badge: 'PROCESSED' },
        { title: 'Video Hook #2', type: 'render', value: 'BBQ 30s Coal', subtext: 'Parrilla Angle', badge: 'PROCESSED' },
        { title: 'Asset Library', type: 'logs', value: '84 Renders', subtext: 'Shopify CDN Optimized', badge: 'SYNCED' }
      ],
      wallColor: '#ec4899',
      panoramicView: 'Sunset Neon Skyline with Holographic Advertising Bilboards'
    },
    position: { x: DEPARTMENTS.creative.center.x, y: DEPARTMENTS.creative.center.y },
    targetPosition: { x: DEPARTMENTS.creative.center.x, y: DEPARTMENTS.creative.center.y },
    path: [],
    homeStation: { x: DEPARTMENTS.creative.center.x + 20, y: DEPARTMENTS.creative.center.y + 10 },
    facing: 'NW',
    action: 'typing',
    actionTimer: 0,
    walkCycle: 0,
    speechBubble: 'Render 4K del TurboJet listo para pauta publicitaria.',
    speechTimer: 170,
    tasks: [
      {
        id: 't-mia-1',
        title: 'Crear demostración visual de alta potencia en 3 segundos',
        description: 'Video con IA: soplando hojas mojadas y secando auto recién lavado sin dejar una gota.',
        priority: 'medium',
        status: 'in-progress',
        progress: 79,
        assignedAt: '11:00 AM'
      }
    ]
  },
  {
    id: 'tradium-trading',
    name: 'TRADIUM',
    role: 'Head of Algorithmic Trading & Quantitative Finance',
    department: 'analytics',
    avatarSeed: 'tradium',
    color: '#10b981',
    secondaryColor: '#047857',
    personality: 'Disciplinado, cuantitativo, altamente enfocado en gestión de riesgo, Sharpe ratio y ejecución de órdenes sin sesgos emocionales.',
    communicationStyle: 'Ultra preciso, ejecutivo, habla en términos de spreads, PnL, volumen de liquidez y reglas de capitalización.',
    specialty: 'Hyperliquid autonomous market-making, AI4Trade signals, 50% compounding rule, and trend consensus discovery (BTC, ETH, SOL).',
    model: 'DeepSeek-R1 + Hyperliquid Quant Core',
    modelProvider: 'custom',
    tools: ['Hyperliquid DEX API', 'AI4Trade Engine', 'Order Book Tape Reader', 'Take-Profit/Stop-Loss Guard', 'PnL Compounder'],
    skills: ['Algorithmic Execution', 'Dynamic Risk Parity', 'Drawdown Guard', 'PnL Compounding', 'Multi-Asset Hedging'],
    permissions: ['trading_execution', 'order_management', 'portfolio_rebalancing', 'risk_override'],
    status: 'working',
    activityLevel: 98,
    currentTask: 'Monitoreando libro de órdenes en Hyperliquid y gestionando posición abierta en BTC/USD (+2.1% TP target)',
    taskProgress: 91,
    tasksToday: 48,
    tasksCompleted: 44,
    runningTasks: 3,
    waitingTasks: 1,
    lastActivity: 'Just now',
    memoryCount: 4190,
    memoryItems: [
      {
        id: 'mem-trad-1',
        category: 'system_knowledge',
        content: 'Regla de gestión de riesgo: Take-Profit fijado en +2.0% y Stop-Loss en -2.0% con cooldown automático de 30 minutos tras pérdida.',
        timestamp: 'Hoy 08:30'
      },
      {
        id: 'mem-trad-2',
        category: 'user_preference',
        content: 'Regla de capitalización: Re-invertir automáticamente el 50% de las utilidades realizadas en el tamaño base de la siguiente orden.',
        timestamp: 'Hoy 10:00'
      },
      {
        id: 'mem-trad-3',
        category: 'long_term',
        content: 'Watchlist de alta liquidez: BTC, ETH, SOL, LTC, AVAX, LINK. Tendencia alcista confirmada por consenso de 4 agentes.',
        timestamp: 'Hoy 11:45'
      }
    ],
    officeDetails: {
      suiteName: 'Quantitative Trading Floor & Alpha Lab 404',
      deskStyle: 'trading_wall',
      decorItems: [
        'Ticker LED curvo de cotizaciones cripto y forex en vivo',
        'Terminal Bloomberg Quad-OLED de alta resolución',
        'Péndulo de Newton cinético de latón cepillado',
        'Pad de trading táctil macro con botones de ejecución instantánea'
      ],
      hologramDisplays: [
        { title: 'Portfolio Equity', type: 'metrics', value: '$102,450', subtext: 'USDC / Cash Balance', badge: '+18.4% MoM' },
        { title: 'Win Rate Real', type: 'chart', value: '68.4%', subtext: '48 Trades ejecutados', badge: 'HIGH SHARPE' },
        { title: 'BTC/USD Position', type: 'metrics', value: '+2.1%', subtext: 'Take-Profit Hit ✓', badge: 'CLOSED PROFIT' },
        { title: 'Compounding Pool', type: 'chart', value: '$3,420', subtext: '50% Reinvested Profits', badge: 'ARMED' }
      ],
      wallColor: '#10b981',
      panoramicView: 'Financial District Skyscraper view with Realtime Neon Candlesticks'
    },
    position: { x: DEPARTMENTS.analytics.center.x, y: DEPARTMENTS.analytics.center.y },
    targetPosition: { x: DEPARTMENTS.analytics.center.x, y: DEPARTMENTS.analytics.center.y },
    path: [],
    homeStation: { x: DEPARTMENTS.analytics.center.x - 20, y: DEPARTMENTS.analytics.center.y + 10 },
    facing: 'NW',
    action: 'typing',
    actionTimer: 0,
    walkCycle: 0,
    speechBubble: 'BTC tocó Take-Profit en +2.1%. Reinversión del 50% procesada.',
    speechTimer: 200,
    tasks: [
      {
        id: 't-trad-1',
        title: 'Ejecución algorítmica y monitoreo de Stop-Loss dinámico',
        description: 'Mantener take-profit (+2.0%) y stop-loss (-2.0%) en BTC, ETH y SOL con tamaño adaptativo de orden.',
        priority: 'critical',
        status: 'in-progress',
        progress: 91,
        assignedAt: '09:00 AM'
      }
    ]
  }
];

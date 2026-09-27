import SwiftUI

public enum AgentStatus: String, Codable, CaseIterable {
    case online = "ONLINE"
    case working = "WORKING"
    case thinking = "THINKING"
    case trading = "TRADING"
    case inMeeting = "EN REUNIÓN"
    
    public var color: Color {
        switch self {
        case .online: return Color.green
        case .working: return Color.blue
        case .thinking: return Color.purple
        case .trading: return Color.mint
        case .inMeeting: return Color.orange
        }
    }
}

public struct SimStats: Codable {
    public var energy: Int
    public var focus: Int
    public var mood: String
    
    public init(energy: Int = 95, focus: Int = 92, mood: String = "Focused 🎯") {
        self.energy = energy
        self.focus = focus
        self.mood = mood
    }
}

public struct Agent: Identifiable, Codable {
    public let id: String
    public let name: String
    public let role: String
    public let department: String
    public let clearance: String
    public let hexColor: String
    public var status: AgentStatus
    public var speechBubble: String
    public var simStats: SimStats
    public var isSpecial: Bool
    
    public var color: Color {
        Color(hex: hexColor)
    }
    
    public init(
        id: String,
        name: String,
        role: String,
        department: String,
        clearance: String,
        hexColor: String,
        status: AgentStatus = .working,
        speechBubble: String,
        simStats: SimStats = SimStats(),
        isSpecial: Bool = false
    ) {
        self.id = id
        self.name = name
        self.role = role
        self.department = department
        self.clearance = clearance
        self.hexColor = hexColor
        self.status = status
        self.speechBubble = speechBubble
        self.simStats = simStats
        self.isSpecial = isSpecial
    }
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

public struct AgentData {
    public static let initialAgents: [Agent] = [
        Agent(
            id: "tradium-trading",
            name: "TRADIUM",
            role: "Hyperliquid Quant Trading • Live PnL",
            department: "Trading & Finanzas",
            clearance: "NIVEL 5 (ALPHA)",
            hexColor: "#10b981",
            status: .trading,
            speechBubble: "ETH-PERP Take Profit ejecutado (+2.0%). Compounding al 50% activo.",
            simStats: SimStats(energy: 98, focus: 99, mood: "Hyperliquid Arbitrage ⚡"),
            isSpecial: true
        ),
        Agent(
            id: "vyra-growth",
            name: "VYRA",
            role: "TikTok Ads & Viral Marketing Manager",
            department: "Marketing",
            clearance: "NIVEL 4",
            hexColor: "#f43f5e",
            status: .working,
            speechBubble: "Optimizando ganchos de 3s para TurboJet en Lima. CTR subiendo a 4.9%.",
            simStats: SimStats(energy: 92, focus: 94, mood: "Viral Creative 🚀")
        ),
        Agent(
            id: "max-developer",
            name: "MAX",
            role: "Lead Software & Core Systems Engineer",
            department: "Tecnología",
            clearance: "NIVEL 5",
            hexColor: "#3b82f6",
            status: .working,
            speechBubble: "Optimizando latencia del checkout móvil a 0.8s en Next.js Turbopack.",
            simStats: SimStats(energy: 94, focus: 96, mood: "Building 💻")
        ),
        Agent(
            id: "echo-sales",
            name: "ECHO",
            role: "Dropi Perú Sales & Logistics Dispatcher",
            department: "Ventas",
            clearance: "NIVEL 4",
            hexColor: "#10b981",
            status: .working,
            speechBubble: "142 pedidos confirmados contra entrega con Olva Courier.",
            simStats: SimStats(energy: 90, focus: 91, mood: "Sales Closer 🎯")
        ),
        Agent(
            id: "sol-support",
            name: "SOL",
            role: "WhatsApp AI CRM & Customer Support",
            department: "Atención al Cliente",
            clearance: "NIVEL 3",
            hexColor: "#eab308",
            status: .online,
            speechBubble: "28 chats activos en WhatsApp. Tiempo de respuesta medio: 1.2 segundos.",
            simStats: SimStats(energy: 95, focus: 89, mood: "Friendly 😊")
        ),
        Agent(
            id: "atlas-ops",
            name: "ATLAS",
            role: "Supply Chain & Fulfillment Supervisor",
            department: "Operaciones",
            clearance: "NIVEL 4",
            hexColor: "#f97316",
            status: .working,
            speechBubble: "Stock en almacén de Lima: 850 unidades de TurboJet listas para despacho.",
            simStats: SimStats(energy: 88, focus: 95, mood: "Logistics Master 📦")
        ),
        Agent(
            id: "alex-architect",
            name: "ALEX",
            role: "Cloud & Microservices Architect",
            department: "Infraestructura",
            clearance: "NIVEL 5",
            hexColor: "#06b6d4",
            status: .working,
            speechBubble: "Topología C4 en Kubernetes sincronizada con webhooks de Shopify y Dropi.",
            simStats: SimStats(energy: 91, focus: 97, mood: "Architecting 🏛️")
        ),
        Agent(
            id: "nova-research",
            name: "NOVA",
            role: "LLM Reasoning & Tech Trends Researcher",
            department: "Investigación",
            clearance: "NIVEL 4",
            hexColor: "#8b5cf6",
            status: .thinking,
            speechBubble: "Analizando papers de arXiv sobre compresión de modelos y benchmarks e-commerce.",
            simStats: SimStats(energy: 87, focus: 98, mood: "Deep Thinker 🔬")
        ),
        Agent(
            id: "nex-data",
            name: "NEX",
            role: "P&L Financial & Gross Margin Analyst",
            department: "Finanzas",
            clearance: "NIVEL 5",
            hexColor: "#059669",
            status: .working,
            speechBubble: "Margen neto promedio en Soles: 54.2% tras flete Dropi y costo de producto.",
            simStats: SimStats(energy: 93, focus: 94, mood: "Audited 📊")
        ),
        Agent(
            id: "maya-creative",
            name: "MAYA",
            role: "3D Blender & Viral Visual Content Creator",
            department: "Creativo",
            clearance: "NIVEL 3",
            hexColor: "#ec4899",
            status: .working,
            speechBubble: "8 videos verticales en 4K listos para pauta publicitaria en TikTok e Instagram.",
            simStats: SimStats(energy: 90, focus: 92, mood: "Artistic 🎨")
        ),
        Agent(
            id: "cipher-security",
            name: "CIPHER",
            role: "Zero Trust Firewall & Cybersecurity Lead",
            department: "Seguridad",
            clearance: "NIVEL 5 (DEFCON 1)",
            hexColor: "#6366f1",
            status: .online,
            speechBubble: "Bóveda cuántica y cortafuegos en tasa de 10 Gbps. 0 amenazas detectadas.",
            simStats: SimStats(energy: 99, focus: 100, mood: "Shield Active 🛡️")
        )
    ]
}

public struct ChatMessageItem: Identifiable, Codable {
    public let id: String
    public let sender: String // "user" or "agent"
    public let senderName: String
    public let text: String
    public let timestamp: String
    public let agentId: String
    
    public init(id: String = UUID().uuidString, sender: String, senderName: String, text: String, timestamp: String = "Ahora", agentId: String) {
        self.id = id
        self.sender = sender
        self.senderName = senderName
        self.text = text
        self.timestamp = timestamp
        self.agentId = agentId
    }
}

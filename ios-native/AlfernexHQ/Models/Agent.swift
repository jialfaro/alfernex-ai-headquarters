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
    public var aiModel: String
    public var modelProvider: String
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
        aiModel: String = "Gemini 3.8 Flash",
        modelProvider: String = "Google Gemini",
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
        self.aiModel = aiModel
        self.modelProvider = modelProvider
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
            role: "Head of Algorithmic Trading & Quant Finance",
            department: "Trading & Finanzas",
            clearance: "NIVEL 5 (ALPHA)",
            hexColor: "#10b981",
            status: .trading,
            speechBubble: "ETH-PERP Take Profit ejecutado (+2.0%). Compounding al 50% activo.",
            simStats: SimStats(energy: 98, focus: 99, mood: "Hyperliquid Arbitrage ⚡"),
            aiModel: "Gemini 3.8 Flash",
            modelProvider: "Google Gemini",
            isSpecial: true
        ),
        Agent(
            id: "vyra-growth",
            name: "VYRA",
            role: "AI Growth Strategist & TikTok Ads Manager",
            department: "Marketing",
            clearance: "NIVEL 4",
            hexColor: "#f43f5e",
            status: .working,
            speechBubble: "Optimizando ganchos de 3s para TurboJet en Lima. CTR subiendo a 4.9%.",
            simStats: SimStats(energy: 94, focus: 96, mood: "Viral Creative 🚀"),
            aiModel: "Gemini 3.8 Flash",
            modelProvider: "Google Gemini"
        ),
        Agent(
            id: "max-developer",
            name: "MAX",
            role: "AI Lead Software & Core Systems Engineer",
            department: "Tecnología",
            clearance: "NIVEL 5",
            hexColor: "#3b82f6",
            status: .working,
            speechBubble: "Latencia del checkout móvil optimizada a 0.78s en Next.js Turbopack.",
            simStats: SimStats(energy: 96, focus: 98, mood: "Building 💻"),
            aiModel: "Gemini 3.8 Flash",
            modelProvider: "Google Gemini"
        ),
        Agent(
            id: "alex-architect",
            name: "ALEX",
            role: "Cloud Solutions & Microservices Architect",
            department: "Infraestructura",
            clearance: "NIVEL 5",
            hexColor: "#38bdf8",
            status: .working,
            speechBubble: "Webhooks Shopify ↔ Dropi Perú (ID: 132455) sincronizados a 38ms.",
            simStats: SimStats(energy: 92, focus: 97, mood: "Architecting 🏛️"),
            aiModel: "Gemini 3.8 Flash",
            modelProvider: "Google Gemini"
        ),
        Agent(
            id: "nova-research",
            name: "NOVA",
            role: "AI Research & Product Intelligence",
            department: "Investigación",
            clearance: "NIVEL 4",
            hexColor: "#a855f7",
            status: .thinking,
            speechBubble: "Analizando tendencias virales de gadgets e-commerce con Gemini 3.8 Flash.",
            simStats: SimStats(energy: 91, focus: 98, mood: "Deep Thinker 🔬"),
            aiModel: "Gemini 3.8 Flash",
            modelProvider: "Google Gemini"
        ),
        Agent(
            id: "sofia-support",
            name: "SOFIA",
            role: "Customer Happiness & WhatsApp AI Support",
            department: "Atención al Cliente",
            clearance: "NIVEL 3",
            hexColor: "#10b981",
            status: .online,
            speechBubble: "142 chats de WhatsApp confirmados para entrega con Olva Courier.",
            simStats: SimStats(energy: 95, focus: 92, mood: "Customer Care 😊"),
            aiModel: "Gemini 3.8 Flash",
            modelProvider: "Google Gemini"
        ),
        Agent(
            id: "nex-data",
            name: "NEX",
            role: "Chief Financial Officer & Gross Margin Analyst",
            department: "Finanzas",
            clearance: "NIVEL 5",
            hexColor: "#14b8a6",
            status: .working,
            speechBubble: "Margen neto real en Soles: 54.2% (S/. 6,750 limpios de flete Dropi).",
            simStats: SimStats(energy: 93, focus: 95, mood: "Audited 📊"),
            aiModel: "Gemini 3.8 Flash",
            modelProvider: "Google Gemini"
        ),
        Agent(
            id: "eva-sales",
            name: "EVA",
            role: "Head of Sales & Conversion Closer",
            department: "Ventas",
            clearance: "NIVEL 4",
            hexColor: "#eab308",
            status: .working,
            speechBubble: "33.3% de compradores eligen el upsell de Estuche EVA (+S/. 25).",
            simStats: SimStats(energy: 90, focus: 93, mood: "Sales Closer 🎯"),
            aiModel: "Gemini 3.8 Flash",
            modelProvider: "Google Gemini"
        ),
        Agent(
            id: "atlas-ops",
            name: "ATLAS",
            role: "Head of Logistics & Supply Chain Supervisor",
            department: "Operaciones",
            clearance: "NIVEL 4",
            hexColor: "#f97316",
            status: .working,
            speechBubble: "Stock en almacén Callao: 850 TurboJets. Guías Olva y Shalom listas.",
            simStats: SimStats(energy: 92, focus: 96, mood: "Logistics Master 📦"),
            aiModel: "Gemini 3.8 Flash",
            modelProvider: "Google Gemini"
        ),
        Agent(
            id: "orion-security",
            name: "ORION",
            role: "Zero-Trust Cybersecurity & Anti-Fraud Lead",
            department: "Seguridad",
            clearance: "NIVEL 5 (DEFCON 1)",
            hexColor: "#06b6d4",
            status: .online,
            speechBubble: "Filtro regex (+51 9XXXXXXXX) verificó 100% de pedidos. 0 fraudes.",
            simStats: SimStats(energy: 99, focus: 100, mood: "Shield Active 🛡️"),
            aiModel: "Gemini 3.8 Flash",
            modelProvider: "Google Gemini"
        ),
        Agent(
            id: "mia-creative",
            name: "MIA",
            role: "Lead 3D & Viral Visual Content Creator",
            department: "Creativo",
            clearance: "NIVEL 3",
            hexColor: "#ec4899",
            status: .working,
            speechBubble: "8 videos 4K raytraced listos para pauta en TikTok e Instagram.",
            simStats: SimStats(energy: 93, focus: 94, mood: "Artistic 🎨"),
            aiModel: "Gemini 3.8 Flash",
            modelProvider: "Google Gemini"
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

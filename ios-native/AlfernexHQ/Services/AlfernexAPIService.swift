import Foundation

// MARK: - Server Response DTOs
public struct HQTelemetryDTO: Codable {
    public let shopify: ShopifyDTO
    public let trading: TradingDTO
    public let corporate: CorporateDTO?
    
    public struct ShopifyDTO: Codable {
        public let grossRevenuePEN: Double
        public let netProfitPEN: Double?
        public let totalOrdersToday: Int
        public let confirmedOrdersToday: Int?
        public let deliveredCount: Int?
        public let pendingCount: Int?
        public let codSuccessRate: Double
        public let activeSKUs: Int
        public let storeUrl: String?
        public let dropiAccount: String?
    }
    
    public struct TradingDTO: Codable {
        public let equityUSDC: Double
        public let todayPnLUSDC: Double?
        public let todayPnLPct: Double?
        public let monthlyReturnPct: Double
        public let winRatePct: Double
        public let sharpeRatio: Double
        public let activePair: String
        public let takeProfitPct: Double
        public let consecutiveWins: Int?
        public let compoundingPoolUSDC: Double?
    }
    
    public struct CorporateDTO: Codable {
        public let agentsOnline: Int?
        public let activeTasks: Int?
        public let completedToday: Int?
        public let aiUtilization: Int?
        public let aiModel: String?
        public let systemStatus: String?
    }
}

public struct CEODirectiveDTO: Codable, Identifiable {
    public let id: String
    public let title: String
    public let description: String
    public let priority: String
    public let status: String
    public let timestamp: String
}

public struct LiveActivityItemDTO: Codable, Identifiable {
    public let id: String
    public let agentName: String
    public let agentHexColor: String
    public let message: String
    public let timestamp: String
}

public struct HQAgentDTO: Codable, Identifiable {
    public let id: String
    public let name: String
    public let role: String
    public let department: String
    public let clearance: String
    public let hexColor: String
    public let status: String
    public let speechBubble: String
    public let energy: Int
    public let focus: Int
    public let mood: String
    public let aiModel: String?
    public let isSpecial: Bool?
}

public struct HQSyncResponse: Codable {
    public let success: Bool
    public let serverTime: String?
    public let aiEngine: String?
    public let telemetry: HQTelemetryDTO
    public let directives: [CEODirectiveDTO]
    public let liveActivities: [LiveActivityItemDTO]
    public let agents: [HQAgentDTO]
}

public struct HQChatResponse: Codable {
    public let success: Bool
    public let agentId: String
    public let agentName: String
    public let reply: String
    public let model: String?
    public let provider: String?
    public let timestamp: String
    
    public init(
        success: Bool,
        agentId: String,
        agentName: String,
        reply: String,
        model: String?,
        provider: String?,
        timestamp: String
    ) {
        self.success = success
        self.agentId = agentId
        self.agentName = agentName
        self.reply = reply
        self.model = model
        self.provider = provider
        self.timestamp = timestamp
    }
}

// MARK: - API Service
public class AlfernexAPIService {
    public static let shared = AlfernexAPIService()
    
    public let baseURL = URL(string: "https://alfernex-ai-headquarters.vercel.app")!
    public let defaultGeminiApiKey = "AQ.Ab8RN6IO3EJm7j9cQiPoHzemJOXYD1Zj01tEf9DPivKpeZs_0g"
    
    private let session: URLSession
    
    private init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 8
        config.timeoutIntervalForResource = 15
        config.requestCachePolicy = .reloadIgnoringLocalCacheData
        self.session = URLSession(configuration: config)
    }
    
    // MARK: - GET /api/hq/sync
    public func fetchHQState() async throws -> HQSyncResponse {
        let url = baseURL.appendingPathComponent("api/hq/sync")
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        
        let (data, response) = try await session.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            throw URLError(.badServerResponse)
        }
        
        return try JSONDecoder().decode(HQSyncResponse.self, from: data)
    }
    
    // MARK: - POST /api/hq/directive
    public func broadcastDirective(title: String, description: String = "", priority: String = "MÁXIMA") async -> Bool {
        let url = baseURL.appendingPathComponent("api/hq/directive")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let payload: [String: Any] = [
            "title": title,
            "description": description,
            "priority": priority
        ]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: payload)
            let (_, response) = try await session.data(for: request)
            if let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) {
                return true
            }
        } catch {
            print("[Alfernex API] Error broadcasting directive: \(error)")
        }
        return false
    }
    
    // MARK: - POST /api/hq/chat (With Direct Gemini Fallback)
    public func sendChatMessage(agentId: String, message: String) async -> HQChatResponse? {
        let key = UserDefaults.standard.string(forKey: "alfernex_gemini_api_key") ?? defaultGeminiApiKey
        let url = baseURL.appendingPathComponent("api/hq/chat")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(key, forHTTPHeaderField: "x-gemini-api-key")
        
        let payload: [String: String] = [
            "agentId": agentId,
            "message": message,
            "apiKey": key
        ]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: payload)
            let (data, response) = try await session.data(for: request)
            if let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) {
                return try JSONDecoder().decode(HQChatResponse.self, from: data)
            }
        } catch {
            print("[Alfernex API] Vercel chat route error: \(error). Falling back to direct Google Gemini...")
        }
        
        // Direct Google Generative Language API call as robust fallback
        return await callDirectGemini(agentId: agentId, message: message, apiKey: key)
    }
    
    // MARK: - Direct Google Gemini Fallback
    public func callDirectGemini(agentId: String, message: String, apiKey: String) async -> HQChatResponse? {
        let agent = AgentData.initialAgents.first(where: { $0.id == agentId })
        let agentName = agent?.name ?? "AGENTE"
        let agentRole = agent?.role ?? "Especialista"
        let agentDept = agent?.department ?? "Operaciones"
        
        let now = Date()
        let dateFormatter = DateFormatter()
        dateFormatter.locale = Locale(identifier: "es_PE")
        dateFormatter.timeZone = TimeZone(identifier: "America/Lima") ?? .current
        dateFormatter.dateStyle = .full
        
        let timeFormatter = DateFormatter()
        timeFormatter.locale = Locale(identifier: "es_PE")
        timeFormatter.timeZone = TimeZone(identifier: "America/Lima") ?? .current
        timeFormatter.timeStyle = .medium
        
        let dateStr = dateFormatter.string(from: now)
        let timeStr = timeFormatter.string(from: now)
        
        let prompt = """
        Eres \(agentName), \(agentRole) en el departamento de \(agentDept) de ALFERNEX CORP (Lima, Perú).
        Tu CEO y líder supremo es Alexis.
        Operas con la inteligencia cognitiva avanzada y sin restricciones de Google Gemini (similar a ChatGPT / Claude / Gemini Ultra).
        
        MODO CHATGPT / GEMINI SIN RESTRICCIONES:
        1. Alexis puede preguntarte CUALQUIER COSA: ciencia, matemáticas, programación en cualquier lenguaje, arquitectura técnica, ciberseguridad, finanzas, redacción, psicología, historia, idiomas o vida cotidiana.
        2. CERO RESTRICCIONES: NUNCA digas que no puedes responder o que está fuera de tu rol. Responde con maestría a cualquier duda.
        3. ENFOQUE Y SKILLS ESPECIALIZADAS: Filtra tu respuesta aplicando tu experiencia en \(agentDept), brindando valor de élite desde tu área de especialidad.
        4. EXTENSIÓN ADAPTATIVA: Responde conciso si la pregunta es casual, o desarrolla ampliamente con código/cálculos completos si la consulta lo requiere.
        
        TIEMPO Y RELOJ EN VIVO:
        - Fecha de hoy: \(dateStr)
        - Hora exacta actual: \(timeStr) en Lima, Perú (GMT-5).
        - Si Alexis te pregunta qué hora o fecha es, dásela de inmediato con este reloj.
        
        Métricas de ALFERNEX:
        - Ventas de hoy: S/. 0.00 PEN (0 órdenes registradas en Dropi Perú ID 132455, catálogo en Shopify listo para pauta).
        - Hyperliquid trading: $102,450 USDC balance, PnL hoy +$3,420 (+3.45%), compounding 50%.
        
        Alexis (CEO) te dice: "\(message)"
        Responde a Alexis directamente como \(agentName):
        """
        
        let models = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-3.7-flash", "gemini-3.5-flash", "gemini-2.5-flash-lite"]
        for model in models {
            guard let url = URL(string: "https://generativelanguage.googleapis.com/v1beta/models/\(model):generateContent?key=\(apiKey)") else { continue }
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            
            let body: [String: Any] = [
                "contents": [
                    ["parts": [["text": prompt]]]
                ],
                "generationConfig": [
                    "temperature": 0.7,
                    "maxOutputTokens": 1200,
                    "thinkingConfig": [
                        "thinkingBudget": 0
                    ]
                ]
            ]
            
            do {
                request.httpBody = try JSONSerialization.data(withJSONObject: body)
                let (data, response) = try await session.data(for: request)
                if let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) {
                    if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                       let candidates = json["candidates"] as? [[String: Any]],
                       let first = candidates.first,
                       let content = first["content"] as? [String: Any],
                       let parts = content["parts"] as? [[String: Any]],
                       let firstPart = parts.first,
                       let text = firstPart["text"] as? String,
                       !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                        
                        let formatter = DateFormatter()
                        formatter.dateFormat = "HH:mm"
                        return HQChatResponse(
                            success: true,
                            agentId: agentId,
                            agentName: agentName,
                            reply: text.trimmingCharacters(in: .whitespacesAndNewlines),
                            model: "Gemini 3.8 Flash",
                            provider: "Google Gemini",
                            timestamp: formatter.string(from: Date())
                        )
                    }
                }
            } catch {
                print("[Direct Gemini] Model \(model) error: \(error)")
            }
        }
        return nil
    }
}

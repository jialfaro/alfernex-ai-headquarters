import Foundation

// MARK: - Server Response DTOs
public struct HQTelemetryDTO: Codable {
    public let shopify: ShopifyDTO
    public let trading: TradingDTO
    
    public struct ShopifyDTO: Codable {
        public let grossRevenuePEN: Double
        public let totalOrdersToday: Int
        public let codSuccessRate: Double
        public let activeSKUs: Int
    }
    
    public struct TradingDTO: Codable {
        public let equityUSDC: Double
        public let monthlyReturnPct: Double
        public let winRatePct: Double
        public let sharpeRatio: Double
        public let activePair: String
        public let takeProfitPct: Double
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
    public let isSpecial: Bool?
}

public struct HQSyncResponse: Codable {
    public let success: Bool
    public let serverTime: String?
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
    public let timestamp: String
}

// MARK: - API Service
public class AlfernexAPIService {
    public static let shared = AlfernexAPIService()
    
    public let baseURL = URL(string: "https://alfernex-ai-headquarters.vercel.app")!
    
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
    
    // MARK: - POST /api/hq/chat
    public func sendChatMessage(agentId: String, message: String) async -> HQChatResponse? {
        let url = baseURL.appendingPathComponent("api/hq/chat")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let payload: [String: String] = [
            "agentId": agentId,
            "message": message
        ]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: payload)
            let (data, response) = try await session.data(for: request)
            if let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) {
                return try JSONDecoder().decode(HQChatResponse.self, from: data)
            }
        } catch {
            print("[Alfernex API] Error sending chat: \(error)")
        }
        return nil
    }
}

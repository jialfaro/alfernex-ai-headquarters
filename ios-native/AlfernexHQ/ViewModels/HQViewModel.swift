import SwiftUI
import Combine

@MainActor
public class HQViewModel: ObservableObject {
    @Published public var agents: [Agent] = AgentData.initialAgents
    @Published public var selectedAgent: Agent? = nil
    @Published public var shopifyTelemetry = ShopifyTelemetry()
    @Published public var tradingTelemetry = TradingTelemetry()
    
    // Vercel Live Synchronization Status
    @Published public var isSyncingWithVercel: Bool = false
    @Published public var syncStatusText: String = "VERCEL SYNCED"
    @Published public var lastSyncTimestamp: String = "En línea"
    @Published public var directives: [CEODirectiveDTO] = []
    
    // Tab Navigation: 0 = Comando, 1 = 11 Agentes, 2 = Voz Directa, 3 = War Room
    @Published public var selectedTab: Int = 0
    
    // Chat Modal State
    @Published public var isChatSheetPresented: Bool = false
    @Published public var chattingAgent: Agent? = nil
    @Published public var chatMessages: [String: [ChatMessageItem]] = [:]
    
    // Voice Call State
    @Published public var isVoiceActive: Bool = false
    @Published public var activeVoiceAgent: Agent? = nil
    @Published public var voiceStateText: String = "LISTO"
    @Published public var isMuted: Bool = false
    @Published public var voiceTranscripts: [(sender: String, text: String)] = []
    
    // Directives
    @Published public var currentDirective: String = "Escalamiento Agresivo en Soles: TikTok Ads + Dropi Express"
    
    // Live Stream
    @Published public var liveActivities: [LiveActivityItem] = [
        LiveActivityItem(id: "1", agentName: "TRADIUM", agentHexColor: "#10b981", message: "Take profit ejecutado en ETH-PERP a +2.0%. 50% compounding transferido a USDC.", timestamp: "1m ago"),
        LiveActivityItem(id: "2", agentName: "VYRA", agentHexColor: "#f43f5e", message: "Optimizando pauta de TikTok Ads en Lima con ganchos de 3s para TurboJet.", timestamp: "2m ago"),
        LiveActivityItem(id: "3", agentName: "MAX", agentHexColor: "#3b82f6", message: "Latencia del checkout optimizada a 0.8s en Turbopack con 88% de conversión.", timestamp: "3m ago"),
        LiveActivityItem(id: "4", agentName: "ECHO", agentHexColor: "#10b981", message: "142 pedidos contra entrega confirmados con Olva Courier y Shalom.", timestamp: "5m ago"),
        LiveActivityItem(id: "5", agentName: "NEX", agentHexColor: "#059669", message: "Margen neto diario proyectado: S/. 3,450 tras deducción de flete.", timestamp: "8m ago")
    ]
    
    private var syncTimer: Timer?
    
    public init() {
        self.activeVoiceAgent = agents.first(where: { $0.id == "tradium-trading" }) ?? agents.first
        
        // Pre-populate chat histories
        for ag in agents {
            chatMessages[ag.id] = [
                ChatMessageItem(
                    sender: "agent",
                    senderName: ag.name,
                    text: "Hola Alexis. Soy \(ag.name), tu \(ag.role). ¿Qué directiva ejecutamos hoy?",
                    timestamp: "Hoy",
                    agentId: ag.id
                )
            ]
        }
        
        // Initial sync with Vercel Web
        Task {
            await self.syncWithVercel()
        }
        
        // Periodic background synchronization every 5 seconds
        self.syncTimer = Timer.scheduledTimer(withTimeInterval: 5.0, repeats: true) { [weak self] _ in
            Task { @MainActor [weak self] in
                await self?.syncWithVercel()
            }
        }
    }
    
    // MARK: - Real-time Vercel Synchronization
    public func syncWithVercel() async {
        self.isSyncingWithVercel = true
        
        do {
            let response = try await AlfernexAPIService.shared.fetchHQState()
            
            // 1. Sync Shopify Telemetry
            self.shopifyTelemetry.grossRevenuePEN = response.telemetry.shopify.grossRevenuePEN
            self.shopifyTelemetry.totalOrdersToday = response.telemetry.shopify.totalOrdersToday
            self.shopifyTelemetry.codSuccessRate = response.telemetry.shopify.codSuccessRate
            self.shopifyTelemetry.activeSKUs = response.telemetry.shopify.activeSKUs
            
            // 2. Sync Hyperliquid Trading Telemetry
            self.tradingTelemetry.equityUSDC = response.telemetry.trading.equityUSDC
            self.tradingTelemetry.monthlyReturnPct = response.telemetry.trading.monthlyReturnPct
            self.tradingTelemetry.winRatePct = response.telemetry.trading.winRatePct
            self.tradingTelemetry.sharpeRatio = response.telemetry.trading.sharpeRatio
            self.tradingTelemetry.activePair = response.telemetry.trading.activePair
            self.tradingTelemetry.takeProfitPct = response.telemetry.trading.takeProfitPct
            
            // 3. Sync Directives
            self.directives = response.directives
            if let firstDir = response.directives.first {
                self.currentDirective = firstDir.title
            }
            
            // 4. Sync Live Activities Stream
            self.liveActivities = response.liveActivities.map { dto in
                LiveActivityItem(
                    id: dto.id,
                    agentName: dto.agentName,
                    agentHexColor: dto.agentHexColor,
                    message: dto.message,
                    timestamp: dto.timestamp
                )
            }
            
            // 5. Sync Agent status & speech bubbles
            for agDto in response.agents {
                if let idx = self.agents.firstIndex(where: { $0.id == agDto.id }) {
                    self.agents[idx].speechBubble = agDto.speechBubble
                    self.agents[idx].simStats.energy = agDto.energy
                    self.agents[idx].simStats.focus = agDto.focus
                }
            }
            
            self.syncStatusText = "VERCEL SYNCED"
            self.lastSyncTimestamp = "En vivo"
        } catch {
            self.syncStatusText = "OFFLINE CACHE"
            print("[HQ Sync] Note: Using offline fallback cache: \(error)")
        }
        
        self.isSyncingWithVercel = false
    }
    
    // MARK: - Voice Call Logic
    public func startVoice(with agent: Agent) {
        self.activeVoiceAgent = agent
        self.isVoiceActive = true
        self.selectedTab = 2 // Switch immediately to Voice Screen!
        self.voiceStateText = "HABLANDO AHORA..."
        
        let greeting = agent.id == "tradium-trading"
            ? "Hola Alexis. TRADIUM en línea. Monitoreando Hyperliquid con $102,450 USDC en balance. ¿Qué orden ejecutamos?"
            : "Hola Alexis. Aquí \(agent.name), tu \(agRoleShort(agent.role)). Estoy en línea y listo para reportar. ¿Qué directiva ejecutamos hoy?"
        
        self.voiceTranscripts.append((sender: agent.name, text: greeting))
        
        // Speak greeting out loud via AVSpeechSynthesizer
        AlfernexSpeechManager.shared.speak(text: greeting) { [weak self] in
            guard let self = self, self.isVoiceActive else { return }
            self.listenForUserVoice()
        }
    }
    
    public func listenForUserVoice() {
        guard isVoiceActive && !isMuted else { return }
        
        self.voiceStateText = "ESCUCHANDO..."
        
        AlfernexSpeechManager.shared.requestPermissions { [weak self] granted in
            guard let self = self, granted, self.isVoiceActive else { return }
            
            AlfernexSpeechManager.shared.startListening(
                onTranscript: { transcript in
                    // Continuous partial transcript
                },
                onFinal: { [weak self] finalTranscript in
                    guard let self = self, self.isVoiceActive else { return }
                    self.submitUserVoiceQuery(text: finalTranscript)
                }
            )
        }
    }
    
    public func submitUserVoiceQuery(text: String) {
        let clean = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !clean.isEmpty, let agent = activeVoiceAgent else { return }
        
        AlfernexSpeechManager.shared.stopListening()
        
        // Add user speech to transcripts
        self.voiceTranscripts.append((sender: "Alexis (CEO)", text: clean))
        self.voiceStateText = "PENSANDO..."
        
        // Also sync to chat history
        var currentChat = self.chatMessages[agent.id] ?? []
        currentChat.append(ChatMessageItem(sender: "user", senderName: "Alexis", text: clean, agentId: agent.id))
        
        // Generate AI Agent Response (from Vercel API or local neural engine)
        Task {
            let vercelResponse = await AlfernexAPIService.shared.sendChatMessage(agentId: agent.id, message: clean)
            let response = vercelResponse?.reply ?? AlfernexSpeechManager.shared.generateResponse(for: agent, query: clean)
            
            self.voiceTranscripts.append((sender: agent.name, text: response))
            currentChat.append(ChatMessageItem(sender: "agent", senderName: agent.name, text: response, agentId: agent.id))
            self.chatMessages[agent.id] = currentChat
            
            self.voiceStateText = "HABLANDO AHORA..."
            
            // Speak response out loud!
            AlfernexSpeechManager.shared.speak(text: response) { [weak self] in
                guard let self = self, self.isVoiceActive else { return }
                self.listenForUserVoice()
            }
        }
    }
    
    public func endVoice() {
        self.isVoiceActive = false
        self.voiceStateText = "LISTO"
        AlfernexSpeechManager.shared.stopSpeaking()
        AlfernexSpeechManager.shared.stopListening()
    }
    
    public func toggleMute() {
        self.isMuted.toggle()
        if isMuted {
            AlfernexSpeechManager.shared.stopListening()
            self.voiceStateText = "MUTED"
        } else {
            if isVoiceActive && !AlfernexSpeechManager.shared.isSpeaking {
                listenForUserVoice()
            }
        }
    }
    
    // MARK: - Chat Logic
    public func openChat(with agent: Agent) {
        self.chattingAgent = agent
        if self.chatMessages[agent.id] == nil || self.chatMessages[agent.id]!.isEmpty {
            self.chatMessages[agent.id] = [
                ChatMessageItem(
                    sender: "agent",
                    senderName: agent.name,
                    text: "Hola Alexis. Soy \(agent.name). ¿En qué te ayudo hoy con tus operaciones?",
                    timestamp: "Ahora",
                    agentId: agent.id
                )
            ]
        }
        self.isChatSheetPresented = true
    }
    
    public func sendChatMessage(agent: Agent, text: String, speakResponse: Bool = true) {
        var currentMsgs = self.chatMessages[agent.id] ?? []
        
        // User message
        let userMsg = ChatMessageItem(sender: "user", senderName: "Alexis", text: text, agentId: agent.id)
        currentMsgs.append(userMsg)
        self.chatMessages[agent.id] = currentMsgs
        
        // Asynchronously call Vercel API and speak response
        Task {
            let vercelRes = await AlfernexAPIService.shared.sendChatMessage(agentId: agent.id, message: text)
            let replyText = vercelRes?.reply ?? AlfernexSpeechManager.shared.generateResponse(for: agent, query: text)
            
            let agentMsg = ChatMessageItem(sender: "agent", senderName: agent.name, text: replyText, agentId: agent.id)
            var updated = self.chatMessages[agent.id] ?? []
            updated.append(agentMsg)
            self.chatMessages[agent.id] = updated
            
            if speakResponse {
                AlfernexSpeechManager.shared.speak(text: replyText)
            }
        }
    }
    
    public func broadcastDirective(title: String, desc: String) {
        self.currentDirective = title
        self.liveActivities.insert(
            LiveActivityItem(id: UUID().uuidString, agentName: "ALEXIS (CEO)", agentHexColor: "#f59e0b", message: "ORDEN PRESIDENCIAL: \(title)", timestamp: "Ahora"),
            at: 0
        )
        
        // Push directly to Vercel
        Task {
            _ = await AlfernexAPIService.shared.broadcastDirective(title: title, description: desc)
        }
    }
    
    private func agRoleShort(_ role: String) -> String {
        role.components(separatedBy: "•").first?.trimmingCharacters(in: .whitespaces) ?? role
    }
}

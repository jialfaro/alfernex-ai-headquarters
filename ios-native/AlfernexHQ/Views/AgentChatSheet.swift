import SwiftUI

public struct AgentChatSheet: View {
    @ObservedObject var vm: HQViewModel
    @Environment(\.dismiss) private var dismiss
    
    @State private var inputText: String = ""
    @State private var isDictating: Bool = false
    @State private var autoSpeakResponse: Bool = true
    
    var agent: Agent {
        vm.chattingAgent ?? vm.agents[0]
    }
    
    var messages: [ChatMessageItem] {
        vm.chatMessages[agent.id] ?? []
    }
    
    var suggestedPrompts: [String] {
        switch agent.id {
        case "tradium-trading":
            return [
                "¿Cuál es el PnL y balance actual en Hyperliquid?",
                "Explica la regla de reinversión del 50%",
                "¿Qué señales de trading detectas en ETH y BTC?"
            ]
        case "vyra-growth":
            return [
                "¿Cómo escalamos a S/. 10,000 al día en Shopify?",
                "Genera 3 ganchos virales para TikTok Ads",
                "¿Cuál es el CPA actual en Lima?"
            ]
        case "max-developer":
            return [
                "¿Cómo está la velocidad del checkout móvil?",
                "Verifica la latencia de Next.js y Vercel",
                "Revisa el botón de Pedido Rápido 1-Click"
            ]
        case "echo-sales":
            return [
                "¿Cuántos pedidos contra entrega hay confirmados?",
                "¿Cómo van los envíos con Olva y Shalom?",
                "Dame el porcentaje de confirmación por WhatsApp"
            ]
        case "nex-data":
            return [
                "¿Cuál es la ganancia neta proyectada de hoy en Soles?",
                "¿Cuál es el margen real descontando flete Dropi?",
                "Dame un resumen del flujo de caja"
            ]
        default:
            return [
                "¿En qué estás trabajando actualmente?",
                "Dame tu reporte ejecutivo de hoy",
                "¿Cómo podemos optimizar tus tareas?"
            ]
        }
    }
    
    public var body: some View {
        NavigationView {
            ZStack {
                Color(hex: "#030611").ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Header Sub-bar
                    HStack(spacing: 12) {
                        Circle()
                            .fill(agent.color)
                            .frame(width: 42, height: 42)
                            .overlay(
                                Text(String(agent.name.prefix(2)))
                                    .font(.system(size: 14, weight: .black, design: .monospaced))
                                    .foregroundColor(.white)
                            )
                            .shadow(color: agent.color.opacity(0.4), radius: 6)
                        
                        VStack(alignment: .leading, spacing: 2) {
                            HStack(spacing: 6) {
                                Text(agent.name)
                                    .font(.system(size: 16, weight: .black, design: .monospaced))
                                    .foregroundColor(.white)
                                
                                Circle().fill(Color.green).frame(width: 6, height: 6)
                                Text("ONLINE")
                                    .font(.system(size: 8, weight: .bold, design: .monospaced))
                                    .foregroundColor(.green)
                            }
                            
                            Text(agent.role)
                                .font(.system(size: 11))
                                .foregroundColor(.gray)
                                .lineLimit(1)
                        }
                        
                        Spacer()
                        
                        // Auto-speak audio toggle
                        Button {
                            autoSpeakResponse.toggle()
                        } label: {
                            Image(systemName: autoSpeakResponse ? "speaker.wave.2.fill" : "speaker.slash.fill")
                                .font(.system(size: 14))
                                .foregroundColor(autoSpeakResponse ? .cyan : .gray)
                                .padding(8)
                                .background(Color.white.opacity(0.06))
                                .clipShape(Circle())
                        }
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 10)
                    .background(Color.white.opacity(0.03))
                    .overlay(
                        Rectangle().frame(height: 0.5).foregroundColor(Color.white.opacity(0.08)),
                        alignment: .bottom
                    )
                    
                    // Messages Feed
                    ScrollViewReader { proxy in
                        ScrollView {
                            LazyVStack(spacing: 12) {
                                ForEach(messages) { msg in
                                    messageRow(msg: msg)
                                }
                                
                                Color.clear
                                    .frame(height: 1)
                                    .id("bottom")
                            }
                            .padding(.horizontal)
                            .padding(.top, 14)
                            .padding(.bottom, 8)
                        }
                        .onChange(of: messages.count) { _ in
                            withAnimation {
                                proxy.scrollTo("bottom", anchor: .bottom)
                            }
                        }
                    }
                    
                    // Quick Prompt Chips
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(suggestedPrompts, id: \.self) { prompt in
                                Button {
                                    sendMessage(text: prompt)
                                } label: {
                                    Text(prompt)
                                        .font(.system(size: 10, design: .monospaced))
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 6)
                                        .background(Color.white.opacity(0.05))
                                        .foregroundColor(.white.opacity(0.85))
                                        .cornerRadius(12)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 12)
                                                .stroke(Color.white.opacity(0.12), lineWidth: 0.5)
                                        )
                                }
                            }
                        }
                        .padding(.horizontal)
                        .padding(.vertical, 6)
                    }
                    .background(Color.white.opacity(0.02))
                    
                    // Input Bar
                    HStack(spacing: 8) {
                        // Dictation Button
                        Button {
                            toggleDictation()
                        } label: {
                            Image(systemName: isDictating ? "waveform.badge.mic" : "mic.fill")
                                .font(.system(size: 15))
                                .foregroundColor(isDictating ? .red : .cyan)
                                .frame(width: 38, height: 38)
                                .background(isDictating ? Color.red.opacity(0.2) : Color.white.opacity(0.06))
                                .clipShape(Circle())
                        }
                        
                        TextField("Escribe a \(agent.name)...", text: $inputText)
                            .font(.system(size: 13))
                            .foregroundColor(.white)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 10)
                            .background(Color.white.opacity(0.06))
                            .cornerRadius(20)
                            .onSubmit {
                                sendMessage(text: inputText)
                            }
                        
                        // Send Button
                        Button {
                            sendMessage(text: inputText)
                        } label: {
                            Image(systemName: "arrow.up.circle.fill")
                                .font(.system(size: 28))
                                .foregroundColor(inputText.trimmingCharacters(in: .whitespaces).isEmpty ? .gray : .cyan)
                        }
                        .disabled(inputText.trimmingCharacters(in: .whitespaces).isEmpty)
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 10)
                    .background(Color.black.opacity(0.6))
                    .overlay(
                        Rectangle().frame(height: 0.5).foregroundColor(Color.white.opacity(0.1)),
                        alignment: .top
                    )
                }
            }
            .navigationTitle("Chat Corporativo")
            #if os(iOS)
            .navigationBarTitleDisplayMode(.inline)
            #endif
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cerrar") {
                        AlfernexSpeechManager.shared.stopSpeaking()
                        AlfernexSpeechManager.shared.stopListening()
                        dismiss()
                    }
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.gray)
                }
                
                ToolbarItem(placement: .confirmationAction) {
                    Button {
                        AlfernexSpeechManager.shared.stopSpeaking()
                        dismiss()
                        vm.startVoice(with: agent)
                    } label: {
                        HStack(spacing: 4) {
                            Image(systemName: "phone.fill")
                            Text("Llamar")
                        }
                        .font(.system(size: 12, weight: .bold, design: .monospaced))
                        .foregroundColor(.cyan)
                    }
                }
            }
        }
        .preferredColorScheme(.dark)
    }
    
    @ViewBuilder
    private func messageRow(msg: ChatMessageItem) -> some View {
        let isUser = msg.sender == "user"
        
        HStack(alignment: .bottom, spacing: 8) {
            if isUser {
                Spacer()
            } else {
                Circle()
                    .fill(agent.color)
                    .frame(width: 26, height: 26)
                    .overlay(
                        Text(String(agent.name.prefix(1)))
                            .font(.system(size: 10, weight: .black, design: .monospaced))
                            .foregroundColor(.white)
                    )
            }
            
            VStack(alignment: isUser ? .trailing : .leading, spacing: 4) {
                Text(msg.text)
                    .font(.system(size: 13))
                    .foregroundColor(isUser ? .white : .white.opacity(0.95))
                    .padding(.horizontal, 14)
                    .padding(.vertical, 10)
                    .background(
                        isUser
                            ? LinearGradient(colors: [Color.cyan.opacity(0.8), Color.blue.opacity(0.8)], startPoint: .topLeading, endPoint: .bottomTrailing)
                            : LinearGradient(colors: [Color.white.opacity(0.08), Color.white.opacity(0.04)], startPoint: .topLeading, endPoint: .bottomTrailing)
                    )
                    .cornerRadius(18)
                
                HStack(spacing: 6) {
                    Text(msg.timestamp)
                        .font(.system(size: 9, design: .monospaced))
                        .foregroundColor(.gray)
                    
                    if !isUser {
                        Button {
                            AlfernexSpeechManager.shared.speak(text: msg.text)
                        } label: {
                            Image(systemName: "speaker.wave.1.fill")
                                .font(.system(size: 10))
                                .foregroundColor(.cyan)
                        }
                    }
                }
            }
            
            if !isUser {
                Spacer()
            }
        }
    }
    
    private func sendMessage(text: String) {
        let clean = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !clean.isEmpty else { return }
        
        inputText = ""
        vm.sendChatMessage(agent: agent, text: clean, speakResponse: autoSpeakResponse)
    }
    
    private func toggleDictation() {
        if isDictating {
            AlfernexSpeechManager.shared.stopListening()
            isDictating = false
        } else {
            AlfernexSpeechManager.shared.requestPermissions { granted in
                if granted {
                    isDictating = true
                    AlfernexSpeechManager.shared.startListening(
                        onTranscript: { transcript in
                            self.inputText = transcript
                        },
                        onFinal: { finalTranscript in
                            self.inputText = finalTranscript
                            self.isDictating = false
                        }
                    )
                }
            }
        }
    }
}

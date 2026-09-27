import SwiftUI

public struct VoiceCallView: View {
    @ObservedObject var vm: HQViewModel
    @ObservedObject private var speechManager = AlfernexSpeechManager.shared
    
    @State private var orbScale: CGFloat = 1.0
    @State private var isManualInputPresented: Bool = false
    @State private var quickCommandText: String = ""
    
    var agent: Agent {
        vm.activeVoiceAgent ?? vm.agents[0]
    }
    
    var quickPrompts: [String] {
        switch agent.id {
        case "tradium-trading":
            return [
                "¿Cuál es el PnL y balance en Hyperliquid?",
                "Explica la regla del 50% compounding",
                "¿Qué señales detectas en ETH y BTC?"
            ]
        case "vyra-growth":
            return [
                "¿Cómo escalamos a S/. 10,000 al día?",
                "3 ganchos virales para TikTok Ads",
                "¿Cuál es el CPA actual en Lima?"
            ]
        case "max-developer":
            return [
                "¿Cómo está la latencia de la tienda?",
                "Verifica el botón de 1-Click checkout"
            ]
        case "echo-sales":
            return [
                "¿Cuántos pedidos contra entrega hay hoy?",
                "Reporte de envíos con Olva Courier"
            ]
        case "nex-data":
            return [
                "¿Cuál es la ganancia neta en Soles?",
                "Dame el margen tras flete Dropi"
            ]
        default:
            return [
                "Dame tu reporte ejecutivo de hoy",
                "¿En qué estás trabajando ahora?"
            ]
        }
    }
    
    public var body: some View {
        VStack(spacing: 16) {
            // Header Info
            VStack(spacing: 4) {
                HStack(spacing: 6) {
                    Circle().fill(vm.isVoiceActive ? Color.green : Color.gray).frame(width: 8, height: 8)
                    Text(vm.isVoiceActive ? "CANAL NEURONAL DE VOZ DIRECTA ACTIVO" : "CANAL DISPONIBLE")
                        .font(.system(size: 9.5, weight: .black, design: .monospaced))
                        .foregroundColor(vm.isVoiceActive ? .green : .gray)
                }
                
                Text(agent.name)
                    .font(.system(size: 26, weight: .black, design: .monospaced))
                    .foregroundColor(.white)
                
                Text(agent.role)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.gray)
                    .lineLimit(1)
            }
            .padding(.top, 4)
            
            Spacer()
            
            // Pulsing Holographic Orb (Interactive: Tap to talk or interrupt)
            Button {
                if !vm.isVoiceActive {
                    vm.startVoice(with: agent)
                } else if speechManager.isSpeaking {
                    AlfernexSpeechManager.shared.stopSpeaking()
                    vm.listenForUserVoice()
                } else if !speechManager.isListening {
                    vm.listenForUserVoice()
                }
            } label: {
                ZStack {
                    // Outer Glow Aura
                    Circle()
                        .fill(agent.color.opacity(vm.isVoiceActive ? 0.25 : 0.08))
                        .frame(width: 210, height: 210)
                        .scaleEffect(vm.isVoiceActive ? (speechManager.isSpeaking || speechManager.isListening ? 1.15 : orbScale) : 1.0)
                        .animation(.easeInOut(duration: 0.9).repeatForever(autoreverses: true), value: orbScale)
                    
                    // Middle Glass Ring
                    Circle()
                        .stroke(agent.color.opacity(0.8), lineWidth: 2)
                        .frame(width: 165, height: 165)
                        .shadow(color: agent.color.opacity(0.6), radius: vm.isVoiceActive ? 35 : 10)
                        .background(
                            Circle().fill(Color.black.opacity(0.85))
                        )
                    
                    VStack(spacing: 8) {
                        Image(systemName: speechManager.isSpeaking ? "waveform" : speechManager.isListening ? "mic.fill" : "waveform.circle")
                            .font(.system(size: 42))
                            .foregroundColor(speechManager.isListening ? .green : agent.color)
                            .symbolEffect(.bounce, value: speechManager.isListening)
                        
                        Text(speechManager.isSpeaking ? "HABLANDO..." : speechManager.isListening ? "ESCUCHANDO..." : vm.voiceStateText)
                            .font(.system(size: 10.5, weight: .black, design: .monospaced))
                            .foregroundColor(.white)
                        
                        if vm.isVoiceActive {
                            Text(speechManager.isListening ? "Habla ahora" : "Toca para hablar")
                                .font(.system(size: 9, design: .monospaced))
                                .foregroundColor(speechManager.isListening ? .green : .cyan)
                        }
                    }
                }
            }
            .buttonStyle(.plain)
            .onAppear {
                orbScale = 1.08
            }
            
            Spacer()
            
            // Live Real-Time Speech Feedback or Transcript
            VStack(alignment: .leading, spacing: 6) {
                if !speechManager.liveUserSpeech.isEmpty {
                    HStack(spacing: 6) {
                        Circle().fill(Color.cyan).frame(width: 6, height: 6)
                        Text("TÚ (HABLANDO EN VIVO):")
                            .font(.system(size: 9.5, weight: .black, design: .monospaced))
                            .foregroundColor(.cyan)
                    }
                    Text(speechManager.liveUserSpeech)
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(.white)
                } else if let last = vm.voiceTranscripts.last {
                    HStack(spacing: 6) {
                        Text("\(last.sender):")
                            .font(.system(size: 10, weight: .black, design: .monospaced))
                            .foregroundColor(last.sender == "Alexis (CEO)" ? .cyan : agent.color)
                        
                        Spacer()
                        
                        Button {
                            AlfernexSpeechManager.shared.speak(text: last.text)
                        } label: {
                            Image(systemName: "speaker.wave.2.fill")
                                .font(.system(size: 11))
                                .foregroundColor(.cyan)
                        }
                    }
                    
                    Text(last.text)
                        .font(.system(size: 12.5))
                        .foregroundColor(.white.opacity(0.95))
                        .lineLimit(3)
                } else {
                    Text("Inicia la llamada y habla en español. \(agent.name) te responderá por voz de forma instantánea.")
                        .font(.system(size: 11.5))
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                        .frame(maxWidth: .infinity)
                }
            }
            .padding(14)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.white.opacity(0.04))
            .cornerRadius(16)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(Color.white.opacity(0.08), lineWidth: 1)
            )
            .padding(.horizontal)
            
            // Quick Commands Bar (1-Tap voice command)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(quickPrompts, id: \.self) { prompt in
                        Button {
                            if !vm.isVoiceActive {
                                vm.startVoice(with: agent)
                            }
                            vm.submitUserVoiceQuery(text: prompt)
                        } label: {
                            Text(prompt)
                                .font(.system(size: 10, weight: .medium, design: .monospaced))
                                .padding(.horizontal, 10)
                                .padding(.vertical, 6)
                                .background(Color.cyan.opacity(0.12))
                                .foregroundColor(.cyan)
                                .cornerRadius(12)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(Color.cyan.opacity(0.3), lineWidth: 0.5)
                                )
                        }
                    }
                }
                .padding(.horizontal)
            }
            
            // Call Controls Bar
            HStack(spacing: 20) {
                // Mute
                Button {
                    vm.toggleMute()
                } label: {
                    Image(systemName: vm.isMuted ? "mic.slash.fill" : "mic.fill")
                        .font(.system(size: 18))
                        .foregroundColor(vm.isMuted ? .orange : .white)
                        .frame(width: 50, height: 50)
                        .background(Color.white.opacity(0.08))
                        .clipShape(Circle())
                }
                
                // End Call or Start Call
                if vm.isVoiceActive {
                    Button {
                        vm.endVoice()
                    } label: {
                        Image(systemName: "phone.down.fill")
                            .font(.system(size: 22))
                            .foregroundColor(.white)
                            .frame(width: 64, height: 64)
                            .background(Color.red)
                            .clipShape(Circle())
                            .shadow(color: Color.red.opacity(0.5), radius: 15)
                    }
                } else {
                    Button {
                        vm.startVoice(with: agent)
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: "phone.fill")
                            Text("LLAMAR")
                        }
                        .font(.system(size: 13, weight: .black, design: .monospaced))
                        .foregroundColor(.black)
                        .padding(.horizontal, 24)
                        .frame(height: 58)
                        .background(
                            LinearGradient(colors: [Color.green, Color.mint], startPoint: .leading, endPoint: .trailing)
                        )
                        .clipShape(Capsule())
                        .shadow(color: Color.green.opacity(0.5), radius: 15)
                    }
                }
                
                // Open Chat Sheet directly
                Button {
                    vm.openChat(with: agent)
                } label: {
                    Image(systemName: "message.fill")
                        .font(.system(size: 18))
                        .foregroundColor(.white)
                        .frame(width: 50, height: 50)
                        .background(Color.white.opacity(0.08))
                        .clipShape(Circle())
                }
            }
            .padding(.bottom, 68)
        }
        .padding(.horizontal)
    }
}

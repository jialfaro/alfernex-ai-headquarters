import SwiftUI

public struct DynamicIslandHUD: View {
    @ObservedObject var vm: HQViewModel
    @State private var isExpanded: Bool = false
    
    public var body: some View {
        HStack {
            Spacer()
            
            Button {
                withAnimation(.spring(response: 0.35, dampingFraction: 0.75)) {
                    isExpanded.toggle()
                }
            } label: {
                if isExpanded {
                    // Expanded View
                    VStack(alignment: .leading, spacing: 10) {
                        HStack(spacing: 10) {
                            if let agent = vm.activeVoiceAgent {
                                Circle()
                                    .fill(agent.color)
                                    .frame(width: 32, height: 32)
                                    .overlay(
                                        Text(String(agent.name.prefix(2)))
                                            .font(.system(size: 11, weight: .black, design: .monospaced))
                                            .foregroundColor(.white)
                                    )
                                
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(agent.name)
                                        .font(.system(size: 13, weight: .bold, design: .monospaced))
                                        .foregroundColor(.white)
                                    Text(vm.isVoiceActive ? "VOZ ACTIVA • EN LÍNEA" : "STANDBY")
                                        .font(.system(size: 10, weight: .medium, design: .monospaced))
                                        .foregroundColor(.cyan)
                                }
                            }
                            
                            Spacer()
                            
                            if vm.isVoiceActive {
                                Button {
                                    vm.endVoice()
                                } label: {
                                    Image(systemName: "phone.down.fill")
                                        .foregroundColor(.white)
                                        .padding(8)
                                        .background(Color.red.opacity(0.8))
                                        .clipShape(Circle())
                                }
                            }
                        }
                        
                        // Waveform animation
                        HStack(spacing: 3) {
                            ForEach(0..<20) { i in
                                RoundedRectangle(cornerRadius: 2)
                                    .fill(Color.cyan)
                                    .frame(width: 3, height: vm.isVoiceActive ? CGFloat.random(in: 4...18) : 4)
                                    .animation(.easeInOut(duration: 0.2).repeatForever(), value: vm.isVoiceActive)
                            }
                        }
                        .frame(maxWidth: .infinity)
                    }
                    .padding(14)
                    .frame(width: 360)
                    .background(Color.black.opacity(0.95))
                    .clipShape(RoundedRectangle(cornerRadius: 32, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: 32, style: .continuous)
                            .stroke(Color.white.opacity(0.15), lineWidth: 1)
                    )
                } else {
                    // Compact Dynamic Island Pill
                    HStack(spacing: 8) {
                        Circle()
                            .fill(Color.green)
                            .frame(width: 8, height: 8)
                        
                        Text(vm.isVoiceActive ? (vm.activeVoiceAgent?.name ?? "ALFERNEX") : "ALFERNEX")
                            .font(.system(size: 11, weight: .black, design: .monospaced))
                            .foregroundColor(.white)
                        
                        Spacer()
                        
                        if vm.isVoiceActive {
                            HStack(spacing: 2) {
                                RoundedRectangle(cornerRadius: 1).fill(Color.cyan).frame(width: 2, height: 6)
                                RoundedRectangle(cornerRadius: 1).fill(Color.cyan).frame(width: 2, height: 12)
                                RoundedRectangle(cornerRadius: 1).fill(Color.cyan).frame(width: 2, height: 8)
                            }
                        } else {
                            Text("11 AGENTES")
                                .font(.system(size: 9.5, weight: .bold, design: .monospaced))
                                .foregroundColor(.cyan)
                        }
                    }
                    .padding(.horizontal, 14)
                    .frame(width: 210, height: 36)
                    .background(Color.black.opacity(0.95))
                    .clipShape(Capsule())
                    .overlay(
                        Capsule().stroke(Color.white.opacity(0.15), lineWidth: 1)
                    )
                }
            }
            .buttonStyle(.plain)
            
            Spacer()
        }
        .padding(.top, 4)
    }
}

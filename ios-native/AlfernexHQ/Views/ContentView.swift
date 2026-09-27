import SwiftUI

public struct ContentView: View {
    @StateObject private var vm = HQViewModel()
    
    public init() {}
    
    public var body: some View {
        ZStack(alignment: .top) {
            // Main Background
            Color(hex: "#030611").ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Dynamic Island HUD
                DynamicIslandHUD(vm: vm)
                    .zIndex(10)
                
                // Active Screen
                TabView(selection: $vm.selectedTab) {
                    DashboardView(vm: vm)
                        .tag(0)
                    
                    AgentRosterView(vm: vm)
                        .tag(1)
                    
                    VoiceCallView(vm: vm)
                        .tag(2)
                    
                    WarRoomView(vm: vm)
                        .tag(3)
                }
                #if os(iOS)
                .tabViewStyle(.page(indexDisplayMode: .never))
                #endif
            }
            
            // Custom iOS Glassmorphism Bottom Tab Bar
            VStack {
                Spacer()
                
                HStack(spacing: 0) {
                    // Tab 0: Comando
                    tabButton(index: 0, title: "Comando", icon: "square.grid.2x2.fill")
                    
                    // Tab 1: 11 Agentes
                    tabButton(index: 1, title: "11 Agentes", icon: "person.3.fill", badge: "11")
                    
                    // Tab 2: Voz Directa
                    Button {
                        vm.selectedTab = 2
                    } label: {
                        VStack(spacing: 4) {
                            ZStack {
                                Circle()
                                    .fill(
                                        LinearGradient(colors: [Color.cyan, Color.blue], startPoint: .topLeading, endPoint: .bottomTrailing)
                                    )
                                    .frame(width: 48, height: 48)
                                    .shadow(color: Color.cyan.opacity(0.5), radius: vm.isVoiceActive ? 12 : 6)
                                
                                Image(systemName: "mic.fill")
                                    .foregroundColor(.black)
                                    .font(.system(size: 20, weight: .bold))
                            }
                            .offset(y: -14)
                            
                            Text("Voz")
                                .font(.system(size: 10, weight: .black, design: .monospaced))
                                .foregroundColor(vm.selectedTab == 2 ? .cyan : .gray)
                                .offset(y: -10)
                        }
                        .frame(maxWidth: .infinity)
                    }
                    
                    // Tab 3: War Room
                    tabButton(index: 3, title: "War Room", icon: "chart.xyaxis.line")
                }
                .padding(.horizontal, 16)
                .padding(.top, 10)
                .padding(.bottom, 24)
                .background(
                    Color(hex: "#030611").opacity(0.85)
                        .background(.ultraThinMaterial)
                )
                .overlay(
                    Rectangle().frame(height: 0.5).foregroundColor(Color.white.opacity(0.12)),
                    alignment: .top
                )
            }
            .ignoresSafeArea(edges: .bottom)
        }
        .sheet(isPresented: $vm.isChatSheetPresented) {
            AgentChatSheet(vm: vm)
        }
        .preferredColorScheme(.dark)
    }
    
    @ViewBuilder
    private func tabButton(index: Int, title: String, icon: String, badge: String? = nil) -> some View {
        Button {
            vm.selectedTab = index
        } label: {
            VStack(spacing: 4) {
                ZStack(alignment: .topTrailing) {
                    Image(systemName: icon)
                        .font(.system(size: 20, weight: vm.selectedTab == index ? .bold : .medium))
                        .foregroundColor(vm.selectedTab == index ? .cyan : .gray)
                        .frame(width: 28, height: 28)
                    
                    if let badge = badge {
                        Text(badge)
                            .font(.system(size: 8, weight: .black, design: .monospaced))
                            .padding(.horizontal, 4)
                            .padding(.vertical, 1)
                            .background(Color.cyan)
                            .foregroundColor(.black)
                            .clipShape(Capsule())
                            .offset(x: 10, y: -4)
                    }
                }
                
                Text(title)
                    .font(.system(size: 10, weight: vm.selectedTab == index ? .bold : .medium, design: .monospaced))
                    .foregroundColor(vm.selectedTab == index ? .cyan : .gray)
            }
            .frame(maxWidth: .infinity)
        }
    }
}

import SwiftUI

public struct DashboardView: View {
    @ObservedObject var vm: HQViewModel
    @State private var showingDirectiveAlert: Bool = false
    @State private var directiveText: String = ""
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 16) {
                // Header CEO
                HStack(spacing: 10) {
                    ZStack {
                        RoundedRectangle(cornerRadius: 10)
                            .fill(Color.orange.opacity(0.2))
                            .frame(width: 36, height: 36)
                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.orange.opacity(0.4), lineWidth: 1))
                        
                        Image(systemName: "crown.fill")
                            .foregroundColor(.orange)
                            .font(.system(size: 16))
                    }
                    
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Alexis • CEO & Dueño")
                            .font(.system(size: 14, weight: .black, design: .monospaced))
                            .foregroundColor(.white)
                        Text("ALFERNEX CORP • Lima, Perú • DEFCON OPTIMAL")
                            .font(.system(size: 10, weight: .medium, design: .monospaced))
                            .foregroundColor(.gray)
                    }
                    
                    Spacer()
                    
                    Button {
                        Task {
                            await vm.syncWithVercel()
                        }
                    } label: {
                        HStack(spacing: 4) {
                            if vm.isSyncingWithVercel {
                                ProgressView()
                                    .scaleEffect(0.6)
                                    .tint(.green)
                            } else {
                                Circle()
                                    .fill(vm.syncStatusText == "VERCEL SYNCED" ? Color.green : Color.orange)
                                    .frame(width: 6, height: 6)
                            }
                            Text(vm.syncStatusText)
                                .font(.system(size: 8.5, weight: .black, design: .monospaced))
                                .foregroundColor(vm.syncStatusText == "VERCEL SYNCED" ? .green : .orange)
                        }
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background((vm.syncStatusText == "VERCEL SYNCED" ? Color.green : Color.orange).opacity(0.12))
                        .cornerRadius(8)
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke((vm.syncStatusText == "VERCEL SYNCED" ? Color.green : Color.orange).opacity(0.3), lineWidth: 1))
                    }
                }
                .padding(.horizontal)
                .padding(.top, 8)
                
                // Hero KPI Telemetry (Shopify & Tradium)
                HStack(spacing: 12) {
                    // Shopify Card
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Label("Shopify Ventas", systemImage: "bag.fill")
                                .font(.system(size: 10, weight: .bold, design: .monospaced))
                                .foregroundColor(.green)
                            Spacer()
                            Image(systemName: "arrow.up.right")
                                .font(.system(size: 10))
                                .foregroundColor(.green)
                        }
                        
                        Text(String(format: "S/. %.2f", vm.shopifyTelemetry.grossRevenuePEN))
                            .font(.system(size: 20, weight: .black, design: .monospaced))
                            .foregroundColor(.white)
                        
                        Text(vm.shopifyTelemetry.totalOrdersToday > 0 ? "Neto: S/. \(Int(vm.shopifyTelemetry.netProfitPEN)) • \(vm.shopifyTelemetry.totalOrdersToday) órdenes" : "Sin ventas aún • 0 órdenes")
                            .font(.system(size: 9.5, weight: .medium, design: .monospaced))
                            .foregroundColor(vm.shopifyTelemetry.totalOrdersToday > 0 ? .green.opacity(0.9) : .gray)
                        
                        Text("Dropi Perú ID: \(vm.shopifyTelemetry.dropiAccount)")
                            .font(.system(size: 8.5, weight: .bold, design: .monospaced))
                            .foregroundColor(.gray)
                    }
                    .padding(14)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color(hex: "#061810").opacity(0.7))
                    .cornerRadius(20)
                    .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color.green.opacity(0.3), lineWidth: 1))
                    
                    // Tradium Trading Card
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Label("Hyperliquid PnL", systemImage: "chart.line.uptrend.xyaxis")
                                .font(.system(size: 10, weight: .bold, design: .monospaced))
                                .foregroundColor(.cyan)
                            Spacer()
                            Text("TRADIUM")
                                .font(.system(size: 8, weight: .black, design: .monospaced))
                                .padding(.horizontal, 4)
                                .padding(.vertical, 2)
                                .background(Color.cyan.opacity(0.2))
                                .cornerRadius(4)
                                .foregroundColor(.cyan)
                        }
                        
                        Text("$\(Int(vm.tradingTelemetry.equityUSDC))")
                            .font(.system(size: 20, weight: .black, design: .monospaced))
                            .foregroundColor(.white)
                        
                        Text("PnL +$\(Int(vm.tradingTelemetry.todayPnLUSDC)) (+3.45%)")
                            .font(.system(size: 9.5, weight: .medium, design: .monospaced))
                            .foregroundColor(.cyan.opacity(0.9))
                        
                        Text("Sharpe 2.85 • Win Rate 68.4%")
                            .font(.system(size: 8.5, weight: .bold, design: .monospaced))
                            .foregroundColor(.gray)
                    }
                    .padding(14)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color(hex: "#041424").opacity(0.7))
                    .cornerRadius(20)
                    .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color.cyan.opacity(0.3), lineWidth: 1))
                }
                .padding(.horizontal)
                
                // Quick Executive Actions
                VStack(alignment: .leading, spacing: 10) {
                    Text("ACCIONES EJECUTIVAS RÁPIDAS")
                        .font(.system(size: 10.5, weight: .black, design: .monospaced))
                        .foregroundColor(.gray)
                        .padding(.horizontal)
                    
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                        // Action 1: Tradium Voice Call
                        if let tradium = vm.agents.first(where: { $0.id == "tradium-trading" }) {
                            Button {
                                vm.startVoice(with: tradium)
                            } label: {
                                HStack(spacing: 8) {
                                    Image(systemName: "bolt.fill").foregroundColor(.green)
                                    VStack(alignment: .leading, spacing: 1) {
                                        Text("Hablar con Tradium")
                                            .font(.system(size: 12, weight: .bold, design: .monospaced))
                                            .foregroundColor(.white)
                                        Text("Trading & Trades")
                                            .font(.system(size: 9, design: .monospaced))
                                            .foregroundColor(.gray)
                                    }
                                    Spacer()
                                }
                                .padding(12)
                                .background(Color.green.opacity(0.12))
                                .cornerRadius(16)
                                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.green.opacity(0.3), lineWidth: 1))
                            }
                        }
                        
                        // Action 2: Vyra Voice Call
                        if let vyra = vm.agents.first(where: { $0.id == "vyra-growth" }) {
                            Button {
                                vm.startVoice(with: vyra)
                            } label: {
                                HStack(spacing: 8) {
                                    Image(systemName: "flame.fill").foregroundColor(.pink)
                                    VStack(alignment: .leading, spacing: 1) {
                                        Text("Hablar con Vyra")
                                            .font(.system(size: 12, weight: .bold, design: .monospaced))
                                            .foregroundColor(.white)
                                        Text("TikTok Ads ROAS")
                                            .font(.system(size: 9, design: .monospaced))
                                            .foregroundColor(.gray)
                                    }
                                    Spacer()
                                }
                                .padding(12)
                                .background(Color.pink.opacity(0.12))
                                .cornerRadius(16)
                                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.pink.opacity(0.3), lineWidth: 1))
                            }
                        }
                    }
                    .padding(.horizontal)
                }
                
                // Master Directive Banner
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Label("DIRECTIVA SUPREMA EN CURSO", systemImage: "shield.checkmark.fill")
                            .font(.system(size: 10, weight: .bold, design: .monospaced))
                            .foregroundColor(.orange)
                        Spacer()
                        Button {
                            directiveText = vm.currentDirective
                            showingDirectiveAlert = true
                        } label: {
                            HStack(spacing: 4) {
                                Image(systemName: "paperplane.fill")
                                    .font(.system(size: 8))
                                Text("EMITIR ORDEN")
                                    .font(.system(size: 8.5, weight: .black, design: .monospaced))
                            }
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color.orange.opacity(0.2))
                            .cornerRadius(6)
                            .foregroundColor(.orange)
                        }
                    }
                    
                    Text(vm.currentDirective)
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.white)
                }
                .padding(14)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color.orange.opacity(0.08))
                .cornerRadius(20)
                .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color.orange.opacity(0.3), lineWidth: 1))
                .padding(.horizontal)
                
                // Live Activity Feed
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        Label("TELEMETRÍA EN VIVO", systemImage: "waveform.path.ecg")
                            .font(.system(size: 10.5, weight: .black, design: .monospaced))
                            .foregroundColor(.gray)
                        Spacer()
                        HStack(spacing: 6) {
                            HStack(spacing: 3) {
                                Image(systemName: "sparkles")
                                    .foregroundColor(.purple)
                                    .font(.system(size: 8))
                                Text("GEMINI 3.8 FLASH")
                                    .font(.system(size: 8.5, weight: .bold, design: .monospaced))
                                    .foregroundColor(.purple)
                            }
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.purple.opacity(0.15))
                            .cornerRadius(4)
                            
                            HStack(spacing: 4) {
                                Circle().fill(Color.green).frame(width: 6, height: 6)
                                Text("11 ONLINE")
                                    .font(.system(size: 9.5, weight: .bold, design: .monospaced))
                                    .foregroundColor(.green)
                            }
                        }
                    }
                    .padding(.horizontal)
                    
                    VStack(spacing: 8) {
                        ForEach(vm.liveActivities) { act in
                            HStack(alignment: .top, spacing: 10) {
                                Circle()
                                    .fill(Color(hex: act.agentHexColor))
                                    .frame(width: 8, height: 8)
                                    .padding(.top, 4)
                                
                                VStack(alignment: .leading, spacing: 2) {
                                    HStack {
                                        Text(act.agentName)
                                            .font(.system(size: 11, weight: .bold, design: .monospaced))
                                            .foregroundColor(.white)
                                        Spacer()
                                        Text(act.timestamp)
                                            .font(.system(size: 9, design: .monospaced))
                                            .foregroundColor(.gray)
                                    }
                                    Text(act.message)
                                        .font(.system(size: 11))
                                        .foregroundColor(.white.opacity(0.85))
                                        .lineLimit(2)
                                }
                            }
                            .padding(12)
                            .background(Color.white.opacity(0.04))
                            .cornerRadius(14)
                        }
                    }
                    .padding(.horizontal)
                }
                
                Spacer(minLength: 40)
            }
        }
        .refreshable {
            await vm.syncWithVercel()
        }
        .alert("Nueva Directiva Presidencial", isPresented: $showingDirectiveAlert) {
            TextField("Escribe la orden para los 11 agentes...", text: $directiveText)
            Button("Cancelar", role: .cancel) { }
            Button("Transmitir a Vercel") {
                let trimmed = directiveText.trimmingCharacters(in: .whitespacesAndNewlines)
                if !trimmed.isEmpty {
                    vm.broadcastDirective(title: trimmed, desc: "Emitida en tiempo real desde iPhone 15 Pro Max")
                }
            }
        } message: {
            Text("Esta orden se sincronizará inmediatamente con el cuartel general en Vercel y todos los 11 agentes de IA la ejecutarán.")
        }
    }
}

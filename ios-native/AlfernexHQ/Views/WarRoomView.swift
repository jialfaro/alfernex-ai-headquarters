import SwiftUI

public struct WarRoomView: View {
    @ObservedObject var vm: HQViewModel
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 16) {
                // Header
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("WAR ROOM EJECUTIVO")
                            .font(.system(size: 16, weight: .black, design: .monospaced))
                            .foregroundColor(.white)
                        Text("Métricas Reales • E-Commerce & Quant Trading")
                            .font(.system(size: 11, design: .monospaced))
                            .foregroundColor(.gray)
                    }
                    Spacer()
                    
                    HStack(spacing: 4) {
                        Circle()
                            .fill(Color.green)
                            .frame(width: 6, height: 6)
                        Text("GEMINI 3.8 FLASH")
                            .font(.system(size: 8, weight: .black, design: .monospaced))
                            .foregroundColor(.cyan)
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.cyan.opacity(0.12))
                    .cornerRadius(8)
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.cyan.opacity(0.3), lineWidth: 1))
                }
                .padding(.horizontal)
                .padding(.top, 8)
                
                // TRADIUM SECTION (Hyperliquid Quant)
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Label("TRADIUM • HYPERLIQUID QUANT", systemImage: "chart.line.uptrend.xyaxis")
                            .font(.system(size: 11, weight: .black, design: .monospaced))
                            .foregroundColor(.mint)
                        Spacer()
                        Text("LIVE DEX")
                            .font(.system(size: 8.5, weight: .black, design: .monospaced))
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.mint.opacity(0.2))
                            .foregroundColor(.mint)
                            .cornerRadius(4)
                    }
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text("CARTERA EN GESTIÓN")
                            .font(.system(size: 9.5, weight: .bold, design: .monospaced))
                            .foregroundColor(.gray)
                        HStack(alignment: .lastTextBaseline, spacing: 8) {
                            Text("$\(String(format: "%.2f", vm.tradingTelemetry.equityUSDC))")
                                .font(.system(size: 22, weight: .black, design: .monospaced))
                                .foregroundColor(.white)
                            Text("USDC")
                                .font(.system(size: 12, weight: .bold, design: .monospaced))
                                .foregroundColor(.mint)
                            Spacer()
                            Text("+$\(String(format: "%.2f", vm.tradingTelemetry.todayPnLUSDC)) (+\(String(format: "%.2f", vm.tradingTelemetry.todayPnLPct))%)")
                                .font(.system(size: 11, weight: .black, design: .monospaced))
                                .foregroundColor(.green)
                        }
                    }
                    
                    // Grid stats
                    HStack(spacing: 8) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("WIN RATE")
                                .font(.system(size: 8.5, weight: .bold, design: .monospaced))
                                .foregroundColor(.gray)
                            Text("\(String(format: "%.1f", vm.tradingTelemetry.winRatePct))%")
                                .font(.system(size: 13, weight: .black, design: .monospaced))
                                .foregroundColor(.green)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(10)
                        .background(Color.white.opacity(0.04))
                        .cornerRadius(10)
                        
                        VStack(alignment: .leading, spacing: 2) {
                            Text("SHARPE")
                                .font(.system(size: 8.5, weight: .bold, design: .monospaced))
                                .foregroundColor(.gray)
                            Text("\(String(format: "%.2f", vm.tradingTelemetry.sharpeRatio))")
                                .font(.system(size: 13, weight: .black, design: .monospaced))
                                .foregroundColor(.cyan)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(10)
                        .background(Color.white.opacity(0.04))
                        .cornerRadius(10)
                        
                        VStack(alignment: .leading, spacing: 2) {
                            Text("COMPOUNDING")
                                .font(.system(size: 8.5, weight: .bold, design: .monospaced))
                                .foregroundColor(.gray)
                            Text("50% (S/. $\(Int(vm.tradingTelemetry.compoundingPoolUSDC)))")
                                .font(.system(size: 11, weight: .black, design: .monospaced))
                                .foregroundColor(.mint)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(10)
                        .background(Color.white.opacity(0.04))
                        .cornerRadius(10)
                    }
                    
                    // Active pairs
                    VStack(alignment: .leading, spacing: 8) {
                        Text("EJECUCIÓN ALGORÍTMICA ACTIVA:")
                            .font(.system(size: 9, weight: .bold, design: .monospaced))
                            .foregroundColor(.gray)
                        
                        HStack {
                            Text(vm.tradingTelemetry.activePair)
                                .font(.system(size: 11, weight: .bold, design: .monospaced))
                                .foregroundColor(.white)
                            Spacer()
                            Text("Take Profit +\(String(format: "%.1f", vm.tradingTelemetry.takeProfitPct))%")
                                .font(.system(size: 10, weight: .black, design: .monospaced))
                                .foregroundColor(.green)
                        }
                    }
                    .padding(12)
                    .background(Color.black.opacity(0.4))
                    .cornerRadius(12)
                }
                .padding(16)
                .background(Color(hex: "#051812").opacity(0.8))
                .cornerRadius(24)
                .overlay(RoundedRectangle(cornerRadius: 24).stroke(Color.mint.opacity(0.3), lineWidth: 1))
                .padding(.horizontal)
                
                // SHOPIFY COD SECTION (Dropi Perú)
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Label("DROPI PERÚ & SHOPIFY COD", systemImage: "shippingbox.fill")
                            .font(.system(size: 11, weight: .black, design: .monospaced))
                            .foregroundColor(.green)
                        Spacer()
                        Text("ID: \(vm.shopifyTelemetry.dropiAccount)")
                            .font(.system(size: 9, weight: .bold, design: .monospaced))
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.green.opacity(0.2))
                            .foregroundColor(.green)
                            .cornerRadius(4)
                    }
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text("TIENDA: \(vm.shopifyTelemetry.storeUrl)")
                            .font(.system(size: 9.5, design: .monospaced))
                            .foregroundColor(.gray)
                        
                        HStack(alignment: .lastTextBaseline, spacing: 8) {
                            VStack(alignment: .leading, spacing: 2) {
                                Text("VENTAS BRUTAS")
                                    .font(.system(size: 8.5, weight: .bold, design: .monospaced))
                                    .foregroundColor(.gray)
                                Text("S/. \(String(format: "%.2f", vm.shopifyTelemetry.grossRevenuePEN))")
                                    .font(.system(size: 18, weight: .black, design: .monospaced))
                                    .foregroundColor(.white)
                            }
                            
                            Spacer()
                            
                            VStack(alignment: .trailing, spacing: 2) {
                                Text("UTILIDAD NETA")
                                    .font(.system(size: 8.5, weight: .bold, design: .monospaced))
                                    .foregroundColor(.gray)
                                Text("S/. \(String(format: "%.2f", vm.shopifyTelemetry.netProfitPEN))")
                                    .font(.system(size: 18, weight: .black, design: .monospaced))
                                    .foregroundColor(.green)
                            }
                        }
                    }
                    
                    VStack(spacing: 8) {
                        HStack {
                            Text("Efectividad de Entrega:")
                                .font(.system(size: 11, design: .monospaced))
                                .foregroundColor(.gray)
                            Spacer()
                            Text(vm.shopifyTelemetry.totalOrdersToday > 0 ? "\(String(format: "%.1f", vm.shopifyTelemetry.codSuccessRate))%" : "0.0% (Listo para despachar)")
                                .font(.system(size: 11, weight: .black, design: .monospaced))
                                .foregroundColor(vm.shopifyTelemetry.totalOrdersToday > 0 ? .green : .gray)
                        }
                        
                        HStack {
                            Text("Órdenes:")
                                .font(.system(size: 11, design: .monospaced))
                                .foregroundColor(.gray)
                            Spacer()
                            Text(vm.shopifyTelemetry.totalOrdersToday > 0 ? "\(vm.shopifyTelemetry.totalOrdersToday) Totales (\(vm.shopifyTelemetry.confirmedOrdersToday) Conf. / \(vm.shopifyTelemetry.deliveredCount) Desp.)" : "0 Órdenes registradas")
                                .font(.system(size: 10.5, weight: .bold, design: .monospaced))
                                .foregroundColor(.white)
                        }
                        
                        HStack {
                            Text("Logística Couriers:")
                                .font(.system(size: 11, design: .monospaced))
                                .foregroundColor(.gray)
                            Spacer()
                            Text("Olva Courier & Shalom")
                                .font(.system(size: 11, weight: .bold, design: .monospaced))
                                .foregroundColor(.cyan)
                        }
                    }
                    .padding(12)
                    .background(Color.black.opacity(0.4))
                    .cornerRadius(12)
                }
                .padding(16)
                .background(Color(hex: "#06180c").opacity(0.8))
                .cornerRadius(24)
                .overlay(RoundedRectangle(cornerRadius: 24).stroke(Color.green.opacity(0.3), lineWidth: 1))
                .padding(.horizontal)
                
                Spacer(minLength: 40)
            }
        }
        .refreshable {
            await vm.syncWithVercel()
        }
    }
}

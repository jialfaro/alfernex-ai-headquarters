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
                        Text("Monitoreo en vivo de Ventas y Trading Cuantitativo")
                            .font(.system(size: 11, design: .monospaced))
                            .foregroundColor(.gray)
                    }
                    Spacer()
                }
                .padding(.horizontal)
                .padding(.top, 8)
                
                // TRADIUM SECTION
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Label("TRADIUM • HYPERLIQUID QUANT", systemImage: "chart.line.uptrend.xyaxis")
                            .font(.system(size: 11, weight: .black, design: .monospaced))
                            .foregroundColor(.mint)
                        Spacer()
                        Text("LIVE PnL")
                            .font(.system(size: 9, weight: .black, design: .monospaced))
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.mint.opacity(0.2))
                            .foregroundColor(.mint)
                            .cornerRadius(4)
                    }
                    
                    Text("Cartera en Gestión: $\(Int(vm.tradingTelemetry.equityUSDC)) USD")
                        .font(.system(size: 18, weight: .black, design: .monospaced))
                        .foregroundColor(.white)
                    
                    // Grid stats
                    HStack(spacing: 8) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("WIN RATE")
                                .font(.system(size: 9, weight: .bold, design: .monospaced))
                                .foregroundColor(.gray)
                            Text("\(String(format: "%.1f", vm.tradingTelemetry.winRatePct))%")
                                .font(.system(size: 14, weight: .black, design: .monospaced))
                                .foregroundColor(.green)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(10)
                        .background(Color.white.opacity(0.04))
                        .cornerRadius(10)
                        
                        VStack(alignment: .leading, spacing: 2) {
                            Text("SHARPE")
                                .font(.system(size: 9, weight: .bold, design: .monospaced))
                                .foregroundColor(.gray)
                            Text("\(String(format: "%.2f", vm.tradingTelemetry.sharpeRatio))")
                                .font(.system(size: 14, weight: .black, design: .monospaced))
                                .foregroundColor(.cyan)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(10)
                        .background(Color.white.opacity(0.04))
                        .cornerRadius(10)
                        
                        VStack(alignment: .leading, spacing: 2) {
                            Text("RETORNO")
                                .font(.system(size: 9, weight: .bold, design: .monospaced))
                                .foregroundColor(.gray)
                            Text("+\(String(format: "%.1f", vm.tradingTelemetry.monthlyReturnPct))%")
                                .font(.system(size: 14, weight: .black, design: .monospaced))
                                .foregroundColor(.mint)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(10)
                        .background(Color.white.opacity(0.04))
                        .cornerRadius(10)
                    }
                    
                    // Active pairs
                    VStack(alignment: .leading, spacing: 8) {
                        Text("POSICIONES ABIERTAS:")
                            .font(.system(size: 9.5, weight: .bold, design: .monospaced))
                            .foregroundColor(.gray)
                        
                        HStack {
                            Text("LONG ETH-PERP")
                                .font(.system(size: 11, weight: .bold, design: .monospaced))
                                .foregroundColor(.white)
                            Spacer()
                            Text("+$1,420.50 (+3.8%)")
                                .font(.system(size: 11, weight: .black, design: .monospaced))
                                .foregroundColor(.green)
                        }
                        
                        HStack {
                            Text("LONG SOL-PERP")
                                .font(.system(size: 11, weight: .bold, design: .monospaced))
                                .foregroundColor(.white)
                            Spacer()
                            Text("+$840.20 (+4.9%)")
                                .font(.system(size: 11, weight: .black, design: .monospaced))
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
                
                // SHOPIFY COD SECTION
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Label("DROPI PERÚ & SHOPIFY COD", systemImage: "shippingbox.fill")
                            .font(.system(size: 11, weight: .black, design: .monospaced))
                            .foregroundColor(.green)
                        Spacer()
                        Text("LIMA & PROVINCIAS")
                            .font(.system(size: 9, weight: .bold, design: .monospaced))
                            .foregroundColor(.gray)
                    }
                    
                    Text("Ventas Brutas: S/. \(Int(vm.shopifyTelemetry.grossRevenuePEN)) PEN")
                        .font(.system(size: 18, weight: .black, design: .monospaced))
                        .foregroundColor(.white)
                    
                    VStack(spacing: 8) {
                        HStack {
                            Text("Efectividad Entrega:")
                                .font(.system(size: 11, design: .monospaced))
                                .foregroundColor(.gray)
                            Spacer()
                            Text("\(String(format: "%.1f", vm.shopifyTelemetry.codSuccessRate))%")
                                .font(.system(size: 11, weight: .black, design: .monospaced))
                                .foregroundColor(.green)
                        }
                        
                        HStack {
                            Text("Órdenes Despachadas:")
                                .font(.system(size: 11, design: .monospaced))
                                .foregroundColor(.gray)
                            Spacer()
                            Text("\(vm.shopifyTelemetry.totalOrdersToday) hoy")
                                .font(.system(size: 11, weight: .bold, design: .monospaced))
                                .foregroundColor(.white)
                        }
                        
                        HStack {
                            Text("Courier:")
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
    }
}

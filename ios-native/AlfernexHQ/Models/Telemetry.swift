import Foundation

public struct ShopifyTelemetry: Codable {
    public var grossRevenuePEN: Double
    public var totalOrdersToday: Int
    public var codSuccessRate: Double
    public var activeSKUs: Int
    
    public init(
        grossRevenuePEN: Double = 12450.0,
        totalOrdersToday: Int = 142,
        codSuccessRate: Double = 92.4,
        activeSKUs: Int = 30
    ) {
        self.grossRevenuePEN = grossRevenuePEN
        self.totalOrdersToday = totalOrdersToday
        self.codSuccessRate = codSuccessRate
        self.activeSKUs = activeSKUs
    }
}

public struct TradingTelemetry: Codable {
    public var equityUSDC: Double
    public var monthlyReturnPct: Double
    public var winRatePct: Double
    public var sharpeRatio: Double
    public var activePair: String
    public var takeProfitPct: Double
    
    public init(
        equityUSDC: Double = 102450.0,
        monthlyReturnPct: Double = 18.4,
        winRatePct: Double = 68.4,
        sharpeRatio: Double = 2.85,
        activePair: String = "ETH-PERP (Hyperliquid)",
        takeProfitPct: Double = 2.0
    ) {
        self.equityUSDC = equityUSDC
        self.monthlyReturnPct = monthlyReturnPct
        self.winRatePct = winRatePct
        self.sharpeRatio = sharpeRatio
        self.activePair = activePair
        self.takeProfitPct = takeProfitPct
    }
}

public struct LiveActivityItem: Identifiable, Codable {
    public let id: String
    public let agentName: String
    public let agentHexColor: String
    public let message: String
    public let timestamp: String
}

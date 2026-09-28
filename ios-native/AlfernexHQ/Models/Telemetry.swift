import Foundation

public struct ShopifyTelemetry: Codable {
    public var grossRevenuePEN: Double
    public var netProfitPEN: Double
    public var totalOrdersToday: Int
    public var confirmedOrdersToday: Int
    public var deliveredCount: Int
    public var pendingCount: Int
    public var codSuccessRate: Double
    public var activeSKUs: Int
    public var storeUrl: String
    public var dropiAccount: String
    
    public init(
        grossRevenuePEN: Double = 0.0,
        netProfitPEN: Double = 0.0,
        totalOrdersToday: Int = 0,
        confirmedOrdersToday: Int = 0,
        deliveredCount: Int = 0,
        pendingCount: Int = 0,
        codSuccessRate: Double = 0.0,
        activeSKUs: Int = 12,
        storeUrl: String = "8bhsfq-gz.myshopify.com",
        dropiAccount: String = "132455"
    ) {
        self.grossRevenuePEN = grossRevenuePEN
        self.netProfitPEN = netProfitPEN
        self.totalOrdersToday = totalOrdersToday
        self.confirmedOrdersToday = confirmedOrdersToday
        self.deliveredCount = deliveredCount
        self.pendingCount = pendingCount
        self.codSuccessRate = codSuccessRate
        self.activeSKUs = activeSKUs
        self.storeUrl = storeUrl
        self.dropiAccount = dropiAccount
    }
}

public struct TradingTelemetry: Codable {
    public var equityUSDC: Double
    public var todayPnLUSDC: Double
    public var todayPnLPct: Double
    public var monthlyReturnPct: Double
    public var winRatePct: Double
    public var sharpeRatio: Double
    public var activePair: String
    public var takeProfitPct: Double
    public var compoundingPoolUSDC: Double
    
    public init(
        equityUSDC: Double = 102450.0,
        todayPnLUSDC: Double = 3420.0,
        todayPnLPct: Double = 3.45,
        monthlyReturnPct: Double = 18.4,
        winRatePct: Double = 68.4,
        sharpeRatio: Double = 2.85,
        activePair: String = "ETH-PERP (Hyperliquid)",
        takeProfitPct: Double = 2.0,
        compoundingPoolUSDC: Double = 3420.0
    ) {
        self.equityUSDC = equityUSDC
        self.todayPnLUSDC = todayPnLUSDC
        self.todayPnLPct = todayPnLPct
        self.monthlyReturnPct = monthlyReturnPct
        self.winRatePct = winRatePct
        self.sharpeRatio = sharpeRatio
        self.activePair = activePair
        self.takeProfitPct = takeProfitPct
        self.compoundingPoolUSDC = compoundingPoolUSDC
    }
}

public struct CorporateTelemetry: Codable {
    public var agentsOnline: Int
    public var activeTasks: Int
    public var completedToday: Int
    public var aiUtilization: Int
    public var aiModel: String
    public var systemStatus: String
    
    public init(
        agentsOnline: Int = 11,
        activeTasks: Int = 24,
        completedToday: Int = 137,
        aiUtilization: Int = 87,
        aiModel: String = "Gemini 3.8 Flash",
        systemStatus: String = "OPERATIONAL"
    ) {
        self.agentsOnline = agentsOnline
        self.activeTasks = activeTasks
        self.completedToday = completedToday
        self.aiUtilization = aiUtilization
        self.aiModel = aiModel
        self.systemStatus = systemStatus
    }
}

public struct LiveActivityItem: Identifiable, Codable {
    public let id: String
    public let agentName: String
    public let agentHexColor: String
    public let message: String
    public let timestamp: String
}

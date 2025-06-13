export interface Trade {
  id: string
  pair: string
  direction: "buy" | "sell"
  entryPrice: number
  stopLoss: number
  takeProfit: number
  size: number
  openTime: string
  closeTime?: string
  pnl: number
  status: "open" | "closed"
  riskReward: number
  confidence: number
  winProbability: number
  exposure: number
  metaAgentRecommendation: "trade" | "no-trade"
  metaAgentReason: string
}

export interface Position {
  id: string
  pair: string
  direction: "buy" | "sell"
  entryPrice: number
  stopLoss: number
  takeProfit: number
  size: number
  openTime: string
  closeTime?: string
  pnl: number
  status: "open" | "closed"
}

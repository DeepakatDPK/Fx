"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Trade } from "@/lib/types"
import TradeCard from "@/components/trade-card"

interface LiveFeedPanelProps {
  trades: Trade[]
  onSelectTrade: (trade: Trade) => void
  selectedTradeId: string | undefined
}

export default function LiveFeedPanel({ trades, onSelectTrade, selectedTradeId }: LiveFeedPanelProps) {
  const [activeTab, setActiveTab] = useState("all")

  const filteredTrades =
    activeTab === "all" ? trades : trades.filter((trade) => trade.agentType.toLowerCase() === activeTab)

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Live Feed</span>
          <span className="text-xs text-gray-400 font-normal">{trades.length} signals</span>
        </CardTitle>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-zinc-800">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="scalper">Scalper</TabsTrigger>
            <TabsTrigger value="daytrader">Day Trader</TabsTrigger>
            <TabsTrigger value="swing">Swing</TabsTrigger>
            <TabsTrigger value="position">Position</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
        {filteredTrades.length > 0 ? (
          filteredTrades.map((trade) => (
            <TradeCard
              key={trade.id}
              trade={trade}
              onClick={() => onSelectTrade(trade)}
              isSelected={trade.id === selectedTradeId}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">No trade signals available</div>
        )}
      </CardContent>
    </Card>
  )
}

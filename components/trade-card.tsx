"use client"

import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Trade } from "@/lib/types"

interface TradeCardProps {
  trade: Trade
  onClick: () => void
  isSelected: boolean
}

export default function TradeCard({ trade, onClick, isSelected }: TradeCardProps) {
  const isBuy = trade.direction === "buy"

  return (
    <div
      className={cn(
        "p-3 rounded-lg border transition-all cursor-pointer",
        isSelected ? "bg-zinc-800 border-firebrick" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700",
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">{trade.pair}</span>
          <span
            className={cn(
              "text-xs px-1.5 py-0.5 rounded",
              isBuy ? "bg-spring/10 text-spring" : "bg-orange/10 text-orange",
            )}
          >
            {isBuy ? "BUY" : "SELL"}
          </span>
        </div>
        <span className="text-xs text-gray-400">{trade.agentType}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="text-xs">
          <div className="text-gray-400">Entry</div>
          <div>{trade.entry}</div>
        </div>
        <div className="text-xs">
          <div className="text-gray-400">Stop</div>
          <div className="text-orange">{trade.stop}</div>
        </div>
        <div className="text-xs">
          <div className="text-gray-400">TP</div>
          <div className="text-spring">{trade.takeProfit}</div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          {isBuy ? (
            <ArrowUpRight className="h-3 w-3 text-spring" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-orange" />
          )}
          <span className="text-xs text-gray-400">R:R {trade.riskReward}</span>
        </div>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={cn("h-1 w-1 rounded-full", i <= trade.confidence ? "bg-firebrick" : "bg-zinc-700")}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

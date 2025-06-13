import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Position } from "@/lib/types"

interface PositionsTabProps {
  positions: Position[]
}

export default function PositionsTab({ positions }: PositionsTabProps) {
  if (positions.length === 0) {
    return <div className="text-center py-8 text-gray-500">No open positions</div>
  }

  return (
    <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
      {positions.map((position) => (
        <div key={position.id} className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">{position.pair}</span>
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded flex items-center gap-1",
                  position.direction === "buy" ? "bg-spring/10 text-spring" : "bg-orange/10 text-orange",
                )}
              >
                {position.direction === "buy" ? (
                  <>
                    <ArrowUpRight className="h-3 w-3" />
                    <span>BUY</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="h-3 w-3" />
                    <span>SELL</span>
                  </>
                )}
              </span>
            </div>
            <span className={cn("text-xs font-medium", position.pnl >= 0 ? "text-spring" : "text-orange")}>
              {position.pnl >= 0 ? "+" : ""}
              {position.pnl}%
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="text-xs">
              <div className="text-gray-400">Entry</div>
              <div>{position.entryPrice}</div>
            </div>
            <div className="text-xs">
              <div className="text-gray-400">Stop</div>
              <div className="text-orange">{position.stopLoss}</div>
            </div>
            <div className="text-xs">
              <div className="text-gray-400">TP</div>
              <div className="text-spring">{position.takeProfit}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

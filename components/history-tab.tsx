import type { Position } from "@/lib/types"
import { cn } from "@/lib/utils"

interface HistoryTabProps {
  positions: Position[]
}

export default function HistoryTab({ positions }: HistoryTabProps) {
  if (positions.length === 0) {
    return <div className="text-center py-8 text-gray-500">No trade history</div>
  }

  return (
    <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
      {positions.map((position) => (
        <div key={position.id} className="p-2 rounded-lg bg-zinc-800 border border-zinc-700">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">{position.pair}</div>
              <div className="text-xs text-gray-400">{new Date(position.openTime).toLocaleDateString()}</div>
            </div>
            <div className={cn("text-sm font-medium", position.pnl >= 0 ? "text-spring" : "text-orange")}>
              {position.pnl >= 0 ? "+" : ""}
              {position.pnl}%
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

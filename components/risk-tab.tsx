import type { Position } from "@/lib/types"
import { Progress } from "@/components/ui/progress"

interface RiskTabProps {
  positions: Position[]
}

export default function RiskTab({ positions }: RiskTabProps) {
  // Calculate metrics
  const totalPositions = positions.length
  const closedPositions = positions.filter((p) => p.status === "closed")
  const winningTrades = closedPositions.filter((p) => p.pnl > 0)
  const winRate = totalPositions > 0 ? Math.round((winningTrades.length / closedPositions.length) * 100) : 0

  const totalPnl = closedPositions.reduce((sum, pos) => sum + pos.pnl, 0)
  const exposure = positions.filter((p) => p.status === "open").length * 5 // 5% per position

  const metrics = [
    { label: "Win Rate", value: winRate, color: "bg-spring" },
    {
      label: "Total P&L",
      value: Math.abs(totalPnl),
      color: totalPnl >= 0 ? "bg-spring" : "bg-orange",
    },
    { label: "Exposure", value: exposure, color: "bg-firebrick" },
    { label: "Trades", value: totalPositions, color: "bg-blue-500" },
  ]

  return (
    <div className="space-y-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">{metric.label}</span>
            <span className="font-medium">
              {metric.label === "Total P&L" 
                ? `${totalPnl >= 0 ? "+" : "-"}${metric.value}%`
                : `${metric.value}%`}
            </span>
          </div>
          <Progress
            value={metric.value}
            max={100}
            className="h-1.5 bg-zinc-700"
            indicatorClassName={metric.color}
          />
        </div>
      ))}

      <div className="mt-6 pt-4 border-t border-zinc-800">
        <h3 className="text-sm font-medium mb-3">Risk Distribution</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">EURUSD</span>
            <span>35%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">GBPUSD</span>
            <span>25%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">USDJPY</span>
            <span>20%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">AUDUSD</span>
            <span>15%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">USDCAD</span>
            <span>5%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

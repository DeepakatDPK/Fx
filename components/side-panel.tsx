"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Position } from "@/lib/types"
import PositionsTab from "@/components/positions-tab"
import HistoryTab from "@/components/history-tab"
import RiskTab from "@/components/risk-tab"

interface SidePanelProps {
  positions: Position[]
}

export default function SidePanel({ positions }: SidePanelProps) {
  const [activeTab, setActiveTab] = useState("positions")

  return (
    <div className="w-80 border-l border-zinc-800 bg-zinc-900 flex flex-col">
      <div className="p-4">
        <Tabs defaultValue="positions" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 bg-zinc-800">
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="risk">Risk</TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="mt-4">
            <PositionsTab positions={positions.filter((p) => p.status === "open")} />
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <HistoryTab positions={positions.filter((p) => p.status === "closed")} />
          </TabsContent>

          <TabsContent value="risk" className="mt-4">
            <RiskTab positions={positions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

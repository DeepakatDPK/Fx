"use client"

import { useState, useRef, useEffect } from "react"
import Header from "@/components/header"
import LiveFeedPanel from "@/components/live-feed-panel"
import MetaAgentPanel from "@/components/meta-agent-panel"
import SidePanel from "@/components/side-panel"
import ChatBar from "@/components/chat-bar"
import type { Trade, Position } from "@/lib/types"
import { mockTrades, mockPositions } from "@/lib/mock-data"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Dashboard() {
  const [mode, setMode] = useState<"Manual" | "Auto">("Manual")
  const [trades, setTrades] = useState<Trade[]>(mockTrades)
  const [positions, setPositions] = useState<Position[]>(mockPositions)
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! I am Stroud AI. How can I help you trade today?" },
  ])
  const [agentsList, setAgentsList] = useState<string[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/agents")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setAgentsList(data)
      } catch (error) {
        console.error("Failed to fetch agents:", error)
        // Optionally, set an error state here to display to the user
      }
    }

    fetchAgents()
  }, [])

  const toggleMode = () => {
    setMode(mode === "Manual" ? "Auto" : "Manual")
  }

  const handleTradeApproval = (trade: Trade, approved: boolean) => {
    // In a real app, this would send the approval to an API
    console.log(`Trade ${trade.id} ${approved ? "approved" : "rejected"}`)

    if (approved) {
      // Add to positions in a real app
      const newPosition: Position = {
        id: `pos-${Date.now()}`,
        pair: trade.pair,
        direction: trade.direction,
        entryPrice: trade.entryPrice,
        stopLoss: trade.stopLoss,
        takeProfit: trade.takeProfit,
        size: 0.1, // Example size
        openTime: new Date().toISOString(),
        pnl: 0,
        status: "open",
      }

      setPositions([newPosition, ...positions])
    }

    // Remove the trade from suggestions
    setTrades(trades.filter((t) => t.id !== trade.id))
    setSelectedTrade(null)
  }

  const handleSendMessage = async (msg: string) => {
    if (!msg.trim()) return;
    const userMessage = { sender: "user", text: msg };
    setMessages((prev) => [...prev, userMessage]);

    // Optimistically scroll immediately for user message
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 0);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: msg,
          agent_id: selectedAgent, // Pass null if no agent is selected (StroudAI general)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const aiResponse = await response.json();
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Failed to send message or get response:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I couldn't connect to the server. Please try again.",
        },
      ]);
    }
    // Scroll after AI response is added
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-gray-100">
      <Header mode={mode} toggleMode={toggleMode} />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 p-2 md:p-4 flex-1 overflow-auto">
            <LiveFeedPanel trades={trades} onSelectTrade={setSelectedTrade} selectedTradeId={selectedTrade?.id} />
            <MetaAgentPanel
              selectedTrade={selectedTrade}
              onApprove={(trade) => handleTradeApproval(trade, true)}
              onReject={(trade) => handleTradeApproval(trade, false)}
              mode={mode}
            />
          </div>
          <div className="mt-auto w-full">
            {/* Agent Selection UI */}
            <div className="bg-zinc-950 p-2 md:p-3 border-t border-b border-zinc-800">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className={`px-3 py-1.5 text-xs md:text-sm rounded-lg whitespace-nowrap focus:outline-none transition-colors
                    ${selectedAgent === null ? "bg-firebrick text-white" : "bg-zinc-800 hover:bg-zinc-700 text-gray-300"}`}
                >
                  StroudAI (General)
                </button>
                {agentsList.map((agentName) => (
                  <button
                    key={agentName}
                    onClick={() => setSelectedAgent(agentName)}
                    className={`px-3 py-1.5 text-xs md:text-sm rounded-lg whitespace-nowrap focus:outline-none transition-colors
                      ${selectedAgent === agentName ? "bg-firebrick text-white" : "bg-zinc-800 hover:bg-zinc-700 text-gray-300"}`}
                  >
                    {agentName}
                  </button>
                ))}
              </div>
            </div>
            {/* Chat Messages Area */}
            <div className="bg-zinc-900 border-t border-zinc-800 px-2 md:px-4 pt-2 md:pt-4 pb-1.5 md:pb-2 flex flex-col w-full"
              style={{ minHeight: '160px', maxHeight: '32vh' }}>
              <ScrollArea className="flex-1 overflow-y-auto pr-1 md:pr-2" style={{ maxHeight: 'calc(32vh - 70px)' }}> {/* Adjusted maxHeight */}
                <div className="flex flex-col gap-2 md:gap-3">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.sender === "ai" && (
                        <div className="mr-1 md:mr-2 flex items-end">
                          <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg ${selectedAgent && msg.sender === 'ai' ? 'bg-blue-600' : 'bg-firebrick'}`}>
                            {selectedAgent && msg.sender === 'ai' ? selectedAgent.substring(0, 1) : 'S'}
                          </div>
                        </div>
                      )}
                      <div className={`rounded-2xl px-3 md:px-4 py-1.5 md:py-2 max-w-[85vw] md:max-w-[70%] text-xs md:text-sm shadow-md ${msg.sender === "user" ? "bg-firebrick text-white" : "bg-zinc-800 text-gray-100"}`}>{msg.text}</div>
                      {msg.sender === "user" && (
                        <div className="ml-1 md:ml-2 flex items-end">
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-spring flex items-center justify-center text-black font-bold text-base md:text-lg">U</div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>
            </div>
            <div className="w-full">
              <ChatBar onSend={handleSendMessage} />
            </div>
          </div>
        </div>

        <SidePanel positions={positions} />
      </div>
    </div>
  )
}

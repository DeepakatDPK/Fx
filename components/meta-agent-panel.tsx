"use client"

import { useState, useEffect } from 'react';
import { ArrowDownRight, ArrowUpRight, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Trade } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AgentAnalysis {
  id: string;
  analysis: {
    signal: string;
    entry_price: number;
    stop_loss: number;
    take_profit: number;
    confidence_score: number;
    rationale: string;
    sub_agent_risk_level: string;
  };
}

interface MetaAgentPanelProps {
  selectedTrade: Trade | null
  onApprove: (trade: Trade) => void
  onReject: (trade: Trade) => void
  mode: "Manual" | "Auto"
}

export default function MetaAgentPanel({ selectedTrade, onApprove, onReject, mode }: MetaAgentPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentAnalyses, setAgentAnalyses] = useState<Record<string, AgentAnalysis>>({});

  const fetchAnalysis = async () => {
    if (!selectedTrade) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/trading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'analyze',
          symbol: selectedTrade.pair,
          date: new Date().toISOString().split('T')[0],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }

      const data = await response.json();
      if (data.success) {
        // Update the trade with the meta-analysis
        selectedTrade.metaAgentRecommendation = data.data.decision === 'trade' ? 'trade' : 'no-trade';
        selectedTrade.metaAgentReason = data.data.decision;
        
        // Store individual agent analyses
        setAgentAnalyses(data.data.agents);
      } else {
        throw new Error(data.error || 'Failed to get analysis');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch analysis when a trade is selected
  useEffect(() => {
    if (selectedTrade) {
      fetchAnalysis();
    }
  }, [selectedTrade]);

  if (!selectedTrade) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg">Meta-Agent Decision</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">Select a trade to see the meta-agent's analysis</p>
        </CardContent>
      </Card>
    );
  }

  const isBuy = selectedTrade.direction === 'buy';
  const isRecommended = selectedTrade.metaAgentRecommendation === 'trade';

  return (
    <Card className="bg-zinc-900 border-zinc-800 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Meta-Agent Decision</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Analyzing trade...
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-red-500">
            {error}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("p-2 rounded-full", isRecommended ? "bg-spring/10" : "bg-orange/10")}>
                {isRecommended ? (
                  <CheckCircle2 className="h-6 w-6 text-spring" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-orange" />
                )}
              </div>
              <div>
                <h3 className="font-medium">{isRecommended ? "Trade Recommended" : "Trade Not Recommended"}</h3>
                <p className="text-sm text-gray-400">{selectedTrade.metaAgentReason}</p>
              </div>
            </div>

            <Tabs defaultValue="overview" className="flex-1">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="position">Position</TabsTrigger>
                <TabsTrigger value="scalper">Scalper</TabsTrigger>
                <TabsTrigger value="swing">Swing</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-800 p-3 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Trade Details</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{selectedTrade.pair}</span>
                      <span
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded",
                          isBuy ? "bg-spring/10 text-spring" : "bg-orange/10 text-orange",
                        )}
                      >
                        {isBuy ? (
                          <div className="flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" />
                            <span>BUY</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <ArrowDownRight className="h-3 w-3" />
                            <span>SELL</span>
                          </div>
                        )}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-xs">
                        <div className="text-gray-400">Entry</div>
                        <div>{selectedTrade.entryPrice}</div>
                      </div>
                      <div className="text-xs">
                        <div className="text-gray-400">Stop</div>
                        <div className="text-orange">{selectedTrade.stopLoss}</div>
                      </div>
                      <div className="text-xs">
                        <div className="text-gray-400">TP</div>
                        <div className="text-spring">{selectedTrade.takeProfit}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-800 p-3 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Risk Analysis</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-xs">
                        <div className="text-gray-400">Risk:Reward</div>
                        <div>{selectedTrade.riskReward}</div>
                      </div>
                      <div className="text-xs">
                        <div className="text-gray-400">Confidence</div>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                i <= selectedTrade.confidence ? "bg-firebrick" : "bg-zinc-700",
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-xs">
                        <div className="text-gray-400">Win Probability</div>
                        <div>{selectedTrade.winProbability}%</div>
                      </div>
                      <div className="text-xs">
                        <div className="text-gray-400">Exposure</div>
                        <div>{selectedTrade.exposure}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-800 p-3 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Agent Consensus</div>
                  <div className="grid grid-cols-4 gap-4">
                    {Object.entries(agentAnalyses).map(([agent, analysis]) => (
                      <div key={agent} className="text-xs">
                        <div className="text-gray-400 mb-1">{agent.replace('_', ' ').toUpperCase()}</div>
                        <div className={cn(
                          "px-2 py-1 rounded text-center mb-1",
                          analysis.analysis.signal === 'BUY' ? "bg-spring/10 text-spring" :
                          analysis.analysis.signal === 'SELL' ? "bg-orange/10 text-orange" :
                          "bg-zinc-700 text-gray-400"
                        )}>
                          {analysis.analysis.signal}
                        </div>
                        <div className="text-gray-400">Confidence: {Math.round(analysis.analysis.confidence_score * 100)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {Object.entries(agentAnalyses).map(([agent, analysis]) => (
                <TabsContent key={agent} value={agent} className="space-y-4">
                  <div className="bg-zinc-800 p-3 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Analysis Details</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Signal:</span>
                        <span className={cn(
                          analysis.analysis.signal === 'BUY' ? "text-spring" :
                          analysis.analysis.signal === 'SELL' ? "text-orange" :
                          "text-gray-400"
                        )}>
                          {analysis.analysis.signal}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Entry Price:</span>
                        <span>{analysis.analysis.entry_price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stop Loss:</span>
                        <span className="text-orange">{analysis.analysis.stop_loss}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Take Profit:</span>
                        <span className="text-spring">{analysis.analysis.take_profit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Confidence:</span>
                        <span>{Math.round(analysis.analysis.confidence_score * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Risk Level:</span>
                        <span className={cn(
                          analysis.analysis.sub_agent_risk_level === 'Low' ? "text-spring" :
                          analysis.analysis.sub_agent_risk_level === 'High' ? "text-orange" :
                          "text-yellow-500"
                        )}>
                          {analysis.analysis.sub_agent_risk_level}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-800 p-3 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Rationale</div>
                    <p className="text-sm whitespace-pre-wrap">{analysis.analysis.rationale}</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-4">
              {mode === "Manual" ? (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-zinc-700 hover:bg-zinc-800 hover:text-white"
                    onClick={() => onReject(selectedTrade)}
                  >
                    Reject
                  </Button>
                  <Button className="flex-1 bg-firebrick hover:bg-firebrick/90" onClick={() => onApprove(selectedTrade)}>
                    Approve Trade
                  </Button>
                </div>
              ) : (
                <div className="bg-zinc-800 p-3 rounded-lg text-center">
                  <p className="text-sm">
                    <span className="text-firebrick font-medium">Auto-mode active:</span>{" "}
                    {isRecommended ? (
                      <span className="text-spring">Trade will execute automatically</span>
                    ) : (
                      <span className="text-orange">Trade will be rejected automatically</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

'use client'
import { useState, useRef, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import ChatBar from '@/components/chat-bar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  mode?: 'quick' | 'deep'
}

interface TradingSignal {
  currency_pair: string;
  signal: string;
  confidence: number;
  stop_loss: number;
  take_profit: number;
  parameters: any;
  reasoning: string;
  timestamp: string;
}

interface ConsensusData {
  final_decision: string;
  currency_pair: string;
  reasoning: string;
  confidence_score: number;
  suggested_entry_price: number;
  stop_loss: number;
  take_profit: number;
}

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI trading assistant. Ask me to analyze a currency pair like 'Analyze EUR/USD'.",
      sender: 'ai',
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    // Simple but effective scroll to bottom
    setTimeout(() => {
        const scrollViewport = document.querySelector('.h-full.w-full.rounded-md.border .h-full');
        if (scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    }, 100);
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (messageText: string, mode: 'quick' | 'deep') => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      mode,
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/trading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: messageText, // Assuming the message is the currency pair
          date: new Date().toISOString(),
          mode: mode
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'The AI is having trouble thinking. Please try again.')
      }

      const data = await response.json()

      let aiText = "I couldn't form a coherent thought. Try asking again."
      if (data.success && data.data && data.data.decision) {
        const decision = data.data.decision
        aiText = `**${decision.final_decision} for ${decision.currency_pair}**
        - **Reasoning**: ${decision.reasoning}
        - **Confidence**: ${decision.confidence_score * 100}%
        - **Entry Price**: ${decision.suggested_entry_price}
        - **Stop Loss**: ${decision.stop_loss}
        - **Take Profit**: ${decision.take_profit}`
      } else if (data.error) {
        aiText = `An error occurred: ${data.error}`
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
        mode,
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.'
      const aiErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${errorMessage}`,
        sender: 'ai',
        mode,
      }
      setMessages((prev) => [...prev, aiErrorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-secondary/40">
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <h1 className="text-lg font-semibold">Stroud AI Trader</h1>
      </header>
      <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-6 lg:p-8 h-[calc(100vh-4rem)]">
        {/* Main Dashboard Cards - simplified for chat focus */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Positions</CardTitle>
            <CardDescription>Your current open positions.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No open positions.</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Meta-Agent Consensus</CardTitle>
            <CardDescription>The final decision from the AI agents.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Waiting for analysis...</p>
          </CardContent>
        </Card>

        {/* Chat Window - Positioned at the bottom */}
        <div className="fixed bottom-0 right-0 w-full md:w-2/5 md:max-w-md lg:max-w-lg p-4 z-50">
           <Card className="flex flex-col h-[60vh] max-h-[60vh] shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm">Trading Assistant</CardTitle>
                  <CardDescription className="text-xs">Online</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <ScrollArea className="h-full w-full rounded-md border p-4">
                 <div ref={scrollAreaRef} className="h-full space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.sender === 'user' ? 'justify-end' : ''
                      }`}
                    >
                      {message.sender === 'ai' && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[75%] rounded-lg p-3 text-sm ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                       <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                         {message.mode && (
                          <Badge variant="outline" className={`mt-2 ${message.mode === 'deep' ? 'text-blue-500 border-blue-500' : 'text-gray-500'}`}>
                            {message.mode === 'deep' ? 'Deep Think' : 'Quick Think'}
                          </Badge>
                        )}
                      </div>
                      {message.sender === 'user' && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                   {isLoading && (
                     <div className="flex items-start gap-3">
                       <Avatar className="h-8 w-8">
                         <AvatarImage src="/placeholder-user.jpg" />
                         <AvatarFallback>AI</AvatarFallback>
                       </Avatar>
                       <div className="max-w-[75%] rounded-lg p-3 text-sm bg-muted">
                         Thinking...
                       </div>
                     </div>
                   )}
                </div>
              </ScrollArea>
            </CardContent>
            <ChatBar onSendMessage={handleSendMessage} isLoading={isLoading} />
          </Card>
        </div>
      </main>
    </div>
  )
} 
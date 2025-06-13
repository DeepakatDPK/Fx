"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChatBar({ onSend }: { onSend?: (msg: string) => void }) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    if (onSend) onSend(message)
    setMessage("")
  }

  const quickQuestions = ["Why this trade?", "Show RSI", "Market sentiment", "Risk analysis"]

  return (
    <div className="border-t border-zinc-800 bg-zinc-900 p-3">
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {quickQuestions.map((question) => (
          <Button
            key={question}
            variant="outline"
            size="sm"
            className="whitespace-nowrap border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs"
            onClick={() => {
              setMessage(question)
              if (onSend) onSend(question)
            }}
          >
            {question}
          </Button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask Stroud AI..."
          className="bg-zinc-800 border-zinc-700 focus-visible:ring-firebrick"
        />
        <Button type="submit" size="icon" disabled={!message.trim()} className="bg-firebrick hover:bg-firebrick/90">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PaperPlaneIcon } from '@radix-ui/react-icons'

interface ChatBarProps {
  onSendMessage: (message: string, mode: 'quick' | 'deep') => void
  isLoading: boolean
}

export default function ChatBar({ onSendMessage, isLoading }: ChatBarProps) {
  const [message, setMessage] = useState('')
  const [mode, setMode] = useState<'quick' | 'deep'>('quick')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value)
  }

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim(), mode)
      setMessage('')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  return (
    <div className="p-4 bg-background border-t">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about a currency pair, e.g., 'Analyze EUR/USD'..."
          className="pr-20 text-sm w-full min-h-[40px] max-h-48 resize-none"
          rows={1}
          disabled={isLoading}
        />
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center space-x-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
          >
            <PaperPlaneIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
       <div className="flex items-center justify-end space-x-2 pt-2">
          <Label htmlFor="think-mode" className="text-xs text-muted-foreground">Quick Think</Label>
          <Switch
            id="think-mode"
            checked={mode === 'deep'}
            onCheckedChange={(checked) => setMode(checked ? 'deep' : 'quick')}
            disabled={isLoading}
          />
          <Label htmlFor="think-mode" className="text-xs text-muted-foreground">Deep Think</Label>
        </div>
    </div>
  )
} 
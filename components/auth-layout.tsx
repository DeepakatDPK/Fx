import type React from "react"
import { BrainCircuit } from "lucide-react"
import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Branding */}
        <div className="w-full md:w-1/2 bg-zinc-900 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <BrainCircuit className="h-8 w-8 text-firebrick" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-firebrick to-red-400 bg-clip-text text-transparent">
                Stroud AI
              </h1>
            </Link>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Forex Trading</h2>
            <p className="text-gray-400 text-lg mb-6">
              Leverage advanced AI algorithms to make smarter trading decisions and maximize your profits.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="text-spring font-medium mb-1">85%</div>
                <div className="text-sm text-gray-400">Signal Accuracy</div>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="text-spring font-medium mb-1">24/7</div>
                <div className="text-sm text-gray-400">Market Monitoring</div>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="text-spring font-medium mb-1">4 Agents</div>
                <div className="text-sm text-gray-400">Trading Strategies</div>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="text-spring font-medium mb-1">12+ Pairs</div>
                <div className="text-sm text-gray-400">Currency Coverage</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <p className="text-gray-400">{description}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

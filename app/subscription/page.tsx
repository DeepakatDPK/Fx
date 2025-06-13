import SubscriptionSection from "@/components/subscription-section"
import { Button } from "@/components/ui/button"
import { BrainCircuit, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-firebrick" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-firebrick to-red-400 bg-clip-text text-transparent">
            Stroud AI
          </h1>
        </div>
        <Button variant="outline" size="sm" asChild className="border-zinc-700 hover:bg-zinc-800">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Upgrade Your Trading Experience</h1>
          <p className="text-gray-400 text-lg">
            Choose the plan that fits your trading style and unlock the full potential of Stroud AI.
          </p>
        </div>

        <SubscriptionSection />

        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Can I switch plans later?</h3>
              <p className="text-gray-400">
                Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the end
                of your current billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">How does the free trial work?</h3>
              <p className="text-gray-400">
                All paid plans include a 14-day free trial. You won't be charged until the trial period ends, and you
                can cancel anytime before then.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400">
                We accept all major credit cards, PayPal, and cryptocurrency payments (Bitcoin, Ethereum).
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">What's included in the Custom plan?</h3>
              <p className="text-gray-400">
                The Custom plan includes everything in the Pro plan plus dedicated support, custom strategy development,
                and enterprise-grade features tailored to your specific trading needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-zinc-900 border-t border-zinc-800 py-8 px-6 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <BrainCircuit className="h-5 w-5 text-firebrick" />
            <span className="font-bold">Stroud AI</span>
          </div>
          <div className="text-sm text-gray-400">© {new Date().getFullYear()} Stroud AI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

import Dashboard from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Dashboard />
        <div className="mt-8 py-6 px-4 bg-zinc-900 border-t border-zinc-800">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to unlock the full power of Stroud AI?</h2>
            <p className="text-gray-400 mb-4">
              Upgrade your plan to access all features and maximize your trading potential.
            </p>
            <Button asChild className="bg-firebrick hover:bg-firebrick/90">
              <Link href="/subscription">View Pricing Plans</Link>
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

"use client"

import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PlanFeature {
  name: string
  included: boolean
}

interface PricingPlan {
  name: string
  description: string
  price: string
  billingPeriod: string
  features: PlanFeature[]
  buttonText: string
  popular?: boolean
}

export default function SubscriptionSection() {
  const plans: PricingPlan[] = [
    {
      name: "Free",
      description: "Basic access to Stroud AI trading signals",
      price: "$0",
      billingPeriod: "forever",
      features: [
        { name: "Basic trade signals", included: true },
        { name: "Single agent (Day Trader)", included: true },
        { name: "Limited market pairs (3)", included: true },
        { name: "Basic risk metrics", included: true },
        { name: "Meta-agent analysis", included: false },
        { name: "Auto-trading mode", included: false },
        { name: "Advanced risk management", included: false },
        { name: "Priority support", included: false },
      ],
      buttonText: "Start Free",
    },
    {
      name: "Pro",
      description: "Full access to all Stroud AI capabilities",
      price: "$99",
      billingPeriod: "per month",
      features: [
        { name: "Advanced trade signals", included: true },
        { name: "All agents (Scalper, Day, Swing, Position)", included: true },
        { name: "All market pairs", included: true },
        { name: "Advanced risk metrics", included: true },
        { name: "Meta-agent analysis", included: true },
        { name: "Auto-trading mode", included: true },
        { name: "Advanced risk management", included: true },
        { name: "Priority support", included: false },
      ],
      buttonText: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Custom",
      description: "Enterprise-grade solution with dedicated support",
      price: "Custom",
      billingPeriod: "tailored pricing",
      features: [
        { name: "Custom trade signals", included: true },
        { name: "Custom agents & strategies", included: true },
        { name: "Unlimited market pairs", included: true },
        { name: "Enterprise risk metrics", included: true },
        { name: "Advanced meta-agent analysis", included: true },
        { name: "Auto-trading with custom rules", included: true },
        { name: "Custom risk management", included: true },
        { name: "Dedicated support team", included: true },
      ],
      buttonText: "Contact Sales",
    },
  ]

  return (
    <div className="py-12 px-4 md:px-6 bg-black">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-firebrick to-red-400 bg-clip-text text-transparent mb-3">
          Choose Your Trading Edge
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Select the plan that best fits your trading style and goals. Upgrade or downgrade anytime as your needs
          evolve.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "bg-zinc-900 border-zinc-800 relative overflow-hidden",
              plan.popular && "border-firebrick shadow-lg shadow-firebrick/10",
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0">
                <div className="bg-firebrick text-white text-xs font-medium px-3 py-1 rounded-bl-lg">MOST POPULAR</div>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="text-gray-400">{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-sm text-gray-400 ml-2">{plan.billingPeriod}</span>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-spring mr-2 shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-gray-500 mr-2 shrink-0" />
                    )}
                    <span className={feature.included ? "text-gray-200" : "text-gray-500"}>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={cn(
                  "w-full",
                  plan.popular ? "bg-firebrick hover:bg-firebrick/90" : "bg-zinc-800 hover:bg-zinc-700 text-white",
                )}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-400 text-sm">
          All plans include a 14-day free trial. No credit card required to start.
        </p>
      </div>
    </div>
  )
}

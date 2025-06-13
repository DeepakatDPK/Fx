"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import AuthLayout from "@/components/auth-layout"
import { useAuth } from "@/lib/auth-context"

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignUpFormValues = z.infer<typeof signUpSchema>

export default function SignUpPage() {
  const { signUp } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  })

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      await signUp(data.email, data.name, data.password)
      router.push("/")
    } catch (err) {
      setError("Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Create an account" description="Sign up for Stroud AI to start your trading journey">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            className="bg-zinc-800 border-zinc-700 focus-visible:ring-firebrick"
            {...register("name")}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="bg-zinc-800 border-zinc-700 focus-visible:ring-firebrick"
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="bg-zinc-800 border-zinc-700 focus-visible:ring-firebrick"
            {...register("password")}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="bg-zinc-800 border-zinc-700 focus-visible:ring-firebrick"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="acceptTerms" {...register("acceptTerms")} className="data-[state=checked]:bg-firebrick" />
          <label
            htmlFor="acceptTerms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <Link href="/terms" className="text-firebrick hover:underline">
              terms of service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-firebrick hover:underline">
              privacy policy
            </Link>
          </label>
        </div>
        {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full bg-firebrick hover:bg-firebrick/90" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-firebrick hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  email: string
  name: string
  plan: "free" | "pro" | "custom"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, name: string, password: string) => Promise<void>
  signOut: () => void
  forgotPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would verify the token with your backend
        const storedUser = localStorage.getItem("stroud_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would call your authentication API
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user for demo purposes
      const mockUser: User = {
        id: "user-1",
        email,
        name: email.split("@")[0],
        plan: "free",
        avatar: "",
      }

      // Store user in localStorage (in a real app, you'd store a token)
      localStorage.setItem("stroud_user", JSON.stringify(mockUser))
      setUser(mockUser)
      router.push("/")
    } catch (error) {
      console.error("Sign in failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, name: string, password: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would call your registration API
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user for demo purposes
      const mockUser: User = {
        id: "user-" + Date.now(),
        email,
        name,
        plan: "free",
        avatar: "",
      }

      // Store user in localStorage (in a real app, you'd store a token)
      localStorage.setItem("stroud_user", JSON.stringify(mockUser))
      setUser(mockUser)
      router.push("/")
    } catch (error) {
      console.error("Sign up failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    localStorage.removeItem("stroud_user")
    setUser(null)
    router.push("/auth/signin")
  }

  const forgotPassword = async (email: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would call your password reset API
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Success message would be shown in the UI
    } catch (error) {
      console.error("Password reset failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

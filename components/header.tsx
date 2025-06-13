"use client"

import { BarChart3, BrainCircuit, Crown, User, LogOut, Settings } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  mode: "Manual" | "Auto"
  toggleMode: () => void
}

export default function Header({ mode, toggleMode }: HeaderProps) {
  const { user, signOut } = useAuth()

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-zinc-900 border-b border-zinc-800">
      <div className="flex items-center gap-2">
        <BrainCircuit className="h-6 w-6 text-firebrick" />
        <h1 className="text-xl font-bold bg-gradient-to-r from-firebrick to-red-400 bg-clip-text text-transparent">
          Stroud AI
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-400">EURUSD +0.12%</span>
        </div>

        <div className="flex items-center gap-3">
          <Label htmlFor="mode-toggle" className="text-sm">
            {mode === "Manual" ? "Manual Mode" : "Auto Mode"}
          </Label>
          <Switch
            id="mode-toggle"
            checked={mode === "Auto"}
            onCheckedChange={toggleMode}
            className="data-[state=checked]:bg-firebrick"
          />
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            {user.plan === "free" && (
              <Button variant="outline" size="sm" asChild className="border-zinc-700 hover:bg-zinc-800">
                <Link href="/subscription">
                  <Crown className="h-4 w-4 mr-2 text-firebrick" />
                  <span className="hidden sm:inline">Upgrade</span>
                </Link>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || ""} alt={user.name} />
                    <AvatarFallback className="bg-zinc-800">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-gray-400">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="focus:bg-zinc-800">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-zinc-800">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="focus:bg-zinc-800" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="border-zinc-700 hover:bg-zinc-800">
              <Link href="/auth/signin">Sign in</Link>
            </Button>
            <Button size="sm" asChild className="bg-firebrick hover:bg-firebrick/90">
              <Link href="/auth/signup">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

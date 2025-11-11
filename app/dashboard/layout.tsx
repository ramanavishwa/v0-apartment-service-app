"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { NotificationBell } from "@/components/notification-bell"
import { MessageSquare, Trophy, BarChart3, Heart, Clock } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ name: string; id: string } | null>(null)

  useEffect(() => {
    const currentUserData = localStorage.getItem("currentUser")
    if (!currentUserData) {
      router.push("/login")
    } else {
      setUser(JSON.parse(currentUserData))
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/fix-nexus-logo.png" alt="Fix Nexus" className="h-10 w-auto" />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Link href="/messages" className="hover:opacity-80 transition" title="Messages">
                  <MessageSquare size={20} />
                </Link>
                <Link href="/leaderboard" className="hover:opacity-80 transition" title="Leaderboard">
                  <Trophy size={20} />
                </Link>
                <Link href="/analytics" className="hover:opacity-80 transition" title="Analytics">
                  <BarChart3 size={20} />
                </Link>
                <Link href="/favorites" className="hover:opacity-80 transition" title="Saved Issues">
                  <Heart size={20} />
                </Link>
                <Link href="/history" className="hover:opacity-80 transition" title="History">
                  <Clock size={20} />
                </Link>
              </div>
              {user && <NotificationBell userId={user.id} />}
              <span className="text-sm">Welcome, {user?.name}</span>
              <Link
                href="/profile"
                className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Star, Award, TrendingUp } from "lucide-react"
import { getAllUsers, getIssues, getUserStats } from "@/lib/storage-utils"

interface LeaderboardUser {
  id: string
  name: string
  profilePhoto?: string
  credits: number
  rating: number
  repliesGiven: number
  issuesResolved: number
  skills: string[]
}

export default function LeaderboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([])
  const [sortBy, setSortBy] = useState<"credits" | "rating" | "replies" | "issues">("credits")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    } else {
      router.push("/login")
    }

    const users = getAllUsers()
    const issues = getIssues()

    const leaderboard: LeaderboardUser[] = users
      .map((u: any) => {
        const stats = getUserStats(u.id)
        return {
          id: u.id,
          name: u.name,
          profilePhoto: u.profilePhoto,
          credits: u.credits || 0,
          rating: u.rating || 0,
          repliesGiven: stats.repliesGiven,
          issuesResolved: stats.issuesResolved,
          skills: u.skills || [],
        }
      })
      .filter((u) => u.credits > 0 || u.repliesGiven > 0)

    setLeaderboardData(leaderboard)
    setLoading(false)
  }, [router])

  const getSortedLeaderboard = () => {
    const sorted = [...leaderboardData]
    switch (sortBy) {
      case "credits":
        return sorted.sort((a, b) => b.credits - a.credits)
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating)
      case "replies":
        return sorted.sort((a, b) => b.repliesGiven - a.repliesGiven)
      case "issues":
        return sorted.sort((a, b) => b.issuesResolved - a.issuesResolved)
      default:
        return sorted
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const sortedLeaderboard = getSortedLeaderboard()

  return (
    <div className="space-y-6">
      {/* Top Contributors - Podium */}
      {sortedLeaderboard.length > 0 && (
        <Card className="p-8 bg-gradient-to-r from-accent/20 to-primary/20">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Top Contributors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedLeaderboard.slice(0, 3).map((entry, index) => {
              const medals = ["🥇", "🥈", "🥉"]
              return (
                <div key={entry.id} className="text-center">
                  <div className="mb-4">
                    <div className="text-4xl mb-2">{medals[index]}</div>
                    <Avatar className="w-24 h-24 mx-auto mb-3">
                      <AvatarImage src={entry.profilePhoto || "/placeholder.svg"} alt={entry.name} />
                      <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{entry.name}</h3>
                  <div
                    className={`p-4 rounded-lg ${index === 0 ? "bg-accent" : index === 1 ? "bg-muted" : "bg-accent/50"}`}
                  >
                    <p className="text-3xl font-bold text-foreground">{entry.credits}</p>
                    <p className="text-sm text-muted-foreground">Credits</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Sort Options */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: "credits", label: "Credits", icon: <Award className="inline mr-2" size={16} /> },
          { value: "rating", label: "Rating", icon: <Star className="inline mr-2" size={16} /> },
          { value: "replies", label: "Replies", icon: <TrendingUp className="inline mr-2" size={16} /> },
          { value: "issues", label: "Issues Resolved", icon: <Trophy className="inline mr-2" size={16} /> },
        ].map((sort) => (
          <Button
            key={sort.value}
            variant={sortBy === sort.value ? "default" : "outline"}
            onClick={() => setSortBy(sort.value as any)}
          >
            {sort.icon}
            {sort.label}
          </Button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Rank</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">User</th>
              <th className="px-6 py-4 text-center font-semibold text-foreground">Credits</th>
              <th className="px-6 py-4 text-center font-semibold text-foreground">Rating</th>
              <th className="px-6 py-4 text-center font-semibold text-foreground">Replies</th>
              <th className="px-6 py-4 text-center font-semibold text-foreground">Issues Resolved</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Skills</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedLeaderboard.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                  No leaderboard data yet
                </td>
              </tr>
            ) : (
              sortedLeaderboard.map((entry, index) => (
                <tr key={entry.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 font-bold text-primary">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={entry.profilePhoto || "/placeholder.svg"} alt={entry.name} />
                        <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-foreground">{entry.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block bg-accent/20 text-accent px-3 py-1 rounded-full font-semibold">
                      {entry.credits}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-semibold">{entry.rating.toFixed(1)}</span>
                      <Star size={16} className="fill-accent text-accent" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold">{entry.repliesGiven}</td>
                  <td className="px-6 py-4 text-center font-semibold">{entry.issuesResolved}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {entry.skills.slice(0, 2).map((skill) => (
                        <span key={skill} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {entry.skills.length > 2 && (
                        <span className="text-muted-foreground text-xs">+{entry.skills.length - 2}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

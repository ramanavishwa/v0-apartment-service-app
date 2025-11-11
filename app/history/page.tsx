"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Users, Torus as Tools, DollarSign, Clock, Trash2 } from "lucide-react"
import { getIssues } from "@/lib/storage-utils"
import { getHistory, clearHistory } from "@/lib/favorites-utils"
import type { Issue } from "@/lib/data-models"

interface IssueData extends Issue {
  replies?: any[]
  viewedAt?: string
}

export default function HistoryPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [history, setHistory] = useState<IssueData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      setUser(userData)

      const allIssues = getIssues()
      const historyData = getHistory(userData.id)
      const historyIssues = historyData
        .map((h: any) => {
          const issue = allIssues.find((i: any) => i.id === h.issueId)
          return issue ? { ...issue, viewedAt: h.viewedAt } : null
        })
        .filter(Boolean)

      setHistory(historyIssues)
    } else {
      router.push("/login")
    }
    setLoading(false)
  }, [router])

  const handleClearHistory = () => {
    if (user && confirm("Are you sure you want to clear your entire history?")) {
      clearHistory(user.id)
      setHistory([])
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">View History</h1>
          <p className="text-muted-foreground">Recently viewed issues</p>
        </div>
        {history.length > 0 && (
          <Button onClick={handleClearHistory} variant="outline" size="sm">
            <Trash2 size={16} className="mr-2" />
            Clear History
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">Your viewing history is empty. Start exploring issues!</p>
            <Link href="/dashboard">
              <Button className="mt-4">Go to Dashboard</Button>
            </Link>
          </Card>
        ) : (
          history.map((issue, index) => (
            <Card
              key={`${issue.id}-${index}`}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/dashboard/issue/${issue.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-lg font-bold text-foreground">{issue.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        issue.type === "common" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                      }`}
                    >
                      {issue.type === "common" ? "Community" : "Personal"}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{issue.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
                    <Clock size={16} />
                    {issue.viewedAt && new Date(issue.viewedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={16} />
                  <span>{issue.location}</span>
                </div>
                {issue.volunteers && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users size={16} />
                    <span>{issue.volunteers} needed</span>
                  </div>
                )}
                {issue.tools && issue.tools.length > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tools size={16} />
                    <span>{issue.tools.length} tools</span>
                  </div>
                )}
                {issue.budget && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign size={16} />
                    <span>₹{issue.budget}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                Posted by {issue.createdBy} • {issue.replies?.length || 0} replies
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

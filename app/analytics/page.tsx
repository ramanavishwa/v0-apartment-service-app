"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Users, FileText, MessageSquare } from "lucide-react"
import { getAllUsers, getIssues } from "@/lib/storage-utils"

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
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

    let totalCredits = 0
    let totalReplies = 0
    let totalIssuesPosted = 0
    let totalIssuesResolved = 0
    let averageRating = 0

    users.forEach((u: any) => {
      totalCredits += u.credits || 0
      averageRating += u.rating || 0
    })

    issues.forEach((issue: any) => {
      totalIssuesPosted++
      if (issue.status === "resolved") totalIssuesResolved++
      issue.replies?.forEach(() => {
        totalReplies++
      })
    })

    const issuesByStatus = {
      open: issues.filter((i: any) => i.status === "open").length,
      "in-progress": issues.filter((i: any) => i.status === "in-progress").length,
      resolved: issues.filter((i: any) => i.status === "resolved").length,
    }

    const issuesByPriority = {
      normal: issues.filter((i: any) => (i.priority || "normal") === "normal").length,
      urgent: issues.filter((i: any) => i.priority === "urgent").length,
      emergency: issues.filter((i: any) => i.priority === "emergency").length,
    }

    setStats({
      totalUsers: users.length,
      totalCredits,
      totalReplies,
      totalIssuesPosted,
      totalIssuesResolved,
      averageRating: (averageRating / users.length).toFixed(1),
      issuesByStatus: [
        { name: "Open", value: issuesByStatus.open, fill: "#3b82f6" },
        { name: "In Progress", value: issuesByStatus["in-progress"], fill: "#fbbf24" },
        { name: "Resolved", value: issuesByStatus.resolved, fill: "#10b981" },
      ],
      issuesByPriority: [
        { name: "Normal", value: issuesByPriority.normal, fill: "#3b82f6" },
        { name: "Urgent", value: issuesByPriority.urgent, fill: "#f97316" },
        { name: "Emergency", value: issuesByPriority.emergency, fill: "#dc2626" },
      ],
      communityIssues: issues.filter((i: any) => i.type === "common").length,
      personalIssues: issues.filter((i: any) => i.type === "own").length,
    })

    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Community Analytics</h1>
        <p className="text-muted-foreground">Platform-wide statistics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <Users size={32} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-accent/10 p-4 rounded-lg">
              <FileText size={32} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Issues Posted</p>
              <p className="text-2xl font-bold text-foreground">{stats?.totalIssuesPosted || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <MessageSquare size={32} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Replies</p>
              <p className="text-2xl font-bold text-foreground">{stats?.totalReplies || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-accent/10 p-4 rounded-lg">
              <TrendingUp size={32} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Issues Resolved</p>
              <p className="text-2xl font-bold text-foreground">{stats?.totalIssuesResolved || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues by Status */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Issues by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats?.issuesByStatus || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stats?.issuesByStatus?.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Issues by Priority */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Issues by Priority</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats?.issuesByPriority || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stats?.issuesByPriority?.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Issue Types */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Issues by Type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              {
                name: "Community Issues",
                value: stats?.communityIssues || 0,
              },
              {
                name: "Personal Issues",
                value: stats?.personalIssues || 0,
              },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill={`hsl(var(--primary))`} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

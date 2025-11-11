"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, MapPin, Users, Torus as Tools, DollarSign, Search, X, Trash2, CheckCircle } from "lucide-react"
import { searchIssues, deleteIssue, updateIssue } from "@/lib/storage-utils"
import type { Issue } from "@/lib/data-models"

interface IssueData extends Issue {
  replies?: any[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [issues, setIssues] = useState<IssueData[]>([])
  const [filteredIssues, setFilteredIssues] = useState<IssueData[]>([])
  const [user, setUser] = useState<any>(null)
  const [filter, setFilter] = useState<"all" | "common" | "own">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "in-progress" | "resolved">("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | "normal" | "urgent" | "emergency">("all")

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }

    const storedIssues = localStorage.getItem("issues")
    if (storedIssues) {
      setIssues(JSON.parse(storedIssues))
    }
  }, [])

  useEffect(() => {
    let results = [...issues]

    if (filter !== "all") {
      results = results.filter((issue) => issue.type === filter)
    }

    if (statusFilter !== "all") {
      results = results.filter((issue) => issue.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      results = results.filter((issue) => issue.priority === priorityFilter)
    }

    if (searchQuery.trim()) {
      results = searchIssues(searchQuery, results)
    }

    setFilteredIssues(results)
  }, [issues, filter, statusFilter, priorityFilter, searchQuery])

  const handleDeleteIssue = (issueId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm("Are you sure you want to delete this issue?")) {
      deleteIssue(issueId)
      setIssues(issues.filter((i) => i.id !== issueId))
    }
  }

  const handleMarkDone = (issueId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    updateIssue(issueId, { status: "resolved" })
    setIssues(issues.map((i) => (i.id === issueId ? { ...i, status: "resolved" as const } : i)))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "bg-red-100 text-red-800"
      case "urgent":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-amber-100 text-amber-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Action Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border-slate-200">
            <Link href="/dashboard/post-common-issue">
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-4 rounded-lg">
                  <Users size={32} className="text-slate-700" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Common Issue</h3>
                  <p className="text-slate-600 text-sm">Park cleaning, parking area, etc.</p>
                </div>
              </div>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border-slate-200">
            <Link href="/dashboard/post-own-issue">
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-4 rounded-lg">
                  <Plus size={32} className="text-slate-700" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Personal Issue</h3>
                  <p className="text-slate-600 text-sm">Plumbing, electrical, maintenance</p>
                </div>
              </div>
            </Link>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="p-4 mb-6 bg-white border-slate-200">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
            <Search size={20} className="text-slate-600" />
            <input
              type="text"
              placeholder="Search issues by title, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-slate-900"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-slate-600 hover:text-slate-900">
                <X size={20} />
              </button>
            )}
          </div>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="flex gap-2">
            {["all", "common", "own"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f as any)}
                className={filter === f ? "bg-slate-700 text-amber-50 hover:bg-slate-800" : ""}
                size="sm"
              >
                {f === "all" ? "All Types" : f === "common" ? "Community" : "Personal"}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            {["all", "open", "in-progress", "resolved"].map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "default" : "outline"}
                onClick={() => setStatusFilter(s as any)}
                className={statusFilter === s ? "bg-green-600 text-white hover:bg-green-700" : ""}
                size="sm"
              >
                {s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            {["all", "normal", "urgent", "emergency"].map((p) => (
              <Button
                key={p}
                variant={priorityFilter === p ? "default" : "outline"}
                onClick={() => setPriorityFilter(p as any)}
                className={priorityFilter === p ? "bg-red-600 text-white hover:bg-red-700" : ""}
                size="sm"
              >
                {p === "all" ? "All Priority" : p.charAt(0).toUpperCase() + p.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <Card className="p-8 text-center bg-white border-slate-200">
              <p className="text-slate-600 text-lg">
                {searchQuery ? "No issues match your search." : "No issues found. Be the first to post!"}
              </p>
            </Card>
          ) : (
            filteredIssues.map((issue) => (
              <Card key={issue.id} className="p-6 hover:shadow-lg transition-shadow bg-white border-slate-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 cursor-pointer" onClick={() => router.push(`/dashboard/issue/${issue.id}`)}>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900">{issue.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          issue.type === "common" ? "bg-amber-100 text-slate-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {issue.type === "common" ? "Community" : "Personal"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(issue.priority || "normal")}`}
                      >
                        {(issue.priority || "normal").charAt(0).toUpperCase() + (issue.priority || "normal").slice(1)}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-3">{issue.description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(issue.status || "open")}`}
                  >
                    {(issue.status || "open").charAt(0).toUpperCase() +
                      (issue.status || "open").slice(1).replace("-", " ")}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={16} />
                    <span>{issue.location}</span>
                  </div>
                  {issue.volunteers && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users size={16} />
                      <span>{issue.volunteers} needed</span>
                    </div>
                  )}
                  {issue.tools && issue.tools.length > 0 && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Tools size={16} />
                      <span>{issue.tools.length} tools</span>
                    </div>
                  )}
                  {issue.budget && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <DollarSign size={16} />
                      <span>₹{issue.budget}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-slate-500">Posted by {issue.createdBy}</span>
                  {user && issue.createdBy === user.email && (
                    <div className="flex gap-2">
                      {issue.status !== "resolved" && (
                        <Button
                          onClick={(e) => handleMarkDone(issue.id, e)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                        >
                          <CheckCircle size={16} />
                          Mark Done
                        </Button>
                      )}
                      <Button
                        onClick={(e) => handleDeleteIssue(issue.id, e)}
                        size="sm"
                        variant="destructive"
                        className="flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Delete
                      </Button>
                    </div>
                  )}
                  {!user ||
                    (issue.createdBy !== user.email && (
                      <span className="text-xs text-slate-500">{issue.replies?.length || 0} replies</span>
                    ))}
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

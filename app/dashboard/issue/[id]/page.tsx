"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Users, Torus as Tools, DollarSign, MessageCircle } from "lucide-react"
import { StarRating } from "@/components/star-rating"
import { FavoriteButton } from "@/components/favorite-button"
import { updateIssue, deleteIssue } from "@/lib/storage-utils"
import { addToHistory } from "@/lib/favorites-utils"

interface Reply {
  id: string
  text: string
  authorName: string
  authorId: string
  credits: number
  rating?: number
  createdAt: string
}

interface Issue {
  id: string
  title: string
  type: "common" | "own"
  category: string
  location: string
  volunteers?: number
  tools?: string[]
  budget?: number
  description: string
  status: "open" | "in-progress" | "resolved"
  priority?: "normal" | "urgent" | "emergency"
  createdBy: string
  createdAt: string
  replies: Reply[]
}

export default function IssuePage() {
  const router = useRouter()
  const params = useParams()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [user, setUser] = useState<any>(null)
  const [replyText, setReplyText] = useState("")
  const [loading, setLoading] = useState(true)
  const [ratedReplies, setRatedReplies] = useState<{ [key: string]: number }>({})
  const [newStatus, setNewStatus] = useState<Issue["status"]>("open")

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      setUser(userData)
      addToHistory(userData.id, params.id as string)
    }

    const issues = JSON.parse(localStorage.getItem("issues") || "[]")
    const foundIssue = issues.find((i: any) => i.id === params.id)

    if (foundIssue) {
      setIssue({
        ...foundIssue,
        replies: foundIssue.replies || [],
      })
      setNewStatus(foundIssue.status || "open")
    }

    setLoading(false)
  }, [params.id])

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault()

    if (!issue || !replyText.trim()) return

    const newReply = {
      id: Date.now().toString(),
      text: replyText,
      authorName: user?.name || "Anonymous",
      authorId: user?.id || "anonymous",
      credits: 1,
      createdAt: new Date().toISOString(),
    }

    const updatedIssue = {
      ...issue,
      replies: [...(issue.replies || []), newReply],
    }

    // Update localStorage
    const issues = JSON.parse(localStorage.getItem("issues") || "[]")
    const updatedIssues = issues.map((i: any) => (i.id === issue.id ? updatedIssue : i))
    localStorage.setItem("issues", JSON.stringify(updatedIssues))

    // Update user credits
    if (user) {
      const updatedUser = { ...user, credits: (user.credits || 0) + 1 }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      setUser(updatedUser)
    }

    setIssue(updatedIssue)
    setReplyText("")
  }

  const handleRateReply = (replyId: string, rating: number) => {
    if (!issue) return

    const updatedReplies = issue.replies.map((reply) => (reply.id === replyId ? { ...reply, rating } : reply))

    const updatedIssue = { ...issue, replies: updatedReplies }
    setIssue(updatedIssue)
    setRatedReplies({ ...ratedReplies, [replyId]: rating })

    // Update localStorage
    const issues = JSON.parse(localStorage.getItem("issues") || "[]")
    const updatedIssues = issues.map((i: any) => (i.id === issue.id ? updatedIssue : i))
    localStorage.setItem("issues", JSON.stringify(updatedIssues))
  }

  const handleStatusChange = (status: Issue["status"]) => {
    if (!issue) return
    setNewStatus(status)
    const updatedIssue = { ...issue, status }
    setIssue(updatedIssue)
    updateIssue(issue.id, { status })
  }

  const handleDeleteIssue = () => {
    if (!issue || user?.id !== issue.createdBy) return
    if (confirm("Are you sure you want to delete this issue?")) {
      deleteIssue(issue.id)
      router.push("/dashboard")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-slate-600 text-lg">Issue not found</p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="mt-4 bg-amber-400 text-slate-900 hover:bg-amber-500"
          >
            Go Back to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "emergency":
        return "bg-red-100 text-red-800"
      case "urgent":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-amber-100 text-amber-900"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-amber-100 text-amber-900"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="mb-6 text-slate-700 border-slate-300 hover:bg-slate-100"
          >
            ← Back to Dashboard
          </Button>

          {/* Issue Details */}
          <Card className="p-8 mb-6 border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h1 className="text-3xl font-bold text-slate-900">{issue.title}</h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      issue.type === "common" ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"
                    }`}
                  >
                    {issue.type === "common" ? "Community" : "Personal"}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(issue.priority)}`}>
                    {(issue.priority || "normal").charAt(0).toUpperCase() + (issue.priority || "normal").slice(1)}
                  </span>
                </div>
                <p className="text-slate-600 text-lg mb-6">{issue.description}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {user && <FavoriteButton issueId={issue.id} userId={user.id} size={24} />}
                <span className={`px-4 py-2 rounded-full font-semibold text-center ${getStatusColor(newStatus)}`}>
                  {newStatus.charAt(0).toUpperCase() + newStatus.slice(1).replace("-", " ")}
                </span>
                {user?.id === issue.createdBy && (
                  <div className="flex gap-1">
                    {["open", "in-progress", "resolved"].map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={newStatus === status ? "default" : "outline"}
                        onClick={() => handleStatusChange(status as Issue["status"])}
                        className={`text-xs ${newStatus === status ? "bg-amber-400 text-slate-900 hover:bg-amber-500" : "text-slate-700 border-slate-300 hover:bg-slate-100"}`}
                      >
                        {status.replace("-", " ")}
                      </Button>
                    ))}
                    <Button size="sm" variant="destructive" onClick={handleDeleteIssue} className="text-xs">
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-100 p-6 rounded-lg">
              <div className="flex items-center gap-3">
                <MapPin className="text-amber-600" size={24} />
                <div>
                  <p className="text-sm text-slate-600">Location</p>
                  <p className="font-semibold text-slate-900">{issue.location}</p>
                </div>
              </div>

              {issue.volunteers && (
                <div className="flex items-center gap-3">
                  <Users className="text-amber-600" size={24} />
                  <div>
                    <p className="text-sm text-slate-600">Volunteers</p>
                    <p className="font-semibold text-slate-900">{issue.volunteers} needed</p>
                  </div>
                </div>
              )}

              {issue.tools && issue.tools.length > 0 && (
                <div className="flex items-center gap-3">
                  <Tools className="text-amber-600" size={24} />
                  <div>
                    <p className="text-sm text-slate-600">Tools</p>
                    <p className="font-semibold text-slate-900">{issue.tools.join(", ")}</p>
                  </div>
                </div>
              )}

              {issue.budget && (
                <div className="flex items-center gap-3">
                  <DollarSign className="text-amber-600" size={24} />
                  <div>
                    <p className="text-sm text-slate-600">Budget</p>
                    <p className="font-semibold text-slate-900">₹{issue.budget}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 text-sm text-slate-600">
              Posted by <strong>{issue.createdBy}</strong> on {new Date(issue.createdAt).toLocaleDateString()}
            </div>
          </Card>

          {/* Replies Section */}
          <Card className="p-8 border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MessageCircle size={28} />
              Replies ({(issue.replies || []).length})
            </h2>

            {/* Reply Form */}
            <form onSubmit={handleReply} className="mb-8 p-6 bg-slate-100 rounded-lg">
              <label className="block text-sm font-medium text-slate-700 mb-3">Your Reply</label>
              <textarea
                placeholder="Share your solution, referral, or offer help..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4"
              />
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="bg-amber-400 text-slate-900 hover:bg-amber-500 font-semibold"
                >
                  Post Reply & Earn +1 Credit
                </Button>
              </div>
            </form>

            {/* Existing Replies */}
            {(issue.replies || []).length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                <p>No replies yet. Be the first to help!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(issue.replies || []).map((reply) => (
                  <Card key={reply.id} className="p-4 border-l-4 border-amber-400">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-slate-900">{reply.authorName}</p>
                        <p className="text-sm text-slate-600">{new Date(reply.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-semibold">
                        +{reply.credits} Credit
                      </span>
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap mb-4">{reply.text}</p>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                      <span className="text-sm text-slate-600">Rate this reply:</span>
                      <StarRating
                        currentRating={ratedReplies[reply.id] || reply.rating || 0}
                        onRate={(rating) => handleRateReply(reply.id, rating)}
                        size={18}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

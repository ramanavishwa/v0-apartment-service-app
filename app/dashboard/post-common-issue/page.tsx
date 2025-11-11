"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function PostCommonIssuePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    volunteers: "",
    tools: "",
    budget: "",
    description: "",
  })

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newIssue = {
      id: Date.now().toString(),
      title: formData.title,
      type: "common" as const,
      category: "Community Maintenance",
      location: formData.location,
      volunteers: formData.volunteers ? Number.parseInt(formData.volunteers) : undefined,
      tools: formData.tools ? formData.tools.split(",").map((t) => t.trim()) : [],
      budget: formData.budget ? Number.parseInt(formData.budget) : undefined,
      description: formData.description,
      status: "open" as const,
      createdBy: user?.name || "Anonymous",
      createdAt: new Date().toISOString(),
      replies: 0,
    }

    const issues = JSON.parse(localStorage.getItem("issues") || "[]")
    issues.push(newIssue)
    localStorage.setItem("issues", JSON.stringify(issues))

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Button onClick={() => router.back()} variant="outline" className="mb-6">
          ← Back
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Community Issue</h1>
          <p className="text-gray-600 mb-8">Create a common area maintenance request</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issue Name</label>
              <Input
                type="text"
                placeholder="e.g., Park Cleaning Drive"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <Input
                type="text"
                placeholder="Enter location (e.g., Block A, Park Area, Main Gate)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Volunteers Needed</label>
                <Input
                  type="number"
                  placeholder="e.g., 5"
                  value={formData.volunteers}
                  onChange={(e) => setFormData({ ...formData, volunteers: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tools Required</label>
                <Input
                  type="text"
                  placeholder="e.g., Broom, Shovel"
                  value={formData.tools}
                  onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget (₹)</label>
                <Input
                  type="number"
                  placeholder="e.g., 500"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex gap-4">
              <Button type="button" onClick={() => router.back()} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-black">
                Post Issue
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

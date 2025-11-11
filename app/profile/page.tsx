"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Award, Mail, UserIcon, Upload, Star, Briefcase } from "lucide-react"
import { SkillsSelector } from "@/components/skills-selector"
import { getUserStats } from "@/lib/storage-utils"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [skills, setSkills] = useState<string[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      setUser(userData)
      setFormData({
        name: userData.name,
        email: userData.email,
      })
      setSkills(userData.skills || [])
      setStats(getUserStats(userData.id))
    } else {
      router.push("/login")
    }
    setLoading(false)
  }, [router])

  const handleSave = () => {
    if (user) {
      const updatedUser = { ...user, ...formData, skills }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Update in users list
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = users.map((u: any) => (u.id === user.id ? updatedUser : u))
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      setIsEditing(false)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const updatedUser = {
          ...user,
          profilePhoto: reader.result as string,
        }
        setUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }
      reader.readAsDataURL(file)
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
    <div className="min-h-screen bg-gradient-to-br from-white via-accent/10 to-white">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Button
          onClick={() => router.push("/dashboard")}
          variant="outline"
          className="text-slate-700 border-slate-300 hover:bg-slate-100"
        >
          ← Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary">My Profile</h1>
          <p className="text-muted-foreground">Manage your profile information and expertise</p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Profile Photo */}
          <div className="flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src={user?.profilePhoto || "/placeholder.svg"} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <label htmlFor="photo-upload">
              <Button asChild variant="outline" size="sm" className="cursor-pointer bg-transparent">
                <span className="flex items-center gap-2">
                  <Upload size={16} />
                  Upload Photo
                </span>
              </Button>
            </label>
            <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </div>

          {/* User Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full"
                  />
                </div>
                <SkillsSelector selectedSkills={skills} onSkillsChange={setSkills} />
                <div className="flex gap-3">
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                    Save Changes
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <UserIcon className="text-blue-600" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-600" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                  </div>
                </div>
                {skills.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="text-blue-600 mt-1" size={24} />
                    <div>
                      <p className="text-sm text-gray-600">Expertise</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skills.map((skill) => (
                          <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-4 rounded-lg">
              <Award size={32} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Credits Earned</p>
              <p className="text-2xl font-bold text-gray-900">{user?.credits || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <Star size={32} className="text-blue-600 fill-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <div className="flex items-center gap-1">
                <p className="text-2xl font-bold text-gray-900">{(user?.rating || 0).toFixed(1)}</p>
                <span className="text-yellow-500">★</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <Briefcase size={32} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Contributions</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.repliesGiven || 0} replies</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Log */}
      <Card className="p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Info</h2>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-600">Member Since</span>
            <span className="font-semibold text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-600">Account ID</span>
            <span className="font-semibold text-gray-900">{user?.id}</span>
          </div>
          {stats && (
            <>
              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-600">Issues Posted</span>
                <span className="font-semibold text-gray-900">{stats.issuesPosted}</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-600">Issues Resolved</span>
                <span className="font-semibold text-gray-900">{stats.issuesResolved}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Replies Given</span>
                <span className="font-semibold text-gray-900">{stats.repliesGiven}</span>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Logout */}
      <div className="flex gap-3">
        <Button onClick={handleLogout} variant="destructive" className="flex-1">
          Logout
        </Button>
      </div>
    </div>
  )
}

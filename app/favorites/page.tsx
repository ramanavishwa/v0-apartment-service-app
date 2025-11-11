"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Users, Torus as Tools, DollarSign, Heart, Search } from "lucide-react"
import { getIssues } from "@/lib/storage-utils"
import { getFavorites, removeFavorite } from "@/lib/favorites-utils"
import type { Issue } from "@/lib/data-models"
import { Input } from "@/components/ui/input"

interface IssueData extends Issue {
  replies?: any[]
}

export default function FavoritesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<IssueData[]>([])
  const [filteredFavorites, setFilteredFavorites] = useState<IssueData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      setUser(userData)

      const allIssues = getIssues()
      const favIssueIds = getFavorites(userData.id)
      const favIssues = allIssues.filter((i) => favIssueIds.includes(i.id))
      setFavorites(favIssues)
      setFilteredFavorites(favIssues)
    } else {
      router.push("/login")
    }
    setLoading(false)
  }, [router])

  useEffect(() => {
    let results = favorites
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      results = favorites.filter(
        (issue) => issue.title.toLowerCase().includes(q) || issue.description.toLowerCase().includes(q),
      )
    }
    setFilteredFavorites(results)
  }, [searchQuery, favorites])

  const handleRemoveFavorite = (issueId: string) => {
    if (user) {
      removeFavorite(user.id, issueId)
      setFavorites(favorites.filter((i) => i.id !== issueId))
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
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Saved Issues</h1>
        <p className="text-muted-foreground">Your bookmarked issues</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          placeholder="Search saved issues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Saved Issues */}
      <div className="space-y-4">
        {filteredFavorites.length === 0 ? (
          <Card className="p-8 text-center">
            <Heart size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">
              {favorites.length === 0
                ? "No saved issues yet. Bookmark issues to view them later!"
                : "No results match your search."}
            </p>
            {favorites.length === 0 && (
              <Link href="/dashboard">
                <Button className="mt-4">Go to Dashboard</Button>
              </Link>
            )}
          </Card>
        ) : (
          filteredFavorites.map((issue) => (
            <Card
              key={issue.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer relative"
              onClick={() => router.push(`/dashboard/issue/${issue.id}`)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFavorite(issue.id)
                }}
                className="absolute top-4 right-4 text-destructive hover:text-destructive/80"
              >
                <Heart size={24} className="fill-destructive" />
              </button>

              <div className="pr-8">
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
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

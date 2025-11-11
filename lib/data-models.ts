export interface User {
  id: string
  name: string
  email: string
  password: string
  credits: number
  profilePhoto?: string
  skills: string[] // Expertise tags like "Plumbing", "Electrical"
  rating: number // Average rating from 1-5
  totalRatings: number
  createdAt: string
  createdBy?: string
}

export interface Reply {
  id: string
  text: string
  authorName: string
  authorId: string
  credits: number
  rating?: number // User rating for this reply (1-5)
  createdAt: string
}

export interface Issue {
  id: string
  title: string
  type: "common" | "own"
  category: string
  location: string
  coordinates?: { lat: number; lng: number } // From map picker
  volunteers?: number
  tools?: string[]
  budget?: number
  description: string
  status: "open" | "in-progress" | "resolved" // Extended status
  priority: "normal" | "urgent" | "emergency" // Priority levels
  createdBy: string
  createdById: string
  createdAt: string
  replies: Reply[]
  tags?: string[] // For better search/filtering
  isFavorited?: boolean // Bookmark feature
  favoriteCount?: number
}

export interface Notification {
  id: string
  userId: string
  type: "reply" | "rating" | "message" | "status-update"
  issueId?: string
  message: string
  read: boolean
  createdAt: string
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  receiverId: string
  issueId: string
  text: string
  createdAt: string
  read: boolean
}

export interface UserStats {
  userId: string
  issuesPosted: number
  issuesResolved: number
  repliesGiven: number
  creditsEarned: number
  averageRating: number
  skillsCount: number
  lastActive: string
}

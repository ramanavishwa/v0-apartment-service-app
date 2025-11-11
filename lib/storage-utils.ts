import type { User, Issue, Reply, Notification, Message, UserStats } from "./data-models"

// User utilities
export const getUserById = (userId: string): User | null => {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  return users.find((u: User) => u.id === userId) || null
}

export const getAllUsers = (): User[] => {
  return JSON.parse(localStorage.getItem("users") || "[]")
}

export const updateUser = (userId: string, updates: Partial<User>) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const updatedUsers = users.map((u: User) => (u.id === userId ? { ...u, ...updates } : u))
  localStorage.setItem("users", JSON.stringify(updatedUsers))
  localStorage.setItem("currentUser", JSON.stringify(updatedUsers.find((u: User) => u.id === userId)))
}

// Issue utilities
export const getIssues = (): Issue[] => {
  return JSON.parse(localStorage.getItem("issues") || "[]")
}

export const getIssueById = (issueId: string): Issue | null => {
  const issues = getIssues()
  return issues.find((i) => i.id === issueId) || null
}

export const updateIssue = (issueId: string, updates: Partial<Issue>) => {
  const issues = getIssues()
  const updatedIssues = issues.map((i: Issue) => (i.id === issueId ? { ...i, ...updates } : i))
  localStorage.setItem("issues", JSON.stringify(updatedIssues))
}

export const addReply = (issueId: string, reply: Reply) => {
  const issues = getIssues()
  const updatedIssues = issues.map((i: Issue) => {
    if (i.id === issueId) {
      return { ...i, replies: [...(i.replies || []), reply] }
    }
    return i
  })
  localStorage.setItem("issues", JSON.stringify(updatedIssues))
}

export const deleteIssue = (issueId: string) => {
  const issues = getIssues()
  const updatedIssues = issues.filter((i: Issue) => i.id !== issueId)
  localStorage.setItem("issues", JSON.stringify(updatedIssues))
}

// Notification utilities
export const getNotifications = (userId: string): Notification[] => {
  const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
  return notifications.filter((n: Notification) => n.userId === userId)
}

export const addNotification = (notification: Notification) => {
  const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
  notifications.push(notification)
  localStorage.setItem("notifications", JSON.stringify(notifications))
}

export const markNotificationAsRead = (notificationId: string) => {
  const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
  const updated = notifications.map((n: Notification) => (n.id === notificationId ? { ...n, read: true } : n))
  localStorage.setItem("notifications", JSON.stringify(updated))
}

// Message utilities
export const getMessages = (userId: string): Message[] => {
  const messages = JSON.parse(localStorage.getItem("messages") || "[]")
  return messages.filter((m: Message) => m.senderId === userId || m.receiverId === userId)
}

export const sendMessage = (message: Message) => {
  const messages = JSON.parse(localStorage.getItem("messages") || "[]")
  messages.push(message)
  localStorage.setItem("messages", JSON.stringify(messages))
  addNotification({
    id: Date.now().toString(),
    userId: message.receiverId,
    type: "message",
    issueId: message.issueId,
    message: `${message.senderName} sent you a message`,
    read: false,
    createdAt: new Date().toISOString(),
  })
}

// User stats utilities
export const getUserStats = (userId: string): UserStats => {
  const issues = getIssues()
  const users = getAllUsers()
  const user = users.find((u) => u.id === userId)

  const issuesPosted = issues.filter((i) => i.createdById === userId).length
  const issuesResolved = issues.filter((i) => i.createdById === userId && i.status === "resolved").length

  let repliesGiven = 0
  let creditsEarned = 0
  issues.forEach((issue) => {
    issue.replies?.forEach((reply) => {
      if (reply.authorId === userId) {
        repliesGiven++
        creditsEarned += reply.credits
      }
    })
  })

  return {
    userId,
    issuesPosted,
    issuesResolved,
    repliesGiven,
    creditsEarned,
    averageRating: user?.rating || 0,
    skillsCount: user?.skills && Array.isArray(user.skills) ? user.skills.length : 0,
    lastActive: new Date().toISOString(),
  }
}

// Search and filter utilities
export const searchIssues = (query: string, issues: Issue[]): Issue[] => {
  const q = query.toLowerCase()
  return issues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(q) ||
      issue.description.toLowerCase().includes(q) ||
      issue.category.toLowerCase().includes(q) ||
      issue.tags?.some((tag) => tag.toLowerCase().includes(q)),
  )
}

export const filterIssues = (
  issues: Issue[],
  filters: {
    status?: Issue["status"]
    priority?: Issue["priority"]
    type?: Issue["type"]
    category?: string
    createdBy?: string
  },
): Issue[] => {
  return issues.filter((issue) => {
    if (filters.status && issue.status !== filters.status) return false
    if (filters.priority && issue.priority !== filters.priority) return false
    if (filters.type && issue.type !== filters.type) return false
    if (filters.category && issue.category !== filters.category) return false
    if (filters.createdBy && issue.createdBy !== filters.createdBy) return false
    return true
  })
}

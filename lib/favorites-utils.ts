export const addFavorite = (userId: string, issueId: string) => {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "{}")
  if (!favorites[userId]) {
    favorites[userId] = []
  }
  if (!favorites[userId].includes(issueId)) {
    favorites[userId].push(issueId)
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }
}

export const removeFavorite = (userId: string, issueId: string) => {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "{}")
  if (favorites[userId]) {
    favorites[userId] = favorites[userId].filter((id: string) => id !== issueId)
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }
}

export const isFavorite = (userId: string, issueId: string): boolean => {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "{}")
  return favorites[userId]?.includes(issueId) || false
}

export const getFavorites = (userId: string): string[] => {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "{}")
  return favorites[userId] || []
}

// History utilities
export const addToHistory = (userId: string, issueId: string) => {
  const history = JSON.parse(localStorage.getItem("history") || "{}")
  if (!history[userId]) {
    history[userId] = []
  }
  history[userId] = [
    { issueId, viewedAt: new Date().toISOString() },
    ...history[userId].filter((h: any) => h.issueId !== issueId).slice(0, 19),
  ]
  localStorage.setItem("history", JSON.stringify(history))
}

export const getHistory = (userId: string): any[] => {
  const history = JSON.parse(localStorage.getItem("history") || "{}")
  return history[userId] || []
}

export const clearHistory = (userId: string) => {
  const history = JSON.parse(localStorage.getItem("history") || "{}")
  delete history[userId]
  localStorage.setItem("history", JSON.stringify(history))
}

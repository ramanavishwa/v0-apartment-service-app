export const getCurrentUser = () => {
  if (typeof window === "undefined") return null
  try {
    const user = localStorage.getItem("currentUser")
    return user ? JSON.parse(user) : null
  } catch (e) {
    return null
  }
}

export const setCurrentUser = (user: any) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem("currentUser", JSON.stringify(user))
  } catch (e) {
    console.error("Failed to save user:", e)
  }
}

export const logout = () => {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem("currentUser")
  } catch (e) {
    console.error("Failed to logout:", e)
  }
}

export const isLoggedIn = () => {
  return getCurrentUser() !== null
}

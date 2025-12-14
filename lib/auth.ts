export interface User {
  email: string
  role: "admin" | "user"
  name: string
  idNumber?: string
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr) as User
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getUser() !== null
}

export function isAdmin(): boolean {
  const user = getUser()
  return user?.role === "admin"
}

export function logout(): void {
  localStorage.removeItem("user")
}

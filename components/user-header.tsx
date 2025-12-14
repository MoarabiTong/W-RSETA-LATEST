"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"

export function UserHeader() {
  const router = useRouter()
  const [userName, setUserName] = useState("User")

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      setUserName(userData.name || "User")
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/auth")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-auto items-center justify-center">
              <Image
                src="/images/wrseta-logo.png"
                alt="W&RSETA Logo"
                width={180}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="border-l border-border pl-3 ml-3">
              <h1 className="text-xl font-semibold text-foreground">Identity Trust Engine</h1>
              <p className="text-sm text-muted-foreground">Learner Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border-2 border-primary">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-foreground font-medium">{userName}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

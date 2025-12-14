"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ComplianceStatus } from "@/components/compliance-status"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"

export function AdminHeader() {
  const router = useRouter()
  const [userName, setUserName] = useState("Admin")

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      setUserName(userData.name || "Admin")
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/auth")
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
              <p className="text-sm text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ComplianceStatus />
            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground">
                Welcome, <span className="font-semibold">{userName}</span>
              </span>
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

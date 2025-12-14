"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, CreditCard } from "lucide-react"
import { useEffect, useState } from "react"

interface UserData {
  name: string
  email: string
  idNumber: string
}

export function UserProfileCard() {
  const [userData, setUserData] = useState<UserData>({
    name: "User",
    email: "user@example.com",
    idNumber: "************",
  })

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const data = JSON.parse(user)
      setUserData({
        name: data.name || "User",
        email: data.email || "user@example.com",
        idNumber: data.idNumber || "************",
      })
    }
  }, [])

  const maskIdNumber = (id: string) => {
    if (id.length !== 13) return id
    return `${id.slice(0, 6)}***${id.slice(-2)}`
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
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Personal information and ID details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getInitials(userData.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{userData.name}</h3>
              <p className="text-sm text-muted-foreground">Registered Learner</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Email Address</p>
                <p className="text-foreground font-medium">{userData.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">ID Number</p>
                <p className="text-foreground font-medium font-mono">{maskIdNumber(userData.idNumber)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

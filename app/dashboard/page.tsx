"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserHeader } from "@/components/user-header"
import { UserProfileCard } from "@/components/user-profile-card"
import { VerificationStatusCard } from "@/components/verification-status-card"
import { UserVerificationHistory } from "@/components/user-verification-history"
import { UserActions } from "@/components/user-actions"
import { Level2VerificationBanner } from "@/components/level2-verification-banner"
import { DocumentUploadDialog } from "@/components/document-upload-dialog"
import { ProfileCompletionDialog } from "@/components/profile-completion-dialog"

export default function UserDashboard() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [profileCompleted, setProfileCompleted] = useState(false)
  const [level2Completed, setLevel2Completed] = useState(false)
  const [needsLevel2, setNeedsLevel2] = useState(true)

  useEffect(() => {
    const userStr = localStorage.getItem("user")

    if (!userStr) {
      router.push("/auth")
      return
    }

    const user = JSON.parse(userStr)

    if (user.role === "admin") {
      router.push("/admin")
      return
    }

    setIsAuthorized(true)

    if (user.profileCompleted === false) {
      setShowProfileDialog(true)
      setProfileCompleted(false)
    } else {
      setProfileCompleted(true)
    }
  }, [router])

  const handleProfileComplete = (data: any) => {
    console.log("[v0] Profile completed:", data)
    setProfileCompleted(true)
    setShowProfileDialog(false)

    // Update user in localStorage
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      user.profileCompleted = true
      user.profileData = data
      localStorage.setItem("user", JSON.stringify(user))
    }

    // Show document upload dialog next
    setTimeout(() => {
      setShowUploadDialog(true)
    }, 500)
  }

  const handleVerificationComplete = (data: any) => {
    console.log("[v0] Level 2 verification submitted:", data)
    setLevel2Completed(true)
    setNeedsLevel2(false)
  }

  const handleStartVerification = () => {
    if (!profileCompleted) {
      setShowProfileDialog(true)
    } else {
      setShowUploadDialog(true)
    }
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <UserHeader />

      <main className="container mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Welcome Message */}
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-1">View your ID verification status and history</p>
          </div>

          {needsLevel2 && !level2Completed && (
            <Level2VerificationBanner onStartVerification={handleStartVerification} />
          )}

          {/* Profile and Status */}
          <div className="grid gap-6 md:grid-cols-2">
            <UserProfileCard />
            <VerificationStatusCard />
          </div>

          {/* Verification History */}
          <UserVerificationHistory />

          {/* User Actions */}
          <UserActions />
        </div>
      </main>

      <ProfileCompletionDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        onComplete={handleProfileComplete}
      />

      <DocumentUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onComplete={handleVerificationComplete}
      />
    </div>
  )
}

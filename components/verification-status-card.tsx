"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Shield, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

export function VerificationStatusCard() {
  const [verificationStatus, setVerificationStatus] = useState({
    status: "verified",
    verifiedDate: "2024-01-15",
    nextReview: "2025-01-15",
  })

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, use mock data
  }, [])

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "verified":
        return {
          label: "Verified",
          variant: "default" as const,
          icon: CheckCircle2,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
        }
      case "pending":
        return {
          label: "Pending Review",
          variant: "secondary" as const,
          icon: Clock,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
        }
      default:
        return {
          label: "Not Verified",
          variant: "secondary" as const,
          icon: Shield,
          color: "text-muted-foreground",
          bgColor: "bg-muted",
        }
    }
  }

  const statusConfig = getStatusConfig(verificationStatus.status)
  const StatusIcon = statusConfig.icon

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Status</CardTitle>
        <CardDescription>Current ID verification state</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full ${statusConfig.bgColor}`}>
              <StatusIcon className={`h-8 w-8 ${statusConfig.color}`} />
            </div>
            <div>
              <Badge variant={statusConfig.variant} className="mb-2">
                {statusConfig.label}
              </Badge>
              <p className="text-sm text-muted-foreground">Your identity has been successfully verified</p>
            </div>
          </div>

          {/* Verification Details */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                <span>Verified On</span>
              </div>
              <span className="text-foreground font-medium">{verificationStatus.verifiedDate}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Next Review</span>
              </div>
              <span className="text-foreground font-medium">{verificationStatus.nextReview}</span>
            </div>
          </div>

          {/* Trust Score */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Trust Score</span>
              <span className="text-sm font-semibold text-foreground">95/100</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: "95%" }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Excellent standing with W&RSETA</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

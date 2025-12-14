"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Activity } from "lucide-react"

interface VerificationStatus {
  idNumber: string
  status: "verified" | "blocked" | "review"
  riskScore: number
  lifeStatus: "alive" | "deceased"
  timestamp: string
}

export function LiveVerificationPanel() {
  const [current, setCurrent] = useState<VerificationStatus>({
    idNumber: "800101*****08",
    status: "verified",
    riskScore: 12,
    lifeStatus: "alive",
    timestamp: new Date().toISOString(),
  })

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      const statuses: Array<"verified" | "blocked" | "review"> = ["verified", "blocked", "review"]
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

      setCurrent({
        idNumber: `${Math.floor(Math.random() * 900000 + 100000)}*****${Math.floor(Math.random() * 90 + 10)}`,
        status: randomStatus,
        riskScore: Math.floor(Math.random() * 100),
        lifeStatus: Math.random() > 0.95 ? "deceased" : "alive",
        timestamp: new Date().toISOString(),
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "blocked":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "review":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRiskColor = (score: number) => {
    if (score < 30) return "text-green-500"
    if (score < 70) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Activity className="h-5 w-5 text-blue-500" />
            Live Verification Status
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">Real-time</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">ID Number</span>
            <span className="font-mono text-sm text-foreground">{current.idNumber}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant="outline" className={getStatusColor(current.status)}>
              {current.status.toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Risk Score</span>
            <span className={`text-sm font-semibold ${getRiskColor(current.riskScore)}`}>{current.riskScore}/100</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Life Status</span>
            <Badge
              variant="outline"
              className={
                current.lifeStatus === "alive"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : "bg-red-500/10 text-red-500 border-red-500/20"
              }
            >
              {current.lifeStatus.toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Source</span>
            <span className="text-sm text-foreground">Home Affairs (Mock API)</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Timestamp</span>
            <span className="text-xs text-muted-foreground">{new Date(current.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

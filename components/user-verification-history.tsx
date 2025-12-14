"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle } from "lucide-react"

interface VerificationRecord {
  id: string
  date: string
  type: string
  status: "verified" | "pending" | "failed"
  method: string
}

const mockHistory: VerificationRecord[] = [
  {
    id: "VER-2024-001",
    date: "2024-01-15 10:23:15",
    type: "Initial Registration",
    status: "verified",
    method: "Home Affairs API",
  },
  {
    id: "VER-2023-089",
    date: "2023-12-10 14:45:32",
    type: "Profile Update",
    status: "verified",
    method: "Home Affairs API",
  },
  {
    id: "VER-2023-067",
    date: "2023-11-05 09:12:18",
    type: "Annual Review",
    status: "verified",
    method: "Home Affairs API",
  },
]

export function UserVerificationHistory() {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "verified":
        return {
          label: "Verified",
          variant: "default" as const,
          icon: CheckCircle2,
          color: "text-green-500",
        }
      case "pending":
        return {
          label: "Pending",
          variant: "secondary" as const,
          icon: Clock,
          color: "text-yellow-500",
        }
      case "failed":
        return {
          label: "Failed",
          variant: "destructive" as const,
          icon: XCircle,
          color: "text-red-500",
        }
      default:
        return {
          label: "Unknown",
          variant: "secondary" as const,
          icon: Clock,
          color: "text-muted-foreground",
        }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification History</CardTitle>
        <CardDescription>Your ID verification activity log</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockHistory.map((record) => {
            const statusConfig = getStatusConfig(record.status)
            const StatusIcon = statusConfig.icon

            return (
              <div key={record.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted shrink-0">
                  <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="text-sm font-medium text-foreground">{record.type}</p>
                      <p className="text-xs text-muted-foreground">{record.date}</p>
                    </div>
                    <Badge variant={statusConfig.variant} className="shrink-0">
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span>ID: {record.id}</span>
                    <span>Method: {record.method}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

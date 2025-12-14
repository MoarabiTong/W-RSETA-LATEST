"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Skull, Copy, RefreshCw } from "lucide-react"

interface Alert {
  id: string
  type: "critical" | "warning"
  icon: typeof Skull
  message: string
  timestamp: string
}

export function AlertsPanel() {
  const alerts: Alert[] = [
    {
      id: "1",
      type: "critical",
      icon: Skull,
      message: "Deceased ID attempted - 920304*****03",
      timestamp: "2 minutes ago",
    },
    {
      id: "2",
      type: "warning",
      icon: Copy,
      message: "Duplicate ID verification detected - 850612*****09",
      timestamp: "15 minutes ago",
    },
    {
      id: "3",
      type: "warning",
      icon: RefreshCw,
      message: "Blocked ID retry attempt - 780921*****04",
      timestamp: "32 minutes ago",
    },
    {
      id: "4",
      type: "warning",
      icon: AlertTriangle,
      message: "Multiple attempts from same device (IP: 196.***.***.142)",
      timestamp: "1 hour ago",
    },
  ]

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Alerts & Flags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
            >
              <div
                className={`mt-0.5 rounded-lg p-2 ${alert.type === "critical" ? "bg-red-500/10" : "bg-yellow-500/10"}`}
              >
                <alert.icon className={`h-4 w-4 ${alert.type === "critical" ? "text-red-500" : "text-yellow-500"}`} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      alert.type === "critical"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    }
                  >
                    {alert.type.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                </div>
                <p className="text-sm text-foreground">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

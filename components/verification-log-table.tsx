"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Eye } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  maskedId: string
  result: "verified" | "blocked" | "review"
  riskScore: number
  lifeStatus: "alive" | "deceased"
  verifiedBy: string
  source: string
}

export function VerificationLogTable() {
  const logs: LogEntry[] = [
    {
      id: "1",
      timestamp: new Date().toISOString(),
      maskedId: "950816*****02",
      result: "verified",
      riskScore: 8,
      lifeStatus: "alive",
      verifiedBy: "System",
      source: "Home Affairs",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 120000).toISOString(),
      maskedId: "880522*****07",
      result: "blocked",
      riskScore: 92,
      lifeStatus: "deceased",
      verifiedBy: "System",
      source: "Home Affairs",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      maskedId: "920304*****01",
      result: "review",
      riskScore: 68,
      lifeStatus: "alive",
      verifiedBy: "Admin",
      source: "Home Affairs",
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 480000).toISOString(),
      maskedId: "850612*****09",
      result: "verified",
      riskScore: 15,
      lifeStatus: "alive",
      verifiedBy: "System",
      source: "Home Affairs",
    },
    {
      id: "5",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      maskedId: "780921*****04",
      result: "blocked",
      riskScore: 85,
      lifeStatus: "alive",
      verifiedBy: "Admin",
      source: "Home Affairs",
    },
  ]

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
            <FileText className="h-5 w-5 text-blue-500" />
            Verification Audit Log
          </CardTitle>
          <Button variant="outline" size="sm">
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 text-sm font-medium text-muted-foreground">Date & Time</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Masked ID</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Result</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Risk Score</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Life Status</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Verified By</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Source</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border transition-colors hover:bg-accent">
                  <td className="py-4 text-sm text-foreground">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-4">
                    <span className="font-mono text-sm text-foreground">{log.maskedId}</span>
                  </td>
                  <td className="py-4">
                    <Badge variant="outline" className={getStatusColor(log.result)}>
                      {log.result}
                    </Badge>
                  </td>
                  <td className="py-4">
                    <span className={`text-sm font-semibold ${getRiskColor(log.riskScore)}`}>{log.riskScore}</span>
                  </td>
                  <td className="py-4">
                    <Badge
                      variant="outline"
                      className={
                        log.lifeStatus === "alive"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      }
                    >
                      {log.lifeStatus}
                    </Badge>
                  </td>
                  <td className="py-4 text-sm text-foreground">{log.verifiedBy}</td>
                  <td className="py-4 text-sm text-muted-foreground">{log.source}</td>
                  <td className="py-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, XCircle, AlertTriangle, Skull, Clock, Download } from "lucide-react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface KPIData {
  total: number
  verified: number
  blocked: number
  deceased: number
  pending: number
}

type KPIType = "total" | "verified" | "blocked" | "deceased" | "pending"

export function KPICards() {
  const [data, setData] = useState<KPIData>({
    total: 0,
    verified: 0,
    blocked: 0,
    deceased: 0,
    pending: 0,
  })
  const [selectedKPI, setSelectedKPI] = useState<KPIType | null>(null)

  useEffect(() => {
    // Simulate fetching data
    setData({
      total: 1247,
      verified: 1089,
      blocked: 142,
      deceased: 8,
      pending: 8,
    })
  }, [])

  const generateCSV = (type: KPIType) => {
    const headers = ["ID Number", "Status", "Risk Score"]
    const rows: string[][] = []

    const count = data[type]
    for (let i = 0; i < count; i++) {
      const idNumber = `${Math.floor(Math.random() * 900000 + 100000)}*****${Math.floor(Math.random() * 90 + 10)}`
      const timestamp = new Date(Date.now() - Math.random() * 86400000).toISOString()

      let status: string
      let riskScore: number

      // Set specific values based on type
      switch (type) {
        case "total":
          // Total shows mix of verified IDs only (excluding blocked/deceased/pending)
          status = "verified"
          riskScore = Math.floor(Math.random() * 30) // Low risk for verified
          break
        case "verified":
          status = "verified"
          riskScore = Math.floor(Math.random() * 30) // Low risk
          break
        case "blocked":
          status = "blocked"
          riskScore = Math.floor(Math.random() * 40 + 60) // High risk (60-100)
          break
        case "deceased":
          status = "deceased"
          riskScore = 100 // Maximum risk
          break
        case "pending":
          status = "pending"
          riskScore = Math.floor(Math.random() * 60 + 20) // Medium to high risk (20-80)
          break
        default:
          status = "unknown"
          riskScore = 0
      }

      rows.push([idNumber, status, riskScore.toString()])
    }

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    return csvContent
  }

  const downloadCSV = (type: KPIType) => {
    const csvContent = generateCSV(type)
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${type}_verifications_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setSelectedKPI(null)
  }

  const getCSVDescription = (type: KPIType | null) => {
    if (!type) return []

    switch (type) {
      case "total":
        return [
          "Verified ID Numbers (masked for privacy)",
          "Verification Status (verified only)",
          "Low Risk Scores (0-30)",
        ]
      case "verified":
        return ["Verified ID Numbers (masked for privacy)", "Verification Status (verified)", "Low Risk Scores (0-30)"]
      case "blocked":
        return ["Blocked ID Numbers (masked for privacy)", "Verification Status (blocked)", "High Risk Scores (60-100)"]
      case "deceased":
        return [
          "Deceased ID Numbers (masked for privacy)",
          "Verification Status (deceased)",
          "Risk Score (100 - maximum risk)",
        ]
      case "pending":
        return [
          "Pending ID Numbers (masked for privacy)",
          "Verification Status (pending review)",
          "Medium to High Risk Scores (20-80)",
        ]
      default:
        return []
    }
  }

  const kpis: Array<{
    label: string
    value: string
    icon: typeof Clock
    color: string
    bgColor: string
    type: KPIType
  }> = [
    {
      label: "Total Verifications Today",
      value: data.total.toLocaleString(),
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      type: "total",
    },
    {
      label: "Verified IDs",
      value: data.verified.toLocaleString(),
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      type: "verified",
    },
    {
      label: "Blocked IDs",
      value: data.blocked.toLocaleString(),
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      type: "blocked",
    },
    {
      label: "Deceased IDs Detected",
      value: data.deceased.toLocaleString(),
      icon: Skull,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      type: "deceased",
    },
    {
      label: "Pending Reviews",
      value: data.pending.toLocaleString(),
      icon: AlertTriangle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      type: "pending",
    },
  ]

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <Card
            key={kpi.label}
            className="border-border cursor-pointer transition-all hover:shadow-md hover:scale-105"
            onClick={() => setSelectedKPI(kpi.type)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                </div>
                <div className={`rounded-lg p-2 ${kpi.bgColor}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={selectedKPI !== null} onOpenChange={(open) => !open && setSelectedKPI(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Download Verification Data
            </DialogTitle>
            <DialogDescription>
              Export {selectedKPI ? kpis.find((k) => k.type === selectedKPI)?.label : ""} data as CSV file
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-foreground mb-2">This will download a CSV file containing:</p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                {getCSVDescription(selectedKPI).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setSelectedKPI(null)}>
                Cancel
              </Button>
              <Button onClick={() => selectedKPI && downloadCSV(selectedKPI)}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

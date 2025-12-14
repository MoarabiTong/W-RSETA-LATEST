"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp } from "lucide-react"

export function RiskAnalysis() {
  const avgRiskScore = 23.4
  const highRiskCount = 47
  const trend = -5.2 // percentage change

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Risk Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Average Risk Score (30 days)</span>
            <span className="text-2xl font-bold text-foreground">{avgRiskScore}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-yellow-500"
              style={{ width: `${avgRiskScore}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">High-Risk Verifications</span>
            <span className="text-2xl font-bold text-orange-500">{highRiskCount}</span>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            {trend < 0 ? (
              <TrendingDown className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingUp className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm text-muted-foreground">Trend:</span>
            <span className={`text-sm font-semibold ${trend < 0 ? "text-green-500" : "text-red-500"}`}>
              {Math.abs(trend)}% {trend < 0 ? "decrease" : "increase"}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Risk scoring assists human decision-making and fraud prevention.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

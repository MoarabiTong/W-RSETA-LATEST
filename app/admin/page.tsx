"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { KPICards } from "@/components/kpi-cards"
import { LiveVerificationPanel } from "@/components/live-verification-panel"
import { AlertsPanel } from "@/components/alerts-panel"
import { RiskAnalysis } from "@/components/risk-analysis"
import { VerificationLogTable } from "@/components/verification-log-table"
import { AdminHeader } from "@/components/admin-header"
import { DocumentReviewPanel } from "@/components/document-review-panel"
import { Button } from "@/components/ui/button"
import { FileText, ScrollText, Upload, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [activeView, setActiveView] = useState<"review" | "audit" | "alerts" | null>(null)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [importResult, setImportResult] = useState<{
    success: number
    failed: number
    errors: string[]
  } | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem("user")

    if (!userStr) {
      router.push("/auth")
      return
    }

    const user = JSON.parse(userStr)

    if (user.role !== "admin") {
      router.push("/dashboard")
      return
    }

    setIsAuthorized(true)
  }, [router])

  const handleViewToggle = (view: "review" | "audit" | "alerts") => {
    setActiveView((prev) => (prev === view ? null : view))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ]
      if (validTypes.includes(file.type) || file.name.endsWith(".csv") || file.name.endsWith(".xlsx")) {
        setSelectedFile(file)
        setImportResult(null)
      } else {
        alert("Please select a valid CSV or Excel file")
      }
    }
  }

  const handleImport = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setImportResult(null)

    // Simulate file processing
    setTimeout(() => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const text = e.target?.result as string
        const lines = text.split("\n").filter((line) => line.trim())

        // Skip header row
        const dataRows = lines.slice(1)
        const successCount = Math.floor(dataRows.length * 0.85)
        const failedCount = dataRows.length - successCount

        const errors: string[] = []
        if (failedCount > 0) {
          errors.push(`${failedCount} records failed validation`)
          errors.push("Invalid ID format detected in some records")
          errors.push("Missing required fields in some entries")
        }

        setImportResult({
          success: successCount,
          failed: failedCount,
          errors,
        })
        setIsProcessing(false)
      }

      reader.onerror = () => {
        setImportResult({
          success: 0,
          failed: 0,
          errors: ["Failed to read file. Please try again."],
        })
        setIsProcessing(false)
      }

      reader.readAsText(selectedFile)
    }, 2000)
  }

  const handleCloseImport = () => {
    setIsImportOpen(false)
    setSelectedFile(null)
    setImportResult(null)
    setIsProcessing(false)
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Checking authorization...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Static Sidebar - Fixed on Left */}
          <div className="w-56 flex-shrink-0 space-y-3">
            <h3 className="text-sm font-semibold text-foreground mb-4 px-2">Quick Actions</h3>
            <Button
              variant={activeView === "review" ? "default" : "outline"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                activeView === "review"
                  ? "bg-green-100 text-green-900 hover:bg-green-200 border-green-300"
                  : "hover:bg-green-50 hover:border-green-200",
              )}
              onClick={() => handleViewToggle("review")}
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Review</span>
            </Button>
            <Button
              variant={activeView === "audit" ? "default" : "outline"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                activeView === "audit"
                  ? "bg-green-100 text-green-900 hover:bg-green-200 border-green-300"
                  : "hover:bg-green-50 hover:border-green-200",
              )}
              onClick={() => handleViewToggle("audit")}
            >
              <ScrollText className="h-5 w-5" />
              <span className="font-medium">Audit</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-11 hover:bg-green-50 hover:border-green-200 bg-transparent"
              onClick={() => setIsImportOpen(true)}
            >
              <Upload className="h-5 w-5" />
              <span className="font-medium">Bulk Verification</span>
            </Button>
            <Button
              variant={activeView === "alerts" ? "default" : "outline"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                activeView === "alerts"
                  ? "bg-green-100 text-green-900 hover:bg-green-200 border-green-300"
                  : "hover:bg-green-50 hover:border-green-200",
              )}
              onClick={() => handleViewToggle("alerts")}
            >
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Alerts & Flags</span>
            </Button>
          </div>

          {/* Main Dashboard Content */}
          <div className="flex-1 space-y-6">
            {/* KPI Cards */}
            <div className="mb-6">
              <KPICards />
            </div>

            {/* Live Status and Risk Analysis */}
            <div className="grid gap-6 lg:grid-cols-2">
              <LiveVerificationPanel />
              <RiskAnalysis />
            </div>

            {activeView && (
              <div className="mt-8 border-t-2 border-green-200 pt-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="bg-card rounded-lg border shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">
                      {activeView === "review"
                        ? "Level 2 Document Review"
                        : activeView === "audit"
                          ? "Verification Audit Log"
                          : "Alerts & Flags"}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveView(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Close
                    </Button>
                  </div>
                  {activeView === "review" && <DocumentReviewPanel />}
                  {activeView === "audit" && <VerificationLogTable />}
                  {activeView === "alerts" && <AlertsPanel />}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Import Bulk Dialog */}
      <Dialog open={isImportOpen} onOpenChange={handleCloseImport}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Bulk Verification Import</DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file containing ID numbers for bulk verification.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* File Upload Section */}
            <div className="grid gap-2">
              <Label htmlFor="file-upload" className="text-sm font-medium">
                Select File
              </Label>
              <div className="flex items-center gap-3">
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-200 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: <span className="font-medium text-foreground">{selectedFile.name}</span>
                </p>
              )}
            </div>

            {/* File Format Info */}
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">Expected Format:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• First row should contain headers</li>
                <li>• Required column: ID Number</li>
                <li>• Optional columns: Name, Date of Birth, etc.</li>
                <li>• Supported formats: CSV, XLS, XLSX</li>
              </ul>
            </div>

            {/* Import Result */}
            {importResult && (
              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  {importResult.failed === 0 ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Import Successful
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      Import Completed with Warnings
                    </>
                  )}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Successfully imported:</span>
                    <span className="font-medium text-green-600">{importResult.success} records</span>
                  </div>
                  {importResult.failed > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Failed:</span>
                      <span className="font-medium text-red-600">{importResult.failed} records</span>
                    </div>
                  )}
                </div>
                {importResult.errors.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium text-foreground mb-2">Errors:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {importResult.errors.map((error, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseImport} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!selectedFile || isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isProcessing ? "Processing..." : "Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

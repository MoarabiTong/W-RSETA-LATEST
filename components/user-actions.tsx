"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, FileText, HelpCircle, Download } from "lucide-react"

export function UserActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Manage your verification and records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4 bg-transparent">
            <RefreshCw className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="font-medium text-sm">Request Re-verification</p>
              <p className="text-xs text-muted-foreground">Update your ID status</p>
            </div>
          </Button>

          <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4 bg-transparent">
            <Download className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="font-medium text-sm">Download Certificate</p>
              <p className="text-xs text-muted-foreground">Get verification proof</p>
            </div>
          </Button>

          <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4 bg-transparent">
            <FileText className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="font-medium text-sm">View Full Report</p>
              <p className="text-xs text-muted-foreground">Detailed verification log</p>
            </div>
          </Button>

          <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4 bg-transparent">
            <HelpCircle className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="font-medium text-sm">Get Support</p>
              <p className="text-xs text-muted-foreground">Contact W&RSETA</p>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

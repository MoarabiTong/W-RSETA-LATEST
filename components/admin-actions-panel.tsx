"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Ban, CheckCircle, FileEdit, Download } from "lucide-react"

export function AdminActionsPanel() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Admin Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <Button variant="outline" className="justify-start gap-2 bg-transparent">
            <Search className="h-4 w-4" />
            View Details
          </Button>
          <Button variant="outline" className="justify-start gap-2 bg-transparent">
            <Ban className="h-4 w-4" />
            Block ID
          </Button>
          <Button variant="outline" className="justify-start gap-2 bg-transparent">
            <CheckCircle className="h-4 w-4" />
            Override Verification
          </Button>
          <Button variant="outline" className="justify-start gap-2 bg-transparent">
            <FileEdit className="h-4 w-4" />
            Add Notes
          </Button>
          <Button variant="outline" className="justify-start gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

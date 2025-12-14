"use client"

import { Badge } from "@/components/ui/badge"
import { Lock, Shield, FileText, Globe } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function ComplianceStatus() {
  const statusItems = [
    {
      icon: Lock,
      label: "Encryption",
      status: "Enabled",
      color: "text-green-500",
    },
    {
      icon: Shield,
      label: "POPIA",
      status: "Compliant",
      color: "text-green-500",
    },
    {
      icon: FileText,
      label: "Audit Logging",
      status: "Active",
      color: "text-green-500",
    },
    {
      icon: Globe,
      label: "API Status",
      status: "Online",
      color: "text-green-500",
    },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 transition-colors hover:bg-accent">
          <Shield className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium text-foreground">Security & Compliance</span>
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Compliant
          </Badge>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Security & Compliance Status</h4>
            <div className="space-y-3">
              {statusItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              All personal data is masked and encrypted to comply with POPIA regulations. Full audit trail is maintained
              for compliance.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

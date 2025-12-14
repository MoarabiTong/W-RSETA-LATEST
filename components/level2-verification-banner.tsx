"use client"

import { AlertTriangle, Shield, Upload, Camera } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Level2VerificationBannerProps {
  onStartVerification: () => void
}

export function Level2VerificationBanner({ onStartVerification }: Level2VerificationBannerProps) {
  return (
    <Card className="border-warning bg-warning/5 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/20">
          <AlertTriangle className="h-6 w-6 text-warning" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-foreground">Level 2 Verification Required</h3>
            <Badge variant="outline" className="border-warning text-warning">
              Action Needed
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Our system detected a potential ID mismatch. For your security and to comply with POPIA regulations, we need
            additional verification. This helps us ensure your identity is protected.
          </p>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Certified ID Copy</p>
                <p className="text-xs text-muted-foreground">Upload scanned document</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Camera className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Facial Verification</p>
                <p className="text-xs text-muted-foreground">Live photo capture</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Trust Score Analysis</p>
                <p className="text-xs text-muted-foreground">AI-powered verification</p>
              </div>
            </div>
          </div>
          <Button onClick={onStartVerification} className="bg-primary hover:bg-primary/90">
            Start Enhanced Verification
          </Button>
        </div>
      </div>
    </Card>
  )
}

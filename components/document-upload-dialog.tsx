"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, Camera, CheckCircle2, Loader2, FileText, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface DocumentUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (data: VerificationData) => void
}

interface VerificationData {
  idDocument: File | null
  faceImage: File | null
  trustScore: number
  biometricMatch: number
}

export function DocumentUploadDialog({ open, onOpenChange, onComplete }: DocumentUploadDialogProps) {
  const [step, setStep] = useState<"upload" | "face" | "processing" | "complete">("upload")
  const [idDocument, setIdDocument] = useState<File | null>(null)
  const [faceImage, setFaceImage] = useState<File | null>(null)
  const [trustScore, setTrustScore] = useState(0)
  const [biometricMatch, setBiometricMatch] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIdDocument(file)
      setTimeout(() => setStep("face"), 500)
    }
  }

  const handleFaceCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFaceImage(file)
      setIsProcessing(true)
      setStep("processing")

      // Simulate AI processing with realistic scoring
      simulateVerification()
    }
  }

  const simulateVerification = () => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      if (progress <= 100) {
        // Simulate scores building up
        setTrustScore(Math.min(progress * 0.92, 92))
        setBiometricMatch(Math.min(progress * 0.88, 88))
      }

      if (progress >= 100) {
        clearInterval(interval)
        setIsProcessing(false)
        setStep("complete")
      }
    }, 200)
  }

  const handleSubmit = () => {
    onComplete({
      idDocument,
      faceImage,
      trustScore,
      biometricMatch,
    })
    onOpenChange(false)
  }

  const handleReset = () => {
    setStep("upload")
    setIdDocument(null)
    setFaceImage(null)
    setTrustScore(0)
    setBiometricMatch(0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Enhanced Level 2 Verification</DialogTitle>
          <DialogDescription>
            Upload your documents and complete facial verification for secure identity confirmation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-6">
            {[
              { key: "upload", label: "ID Document" },
              { key: "face", label: "Face Scan" },
              { key: "processing", label: "Analysis" },
              { key: "complete", label: "Complete" },
            ].map((s, idx) => (
              <div key={s.key} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    step === s.key
                      ? "border-primary bg-primary text-primary-foreground"
                      : ["face", "processing", "complete"].indexOf(step) >
                          ["upload", "face", "processing", "complete"].indexOf(s.key)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {idx + 1}
                </div>
                {idx < 3 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      ["face", "processing", "complete"].indexOf(step) > idx ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Upload ID Document Step */}
          {step === "upload" && (
            <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 flex flex-col items-center justify-center gap-4 cursor-pointer"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground mb-1">Upload Certified ID Copy</p>
                  <p className="text-sm text-muted-foreground">
                    PDF, JPG, PNG up to 10MB • Must be certified within 3 months
                  </p>
                </div>
                {idDocument && (
                  <Badge variant="outline" className="border-success text-success">
                    <FileText className="h-3 w-3 mr-1" />
                    {idDocument.name}
                  </Badge>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleDocumentUpload}
                className="hidden"
              />
            </Card>
          )}

          {/* Face Capture Step */}
          {step === "face" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 rounded-lg bg-success/10 border border-success/20">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-sm font-medium text-success">ID Document uploaded successfully</span>
              </div>
              <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full p-8 flex flex-col items-center justify-center gap-4 cursor-pointer"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground mb-1">Capture Your Face</p>
                    <p className="text-sm text-muted-foreground">Take a clear photo for biometric comparison</p>
                  </div>
                  {faceImage && (
                    <Badge variant="outline" className="border-success text-success">
                      <Camera className="h-3 w-3 mr-1" />
                      Face captured
                    </Badge>
                  )}
                </button>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleFaceCapture}
                  className="hidden"
                />
              </Card>
            </div>
          )}

          {/* Processing Step */}
          {step === "processing" && (
            <div className="space-y-6">
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-4">
                  <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
                  <p className="text-lg font-semibold text-foreground">Analyzing Documents</p>
                  <p className="text-sm text-muted-foreground">Please wait while we verify your identity...</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Document Analysis</span>
                    <span className="text-sm text-muted-foreground">{Math.round(trustScore)}%</span>
                  </div>
                  <Progress value={trustScore} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Biometric Match</span>
                    <span className="text-sm text-muted-foreground">{Math.round(biometricMatch)}%</span>
                  </div>
                  <Progress value={biometricMatch} className="h-2" />
                </div>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {step === "complete" && (
            <div className="space-y-6">
              <div className="flex items-center justify-center py-6">
                <div className="text-center space-y-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 mx-auto">
                    <CheckCircle2 className="h-10 w-10 text-success" />
                  </div>
                  <p className="text-xl font-bold text-foreground">Verification Complete!</p>
                  <p className="text-sm text-muted-foreground">
                    Your documents have been analyzed and submitted for admin review
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Trust Score</p>
                    <p className="text-4xl font-bold text-primary">{Math.round(trustScore)}%</p>
                    <Badge variant="outline" className="mt-2 border-success text-success">
                      High Confidence
                    </Badge>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Biometric Match</p>
                    <p className="text-4xl font-bold text-primary">{Math.round(biometricMatch)}%</p>
                    <Badge variant="outline" className="mt-2 border-success text-success">
                      Strong Match
                    </Badge>
                  </div>
                </Card>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent">
                  <X className="h-4 w-4 mr-2" />
                  Restart
                </Button>
                <Button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90">
                  Submit for Review
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

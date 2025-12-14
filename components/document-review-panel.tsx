"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle, XCircle, Eye, Download, AlertTriangle, Shield, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { validateSAIDNumber, compareMismatch, type SAIDInfo } from "@/lib/sa-id-validator"

interface PendingReview {
  id: string
  userId: string
  userName: string
  idNumber: string
  trustScore: number
  biometricMatch: number
  submittedAt: string
  documents: {
    idCopy: string
    faceImage: string
  }
  status: "pending" | "approved" | "rejected"
  profileData: {
    gender: string
    dateOfBirth: string
  }
}

const mockReviews: PendingReview[] = [
  {
    id: "REV-001",
    userId: "USR-2023-0456",
    userName: "Thabo Mbeki",
    idNumber: "8506125489087",
    trustScore: 92,
    biometricMatch: 88,
    submittedAt: "2025-01-15 14:32",
    documents: {
      idCopy: "/south-african-id-document.jpg",
      faceImage: "/person-face-photo.png",
    },
    status: "pending",
    profileData: {
      gender: "Male",
      dateOfBirth: "1985-06-12",
    },
  },
  {
    id: "REV-002",
    userId: "USR-2023-0789",
    userName: "Nomvula Dlamini",
    idNumber: "9203087234056",
    trustScore: 78,
    biometricMatch: 72,
    submittedAt: "2025-01-15 13:18",
    documents: {
      idCopy: "/generic-identification-card.png",
      faceImage: "/woman-face-photo.jpg",
    },
    status: "pending",
    profileData: {
      gender: "Female",
      dateOfBirth: "1992-03-08",
    },
  },
  {
    id: "REV-003",
    userId: "USR-2023-0234",
    userName: "Sipho Khumalo",
    idNumber: "7809144567823",
    trustScore: 95,
    biometricMatch: 91,
    submittedAt: "2025-01-15 11:45",
    documents: {
      idCopy: "/certified-id-copy.jpg",
      faceImage: "/male-face-verification.jpg",
    },
    status: "pending",
    profileData: {
      gender: "Male",
      dateOfBirth: "1978-09-14",
    },
  },
  {
    id: "REV-004",
    userId: "USR-2023-0891",
    userName: "Lerato Mokoena",
    idNumber: "0301235489087",
    trustScore: 65,
    biometricMatch: 58,
    submittedAt: "2025-01-15 10:22",
    documents: {
      idCopy: "/generic-identification-card.png",
      faceImage: "/person-face-photo.png",
    },
    status: "pending",
    profileData: {
      gender: "Female", // Mismatch - ID shows Male
      dateOfBirth: "2003-01-23",
    },
  },
]

export function DocumentReviewPanel() {
  const [reviews, setReviews] = useState<PendingReview[]>(mockReviews)
  const [selectedReview, setSelectedReview] = useState<PendingReview | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const [idValidation, setIdValidation] = useState<SAIDInfo | null>(null)

  const handleSelectReview = (review: PendingReview) => {
    setSelectedReview(review)
    const validation = validateSAIDNumber(review.idNumber)
    setIdValidation(validation)
    console.log("[v0] ID Validation Result:", validation)
  }

  const handleApprove = (reviewId: string) => {
    setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, status: "approved" as const } : r)))
    setSelectedReview(null)
    setReviewNotes("")
    setIdValidation(null)
  }

  const handleReject = (reviewId: string) => {
    setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, status: "rejected" as const } : r)))
    setSelectedReview(null)
    setReviewNotes("")
    setIdValidation(null)
  }

  const pendingCount = reviews.filter((r) => r.status === "pending").length

  const getTrustScoreColor = (score: number) => {
    if (score >= 85) return "text-success"
    if (score >= 70) return "text-warning"
    return "text-destructive"
  }

  const getTrustScoreBadge = (score: number) => {
    if (score >= 85)
      return (
        <Badge variant="outline" className="border-success text-success">
          High
        </Badge>
      )
    if (score >= 70)
      return (
        <Badge variant="outline" className="border-warning text-warning">
          Medium
        </Badge>
      )
    return (
      <Badge variant="outline" className="border-destructive text-destructive">
        Low
      </Badge>
    )
  }

  const mismatchInfo =
    selectedReview && idValidation
      ? compareMismatch(idValidation, selectedReview.profileData.gender, selectedReview.profileData.dateOfBirth)
      : null

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Level 2 Document Review</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Manually verify user-submitted documents and biometric data
            </p>
          </div>
          <Badge variant="outline" className="border-primary text-primary px-3 py-1">
            {pendingCount} Pending
          </Badge>
        </div>

        <div className="space-y-3">
          {reviews
            .filter((r) => r.status === "pending")
            .map((review) => (
              <Card key={review.id} className="p-4 hover:bg-accent/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{review.userName}</p>
                        <span className="text-sm text-muted-foreground">•</span>
                        <code className="text-sm text-muted-foreground font-mono">
                          {review.idNumber.replace(/(\d{6})(\d{4})/, "$1****")}
                        </code>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">Submitted: {review.submittedAt}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Trust:</span>
                          <span className={`font-semibold ${getTrustScoreColor(review.trustScore)}`}>
                            {review.trustScore}%
                          </span>
                          {getTrustScoreBadge(review.trustScore)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Match:</span>
                          <span className={`font-semibold ${getTrustScoreColor(review.biometricMatch)}`}>
                            {review.biometricMatch}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleSelectReview(review)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

          {pendingCount === 0 && (
            <div className="text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <p className="text-foreground font-semibold mb-1">All Reviews Complete</p>
              <p className="text-sm text-muted-foreground">No pending document reviews at this time</p>
            </div>
          )}
        </div>
      </Card>

      {/* Review Dialog */}
      <Dialog
        open={!!selectedReview}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedReview(null)
            setIdValidation(null)
          }
        }}
      >
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Level 2 Verification - {selectedReview?.userName}</DialogTitle>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-6 py-4">
              {idValidation && (
                <Card
                  className={`p-4 ${idValidation.isValid ? "bg-success/5 border-success" : "bg-destructive/5 border-destructive"}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${idValidation.isValid ? "bg-success/10" : "bg-destructive/10"}`}
                    >
                      <Shield className={`h-5 w-5 ${idValidation.isValid ? "text-success" : "text-destructive"}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        ID Number Validation
                        {idValidation.isValid ? (
                          <Badge className="bg-success text-success-foreground">Valid</Badge>
                        ) : (
                          <Badge variant="destructive">Invalid</Badge>
                        )}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Date of Birth</p>
                          <p className="text-sm font-semibold text-foreground">{idValidation.dateOfBirth || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Age</p>
                          <p className="text-sm font-semibold text-foreground">{idValidation.age || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Gender</p>
                          <p className="text-sm font-semibold text-foreground">{idValidation.gender || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Citizenship</p>
                          <p className="text-sm font-semibold text-foreground">{idValidation.citizenship || "N/A"}</p>
                        </div>
                      </div>
                      {idValidation.errors.length > 0 && (
                        <div className="space-y-1">
                          {idValidation.errors.map((error, idx) => (
                            <p key={idx} className="text-sm text-destructive flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              {error}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {mismatchInfo && (mismatchInfo.hasGenderMismatch || mismatchInfo.hasDOBMismatch) && (
                <Card className="p-4 bg-destructive/5 border-destructive">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-destructive mb-2 flex items-center gap-2">
                        Data Mismatch Detected
                        <Badge variant="destructive">Action Required</Badge>
                      </h4>
                      <div className="space-y-2">
                        {mismatchInfo.issues.map((issue, idx) => (
                          <p key={idx} className="text-sm text-foreground">
                            • {issue}
                          </p>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-3">
                        <strong>Recommendation:</strong> Carefully review uploaded documents to verify identity. Contact
                        user for clarification if necessary.
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4 bg-muted/30">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Profile Data
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gender:</span>
                      <span
                        className={`font-semibold ${mismatchInfo?.hasGenderMismatch ? "text-destructive" : "text-foreground"}`}
                      >
                        {selectedReview.profileData.gender}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date of Birth:</span>
                      <span
                        className={`font-semibold ${mismatchInfo?.hasDOBMismatch ? "text-destructive" : "text-foreground"}`}
                      >
                        {selectedReview.profileData.dateOfBirth}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-primary/5 border-primary">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    ID Number Data
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gender:</span>
                      <span
                        className={`font-semibold ${mismatchInfo?.hasGenderMismatch ? "text-destructive" : "text-foreground"}`}
                      >
                        {idValidation?.gender || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date of Birth:</span>
                      <span
                        className={`font-semibold ${mismatchInfo?.hasDOBMismatch ? "text-destructive" : "text-foreground"}`}
                      >
                        {idValidation?.dateOfBirth || "N/A"}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* User Info */}
              <Card className="p-4 bg-muted/30">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">User ID</p>
                    <p className="text-sm font-mono font-semibold text-foreground">{selectedReview.userId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">ID Number</p>
                    <p className="text-sm font-mono font-semibold text-foreground">{selectedReview.idNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Trust Score</p>
                    <p className={`text-sm font-bold ${getTrustScoreColor(selectedReview.trustScore)}`}>
                      {selectedReview.trustScore}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Biometric Match</p>
                    <p className={`text-sm font-bold ${getTrustScoreColor(selectedReview.biometricMatch)}`}>
                      {selectedReview.biometricMatch}%
                    </p>
                  </div>
                </div>
              </Card>

              {/* Documents */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">ID Document Copy</h4>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <Card className="p-4">
                    <img
                      src={selectedReview.documents.idCopy || "/placeholder.svg"}
                      alt="ID Document"
                      className="w-full h-auto rounded-lg border border-border"
                    />
                  </Card>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">Face Verification</h4>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <Card className="p-4">
                    <img
                      src={selectedReview.documents.faceImage || "/placeholder.svg"}
                      alt="Face Verification"
                      className="w-full h-auto rounded-lg border border-border"
                    />
                  </Card>
                </div>
              </div>

              {/* AI Analysis */}
              <Card className="p-4 bg-accent/5">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  AI Analysis Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Document Quality:</span> High resolution, clear text,
                    valid certification stamp detected
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Facial Features:</span>{" "}
                    {selectedReview.biometricMatch}% match with ID photo
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Security Features:</span> Watermark and hologram
                    patterns validated
                  </p>
                  {selectedReview.trustScore < 85 && (
                    <p className="text-warning font-medium">Manual review recommended due to moderate trust score</p>
                  )}
                </div>
              </Card>

              {/* Admin Notes */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Admin Review Notes (Optional)</label>
                <Textarea
                  placeholder="Add any notes about this verification..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                  onClick={() => handleReject(selectedReview.id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Verification
                </Button>
                <Button
                  className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                  onClick={() => handleApprove(selectedReview.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Verification
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

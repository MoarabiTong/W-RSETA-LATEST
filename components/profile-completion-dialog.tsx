"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { User, Phone, Home, Building2, CheckCircle2 } from "lucide-react"

interface ProfileCompletionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (data: any) => void
}

export function ProfileCompletionDialog({ open, onOpenChange, onComplete }: ProfileCompletionDialogProps) {
  const [step, setStep] = useState(1)
  const [profileData, setProfileData] = useState({
    phoneNumber: "",
    alternatePhone: "",
    nationality: "South African",
    homeLanguage: "",
    bio: "",
    streetAddress: "",
    suburb: "",
    city: "",
    postalCode: "",
    homeType: "",
    yearsAtAddress: "",
    employmentStatus: "",
    employer: "",
    occupation: "",
    monthlyIncome: "",
  })

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onComplete(profileData)
      onOpenChange(false)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const updateProfile = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Complete Your Profile - Level 2 Verification
          </DialogTitle>
          <DialogDescription>
            Complete your personal information to enhance your account security and verification status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Step {step} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step 1: Contact Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-primary border-b-2 border-primary pb-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Primary Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+27 XX XXX XXXX"
                    value={profileData.phoneNumber}
                    onChange={(e) => updateProfile("phoneNumber", e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alternatePhone">Alternate Phone Number</Label>
                  <Input
                    id="alternatePhone"
                    type="tel"
                    placeholder="+27 XX XXX XXXX"
                    value={profileData.alternatePhone}
                    onChange={(e) => updateProfile("alternatePhone", e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Input
                    id="nationality"
                    type="text"
                    value={profileData.nationality}
                    onChange={(e) => updateProfile("nationality", e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="homeLanguage">Home Language *</Label>
                  <Select
                    value={profileData.homeLanguage}
                    onValueChange={(value) => updateProfile("homeLanguage", value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Afrikaans">Afrikaans</SelectItem>
                      <SelectItem value="isiZulu">isiZulu</SelectItem>
                      <SelectItem value="isiXhosa">isiXhosa</SelectItem>
                      <SelectItem value="Sesotho">Sesotho</SelectItem>
                      <SelectItem value="Setswana">Setswana</SelectItem>
                      <SelectItem value="Sepedi">Sepedi</SelectItem>
                      <SelectItem value="isiNdebele">isiNdebele</SelectItem>
                      <SelectItem value="siSwati">siSwati</SelectItem>
                      <SelectItem value="Tshivenda">Tshivenda</SelectItem>
                      <SelectItem value="Xitsonga">Xitsonga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Tell us about yourself</Label>
                <Textarea
                  id="bio"
                  placeholder="Brief bio or background information..."
                  value={profileData.bio}
                  onChange={(e) => updateProfile("bio", e.target.value)}
                  className="min-h-24"
                />
              </div>
            </div>
          )}

          {/* Step 2: Residential Address */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-primary border-b-2 border-primary pb-2">
                <Home className="h-5 w-5" />
                Residential Address
              </div>

              <div className="space-y-2">
                <Label htmlFor="streetAddress">Street Address *</Label>
                <Input
                  id="streetAddress"
                  type="text"
                  placeholder="123 Main Street"
                  value={profileData.streetAddress}
                  onChange={(e) => updateProfile("streetAddress", e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="suburb">Suburb/Township *</Label>
                  <Input
                    id="suburb"
                    type="text"
                    value={profileData.suburb}
                    onChange={(e) => updateProfile("suburb", e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    type="text"
                    value={profileData.city}
                    onChange={(e) => updateProfile("city", e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder="0000"
                    maxLength={4}
                    value={profileData.postalCode}
                    onChange={(e) => updateProfile("postalCode", e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="homeType">Home Type *</Label>
                  <Select value={profileData.homeType} onValueChange={(value) => updateProfile("homeType", value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owned">Owned</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="family">Family Home</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsAtAddress">Years at Current Address *</Label>
                <Select
                  value={profileData.yearsAtAddress}
                  onValueChange={(value) => updateProfile("yearsAtAddress", value)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="more-than-10">More than 10 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Employment Information */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-primary border-b-2 border-primary pb-2">
                <Building2 className="h-5 w-5" />
                Employment Information
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentStatus">Employment Status *</Label>
                <Select
                  value={profileData.employmentStatus}
                  onValueChange={(value) => updateProfile("employmentStatus", value)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(profileData.employmentStatus === "employed" || profileData.employmentStatus === "self-employed") && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="employer">Employer/Company Name *</Label>
                    <Input
                      id="employer"
                      type="text"
                      value={profileData.employer}
                      onChange={(e) => updateProfile("employer", e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation/Position *</Label>
                    <Input
                      id="occupation"
                      type="text"
                      value={profileData.occupation}
                      onChange={(e) => updateProfile("occupation", e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncome">Monthly Income Range *</Label>
                    <Select
                      value={profileData.monthlyIncome}
                      onValueChange={(value) => updateProfile("monthlyIncome", value)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-5000">R0 - R5,000</SelectItem>
                        <SelectItem value="5000-10000">R5,000 - R10,000</SelectItem>
                        <SelectItem value="10000-20000">R10,000 - R20,000</SelectItem>
                        <SelectItem value="20000-40000">R20,000 - R40,000</SelectItem>
                        <SelectItem value="40000+">R40,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Almost Done!</h4>
                    <p className="text-sm text-muted-foreground">
                      After completing this profile, you'll proceed to document verification (Level 2) for enhanced
                      security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                Back
              </Button>
            )}
            <Button type="button" onClick={handleNext} className="flex-1">
              {step === totalSteps ? "Complete Profile" : "Continue"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

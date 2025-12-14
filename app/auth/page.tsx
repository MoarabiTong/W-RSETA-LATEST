"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CalendarIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Image from "next/image"

// Mock users database
const MOCK_USERS = [
  { username: "admin", password: "admin123", role: "admin", name: "Admin User" },
  { username: "john_doe", password: "user123", role: "user", name: "John Doe", idNumber: "9001015009087" },
]

const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
]

const SECURITY_QUESTIONS = [
  "What was your childhood nickname?",
  "In what city did you meet your spouse/significant other?",
  "What is the name of your favorite childhood friend?",
  "What street did you live on in third grade?",
  "What is your oldest sibling's middle name?",
  "What is the name of your first pet?",
  "What was your first car?",
  "What school did you attend for sixth grade?",
  "What is your mother's maiden name?",
  "What is your favorite movie?",
]

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [passwordStrength, setPasswordStrength] = useState("")

  const [signInUsername, setSignInUsername] = useState("")
  const [signInPassword, setSignInPassword] = useState("")

  const [signUpData, setSignUpData] = useState({
    idType: "id_number",
    idNumber: "",
    title: "",
    firstName: "",
    lastName: "",
    dateOfBirth: undefined as Date | undefined,
    gender: "",
    email: "",
    confirmEmail: "",
    province: "",
    username: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
  })

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    }
  }, [router])

  const checkPasswordStrength = (password: string) => {
    if (!password) return ""
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 2) return "weak"
    if (score <= 4) return "medium"
    return "strong"
  }

  const validateSAID = (idNumber: string) => {
    if (!/^\d{13}$/.test(idNumber)) {
      return "SA ID Number must be exactly 13 digits"
    }
    return ""
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    const user = MOCK_USERS.find((u) => u.username === signInUsername && u.password === signInPassword)

    if (user) {
      localStorage.setItem("user", JSON.stringify(user))

      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } else {
      setError("Invalid username or password")
    }

    setIsLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!signUpData.idNumber.trim()) {
      setError("ID Number is required")
      return
    }
    if (signUpData.idType === "id_number") {
      const idError = validateSAID(signUpData.idNumber)
      if (idError) {
        setError(idError)
        return
      }
    }
    if (!signUpData.title) {
      setError("Title is required")
      return
    }
    if (!signUpData.firstName.trim()) {
      setError("First Name is required")
      return
    }
    if (!signUpData.lastName.trim()) {
      setError("Last Name is required")
      return
    }
    if (!signUpData.dateOfBirth) {
      setError("Date of Birth is required")
      return
    }
    if (!signUpData.gender) {
      setError("Gender is required")
      return
    }
    if (!signUpData.email.trim()) {
      setError("Email is required")
      return
    }
    if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
      setError("Email is invalid")
      return
    }
    if (signUpData.email !== signUpData.confirmEmail) {
      setError("Emails do not match")
      return
    }
    if (!signUpData.province) {
      setError("Province is required")
      return
    }
    if (!signUpData.username.trim()) {
      setError("Username is required")
      return
    }
    if (!signUpData.password) {
      setError("Password is required")
      return
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (!signUpData.securityQuestion) {
      setError("Security question is required")
      return
    }
    if (!signUpData.securityAnswer.trim()) {
      setError("Security answer is required")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser = {
      username: signUpData.username,
      password: signUpData.password,
      role: "user",
      name: `${signUpData.firstName} ${signUpData.lastName}`,
      idNumber: signUpData.idNumber,
      email: signUpData.email,
      dateOfBirth: signUpData.dateOfBirth.toISOString(),
      gender: signUpData.gender,
      profileCompleted: false, // New users need to complete Level 2 profile
    }

    MOCK_USERS.push(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    router.push("/dashboard")

    setIsLoading(false)
  }

  const handleSignUpChange = (field: string, value: string | Date | undefined) => {
    setSignUpData((prev) => ({ ...prev, [field]: value }))
    if (field === "password" && typeof value === "string") {
      setPasswordStrength(checkPasswordStrength(value))
    }
  }

  const fillSampleData = () => {
    setSignUpData({
      idType: "id_number",
      idNumber: "9501015000087",
      title: "Mr",
      firstName: "Test",
      lastName: "User",
      dateOfBirth: new Date(1995, 0, 1),
      gender: "male",
      email: "test@example.com",
      confirmEmail: "test@example.com",
      province: "Gauteng",
      username: `TestUser_${Math.floor(Math.random() * 1000)}`,
      password: "Password123",
      confirmPassword: "Password123",
      securityQuestion: SECURITY_QUESTIONS[0],
      securityAnswer: "Rover",
    })
    setPasswordStrength("strong")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Logo/Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-24 w-auto items-center justify-center mb-4">
            <Image
              src="/images/wrseta-logo.png"
              alt="W&RSETA Logo"
              width={300}
              height={96}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground text-balance text-center">Identity Trust Engine</h1>
          <p className="text-muted-foreground text-center mt-2 text-lg">W&RSETA ID Verification System</p>
        </div>

        <Card className="shadow-xl border-2">
          <CardHeader className="bg-gradient-to-r from-secondary to-background">
            <CardTitle className="text-2xl text-foreground">Welcome</CardTitle>
            <CardDescription className="text-base">Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-username">Username</Label>
                    <Input
                      id="signin-username"
                      type="text"
                      placeholder="Enter your username"
                      value={signInUsername}
                      onChange={(e) => setSignInUsername(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password">Password</Label>
                      <button
                        type="button"
                        className="text-sm text-primary hover:underline"
                        onClick={() => alert("Password reset functionality will be implemented")}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-2 font-semibold">Demo Credentials:</p>
                    <p className="text-sm text-foreground">
                      Admin: <span className="font-mono font-semibold">admin</span> / admin123
                    </p>
                    <p className="text-sm text-foreground">
                      User: <span className="font-mono font-semibold">john_doe</span> / user123
                    </p>
                  </div>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup">
                <div className="text-center mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={fillSampleData}
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    Fill Sample Data
                  </Button>
                </div>

                <form onSubmit={handleSignUp} className="space-y-6">
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b-2 border-primary pb-2">
                      Personal Information
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="idType">ID Type *</Label>
                      <Select value={signUpData.idType} onValueChange={(value) => handleSignUpChange("idType", value)}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="id_number">SA ID Number</SelectItem>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="drivers_license">Driver's License</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Number *</Label>
                      <Input
                        id="idNumber"
                        type="text"
                        placeholder="Enter Number"
                        value={signUpData.idNumber}
                        onChange={(e) => handleSignUpChange("idNumber", e.target.value)}
                        className="h-11"
                        maxLength={13}
                      />
                      <p className="text-xs text-muted-foreground">13-digit SA ID number</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Select value={signUpData.title} onValueChange={(value) => handleSignUpChange("title", value)}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mr">Mr</SelectItem>
                            <SelectItem value="Mrs">Mrs</SelectItem>
                            <SelectItem value="Ms">Ms</SelectItem>
                            <SelectItem value="Dr">Dr</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={signUpData.firstName}
                          onChange={(e) => handleSignUpChange("firstName", e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={signUpData.lastName}
                        onChange={(e) => handleSignUpChange("lastName", e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Date of Birth *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-11 justify-start text-left font-normal",
                              !signUpData.dateOfBirth && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {signUpData.dateOfBirth ? format(signUpData.dateOfBirth, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={signUpData.dateOfBirth}
                            onSelect={(date) => handleSignUpChange("dateOfBirth", date)}
                            captionLayout="dropdown"
                            fromYear={1940}
                            toYear={new Date().getFullYear()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Gender *</Label>
                      <RadioGroup
                        value={signUpData.gender}
                        onValueChange={(value) => handleSignUpChange("gender", value)}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male" className="font-normal cursor-pointer">
                            Male
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female" className="font-normal cursor-pointer">
                            Female
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other" className="font-normal cursor-pointer">
                            Other
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={signUpData.email}
                          onChange={(e) => handleSignUpChange("email", e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmEmail">Confirm Email *</Label>
                        <Input
                          id="confirmEmail"
                          type="email"
                          value={signUpData.confirmEmail}
                          onChange={(e) => handleSignUpChange("confirmEmail", e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="province">Province *</Label>
                      <Select
                        value={signUpData.province}
                        onValueChange={(value) => handleSignUpChange("province", value)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select Province" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVINCES.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Login Credentials Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b-2 border-primary pb-2">
                      Login Credentials
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username *</Label>
                      <Input
                        id="username"
                        type="text"
                        value={signUpData.username}
                        onChange={(e) => handleSignUpChange("username", e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={signUpData.password}
                          onChange={(e) => handleSignUpChange("password", e.target.value)}
                          className="h-11"
                        />
                        {passwordStrength && (
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2 flex-1 rounded-full ${
                                passwordStrength === "weak"
                                  ? "bg-destructive"
                                  : passwordStrength === "medium"
                                    ? "bg-warning"
                                    : "bg-success"
                              }`}
                            />
                            <span className="text-xs font-medium capitalize">{passwordStrength}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={signUpData.confirmPassword}
                          onChange={(e) => handleSignUpChange("confirmPassword", e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Question Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b-2 border-primary pb-2">
                      Security Question
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="securityQuestion">Select Question *</Label>
                      <Select
                        value={signUpData.securityQuestion}
                        onValueChange={(value) => handleSignUpChange("securityQuestion", value)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select a question" />
                        </SelectTrigger>
                        <SelectContent>
                          {SECURITY_QUESTIONS.map((question) => (
                            <SelectItem key={question} value={question}>
                              {question}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="securityAnswer">Your Answer *</Label>
                      <Input
                        id="securityAnswer"
                        type="text"
                        value={signUpData.securityAnswer}
                        onChange={(e) => handleSignUpChange("securityAnswer", e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

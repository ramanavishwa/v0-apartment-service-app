"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff, Check, X, ArrowLeft } from "lucide-react"

const validatePassword = (password: string) => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  }
  return requirements
}

const isPasswordValid = (password: string) => {
  const req = validatePassword(password)
  return req.length && req.uppercase && req.lowercase && req.number && req.symbol
}

type Step = "email" | "security" | "reset"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [securityAnswer, setSecurityAnswer] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [foundUser, setFoundUser] = useState<any>(null)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((u: any) => u.email === email)

      if (!user) {
        setError("Email not found")
        return
      }

      setFoundUser(user)
      setStep("security")
    } catch (err) {
      setError("Error finding user")
    } finally {
      setLoading(false)
    }
  }

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Simple security verification - checking if answer matches first 3 letters of email
      if (securityAnswer.toLowerCase() === email.substring(0, 3)) {
        setStep("reset")
      } else {
        setError("Security answer incorrect")
      }
    } catch (err) {
      setError("Verification failed")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (!isPasswordValid(newPassword)) {
        setError("Password must meet all requirements")
        return
      }

      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userIndex = users.findIndex((u: any) => u.email === email)

      if (userIndex !== -1) {
        users[userIndex].password = newPassword
        localStorage.setItem("users", JSON.stringify(users))
        router.push("/login?reset=success")
      }
    } catch (err) {
      setError("Password reset failed")
    } finally {
      setLoading(false)
    }
  }

  const passwordReqs = validatePassword(newPassword)

  return (
    <Card className="w-full max-w-md p-8 shadow-xl">
      {/* Step 1: Email Verification */}
      {step === "email" && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your email to get started</p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
              {loading ? "Searching..." : "Continue"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-semibold"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </>
      )}

      {/* Step 2: Security Question */}
      {step === "security" && foundUser && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Identity</h1>
            <p className="text-gray-600">Answer the security question</p>
          </div>

          <form onSubmit={handleSecuritySubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Security Question</label>
              <p className="text-sm text-gray-600 mb-3">Enter the first 3 letters of your email</p>
              <Input
                type="text"
                placeholder="e.g., 'joh' for john@email.com"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setStep("email")
                setError("")
                setSecurityAnswer("")
              }}
              className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-semibold"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>
        </>
      )}

      {/* Step 3: Password Reset */}
      {step === "reset" && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Password</h1>
            <p className="text-gray-600">Enter your new password</p>
          </div>

          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative mb-3">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="space-y-2 bg-gray-50 p-3 rounded-md text-sm">
                <div className="flex items-center gap-2">
                  {passwordReqs.length ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <X size={16} className="text-gray-400" />
                  )}
                  <span className={passwordReqs.length ? "text-green-600" : "text-gray-600"}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordReqs.uppercase ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <X size={16} className="text-gray-400" />
                  )}
                  <span className={passwordReqs.uppercase ? "text-green-600" : "text-gray-600"}>
                    One uppercase letter (A-Z)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordReqs.lowercase ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <X size={16} className="text-gray-400" />
                  )}
                  <span className={passwordReqs.lowercase ? "text-green-600" : "text-gray-600"}>
                    One lowercase letter (a-z)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordReqs.number ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <X size={16} className="text-gray-400" />
                  )}
                  <span className={passwordReqs.number ? "text-green-600" : "text-gray-600"}>One number (0-9)</span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordReqs.symbol ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <X size={16} className="text-gray-400" />
                  )}
                  <span className={passwordReqs.symbol ? "text-green-600" : "text-gray-600"}>
                    One symbol (!@#$%^&*...)
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              disabled={loading || !isPasswordValid(newPassword)}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setStep("email")
                setError("")
                setSecurityAnswer("")
              }}
              className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-semibold"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>
        </>
      )}
    </Card>
  )
}

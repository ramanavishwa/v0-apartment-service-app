"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff, Check, X } from "lucide-react"

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

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (!isPasswordValid(password)) {
        setError("Password must meet all requirements")
        return
      }

      const users = JSON.parse(localStorage.getItem("users") || "[]")

      if (users.some((u: any) => u.email === email)) {
        setError("Email already exists")
        return
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        credits: 0,
        profilePhoto: null,
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", JSON.stringify(newUser))

      router.push("/dashboard")
    } catch (err) {
      setError("Signup failed")
    } finally {
      setLoading(false)
    }
  }

  const passwordReqs = validatePassword(password)

  return (
    <Card className="w-full max-w-md p-8 shadow-xl">
      <div className="flex justify-center mb-6">
        <Image src="/fix-nexus-logo.png" alt="Fix Nexus" width={120} height={80} />
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <Input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full"
          />
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative mb-3">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              <span className={passwordReqs.length ? "text-green-600" : "text-gray-600"}>At least 8 characters</span>
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
              <span className={passwordReqs.symbol ? "text-green-600" : "text-gray-600"}>One symbol (!@#$%^&*...)</span>
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
          disabled={loading || !isPasswordValid(password)}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, UserPlus, Eye, EyeOff } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { signup, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      return
    }

    if (password !== confirmPassword) {
      // Handle password mismatch
      return
    }

    const success = await signup(username.trim(), password)
    if (success) {
      router.push("/dashboard")
    }
  }

  const passwordsMatch = password === confirmPassword || confirmPassword === ""

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/4 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <MessageCircle className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-1000 delay-200">
              Wispah
            </h1>
            <p className="text-muted-foreground text-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-1000 delay-300">
              Create your secret identity
            </p>
          </div>

          {/* Signup Card */}
          <Card className="backdrop-blur-sm bg-card/50 border shadow-xl hover:shadow-2xl transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-2 duration-1000 delay-400">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">Join the Chamber</h2>
                  <p className="text-muted-foreground">Begin your anonymous journey</p>
                </div>

                <div className="space-y-4">
                  <div className="group">
                    <Input
                      type="text"
                      placeholder="Choose your secret identity"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-12 rounded-xl transition-all duration-300 focus:scale-[1.02] group-hover:shadow-md"
                      required
                    />
                  </div>
                  <div className="group relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a whisper key"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl transition-all duration-300 focus:scale-[1.02] group-hover:shadow-md pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="group relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your whisper key"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`h-12 rounded-xl transition-all duration-300 focus:scale-[1.02] group-hover:shadow-md pr-12 ${
                        !passwordsMatch ? "border-red-500 focus:border-red-500" : ""
                      }`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {!passwordsMatch && confirmPassword && <p className="text-red-500 text-sm">Passwords don't match</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !username.trim() || !password.trim() || !passwordsMatch}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Chamber
                    </>
                  )}
                </Button>

                <div className="text-center pt-4">
                  <p className="text-muted-foreground">
                    Already have a chamber?{" "}
                    <Link
                      href="/"
                      className="text-primary hover:text-primary/80 font-medium underline underline-offset-2 transition-colors duration-200"
                    >
                      Enter here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, Key } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface ForgotPasswordProps {
  onBack: () => void
}

export function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [step, setStep] = useState<"username" | "reset">("username")
  const [username, setUsername] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsLoading(true)
    try {
      const response = await apiService.forgotPassword(username.trim())
      if (response.stat) {
        toast({
          title: "Reset code sent! 📧",
          description: "Please check your email for the password reset code.",
        })
        setStep("reset")
      } else {
        toast({
          title: "Unable to send reset code",
          description: response.message || "Please check your username.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Unable to send reset code",
        description: "Please check your username and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || !newPassword.trim()) return

    setIsLoading(true)
    try {
      const response = await apiService.resetPassword(code.trim(), newPassword, username)
      if (response.stat) {
        toast({
          title: "Password reset! ✨",
          description: "Your password has been successfully reset.",
        })
        onBack()
      } else {
        toast({
          title: "Reset failed",
          description: response.message || "Invalid code or error occurred.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to reset password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="backdrop-blur-sm bg-card/50 border shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CardTitle className="text-foreground">
            {step === "username" ? "Forgot Password" : "Reset Password"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {step === "username" ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Reset Code
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Reset code from email"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !code.trim() || !newPassword.trim()}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                  Resetting...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Reset Password
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

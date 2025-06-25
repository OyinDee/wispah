"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, X } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

interface SettingsProps {
  onClose: () => void
}

export function Settings({ onClose }: SettingsProps) {
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleSetRecoveryEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recoveryEmail.trim() || !user?.username || !user?.token) return

    setIsLoading(true)
    try {
      const response = await apiService.setRecoveryEmail(user.username, recoveryEmail.trim(), user.token)
      if (response.stat) {
        toast({
          title: "Recovery email set! ✨",
          description: "Your recovery email has been successfully updated.",
        })
        setRecoveryEmail("")
      } else {
        toast({
          title: "Failed to set recovery email",
          description: response.message || "Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to set recovery email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="backdrop-blur-sm bg-card/50 border shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Settings</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recovery Email Section */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Recovery Email</h3>
          <form onSubmit={handleSetRecoveryEmail} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter recovery email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="h-12 rounded-xl"
                required
              />
              <p className="text-muted-foreground text-sm mt-2">This email will be used for password recovery</p>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !recoveryEmail.trim()}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Set Recovery Email
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Account Info */}
        <div className="pt-4 border-t border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-2">Account Information</h3>
          <p className="text-muted-foreground text-sm">
            Username: <span className="text-foreground font-medium">@{user?.username}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

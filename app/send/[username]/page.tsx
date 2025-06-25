"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Send, Sparkles, Heart, Shield, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { apiService } from "@/lib/api"

export default function SendMessagePage() {
  const params = useParams()
  const username = params.username as string
  const [message, setMessage] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsSubmitting(true)

    try {
      const response = await apiService.sendMessage(username, message.trim(), image || undefined)

      if (response.stat) {
        router.push("/sent")
        toast({
          title: "Whisper sent! ✨",
          description: "Your anonymous message has been delivered to their secret chamber.",
        })
      } else {
        toast({
          title: "Failed to send",
          description: response.message || "Unable to send message. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Unable to send message. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/4 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110">
            <MessageCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Send a Secret Whisper</h1>
          <p className="text-muted-foreground text-lg">
            to <span className="text-primary font-semibold">@{username}</span>
          </p>
        </div>

        {/* Message Form */}
        <Card className="bg-card border shadow-xl hover:shadow-2xl transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-2 duration-1000 delay-200">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-foreground font-medium mb-3 flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-red-500" />
                  Your Anonymous Message
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts, feelings, or secrets... ✨"
                  className="min-h-[140px] resize-none rounded-xl transition-all duration-300 focus:scale-[1.02] hover:shadow-md"
                  maxLength={500}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-foreground font-medium mb-3 flex items-center">
                  <ImageIcon className="w-4 h-4 mr-2 text-blue-500" />
                  Add Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:transition-all file:duration-300"
                />
                {image && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                    <p className="text-sm text-muted-foreground mb-2">Image Preview:</p>
                    <img
                      src={image || "/placeholder.svg"}
                      alt="Preview"
                      className="max-w-full h-auto max-h-48 object-cover rounded-lg shadow-md mx-auto block"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setImage(null)}
                      className="mt-3 text-red-500 hover:text-red-600 mx-auto block"
                    >
                      Remove Image
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">{message.length}/500 characters</span>
                <Button
                  type="submit"
                  disabled={!message.trim() || isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-6"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Whisper
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="bg-card border shadow-lg hover:shadow-xl transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-2 duration-1000 delay-400">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg flex-shrink-0 shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold mb-2">100% Anonymous & Secure</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your identity is completely protected. No tracking, no logging, no way to trace back to you. Your
                  secret is safe with us! 🔒
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card className="bg-card border shadow-lg hover:shadow-xl transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-2 duration-1000 delay-500">
          <CardContent className="p-6">
            <h3 className="text-foreground font-semibold mb-4 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              Whisper Guidelines
            </h3>
            <div className="grid grid-cols-2 gap-3 text-muted-foreground text-sm">
              <div className="space-y-1">
                <p className="transition-colors duration-200 hover:text-foreground">• Be kind and respectful</p>
                <p className="transition-colors duration-200 hover:text-foreground">• Spread positivity ✨</p>
              </div>
              <div className="space-y-1">
                <p className="transition-colors duration-200 hover:text-foreground">• No harassment or hate</p>
                <p className="transition-colors duration-200 hover:text-foreground">• Keep it appropriate 💝</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Copy, Share2, QrCode, MessageCircle, Sparkles, Instagram, Twitter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"
import { QRCodeComponent } from "@/components/qr-code"

export default function ProfilePage() {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const [showQRCode, setShowQRCode] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const profileUrl = `${window.location.origin}/send/${user.username}`

  const copyToClipboard = async () => {
    try {
      const shareText = `🕫 Psst... Want to tell me something without getting caught? Here's your chance to spill the tea anonymously! 🫶\n${profileUrl}`
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      toast({
        title: "Link copied! ✨",
        description: "Your whisper link is ready to share with the world.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Oops! 😅",
        description: "Please copy the link manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/2 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-sm bg-card/30 border-b border-border/50">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all duration-200 hover:scale-105"
                asChild
              >
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Chamber
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg shadow-lg">
                  <MessageCircle className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-foreground">Share Your Magic</h1>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Main Share Card */}
          <Card className="bg-card border shadow-xl hover:shadow-2xl transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Your Whisper Portal</h2>
                <p className="text-muted-foreground text-lg">
                  Share this magical link to receive anonymous messages from anyone
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex space-x-3">
                  <Input
                    value={`🕫 Psst... Want to tell me something without getting caught? Here's your chance to spill the tea anonymously! 🫶\n${profileUrl}`}
                    readOnly
                    className="h-16 rounded-xl transition-all duration-300 focus:scale-[1.02] text-sm"
                  />
                  <Button
                    onClick={copyToClipboard}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-12 border-border text-foreground hover:bg-accent rounded-xl transition-all duration-300 hover:scale-105"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "Send me an anonymous message! ✨",
                          text: "Share your thoughts with me anonymously on Wispah!",
                          url: profileUrl,
                        })
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Link
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowQRCode(true)}
                    className="h-12 border-border text-foreground hover:bg-accent rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate QR
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Social Media Templates */}
            <Card className="bg-card border shadow-lg hover:shadow-xl transition-all duration-500 animate-in fade-in-0 slide-in-from-left-4 duration-1000 delay-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                  <Instagram className="w-5 h-5 mr-2 text-pink-500" />
                  Social Templates
                </h3>
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex items-center space-x-2 mb-2">
                      <Instagram className="w-4 h-4 text-pink-500" />
                      <span className="text-muted-foreground font-medium text-sm">Instagram Story</span>
                    </div>
                    <div className="bg-accent/50 p-4 rounded-xl border border-border/50 transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.02]">
                      <p className="text-foreground text-sm">
                        "🕫 Psst... Want to tell me something without getting caught? Here's your chance to spill the tea
                        anonymously! 🫶"
                      </p>
                      <p className="text-muted-foreground text-xs mt-2">{profileUrl}</p>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex items-center space-x-2 mb-2">
                      <Twitter className="w-4 h-4 text-blue-500" />
                      <span className="text-muted-foreground font-medium text-sm">Twitter Bio</span>
                    </div>
                    <div className="bg-accent/50 p-4 rounded-xl border border-border/50 transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.02]">
                      <p className="text-foreground text-sm">"🕫 Spill the tea anonymously! 🫶 {profileUrl}"</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="bg-card border shadow-lg hover:shadow-xl transition-all duration-500 animate-in fade-in-0 slide-in-from-right-4 duration-1000 delay-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" />
                  How The Magic Works
                </h3>
                <div className="space-y-4">
                  {[
                    { step: "1", text: "Share your unique whisper link anywhere", icon: "🔗" },
                    { step: "2", text: "People send you completely anonymous messages", icon: "💬" },
                    { step: "3", text: "Messages appear in your secret chamber", icon: "✨" },
                    { step: "4", text: "Their identity stays forever hidden", icon: "🤫" },
                  ].map((item, index) => (
                    <div
                      key={item.step}
                      className="flex items-start space-x-4 group animate-in fade-in-0 slide-in-from-left-2 duration-700"
                      style={{ animationDelay: `${index * 100 + 400}ms` }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold text-sm transition-all duration-300 group-hover:scale-110">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground transition-all duration-200 group-hover:text-primary">
                          {item.text}
                        </p>
                      </div>
                      <span className="text-xl transition-all duration-300 group-hover:scale-125">{item.icon}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Privacy & Safety */}
          <Card className="bg-card border shadow-lg hover:shadow-xl transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-500">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-lg shadow-lg">
                  <span className="text-white text-lg">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">Privacy & Safety First</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <p className="transition-colors duration-200 hover:text-foreground">• 100% anonymous messaging</p>
                  <p className="transition-colors duration-200 hover:text-foreground">• No IP tracking or logging</p>
                  <p className="transition-colors duration-200 hover:text-foreground">• Messages are encrypted</p>
                </div>
                <div className="space-y-2">
                  <p className="transition-colors duration-200 hover:text-foreground">• Report inappropriate content</p>
                  <p className="transition-colors duration-200 hover:text-foreground">• Block unwanted messages</p>
                  <p className="transition-colors duration-200 hover:text-foreground">• Your safety is our priority</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {showQRCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <QRCodeComponent url={profileUrl} username={user.username} onClose={() => setShowQRCode(false)} />
        </div>
      )}
    </div>
  )
}

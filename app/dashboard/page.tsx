"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Share2, Settings, LogOut, TrendingUp, RefreshCw } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"
import { apiService, type Message } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Item } from "@/components/item"
import { usePolling } from "@/hooks/use-polling"
import { PollingIndicator } from "@/components/polling-indicator"
import { Settings as SettingsComponent } from "@/components/settings"

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [isPollingEnabled, setIsPollingEnabled] = useState(true)

  // Setup polling for live updates
  usePolling({
    callback: () => {
      if (user?.token && !isRefreshing) {
        fetchMessages(false, true)
      }
    },
    interval: 5000, // Poll every 5 seconds
    enabled: isPollingEnabled && !!user?.token,
  })

  // Pause polling when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPollingEnabled(!document.hidden)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
      return
    }

    if (user && !authLoading) {
      const loadInitialMessages = async () => {
        setIsLoading(true)
        await fetchMessages()
      }

      loadInitialMessages()
    }
  }, [user, authLoading, router])

  const fetchMessages = async (showRefreshToast = false, isPolling = false) => {
    if (!user?.token) return

    try {
      if (!isPolling) setIsRefreshing(true)

      console.log("Fetching messages for user:", user.username) // Debug log
      const response = await apiService.getUserMessages(user.token)
      console.log("API Response:", response) // Debug log

      if (response.stat && Array.isArray(response.message)) {
        const newMessages = response.message.map((msg: any) => ({
          ...msg,
          id: msg._id, // Map _id to id for compatibility
        }))
        const hasNewMessages = newMessages.length > messages.length

        setMessages(newMessages)

        if (hasNewMessages && isPolling && messages.length > 0) {
          toast({
            title: "New whisper arrived! ✨",
            description: "You have received a new anonymous message.",
          })
        }

        if (showRefreshToast) {
          toast({
            title: "Messages refreshed! ✨",
            description: "Your whispers have been updated.",
          })
        }
      } else {
        console.log("No messages or invalid response:", response) // Debug log
        setMessages([])
      }
    } catch (error) {
      console.error("Error fetching messages:", error) // Debug log
      if (!isPolling) {
        toast({
          title: "Connection error",
          description: "Unable to fetch messages. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false) // Always set loading to false
      if (!isPolling) setIsRefreshing(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const unreadCount = messages.filter((msg) => !msg.isRead).length

  useEffect(() => {
    // Fallback: if still loading after 10 seconds, stop loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log("Loading timeout - forcing stop")
        setIsLoading(false)
        toast({
          title: "Loading timeout",
          description: "Unable to load messages. Please refresh the page.",
          variant: "destructive",
        })
      }
    }, 10000)

    return () => clearTimeout(timeout)
  }, [isLoading])

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (showSettings) {
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
          <div className="w-full max-w-md">
            <SettingsComponent onClose={() => setShowSettings(false)} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/2 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-sm bg-card/30 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 animate-in fade-in-0 slide-in-from-left-4 duration-700">
                <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <MessageCircle className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Wispah</h1>
                  <p className="text-muted-foreground text-sm">@{user.username}'s chamber</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 animate-in fade-in-0 slide-in-from-right-4 duration-700">
                <Button
                  variant="ghost"
                  onClick={() => fetchMessages(true)}
                  disabled={isRefreshing}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all duration-200 hover:scale-105"
                  asChild
                >
                  <Link href="/profile">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Link
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowSettings(true)}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <ThemeToggle />
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Exit
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-100">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-foreground mb-1">{messages.length}</div>
                <div className="text-muted-foreground text-sm">Total Whispers</div>
              </CardContent>
            </Card>
            <Card className="bg-card border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-500 mb-1">{unreadCount}</div>
                <div className="text-muted-foreground text-sm">New Messages</div>
              </CardContent>
            </Card>
            <Card className="bg-card border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-500 mb-1">∞</div>
                <div className="text-muted-foreground text-sm">Anonymous</div>
              </CardContent>
            </Card>
            <Card className="bg-card border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-400">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-500 mb-1 flex items-center justify-center">
                  100%
                  <TrendingUp className="w-4 h-4 ml-1" />
                </div>
                <div className="text-muted-foreground text-sm">Secure</div>
              </CardContent>
            </Card>
          </div>

          {/* Messages Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Messages List */}
            <div className="lg:col-span-2">
              <Card className="bg-card border shadow-lg animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <h2 className="text-2xl font-bold text-foreground flex items-center">
                        <MessageCircle className="w-6 h-6 mr-3 text-primary" />
                        Your Whispers
                      </h2>
                      <PollingIndicator isEnabled={isPollingEnabled} interval={5000} />
                    </div>
                    {unreadCount > 0 && (
                      <Badge className="bg-primary text-primary-foreground animate-pulse">{unreadCount} new</Badge>
                    )}
                  </div>

                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading your whispers...</p>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">✨</div>
                        <p className="text-muted-foreground mb-6">Your chamber awaits its first whisper...</p>
                        <Button
                          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-300 hover:scale-105"
                          asChild
                        >
                          <Link href="/profile">Share Your Link</Link>
                        </Button>
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <Item key={message._id || message.id || index} message={message} index={index} />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-card border shadow-lg animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-600">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                      asChild
                    >
                      <Link href="/profile">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Your Link
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => fetchMessages(true)}
                      disabled={isRefreshing}
                      className="w-full border-border text-foreground hover:bg-accent rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                      Refresh Messages
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="bg-card border shadow-lg animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">💡 Pro Tips</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p className="transition-colors duration-200 hover:text-foreground">
                      • Share your link on social media to get more whispers
                    </p>
                    <p className="transition-colors duration-200 hover:text-foreground">
                      • Download messages to save your favorite whispers
                    </p>
                    <p className="transition-colors duration-200 hover:text-foreground">
                      • Your identity is always protected
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

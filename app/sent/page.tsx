"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Sparkles, UserPlus, Home } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SentPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/8 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <Card className="relative z-10 w-full max-w-lg bg-card border shadow-2xl animate-in fade-in-0 zoom-in-95 duration-1000">
        <CardContent className="p-8 text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="text-8xl mb-6 animate-bounce">🎉</div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl mb-4 shadow-xl">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">Whisper Delivered!</h1>

          <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
            Your anonymous message has been sent successfully! ✨
            <br />
            <span className="text-sm mt-2 block">
              The recipient will never know it was you. Your secret is safe! 🤫
            </span>
          </p>

          {/* Encouragement Section */}
          <div className="bg-primary/5 rounded-xl p-6 mb-8 border border-primary/10">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4 mx-auto">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Want your own secret mailbox?</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Create your own Wispah account and start receiving anonymous messages from your friends!
            </p>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="/signup">
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up Now
              </Link>
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-accent rounded-xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground rounded-xl transition-all duration-300 hover:scale-105"
              onClick={() => window.history.back()}
            >
              Send Another Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

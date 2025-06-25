"use client"

import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ErrorProps {
  message?: string
  onRetry?: () => void
  showHomeButton?: boolean
}

export function Error({
  message = "Something went wrong. Please try again.",
  onRetry,
  showHomeButton = true,
}: ErrorProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-card border shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-6 mx-auto">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-3">Oops! Something went wrong</h2>

          <p className="text-muted-foreground mb-8 leading-relaxed">{message}</p>

          <div className="space-y-3">
            {onRetry && (
              <Button
                onClick={onRetry}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-300 hover:scale-105"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}

            {showHomeButton && (
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="w-full border-border text-foreground hover:bg-accent rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

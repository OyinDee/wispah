import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, MessageCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="relative z-10 w-full max-w-md bg-card border shadow-2xl animate-in fade-in-0 zoom-in-95 duration-1000">
        <CardContent className="p-8 text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-4">
              <MessageCircle className="w-10 h-10 text-primary" />
            </div>
            <div className="text-8xl font-bold text-primary/20 mb-2">404</div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3">Page Not Found</h1>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            Oops! The whisper you're looking for seems to have vanished into the void. Let's get you back to safety! 🌟
          </p>

          <div className="space-y-3">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              asChild
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Link>
            </Button>

            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-accent rounded-xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="/dashboard">
                <MessageCircle className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">
              Lost? Try checking the URL or{" "}
              <Link href="/" className="text-primary hover:text-primary/80 underline">
                start over
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

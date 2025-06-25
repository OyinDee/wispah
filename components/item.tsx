"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, Sparkles, ExternalLink, ImageIcon } from "lucide-react"
import type { Message } from "@/lib/api"
import { MessageCardDownload } from "@/components/message-card-download"

interface ItemProps {
  message: Message
  index?: number
}

export function Item({ message, index = 0 }: ItemProps) {
  const [imageError, setImageError] = useState(false)

  const getMoodIcon = (messageText: string) => {
    const lowerMessage = messageText.toLowerCase()
    if (lowerMessage.includes("love") || lowerMessage.includes("❤️") || lowerMessage.includes("💕")) {
      return <Heart className="w-4 h-4 text-red-500" />
    }
    if (lowerMessage.includes("amazing") || lowerMessage.includes("awesome") || lowerMessage.includes("⭐")) {
      return <Star className="w-4 h-4 text-yellow-500" />
    }
    return <Sparkles className="w-4 h-4 text-purple-500" />
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch {
      return "Recently"
    }
  }

  const getRelativeTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

      if (diffInMinutes < 1) return "Just now"
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`

      const diffInHours = Math.floor(diffInMinutes / 60)
      if (diffInHours < 24) return `${diffInHours}h ago`

      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays === 1) return "Yesterday"
      if (diffInDays < 7) return `${diffInDays}d ago`

      const diffInWeeks = Math.floor(diffInDays / 7)
      if (diffInWeeks < 4) return `${diffInWeeks}w ago`

      const diffInMonths = Math.floor(diffInDays / 30)
      if (diffInMonths < 12) return `${diffInMonths}mo ago`

      const diffInYears = Math.floor(diffInDays / 365)
      return `${diffInYears}y ago`
    } catch {
      return "Recently"
    }
  }

  const handleImageClick = () => {
    if (message.imageURL && !imageError) {
      window.open(message.imageURL, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Card
      className={`transition-all duration-500 hover:scale-[1.02] hover:shadow-lg animate-in fade-in-0 slide-in-from-left-4 ${
        message.isRead ? "bg-card/50 border-border/50" : "bg-primary/5 border-primary/20 shadow-md"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getMoodIcon(message.message)}
            {!message.isRead && <Badge className="bg-primary text-primary-foreground text-xs animate-pulse">New</Badge>}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground text-xs">{getRelativeTime(message.time)}</span>
            <MessageCardDownload message={message} timestamp={formatTimestamp(message.time)} />
          </div>
        </div>

        {/* Message Text */}
        <p className="text-foreground leading-relaxed mb-4">{message.message}</p>

        {/* Message Image */}
        {message.imageURL && !imageError && (
          <div className="mb-4">
            <div
              className="relative group cursor-pointer"
              onClick={handleImageClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleImageClick()
                }
              }}
            >
              <img
                src={message.imageURL || "/placeholder.svg"}
                alt="Message attachment"
                className="max-w-full h-auto max-h-96 rounded-lg shadow-md transition-all duration-300 group-hover:shadow-lg object-cover"
                onError={() => {
                  console.error("Image failed to load:", message.imageURL)
                  setImageError(true)
                }}
                onLoad={() => console.log("Image loaded successfully:", message.imageURL)}
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 dark:bg-black/90 rounded-full p-2 shadow-lg">
                  <ExternalLink className="w-4 h-4 text-foreground" />
                </div>
              </div>
              {/* Click hint */}
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Click to view full size
              </div>
            </div>
          </div>
        )}

        {/* Show error message if image fails to load */}
        {message.imageURL && imageError && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border/50">
            <p className="text-muted-foreground text-sm flex items-center">
              <ImageIcon className="w-4 h-4 mr-2" />
              Image could not be loaded
              <button
                onClick={() => {
                  setImageError(false)
                  // Force re-render to retry loading
                }}
                className="ml-2 text-primary hover:text-primary/80 underline text-xs"
              >
                Retry
              </button>
            </p>
            {message.imageURL && (
              <p className="text-xs text-muted-foreground mt-1 break-all">URL: {message.imageURL}</p>
            )}
          </div>
        )}

        {/* Date Display */}
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-muted-foreground text-xs">Received on {formatTimestamp(message.time)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

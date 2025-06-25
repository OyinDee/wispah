"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import type { Message } from "@/lib/api"

interface MessageCardDownloadProps {
  message: Message
  timestamp: string
}

export function MessageCardDownload({ message, timestamp }: MessageCardDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  const generateMessageCard = async () => {
    if (!user || !canvasRef.current) return

    setIsGenerating(true)

    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Calculate dynamic canvas size based on message length and image presence
      const messageLength = message.message.length
      const baseWidth = 600
      const baseHeight = 400
      const hasImage = message.imageURL && message.imageURL.trim() !== ""

      // Adjust height based on message length and image
      const estimatedLines = Math.ceil(messageLength / 50)
      let dynamicHeight = Math.max(baseHeight, 300 + estimatedLines * 30)

      // Add extra height for image if present
      if (hasImage) {
        dynamicHeight += 250 // Extra space for image
      }

      canvas.width = baseWidth
      canvas.height = dynamicHeight

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "#8B5CF6")
      gradient.addColorStop(1, "#3B82F6")

      // Fill background
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add subtle pattern overlay
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
      for (let i = 0; i < canvas.width; i += 40) {
        for (let j = 0; j < canvas.height; j += 40) {
          ctx.fillRect(i, j, 20, 20)
        }
      }

      // Add main card background with rounded corners
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
      const cardPadding = 40
      const cardWidth = canvas.width - cardPadding * 2
      const cardHeight = canvas.height - cardPadding * 2

      // Draw rounded rectangle
      ctx.beginPath()
      ctx.roundRect(cardPadding, cardPadding, cardWidth, cardHeight, 20)
      ctx.fill()

      // Add header
      ctx.fillStyle = "#1F2937"
      ctx.font = "bold 24px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`ONE OF ${user.username.toUpperCase()}'s wispahs`, canvas.width / 2, 90)

      // Add decorative line
      ctx.strokeStyle = "#8B5CF6"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(100, 110)
      ctx.lineTo(canvas.width - 100, 110)
      ctx.stroke()

      let currentY = 140 // Starting Y position for content

      // Add message content with better text wrapping and centering
      ctx.fillStyle = "#374151"
      ctx.font = "18px Inter, sans-serif"
      ctx.textAlign = "center"

      // Word wrap the message with center alignment
      const words = message.message.split(" ")
      const lines: string[] = []
      let currentLine = ""
      const maxWidth = canvas.width - 120

      for (const word of words) {
        const testLine = currentLine + word + " "
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && currentLine !== "") {
          lines.push(currentLine.trim())
          currentLine = word + " "
        } else {
          currentLine = testLine
        }
      }
      lines.push(currentLine.trim())

      // Draw message lines centered
      const lineHeight = 28
      lines.forEach((line, index) => {
        if (index < 8) {
          // Limit to 8 lines to make room for image
          ctx.fillText(line, canvas.width / 2, currentY + index * lineHeight)
        }
      })

      currentY += lines.length * lineHeight + 30 // Move Y position down after text

      // Add image if present
      if (hasImage && message.imageURL) {
        try {
          const img = await loadImage(message.imageURL)

          // Calculate image dimensions to fit within card
          const maxImageWidth = cardWidth - 80 // Leave some padding
          const maxImageHeight = 200

          let imageWidth = img.width
          let imageHeight = img.height

          // Scale image to fit within bounds while maintaining aspect ratio
          const aspectRatio = imageWidth / imageHeight

          if (imageWidth > maxImageWidth) {
            imageWidth = maxImageWidth
            imageHeight = imageWidth / aspectRatio
          }

          if (imageHeight > maxImageHeight) {
            imageHeight = maxImageHeight
            imageWidth = imageHeight * aspectRatio
          }

          // Center the image
          const imageX = (canvas.width - imageWidth) / 2
          const imageY = currentY

          // Add a subtle border around the image
          ctx.fillStyle = "#E5E7EB"
          ctx.fillRect(imageX - 4, imageY - 4, imageWidth + 8, imageHeight + 8)

          // Draw the image
          ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight)

          currentY += imageHeight + 40 // Move Y position down after image
        } catch (error) {
          console.error("Failed to load image for card:", error)
          // Add a placeholder text if image fails to load
          ctx.fillStyle = "#9CA3AF"
          ctx.font = "14px Inter, sans-serif"
          ctx.textAlign = "center"
          ctx.fillText("📷 Image attachment", canvas.width / 2, currentY + 20)
          currentY += 50
        }
      }

      // Add timestamp at bottom (adjust position based on content)
      const timestampY = Math.max(currentY + 30, canvas.height - 80)
      ctx.fillStyle = "#6B7280"
      ctx.font = "14px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(timestamp, canvas.width / 2, timestampY)

      // Add Wispah branding at bottom
      ctx.fillStyle = "#8B5CF6"
      ctx.font = "bold 16px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("✨ Wispah", canvas.width / 2, timestampY + 30)

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `wispah-card-${Date.now()}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          toast({
            title: "Card downloaded! 🎨",
            description: hasImage
              ? "Your message card with image has been saved."
              : "Your message card has been saved as an image.",
          })
        }
      }, "image/png")
    } catch (error) {
      console.error("Error generating message card:", error)
      toast({
        title: "Download failed",
        description: "Unable to generate message card. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={generateMessageCard}
        disabled={isGenerating}
        className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
        title={message.imageURL ? "Download card with image" : "Download card"}
      >
        <ImageIcon className="w-3 h-3" />
        {isGenerating && <span className="ml-1 text-xs">...</span>}
      </Button>
      <canvas ref={canvasRef} className="hidden" />
    </>
  )
}

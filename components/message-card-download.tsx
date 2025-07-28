"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon, DownloadCloudIcon, Loader2 } from "lucide-react"
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
    if (!user || !canvasRef.current) {
      toast({
        title: "Authentication Error",
        description: "Please log in to download message cards.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Failed to get 2D context")

      const dpr = window.devicePixelRatio || 1

      const messageLength = message.message.length
      const hasImage = message.imageURL && message.imageURL.trim() !== ""
      const estimatedLines = Math.ceil(messageLength / 40)
      const messageHeight = estimatedLines * 30
      const imageHeight = hasImage ? 180 : 0
      const padding = 30
      const spacing = 20
      const headerHeight = 100
      const contentTopOffset = 50
      const cardRadius = 24
      const baseWidth = 400
      const totalHeight = headerHeight + contentTopOffset + messageHeight + spacing + imageHeight

      canvas.width = baseWidth * dpr
      canvas.height = totalHeight * dpr
      canvas.style.width = `${baseWidth}px`
      canvas.style.height = `${totalHeight}px`
      ctx.scale(dpr, dpr)

      ctx.fillStyle = "#fef9f5"
      ctx.fillRect(0, 0, baseWidth, totalHeight)

      ctx.save()
      ctx.shadowColor = "rgba(0, 0, 0, 0.08)"
      ctx.shadowBlur = 16
      ctx.shadowOffsetY = 6
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.roundRect(0, 0, baseWidth, totalHeight, cardRadius)
      ctx.fill()
      ctx.restore()

      const headerGradient = ctx.createLinearGradient(0, 0, baseWidth, 0)
      headerGradient.addColorStop(0, "#1e3a8a")
      headerGradient.addColorStop(1, "#000000")
      ctx.fillStyle = headerGradient
      ctx.beginPath()
      ctx.roundRect(0, 0, baseWidth, headerHeight, [0, 0, 0, 0])
      ctx.fill()

      ctx.fillStyle = "#fef9f5"
      ctx.font = "bold 18px 'Georgia', serif"
      ctx.textAlign = "center"
      ctx.fillText(`One of ${user.username}'s whispers`, baseWidth / 2, 40)

      ctx.font = "14px sans-serif"
      ctx.fillStyle = "#cbd5e1"
      ctx.fillText(timestamp, baseWidth / 2, 68)

      let currentY = headerHeight + contentTopOffset
      ctx.fillStyle = "#1e293b"
     ctx.textAlign = "center"
      const quoted = `"${message.message}"`
      const words = quoted.split(" ")
      let line = ""
      const lines: string[] = []
      const maxWidth = baseWidth - (padding * 2)

      for (const word of words) {
        const testLine = line + word + " "
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && line !== "") {
          lines.push(line.trim())
          line = word + " "
        } else {
          line = testLine
        }
      }
      lines.push(line.trim())

      lines.forEach((l, i) => {
        ctx.fillText(l, baseWidth / 2, currentY + i * 30)
      })

      currentY += lines.length * 30 + spacing

      if (hasImage && message.imageURL) {
        try {
          const img = await loadImage(message.imageURL)
          const imgW = 280
          const imgH = 160
          const imgX = (baseWidth - imgW) / 2
          const imgY = currentY

          ctx.fillStyle = "#f1f5f9"
          ctx.fillRect(imgX - 8, imgY - 8, imgW + 16, imgH + 28)
          ctx.drawImage(img, imgX, imgY, imgW, imgH)

          ctx.fillStyle = "#475569"
          ctx.font = "12px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText("Attached Photo", baseWidth / 2, imgY + imgH + 20)

          currentY += imgH + 40
        } catch {
          ctx.fillStyle = "#ef4444"
          ctx.font = "14px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText("Failed to load image 😔", baseWidth / 2, currentY)
          currentY += 40
        }
      }

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
            title: "Anonymous card downloaded! 📩",
            description: "Your message card has been saved.",
            duration: 3000,
          })
        } else {
          throw new Error("Failed to create blob from canvas.")
        }
      }, "image/png")
    } catch (error) {
      console.error("Error generating message card:", error)
      toast({
        title: "Download failed",
        description: "Unable to generate message card. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <Button
        onClick={generateMessageCard}
        disabled={isGenerating}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
          transition-all duration-300 ease-in-out
          bg-gradient-to-r from-indigo-500 to-purple-600 text-white
          hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}
        `}
        title={message.imageURL ? "Download anonymous card with image" : "Download anonymous card"}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <DownloadCloudIcon className="h-4 w-4" />
            {message.imageURL && (
              <ImageIcon className="w-3 h-3 ml-1" />
            )}
          </>
        )}
        <span className="sr-only">Download anonymous message card</span>
      </Button>
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

interface PollingIndicatorProps {
  isEnabled: boolean
  interval: number
}

export function PollingIndicator({ isEnabled, interval }: PollingIndicatorProps) {
  const [countdown, setCountdown] = useState(interval / 1000)

  useEffect(() => {
    if (!isEnabled) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return interval / 1000
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isEnabled, interval])

  if (!isEnabled) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        <WifiOff className="w-3 h-3 mr-1" />
        Offline
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="text-green-600 border-green-200">
      <Wifi className="w-3 h-3 mr-1" />
      Live • {countdown}s
    </Badge>
  )
}

"use client"

import { useEffect, useRef } from "react"

interface UsePollingOptions {
  callback: () => void
  interval: number
  enabled: boolean
}

export function usePolling({ callback, interval, enabled }: UsePollingOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (enabled) {
      intervalRef.current = setInterval(callback, interval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [callback, interval, enabled])

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startPolling = () => {
    if (!intervalRef.current && enabled) {
      intervalRef.current = setInterval(callback, interval)
    }
  }

  return { stopPolling, startPolling }
}

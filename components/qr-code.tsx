"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QrCode, X, Download } from "lucide-react"

interface QRCodeProps {
  url: string
  username: string
  onClose?: () => void
}

export function QRCodeComponent({ url, username, onClose }: QRCodeProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  // Generate QR code URL using a free service
  const generateQRCode = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
    setQrCodeUrl(qrUrl)
  }

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a")
      link.href = qrCodeUrl
      link.download = `wispah-${username}-qr.png`
      link.click()
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto bg-card border shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">QR Code</h3>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="text-center space-y-4">
          {!qrCodeUrl ? (
            <div>
              <div className="w-48 h-48 mx-auto bg-accent/50 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-16 h-16 text-muted-foreground" />
              </div>
              <Button
                onClick={generateQRCode}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
              >
                Generate QR Code
              </Button>
            </div>
          ) : (
            <div>
              <img
                src={qrCodeUrl || "/placeholder.svg"}
                alt={`QR Code for @${username}`}
                className="w-48 h-48 mx-auto rounded-lg shadow-md"
              />
              <p className="text-muted-foreground text-sm mb-4">Scan to send anonymous messages to @{username}</p>
              <Button onClick={downloadQRCode} variant="outline" className="rounded-xl">
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

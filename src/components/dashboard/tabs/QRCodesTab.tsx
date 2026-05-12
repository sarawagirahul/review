'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Plus, Download, Trash2, QrCode } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

interface QRCode {
  id: string
  nickname: string
  frame_title: string | null
  frame_tagline: string | null
  fg_color: string
  bg_color: string
  dot_style: string
  embed_logo: boolean
  scan_count: number
  created_at: string
}

interface Props {
  businessId: string
  businessName: string
  reviewLink: string
}

export default function QRCodesTab({ businessId, businessName, reviewLink }: Props) {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [nickname, setNickname] = useState('')
  const [frameTitle, setFrameTitle] = useState('')
  const [frameTagline, setFrameTagline] = useState('')
  const [fgColor, setFgColor] = useState('#131842')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [dotStyle, setDotStyle] = useState('square')
  const [embedLogo, setEmbedLogo] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function fetchQRCodes() {
    setLoading(true)
    const res = await fetch(`/api/businesses/${businessId}/qr-codes`)
    if (res.ok) {
      const data = await res.json()
      setQrCodes(data.qrCodes)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchQRCodes()
  }, [businessId])

  function downloadQR(qr: QRCode) {
    const container = document.getElementById(`qr-${qr.id}`)
    const svg = container?.querySelector('svg')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const size = 160
    canvas.width = size + 40
    canvas.height = size + 40
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      if (!ctx) return
      ctx.fillStyle = qr.bg_color
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 20, 20, size, size)
      const link = document.createElement('a')
      link.download = `${qr.nickname.replace(/\s+/g, '-').toLowerCase()}-qr.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  async function handleDelete(id: string) {
    await fetch(`/api/businesses/${businessId}/qr-codes/${id}`, { method: 'DELETE' })
    setDeletingId(null)
    fetchQRCodes()
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!nickname.trim()) return
    setSubmitting(true)
    const res = await fetch(`/api/businesses/${businessId}/qr-codes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickname,
        frame_title: frameTitle,
        frame_tagline: frameTagline,
        fg_color: fgColor,
        bg_color: bgColor,
        dot_style: dotStyle,
        embed_logo: embedLogo,
      }),
    })
    setSubmitting(false)
    if (res.ok) {
      setShowCreateModal(false)
      setNickname('')
      setFrameTitle('')
      setFrameTagline('')
      setFgColor('#131842')
      setBgColor('#ffffff')
      setDotStyle('square')
      setEmbedLogo(false)
      fetchQRCodes()
    }
  }

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">QR Codes</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-hairline bg-canvas h-[160px] animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">QR Codes</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-accent text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Create QR Code
        </button>
      </div>

      {qrCodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <QrCode className="h-12 w-12 text-muted mb-3" />
          <p className="text-sm font-semibold text-ink mb-1">No QR codes yet</p>
          <p className="text-xs text-muted">Create your first QR code to start tracking customer scans.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {qrCodes.map((qr) => (
            <div key={qr.id} className="rounded-xl border border-hairline bg-canvas p-4 shadow-subtle">
              <div className="flex justify-center">
                <div id={`qr-${qr.id}`}>
                  <QRCodeSVG
                    value={reviewLink}
                    size={120}
                    fgColor={qr.fg_color}
                    bgColor={qr.bg_color}
                  />
                </div>
              </div>
              <p className="text-sm font-semibold text-ink mt-3 text-center">{qr.nickname}</p>
              <p className="text-xs text-muted text-center">{qr.scan_count} scans</p>
              <p className="text-xs text-muted text-center">
                {new Date(qr.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <div className="flex justify-center gap-2 mt-3">
                <button
                  onClick={() => downloadQR(qr)}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-hairline hover:bg-surface-soft text-muted transition-colors"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeletingId(qr.id)}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-hairline hover:bg-surface-soft text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {deletingId === qr.id && (
                <div className="mt-2 rounded-lg bg-red-50 border border-red-200 p-3 text-center">
                  <p className="text-xs text-red-700 mb-2">Delete this QR?</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleDelete(qr.id)}
                      className="text-xs px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="text-xs px-3 py-1 border border-hairline rounded-md hover:bg-surface-soft"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create QR Code</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <Label htmlFor="nickname">Nickname *</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Front Counter, Table 5, Receipt"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="frameTitle">Frame title</Label>
                <Input
                  id="frameTitle"
                  value={frameTitle}
                  onChange={(e) => setFrameTitle(e.target.value)}
                  placeholder={businessName}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="frameTagline">Frame tagline</Label>
                <Input
                  id="frameTagline"
                  value={frameTagline}
                  onChange={(e) => setFrameTagline(e.target.value)}
                  placeholder="Scan to share your experience!"
                />
              </div>
              <div className="flex gap-4">
                <div className="space-y-1 flex-1">
                  <Label htmlFor="fgColor">QR foreground colour</Label>
                  <input
                    id="fgColor"
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-full h-9 rounded-md border border-hairline cursor-pointer"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <Label htmlFor="bgColor">QR background colour</Label>
                  <input
                    id="bgColor"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full h-9 rounded-md border border-hairline cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Dot style</Label>
                <Select value={dotStyle} onValueChange={setDotStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="embedLogo">Embed logo</Label>
                <Switch
                  id="embedLogo"
                  checked={embedLogo}
                  onCheckedChange={setEmbedLogo}
                />
              </div>
              <div className="flex flex-col items-center pt-2 pb-1">
                <QRCodeSVG value={reviewLink} size={100} fgColor={fgColor} bgColor={bgColor} />
                {(frameTitle || businessName) && (
                  <p className="text-sm font-semibold text-ink mt-2">{frameTitle || businessName}</p>
                )}
                {frameTagline && (
                  <p className="text-xs text-muted mt-0.5">{frameTagline}</p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-sm px-4 py-2 border border-hairline rounded-lg hover:bg-surface-soft transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="text-sm px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create QR'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Shield, Star } from 'lucide-react'

interface FeedbackItem {
  id: string
  rating: number
  message: string | null
  customer_name: string | null
  customer_contact: string | null
  is_resolved: boolean
  resolved_at: string | null
  resolved_note: string | null
  created_at: string
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} mins ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hours ago`
  const days = Math.floor(hrs / 24)
  return `${days} days ago`
}

export default function ShieldInboxTab({ businessId }: { businessId: string }) {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all')
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null)
  const [noteText, setNoteText] = useState<Record<string, string>>({})

  useEffect(() => {
    async function load() {
      setLoading(true)
      const res = await fetch(`/api/businesses/${businessId}/feedback`)
      if (res.ok) {
        const json = await res.json()
        setFeedback(json.feedback)
      }
      setLoading(false)
    }
    load()
  }, [businessId])

  async function handleResolve(id: string) {
    const res = await fetch(`/api/businesses/${businessId}/feedback/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_resolved: true }),
    })
    if (res.ok) {
      const json = await res.json()
      setFeedback(prev => prev.map(f => f.id === id ? json.feedback : f))
    }
  }

  async function handleSaveNote(id: string) {
    const res = await fetch(`/api/businesses/${businessId}/feedback/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolved_note: noteText[id] }),
    })
    if (res.ok) {
      const json = await res.json()
      setFeedback(prev => prev.map(f => f.id === id ? json.feedback : f))
      setExpandedNoteId(null)
    }
  }

  const filtered = feedback.filter(f => {
    if (filter === 'open') return !f.is_resolved
    if (filter === 'resolved') return f.is_resolved
    return true
  })

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-ink">Shield Inbox</h2>
        <p className="text-sm text-muted mt-1">Private feedback intercepted before reaching Google.</p>
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl bg-gray-100 h-32 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-ink">Shield Inbox</h2>
      <p className="text-sm text-muted mt-1">Private feedback intercepted before reaching Google.</p>

      <div className="flex gap-2 mt-4">
        {(['all', 'open', 'resolved'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors cursor-pointer ${
              filter === f ? 'bg-ink text-white' : 'border border-hairline text-muted hover:text-ink hover:bg-surface-soft'
            }`}>
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-full bg-accent-light flex items-center justify-center mb-3">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <p className="text-sm font-medium text-ink">Your Review Shield is active</p>
            <p className="text-xs text-muted mt-1">No complaints have been caught yet.</p>
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.id} className="rounded-xl border border-hairline bg-canvas p-4 mb-3">
              <div className="flex justify-between">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < item.rating ? 'text-star fill-star' : 'text-muted'}`}
                    />
                  ))}
                </div>
                {item.is_resolved ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">Resolved</span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent-light text-accent font-medium">Open</span>
                )}
              </div>

              {item.customer_name && (
                <p className="text-sm font-medium text-ink mt-2">{item.customer_name}</p>
              )}
              {item.customer_contact && (
                <p className="text-xs text-muted">{item.customer_contact}</p>
              )}
              {item.message && (
                <p className="text-sm text-body mt-2">{item.message}</p>
              )}
              <p className="text-xs text-muted mt-1">{relativeTime(item.created_at)}</p>

              <div className="flex gap-2 mt-3 flex-wrap">
                {!item.is_resolved && (
                  <button
                    onClick={() => handleResolve(item.id)}
                    className="text-xs px-3 py-1.5 border border-hairline rounded-md hover:bg-surface-soft text-ink transition-colors cursor-pointer">
                    Mark Resolved
                  </button>
                )}
                <button
                  onClick={() => setExpandedNoteId(expandedNoteId === item.id ? null : item.id)}
                  className="text-xs px-3 py-1.5 border border-hairline rounded-md hover:bg-surface-soft text-ink transition-colors cursor-pointer">
                  Add Note
                </button>
              </div>

              {expandedNoteId === item.id && (
                <div className="mt-3">
                  <textarea
                    value={noteText[item.id] ?? item.resolved_note ?? ''}
                    onChange={e => setNoteText(p => ({ ...p, [item.id]: e.target.value }))}
                    className="w-full rounded-lg border border-hairline px-3 py-2 text-sm text-body bg-canvas focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none min-h-[80px]"
                    placeholder="Add an internal note about this feedback..."
                  />
                  <button
                    onClick={() => handleSaveNote(item.id)}
                    className="mt-2 text-xs px-3 py-1.5 bg-ink text-white rounded-md hover:bg-ink/90 cursor-pointer">
                    Save Note
                  </button>
                </div>
              )}

              {item.resolved_note && expandedNoteId !== item.id && (
                <div className="mt-2 rounded-lg bg-canvas-warm p-3">
                  <p className="text-xs text-muted font-medium mb-1">Internal note</p>
                  <p className="text-sm text-body">{item.resolved_note}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Star, Info, ExternalLink } from 'lucide-react'
import { Tooltip } from '@/components/ui/tooltip'

interface Review {
  reviewer: string
  rating: number
  text: string
  date: string
}

interface ReviewsTabProps {
  businessId: string
  googlePlaceId: string | null
  reviewLink: string
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} mins ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hrs ago`
  return `${Math.floor(hrs / 24)} days ago`
}

export default function ReviewsTab({ businessId, googlePlaceId: _googlePlaceId, reviewLink }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [lastSynced, setLastSynced] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)

  async function fetchReviews() {
    const res = await fetch(`/api/businesses/${businessId}/reviews`)
    if (res.ok) {
      const data = await res.json()
      setReviews(data.reviews ?? [])
      setLastSynced(data.lastSynced ?? null)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchReviews().finally(() => setLoading(false))
  }, [businessId])

  async function handleSync() {
    setSyncing(true)
    await fetchReviews()
    setSyncing(false)
  }

  return (
    <div>
      <div className="rounded-xl border border-hairline bg-canvas-warm p-4 mb-6 flex items-start gap-3">
        <Info className="h-4 w-4 text-muted mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-body">
            Showing your 5 most recent reviews from Google Places.{' '}
            Connect your Google Business Profile to access all reviews and reply with AI.
          </p>
          <a href="/contact" className="text-xs text-accent hover:underline mt-1 inline-block cursor-pointer">Learn more</a>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-ink">Reviews</h2>
        <div className="flex items-center">
          {lastSynced && (
            <span className="text-xs text-muted mr-3">Last synced: {relativeTime(lastSynced)}</span>
          )}
          <button
            onClick={handleSync}
            disabled={syncing}
            className="text-xs px-3 py-1.5 border border-hairline rounded-md hover:bg-surface-soft text-ink transition-colors cursor-pointer disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-sm text-muted">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Star className="h-10 w-10 text-muted mb-3" />
          <p className="text-sm font-medium text-ink">No reviews found</p>
          <p className="text-xs text-muted mt-1">Reviews from Google Places will appear here once synced.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review, i) => (
            <div key={i} className="rounded-xl border border-hairline bg-canvas p-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-ink">{review.reviewer}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-3.5 w-3.5 ${idx < review.rating ? 'fill-star text-star' : 'text-muted/30'}`}
                      fill={idx < review.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-body mt-2">{review.text}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-muted">{review.date}</span>
                <Tooltip content="Connect your Google Business Profile to enable AI-powered replies">
                  <button disabled className="text-xs px-3 py-1.5 border border-hairline rounded-md text-muted opacity-50 cursor-not-allowed">
                    Reply with AI
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}

      {reviewLink && (
        <a
          href={reviewLink.replace('writereview', 'reviews')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline mt-4 cursor-pointer"
        >
          View all reviews on Google
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  )
}

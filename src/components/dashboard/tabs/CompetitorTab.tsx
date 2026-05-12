'use client'

import { useEffect, useState } from 'react'
import { Star, Sparkles, MapPin } from 'lucide-react'

type Radius = '250' | '500' | '750' | '1000' | '2000'

interface Competitor {
  name: string
  rating: number | null
  reviewCount: number | null
  distance: number | null
  menuUrl: string | null
}

interface CompetitorData {
  competitors: Competitor[]
  areaAverage: number | null
  yourRating: number | null
  insights: string[]
  lastUpdated: string
}

interface CompetitorTabProps {
  businessId: string
  businessName: string
  city: string
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

export default function CompetitorTab({ businessId }: CompetitorTabProps) {
  const [radius, setRadius] = useState<Radius>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(`jh_competitor_radius_${businessId}`) as Radius) || '500'
    }
    return '500'
  })
  const [data, setData] = useState<CompetitorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'distance'>('rating')

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/businesses/${businessId}/competitors?radius=${radius}`)
      const json = await res.json()
      if (json.error === 'no_location') {
        setError('no_location')
        setData(null)
      } else if (!res.ok) {
        setError('Failed to load competitor data.')
        setData(null)
      } else {
        setData(json)
      }
    } catch {
      setError('Failed to load competitor data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [businessId, radius])

  const sortedCompetitors = data
    ? [...data.competitors].sort((a, b) => {
        if (sortBy === 'rating') return (b.rating ?? -1) - (a.rating ?? -1)
        if (sortBy === 'reviews') return (b.reviewCount ?? -1) - (a.reviewCount ?? -1)
        return (a.distance ?? Infinity) - (b.distance ?? Infinity)
      })
    : []

  if (loading) {
    return (
      <div>
        <div className="flex justify-between flex-wrap gap-3 mb-6">
          <div className="h-7 w-48 bg-surface-soft rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-24 bg-surface-soft rounded-lg animate-pulse" />
            <div className="h-8 w-20 bg-surface-soft rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl border border-hairline bg-canvas p-4 shadow-subtle flex-shrink-0 min-w-[160px] h-24 animate-pulse bg-surface-soft" />
          ))}
        </div>
        <div className="rounded-xl border border-hairline overflow-hidden">
          <div className="bg-surface-soft h-10" />
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="border-t border-hairline h-12 px-4 flex items-center gap-4">
              <div className="h-4 w-32 bg-surface-soft rounded animate-pulse" />
              <div className="h-4 w-12 bg-surface-soft rounded animate-pulse" />
              <div className="h-4 w-12 bg-surface-soft rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error === 'no_location') {
    return (
      <div className="py-16 text-center">
        <MapPin className="h-10 w-10 text-muted mx-auto mb-3" />
        <p className="text-sm font-medium text-ink">Location not available</p>
        <p className="text-xs text-muted mt-1">Location data is required for competitor analysis.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-medium text-ink">{error}</p>
        <button onClick={fetchData} className="mt-3 px-4 py-2 border border-hairline rounded-lg text-sm hover:bg-surface-soft cursor-pointer">
          Try again
        </button>
      </div>
    )
  }

  const diff = data?.yourRating && data?.areaAverage ? (data.yourRating - data.areaAverage) : null

  return (
    <div>
      <div className="flex justify-between flex-wrap gap-3 mb-6">
        <h2 className="text-xl font-semibold text-ink">Competitor Analysis</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={radius}
            onChange={e => {
              setRadius(e.target.value as Radius)
              localStorage.setItem(`jh_competitor_radius_${businessId}`, e.target.value)
            }}
            className="border border-hairline rounded-lg px-3 py-1.5 text-sm text-ink bg-canvas cursor-pointer"
          >
            <option value="250">250m</option>
            <option value="500">500m</option>
            <option value="750">750m</option>
            <option value="1000">1km</option>
            <option value="2000">2km</option>
          </select>
          <button
            onClick={() => fetchData()}
            className="px-3 py-1.5 border border-hairline rounded-lg text-sm hover:bg-surface-soft cursor-pointer"
          >
            Refresh
          </button>
          {data && (
            <span className="text-xs text-muted self-center">
              Last updated: {relativeTime(data.lastUpdated)}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <div className="rounded-xl border border-hairline bg-canvas p-4 shadow-subtle flex-shrink-0 min-w-[160px]">
          <p className="text-2xl font-semibold text-ink">{data?.competitors.length ?? 0}</p>
          <p className="text-xs text-muted">Competitors nearby</p>
        </div>
        <div className="rounded-xl border border-hairline bg-canvas p-4 shadow-subtle flex-shrink-0 min-w-[160px]">
          <p className="text-2xl font-semibold text-ink">{data?.areaAverage?.toFixed(1) ?? '—'} ★</p>
          <p className="text-xs text-muted">Area avg rating</p>
        </div>
        <div className="rounded-xl border border-hairline bg-canvas p-4 shadow-subtle flex-shrink-0 min-w-[160px]">
          <p className={`text-2xl font-semibold ${diff == null ? 'text-ink' : diff >= 0 ? 'text-success' : 'text-red-600'}`}>
            {diff == null ? '—' : (diff >= 0 ? '+' : '') + diff.toFixed(1)}
          </p>
          <p className="text-xs text-muted">vs area average</p>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        {(['rating', 'reviews', 'distance'] as const).map(s => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer capitalize ${
              sortBy === s ? 'bg-ink text-white border-ink' : 'border-hairline text-muted hover:text-ink'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-hairline overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-soft">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Business</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Rating</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Reviews</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Distance</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Menu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {sortedCompetitors.map((c, i) => (
              <tr key={i} className="hover:bg-surface-soft transition-colors">
                <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                <td className="px-4 py-3">
                  {c.rating != null ? (
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-star text-star" />
                      <span className="text-ink">{c.rating.toFixed(1)}</span>
                    </span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3 text-muted">{c.reviewCount ?? '—'}</td>
                <td className="px-4 py-3 text-muted text-xs">{c.distance != null ? `${c.distance}m away` : '—'}</td>
                <td className="px-4 py-3">
                  {c.menuUrl ? (
                    <a href={c.menuUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-xs cursor-pointer">
                      View Menu →
                    </a>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.insights.length > 0 && (
        <div className="mt-6 rounded-xl border border-hairline bg-canvas-warm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-ink">AI Insights</h3>
          </div>
          <ul className="space-y-2">
            {data.insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-body">
                <span className="text-accent mt-0.5">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

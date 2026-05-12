'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Star, ShieldAlert, TrendingUp, Plus, Sparkles, RefreshCw } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OverviewStats {
  total_scans: number;
  total_scans_prev: number;
  review_clicks: number;
  review_clicks_prev: number;
  total_shield: number;
  total_shield_prev: number;
  unresolved_shield: number;
  conversion_rate: number;
  conversion_rate_prev: number;
}

interface BusinessSummary {
  id: string;
  name: string;
  city: string | null;
  logo_url: string | null;
  google_rating: number | null;
  total_scans: number;
  month_scans: number;
  month_reviews: number;
  unresolved_shield: number;
}

interface ActivityEvent {
  id: string;
  event_type: string;
  created_at: string;
  business_id: string;
  business_name: string;
  logo_url: string | null;
}

interface OverviewData {
  stats: OverviewStats;
  trend: Array<{ date: string; scans: number; reviews: number }>;
  businesses: BusinessSummary[];
  recentActivity: ActivityEvent[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function DeltaBadge({ current, prev }: { current: number; prev: number }) {
  if (prev === 0) return null;
  const pct = Math.round(((current - prev) / prev) * 100);
  const positive = pct >= 0;
  return (
    <p className={`text-xs font-medium mt-1 ${positive ? 'text-success' : 'text-signature-coral'}`}>
      {positive ? '+' : ''}{pct}% vs last month
    </p>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function SkeletonLayout() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[320px] rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error state
// ---------------------------------------------------------------------------

function ErrorState() {
  return (
    <div className="bg-canvas border border-hairline rounded-xl p-8 text-center text-muted">
      Failed to load dashboard data.{' '}
      <button
        onClick={() => window.location.reload()}
        className="text-accent underline cursor-pointer"
      >
        Retry
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stats cards row
// ---------------------------------------------------------------------------

function StatsRow({ stats }: { stats: OverviewStats }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {/* Card 1 — Total Scans */}
      <motion.div
        key="scans"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
        className="bg-canvas border border-hairline rounded-xl p-5 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted mb-1">QR Scans this month</p>
            <p className="text-2xl font-semibold text-ink">{stats.total_scans}</p>
            <DeltaBadge current={stats.total_scans} prev={stats.total_scans_prev} />
          </div>
          <div className="p-2 rounded-lg bg-accent-light">
            <QrCode className="h-[18px] w-[18px] text-accent" />
          </div>
        </div>
      </motion.div>

      {/* Card 2 — Reviews Posted */}
      <motion.div
        key="reviews"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-canvas border border-hairline rounded-xl p-5 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted mb-1">Reviews posted this month</p>
            <p className="text-2xl font-semibold text-ink">{stats.review_clicks}</p>
            <DeltaBadge current={stats.review_clicks} prev={stats.review_clicks_prev} />
          </div>
          <div className="p-2 rounded-lg bg-accent-light">
            <Star className="h-[18px] w-[18px] text-accent" />
          </div>
        </div>
      </motion.div>

      {/* Card 3 — Shield Catches */}
      <motion.div
        key="shield"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-canvas border border-hairline rounded-xl p-5 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted mb-1">Caught this month</p>
            <p className="text-2xl font-semibold text-ink">{stats.total_shield}</p>
            {stats.unresolved_shield > 0 ? (
              <p className="text-xs font-medium mt-1 text-signature-coral">
                {stats.unresolved_shield} unresolved
              </p>
            ) : (
              <DeltaBadge current={stats.total_shield} prev={stats.total_shield_prev} />
            )}
          </div>
          <div className="p-2 rounded-lg bg-accent-light">
            <ShieldAlert className="h-[18px] w-[18px] text-accent" />
          </div>
        </div>
      </motion.div>

      {/* Card 4 — Conversion Rate */}
      <motion.div
        key="conversion"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-canvas border border-hairline rounded-xl p-5 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted mb-1">Scan → review rate</p>
            <p className="text-2xl font-semibold text-ink">{stats.conversion_rate}%</p>
            <DeltaBadge current={stats.conversion_rate} prev={stats.conversion_rate_prev} />
          </div>
          <div className="p-2 rounded-lg bg-accent-light">
            <TrendingUp className="h-[18px] w-[18px] text-accent" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Trend chart
// ---------------------------------------------------------------------------

function TrendChart({ trend }: { trend: OverviewData['trend'] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-canvas border border-hairline rounded-xl p-5 mb-6 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-ink mb-4">30-Day Trend</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={trend} margin={{ top: 0, right: 16, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e0d8" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#41454d' }}
            tickFormatter={(v) => {
              const d = new Date(v);
              return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
            }}
          />
          <YAxis tick={{ fontSize: 11, fill: '#41454d' }} />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #dddddd',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
          <Line
            type="monotone"
            dataKey="scans"
            stroke="#131842"
            strokeWidth={2}
            dot={false}
            name="Scans"
          />
          <Line
            type="monotone"
            dataKey="reviews"
            stroke="#E68369"
            strokeWidth={2}
            dot={false}
            name="Reviews"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Business table
// ---------------------------------------------------------------------------

function BusinessTable({ businesses }: { businesses: BusinessSummary[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="bg-canvas border border-hairline rounded-xl overflow-hidden mb-6 shadow-sm"
    >
      <div className="px-5 py-4 border-b border-hairline">
        <h2 className="text-sm font-semibold text-ink">Your Businesses</h2>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-hairline">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Business
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                Scans
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                Reviews
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                Shield
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                Rating
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((biz) => (
              <tr
                key={biz.id}
                className="border-b border-hairline last:border-0 hover:bg-surface-soft transition-colors h-[52px]"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-accent-light flex items-center justify-center text-accent text-xs font-semibold flex-shrink-0 overflow-hidden">
                      {biz.logo_url ? (
                        <img
                          src={biz.logo_url}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        biz.name[0].toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{biz.name}</p>
                      <p className="text-xs text-muted">{biz.city || '—'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-right text-sm text-ink">{biz.month_scans}</td>
                <td className="px-5 py-3 text-right text-sm text-ink">{biz.month_reviews}</td>
                <td className="px-5 py-3 text-right">
                  {biz.unresolved_shield > 0 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                      {biz.unresolved_shield} open
                    </span>
                  ) : (
                    <span className="text-sm text-muted">—</span>
                  )}
                </td>
                <td className="px-5 py-3 text-right text-sm text-ink">
                  {biz.google_rating ? `${biz.google_rating} ★` : '—'}
                </td>
                <td className="px-5 py-3 text-right">
                  <a
                    href={`/dashboard/businesses/${biz.id}`}
                    className="text-xs font-medium text-accent hover:underline cursor-pointer"
                  >
                    Manage →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-hairline">
        {businesses.map((biz) => (
          <div key={biz.id} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-accent-light flex items-center justify-center text-accent text-xs font-semibold overflow-hidden">
                  {biz.logo_url ? (
                    <img
                      src={biz.logo_url}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    biz.name[0].toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{biz.name}</p>
                  <p className="text-xs text-muted">{biz.city || '—'}</p>
                </div>
              </div>
              <a
                href={`/dashboard/businesses/${biz.id}`}
                className="text-xs text-accent font-medium"
              >
                Manage →
              </a>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-muted">Scans</p>
                <p className="text-sm font-semibold text-ink">{biz.month_scans}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Reviews</p>
                <p className="text-sm font-semibold text-ink">{biz.month_reviews}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Shield</p>
                <p
                  className={`text-sm font-semibold ${
                    biz.unresolved_shield > 0 ? 'text-red-600' : 'text-ink'
                  }`}
                >
                  {biz.unresolved_shield}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Activity feed
// ---------------------------------------------------------------------------

function ActivityFeed({ recentActivity }: { recentActivity: ActivityEvent[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9 }}
      className="bg-canvas border border-hairline rounded-xl overflow-hidden shadow-sm"
    >
      <div className="px-5 py-4 border-b border-hairline flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Recent Activity</h2>
        <a href="/dashboard/feedback" className="text-xs text-accent hover:underline">
          View all
        </a>
      </div>

      {recentActivity.length === 0 ? (
        <div className="p-8 text-center text-muted text-sm">
          No activity yet — place your first QR code to get started
        </div>
      ) : (
        <div className="divide-y divide-hairline">
          {recentActivity.map((event) => (
            <div key={event.id} className="px-5 py-3 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-surface-soft flex items-center justify-center flex-shrink-0">
                {event.event_type === 'scan' && (
                  <QrCode className="h-4 w-4 text-muted" />
                )}
                {event.event_type === 'review_clicked' && (
                  <Star className="h-4 w-4 text-accent" />
                )}
                {event.event_type === 'feedback_submitted' && (
                  <ShieldAlert className="h-4 w-4 text-signature-coral" />
                )}
                {event.event_type === 'ai_generated' && (
                  <Sparkles className="h-4 w-4 text-muted" />
                )}
                {event.event_type === 'regenerate_clicked' && (
                  <RefreshCw className="h-4 w-4 text-muted" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink truncate">
                  {event.event_type === 'scan' && 'QR code scanned'}
                  {event.event_type === 'review_clicked' && 'Review posted to Google'}
                  {event.event_type === 'feedback_submitted' && 'Shield catch — private feedback'}
                  {event.event_type === 'ai_generated' && 'AI options generated'}
                  {event.event_type === 'regenerate_clicked' && 'AI options regenerated'}
                </p>
                <p className="text-xs text-muted">{event.business_name}</p>
              </div>
              <p className="text-xs text-muted flex-shrink-0">
                {relativeTime(event.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard/overview')
      .then((r) => r.json())
      .then((d: OverviewData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Overview</h1>
          <p className="text-sm text-muted mt-0.5">
            Aggregate view across all your businesses
          </p>
        </div>
        <a
          href="/dashboard/setup"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Business
        </a>
      </div>

      {/* Content */}
      {loading && <SkeletonLayout />}
      {!loading && error && <ErrorState />}
      {!loading && !error && data && (
        <>
          <StatsRow stats={data.stats} />
          <TrendChart trend={data.trend} />
          <BusinessTable businesses={data.businesses} />
          <ActivityFeed recentActivity={data.recentActivity} />
        </>
      )}
    </div>
  );
}

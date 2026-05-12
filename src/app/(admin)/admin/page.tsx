'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Building2, Star, Shield, TrendingUp, UserCircle, Clock, AlertCircle } from 'lucide-react';

interface Stats {
  total_owners: number;
  total_customers: number;
  active_businesses: number;
  total_reviews: number;
  total_shield_catches: number;
  active_subs: number;
  trial_users: number;
  expired_trials: number;
  new_owners_this_month: number;
}

interface Owner {
  id: string;
  full_name: string | null;
  email: string;
  created_at: string;
  is_active: boolean;
  business_count: number;
  owner_details: { subscription_status: string | null; trial_ends_at: string | null } | null;
}

function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  index,
  subtext,
  subtextClass,
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon: React.ElementType;
  index: number;
  subtext?: string;
  subtextClass?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-hairline bg-white p-5 shadow-subtle"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted font-medium">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
          {delta && <p className="mt-0.5 text-xs text-signature-forest font-medium">{delta}</p>}
          {subtext && <p className={`mt-0.5 text-xs font-medium ${subtextClass ?? 'text-muted'}`}>{subtext}</p>}
        </div>
        <div className="p-2 rounded-lg bg-accent/[0.08]">
          <Icon className="h-5 w-5 text-accent" />
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string | null | undefined }) {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: 'Active', className: 'bg-green-100 text-green-700' },
    trial: { label: 'Trial', className: 'bg-blue-100 text-blue-700' },
    past_due: { label: 'Past Due', className: 'bg-red-100 text-red-700' },
    cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-600' },
    paused: { label: 'Paused', className: 'bg-yellow-100 text-yellow-700' },
  };
  const s = map[status ?? ''] ?? { label: status ?? 'Unknown', className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${s.className}`}>
      {s.label}
    </span>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOwners, setRecentOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/owners?limit=10&sort=newest').then((r) => r.json()),
    ]).then(([s, o]) => {
      setStats(s);
      setRecentOwners(o.owners ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-ink">Platform Dashboard</h1>
          <p className="text-sm text-muted mt-1">Loading platform stats…</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-hairline bg-white p-5 animate-pulse h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Platform Dashboard</h1>
        <p className="text-sm text-muted mt-1">Platform-wide overview</p>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <StatCard
          label="Business Owners"
          value={stats?.total_owners ?? 0}
          delta={`+${stats?.new_owners_this_month ?? 0} this month`}
          icon={Users}
          index={0}
        />
        <StatCard
          label="Active Subscriptions"
          value={stats?.active_subs ?? 0}
          subtext={`${stats?.trial_users ?? 0} on trial`}
          icon={TrendingUp}
          index={1}
        />
        <StatCard
          label="Active Businesses"
          value={stats?.active_businesses ?? 0}
          icon={Building2}
          index={2}
        />
        <StatCard
          label="Total Reviews"
          value={stats?.total_reviews ?? 0}
          delta="All time"
          icon={Star}
          index={3}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Shield Catches"
          value={stats?.total_shield_catches ?? 0}
          delta="All time"
          icon={Shield}
          index={4}
        />
        <StatCard
          label="Trial Users"
          value={stats?.trial_users ?? 0}
          subtext={stats?.expired_trials ? `${stats.expired_trials} expired` : undefined}
          subtextClass="text-red-500"
          icon={Clock}
          index={5}
        />
        <StatCard
          label="Total Customers"
          value={stats?.total_customers ?? 0}
          delta="Registered reviewers"
          icon={UserCircle}
          index={6}
        />
      </div>

      {/* Recent Signups */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-2xl border border-hairline bg-white shadow-subtle overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline">
          <h2 className="text-base font-semibold text-ink">Recent Signups</h2>
          <Link href="/admin/owners" className="text-xs text-accent hover:underline font-medium cursor-pointer">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline bg-surface-soft">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Signed Up</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Businesses</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {recentOwners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted text-sm">
                    No owners yet
                  </td>
                </tr>
              ) : (
                recentOwners.map((owner) => {
                  const od = Array.isArray(owner.owner_details) ? owner.owner_details[0] : owner.owner_details;
                  const isExpiredTrial =
                    od?.subscription_status === 'trial' &&
                    od?.trial_ends_at &&
                    new Date(od.trial_ends_at) < new Date();
                  const displayStatus = isExpiredTrial ? 'expired' : od?.subscription_status;

                  return (
                    <tr key={owner.id} className="hover:bg-surface-soft transition-colors">
                      <td className="px-6 py-3 font-medium text-ink">
                        {owner.full_name ?? '—'}
                      </td>
                      <td className="px-6 py-3 text-muted">{owner.email}</td>
                      <td className="px-6 py-3 text-muted">
                        {new Date(owner.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={displayStatus} />
                      </td>
                      <td className="px-6 py-3 text-muted">{owner.business_count}</td>
                      <td className="px-6 py-3">
                        <Link
                          href={`/admin/owners/${owner.id}`}
                          className="text-accent text-sm font-medium hover:underline cursor-pointer"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Alerts */}
      {(stats?.expired_trials ?? 0) > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">
              {stats?.expired_trials} expired trial{(stats?.expired_trials ?? 0) > 1 ? 's' : ''} need attention
            </p>
            <p className="text-xs text-red-600 mt-0.5">These owners&apos; trials have ended and they haven&apos;t converted.</p>
            <Link href="/admin/owners?status=expired" className="text-xs text-red-700 font-semibold hover:underline mt-1 inline-block cursor-pointer">
              View expired trials →
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}

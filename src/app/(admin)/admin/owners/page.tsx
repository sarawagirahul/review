'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface OwnerDetails {
  subscription_status: string | null;
  trial_ends_at: string | null;
  subscription_interval: string | null;
}

interface Owner {
  id: string;
  full_name: string | null;
  email: string;
  created_at: string;
  is_active: boolean;
  business_count: number;
  owner_details: OwnerDetails | OwnerDetails[] | null;
}

function StatusBadge({ status }: { status: string | null | undefined }) {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: 'Active', className: 'bg-green-100 text-green-700' },
    trial: { label: 'Trial', className: 'bg-blue-100 text-blue-700' },
    past_due: { label: 'Past Due', className: 'bg-red-100 text-red-700' },
    cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-600' },
    paused: { label: 'Paused', className: 'bg-yellow-100 text-yellow-700' },
    expired: { label: 'Expired', className: 'bg-red-100 text-red-600' },
  };
  const s = map[status ?? ''] ?? { label: status ?? '—', className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${s.className}`}>
      {s.label}
    </span>
  );
}

const STATUSES = ['all', 'trial', 'active', 'expired', 'paused', 'past_due', 'cancelled'] as const;

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchOwners = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: '20',
      search: debouncedSearch,
      status: status === 'all' ? '' : status,
    });
    const res = await fetch(`/api/admin/owners?${params}`);
    const data = await res.json();
    setOwners(data.owners ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, debouncedSearch, status]);

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  // Reset page on filter/search change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Business Owners</h1>
        <p className="text-sm text-muted mt-1">{total} total owners</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-hairline bg-white text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={[
                'px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors cursor-pointer',
                status === s
                  ? 'bg-accent text-white'
                  : 'bg-white border border-hairline text-muted hover:border-accent hover:text-accent',
              ].join(' ')}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-hairline bg-white shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline bg-surface-soft">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Businesses</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Trial End / Billing</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-4 bg-surface-soft rounded animate-pulse w-3/4" />
                    </td>
                  </tr>
                ))
              ) : owners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted">No owners found</td>
                </tr>
              ) : (
                owners.map((owner) => {
                  const od = Array.isArray(owner.owner_details) ? owner.owner_details[0] : owner.owner_details;
                  const isExpiredTrial =
                    od?.subscription_status === 'trial' &&
                    od?.trial_ends_at &&
                    new Date(od.trial_ends_at) < new Date();
                  const displayStatus = isExpiredTrial ? 'expired' : od?.subscription_status;

                  return (
                    <tr key={owner.id} className="hover:bg-surface-soft transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-semibold shrink-0">
                            {(owner.full_name ?? owner.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-ink">{owner.full_name ?? '—'}</p>
                            <p className="text-xs text-muted">{owner.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={displayStatus} />
                        {!owner.is_active && (
                          <span className="ml-1 text-xs text-red-500 font-medium">inactive</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-muted">{owner.business_count}</td>
                      <td className="px-6 py-3 text-muted text-xs">
                        {od?.trial_ends_at
                          ? new Date(od.trial_ends_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'}
                      </td>
                      <td className="px-6 py-3 text-muted text-xs">
                        {new Date(owner.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-hairline bg-surface-soft">
            <p className="text-xs text-muted">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded border border-hairline bg-white disabled:opacity-40 hover:border-accent transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded border border-hairline bg-white disabled:opacity-40 hover:border-accent transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

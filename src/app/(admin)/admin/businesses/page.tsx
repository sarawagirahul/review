'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, ExternalLink, Building2 } from 'lucide-react';

interface BusinessOwner {
  id: string;
  full_name: string | null;
  email: string;
}

interface Business {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  logo_url: string | null;
  is_active: boolean;
  total_scans: number;
  google_rating: number | null;
  google_review_count: number | null;
  qr_slug: string;
  primary_category: string | null;
  owner: BusinessOwner | null;
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      search: debouncedSearch,
      status: status === 'all' ? '' : status,
    });
    const res = await fetch(`/api/admin/businesses?${params}`);
    const data = await res.json();
    setBusinesses(data.businesses ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [debouncedSearch, status]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  async function doAction(bizId: string, action: string) {
    setActionLoading(bizId);
    await fetch(`/api/admin/businesses/${bizId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    setActionLoading(null);
    fetchBusinesses();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Businesses</h1>
        <p className="text-sm text-muted mt-1">{total} total businesses</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search by name or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-hairline bg-white text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map((s) => (
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
              {s}
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Business</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Scans</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Status</th>
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
              ) : businesses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted">No businesses found</td>
                </tr>
              ) : (
                businesses.map((biz) => {
                  const owner = Array.isArray(biz.owner) ? biz.owner[0] : biz.owner;
                  return (
                    <tr key={biz.id} className="hover:bg-surface-soft transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg border border-hairline bg-white flex items-center justify-center shrink-0">
                            {biz.logo_url ? (
                              <img src={biz.logo_url} alt={biz.name} className="h-7 w-7 rounded object-cover" />
                            ) : (
                              <Building2 className="h-4 w-4 text-muted" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-ink">{biz.name}</p>
                            <p className="text-xs text-muted">{[biz.city, biz.state].filter(Boolean).join(', ') || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        {owner ? (
                          <div>
                            <p className="text-ink text-xs font-medium">{owner.full_name ?? '—'}</p>
                            <p className="text-muted text-xs">{owner.email}</p>
                          </div>
                        ) : '—'}
                      </td>
                      <td className="px-6 py-3 text-muted">{biz.total_scans}</td>
                      <td className="px-6 py-3 text-muted">
                        {biz.google_rating ? `${biz.google_rating}★` : '—'}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${biz.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {biz.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <a
                            href={`/r/${biz.qr_slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-accent-hover transition-colors cursor-pointer"
                            title="View QR Page"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          {biz.is_active ? (
                            <button
                              onClick={() => doAction(biz.id, 'deactivate')}
                              disabled={actionLoading === biz.id}
                              className="text-xs text-red-500 hover:underline cursor-pointer disabled:opacity-50"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => doAction(biz.id, 'reactivate')}
                              disabled={actionLoading === biz.id}
                              className="text-xs text-green-600 hover:underline cursor-pointer disabled:opacity-50"
                            >
                              Reactivate
                            </button>
                          )}
                          {biz.is_active && (
                            <Link
                              href={`/admin/owners/${owner?.id ?? ''}`}
                              className="text-xs text-muted hover:text-accent transition-colors cursor-pointer"
                            >
                              Owner →
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

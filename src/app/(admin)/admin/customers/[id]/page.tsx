'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  logo_url: string | null;
  city: string | null;
}

interface Review {
  id: string;
  rating: number;
  final_text: string | null;
  language: string;
  submitted_to_google: boolean;
  created_at: string;
  business: Business | null;
}

interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  last_active_at: string | null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-sm font-semibold text-star">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
  );
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/admin/customers/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setCustomer(data.customer);
        setReviews(data.reviews ?? []);
        setLoading(false);
      });
  }, [id]);

  async function doAction(action: string) {
    setActionLoading(true);
    const res = await fetch(`/api/admin/customers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    setActionLoading(false);
    if (data.success) {
      setMessage(`Action "${action}" applied.`);
      setCustomer((prev) => prev ? { ...prev, is_active: action === 'reactivate' } : prev);
    } else {
      setMessage(data.error ?? 'Error');
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-surface-soft rounded w-48" />
        <div className="h-28 bg-surface-soft rounded-xl" />
      </div>
    );
  }

  if (!customer) return <p className="text-muted">Customer not found.</p>;

  const initial = (customer.full_name ?? customer.email).charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/customers" className="text-muted hover:text-ink transition-colors cursor-pointer">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold text-ink">{customer.full_name ?? customer.email}</h1>
        <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${customer.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {customer.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {message && (
        <div className="mb-4 rounded-lg px-4 py-2.5 text-sm font-medium bg-green-50 text-green-700 border border-green-200">
          {message}
        </div>
      )}

      {/* Profile */}
      <div className="rounded-2xl border border-hairline bg-white shadow-subtle p-6 mb-4">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Profile</h2>
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center text-lg font-bold shrink-0">
            {initial}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 text-sm">
            <div>
              <p className="text-xs text-muted mb-0.5">Name</p>
              <p className="text-ink font-medium">{customer.full_name ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-0.5">Email</p>
              <p className="text-ink">{customer.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-0.5">Phone</p>
              <p className="text-ink">{customer.phone ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-0.5">Joined</p>
              <p className="text-ink">{new Date(customer.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-0.5">Total Reviews</p>
              <p className="text-ink font-semibold">{reviews.length}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-hairline mt-4 pt-4 flex gap-2">
          {customer.is_active ? (
            <button
              onClick={() => doAction('deactivate')}
              disabled={actionLoading}
              className="px-4 py-2 border border-red-400 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Deactivate
            </button>
          ) : (
            <button
              onClick={() => doAction('reactivate')}
              disabled={actionLoading}
              className="px-4 py-2 border border-green-500 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Reactivate
            </button>
          )}
        </div>
      </div>

      {/* Review History */}
      <div className="rounded-2xl border border-hairline bg-white shadow-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-hairline">
          <h2 className="text-base font-semibold text-ink">Review History ({reviews.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline bg-surface-soft">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Business</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Review</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Lang</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted">No reviews yet</td>
                </tr>
              ) : (
                reviews.map((r) => {
                  const biz = Array.isArray(r.business) ? r.business[0] : r.business;
                  return (
                    <tr key={r.id} className="hover:bg-surface-soft transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded border border-hairline bg-surface-soft flex items-center justify-center shrink-0">
                            {biz?.logo_url ? (
                              <img src={biz.logo_url} alt={biz.name} className="h-6 w-6 rounded object-cover" />
                            ) : (
                              <Building2 className="h-3.5 w-3.5 text-muted" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-ink">{biz?.name ?? '—'}</p>
                            <p className="text-[10px] text-muted">{biz?.city ?? ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3"><StarRating rating={r.rating} /></td>
                      <td className="px-6 py-3 max-w-xs">
                        <p className="text-muted text-xs truncate">{r.final_text ?? '—'}</p>
                      </td>
                      <td className="px-6 py-3 text-muted text-xs uppercase">{r.language}</td>
                      <td className="px-6 py-3 text-muted text-xs">
                        {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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

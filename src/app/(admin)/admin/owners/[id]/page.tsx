'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, ExternalLink } from 'lucide-react';

interface OwnerDetails {
  subscription_status: string | null;
  subscription_interval: string | null;
  trial_ends_at: string | null;
  razorpay_customer_id: string | null;
  razorpay_subscription_id: string | null;
}

interface Business {
  id: string;
  name: string;
  city: string | null;
  logo_url: string | null;
  is_active: boolean;
  total_scans: number;
  google_rating: number | null;
  qr_slug: string;
}

interface Owner {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  last_active_at: string | null;
}

function StatusBadge({ status }: { status: string | null | undefined }) {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: 'Active', className: 'bg-green-100 text-green-700' },
    trial: { label: 'Trial', className: 'bg-blue-100 text-blue-700' },
    past_due: { label: 'Past Due', className: 'bg-red-100 text-red-700' },
    cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-600' },
    paused: { label: 'Paused', className: 'bg-yellow-100 text-yellow-700' },
  };
  const s = map[status ?? ''] ?? { label: status ?? '—', className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${s.className}`}>
      {s.label}
    </span>
  );
}

export default function OwnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [ownerDetails, setOwnerDetails] = useState<OwnerDetails | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [extendDays, setExtendDays] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/admin/owners/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOwner(data.owner);
        setOwnerDetails(data.ownerDetails);
        setBusinesses(data.businesses ?? []);
        setLoading(false);
      });
  }, [id]);

  async function doAction(action: string, extra?: Record<string, unknown>) {
    setActionLoading(true);
    setMessage('');
    const res = await fetch(`/api/admin/owners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...extra }),
    });
    const data = await res.json();
    setActionLoading(false);
    if (data.success) {
      setMessage(`Action "${action}" applied.`);
      // Refresh
      fetch(`/api/admin/owners/${id}`).then((r) => r.json()).then((d) => {
        setOwner(d.owner);
        setOwnerDetails(d.ownerDetails);
      });
    } else {
      setMessage(data.error ?? 'Error');
    }
  }

  async function doDelete() {
    setActionLoading(true);
    const res = await fetch(`/api/admin/owners/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirm: deleteConfirm }),
    });
    const data = await res.json();
    setActionLoading(false);
    if (data.success) {
      router.push('/admin/owners');
    } else {
      setMessage(data.error ?? 'Error');
      setShowDeleteDialog(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-surface-soft rounded w-48" />
        <div className="h-32 bg-surface-soft rounded-xl" />
        <div className="h-32 bg-surface-soft rounded-xl" />
      </div>
    );
  }

  if (!owner) {
    return <p className="text-muted">Owner not found.</p>;
  }

  const initial = (owner.full_name ?? owner.email).charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/owners" className="text-muted hover:text-ink transition-colors cursor-pointer">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold text-ink">{owner.full_name ?? owner.email}</h1>
        <StatusBadge status={ownerDetails?.subscription_status} />
        {!owner.is_active && (
          <span className="text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
            Inactive
          </span>
        )}
      </div>

      {message && (
        <div className={`mb-4 rounded-lg px-4 py-2.5 text-sm font-medium ${message.includes('Error') || message.includes('error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {message}
        </div>
      )}

      {/* Profile Card */}
      <div className="rounded-2xl border border-hairline bg-white shadow-subtle p-6 mb-4">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Profile</h2>
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center text-lg font-bold shrink-0">
            {initial}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 text-sm">
            <div>
              <p className="text-xs text-muted mb-0.5">Full Name</p>
              <p className="text-ink font-medium">{owner.full_name ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-0.5">Email</p>
              <p className="text-ink">{owner.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-0.5">Phone</p>
              <p className="text-ink">{owner.phone ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-0.5">Joined</p>
              <p className="text-ink">{new Date(owner.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            {owner.last_active_at && (
              <div>
                <p className="text-xs text-muted mb-0.5">Last Active</p>
                <p className="text-ink">{new Date(owner.last_active_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="rounded-2xl border border-hairline bg-white shadow-subtle p-6 mb-4">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Subscription</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-5">
          <div>
            <p className="text-xs text-muted mb-0.5">Plan</p>
            <p className="text-ink font-medium capitalize">{ownerDetails?.subscription_interval ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-0.5">Status</p>
            <StatusBadge status={ownerDetails?.subscription_status} />
          </div>
          <div>
            <p className="text-xs text-muted mb-0.5">Trial Ends</p>
            <p className="text-ink">
              {ownerDetails?.trial_ends_at
                ? new Date(ownerDetails.trial_ends_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                : '—'}
            </p>
          </div>
          {ownerDetails?.razorpay_customer_id && (
            <div>
              <p className="text-xs text-muted mb-0.5">Razorpay Customer</p>
              <p className="font-mono text-xs text-ink">{ownerDetails.razorpay_customer_id}</p>
            </div>
          )}
          {ownerDetails?.razorpay_subscription_id && (
            <div>
              <p className="text-xs text-muted mb-0.5">Razorpay Subscription</p>
              <p className="font-mono text-xs text-ink">{ownerDetails.razorpay_subscription_id}</p>
            </div>
          )}
        </div>

        {/* Trial Extension */}
        <div className="border-t border-hairline pt-4">
          <p className="text-sm font-medium text-ink mb-2">Extend Trial</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="365"
              placeholder="Days"
              value={extendDays}
              onChange={(e) => setExtendDays(e.target.value)}
              className="w-24 px-3 py-2 border border-hairline rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            />
            <button
              onClick={() => doAction('extend_trial', { days: parseInt(extendDays) })}
              disabled={!extendDays || actionLoading}
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-accent-hover transition-colors cursor-pointer"
            >
              Extend Trial
            </button>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="rounded-2xl border border-hairline bg-white shadow-subtle p-6 mb-4">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Admin Actions</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => doAction('activate')}
            disabled={actionLoading}
            className="px-4 py-2 border border-green-500 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Activate
          </button>
          <button
            onClick={() => doAction('pause')}
            disabled={actionLoading}
            className="px-4 py-2 border border-yellow-500 text-yellow-700 rounded-lg text-sm font-semibold hover:bg-yellow-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Pause Account
          </button>
          <button
            onClick={() => doAction('deactivate')}
            disabled={actionLoading}
            className="px-4 py-2 border border-red-400 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Deactivate
          </button>
          <button
            onClick={() => doAction('reactivate')}
            disabled={actionLoading}
            className="px-4 py-2 border border-blue-400 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Reactivate
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            disabled={actionLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 ml-auto"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Businesses */}
      {businesses.length > 0 && (
        <div className="rounded-2xl border border-hairline bg-white shadow-subtle p-6 mb-4">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Businesses ({businesses.length})</h2>
          <div className="grid gap-3">
            {businesses.map((biz) => (
              <div key={biz.id} className="flex items-center justify-between p-3 rounded-lg border border-hairline bg-surface-soft">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-white border border-hairline flex items-center justify-center shrink-0">
                    {biz.logo_url ? (
                      <img src={biz.logo_url} alt={biz.name} className="h-8 w-8 rounded object-cover" />
                    ) : (
                      <Building2 className="h-5 w-5 text-muted" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{biz.name}</p>
                    <p className="text-xs text-muted">{biz.city ?? '—'} · {biz.total_scans} scans · {biz.google_rating ? `${biz.google_rating}★` : 'no rating'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${biz.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {biz.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <a
                    href={`/r/${biz.qr_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-hover transition-colors cursor-pointer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-modal w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-ink mb-2">Delete Owner Account</h3>
            <p className="text-sm text-muted mb-4">
              This permanently deletes the owner and all their businesses, QR codes, reviews, and feedback.
              Type <strong className="text-ink">{owner.email}</strong> to confirm.
            </p>
            <input
              type="email"
              placeholder={owner.email}
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="w-full px-3 py-2 border border-hairline rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setShowDeleteDialog(false); setDeleteConfirm(''); }}
                className="px-4 py-2 border border-hairline text-muted rounded-lg text-sm hover:bg-surface-soft transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                disabled={deleteConfirm !== owner.email || actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

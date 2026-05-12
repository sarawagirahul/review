'use client';

import { useState, useEffect } from 'react';
import { UserX, UserPlus, Shield } from 'lucide-react';

interface Admin {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export default function AdminSettingsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [addEmail, setAddEmail] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings/admins')
      .then((r) => r.json())
      .then((data) => {
        setAdmins(data.admins ?? []);
        setLoading(false);
      });

    // Get current user id from cookie — simpler: we detect it from list after add/remove
  }, []);

  async function addAdmin() {
    if (!addEmail.trim()) return;
    setAddLoading(true);
    setMessage('');
    const res = await fetch('/api/admin/settings/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: addEmail.trim() }),
    });
    const data = await res.json();
    setAddLoading(false);
    if (data.success) {
      setAddEmail('');
      setMessage('Admin added successfully.');
      fetchAdmins();
    } else {
      setMessage(data.error ?? 'Error adding admin');
    }
  }

  async function removeAdmin(userId: string) {
    if (!confirm('Remove this admin? They will become a regular owner.')) return;
    const res = await fetch('/api/admin/settings/admins', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage('Admin removed.');
      fetchAdmins();
    } else {
      setMessage(data.error ?? 'Error removing admin');
    }
  }

  function fetchAdmins() {
    setLoading(true);
    fetch('/api/admin/settings/admins')
      .then((r) => r.json())
      .then((data) => {
        setAdmins(data.admins ?? []);
        setLoading(false);
      });
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Settings</h1>
        <p className="text-sm text-muted mt-1">Platform configuration</p>
      </div>

      {message && (
        <div className={`mb-4 rounded-lg px-4 py-2.5 text-sm font-medium ${message.toLowerCase().includes('error') || message.toLowerCase().includes('cannot') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {message}
        </div>
      )}

      {/* Platform Info */}
      <div className="rounded-2xl border border-hairline bg-white shadow-subtle p-6 mb-4">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Platform Info</h2>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-hairline">
            <span className="text-muted">App URL</span>
            <span className="text-ink font-medium">{process.env.NEXT_PUBLIC_APP_URL ?? 'Not set'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-hairline">
            <span className="text-muted">Trial Duration</span>
            <span className="text-ink font-medium">7 days</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-hairline">
            <span className="text-muted">Grace Period</span>
            <span className="text-ink font-medium">3 days</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-hairline">
            <span className="text-muted">Monthly Plan Price</span>
            <span className="text-ink font-medium">₹599</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-muted">Annual Plan Price</span>
            <span className="text-ink font-medium">₹4,999</span>
          </div>
        </div>
      </div>

      {/* Manage Admins */}
      <div className="rounded-2xl border border-hairline bg-white shadow-subtle p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Admin Accounts</h2>
        </div>

        {/* Add Admin */}
        <div className="flex gap-2 mb-5">
          <input
            type="email"
            placeholder="Enter email to grant admin access…"
            value={addEmail}
            onChange={(e) => setAddEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addAdmin(); }}
            className="flex-1 px-3 py-2 border border-hairline rounded-lg text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          />
          <button
            onClick={addAdmin}
            disabled={!addEmail.trim() || addLoading}
            className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-accent-hover transition-colors cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            Add
          </button>
        </div>

        {/* Admin List */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-12 bg-surface-soft rounded-lg animate-pulse" />
            ))}
          </div>
        ) : admins.length === 0 ? (
          <p className="text-sm text-muted text-center py-4">No admins found</p>
        ) : (
          <div className="space-y-2">
            {admins.map((admin) => {
              const isSelf = admin.id === currentUserId;
              const initial = (admin.full_name ?? admin.email).charAt(0).toUpperCase();
              return (
                <div key={admin.id} className="flex items-center justify-between p-3 rounded-lg border border-hairline bg-surface-soft">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-semibold shrink-0">
                      {initial}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{admin.full_name ?? '—'}</p>
                      <p className="text-xs text-muted">{admin.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeAdmin(admin.id)}
                    disabled={isSelf}
                    title={isSelf ? 'Cannot remove yourself' : 'Remove admin access'}
                    className="p-1.5 text-muted hover:text-red-500 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <UserX className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-xs text-muted mt-3">
          Removing an admin sets their role to &quot;owner&quot;. You cannot remove yourself.
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Settings } from 'lucide-react';

interface RazorpaySubscription {
  id: string;
  plan_id: string;
  status: string;
  current_start: number;
  current_end: number;
}

interface RazorpayPayment {
  id: string;
  amount: number;
  status: string;
  created_at: number;
  error_description?: string;
}

interface RevenueData {
  error?: string;
  active_monthly_count?: number;
  active_annual_count?: number;
  monthly_mrr?: number;
  annual_arr?: number;
  failed_payments?: RazorpayPayment[];
  subscriptions?: RazorpaySubscription[];
}

function StatCard({ label, value, sub, index, errorStyle }: {
  label: string;
  value: string;
  sub?: string;
  index: number;
  errorStyle?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="rounded-xl border border-hairline bg-white p-5 shadow-subtle"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted font-medium">{label}</p>
          <p className={`mt-1 text-2xl font-semibold ${errorStyle ? 'text-red-500' : 'text-ink'}`}>{value}</p>
          {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
        </div>
        <div className="p-2 rounded-lg bg-accent/[0.08]">
          <TrendingUp className="h-5 w-5 text-accent" />
        </div>
      </div>
    </motion.div>
  );
}

export default function RevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/revenue')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-ink mb-6">Revenue</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl border border-hairline bg-white animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (data?.error === 'razorpay_not_configured' || data?.error === 'razorpay_api_error') {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-ink mb-6">Revenue</h1>
        <div className="rounded-2xl border border-hairline bg-white shadow-subtle p-12 flex flex-col items-center text-center">
          <Settings className="h-10 w-10 text-muted mb-3" />
          <p className="text-base font-semibold text-ink mb-1">
            {data.error === 'razorpay_api_error' ? 'Razorpay API Error' : 'Razorpay Not Configured'}
          </p>
          <p className="text-sm text-muted">
            {data.error === 'razorpay_api_error'
              ? 'Could not fetch data from Razorpay. Check your API keys.'
              : 'Set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to view revenue data.'}
          </p>
        </div>
      </div>
    );
  }

  const MONTHLY_PRICE = 599;
  const ANNUAL_PRICE = 4999;
  const failedCount = data?.failed_payments?.length ?? 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Revenue</h1>
        <p className="text-sm text-muted mt-1">Live data from Razorpay</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Monthly Recurring Revenue"
          value={`₹${(data?.monthly_mrr ?? 0).toLocaleString('en-IN')}`}
          sub="Based on active plans"
          index={0}
        />
        <StatCard
          label="Annual Recurring Revenue"
          value={`₹${(data?.annual_arr ?? 0).toLocaleString('en-IN')}`}
          sub="Annualised total"
          index={1}
        />
        <StatCard
          label="Active Monthly Plans"
          value={String(data?.active_monthly_count ?? 0)}
          sub={`₹${((data?.active_monthly_count ?? 0) * MONTHLY_PRICE).toLocaleString('en-IN')} / mo`}
          index={2}
        />
        <StatCard
          label="Active Annual Plans"
          value={String(data?.active_annual_count ?? 0)}
          sub={`₹${((data?.active_annual_count ?? 0) * ANNUAL_PRICE).toLocaleString('en-IN')} / yr`}
          index={3}
        />
        <StatCard
          label="Failed Payments This Month"
          value={String(failedCount)}
          errorStyle={failedCount > 0}
          index={4}
        />
      </div>

      {/* Failed Payments */}
      {failedCount > 0 && (
        <div className="rounded-2xl border border-red-200 bg-white shadow-subtle overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <h2 className="text-base font-semibold text-red-700">Failed Payments ({failedCount})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hairline bg-surface-soft">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Payment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Failed Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {data?.failed_payments?.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-soft">
                    <td className="px-6 py-3 font-mono text-xs text-ink">{p.id}</td>
                    <td className="px-6 py-3 text-ink">₹{(p.amount / 100).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-3 text-muted text-xs">
                      {new Date(p.created_at * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-3 text-muted text-xs">{p.error_description ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subscriptions Table */}
      <div className="rounded-2xl border border-hairline bg-white shadow-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-hairline">
          <h2 className="text-base font-semibold text-ink">All Subscriptions ({data?.subscriptions?.length ?? 0})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline bg-surface-soft">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Subscription ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Current Period</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Next Billing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {(data?.subscriptions ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted">No subscriptions found</td>
                </tr>
              ) : (
                data?.subscriptions?.map((s) => {
                  const monthlyPlanId = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_MONTHLY;
                  const planLabel = s.plan_id === monthlyPlanId ? 'Monthly' : 'Annual';
                  const statusColor: Record<string, string> = {
                    active: 'bg-green-100 text-green-700',
                    cancelled: 'bg-gray-100 text-gray-600',
                    halted: 'bg-red-100 text-red-600',
                    paused: 'bg-yellow-100 text-yellow-700',
                  };
                  return (
                    <tr key={s.id} className="hover:bg-surface-soft">
                      <td className="px-6 py-3 font-mono text-xs text-ink">{s.id}</td>
                      <td className="px-6 py-3 text-ink">{planLabel}</td>
                      <td className="px-6 py-3">
                        <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${statusColor[s.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-muted text-xs">
                        {s.current_start ? new Date(s.current_start * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                      </td>
                      <td className="px-6 py-3 text-muted text-xs">
                        {s.current_end ? new Date(s.current_end * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
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

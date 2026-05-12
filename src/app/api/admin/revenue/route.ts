import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface RazorpaySubscription {
  id: string;
  plan_id: string;
  status: string;
  current_start: number;
  current_end: number;
  quantity: number;
  notes?: Record<string, string>;
}

interface RazorpayPayment {
  id: string;
  amount: number;
  status: string;
  created_at: number;
  description?: string;
  error_code?: string;
  error_description?: string;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (userData?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'razorpay_not_configured' }, { status: 200 });
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const headers = { Authorization: `Basic ${auth}` };

  try {
    const [subsRes, paymentsRes] = await Promise.all([
      fetch('https://api.razorpay.com/v1/subscriptions?count=100', { headers }),
      fetch('https://api.razorpay.com/v1/payments?count=100', { headers }),
    ]);

    const [subsData, paymentsData] = await Promise.all([
      subsRes.json(),
      paymentsRes.json(),
    ]);

    const subscriptions: RazorpaySubscription[] = subsData.items ?? [];
    const payments: RazorpayPayment[] = paymentsData.items ?? [];

    const monthlyPlanId = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_MONTHLY ?? '';
    const annualPlanId = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_ANNUAL ?? '';

    const activeMonthly = subscriptions.filter(
      (s) => s.status === 'active' && s.plan_id === monthlyPlanId
    );
    const activeAnnual = subscriptions.filter(
      (s) => s.status === 'active' && s.plan_id === annualPlanId
    );

    const MONTHLY_PRICE = 599;
    const ANNUAL_PRICE = 4999;

    const mrr = activeMonthly.length * MONTHLY_PRICE + activeAnnual.length * (ANNUAL_PRICE / 12);
    const arr = activeMonthly.length * MONTHLY_PRICE * 12 + activeAnnual.length * ANNUAL_PRICE;

    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000;
    const failedPayments = payments.filter(
      (p) => p.status === 'failed' && p.created_at >= monthStart
    );

    return NextResponse.json({
      active_monthly_count: activeMonthly.length,
      active_annual_count: activeAnnual.length,
      monthly_mrr: Math.round(mrr),
      annual_arr: Math.round(arr),
      failed_payments: failedPayments,
      subscriptions,
    });
  } catch {
    return NextResponse.json({ error: 'razorpay_api_error' }, { status: 200 });
  }
}

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (userData?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '20');
  const search = searchParams.get('search') ?? '';

  const admin = createAdminClient();
  const offset = (page - 1) * limit;

  let query = admin
    .from('users')
    .select('id, email, full_name, avatar_url, phone, is_active, created_at, last_active_at', { count: 'exact' })
    .eq('role', 'customer')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Review counts per customer
  const customerIds = (data ?? []).map((c) => c.id);
  const { data: reviewCounts } = customerIds.length
    ? await admin.from('reviews').select('customer_id').in('customer_id', customerIds)
    : { data: [] };

  const reviewMap: Record<string, number> = {};
  (reviewCounts ?? []).forEach((r: { customer_id: string | null }) => {
    if (r.customer_id) reviewMap[r.customer_id] = (reviewMap[r.customer_id] ?? 0) + 1;
  });

  const customers = (data ?? []).map((c) => ({
    ...c,
    review_count: reviewMap[c.id] ?? 0,
  }));

  return NextResponse.json({ customers, total: count ?? 0, page, limit });
}

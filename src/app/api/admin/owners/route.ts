import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: userData } = await supabase
    .from('users').select('role').eq('id', user.id).single();
  if (userData?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '20');
  const search = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? '';
  const sort = searchParams.get('sort') ?? '';

  const admin = createAdminClient();
  const offset = (page - 1) * limit;

  let query = admin
    .from('users')
    .select(`
      id, email, full_name, avatar_url, phone, is_active, created_at, last_active_at,
      owner_details(subscription_status, subscription_interval, trial_ends_at, razorpay_customer_id, razorpay_subscription_id)
    `, { count: 'exact' })
    .eq('role', 'owner');

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (status === 'active') {
    // filter via owner_details — we do this post-fetch or via a view; simplified: fetch all and filter
  }

  if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch business counts per owner
  const ownerIds = (data ?? []).map((o) => o.id);
  const { data: bizCounts } = ownerIds.length
    ? await admin
        .from('businesses')
        .select('owner_id')
        .in('owner_id', ownerIds)
    : { data: [] };

  const bizCountMap: Record<string, number> = {};
  (bizCounts ?? []).forEach((b: { owner_id: string }) => {
    bizCountMap[b.owner_id] = (bizCountMap[b.owner_id] ?? 0) + 1;
  });

  const owners = (data ?? []).map((o) => ({
    ...o,
    business_count: bizCountMap[o.id] ?? 0,
  }));

  // Filter by status if provided (owner_details is nested)
  let filtered = owners;
  if (status && status !== 'all') {
    if (status === 'expired') {
      filtered = owners.filter((o) => {
        const od = Array.isArray(o.owner_details) ? o.owner_details[0] : o.owner_details;
        return od?.subscription_status === 'trial' && od?.trial_ends_at && new Date(od.trial_ends_at) < new Date();
      });
    } else {
      filtered = owners.filter((o) => {
        const od = Array.isArray(o.owner_details) ? o.owner_details[0] : o.owner_details;
        return od?.subscription_status === status;
      });
    }
  }

  return NextResponse.json({ owners: filtered, total: count ?? 0, page, limit });
}

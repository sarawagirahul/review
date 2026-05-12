import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: userData } = await supabase
    .from('users').select('role').eq('id', user.id).single();
  if (userData?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const admin = createAdminClient();

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const [
    { count: totalOwners },
    { count: totalCustomers },
    { count: activeBusinesses },
    { count: totalReviews },
    { count: totalShieldCatches },
    { count: activeSubs },
    { count: trialUsers },
    { count: expiredTrials },
    { count: newOwnersThisMonth },
  ] = await Promise.all([
    admin.from('users').select('*', { count: 'exact', head: true }).eq('role', 'owner'),
    admin.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    admin.from('businesses').select('*', { count: 'exact', head: true }).eq('is_active', true),
    admin.from('reviews').select('*', { count: 'exact', head: true }),
    admin.from('private_feedback').select('*', { count: 'exact', head: true }),
    admin.from('owner_details').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active'),
    admin.from('owner_details').select('*', { count: 'exact', head: true }).eq('subscription_status', 'trial'),
    admin.from('owner_details').select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'trial')
      .lt('trial_ends_at', new Date().toISOString()),
    admin.from('users').select('*', { count: 'exact', head: true })
      .eq('role', 'owner').gte('created_at', monthStart),
  ]);

  return NextResponse.json({
    total_owners: totalOwners ?? 0,
    total_customers: totalCustomers ?? 0,
    active_businesses: activeBusinesses ?? 0,
    total_reviews: totalReviews ?? 0,
    total_shield_catches: totalShieldCatches ?? 0,
    active_subs: activeSubs ?? 0,
    trial_users: trialUsers ?? 0,
    expired_trials: expiredTrials ?? 0,
    new_owners_this_month: newOwnersThisMonth ?? 0,
  });
}

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (userData?.role !== 'admin') return null;
  return user;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin_user = await verifyAdmin();
  if (!admin_user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const admin = createAdminClient();

  const [{ data: owner }, { data: ownerDetails }, { data: businesses }] = await Promise.all([
    admin.from('users').select('*').eq('id', id).single(),
    admin.from('owner_details').select('*').eq('user_id', id).single(),
    admin.from('businesses').select('id, name, city, logo_url, is_active, total_scans, google_rating, qr_slug').eq('owner_id', id),
  ]);

  if (!owner) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ owner, ownerDetails, businesses: businesses ?? [] });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin_user = await verifyAdmin();
  if (!admin_user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const admin = createAdminClient();

  if (body.action === 'extend_trial') {
    const days = Number(body.days);
    if (!days || days < 1) return NextResponse.json({ error: 'Invalid days' }, { status: 400 });

    const { data: od } = await admin.from('owner_details').select('trial_ends_at').eq('user_id', id).single();
    const base = od?.trial_ends_at ? new Date(od.trial_ends_at) : new Date();
    base.setDate(base.getDate() + days);

    await admin.from('owner_details').update({ trial_ends_at: base.toISOString() }).eq('user_id', id);
    return NextResponse.json({ success: true });
  }

  if (body.action === 'activate') {
    await admin.from('owner_details').update({ subscription_status: 'active' }).eq('user_id', id);
    return NextResponse.json({ success: true });
  }

  if (body.action === 'pause') {
    await admin.from('owner_details').update({ subscription_status: 'paused' }).eq('user_id', id);
    return NextResponse.json({ success: true });
  }

  if (body.action === 'deactivate') {
    await admin.from('users').update({ is_active: false }).eq('id', id);
    return NextResponse.json({ success: true });
  }

  if (body.action === 'reactivate') {
    await admin.from('users').update({ is_active: true }).eq('id', id);
    await admin.from('owner_details').update({ subscription_status: 'trial' }).eq('user_id', id);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin_user = await verifyAdmin();
  if (!admin_user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const admin = createAdminClient();

  const { data: owner } = await admin.from('users').select('email').eq('id', id).single();
  if (!owner) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (body.confirm !== owner.email) {
    return NextResponse.json({ error: 'Email confirmation does not match' }, { status: 400 });
  }

  await admin.from('users').delete().eq('id', id);
  return NextResponse.json({ success: true });
}

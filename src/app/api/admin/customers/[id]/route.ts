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

  const [{ data: customer }, { data: reviews }] = await Promise.all([
    admin.from('users').select('*').eq('id', id).single(),
    admin.from('reviews')
      .select(`
        id, rating, final_text, language, submitted_to_google, created_at,
        business:businesses!business_id(id, name, logo_url, city)
      `)
      .eq('customer_id', id)
      .order('created_at', { ascending: false }),
  ]);

  if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ customer, reviews: reviews ?? [] });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin_user = await verifyAdmin();
  if (!admin_user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const admin = createAdminClient();

  if (body.action === 'deactivate') {
    await admin.from('users').update({ is_active: false }).eq('id', id);
    return NextResponse.json({ success: true });
  }

  if (body.action === 'reactivate') {
    await admin.from('users').update({ is_active: true }).eq('id', id);
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

  const { data: customer } = await admin.from('users').select('email').eq('id', id).single();
  if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (body.confirm !== customer.email) {
    return NextResponse.json({ error: 'Email confirmation does not match' }, { status: 400 });
  }

  // Nullify customer_id on reviews (preserve data, remove identity)
  await admin.from('reviews').update({ customer_id: null }).eq('customer_id', id);
  await admin.from('users').delete().eq('id', id);

  return NextResponse.json({ success: true });
}

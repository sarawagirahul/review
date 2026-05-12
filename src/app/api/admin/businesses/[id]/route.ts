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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin_user = await verifyAdmin();
  if (!admin_user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const admin = createAdminClient();

  if (body.action === 'deactivate') {
    await admin.from('businesses').update({ is_active: false }).eq('id', id);
    return NextResponse.json({ success: true });
  }

  if (body.action === 'reactivate') {
    await admin.from('businesses').update({ is_active: true }).eq('id', id);
    return NextResponse.json({ success: true });
  }

  if (body.action === 'pause') {
    await admin.from('businesses').update({ is_active: false }).eq('id', id);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

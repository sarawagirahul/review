import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

async function getCallerAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (userData?.role !== 'admin') return null;
  return user;
}

export async function GET() {
  const caller = await getCallerAdmin();
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('users')
    .select('id, email, full_name, avatar_url, created_at')
    .eq('role', 'admin')
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ admins: data ?? [] });
}

export async function POST(req: Request) {
  const caller = await getCallerAdmin();
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  const admin = createAdminClient();
  const { data: target, error: findError } = await admin
    .from('users').select('id, email, role').eq('email', email).single();

  if (findError || !target) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  await admin.from('users').update({ role: 'admin' }).eq('id', target.id);
  return NextResponse.json({ success: true, userId: target.id });
}

export async function DELETE(req: Request) {
  const caller = await getCallerAdmin();
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
  if (userId === caller.id) return NextResponse.json({ error: 'Cannot remove yourself' }, { status: 400 });

  const admin = createAdminClient();
  await admin.from('users').update({ role: 'owner' }).eq('id', userId);
  return NextResponse.json({ success: true });
}

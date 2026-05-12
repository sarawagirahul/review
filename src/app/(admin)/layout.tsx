import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: userData } = await supabase
    .from('users')
    .select('role, full_name, avatar_url, email')
    .eq('id', user.id)
    .single();

  if (!userData || userData.role !== 'admin') redirect('/');

  return (
    <AdminShell
      user={{ id: user.id, email: user.email }}
      userData={userData}
    >
      {children}
    </AdminShell>
  );
}

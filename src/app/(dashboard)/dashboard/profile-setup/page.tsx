import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileSetupClient from './ProfileSetupClient'

export default async function ProfileSetupPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: userData } = await supabase
    .from('users')
    .select('full_name, email, avatar_url, phone')
    .eq('id', user.id)
    .single()

  if (userData?.phone) {
    redirect('/dashboard')
  }

  const { count } = await supabase
    .from('businesses')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', user.id)

  return (
    <ProfileSetupClient
      user={{
        full_name: userData?.full_name || user.user_metadata?.full_name || '',
        email: userData?.email || user.email || '',
        avatar_url: userData?.avatar_url || user.user_metadata?.avatar_url || '',
      }}
      hasBusinesses={(count ?? 0) > 0}
    />
  )
}

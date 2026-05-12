import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id, role, phone')
    .eq('id', user.id)
    .single()

  let isNewUser = false

  if (!existingUser) {
    isNewUser = true
    
    // Default to owner if hitting this API (since customers bypass this usually)
    await supabase.from('users').insert({
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name || '',
      avatar_url: user.user_metadata?.avatar_url || '',
      role: 'owner',
    })

    // Create owner details with trial
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 7)

    await supabase.from('owner_details').insert({
      user_id: user.id,
      subscription_status: 'trial',
      trial_ends_at: trialEndsAt.toISOString(),
    })
  }

  const isProfileComplete = !isNewUser && !!(existingUser?.phone && existingUser.phone !== '')

  return NextResponse.json({
    user: existingUser || { id: user.id, role: 'owner' },
    isNewUser,
    isProfileComplete
  })
}

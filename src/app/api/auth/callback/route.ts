import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && authData.session) {
      const { user, session } = authData
      const providerToken = session.provider_token
      const providerRefreshToken = session.provider_refresh_token

      const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
      const adminClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const { data: existingUser } = await adminClient
        .from('users')
        .select('id, phone')
        .eq('id', user.id)
        .single()

      if (!existingUser) {
        // New user — create profile records
        const { error: insertUserError } = await adminClient.from('users').insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
          role: 'owner',
        })
        if (insertUserError) console.error('User Insert Error:', insertUserError)

        const trialEndsAt = new Date()
        trialEndsAt.setDate(trialEndsAt.getDate() + 7)

        const { error: insertOwnerError } = await adminClient.from('owner_details').insert({
          user_id: user.id,
          subscription_status: 'trial',
          trial_ends_at: trialEndsAt.toISOString(),
          google_access_token: providerToken,
          google_refresh_token: providerRefreshToken,
        })
        if (insertOwnerError) console.error('Owner Insert Error:', insertOwnerError)

        return NextResponse.redirect(`${origin}/dashboard/profile-setup`)
      }

      // Existing user — refresh tokens
      await adminClient.from('owner_details').update({
        google_access_token: providerToken,
        ...(providerRefreshToken ? { google_refresh_token: providerRefreshToken } : {}),
      }).eq('user_id', user.id)

      // Route based on profile completion and businesses
      const isProfileComplete = !!(existingUser.phone && existingUser.phone !== '')
      if (!isProfileComplete) {
        return NextResponse.redirect(`${origin}/dashboard/profile-setup`)
      }

      const { count: businessCount } = await adminClient
        .from('businesses')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', user.id)

      return NextResponse.redirect(
        `${origin}${(businessCount ?? 0) > 0 ? '/dashboard' : '/dashboard/setup'}`
      )
    }
  }

  return NextResponse.redirect(`${origin}/login?error=true`)
}

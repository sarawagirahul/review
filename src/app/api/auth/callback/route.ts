import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard/setup'

  if (code) {
    const supabase = await createClient()
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && authData.session) {
      const { user, session } = authData
      const providerToken = session.provider_token
      const providerRefreshToken = session.provider_refresh_token

      try {
        // Check if user exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!existingUser) {
          // Create user
          await supabase.from('users').insert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url || '',
            role: 'owner',
          })

          // Set trial end date
          const trialEndsAt = new Date()
          trialEndsAt.setDate(trialEndsAt.getDate() + 7)

          await supabase.from('owner_details').insert({
            user_id: user.id,
            subscription_status: 'trial',
            trial_ends_at: trialEndsAt.toISOString(),
            google_access_token: providerToken,
            google_refresh_token: providerRefreshToken,
          })
          
          return NextResponse.redirect(`${origin}/dashboard/setup`)
        } else {
          // Update tokens for existing user
          await supabase.from('owner_details').update({
            google_access_token: providerToken,
            ...(providerRefreshToken ? { google_refresh_token: providerRefreshToken } : {})
          }).eq('user_id', user.id)
        }
      } catch (err) {
        console.error('Error syncing profile:', err)
      }

      // If existing user, go to dashboard
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=true`)
}

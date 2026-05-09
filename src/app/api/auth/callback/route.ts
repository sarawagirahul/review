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
        // Create an admin client to bypass RLS for initial user creation
        const supabaseAdmin = createClient() // We'll just pass the service role key to it
        
        // Since we are using @supabase/ssr createServerClient, we can't easily swap keys.
        // Let's import the standard supabase-js client just for this admin bypass.
        const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
        const adminAuthClient = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Check if user exists
        const { data: existingUser } = await adminAuthClient
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!existingUser) {
          // Create user
          const { error: insertUserError } = await adminAuthClient.from('users').insert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url || '',
            role: 'owner',
          })
          
          if (insertUserError) console.error("User Insert Error:", insertUserError)

          // Set trial end date
          const trialEndsAt = new Date()
          trialEndsAt.setDate(trialEndsAt.getDate() + 7)

          const { error: insertOwnerError } = await adminAuthClient.from('owner_details').insert({
            user_id: user.id,
            subscription_status: 'trial',
            trial_ends_at: trialEndsAt.toISOString(),
            google_access_token: providerToken,
            google_refresh_token: providerRefreshToken,
          })
          
          if (insertOwnerError) console.error("Owner Insert Error:", insertOwnerError)
          
          return NextResponse.redirect(`${origin}/dashboard/setup`)
        } else {
          // Update tokens for existing user
          await adminAuthClient.from('owner_details').update({
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

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  // 1. Verify user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()

    // 2. Only allow updating owner-provided fields (exclude Google API data which syncs separately)
    const allowedUpdates = [
      'contact_email',
      'contact_phone',
      'whatsapp_business',
      'instagram_url',
      'facebook_url',
      'youtube_url',
      'twitter_url',
      'logo_url',
      'brand_color_primary',
      'brand_color_secondary',
      'qr_fg_color',
      'qr_bg_color',
      'qr_frame_text',
      'qr_frame_style',
      'review_page_tagline',
      'thank_you_message',
    ]

    const updates: Record<string, any> = {}
    for (const key of Object.keys(body)) {
      if (allowedUpdates.includes(key)) {
        updates[key] = body[key]
      }
    }

    // 3. Update the business. 
    // RLS will automatically ensure the user can only update a business they own.
    const { data: business, error: updateError } = await supabase
      .from('businesses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating business:', updateError)
      return NextResponse.json({ error: 'Failed to update business' }, { status: 500 })
    }

    return NextResponse.json({ business })
  } catch (err) {
    console.error('Update business error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

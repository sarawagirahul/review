import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // 1. Verify user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { googleLocationId, googlePlaceId, name, primaryCategory, addressLine1, city, state, pincode, primaryPhone, googleRating, googleReviewCount } = body

    if (!name) {
      return NextResponse.json({ error: 'Missing business name' }, { status: 400 })
    }

    // 2. Build review link using Google Place ID
    const reviewLink = googlePlaceId 
      ? `https://search.google.com/local/writereview?placeid=${googlePlaceId}`
      : ''

    // 3. Create business in Supabase
    // qr_slug is generated automatically by postgres gen_random_uuid()
    const { data: business, error: insertError } = await supabase
      .from('businesses')
      .insert({
        owner_id: user.id,
        google_location_id: googleLocationId,
        google_place_id: googlePlaceId,
        name,
        primary_category: primaryCategory,
        address_line1: addressLine1,
        city,
        state,
        pincode,
        primary_phone: primaryPhone,
        google_rating: googleRating,
        google_review_count: googleReviewCount,
        review_link: reviewLink,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting business:', insertError)
      return NextResponse.json({ error: 'Failed to create business' }, { status: 500 })
    }

    return NextResponse.json({ business })
  } catch (err) {
    console.error('Create business error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

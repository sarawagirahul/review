import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MOCK_REVIEWS = [
  { reviewer: 'Priya S.', rating: 5, text: 'Amazing food and service!', date: '2025-05-01' },
  { reviewer: 'Rahul M.', rating: 4, text: 'Great experience overall.', date: '2025-05-03' },
]

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('businesses')
      .select('google_place_id')
      .eq('id', id)
      .eq('owner_id', user.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const placeId = data?.google_place_id

    if (!placeId) {
      return NextResponse.json({
        reviews: MOCK_REVIEWS,
        lastSynced: new Date().toISOString(),
        mock: true,
      })
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        reviews: MOCK_REVIEWS,
        lastSynced: new Date().toISOString(),
        mock: true,
      })
    }

    const url = `https://places.googleapis.com/v1/places/${placeId}`
    const res = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'reviews,userRatingCount,rating',
      },
    })

    const placeData = await res.json()

    const mapped = (placeData.reviews ?? []).map((r: {
      authorAttribution?: { displayName?: string }
      rating?: number
      text?: { text?: string }
      publishTime?: string
    }) => ({
      reviewer: r.authorAttribution?.displayName ?? 'Anonymous',
      rating: r.rating ?? 0,
      text: r.text?.text ?? '',
      date: r.publishTime ?? '',
    }))

    return NextResponse.json({ reviews: mapped, lastSynced: new Date().toISOString() })
  } catch {
    return NextResponse.json({ reviews: [], error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

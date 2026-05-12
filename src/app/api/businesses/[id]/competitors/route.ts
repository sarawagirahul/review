import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const cache = new Map<string, { data: unknown; expires: number }>()

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const phi1 = lat1 * Math.PI / 180
  const phi2 = lat2 * Math.PI / 180
  const dphi = (lat2 - lat1) * Math.PI / 180
  const dlambda = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dphi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlambda / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const radius = searchParams.get('radius') || '500'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: businessData, error: bizError } = await supabase
      .from('businesses')
      .select('latitude, longitude, google_rating, primary_category')
      .eq('id', id)
      .eq('owner_id', user.id)
      .single()

    if (bizError || !businessData) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const lat = businessData.latitude
    const lng = businessData.longitude

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'no_location', message: 'Location data not available for this business' },
        { status: 200 }
      )
    }

    const cacheKey = `${id}:${radius}`
    const cached = cache.get(cacheKey)
    if (cached && cached.expires > Date.now()) {
      return NextResponse.json(cached.data)
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        competitors: [
          { name: "Sharma's Dhaba", rating: 4.1, reviewCount: 127, distance: 180, menuUrl: null },
          { name: "Royal Biryani House", rating: 4.4, reviewCount: 89, distance: 320, menuUrl: "https://example.com/menu" },
          { name: "Chai & Snacks", rating: 3.8, reviewCount: 203, distance: 450, menuUrl: null },
        ],
        areaAverage: 4.1,
        yourRating: businessData.google_rating,
        insights: [
          "Your rating beats 2 of 3 nearby competitors.",
          "Royal Biryani House has fewer reviews but higher rating — worth monitoring.",
          "Adding your menu to Google can improve discoverability."
        ],
        lastUpdated: new Date().toISOString()
      })
    }

    const searchRes = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.rating,places.userRatingCount,places.location,places.googleMapsUri',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationRestriction: {
          circle: { center: { latitude: lat, longitude: lng }, radiusInMeters: Number(radius) }
        },
        primaryType: businessData.primary_category || 'restaurant',
        maxResultCount: 20
      })
    })

    const searchData = await searchRes.json()

    const competitors = (searchData.places || []).map((p: {
      displayName?: { text?: string }
      rating?: number
      userRatingCount?: number
      location?: { latitude: number; longitude: number }
    }) => ({
      name: p.displayName?.text || 'Unknown',
      rating: p.rating ?? null,
      reviewCount: p.userRatingCount ?? null,
      distance: p.location ? Math.round(haversineDistance(lat, lng, p.location.latitude, p.location.longitude)) : null,
      menuUrl: null
    })).filter((c: { distance: number | null }) => c.distance !== null && c.distance > 5)

    const rated = competitors.filter((c: { rating: number | null }) => c.rating !== null)
    const areaAverage = rated.length > 0
      ? rated.reduce((sum: number, c: { rating: number }) => sum + c.rating, 0) / rated.length
      : null

    let insights: string[] = []

    try {
      const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
      const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })
      const topCompetitor = [...competitors].sort((a: { rating: number | null }, b: { rating: number | null }) => (b.rating || 0) - (a.rating || 0))[0]
      const prompt = `You are advising an Indian small business owner. Their business: "${businessData.primary_category || 'business'}" with rating ${businessData.google_rating || 'unknown'}. Area average rating: ${areaAverage ? areaAverage.toFixed(1) : 'unknown'}. Nearby competitors: ${competitors.length}. Top competitor has ${topCompetitor?.rating || 'unknown'} rating with ${topCompetitor?.reviewCount || 'unknown'} reviews. Give exactly 2-3 brief actionable insights for this business owner. Each insight must be under 15 words. Plain English, no markdown, no bullet points. Return each insight on a new line.`
      const result = await model.generateContent(prompt)
      insights = result.response.text().split('\n').filter(Boolean).slice(0, 3)
    } catch {
      insights = [
        "Encourage satisfied customers to leave reviews to grow your rating.",
        "Respond to all reviews promptly to build customer trust.",
        "Keep your business profile updated with photos and accurate hours."
      ]
    }

    const responseData = {
      competitors,
      areaAverage: areaAverage ? Math.round(areaAverage * 10) / 10 : null,
      yourRating: businessData.google_rating,
      insights,
      lastUpdated: new Date().toISOString()
    }

    cache.set(cacheKey, { data: responseData, expires: Date.now() + 3600000 })

    return NextResponse.json(responseData)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch competitors' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(_request: Request) {
  const supabase = await createClient()

  // Layer 1: Auth check
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Step 1: Get owner's active business IDs
    const { data: businessRows, error: bizError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .eq('is_active', true)

    if (bizError) {
      console.error('Error fetching businesses:', bizError)
      return NextResponse.json({ error: 'Failed to fetch overview' }, { status: 500 })
    }

    const businessIds: string[] = (businessRows ?? []).map((b: { id: string }) => b.id)

    // No active businesses — return zeroed stats immediately
    if (businessIds.length === 0) {
      return NextResponse.json({
        stats: {
          total_scans: 0,
          total_scans_prev: 0,
          review_clicks: 0,
          review_clicks_prev: 0,
          total_shield: 0,
          total_shield_prev: 0,
          unresolved_shield: 0,
          conversion_rate: 0,
          conversion_rate_prev: 0,
        },
        trend: [],
        businesses: [],
        recentActivity: [],
      })
    }

    // Step 2: Date boundaries
    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    // Step 3: Run all queries in parallel
    const [
      // A — current month scan count
      curScanRes,
      // A — current month review_clicked count
      curReviewRes,
      // B — previous month scan count
      prevScanRes,
      // B — previous month review_clicked count
      prevReviewRes,
      // C — current month private_feedback total + unresolved
      curShieldTotalRes,
      curShieldUnresolvedRes,
      // D — previous month private_feedback total
      prevShieldTotalRes,
      // E — 30-day trend raw events
      trendRes,
      // G — recent activity
      recentActivityRes,
    ] = await Promise.all([
      // A: current month scans
      serviceClient
        .from('review_events')
        .select('*', { count: 'exact', head: true })
        .in('business_id', businessIds)
        .eq('event_type', 'scan')
        .gte('created_at', firstOfMonth),

      // A: current month review clicks
      serviceClient
        .from('review_events')
        .select('*', { count: 'exact', head: true })
        .in('business_id', businessIds)
        .eq('event_type', 'review_clicked')
        .gte('created_at', firstOfMonth),

      // B: previous month scans
      serviceClient
        .from('review_events')
        .select('*', { count: 'exact', head: true })
        .in('business_id', businessIds)
        .eq('event_type', 'scan')
        .gte('created_at', firstOfLastMonth)
        .lt('created_at', firstOfMonth),

      // B: previous month review clicks
      serviceClient
        .from('review_events')
        .select('*', { count: 'exact', head: true })
        .in('business_id', businessIds)
        .eq('event_type', 'review_clicked')
        .gte('created_at', firstOfLastMonth)
        .lt('created_at', firstOfMonth),

      // C: current month private_feedback total
      serviceClient
        .from('private_feedback')
        .select('*', { count: 'exact', head: true })
        .in('business_id', businessIds)
        .gte('created_at', firstOfMonth),

      // C: current month private_feedback unresolved
      serviceClient
        .from('private_feedback')
        .select('*', { count: 'exact', head: true })
        .in('business_id', businessIds)
        .gte('created_at', firstOfMonth)
        .eq('is_resolved', false),

      // D: previous month private_feedback total
      serviceClient
        .from('private_feedback')
        .select('*', { count: 'exact', head: true })
        .in('business_id', businessIds)
        .gte('created_at', firstOfLastMonth)
        .lt('created_at', firstOfMonth),

      // E: 30-day trend raw events
      serviceClient
        .from('review_events')
        .select('created_at, event_type')
        .in('business_id', businessIds)
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: true }),

      // G: recent activity (last 15 events)
      serviceClient
        .from('review_events')
        .select('id, event_type, created_at, business_id, businesses(name, logo_url)')
        .in('business_id', businessIds)
        .order('created_at', { ascending: false })
        .limit(15),
    ])

    // Compute derived stats
    const total_scans = curScanRes.count ?? 0
    const total_scans_prev = prevScanRes.count ?? 0
    const review_clicks = curReviewRes.count ?? 0
    const review_clicks_prev = prevReviewRes.count ?? 0
    const total_shield = curShieldTotalRes.count ?? 0
    const total_shield_prev = prevShieldTotalRes.count ?? 0
    const unresolved_shield = curShieldUnresolvedRes.count ?? 0

    const conversion_rate =
      total_scans > 0 ? Math.round((review_clicks / total_scans) * 1000) / 10 : 0
    const conversion_rate_prev =
      total_scans_prev > 0 ? Math.round((review_clicks_prev / total_scans_prev) * 1000) / 10 : 0

    // Aggregate trend data in JS (query E)
    const trendMap = new Map<string, { scans: number; reviews: number }>()
    ;(trendRes.data ?? []).forEach((event: { created_at: string; event_type: string }) => {
      const date = event.created_at.split('T')[0]
      const entry = trendMap.get(date) ?? { scans: 0, reviews: 0 }
      if (event.event_type === 'scan') entry.scans++
      if (event.event_type === 'review_clicked') entry.reviews++
      trendMap.set(date, entry)
    })
    const trend = Array.from(trendMap.entries())
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Per-business stats (query F) — one Promise.all per business
    const businessStats = await Promise.all(
      businessIds.map(async (bizId: string) => {
        const [scanRes, reviewRes, shieldRes, bizRes] = await Promise.all([
          serviceClient
            .from('review_events')
            .select('*', { count: 'exact', head: true })
            .eq('business_id', bizId)
            .eq('event_type', 'scan')
            .gte('created_at', firstOfMonth),
          serviceClient
            .from('review_events')
            .select('*', { count: 'exact', head: true })
            .eq('business_id', bizId)
            .eq('event_type', 'review_clicked')
            .gte('created_at', firstOfMonth),
          serviceClient
            .from('private_feedback')
            .select('*', { count: 'exact', head: true })
            .eq('business_id', bizId)
            .eq('is_resolved', false),
          serviceClient
            .from('businesses')
            .select('id, name, city, logo_url, google_rating, total_scans')
            .eq('id', bizId)
            .single(),
        ])

        return {
          id: bizRes.data?.id as string,
          name: bizRes.data?.name as string,
          city: (bizRes.data?.city as string | null) ?? null,
          logo_url: (bizRes.data?.logo_url as string | null) ?? null,
          google_rating: (bizRes.data?.google_rating as number | null) ?? null,
          total_scans: (bizRes.data?.total_scans as number) ?? 0,
          month_scans: scanRes.count ?? 0,
          month_reviews: reviewRes.count ?? 0,
          unresolved_shield: shieldRes.count ?? 0,
        }
      })
    )

    // Shape recent activity (query G)
    type RecentActivityRow = {
      id: string
      event_type: string
      created_at: string
      business_id: string
      // Supabase returns foreign-key joins as arrays
      businesses: { name: string; logo_url: string | null }[] | null
    }

    const recentActivity = (recentActivityRes.data as RecentActivityRow[] ?? []).map(
      (row: RecentActivityRow) => {
        const biz = Array.isArray(row.businesses) ? row.businesses[0] : row.businesses
        return {
          id: row.id,
          event_type: row.event_type,
          created_at: row.created_at,
          business_id: row.business_id,
          business_name: biz?.name ?? '',
          logo_url: biz?.logo_url ?? null,
        }
      }
    )

    return NextResponse.json({
      stats: {
        total_scans,
        total_scans_prev,
        review_clicks,
        review_clicks_prev,
        total_shield,
        total_shield_prev,
        unresolved_shield,
        conversion_rate,
        conversion_rate_prev,
      },
      trend,
      businesses: businessStats,
      recentActivity,
    })
  } catch (err) {
    console.error('Dashboard overview error:', err)
    return NextResponse.json({ error: 'Failed to fetch overview' }, { status: 500 })
  }
}

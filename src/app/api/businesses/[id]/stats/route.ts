import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: businessId } = await params;

  try {
    const supabase = await createClient();

    // Fetch business with aggregate stats
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select(
        `
        id,
        name,
        total_scans,
        total_reviews,
        total_feedback,
        qr_slug,
        created_at
      `,
      )
      .eq("id", businessId)
      .single();

    if (businessError || !business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 },
      );
    }

    // Fetch events for last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const { data: events } = await supabase
      .from("review_events")
      .select("*")
      .eq("business_id", businessId)
      .gte("created_at", thirtyDaysAgo.toISOString());

    // Group events by date and type
    const eventsByDate: Record<string, Record<string, number>> = {};
    const eventCounts: Record<string, number> = {};

    events?.forEach((event: any) => {
      const date = new Date(event.created_at).toISOString().split("T")[0];
      const eventType = event.event_type;

      if (!eventsByDate[date]) {
        eventsByDate[date] = {};
      }
      eventsByDate[date][eventType] = (eventsByDate[date][eventType] || 0) + 1;
      eventCounts[eventType] = (eventCounts[eventType] || 0) + 1;
    });

    // Convert to array format for charts
    const chartData = Object.entries(eventsByDate).map(([date, counts]) => ({
      date,
      ...counts,
    }));

    // Fetch recent reviews
    const { data: reviews } = await supabase
      .from("reviews")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .limit(5);

    // Fetch recent feedback
    const { data: feedback } = await supabase
      .from("private_feedback")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .limit(5);

    return NextResponse.json({
      business,
      stats: {
        totalScans: business.total_scans || 0,
        totalReviews: business.total_reviews || 0,
        totalFeedback: business.total_feedback || 0,
        eventCounts,
        chartData,
      },
      recentReviews: reviews || [],
      recentFeedback: feedback || [],
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}

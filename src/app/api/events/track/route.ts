import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { businessId, eventType, event, rating, reviewIndex } = await req.json();
    const resolvedEventType = eventType || event;

    if (!businessId || !resolvedEventType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from("review_events").insert({
      business_id: businessId,
      event_type: resolvedEventType,
      rating: rating || null,
      review_index: reviewIndex || null,
      created_at: new Date(),
    });

    if (error) {
      console.error("Event tracking error:", error);
      return NextResponse.json(
        { error: "Failed to track event" },
        { status: 500 },
      );
    }

    if (resolvedEventType === "feedback_submitted") {
      await supabase
        .from("businesses")
        .update({
          total_feedback: supabase.rpc("increment_feedback"),
          updated_at: new Date(),
        })
        .eq("id", businessId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Event tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 },
    );
  }
}

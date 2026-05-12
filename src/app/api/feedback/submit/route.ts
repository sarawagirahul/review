import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { businessId, feedback, rating } = await req.json();

    if (!businessId || !feedback) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Fetch business and owner details
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select(
        `
        id,
        name,
        owner_id,
        users:owner_id(email, full_name),
        owner_details:owner_id(notification_email)
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

    // Save feedback to database
    const { error: feedbackError } = await supabase
      .from("private_feedback")
      .insert({
        business_id: businessId,
        message: feedback,
        rating: rating || null,
        created_at: new Date(),
      });

    if (feedbackError) {
      console.error("Feedback insertion error:", feedbackError);
      return NextResponse.json(
        { error: "Failed to save feedback" },
        { status: 500 },
      );
    }

    // Fire-and-forget shield catch notification
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/resend/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template: 'shield_catch',
        to: (business.owner_details as any)?.[0]?.notification_email || (business.users as any)?.[0]?.email,
        data: {
          ownerName: (business.users as any)?.[0]?.full_name || 'Business Owner',
          businessName: business.name,
          businessId: business.id,
          rating: rating,
          message: feedback,
          customerContact: undefined,
          appUrl: process.env.NEXT_PUBLIC_APP_URL,
        },
      }),
    }).catch(console.error)

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 },
    );
  }
}

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { businessId, consent } = await req.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, reason: "not_authenticated" });
    }

    const { data: latestReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("customer_id", user.id)
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (latestReview) {
      await supabase
        .from("reviews")
        .update({ marketing_consent: consent })
        .eq("id", latestReview.id);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}

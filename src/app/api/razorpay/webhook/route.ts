import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const supabase = await createClient();

    // Handle subscription events
    if (event.event === "subscription.activated") {
      const { subscription } = event.payload;

      // Find user by razorpay subscription ID
      const { data: ownerDetails } = await supabase
        .from("owner_details")
        .select("user_id")
        .eq("razorpay_subscription_id", subscription.entity.id)
        .single();

      if (ownerDetails) {
        // Update subscription status
        await supabase
          .from("owner_details")
          .update({
            subscription_status: "active",
            razorpay_subscription_id: subscription.entity.id,
          })
          .eq("user_id", ownerDetails.user_id);
      }
    } else if (
      event.event === "subscription.paused" ||
      event.event === "subscription.halted"
    ) {
      const { subscription } = event.payload;

      const { data: ownerDetails } = await supabase
        .from("owner_details")
        .select("user_id")
        .eq("razorpay_subscription_id", subscription.entity.id)
        .single();

      if (ownerDetails) {
        await supabase
          .from("owner_details")
          .update({
            subscription_status: event.event.includes("paused")
              ? "paused"
              : "past_due",
          })
          .eq("user_id", ownerDetails.user_id);
      }
    } else if (event.event === "subscription.cancelled") {
      const { subscription } = event.payload;

      const { data: ownerDetails } = await supabase
        .from("owner_details")
        .select("user_id")
        .eq("razorpay_subscription_id", subscription.entity.id)
        .single();

      if (ownerDetails) {
        await supabase
          .from("owner_details")
          .update({
            subscription_status: "cancelled",
          })
          .eq("user_id", ownerDetails.user_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

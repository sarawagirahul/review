import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    // Validate signature using RAZORPAY_WEBHOOK_SECRET
    const expectedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex");
    const incomingSig = request.headers.get("x-razorpay-signature");
    if (expectedSig !== incomingSig) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const supabase = await createClient();

    if (event.event === "subscription.activated") {
      const sub = event.payload.subscription.entity;
      const customerId = sub.customer_id;

      // Look up owner by razorpay_customer_id (available at activation time)
      const { data: od } = await supabase
        .from("owner_details")
        .select("user_id")
        .eq("razorpay_customer_id", customerId)
        .single();

      if (od) {
        // Determine billing interval from total_count
        const interval = sub.total_count === 1 ? "annual" : "monthly";

        await supabase
          .from("owner_details")
          .update({
            subscription_status: "active",
            razorpay_subscription_id: sub.id,
            subscription_interval: interval,
          })
          .eq("user_id", od.user_id);

        // Fetch owner info for email notification
        const { data: userRow } = await supabase
          .from("users")
          .select("email, full_name")
          .eq("id", od.user_id)
          .single();

        if (userRow?.email) {
          fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/resend/notify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              template: "subscription_activated",
              to: userRow.email,
              data: {
                ownerName: userRow.full_name ?? userRow.email,
                appUrl: process.env.NEXT_PUBLIC_APP_URL,
              },
            }),
          }).catch(console.error);
        }
      }
    } else if (event.event === "subscription.charged") {
      console.log(
        "Subscription charged:",
        event.payload.subscription.entity.id,
      );
      // No DB update needed
    } else if (event.event === "subscription.cancelled") {
      const sub = event.payload.subscription.entity;

      const { data: od } = await supabase
        .from("owner_details")
        .select("user_id")
        .eq("razorpay_subscription_id", sub.id)
        .single();

      if (od) {
        await supabase
          .from("owner_details")
          .update({ subscription_status: "cancelled" })
          .eq("user_id", od.user_id);

        const { data: userRow } = await supabase
          .from("users")
          .select("email, full_name")
          .eq("id", od.user_id)
          .single();

        if (userRow?.email) {
          fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/resend/notify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              template: "subscription_cancelled",
              to: userRow.email,
              data: {
                ownerName: userRow.full_name ?? userRow.email,
                appUrl: process.env.NEXT_PUBLIC_APP_URL,
              },
            }),
          }).catch(console.error);
        }
      }
    } else if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      const customerId = payment.customer_id;

      const { data: od } = await supabase
        .from("owner_details")
        .select("user_id")
        .eq("razorpay_customer_id", customerId)
        .single();

      if (od) {
        await supabase
          .from("owner_details")
          .update({ subscription_status: "past_due" })
          .eq("user_id", od.user_id);

        const { data: userRow } = await supabase
          .from("users")
          .select("email, full_name")
          .eq("id", od.user_id)
          .single();

        if (userRow?.email) {
          fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/resend/notify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              template: "payment_failed",
              to: userRow.email,
              data: {
                ownerName: userRow.full_name ?? userRow.email,
                appUrl: process.env.NEXT_PUBLIC_APP_URL,
              },
            }),
          }).catch(console.error);
        }
      }
    } else if (event.event === "subscription.halted") {
      const sub = event.payload.subscription.entity;

      const { data: od } = await supabase
        .from("owner_details")
        .select("user_id")
        .eq("razorpay_subscription_id", sub.id)
        .single();

      if (od) {
        await supabase
          .from("owner_details")
          .update({ subscription_status: "paused" })
          .eq("user_id", od.user_id);
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

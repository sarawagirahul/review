import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
  });
  try {
    const { planId, customerId, totalCount } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: "Missing plan ID" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user details
    const { data: ownerDetails } = await supabase
      .from("owner_details")
      .select("razorpay_customer_id")
      .eq("user_id", user.id)
      .single();

    let razorpayCustomerId = ownerDetails?.razorpay_customer_id;

    // Create customer if not exists
    if (!razorpayCustomerId) {
      const { data: userData } = await supabase
        .from("users")
        .select("email, full_name")
        .eq("id", user.id)
        .single();

      const customer = await razorpay.customers.create({
        email: userData?.email,
        name: userData?.full_name || "Customer",
      });

      razorpayCustomerId = customer.id;

      // Save customer ID
      await supabase
        .from("owner_details")
        .update({ razorpay_customer_id: razorpayCustomerId })
        .eq("user_id", user.id);
    }

    // Create subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      quantity: 1,
      total_count: totalCount || 12, // 12 months for annual, 1 for monthly
      addons: [],
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      shortUrl: subscription.short_url,
    });
  } catch (error) {
    console.error("Subscription creation error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 },
    );
  }
}

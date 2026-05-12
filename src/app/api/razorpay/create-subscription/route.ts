import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
  });
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();

    if (!plan || (plan !== "monthly" && plan !== "annual")) {
      return NextResponse.json({ error: "Missing or invalid plan" }, { status: 400 });
    }

    const planId =
      plan === "annual"
        ? process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_ANNUAL
        : process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_MONTHLY;

    if (!planId) {
      return NextResponse.json({ error: "Plan ID not configured" }, { status: 500 });
    }

    // Get or create Razorpay customer
    const { data: ownerDetails } = await supabase
      .from("owner_details")
      .select("razorpay_customer_id")
      .eq("user_id", user.id)
      .single();

    let razorpayCustomerId = ownerDetails?.razorpay_customer_id;

    // Fetch user details (needed for customer creation and notify_info)
    const { data: userData } = await supabase
      .from("users")
      .select("full_name, email, phone")
      .eq("id", user.id)
      .single();

    if (!razorpayCustomerId) {
      const customer = await razorpay.customers.create({
        name: userData?.full_name || "Customer",
        email: userData?.email,
        contact: userData?.phone,
      });

      razorpayCustomerId = customer.id;

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
      total_count: plan === "annual" ? 1 : 120,
      notify_info: {
        notify_phone: userData?.phone,
        notify_email: userData?.email,
      },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Subscription creation error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 },
    );
  }
}

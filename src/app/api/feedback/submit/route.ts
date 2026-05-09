import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
        feedback_text: feedback,
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

    // Send email to business owner
    const ownerEmail =
      (business.owner_details as any)?.[0]?.notification_email ||
      (business.users as any)?.[0]?.email;
    const ownerName =
      (business.users as any)?.[0]?.full_name || "Business Owner";

    if (ownerEmail) {
      try {
        await resend.emails.send({
          from: "JustHustle <noreply@justhustle.in>",
          to: ownerEmail,
          subject: `New Feedback for ${business.name} from JustHustle`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>New Private Feedback</h2>
              <p>Hi ${ownerName},</p>
              <p>You received new feedback from a customer on JustHustle:</p>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Rating:</strong> ${rating ? `${rating} stars` : "Not specified"}</p>
                <p><strong>Feedback:</strong></p>
                <p style="margin: 10px 0; line-height: 1.6;">${feedback}</p>
              </div>
              
              <p><a href="https://justhustle.in/dashboard/feedback" style="color: #6366f1;">View all feedback →</a></p>
              
              <p>Best regards,<br/>JustHustle Team</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't fail the API call if email fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 },
    );
  }
}

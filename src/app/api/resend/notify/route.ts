import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, type, data } = await req.json();

    if (!to || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    let subject = "";
    let html = "";

    switch (type) {
      case "trial_ending":
        subject = `Your JustHustle Trial Expires in ${data.daysRemaining} Days`;
        html = `
          <p>Hi ${data.businessOwnerName},</p>
          <p>Your JustHustle trial expires in <strong>${data.daysRemaining} days</strong>.</p>
          <p>Upgrade now to continue collecting authentic reviews from your customers.</p>
          <a href="https://justhustle.in/dashboard/billing" style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Upgrade Now</a>
        `;
        break;

      case "trial_expired":
        subject = "Your JustHustle Trial Has Expired";
        html = `
          <p>Hi ${data.businessOwnerName},</p>
          <p>Your trial has ended. Upgrade to a paid plan to keep collecting reviews.</p>
          <a href="https://justhustle.in/dashboard/billing" style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Upgrade Now</a>
        `;
        break;

      case "new_feedback":
        subject = `New Feedback for ${data.businessName}`;
        html = `
          <p>Hi ${data.businessOwnerName},</p>
          <p>New customer feedback received:</p>
          <div style="background-color: #f3f4f6; padding: 16px; border-left: 4px solid #6366f1; margin: 20px 0;">
            <p>"${data.feedback}"</p>
          </div>
          <a href="https://justhustle.in/dashboard/feedback" style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">View Feedback</a>
        `;
        break;

      case "payment_failed":
        subject = "Payment Failed - Action Required";
        html = `
          <p>Hi ${data.businessOwnerName},</p>
          <p>Your recent payment failed. Please update your payment method to avoid service interruption.</p>
          <a href="https://justhustle.in/dashboard/billing" style="display: inline-block; background-color: #f97316; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Update Payment</a>
        `;
        break;

      default:
        return NextResponse.json(
          { error: "Unknown email type" },
          { status: 400 },
        );
    }

    const result = await resend.emails.send({
      from: "JustHustle <noreply@justhustle.in>",
      to,
      subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f9fafb; padding: 40px 20px;">
            ${html}
            <p style="margin-top: 40px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              JustHustle | <a href="https://justhustle.in" style="color: #6366f1;">justhustle.in</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, messageId: result.data?.id });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}

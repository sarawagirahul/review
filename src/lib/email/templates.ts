export function TrialEndingEmail({
  businessOwnerName,
  daysRemaining,
}: {
  businessOwnerName: string;
  daysRemaining: number;
}) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #6366f1; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
      .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
      .button { display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin: 0; font-size: 24px;">Your Trial is Ending Soon</h1>
      </div>
      <div class="content">
        <p>Hi ${businessOwnerName},</p>
        <p>Your ReviewBoost trial expires in <strong>${daysRemaining} days</strong>.</p>
        <p>To continue collecting reviews from your customers, upgrade to a paid plan now. No credit card required to add a payment method.</p>
        <a href="https://reviewboost.in/dashboard/billing" class="button">Upgrade Now</a>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          Questions? Reply to this email or contact us at support@reviewboost.in
        </p>
      </div>
    </div>
  </body>
</html>
  `;
}

export function TrialExpiredEmail({
  businessOwnerName,
}: {
  businessOwnerName: string;
}) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #ef4444; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
      .content { background-color: #fef2f2; padding: 30px; border-radius: 0 0 8px 8px; }
      .button { display: inline-block; background-color: #ef4444; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin: 0; font-size: 24px;">Your Trial Has Expired</h1>
      </div>
      <div class="content">
        <p>Hi ${businessOwnerName},</p>
        <p>Your ReviewBoost trial has expired. To continue collecting customer reviews, please upgrade to a paid plan.</p>
        <p>Your QR codes are still valid, but customers will see a message when trying to submit reviews.</p>
        <a href="https://reviewboost.in/dashboard/billing" class="button">Upgrade Now</a>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          Need help choosing a plan? Contact us at support@reviewboost.in
        </p>
      </div>
    </div>
  </body>
</html>
  `;
}

export function NewFeedbackEmail({
  businessOwnerName,
  businessName,
  feedback,
}: {
  businessOwnerName: string;
  businessName: string;
  feedback: string;
}) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
      .content { background-color: #eff6ff; padding: 30px; border-radius: 0 0 8px 8px; }
      .feedback-box { background-color: white; padding: 16px; border-left: 4px solid #3b82f6; border-radius: 4px; margin: 20px 0; }
      .button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin: 0; font-size: 24px;">New Feedback for ${businessName}</h1>
      </div>
      <div class="content">
        <p>Hi ${businessOwnerName},</p>
        <p>You received new feedback from a customer on ReviewBoost:</p>
        <div class="feedback-box">
          <p style="margin: 0; color: #333; line-height: 1.6;">"${feedback}"</p>
        </div>
        <p>This feedback helps you understand how to improve your business. Check your ReviewBoost dashboard to see all feedback.</p>
        <a href="https://reviewboost.in/dashboard/feedback" class="button">View All Feedback</a>
      </div>
    </div>
  </body>
</html>
  `;
}

export function PaymentFailedEmail({
  businessOwnerName,
}: {
  businessOwnerName: string;
}) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #f97316; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
      .content { background-color: #fef3c7; padding: 30px; border-radius: 0 0 8px 8px; }
      .button { display: inline-block; background-color: #f97316; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin: 0; font-size: 24px;">Payment Failed</h1>
      </div>
      <div class="content">
        <p>Hi ${businessOwnerName},</p>
        <p>Your recent payment failed. Your subscription may be interrupted if the payment is not completed within 48 hours.</p>
        <p>Please update your payment method to continue using ReviewBoost without any interruption.</p>
        <a href="https://reviewboost.in/dashboard/billing" class="button">Update Payment Method</a>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          Questions? Contact us at support@reviewboost.in
        </p>
      </div>
    </div>
  </body>
</html>
  `;
}

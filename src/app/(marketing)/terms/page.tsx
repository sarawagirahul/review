import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Section } from "@/components/ui/Section";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-canvas">
        <Section className="pt-32 pb-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display tracking-tight text-ink mb-8">
              Terms of Service
            </h1>
            <p className="text-sm text-muted mb-6">Effective Date: May 2026</p>
            <p className="text-base text-muted mb-12 leading-relaxed">
              By using JustHustle, you agree to the following terms. Please read them carefully.
            </p>

            <div className="prose prose-sm prose-slate max-w-none flex flex-col gap-8 text-muted leading-relaxed">
              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-medium text-ink">1. Acceptance of Terms</h2>
                <p>
                  By creating an account or using our QR review flow, you agree to be bound by
                  these Terms and Conditions and our Privacy Policy.
                </p>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-medium text-ink">2. Description of Service</h2>
                <p>
                  JustHustle provides a professional reputation management tool for business owners
                  to collect authentic reviews for their Google Business Profiles. Our service
                  includes AI-assisted review generation, a private feedback channel for customer
                  service improvement, and analytics.
                </p>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-medium text-ink">3. Subscription and Payments</h2>
                <p>
                  <span className="font-medium text-ink">Billing:</span> Subscriptions are billed
                  through Razorpay on a monthly or annual basis.
                </p>
                <p>
                  <span className="font-medium text-ink">Refunds:</span> We offer a 7-day free
                  trial. Following the trial, payments are non-refundable unless required by
                  applicable local law.
                </p>
                <p>
                  <span className="font-medium text-ink">Cancellations:</span> You may cancel your
                  subscription at any time through your dashboard or by contacting support.
                </p>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-medium text-ink">4. Use of Google Business Profile</h2>
                <p>
                  JustHustle is an independent tool and is not affiliated with Google. We access
                  Google Business Profile data through official Google APIs using OAuth 2.0
                  authentication.
                </p>
                <p>
                  Users must comply with Google&apos;s Prohibited Content Policy and related platform
                  rules.
                </p>
                <p>
                  JustHustle strictly prohibits the use of our platform for generating fake reviews
                  or incentivizing reviews in violation of Google&apos;s terms.
                </p>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-medium text-ink">5. Private Feedback Channel</h2>
                <p>
                  The Private Feedback Channel is a customer service improvement tool. It does not
                  delete, suppress, or hide any existing Google reviews. It provides an alternative
                  private communication channel for customers who choose to share feedback directly
                  with the business.
                </p>
                <p>
                  Customers are always free to leave any review on Google, regardless of their
                  experience. The private feedback channel simply offers an additional way to
                  communicate concerns directly to the business owner.
                </p>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-medium text-ink">6. Google API Compliance</h2>
                <p>
                  JustHustle adheres to the Google API Services User Data Policy, including the
                  Limited Use requirements. We do not sell, transfer, or misuse Google API data.
                  You may revoke our API access at any time from your Google Account settings.
                </p>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-medium text-ink">7. Limitation of Liability</h2>
                <p>
                  JustHustle shall not be liable for any suspension of your Google Business Profile
                  or any loss of data resulting from the use of our services. You are responsible
                  for ensuring your review solicitation practices comply with Google policies, local
                  regulations, and industry rules applicable to your business.
                </p>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-medium text-ink">8. Governing Law</h2>
                <p>
                  These terms are governed by the laws of India. Any disputes arising out of or
                  related to these terms shall be subject to the exclusive jurisdiction of the
                  courts in Bengaluru, Karnataka.
                </p>
              </section>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}

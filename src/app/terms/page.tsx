import { Section } from "@/components/ui/Section";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <Section className="pt-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-display tracking-tight text-ink mb-8">Terms of Service</h1>
          <p className="text-sm text-muted mb-6">Effective Date: October 2023</p>
          <p className="text-base text-muted mb-12 leading-relaxed">
            By using ReviewBoost, you agree to the following terms. Please read them carefully.
          </p>

          <div className="prose prose-sm prose-slate max-w-none flex flex-col gap-8 text-muted leading-relaxed">
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-medium text-ink">1. Acceptance of Terms</h2>
              <p>
                By creating an account or using our QR review flow, you agree to be bound by these Terms
                and Conditions and our Privacy Policy.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-medium text-ink">2. Description of Service</h2>
              <p>
                ReviewBoost provides a management tool for business owners to solicit reviews for their
                Google Business Profiles. Our service includes AI review generation, a private feedback
                &quot;Shield&quot; for low ratings, and analytics.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-medium text-ink">3. Subscription and Payments</h2>
              <p>
                <span className="font-medium text-ink">Billing:</span> Subscriptions are billed through
                Razorpay on a monthly or annual basis.
              </p>
              <p>
                <span className="font-medium text-ink">Refunds:</span> We offer a 7-day free trial.
                Following the trial, payments are non-refundable unless required by applicable local law.
              </p>
              <p>
                <span className="font-medium text-ink">Cancellations:</span> You may cancel your
                subscription at any time through your dashboard or by contacting support if needed.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-medium text-ink">4. Use of Google Business Profile</h2>
              <p>ReviewBoost is an independent tool and is not affiliated with Google.</p>
              <p>Users must comply with Google&apos;s Prohibited Content Policy and related platform rules.</p>
              <p>
                ReviewBoost strictly prohibits the use of our platform for generating fake reviews or
                incentivizing reviews in violation of Google&apos;s terms.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-medium text-ink">5. Review Shield Disclaimer</h2>
              <p>
                Review Shield is a feedback management tool. It does not delete, suppress, or hide any
                existing Google reviews. It provides an alternative private communication channel for
                customers who choose to leave a low rating inside the ReviewBoost flow.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-medium text-ink">6. Limitation of Liability</h2>
              <p>
                ReviewBoost shall not be liable for any suspension of your Google Business Profile or any
                loss of data resulting from the use of our services. You are responsible for ensuring your
                review solicitation practices comply with Google policies, local regulations, and industry
                rules applicable to your business.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-medium text-ink">7. Governing Law</h2>
              <p>
                These terms are governed by the laws of India. Any disputes arising out of or related to
                these terms shall be subject to the exclusive jurisdiction of the courts in Bengaluru,
                Karnataka.
              </p>
            </section>
          </div>
        </div>
      </Section>
    </main>
  );
}

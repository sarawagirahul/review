import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Section } from "@/components/ui/Section";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — JustHustle",
  description:
    "JustHustle Terms of Service. Read the terms governing use of our professional reputation management platform by Goself Technologies.",
  alternates: {
    canonical: "https://justhustle.in/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-canvas">
        <Section className="pt-32 pb-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display font-normal tracking-tight text-ink mb-6">
              Terms of Service
            </h1>
            <p className="text-sm text-muted mb-2">Effective Date: 11 May 2026</p>
            <p className="text-sm text-muted mb-12">
              Goself Technologies &bull; Bengaluru, Karnataka 560001, India &bull;{" "}
              <a href="mailto:support@justhustle.in" className="underline hover:text-ink">
                support@justhustle.in
              </a>
            </p>

            <p className="text-base text-muted mb-12 leading-relaxed border-l-2 border-signature-forest pl-5 bg-surface-soft py-4 pr-4 rounded-r-xl">
              Please read these Terms of Service carefully before using JustHustle. By creating an
              account or using our platform, you agree to be bound by these terms. If you do not
              agree, do not use JustHustle.
            </p>

            <div className="flex flex-col gap-10 text-muted leading-relaxed">

              {/* 1 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">1. About JustHustle</h2>
                <p>
                  JustHustle is a professional reputation management software product operated by{" "}
                  <strong className="text-ink">Goself Technologies</strong>, a company registered in
                  Bengaluru, Karnataka, India. JustHustle helps Indian businesses manage their
                  Google Business Profile, collect authentic customer reviews, and respond
                  professionally to feedback — all through an official Google Business Profile API
                  integration.
                </p>
                <p>
                  JustHustle is not affiliated with, endorsed by, or in any way officially connected
                  to Google LLC or any of its subsidiaries or affiliates. &ldquo;Google Business
                  Profile&rdquo; and &ldquo;Google Maps&rdquo; are trademarks of Google LLC.
                </p>
              </section>

              {/* 2 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">2. Eligibility</h2>
                <p>
                  You must be at least 18 years old and have the legal authority to enter into a
                  binding agreement on behalf of a business to use JustHustle. By using JustHustle
                  as a business, you represent that you are authorised to act on behalf of that
                  business and bind it to these terms.
                </p>
              </section>

              {/* 3 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">3. Description of Services</h2>
                <p>JustHustle provides the following features to Business Owner subscribers:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-ink">Google Business Profile Integration</strong> —
                    connect your Google Business Profile via OAuth 2.0 to view and manage your
                    business locations, existing reviews, and business information
                  </li>
                  <li>
                    <strong className="text-ink">Review Collection Flow</strong> — a customised QR
                    code and link that guides satisfied customers (3+ stars) toward leaving a review
                    on Google
                  </li>
                  <li>
                    <strong className="text-ink">Review Shield (Private Feedback Channel)</strong> —
                    an optional private communication channel for customers who rate their experience
                    1–2 stars, allowing them to share feedback directly with you instead of
                    (or in addition to) posting publicly
                  </li>
                  <li>
                    <strong className="text-ink">AI Review Drafts</strong> — AI-generated review
                    options for customers to select and post, powered by the Google Gemini API
                  </li>
                  <li>
                    <strong className="text-ink">Analytics Dashboard</strong> — aggregated insights
                    into QR scan activity, review trends, and customer sentiment
                  </li>
                </ul>
              </section>

              {/* 4 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">4. Subscriptions and Payments</h2>

                <h3 className="font-semibold text-ink">4.1 Plans and Pricing</h3>
                <p>
                  JustHustle is available on a monthly subscription basis. Current pricing is listed
                  on our{" "}
                  <Link href="/#pricing" className="underline hover:text-ink">
                    Pricing page
                  </Link>
                  . Prices are in Indian Rupees (INR) and inclusive of applicable taxes.
                </p>

                <h3 className="font-semibold text-ink">4.2 Free Trial</h3>
                <p>
                  New accounts receive a 7-day free trial with access to all features. No credit
                  card is required to start the trial. At the end of the trial, continued access
                  requires a paid subscription.
                </p>

                <h3 className="font-semibold text-ink">4.3 Billing</h3>
                <p>
                  Subscriptions are billed monthly in advance through{" "}
                  <strong className="text-ink">Razorpay</strong>. By providing payment details, you
                  authorise us to charge the subscription fee on each billing date. Invoices are
                  emailed to your registered address.
                </p>

                <h3 className="font-semibold text-ink">4.4 Cancellation</h3>
                <p>
                  You may cancel your subscription at any time from the Billing section of your
                  dashboard or by contacting{" "}
                  <a href="mailto:support@justhustle.in" className="underline hover:text-ink">
                    support@justhustle.in
                  </a>
                  . Cancellation takes effect at the end of the current billing period. Access to
                  paid features continues until that date.
                </p>

                <h3 className="font-semibold text-ink">4.5 Refunds</h3>
                <p>
                  Payments are non-refundable except where required by applicable Indian consumer
                  protection law or in cases of duplicate billing or payment errors. To raise a
                  billing dispute, contact{" "}
                  <a href="mailto:support@justhustle.in" className="underline hover:text-ink">
                    support@justhustle.in
                  </a>{" "}
                  within 14 days of the charge.
                </p>

                <h3 className="font-semibold text-ink">4.6 Price Changes</h3>
                <p>
                  We will give at least 30 days&apos; notice before increasing subscription prices.
                  Continued use of JustHustle after a price change takes effect constitutes
                  acceptance of the new price.
                </p>
              </section>

              {/* 5 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">5. Google API and Platform Compliance</h2>

                <h3 className="font-semibold text-ink">5.1 Google Terms</h3>
                <p>
                  Your use of JustHustle&apos;s Google Business Profile features is additionally
                  subject to{" "}
                  <a
                    href="https://developers.google.com/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-ink"
                  >
                    Google&apos;s API Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://support.google.com/contributionpolicy/answer/7422880"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-ink"
                  >
                    Google&apos;s Review Content Policy
                  </a>
                  . You agree to comply with these policies at all times.
                </p>

                <h3 className="font-semibold text-ink">5.2 No Review Manipulation</h3>
                <p>You agree that you will not use JustHustle to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Generate, post, or solicit fake or inauthentic reviews</li>
                  <li>Offer incentives (gifts, discounts, payment) in exchange for positive reviews</li>
                  <li>Selectively invite only customers expected to leave positive reviews
                    (review gating)
                  </li>
                  <li>Suppress, delete, or hide negative reviews on Google</li>
                  <li>Post reviews on behalf of customers without their knowledge or consent</li>
                </ul>
                <p>
                  Violation of this clause may result in immediate account termination and may also
                  violate Google&apos;s platform policies, potentially resulting in consequences for
                  your Google Business Profile.
                </p>

                <h3 className="font-semibold text-ink">5.3 Review Shield Clarification</h3>
                <p>
                  The Review Shield / Private Feedback Channel feature provides customers who rate
                  their experience 1–2 stars with an <em>additional</em> option to send private
                  feedback directly to the business. It does not prevent these customers from also
                  posting a public review on Google. JustHustle does not delete, suppress, or modify
                  any reviews on Google.
                </p>
              </section>

              {/* 6 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">6. User Responsibilities</h2>
                <p>You are responsible for:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Maintaining the security of your JustHustle account credentials</li>
                  <li>
                    Ensuring that your use of JustHustle complies with applicable laws in India and
                    in the jurisdiction(s) where your business operates
                  </li>
                  <li>
                    The accuracy of your business information connected to JustHustle
                  </li>
                  <li>
                    Notifying us immediately at{" "}
                    <a href="mailto:support@justhustle.in" className="underline hover:text-ink">
                      support@justhustle.in
                    </a>{" "}
                    if you suspect unauthorised access to your account
                  </li>
                </ul>
              </section>

              {/* 7 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">7. Intellectual Property</h2>
                <p>
                  JustHustle, its logo, and all associated software, designs, and content are the
                  intellectual property of Goself Technologies. You are granted a limited,
                  non-exclusive, non-transferable licence to use JustHustle solely for your internal
                  business purposes.
                </p>
                <p>
                  You retain ownership of your business data (reviews, feedback, analytics) and may
                  export or request deletion at any time. By using JustHustle, you grant us a
                  limited licence to process and display your data as necessary to provide the
                  service.
                </p>
              </section>

              {/* 8 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">8. Service Availability and Changes</h2>
                <p>
                  We aim for high availability but do not guarantee uninterrupted access. We may
                  modify, suspend, or discontinue features with reasonable notice (minimum 30 days
                  for material changes that affect paid functionality, except where required for
                  legal or security reasons).
                </p>
              </section>

              {/* 9 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">9. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by applicable law, Goself Technologies shall not
                  be liable for:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Any suspension, removal, or penalisation of your Google Business Profile by
                    Google
                  </li>
                  <li>
                    Loss of reviews, ratings, or business standing on Google or any other platform
                  </li>
                  <li>Indirect, incidental, consequential, or punitive damages</li>
                  <li>
                    Loss of revenue, business, or goodwill resulting from use of our service
                  </li>
                </ul>
                <p>
                  Our aggregate liability for any claim under these Terms shall not exceed the total
                  subscription fees you paid to JustHustle in the 3 months preceding the claim.
                </p>
              </section>

              {/* 10 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">10. Termination</h2>
                <p>
                  We may terminate or suspend your account immediately if you violate these Terms,
                  particularly the review manipulation prohibitions in Section 5.2. You may
                  terminate your account at any time by cancelling your subscription and contacting
                  support for data deletion.
                </p>
                <p>
                  Upon termination, your right to access JustHustle ceases. We will delete your
                  data in accordance with our{" "}
                  <Link href="/privacy" className="underline hover:text-ink">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </section>

              {/* 11 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">11. Governing Law and Disputes</h2>
                <p>
                  These Terms are governed by the laws of India. Any disputes arising out of or
                  related to these Terms or the use of JustHustle shall be subject to the exclusive
                  jurisdiction of the courts in Bengaluru, Karnataka, India.
                </p>
                <p>
                  Before initiating legal proceedings, we request that you contact us at{" "}
                  <a href="mailto:support@justhustle.in" className="underline hover:text-ink">
                    support@justhustle.in
                  </a>{" "}
                  to attempt to resolve any dispute informally.
                </p>
              </section>

              {/* 12 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">12. Changes to These Terms</h2>
                <p>
                  We may update these Terms from time to time. We will notify you of material
                  changes by email at least 14 days before they take effect. Continued use of
                  JustHustle after the effective date constitutes acceptance of the revised Terms.
                </p>
              </section>

              {/* 13 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">13. Contact</h2>
                <div className="rounded-xl border border-hairline bg-surface-soft p-5 text-sm space-y-1">
                  <p className="font-semibold text-ink">Goself Technologies</p>
                  <p>Bengaluru, Karnataka 560001, India</p>
                  <p>
                    Email:{" "}
                    <a href="mailto:support@justhustle.in" className="underline hover:text-ink">
                      support@justhustle.in
                    </a>
                  </p>
                </div>
                <p className="text-sm">
                  These Terms were last updated on{" "}
                  <strong className="text-ink">11 May 2026</strong>.
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

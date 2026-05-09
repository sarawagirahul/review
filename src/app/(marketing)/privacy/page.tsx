import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Section } from "@/components/ui/Section";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-canvas">
        <Section className="pt-32 pb-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display tracking-tight text-ink mb-8">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted mb-6">Last updated: May 2026</p>
            <p className="text-base text-muted mb-12 leading-relaxed">
              JustHustle (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is a product of
              Goself, Bengaluru, Karnataka, India. We are committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and safeguard your information when
              you use our platform and services.
            </p>

            <div className="prose prose-sm prose-slate max-w-none flex flex-col gap-8 text-muted leading-relaxed">
              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-medium text-ink">1. Information We Collect</h2>
                <p>
                  <span className="font-medium text-ink">Account Information:</span> When you sign
                  up as a Business Owner, we collect your name, email address, and phone number via
                  Google OAuth 2.0.
                </p>
                <p>
                  <span className="font-medium text-ink">Google Business Profile Data:</span> With
                  your explicit consent, we access your Google Business Profile locations, reviews,
                  and basic account information through official Google APIs to provide our core
                  services. We do not store your Google password.
                </p>
                <p>
                  <span className="font-medium text-ink">Customer Interaction Data:</span> We
                  collect star ratings and private feedback submitted by end-users through your
                  unique QR code flow.
                </p>
                <p>
                  <span className="font-medium text-ink">Payment Information:</span> Payments are
                  processed securely through Razorpay. We do not store your credit card, bank, or
                  UPI details on our servers.
                </p>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-medium text-ink">2. How We Use Your Information</h2>
                <p>We use your information to operate and improve JustHustle, including:</p>
                <p>
                  To identify and link your Google Business locations to your JustHustle dashboard
                  via official Google APIs.
                </p>
                <p>
                  To generate AI-assisted review suggestions using the Gemini API. No personally
                  identifiable information is sent to the AI model unless required for the feature
                  being used.
                </p>
                <p>
                  To notify you of new reviews or private feedback through WhatsApp or email.
                </p>
                <p>
                  To provide analytics on review growth, scan activity, and customer sentiment.
                </p>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-medium text-ink">
                  3. Google API Disclosure (Limited Use Policy)
                </h2>
                <p>
                  JustHustle&apos;s use and transfer of information received from Google APIs to any
                  other app will adhere to the{" "}
                  <Link
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    className="underline"
                  >
                    Google API Services User Data Policy
                  </Link>
                  , including the Limited Use requirements.
                </p>
                <p>
                  <span className="font-medium text-ink">Limited Use Disclosure:</span> We do not
                  sell your Google data to third parties. We do not transfer Google API data except
                  as necessary to provide the JustHustle service. We do not use Google API data for
                  serving ads. We do not allow human access to Google API data except as necessary
                  to provide the service and only with your consent.
                </p>
                <p>
                  <span className="font-medium text-ink">OAuth 2.0:</span> We use OAuth 2.0 for all
                  Google API access. We never request, store, or have access to your Google
                  password. You can revoke our access at any time from your Google Account settings.
                </p>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-medium text-ink">4. Data Sharing and Third Parties</h2>
                <p>
                  <span className="font-medium text-ink">Google:</span> We share data with Google
                  APIs only to manage business profile information and related review workflows as
                  directed by the user.
                </p>
                <p>
                  <span className="font-medium text-ink">AI Services:</span> We use the Gemini API
                  to process review context and generate suggestions. Based on our current
                  implementation intent, no personally identifiable information should be sent to
                  the AI model unless required for the feature being used.
                </p>
                <p>
                  <span className="font-medium text-ink">Payments:</span> Transactional and
                  subscription data is shared with Razorpay to process billing securely.
                </p>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-medium text-ink">5. Data Retention</h2>
                <p>
                  We retain your information for as long as your account remains active or as
                  needed to provide the service. You may request deletion of your data at any time
                  by contacting{" "}
                  <Link href="mailto:support@justhustle.in" className="underline">
                    support@justhustle.in
                  </Link>
                  .
                </p>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-medium text-ink">6. Data Security</h2>
                <p>
                  All data is encrypted in transit (TLS 1.2+) and at rest. We use OAuth 2.0 for
                  Google API access and never store Google passwords. Access to production systems
                  is restricted and logged.
                </p>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-medium text-ink">7. Contact</h2>
                <p>
                  For any privacy-related questions or requests, contact us at{" "}
                  <Link href="mailto:support@justhustle.in" className="underline">
                    support@justhustle.in
                  </Link>
                  .
                </p>
                <p>
                  Goself<br />
                  Bengaluru, Karnataka, India
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

import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Section } from "@/components/ui/Section";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — JustHustle",
  description:
    "JustHustle Privacy Policy. Learn how Goself Technologies collects, uses, and protects your data, including our Google API Services User Data Policy disclosure.",
  alternates: {
    canonical: "https://justhustle.in/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-canvas">
        <Section className="pt-32 pb-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display font-normal tracking-tight text-ink mb-6">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted mb-2">Last updated: 11 May 2026</p>
            <p className="text-sm text-muted mb-12">
              Goself Technologies &bull; Bengaluru, Karnataka 560001, India &bull;{" "}
              <a href="mailto:support@justhustle.in" className="underline hover:text-ink">
                support@justhustle.in
              </a>
            </p>

            <p className="text-base text-muted mb-12 leading-relaxed border-l-2 border-signature-forest pl-5 bg-surface-soft py-4 pr-4 rounded-r-xl">
              JustHustle is a product of <strong className="text-ink">Goself Technologies</strong>,
              a software company registered in Bengaluru, Karnataka, India. This Privacy Policy
              describes how we collect, use, disclose, and safeguard information when you use our
              reputation management platform at{" "}
              <Link href="https://justhustle.in" className="underline hover:text-ink">
                justhustle.in
              </Link>
              .
            </p>

            <div className="flex flex-col gap-10 text-muted leading-relaxed">

              {/* 1 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">1. Information We Collect</h2>

                <h3 className="font-semibold text-ink">1.1 Account Information</h3>
                <p>
                  When you create a JustHustle account via Google OAuth 2.0, we receive your name,
                  email address, and profile picture from Google. We store these to identify your
                  account and send you service notifications.
                </p>

                <h3 className="font-semibold text-ink">1.2 Google Business Profile Data</h3>
                <p>
                  With your explicit authorisation during the Google OAuth consent flow, JustHustle
                  accesses the following data from the Google Business Profile API:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Your Google Business Profile locations (name, address, place ID)</li>
                  <li>Customer reviews posted on your Google Business Profile</li>
                  <li>Business category and operational status</li>
                </ul>
                <p>
                  We store this data in our database (hosted on Supabase/PostgreSQL within the EU)
                  solely to deliver the features you authorise. We never store your Google account
                  password.
                </p>

                <h3 className="font-semibold text-ink">1.3 Customer Interaction Data</h3>
                <p>
                  When your customers use your JustHustle review link or QR code, we collect:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Star ratings (1–5) submitted through our interface</li>
                  <li>Private feedback text if the customer chooses to leave one</li>
                  <li>Timestamp and QR scan events (no IP address stored)</li>
                </ul>

                <h3 className="font-semibold text-ink">1.4 Payment Information</h3>
                <p>
                  Subscription billing is processed by <strong className="text-ink">Razorpay</strong>.
                  We do not store credit card numbers, bank account details, or UPI credentials on
                  our servers. We receive only transaction status and subscription identifiers from
                  Razorpay.
                </p>

                <h3 className="font-semibold text-ink">1.5 Usage and Analytics Data</h3>
                <p>
                  We collect anonymised usage metrics (page views, feature usage counts) to improve
                  the service. We do not use third-party advertising trackers.
                </p>
              </section>

              {/* 2 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">2. How We Use Your Information</h2>
                <p>We use collected information strictly to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Authenticate you and link your Google Business Profile locations to your
                    JustHustle dashboard
                  </li>
                  <li>
                    Display your customer reviews inside the dashboard for monitoring and response
                  </li>
                  <li>
                    Generate AI-assisted review reply suggestions via the Google Gemini API (we send
                    only the review text — no personal identifiers)
                  </li>
                  <li>
                    Route low-star feedback (1–2 stars) to your private inbox instead of the public
                    Google flow
                  </li>
                  <li>
                    Send you service notifications (new reviews, trial expiry, billing events) by
                    email
                  </li>
                  <li>Provide anonymised analytics about QR scans and review activity</li>
                  <li>Comply with legal obligations</li>
                </ul>
                <p>
                  We do <strong className="text-ink">not</strong> use your data for advertising,
                  profiling, or selling to third parties.
                </p>
              </section>

              {/* 3 — Google API Disclosure — CRITICAL SECTION */}
              <section className="flex flex-col gap-4 rounded-2xl border-2 border-signature-forest/30 bg-signature-mint/10 p-6">
                <h2 className="text-2xl font-medium text-ink">
                  3. Google API Services — User Data Policy Disclosure
                </h2>
                <p className="font-medium text-ink">
                  This section constitutes our disclosure under the{" "}
                  <a
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    className="underline hover:text-signature-forest"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google API Services User Data Policy
                  </a>
                  , including the Limited Use requirements.
                </p>

                <h3 className="font-semibold text-ink">3.1 Scopes Requested</h3>
                <p>JustHustle requests the following OAuth 2.0 scopes from Google:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <code className="text-xs bg-surface-soft px-1.5 py-0.5 rounded">
                      https://www.googleapis.com/auth/business.manage
                    </code>{" "}
                    — to read and respond to reviews on your Google Business Profile
                  </li>
                  <li>
                    <code className="text-xs bg-surface-soft px-1.5 py-0.5 rounded">email</code>,{" "}
                    <code className="text-xs bg-surface-soft px-1.5 py-0.5 rounded">profile</code>{" "}
                    — to identify your account
                  </li>
                </ul>

                <h3 className="font-semibold text-ink">3.2 Limited Use Statement</h3>
                <p>
                  JustHustle&apos;s use and transfer to any other application of information
                  received from Google APIs will adhere to the Google API Services User Data Policy,
                  including the Limited Use requirements. Specifically:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-ink">We only use Google data to provide the service.</strong>{" "}
                    Data accessed via Google APIs is used exclusively to operate your JustHustle
                    dashboard — displaying your business profile, reviews, and enabling replies.
                  </li>
                  <li>
                    <strong className="text-ink">We do not sell Google API data.</strong> We never
                    sell, rent, or exchange information received from Google APIs with any third
                    party.
                  </li>
                  <li>
                    <strong className="text-ink">We do not use Google data for advertising.</strong>{" "}
                    Google API data is not used to target, personalise, or serve advertisements to
                    you or anyone else.
                  </li>
                  <li>
                    <strong className="text-ink">We do not transfer Google data for unrelated purposes.</strong>{" "}
                    Data received from Google APIs is not shared with or transferred to third parties
                    unless necessary to provide the JustHustle service (e.g., secure database
                    hosting), and only under confidentiality obligations equivalent to this policy.
                  </li>
                  <li>
                    <strong className="text-ink">We do not allow human access to Google data</strong>{" "}
                    except as necessary to provide the service, fix a bug you have reported, or as
                    required by applicable law.
                  </li>
                </ul>

                <h3 className="font-semibold text-ink">3.3 Revoking Google API Access</h3>
                <p>
                  You can revoke JustHustle&apos;s access to your Google account at any time by
                  visiting{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-signature-forest"
                  >
                    myaccount.google.com/permissions
                  </a>
                  . Revoking access will disconnect your Google Business Profile from JustHustle.
                  Your existing JustHustle account and any stored private feedback data will remain
                  until you request deletion.
                </p>

                <h3 className="font-semibold text-ink">3.4 OAuth 2.0 — No Password Storage</h3>
                <p>
                  All Google API access uses the OAuth 2.0 protocol. JustHustle never sees, stores,
                  or has access to your Google password at any time. We store only OAuth tokens
                  (access + refresh tokens) in encrypted form, which are used solely to make
                  authorised API requests on your behalf.
                </p>

                <h3 className="font-semibold text-ink">3.5 Review Content Policy Compliance</h3>
                <p>
                  JustHustle is designed to operate in full compliance with Google&apos;s{" "}
                  <strong className="text-ink">Review Content Guidelines</strong> and{" "}
                  <strong className="text-ink">Third-Party Policy</strong>. Our platform:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-ink">Does not engage in review gating.</strong> All
                    customers — regardless of their star rating — are invited to share their
                    experience. Low-star customers receive a private feedback channel as an
                    additional option, but are never blocked from posting publicly on Google.
                  </li>
                  <li>Does not incentivise, solicit, or pay for positive reviews</li>
                  <li>Does not generate or post reviews on behalf of users</li>
                  <li>
                    Does not use automated means to post reviews to Google (review posting is
                    performed manually by the end customer)
                  </li>
                </ul>
              </section>

              {/* 4 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">4. Data Sharing and Sub-processors</h2>
                <p>
                  We share data with the following third parties only as necessary to operate the
                  service:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-hairline">
                        <th className="text-left py-2 pr-4 font-semibold text-ink">Party</th>
                        <th className="text-left py-2 pr-4 font-semibold text-ink">Purpose</th>
                        <th className="text-left py-2 font-semibold text-ink">Data shared</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      <tr>
                        <td className="py-2 pr-4 font-medium text-ink">Supabase (PostgreSQL)</td>
                        <td className="py-2 pr-4">Database hosting</td>
                        <td className="py-2">Account, business, review data</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-ink">Google APIs</td>
                        <td className="py-2 pr-4">Business Profile access</td>
                        <td className="py-2">OAuth tokens, review data</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-ink">Google Gemini API</td>
                        <td className="py-2 pr-4">AI reply suggestions</td>
                        <td className="py-2">Review text only (no PII)</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-ink">Razorpay</td>
                        <td className="py-2 pr-4">Payment processing</td>
                        <td className="py-2">Name, email, subscription plan</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-ink">Resend</td>
                        <td className="py-2 pr-4">Transactional email</td>
                        <td className="py-2">Email address, notification content</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-ink">Vercel / Netlify</td>
                        <td className="py-2 pr-4">Application hosting</td>
                        <td className="py-2">HTTP request logs (anonymised)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  We do not sell your personal data to any third party. We do not share data with
                  data brokers, advertising networks, or analytics companies.
                </p>
              </section>

              {/* 5 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">5. Data Retention</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-ink">Account data</strong> is retained while your
                    account is active and for up to 90 days after cancellation.
                  </li>
                  <li>
                    <strong className="text-ink">Review and feedback data</strong> is retained
                    while your account is active unless you request earlier deletion.
                  </li>
                  <li>
                    <strong className="text-ink">Google OAuth tokens</strong> are retained as long
                    as your account is connected to Google. They are deleted immediately upon
                    disconnection or account deletion.
                  </li>
                  <li>
                    <strong className="text-ink">Payment records</strong> are retained for 7 years
                    as required under the Indian Income Tax Act.
                  </li>
                </ul>
              </section>

              {/* 6 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">6. Data Security</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>All data in transit is encrypted using TLS 1.2 or higher</li>
                  <li>Data at rest is encrypted using AES-256</li>
                  <li>OAuth tokens are stored in encrypted form and never logged</li>
                  <li>
                    Production database access is restricted to service accounts with minimum
                    required privileges
                  </li>
                  <li>
                    Security incidents will be disclosed to affected users within 72 hours where
                    required by applicable law
                  </li>
                </ul>
              </section>

              {/* 7 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">7. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-ink">Access</strong> — request a copy of the personal
                    data we hold about you
                  </li>
                  <li>
                    <strong className="text-ink">Correction</strong> — request correction of
                    inaccurate or incomplete data
                  </li>
                  <li>
                    <strong className="text-ink">Deletion</strong> — request deletion of your
                    personal data (subject to legal retention requirements)
                  </li>
                  <li>
                    <strong className="text-ink">Portability</strong> — request an export of your
                    data in a machine-readable format
                  </li>
                  <li>
                    <strong className="text-ink">Revocation</strong> — revoke Google API access at
                    any time via{" "}
                    <a
                      href="https://myaccount.google.com/permissions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-ink"
                    >
                      myaccount.google.com/permissions
                    </a>
                  </li>
                </ul>
                <p>
                  To exercise any of these rights, email{" "}
                  <a href="mailto:support@justhustle.in" className="underline hover:text-ink">
                    support@justhustle.in
                  </a>{" "}
                  with subject line &ldquo;Data Request&rdquo;. We will respond within 30 days.
                </p>
              </section>

              {/* 8 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">8. Cookies</h2>
                <p>
                  JustHustle uses essential session cookies only — necessary for authentication and
                  security. We do not use advertising cookies, cross-site tracking cookies, or
                  third-party analytics cookies.
                </p>
              </section>

              {/* 9 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">9. Children&apos;s Privacy</h2>
                <p>
                  JustHustle is a business software tool not intended for use by persons under the
                  age of 18. We do not knowingly collect personal information from minors.
                </p>
              </section>

              {/* 10 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">10. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of
                  material changes by email or by a prominent notice in the dashboard. Continued use
                  of JustHustle after changes take effect constitutes acceptance of the revised
                  policy.
                </p>
              </section>

              {/* 11 */}
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium text-ink">11. Contact Us</h2>
                <p>
                  For privacy-related questions, data requests, or concerns about this policy,
                  contact our Data Privacy team:
                </p>
                <div className="rounded-xl border border-hairline bg-surface-soft p-5 text-sm space-y-1">
                  <p className="font-semibold text-ink">Goself Technologies</p>
                  <p>Bengaluru, Karnataka 560001, India</p>
                  <p>
                    Email:{" "}
                    <a href="mailto:support@justhustle.in" className="underline hover:text-ink">
                      support@justhustle.in
                    </a>
                  </p>
                  <p className="pt-2 text-xs text-muted">
                    Subject: &ldquo;Privacy Request&rdquo; or &ldquo;Data Request&rdquo;
                  </p>
                </div>
                <p className="text-sm">
                  This policy was last updated on <strong className="text-ink">11 May 2026</strong>.
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

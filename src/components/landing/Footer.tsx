import Link from "next/link";
import { Shield, MapPin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid gap-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signature-forest">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-xl font-semibold text-ink">
                Just<span className="text-signature-forest">Hustle</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-muted">
              Professional reputation management for Indian businesses. Collect authentic reviews,
              manage feedback, and grow your online presence transparently.
            </p>
            <div className="mt-4 space-y-2 text-sm text-muted">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                <span>
                  Goself<br />
                  Bengaluru, Karnataka, India
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-ink" />
                <a href="mailto:support@justhustle.in" className="hover:text-ink">
                  support@justhustle.in
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-ink">Product</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <Link href="#features" className="hover:text-ink">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-ink">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-ink">
                  How it works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-ink">Company</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <Link href="/about" className="hover:text-ink">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-ink">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-ink">Legal</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <Link href="/privacy" className="hover:text-ink">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-ink">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="mt-12 rounded-2xl bg-surface-soft p-6 border border-hairline">
          <div className="grid gap-6 md:grid-cols-3 text-sm text-muted">
            <div>
              <p className="mb-1 font-medium text-ink">Developer</p>
              <p>
                JustHustle is developed and maintained by{" "}
                <span className="font-medium text-ink">Goself</span>, Bengaluru, Karnataka, India.
              </p>
            </div>
            <div>
              <p className="mb-1 font-medium text-ink">Data Security</p>
              <p>
                We use OAuth 2.0 for Google API access. We never store your Google password. All
                data is encrypted in transit and at rest.
              </p>
            </div>
            <div>
              <p className="mb-1 font-medium text-ink">Compliance</p>
              <p>
                We adhere to the Google API Services User Data Policy, including Limited Use
                requirements. We do not sell your data.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-hairline pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Goself. All rights reserved. JustHustle is a product
            of Goself.
          </p>
          <p className="text-xs text-muted">
            JustHustle is not affiliated with Google. Google Business Profile is a trademark of
            Google LLC.
          </p>
        </div>
      </div>
    </footer>
  );
}

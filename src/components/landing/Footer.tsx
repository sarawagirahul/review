import Link from "next/link";
import { Shield, MapPin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-night pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid gap-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-night-accent">
                <Shield className="h-4 w-4 text-night" />
              </div>
              <span className="font-display text-xl font-semibold text-night-text">
                Just<span className="text-night-accent">Hustle</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-night-muted">
              Google review collection software for Indian businesses. Powered by Google Places API.
            </p>
            <div className="mt-4 space-y-2 text-sm text-night-muted">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-night-subtle" />
                <span>
                  Goself Technologies<br />
                  Bengaluru, Karnataka 560001<br />
                  India
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-night-subtle" />
                <a href="mailto:support@justhustle.in" className="transition-colors hover:text-night-text">
                  support@justhustle.in
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-night-text">Product</h4>
            <ul className="space-y-3 text-sm text-night-muted">
              <li><Link href="#features" className="transition-colors hover:text-night-text">Features</Link></li>
              <li><Link href="#pricing" className="transition-colors hover:text-night-text">Pricing</Link></li>
              <li><Link href="#how-it-works" className="transition-colors hover:text-night-text">How it works</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-night-text">Company</h4>
            <ul className="space-y-3 text-sm text-night-muted">
              <li><Link href="/about" className="transition-colors hover:text-night-text">About Us</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-night-text">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-night-text">Legal</h4>
            <ul className="space-y-3 text-sm text-night-muted">
              <li><Link href="/privacy" className="transition-colors hover:text-night-text">Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-night-text">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Google API Trust Block */}
        <div className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
          <div className="grid gap-6 text-sm text-night-muted md:grid-cols-3">
            <div>
              <p className="mb-1 font-medium text-night-text">Developer & Publisher</p>
              <p>
                JustHustle is developed and operated by{" "}
                <span className="font-medium text-night-text">Goself Technologies</span>,
                Bengaluru, Karnataka, India.
                Contact: <a href="mailto:support@justhustle.in" className="text-night-accent hover:underline">support@justhustle.in</a>
              </p>
            </div>
            <div>
              <p className="mb-1 font-medium text-night-text">Google API Data Use</p>
              <p>
                JustHustle uses Google Places API to fetch business information and Google OAuth 2.0 for secure owner sign-in.
                We use this data solely to provide the service features you authorise. We do not sell, share, or use Google user data for advertising.
                See our <Link href="/privacy" className="text-night-accent hover:underline">Privacy Policy</Link> for the full Google API Services disclosure.
              </p>
            </div>
            <div>
              <p className="mb-1 font-medium text-night-text">Compliance</p>
              <p>
                JustHustle complies with the{" "}
                <span className="font-medium text-night-text">Google API Services User Data Policy</span>{" "}
                including Limited Use requirements. Our platform does not engage in review gating and strictly adheres to Google&apos;s{" "}
                <span className="font-medium text-night-text">Review Content Guidelines</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-sm text-night-subtle">
            &copy; {new Date().getFullYear()} Goself Technologies. All rights reserved. JustHustle is a product of Goself Technologies.
          </p>
          <p className="text-center text-xs text-night-subtle sm:text-right">
            JustHustle is not affiliated with Google LLC. &ldquo;Google Business Profile&rdquo; is a trademark of Google LLC.
            Use of Google APIs is subject to Google&apos;s{" "}
            <a href="https://developers.google.com/terms" className="hover:text-night-text underline" target="_blank" rel="noopener noreferrer">Terms of Service</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}

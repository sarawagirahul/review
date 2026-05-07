import Link from "next/link";
import { Star } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid gap-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Star className="h-4 w-4 fill-white text-white" />
              </div>
              <span className="font-display text-xl font-semibold text-ink">
                ReviewBoost
              </span>
            </Link>
            <p className="max-w-xs text-sm text-muted">
              The easiest way for Indian businesses to collect 5-star Google reviews and manage their online reputation.
            </p>
          </div>
          
          <div>
            <h4 className="mb-4 font-medium text-ink">Product</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><Link href="#features" className="hover:text-ink">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-ink">Pricing</Link></li>
              <li><Link href="#how-it-works" className="hover:text-ink">How it works</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 font-medium text-ink">Company</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><Link href="/about" className="hover:text-ink">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-ink">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 font-medium text-ink">Legal</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><Link href="/privacy" className="hover:text-ink">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-ink">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 border-t border-hairline pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} ReviewBoost. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

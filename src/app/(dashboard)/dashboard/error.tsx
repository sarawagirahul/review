"use client";

import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ reset }: ErrorProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-canvas text-center px-4">
      <div className="rounded-2xl border border-hairline bg-canvas p-10 max-w-md w-full shadow-sm">
        <h2 className="text-xl font-semibold text-ink mb-2">Something went wrong</h2>
        <p className="text-muted text-sm mb-6">
          Something went wrong loading your dashboard. Try refreshing.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-lg bg-signature-forest text-white font-medium hover:bg-signature-forest/90 transition-colors cursor-pointer text-sm"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg border border-hairline text-muted hover:text-ink hover:border-ink/20 transition-colors text-sm"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

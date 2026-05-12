"use client";

import Link from "next/link";

interface ErrorProps {
  reset: () => void;
}

export default function ReviewPageError({ reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#fffaf7] text-center px-4">
      <div className="rounded-2xl border border-[#f0e8e0] bg-white p-10 max-w-sm w-full shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Page couldn&#39;t load</h2>
        <p className="text-gray-500 text-sm mb-6">
          This review page couldn&#39;t load. Scan the QR code again.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-lg bg-[#E68369] text-white font-medium hover:bg-[#d4705a] transition-colors cursor-pointer text-sm"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-night px-6 text-center">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-night-accent/[0.06] blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#8b5cf6]/[0.05] blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <span
          className="text-8xl font-bold leading-none md:text-9xl"
          style={{
            background: "linear-gradient(135deg, #E68369 0%, #22c55e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </span>

        <h1 className="text-3xl font-bold text-night-text">Page not found</h1>

        <p className="max-w-sm text-night-muted">
          The page you&#39;re looking for doesn&#39;t exist or has been moved.
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-night-accent px-7 py-3.5 font-semibold text-night hover:bg-night-accent-hover transition-colors cursor-pointer"
          >
            Go Home
          </Link>
          <button
            onClick={() => router.back()}
            className="rounded-full border border-white/[0.12] bg-white/[0.05] px-7 py-3.5 font-semibold text-night-text hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}

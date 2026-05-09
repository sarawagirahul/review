"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X } from "lucide-react";

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#trust", label: "Trust & Security" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ zIndex: 100 }}
        className={`fixed inset-x-0 top-0 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-lg border-b border-hairline shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 md:px-12">
          <Link href="/" className="group flex items-center gap-2.5">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-signature-forest"
            >
              <Shield className="h-4 w-4 text-white" />
            </motion.div>
            <span className="font-display text-lg font-semibold tracking-tight text-ink">
              Just<span className="text-signature-forest">Hustle</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-muted transition-colors duration-200 hover:text-ink"
              >
                <span className="group">
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-signature-forest transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              Log in
            </Link>
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-lg bg-signature-forest px-4 py-2 text-sm font-medium text-white transition-shadow hover:shadow-lg"
            >
              Start free trial
            </motion.a>
          </div>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-white md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4 text-ink" /> : <Menu className="h-4 w-4 text-ink" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 top-20 z-[99] rounded-2xl bg-white p-6 shadow-xl border border-hairline md:hidden"
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base text-muted hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-3 border-t border-hairline pt-4">
                <Link href="/login" className="text-sm text-muted">Log in</Link>
                <a
                  href="#pricing"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-signature-forest py-2.5 text-center text-sm font-medium text-white"
                >
                  Start free trial
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

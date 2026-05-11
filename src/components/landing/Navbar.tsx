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
            ? "bg-night/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_1px_0_rgba(255,255,255,0.04)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 md:px-12">
          <Link href="/" className="group flex items-center gap-2.5">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 4 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-night-accent"
            >
              <Shield className="h-4 w-4 text-night" />
            </motion.div>
            <span className="font-display text-lg font-semibold tracking-tight text-night-text">
              Just<span className="text-night-accent">Hustle</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-night-muted transition-colors duration-200 hover:text-night-text"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="text-sm text-night-muted transition-colors hover:text-night-text"
            >
              Log in
            </Link>
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full bg-night-accent px-5 py-2 text-sm font-semibold text-night transition-all hover:bg-night-accent-hover"
            >
              Start free trial
            </motion.a>
          </div>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.05] md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-4 w-4 text-night-text" />
            ) : (
              <Menu className="h-4 w-4 text-night-text" />
            )}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-x-4 top-20 z-[99] rounded-2xl bg-night-card border border-white/[0.1] p-6 shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base text-night-muted hover:text-night-text"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-3 border-t border-white/[0.08] pt-4">
                <Link href="/login" className="text-sm text-night-muted">
                  Log in
                </Link>
                <a
                  href="#pricing"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-night-accent py-2.5 text-center text-sm font-semibold text-night"
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

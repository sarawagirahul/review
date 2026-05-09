"use client";

import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { MessageCircle, Share2 } from "lucide-react";
import { useEffect } from "react";

interface ThankYouScreenProps {
  businessName: string;
  businessInstagram?: string;
  businessWhatsapp?: string;
}

export function ThankYouScreen({
  businessName,
  businessInstagram,
  businessWhatsapp,
}: ThankYouScreenProps) {
  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="rounded-2xl bg-gradient-to-br from-primary/10 to-signature-cream/50 border-2 border-primary/20 p-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <div className="text-6xl mb-6">✨</div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-display font-semibold text-ink mb-3"
      >
        Thank You! 🙏
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-muted mb-8"
      >
        Your review has been posted to Google.
        <br />
        Thank you for supporting {businessName}!
      </motion.p>

      {/* Social CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
      >
        {businessInstagram && (
          <a
            href={businessInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:opacity-90 transition"
          >
            <Share2 className="w-4 h-4" />
            Follow on Instagram
          </a>
        )}
        {businessWhatsapp && (
          <a
            href={businessWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-500 text-white font-medium hover:opacity-90 transition"
          >
            <MessageCircle className="w-4 h-4" />
            Contact on WhatsApp
          </a>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-muted"
      >
        <p>Share your experience with friends and family!</p>
      </motion.div>
    </motion.div>
  );
}

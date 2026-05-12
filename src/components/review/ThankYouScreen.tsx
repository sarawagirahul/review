"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Clipboard, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";

interface ThankYouScreenProps {
  businessName: string;
  businessId: string;
  businessInstagram?: string;
  businessWhatsapp?: string;
  type?: "review" | "feedback";
}

export function ThankYouScreen({
  businessName,
  businessId,
  businessInstagram,
  businessWhatsapp,
  type = "review",
}: ThankYouScreenProps) {
  const [marketingConsent, setMarketingConsent] = useState(false);

  const handleConsentChange = (checked: boolean) => {
    setMarketingConsent(checked);
    if (checked) {
      fetch("/api/reviews/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, consent: true }),
      }).catch(() => {});
    }
  };

  if (type === "feedback") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="rounded-2xl bg-gradient-to-br from-accent-light to-canvas-warm border border-accent/20 p-10 text-center"
      >
        <div className="text-5xl mb-4">🙏</div>
        <h2 className="text-2xl font-semibold text-ink mb-3">
          Thank you for letting us know.
        </h2>
        <p className="text-base text-muted">
          The team at{" "}
          <span className="font-medium text-ink">{businessName}</span> will
          review your feedback and follow up with you.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="rounded-2xl bg-gradient-to-br from-accent-light to-canvas-warm border border-accent/20 p-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="text-5xl mb-3"
      >
        ✨
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-semibold text-ink mb-4"
      >
        Thank You! 🙏
      </motion.h2>

      {/* Paste instruction box */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-accent-light border border-accent/30 rounded-xl p-4 my-4 text-left flex gap-3 items-start"
      >
        <Clipboard className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-ink">Your review is copied!</p>
          <p className="text-sm text-ink mt-0.5">
            Switch to Google and paste it → tap Submit to publish ✅
          </p>
        </div>
      </motion.div>

      {/* Marketing consent */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="my-4"
      >
        <label className="flex items-start gap-3 cursor-pointer text-left">
          <Checkbox
            checked={marketingConsent}
            onCheckedChange={(checked) =>
              handleConsentChange(checked as boolean)
            }
            className="mt-0.5"
          />
          <span className="text-sm text-muted">
            Get exclusive offers and updates from{" "}
            <span className="text-ink font-medium">{businessName}</span>
          </span>
        </label>
      </motion.div>

      {/* Social CTAs */}
      {(businessInstagram || businessWhatsapp) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mt-4"
        >
          {businessInstagram && (
            <a
              href={businessInstagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:opacity-90 transition cursor-pointer"
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
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-500 text-white font-medium hover:opacity-90 transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              Contact on WhatsApp
            </a>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

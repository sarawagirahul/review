"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

interface PrivateFeedbackFormProps {
  businessName: string;
  businessId: string;
  onSubmit: (feedback: string) => Promise<void>;
}

export function PrivateFeedbackForm({
  businessName,
  businessId,
  onSubmit,
}: PrivateFeedbackFormProps) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(feedback);
      setSubmitted(true);
      setFeedback("");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border-2 border-green-200 bg-green-50 p-8 text-center"
      >
        <h3 className="text-xl font-semibold text-green-900 mb-2">
          Thank You! 🙏
        </h3>
        <p className="text-green-700">
          We've received your feedback and will share it with {businessName}.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border-2 border-signature-coral/30 bg-signature-coral/5 p-8"
    >
      <div className="flex gap-3 mb-6">
        <AlertCircle className="w-5 h-5 text-signature-coral flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-ink mb-1">
            Share Private Feedback
          </h3>
          <p className="text-sm text-muted">
            We want to help {businessName} improve. Your feedback will be shared
            privately with their team.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us what could be improved..."
          className="w-full min-h-[120px] p-4 rounded-lg border border-hairline bg-white text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          disabled={isSubmitting}
        />

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={!feedback.trim() || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

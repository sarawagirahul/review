"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

interface PrivateFeedbackFormProps {
  businessName: string;
  businessId: string;
  rating: number;
  onSubmit: (feedback: string) => Promise<void>;
}

export function PrivateFeedbackForm({
  businessName,
  rating,
  onSubmit,
}: PrivateFeedbackFormProps) {
  const [mode, setMode] = useState<"own" | "ai">("own");
  const [feedback, setFeedback] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const generateAIFeedback = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          businessName,
          language: "english",
          type: "feedback",
        }),
      });
      const data = await response.json();
      if (data.reviews && data.reviews.length > 0) {
        setFeedback(data.reviews[0]);
      }
    } catch {
      // silent fail
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(feedback);
      setSubmitted(true);
      setFeedback("");
    } catch {
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
        className="rounded-2xl border border-accent/20 bg-accent-light p-8 text-center"
      >
        <h3 className="text-xl font-semibold text-ink mb-2">Thank You! 🙏</h3>
        <p className="text-muted">
          We&apos;ve shared your feedback with {businessName}.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-accent/20 bg-accent-light/40 p-6"
    >
      <div className="flex gap-3 mb-5">
        <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-ink mb-1">Share Private Feedback</h3>
          <p className="text-sm text-muted">
            We&apos;re sorry to hear that. Your feedback will be shared privately with{" "}
            {businessName}.
          </p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("own")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            mode === "own"
              ? "bg-accent text-white"
              : "bg-white text-muted border border-hairline hover:bg-surface-soft"
          }`}
        >
          Write my own
        </button>
        <button
          onClick={() => setMode("ai")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            mode === "ai"
              ? "bg-accent text-white"
              : "bg-white text-muted border border-hairline hover:bg-surface-soft"
          }`}
        >
          Help me write it
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "ai" && !feedback && (
          <div className="text-center py-4">
            <Button
              type="button"
              onClick={generateAIFeedback}
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        )}

        {(mode === "own" || (mode === "ai" && feedback)) && (
          <div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what could be improved..."
              className="w-full min-h-[120px] p-4 rounded-lg border border-hairline bg-white text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
              disabled={isSubmitting}
            />
            {mode === "ai" && (
              <button
                type="button"
                onClick={generateAIFeedback}
                disabled={isGenerating}
                className="mt-1 text-sm text-accent underline cursor-pointer"
              >
                {isGenerating ? "Regenerating..." : "Regenerate"}
              </button>
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={!feedback.trim() || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Sending..." : `Send to ${businessName}`}
        </Button>
      </form>
    </motion.div>
  );
}

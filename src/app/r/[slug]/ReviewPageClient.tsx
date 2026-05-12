"use client";

import { AIReviewCards } from "@/components/review/AIReviewCards";
import { PrivateFeedbackForm } from "@/components/review/PrivateFeedbackForm";
import { StarRating } from "@/components/review/StarRating";
import { ThankYouScreen } from "@/components/review/ThankYouScreen";
import { createBrowserClient } from "@supabase/ssr";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type ReviewPageStep = "rating" | "ai-review" | "private-feedback" | "thank-you";

type Language = "english" | "hindi" | "hinglish";

interface ReviewPageClientProps {
  business: {
    id: string;
    name: string;
    logo_url?: string;
    qr_slug: string;
    google_place_id?: string;
    review_link?: string;
    city?: string;
    review_page_tagline?: string;
    review_page_thank_you_message?: string;
    social_instagram?: string;
    social_whatsapp?: string;
  };
}

export function ReviewPageClient({ business }: ReviewPageClientProps) {
  const [step, setStep] = useState<ReviewPageStep>("rating");
  const [rating, setRating] = useState(0);
  const [language, setLanguage] = useState<Language>("english");
  const [aiReviews, setAiReviews] = useState<string[]>([]);
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const REVIEW_SHIELD_THRESHOLD = 3;

  useEffect(() => {
    fetch('/api/events/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessId: business.id,
        eventType: 'scan'
      })
    }).catch(() => {})
  }, [business.id])

  // Handle star rating selection
  const handleRating = (value: number) => {
    setRating(value);

    if (value < REVIEW_SHIELD_THRESHOLD) {
      // Show private feedback form for low ratings
      setStep("private-feedback");
    } else {
      // Generate AI reviews for 3+ stars
      generateAIReview(value);
    }
  };

  // Generate AI review using Gemini
  const generateAIReview = async (ratingValue: number) => {
    setIsGeneratingReview(true);
    setStep("ai-review");

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: business.name,
          city: business.city,
          rating: ratingValue,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate reviews");
      }

      const data = await response.json();
      setAiReviews(data.reviews || []);
    } catch (error) {
      console.error("Failed to generate review:", error);
      alert("Failed to generate review suggestions. Please try again.");
      setStep("rating");
    } finally {
      setIsGeneratingReview(false);
    }
  };

  // Handle AI review selection and posting to Google
  const handlePostToGoogle = async (review: string, index: number) => {
    setSelectedReview(review);

    try {
      const googlePlaceUrl = business.review_link ||
        `https://search.google.com/local/writereview?placeid=${business.google_place_id}`;

      // Copy review to clipboard
      await navigator.clipboard.writeText(review);
      setCopied(true);

      // Open Google review in new tab
      window.open(googlePlaceUrl, "_blank");

      // Track the event
      await fetch("/api/events/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          eventType: "review_clicked",
          rating,
          reviewIndex: index,
        }),
      });

      // Insert into reviews table
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await supabase.from('reviews').insert({
        business_id: business.id,
        rating: rating,
        final_text: review,
        submitted_to_google: true,
      });

      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });

      // Show thank you screen
      setTimeout(() => {
        setStep("thank-you");
      }, 500);
    } catch (error) {
      console.error("Failed to post review:", error);
      alert("Failed to process your review. Please try again.");
    }
  };

  // Handle private feedback submission
  const handlePrivateFeedback = async (feedback: string) => {
    try {
      const response = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          feedback,
          rating,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      // Track event
      await fetch("/api/events/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          event: "feedback_submitted",
          rating,
        }),
      });

      setStep("thank-you");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      throw error;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none"
        animate={{ y: [0, 40, 0], x: [0, 40, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-tr from-signature-coral/10 to-transparent rounded-full blur-3xl pointer-events-none"
        animate={{ y: [0, -40, 0], x: [0, -40, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <div className="mb-12 text-center">
            {business.logo_url && (
              <motion.img
                src={business.logo_url}
                alt={business.name}
                className="h-16 w-16 rounded-full mx-auto mb-4 object-cover shadow-lg"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
              />
            )}

            <motion.h1
              className="text-3xl md:text-4xl font-display font-semibold text-ink mb-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              How was your experience?
            </motion.h1>

            {business.review_page_tagline && (
              <motion.p
                className="text-lg text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {business.review_page_tagline}
              </motion.p>
            )}
          </div>

          {/* Content Area */}
          <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 p-8 shadow-2xl">
            <AnimatePresence mode="wait">
              {step === "rating" && (
                <motion.div
                  key="rating"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="py-8"
                >
                  <StarRating onRate={handleRating} />
                </motion.div>
              )}

              {step === "ai-review" && (
                <motion.div
                  key="ai-review"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-2xl font-display font-semibold text-ink mb-2 text-center">
                    Choose Your Review
                  </h2>
                  <p className="text-muted text-center mb-8">
                    Pick the review that best describes your experience, or
                    regenerate to get more options.
                  </p>
                  <AIReviewCards
                    reviews={aiReviews}
                    isLoading={isGeneratingReview}
                    onSelect={handlePostToGoogle}
                    onRegenerate={() => generateAIReview(rating)}
                  />
                </motion.div>
              )}

              {step === "private-feedback" && (
                <motion.div
                  key="private-feedback"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-2xl font-display font-semibold text-ink mb-2 text-center">
                    Help Us Improve
                  </h2>
                  <p className="text-muted text-center mb-8">
                    Thank you for your honesty. Your feedback helps{" "}
                    {business.name} serve you better.
                  </p>
                  <PrivateFeedbackForm
                    businessName={business.name}
                    businessId={business.id}
                    onSubmit={handlePrivateFeedback}
                  />
                </motion.div>
              )}

              {step === "thank-you" && (
                <motion.div
                  key="thank-you"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ThankYouScreen
                    businessName={business.name}
                    businessInstagram={business.social_instagram}
                    businessWhatsapp={business.social_whatsapp}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-sm text-muted"
          >
            <p>Powered by JustHustle - Making authentic reviews easy</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

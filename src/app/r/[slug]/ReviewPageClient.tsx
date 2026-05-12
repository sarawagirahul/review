"use client";

import { AIReviewCards } from "@/components/review/AIReviewCards";
import { PrivateFeedbackForm } from "@/components/review/PrivateFeedbackForm";
import { StarRating } from "@/components/review/StarRating";
import { ThankYouScreen } from "@/components/review/ThankYouScreen";
import { createBrowserClient } from "@supabase/ssr";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

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

const STEP_ORDER: ReviewPageStep[] = [
  "rating",
  "ai-review",
  "private-feedback",
  "thank-you",
];

const REVIEW_SHIELD_THRESHOLD = 3;

export function ReviewPageClient({ business }: ReviewPageClientProps) {
  const [step, setStep] = useState<ReviewPageStep>("rating");
  const [rating, setRating] = useState(0);
  const [language, setLanguage] = useState<Language>("english");
  const [aiReviews, setAiReviews] = useState<string[]>([]);
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [pendingRating, setPendingRating] = useState(0);
  const [thankYouType, setThankYouType] = useState<"review" | "feedback">(
    "review",
  );

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      ),
    [],
  );

  useEffect(() => {
    fetch("/api/events/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: business.id, eventType: "scan" }),
    }).catch(() => {});

    const stored = sessionStorage.getItem("jh_review_state");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        supabase.auth.getSession().then(({ data: { session } }) => {
          sessionStorage.removeItem("jh_review_state");
          if (session && parsed.businessId === business.id) {
            const restoredRating = parsed.rating as number;
            setRating(restoredRating);
            setIsGeneratingReview(true);
            setStep("ai-review");
            fetch("/api/ai/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                businessName: business.name,
                city: business.city,
                rating: restoredRating,
                language: "english",
              }),
            })
              .then((r) => r.json())
              .then((data) => setAiReviews(data.reviews || []))
              .catch(() => setStep("rating"))
              .finally(() => setIsGeneratingReview(false));
          }
        });
      } catch {
        sessionStorage.removeItem("jh_review_state");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateAIReview = async (ratingValue: number, lang: Language) => {
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
          language: lang,
        }),
      });
      if (!response.ok) throw new Error("Failed to generate");
      const data = await response.json();
      setAiReviews(data.reviews || []);
    } catch {
      alert("Failed to generate review suggestions. Please try again.");
      setStep("rating");
    } finally {
      setIsGeneratingReview(false);
    }
  };

  const handleRating = async (value: number) => {
    setRating(value);
    if (value < REVIEW_SHIELD_THRESHOLD) {
      setStep("private-feedback");
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      generateAIReview(value, language);
    } else {
      setPendingRating(value);
      setShowAuthGate(true);
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    generateAIReview(rating, newLang);
  };

  const handleGoogleSignIn = () => {
    sessionStorage.setItem(
      "jh_review_state",
      JSON.stringify({ rating: pendingRating, businessId: business.id }),
    );
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.href,
        queryParams: { access_type: "offline" },
      },
    });
  };

  const handleSkipAuth = () => {
    setShowAuthGate(false);
    generateAIReview(pendingRating, language);
  };

  const handlePostToGoogle = async (review: string, index: number) => {
    try {
      const googleUrl =
        business.review_link ||
        `https://search.google.com/local/writereview?placeid=${business.google_place_id}`;

      await navigator.clipboard.writeText(review);
      window.open(googleUrl, "_blank");

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#E68369", "#FBF6E2", "#ECCEAE", "#ffffff", "#d9705a"],
      });

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

      await supabase.from("reviews").insert({
        business_id: business.id,
        rating,
        final_text: review,
        submitted_to_google: true,
      });

      setThankYouType("review");
      setTimeout(() => setStep("thank-you"), 500);
    } catch (error) {
      console.error("Failed to post review:", error);
      alert("Failed to process your review. Please try again.");
    }
  };

  const handlePrivateFeedback = async (feedback: string) => {
    try {
      const response = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business.id, feedback, rating }),
      });
      if (!response.ok) throw new Error("Failed to submit feedback");

      await fetch("/api/events/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          eventType: "feedback_submitted",
          rating,
        }),
      });

      setThankYouType("feedback");
      setStep("thank-you");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      throw error;
    }
  };

  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #FBF6E2 0%, #ECCEAE 100%)",
      }}
    >
      {/* Auth gate bottom sheet */}
      <AnimatePresence>
        {showAuthGate && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleSkipAuth}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl px-6 pb-10 pt-4"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Drag handle */}
              <div className="w-12 h-1.5 bg-hairline rounded-full mx-auto mb-6" />

              <h2 className="text-lg font-semibold text-ink mb-2">
                Earn rewards for reviewing
              </h2>
              <p className="text-sm text-muted mb-6 max-w-xs">
                Sign in to track your reviews and unlock exclusive offers
              </p>

              <button
                onClick={handleGoogleSignIn}
                className="w-full h-12 border border-hairline rounded-xl flex items-center justify-center gap-3 bg-white cursor-pointer hover:bg-surface-soft transition-colors"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium text-ink">
                  Continue with Google
                </span>
              </button>

              <button
                onClick={handleSkipAuth}
                className="w-full mt-4 text-sm text-muted underline cursor-pointer text-center block"
              >
                Skip for now →
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-full max-w-[440px] bg-white rounded-3xl shadow-modal p-6 md:p-8"
        >
          {/* Business header */}
          <div className="text-center mb-5">
            {business.logo_url ? (
              <img
                src={business.logo_url}
                alt={business.name}
                className="w-[72px] h-[72px] rounded-full mx-auto mb-3 object-cover border-[3px] border-[#ECCEAE]"
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-full mx-auto mb-3 bg-accent-light flex items-center justify-center text-2xl font-semibold text-accent">
                {business.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-xl font-semibold text-ink">{business.name}</h1>
            {business.review_page_tagline && (
              <p className="text-sm text-muted mt-1 line-clamp-2">
                {business.review_page_tagline}
              </p>
            )}
          </div>

          {/* Hairline divider */}
          <div className="h-px bg-hairline mb-5" />

          {/* Step indicator dots */}
          <div className="flex justify-center gap-2 mb-6">
            {STEP_ORDER.map((s) => (
              <motion.div
                key={s}
                animate={{
                  width: step === s ? 16 : 8,
                  backgroundColor: step === s ? "#E68369" : "#dddddd",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="h-2 rounded-full"
              />
            ))}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {step === "rating" && (
              <motion.div
                key="rating"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-4"
              >
                <h2 className="text-base font-semibold text-ink text-center mb-8">
                  How was your experience today?
                </h2>
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
                {/* Language toggle */}
                <div className="flex gap-2 justify-center mb-5">
                  {(["english", "hindi", "hinglish"] as Language[]).map(
                    (lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`relative px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer min-h-[36px] ${
                          language === lang ? "text-white" : "text-muted"
                        }`}
                      >
                        {language === lang && (
                          <motion.div
                            layoutId="lang-pill-bg"
                            className="absolute inset-0 bg-accent rounded-full"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}
                        {language !== lang && (
                          <span className="absolute inset-0 bg-surface-soft rounded-full" />
                        )}
                        <span className="relative z-10">
                          {lang === "english"
                            ? "English"
                            : lang === "hindi"
                              ? "हिंदी"
                              : "Hinglish"}
                        </span>
                      </button>
                    ),
                  )}
                </div>

                <h2 className="text-lg font-semibold text-ink mb-1 text-center">
                  Choose Your Review
                </h2>
                <p className="text-sm text-muted text-center mb-5">
                  Pick the review that best describes your experience.
                </p>
                <AIReviewCards
                  reviews={aiReviews}
                  isLoading={isGeneratingReview}
                  onSelect={handlePostToGoogle}
                  onRegenerate={() => generateAIReview(rating, language)}
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
                <h2 className="text-lg font-semibold text-ink mb-2 text-center">
                  Help Us Improve
                </h2>
                <p className="text-sm text-muted text-center mb-5">
                  Your feedback helps {business.name} serve you better.
                </p>
                <PrivateFeedbackForm
                  businessName={business.name}
                  businessId={business.id}
                  rating={rating}
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
                  businessId={business.id}
                  businessInstagram={business.social_instagram}
                  businessWhatsapp={business.social_whatsapp}
                  type={thankYouType}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted pb-6 -mt-4">
        Powered by JustHustle
      </div>
    </div>
  );
}

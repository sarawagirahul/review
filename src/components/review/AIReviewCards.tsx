"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface AIReviewCardsProps {
  reviews: string[];
  isLoading?: boolean;
  onSelect: (review: string, index: number) => void;
  onRegenerate?: () => void;
}

export function AIReviewCards({
  reviews,
  isLoading = false,
  onSelect,
  onRegenerate,
}: AIReviewCardsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [copied, setCopied] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (reviews.length === 0 || isLoading) return;

    const selectedReview = reviews[selectedIndex];
    let charIndex = 0;

    const timer = setInterval(() => {
      if (charIndex < selectedReview.length) {
        setDisplayedText(selectedReview.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [selectedIndex, reviews, isLoading]);

  const handleCopy = () => {
    const review = reviews[selectedIndex];
    navigator.clipboard.writeText(review);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <RefreshCw className="w-6 h-6 text-primary" />
        </motion.div>
        <p className="ml-3 text-muted">Generating review options...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Main Review Display */}
      <motion.div
        layout
        className="rounded-2xl border-2 border-signature-cream bg-gradient-to-br from-signature-cream/50 to-transparent p-8 min-h-[200px] flex flex-col justify-between"
      >
        <div>
          <p className="text-lg leading-relaxed text-ink whitespace-pre-wrap">
            {displayedText}
            {displayedText.length < reviews[selectedIndex].length && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.7 }}
              >
                ▋
              </motion.span>
            )}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            onClick={handleCopy}
            variant="secondary"
            size="md"
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>

          {onRegenerate && (
            <Button
              onClick={onRegenerate}
              variant="ghost"
              size="md"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </Button>
          )}
        </div>
      </motion.div>

      {/* Review Selector Dots */}
      <div className="flex justify-center gap-3">
        {reviews.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setSelectedIndex(index);
              setDisplayedText("");
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            className={`h-3 rounded-full transition-all ${
              selectedIndex === index
                ? "bg-primary w-8"
                : "bg-gray-300 hover:bg-gray-400 w-3"
            }`}
            aria-label={`Review option ${index + 1}`}
          />
        ))}
      </div>

      {/* Review Options */}
      <div className="space-y-2">
        {reviews.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setSelectedIndex(index);
              setDisplayedText("");
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              selectedIndex === index
                ? "border-primary bg-primary/5"
                : "border-hairline hover:border-primary/50 bg-white"
            }`}
          >
            <p className="text-xs font-medium text-muted">Option {index + 1}</p>
            <p className="text-sm text-ink line-clamp-2 mt-1">
              {reviews[index]}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Post to Google Button */}
      <motion.div layout className="pt-4">
        <Button
          onClick={() => onSelect(reviews[selectedIndex], selectedIndex)}
          size="lg"
          className="w-full"
        >
          Post to Google
        </Button>
      </motion.div>
    </div>
  );
}

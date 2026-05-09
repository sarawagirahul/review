"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  onRate: (rating: number) => void;
  disabled?: boolean;
}

export function StarRating({ onRate, disabled = false }: StarRatingProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRate = (value: number) => {
    if (!disabled) {
      setRating(value);
      onRate(value);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => !disabled && setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            whileHover={{ scale: disabled ? 1 : 1.2 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            disabled={disabled}
            className="relative cursor-pointer transition-transform"
          >
            <motion.div
              animate={{
                scale: star <= (hoverRating || rating) ? 1.1 : 1,
              }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Star
                size={56}
                className={`transition-all ${
                  star <= (hoverRating || rating)
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                    : "text-gray-300 fill-gray-100"
                }`}
              />
            </motion.div>
          </motion.button>
        ))}
      </div>

      {rating > 0 && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-medium text-ink"
        >
          {rating === 5 && "Love it! 🎉"}
          {rating === 4 && "Great! 😊"}
          {rating === 3 && "It's okay"}
          {rating < 3 && "We'll help you improve 💬"}
        </motion.p>
      )}
    </div>
  );
}

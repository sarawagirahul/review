"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { QrCode, Star } from "lucide-react";

interface ReviewBusiness {
  name: string | null;
  logo_url: string | null;
  city: string | null;
}

interface Review {
  id: string;
  rating: number | null;
  final_text: string | null;
  language: string | null;
  created_at: string;
  businesses: ReviewBusiness | ReviewBusiness[] | null;
}

interface UserData {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface ProfileClientProps {
  user: UserData;
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? "fill-[#E68369] text-[#E68369]"
              : "fill-transparent text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function getMonthYear(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function getRelativeTime(dateStr: string) {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} min ago`;
    return "just now";
  } catch {
    return new Date(dateStr).toLocaleDateString("en-IN");
  }
}

function getBusiness(review: Review): ReviewBusiness | null {
  if (!review.businesses) return null;
  if (Array.isArray(review.businesses)) return review.businesses[0] ?? null;
  return review.businesses;
}

export default function ProfileClient({ user, reviews }: ProfileClientProps) {
  const reviewCount = reviews.length;

  return (
    <div className="min-h-screen bg-canvas py-10">
      <div className="mx-auto max-w-2xl px-4">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-3 mb-10 text-center"
        >
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.full_name ?? "Profile"}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-surface-soft flex items-center justify-center text-2xl font-semibold text-ink">
              {user.full_name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-semibold text-ink">
              {user.full_name ?? "Customer"}
            </h1>
            {user.email && (
              <p className="text-sm text-muted mt-0.5">{user.email}</p>
            )}
            <p className="text-xs text-muted mt-0.5">
              Member since {getMonthYear(user.created_at)}
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E68369]/10 px-3 py-1 text-xs font-medium text-[#E68369]">
            <Star className="h-3 w-3 fill-[#E68369]" />
            {reviewCount} {reviewCount === 1 ? "review" : "reviews"} posted
          </span>
        </motion.div>

        {/* Reviews section */}
        <div>
          <h2 className="text-lg font-medium text-ink mb-4">Your Reviews</h2>

          {reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4 rounded-2xl border border-hairline bg-canvas p-12 text-center"
            >
              <QrCode className="h-16 w-16 text-[#E68369]/30" />
              <div>
                <p className="text-base font-medium text-ink">No reviews yet</p>
                <p className="text-sm text-muted mt-1 max-w-xs">
                  Scan a QR code at any JustHustle-enabled business to leave your first review
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, index) => {
                const business = getBusiness(review);
                return (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.06,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="rounded-xl border border-hairline bg-white p-4 shadow-sm"
                  >
                    <div className="flex gap-3">
                      {/* Business logo / initial */}
                      <div className="shrink-0">
                        {business?.logo_url ? (
                          <Image
                            src={business.logo_url}
                            alt={business.name ?? "Business"}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-surface-soft flex items-center justify-center text-sm font-semibold text-ink">
                            {business?.name?.charAt(0)?.toUpperCase() ?? "?"}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <p className="text-sm font-semibold text-ink leading-tight">
                              {business?.name ?? "Unknown business"}
                            </p>
                            {business?.city && (
                              <p className="text-xs text-muted">{business.city}</p>
                            )}
                          </div>
                          <p className="text-xs text-muted whitespace-nowrap shrink-0">
                            {getRelativeTime(review.created_at)}
                          </p>
                        </div>

                        {review.rating && (
                          <div className="mb-2">
                            <StarRating rating={review.rating} />
                          </div>
                        )}

                        {review.final_text && (
                          <p className="text-sm text-muted leading-relaxed">
                            {review.final_text}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-hairline bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="text-3xl font-display font-semibold text-ink mt-2">
            {value.toLocaleString()}
          </p>
          {trend && (
            <p
              className={`text-xs font-medium mt-2 ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? "+" : "-"}
              {trend.value}% from last month
            </p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-primary/10">{icon}</div>
      </div>
    </motion.div>
  );
}

interface BusinessCardProps {
  id: string;
  name: string;
  scans: number;
  reviews: number;
  feedback: number;
  qrSlug: string;
  onSelect?: (id: string) => void;
}

export function BusinessCard({
  id,
  name,
  scans,
  reviews,
  feedback,
  qrSlug,
  onSelect,
}: BusinessCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      onClick={() => onSelect?.(id)}
      className="rounded-2xl border border-hairline bg-white p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <h3 className="font-display text-lg font-semibold text-ink mb-4">
        {name}
      </h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-xs font-medium text-muted">QR Scans</p>
          <p className="text-2xl font-semibold text-ink mt-1">
            {scans.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted">Reviews</p>
          <p className="text-2xl font-semibold text-ink mt-1">
            {reviews.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted">Feedback</p>
          <p className="text-2xl font-semibold text-ink mt-1">
            {feedback.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex gap-2 text-xs">
        <code className="flex-1 px-3 py-2 rounded-lg bg-surface-soft text-ink font-mono truncate">
          justhustle.in/r/{qrSlug}
        </code>
      </div>
    </motion.div>
  );
}

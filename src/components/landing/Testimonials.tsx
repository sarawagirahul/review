"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahul S.",
    business: "Rahul's Cafe",
    text: "We went from 12 reviews to over 150 in just two months. Customers love how easy it is, and the AI writes better reviews than they would have thought of themselves!",
  },
  {
    name: "Priya M.",
    business: "Glow Salon & Spa",
    text: "The Review Shield is a lifesaver. We caught a 2-star review about a scheduling mixup before it hit Google, reached out to the client, and they ended up leaving 5 stars instead.",
  },
  {
    name: "Amit K.",
    business: "Metro Hardware",
    text: "I used to feel awkward asking people for reviews. Now I just point to the stand on the counter. The AI feature in Hindi is a huge hit with my local customers.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-canvas py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-display text-4xl text-ink">Trusted by business owners</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            See how real businesses are transforming their online presence.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-surface-soft p-8 border border-hairline"
            >
              <div className="mb-4 flex text-signature-mustard">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mb-6 text-body leading-relaxed">"{t.text}"</p>
              <div>
                <p className="font-medium text-ink">{t.name}</p>
                <p className="text-sm text-muted">{t.business}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

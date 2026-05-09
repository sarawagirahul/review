"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Rahul S.",
    business: "Rahul's Cafe, Bengaluru",
    text: "We went from 12 reviews to over 150 in two months. Customers love how easy it is, and the AI writes better review suggestions than they would have thought of themselves!",
    image:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    name: "Priya M.",
    business: "Glow Salon & Spa, Mumbai",
    text: "The private feedback channel is a lifesaver. We caught a scheduling mixup before it became a public complaint, reached out to the client, and they ended up leaving 5 stars on Google.",
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    name: "Amit K.",
    business: "Metro Hardware, Delhi",
    text: "I used to feel awkward asking people for reviews. Now I just point to the stand on the counter. The Hindi language option is a huge hit with my local customers.",
    image:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
];

export function Testimonials() {
  return (
    <section className="bg-surface-soft py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 font-display text-4xl text-ink">Trusted by business owners across India</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            See how real businesses are managing their online reputation with transparency and trust.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-2xl bg-canvas p-8 border border-hairline shadow-subtle"
            >
              <div className="mb-4 flex text-signature-mustard">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mb-6 text-body leading-relaxed">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-surface-soft">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-ink">{t.name}</p>
                  <p className="text-sm text-muted">{t.business}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

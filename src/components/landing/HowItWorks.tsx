"use client";

import { motion } from "framer-motion";
import { QrCode, Link2, Shield, MessageSquare, ChartBar as BarChart3, CircleCheck as CheckCircle2 } from "lucide-react";
import Image from "next/image";

const steps = [
  {
    icon: QrCode,
    title: "Customer scans your QR code",
    description:
      "Place the QR stand at your counter. Customers simply point their phone camera at it to begin.",
    color: "bg-signature-peach",
    image:
      "https://images.pexels.com/photos/6173931/pexels-photo-6173931.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    icon: Link2,
    title: "Secure OAuth 2.0 connection",
    description:
      "We connect to your Google Business Profile via official Google APIs with OAuth 2.0. No passwords stored, ever.",
    color: "bg-signature-mint",
    image:
      "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    icon: MessageSquare,
    title: "AI-assisted review drafts",
    description:
      "Our AI generates review suggestions based on your business. Customers pick their preferred draft and post it to Google.",
    color: "bg-signature-cream",
    image:
      "https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    icon: Shield,
    title: "Private feedback channel",
    description:
      "Customers who rate below 3 stars are offered a private feedback form sent to your email — improving service before issues escalate.",
    color: "bg-signature-mustard/30",
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    icon: BarChart3,
    title: "Track growth & insights",
    description:
      "Monitor scans, reviews, and customer sentiment from a single dashboard. Make data-driven improvements.",
    color: "bg-signature-forest/10",
    image:
      "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface-soft py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 font-display text-4xl text-ink">How it works</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            A transparent, API-first workflow that keeps you in control. We use official Google APIs
            with OAuth 2.0 — no shortcuts, no stored passwords.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`grid items-center gap-8 rounded-3xl bg-canvas p-8 shadow-subtle border border-hairline md:grid-cols-2 md:p-12 ${
                index % 2 === 1 ? "md:direction-rtl" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "md:order-2" : ""}>
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${step.color}`}
                  >
                    <step.icon className="h-6 w-6 text-ink" />
                  </div>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signature-forest text-xs font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mb-3 text-2xl font-medium text-ink">{step.title}</h3>
                <p className="text-body leading-relaxed">{step.description}</p>
                {index === 1 && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-signature-forest">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Google API Services User Data Policy compliant</span>
                  </div>
                )}
                {index === 3 && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-signature-forest">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Does not prevent customers from leaving any review</span>
                  </div>
                )}
              </div>
              <div className={`overflow-hidden rounded-2xl ${index % 2 === 1 ? "md:order-1" : ""}`}>
                <Image
                  src={step.image}
                  alt={step.title}
                  width={400}
                  height={300}
                  className="h-64 w-full object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

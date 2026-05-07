import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, HeartHandshake, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

const values = [
  {
    title: "Trust first",
    description:
      "Every flow is designed to collect honest customer feedback while staying compliant with platform policies.",
    icon: ShieldCheck,
  },
  {
    title: "Built for local teams",
    description:
      "From salons to clinics, we optimize for busy owners who need clarity, not another complex dashboard.",
    icon: Users,
  },
  {
    title: "Human-centered AI",
    description:
      "AI assists with tone and speed, but your brand voice and customer intent stay in control.",
    icon: HeartHandshake,
  },
];

const stats = [
  { label: "Local businesses supported", value: "1,200+" },
  { label: "Reviews generated monthly", value: "48k+" },
  { label: "Average response time", value: "< 10 mins" },
  { label: "Cities across India", value: "60+" },
];

const process = [
  "Connect your Google Business Profile in minutes.",
  "Share one QR code at checkout or billing desk.",
  "Route happy customers to Google and capture private feedback from others.",
  "Track growth and improve service from one dashboard.",
];

export const metadata: Metadata = {
  title: "About ReviewBoost | Our Mission and Values",
  description:
    "Learn how ReviewBoost helps local businesses in India grow authentic Google reviews with a simple QR flow, AI-assisted writing, and customer-first principles.",
  keywords: [
    "about reviewboost",
    "google review platform",
    "local business reputation",
    "customer feedback software",
    "india local seo",
  ],
  openGraph: {
    title: "About ReviewBoost | Mission, Values, and Approach",
    description:
      "We help local teams collect authentic Google reviews and actionable feedback through a thoughtful, customer-first workflow.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col selection:bg-signature-cream selection:text-ink">
      <Navbar />
      <main className="flex-1 bg-canvas">
        <Section className="pt-32 pb-16 md:pb-20">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              About ReviewBoost
            </div>
            <h1 className="text-4xl font-display tracking-tight text-ink md:text-6xl">
              Helping local businesses earn trust, one real review at a time.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
              ReviewBoost started with a simple idea: great businesses deserve better word-of-mouth in the digital
              world. We build tools that make it easier to turn happy customer moments into authentic online
              reputation growth.
            </p>
          </div>
        </Section>

        <Section className="py-10">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-2xl border border-hairline bg-white p-6 shadow-[0_6px_30px_rgba(18,18,23,0.03)]">
                <p className="text-3xl font-display font-semibold tracking-tight text-ink">{stat.value}</p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section className="py-16">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Our mission</p>
              <h2 className="text-3xl font-display tracking-tight text-ink md:text-4xl">
                Make reputation growth practical for every neighborhood business.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted">
                We believe every small team should have enterprise-grade tools for customer trust, without enterprise
                complexity. That&apos;s why we focus on simple onboarding, clear outcomes, and daily usability.
              </p>
            </div>
            <div className="lg:col-span-7 grid gap-5 md:grid-cols-3">
              {values.map(({ title, description, icon: Icon }) => (
                <article key={title} className="rounded-2xl border border-hairline bg-surface-soft p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-medium text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </Section>

        <Section className="py-12">
          <div className="grid gap-8 rounded-3xl border border-hairline bg-white p-8 md:p-10 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">How we work</p>
              <h2 className="text-3xl font-display tracking-tight text-ink">A process your team can run every day.</h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                We pair onboarding guidance with a repeatable workflow that keeps your review pipeline active and your
                service quality visible.
              </p>
            </div>
            <ol className="flex flex-col gap-4">
              {process.map((step) => (
                <li key={step} className="flex items-start gap-3 rounded-xl bg-canvas p-4 text-sm text-ink">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        <Section className="pt-10 pb-24">
          <div className="rounded-3xl border border-hairline bg-surface-soft p-8 text-center md:p-12">
            <h2 className="text-3xl font-display tracking-tight text-ink md:text-4xl">Ready to build a stronger reputation?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">
              Start with a free trial and see how quickly your team can collect quality Google reviews and meaningful
              customer insights.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild>
                <Link href="/login">Start free trial</Link>
              </Button>
              <Link href="/contact" className="text-sm font-medium text-ink underline-offset-4 hover:underline">
                Talk to our team
              </Link>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}

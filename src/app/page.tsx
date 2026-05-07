"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Check,
  Copy,
  HeartPulse,
  Languages,
  MapPin,
  MessageSquareText,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SignatureCard } from "@/components/ui/SignatureCard";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const ownerSteps = [
  ["Connect", "Link your Google Business Profile in one click."],
  ["Customize", "Set Review Shield threshold, branding, and language mix."],
  ["Print", "Download your high-res QR kit and start collecting reviews today."],
];

const customerSteps = [
  ["Scan", "Customer scans your table tent, standee, or counter QR."],
  ["Select", "AI drafts reviews in English, Hindi, and Hinglish."],
  ["Post", "AI writes it, we copy it, customer posts it in the fastest compliant flow."],
];

const features = [
  {
    icon: Languages,
    title: "Authentic English, Hindi, Hinglish",
    body: "Reviews that sound like your customers, not like a bot.",
  },
  {
    icon: ShieldCheck,
    title: "Negative review insurance policy",
    body: "Intercept frustrations privately and resolve them before public damage.",
  },
  {
    icon: MessageSquareText,
    title: "Reply to reviews in 1-click",
    body: "Google favors active owners. AI suggests polished replies in seconds.",
  },
  {
    icon: Bell,
    title: "Instant WhatsApp alerts",
    body: "Get real-time notifications for new reviews and Shield-triggered feedback.",
  },
];

const industries = [
  {
    icon: Utensils,
    title: "Restaurants",
    body: "Capture the post-meal glow while customers are still at the table.",
  },
  {
    icon: HeartPulse,
    title: "Clinics and Dental",
    body: "Build trust quickly with clear, warm patient review moments.",
  },
  {
    icon: Store,
    title: "Retail and Showrooms",
    body: "Turn walk-ins into digital proof that lifts near-me discovery.",
  },
];

const faqs = [
  [
    "Can ReviewBoost post Google reviews automatically?",
    "No. Google policy does not allow direct programmatic posting. We use a compliant copy plus deep-link workflow.",
  ],
  [
    "What happens to 1-star and 2-star intent?",
    "Review Shield routes low ratings to private feedback so teams can resolve issues before public posting.",
  ],
  [
    "Does this support multiple branches?",
    "Yes. One owner account can run unlimited locations, each with its own QR flow and analytics.",
  ],
];

function TypewriterReview() {
  const text =
    "Bahut smooth experience tha. Staff friendly tha, appointment time par start hua, aur doctor ne sab clearly explain kiya.";

  return (
    <p className="text-sm leading-relaxed text-body">
      {text.split("").map((char, idx) => (
        <motion.span
          key={`${char}-${idx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 + idx * 0.016, duration: 0.01 }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        className="ml-0.5 inline-block h-4 w-px bg-ink align-middle"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </p>
  );
}

function ProductMorphism() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 0.3], [0, -3]);
  const y = useTransform(scrollYProgress, [0, 0.3], [0, 16]);

  return (
    <motion.div style={{ rotate, y }} className="relative mx-auto w-full max-w-[540px]">
      <motion.div
        initial={{ borderRadius: 32 }}
        animate={{ borderRadius: [32, 18, 26, 16, 32] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="morphism-panel border border-hairline bg-white p-4 shadow-subtle"
      >
        <div className="rounded-[10px] border border-hairline bg-surface-soft p-4">
          <div className="flex items-center justify-between rounded-md border border-hairline bg-white px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Bandra Dental Studio</p>
              <p className="mt-1 text-sm font-medium text-ink">Review request live</p>
            </div>
            <span className="rounded-full bg-signature-mint px-3 py-1 text-xs text-ink">4.9 rating</span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-md bg-signature-cream p-4"
            >
              <div className="mx-auto flex aspect-square max-w-[150px] items-center justify-center rounded-md bg-white">
                <QrCode className="h-20 w-20 text-ink" strokeWidth={1.6} />
              </div>
              <p className="mt-4 text-center text-sm font-medium text-ink">Scan to review</p>
            </motion.div>

            <div className="space-y-3 rounded-md border border-hairline bg-white p-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0.82, opacity: 0.45 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.08, duration: 0.3 }}
                  >
                    <Star className="h-5 w-5 fill-[#f4d35e] text-[#d9a441]" />
                  </motion.span>
                ))}
              </div>
              <div className="min-h-[118px] rounded-md bg-surface-soft p-3">
                <TypewriterReview />
              </div>
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-white">
                <Copy className="h-4 w-4" />
                Copy and open Google
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-canvas text-body">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-canvas/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 md:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
              <Star className="h-4 w-4 fill-current" />
            </span>
            <span className="text-lg font-medium text-ink">ReviewBoost</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-muted md:flex">
            <Link href="#features" className="transition-colors hover:text-ink">
              Features
            </Link>
            <Link href="#ranking" className="transition-colors hover:text-ink">
              Ranking
            </Link>
            <Link href="#setup" className="transition-colors hover:text-ink">
              Setup
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-ink">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Log in
            </Button>
            <Button size="sm" className="gap-2 px-3 sm:px-4">
              Start free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      <Section className="pb-16 pt-32 md:pb-20 md:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-3 py-1 text-xs font-medium text-ink shadow-[0_8px_24px_rgba(24,29,38,0.04)]">
              <Sparkles className="h-3.5 w-3.5" />
              Built for Indian businesses on Google
            </div>
            <h1 className="mt-7 max-w-4xl text-[2.72rem] font-normal leading-[1.06] text-ink sm:text-6xl md:text-7xl">
              Skyrocket your Google Maps ranking in 30 seconds.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted md:text-xl">
              The AI growth engine for Indian businesses: collect more 5-star reviews, protect your rating with Review Shield, and automate owner replies.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="gap-2">
                Start 7-day trial
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="lg" className="gap-2">
                Live demo QR
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink">
              {["No card required", "GST-ready invoices", "WhatsApp alerts included"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-1">
                  <Check className="h-4 w-4 text-signature-forest" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <ProductMorphism />
        </div>
      </Section>

      <section className="border-y border-hairline bg-surface-soft/60 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 text-sm md:px-10">
          <p className="font-medium uppercase tracking-wide text-ink">Trusted by 500+ cafes, clinics, and showrooms across India</p>
          <div className="flex flex-wrap gap-4 text-muted">
            <span>Cafes in Indiranagar</span>
            <span>Dental clinics in Mumbai</span>
            <span>Salons in Delhi</span>
            <span>Retail in Ahmedabad</span>
          </div>
        </div>
      </section>

      <Section id="ranking">
        <motion.div {...fadeUp} className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wide text-muted">Local SEO lift</p>
          <h2 className="mt-3 text-4xl font-normal leading-tight text-ink md:text-6xl">
            Stop being invisible in near-me searches.
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted">
            More high-quality reviews usually means stronger local ranking, more calls, and more walk-ins.
          </p>
        </motion.div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <motion.article {...fadeUp} className="rounded-[10px] border border-hairline bg-white p-6">
            <p className="text-sm font-medium text-muted">Without ReviewBoost</p>
            <div className="mt-4 rounded-md border border-hairline bg-surface-soft p-4">
              <p className="text-sm text-muted">Google Maps results: Dentist near me</p>
              <div className="mt-3 rounded-md bg-white p-3">
                <p className="text-sm text-ink">#10 Local Dental Point</p>
                <p className="text-xs text-muted">5 reviews, rating 4.2</p>
              </div>
            </div>
          </motion.article>
          <motion.article {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.06 }} className="rounded-[10px] border border-primary bg-surface-soft p-6 shadow-subtle">
            <p className="text-sm font-medium text-ink">With ReviewBoost</p>
            <div className="mt-4 rounded-md border border-primary/40 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink">#1 Rahul Industries Dental</p>
                <span className="rounded-full bg-signature-mint px-2 py-0.5 text-xs text-ink">ReviewBoost</span>
              </div>
              <p className="mt-1 text-xs text-muted">150+ reviews, rating 4.9</p>
            </div>
          </motion.article>
        </div>
      </Section>

      <Section id="setup" className="bg-signature-cream/55">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div {...fadeUp}>
            <p className="text-sm font-medium uppercase tracking-wide text-muted">Owner setup</p>
            <h2 className="mt-3 text-4xl font-normal leading-tight text-ink md:text-6xl">
              Launch in minutes, not weeks.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              No tech team required. Connect your profile, set preferences, print QR kits, and go live.
            </p>
          </motion.div>
          <div className="grid gap-4">
            {ownerSteps.map(([title, body], index) => (
              <motion.article
                key={title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: index * 0.06 }}
                className="rounded-[10px] border border-hairline bg-white p-5"
              >
                <p className="text-sm uppercase tracking-wide text-muted">Step {index + 1}</p>
                <h3 className="mt-2 text-2xl font-normal text-ink">{title}</h3>
                <p className="mt-2 leading-7 text-muted">{body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </Section>

      <Section id="features">
        <motion.div {...fadeUp} className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wide text-muted">Core features</p>
          <h2 className="mt-3 text-4xl font-normal leading-tight text-ink md:text-6xl">
            Built for Indian customer behavior.
          </h2>
        </motion.div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: index * 0.05 }}
              className="rounded-[10px] border border-hairline bg-white p-6"
            >
              <feature.icon className="h-7 w-7 text-ink" />
              <h3 className="mt-4 text-2xl font-normal text-ink">{feature.title}</h3>
              <p className="mt-3 leading-7 text-muted">{feature.body}</p>
            </motion.article>
          ))}
        </div>
      </Section>

      <Section className="py-0">
        <SignatureCard variant="coral" className="grid gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-center">
          <motion.div {...fadeUp}>
            <p className="text-sm font-medium uppercase tracking-wide text-white/75">Review Shield</p>
            <h2 className="mt-4 text-4xl font-normal leading-tight text-white md:text-6xl">
              A reputation insurance policy for your business.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/85">
              Do not let one bad day ruin your average. Intercept frustrations privately, resolve them instantly, and keep your public profile cleaner.
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="rounded-[10px] border border-white/20 bg-white/10 p-5">
            {[
              "Customer selects 2 stars",
              "Private feedback captured",
              "Owner gets WhatsApp alert",
              "Issue resolved before public post",
            ].map((item, index) => (
              <div key={item} className="mb-3 flex items-center justify-between rounded-md border border-white/20 bg-white/10 px-4 py-3 text-white last:mb-0">
                <span>{item}</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-signature-coral">
                  {index + 1}
                </span>
              </div>
            ))}
          </motion.div>
        </SignatureCard>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <motion.article {...fadeUp} className="rounded-[10px] border border-hairline bg-white p-6">
            <p className="text-sm font-medium uppercase tracking-wide text-muted">Without AI draft</p>
            <h3 className="mt-2 text-3xl font-normal text-ink">Customer intention drops.</h3>
            <p className="mt-3 leading-7 text-muted">
              The customer is willing, but writing takes effort. Most walk away before posting.
            </p>
          </motion.article>
          <motion.article {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.06 }} className="rounded-[10px] border border-primary bg-surface-soft p-6 shadow-subtle">
            <p className="text-sm font-medium uppercase tracking-wide text-ink">With ReviewBoost AI</p>
            <h3 className="mt-2 text-3xl font-normal text-ink">Draft ready, post rate rises.</h3>
            <p className="mt-3 leading-7 text-muted">
              Stop losing reviews to laziness. Give customers a draft they already want to post.
            </p>
          </motion.article>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div {...fadeUp}>
            <p className="text-sm font-medium uppercase tracking-wide text-muted">Customer flow</p>
            <h2 className="mt-3 text-4xl font-normal leading-tight text-ink md:text-6xl">
              One scan. One tap. One posted review.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              Short, guided, mobile-first journey built for checkout counters and real crowds.
            </p>
          </motion.div>
          <div className="grid gap-4">
            {customerSteps.map(([title, body], index) => (
              <motion.article
                key={title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: index * 0.06 }}
                className="grid gap-4 rounded-[10px] border border-hairline bg-white p-5 sm:grid-cols-[70px_1fr]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-signature-cream text-xl text-ink">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-2xl font-normal text-ink">{title}</h3>
                  <p className="mt-2 leading-7 text-muted">{body}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-signature-cream/65">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-center">
          <motion.div {...fadeUp}>
            <p className="text-sm font-medium uppercase tracking-wide text-muted">Dashboard</p>
            <h2 className="mt-3 text-4xl font-normal leading-tight text-ink md:text-5xl">
              Never miss a pulse.
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted">
              Track scans, review clicks, and private feedback. Suggested AI replies help owners respond in seconds.
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="rounded-[10px] border border-hairline bg-white p-5 shadow-subtle">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["1,284", "QR scans"],
                ["812", "Review clicks"],
                ["46", "Shield alerts"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-md bg-surface-soft p-4">
                  <p className="text-3xl font-normal text-ink">{value}</p>
                  <p className="mt-1 text-sm text-muted">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-md border border-primary/35 bg-surface-soft p-4">
              <div className="flex items-start gap-3">
                <MessageSquareText className="mt-1 h-5 w-5 text-ink" />
                <div>
                  <p className="font-medium text-ink">Suggested AI reply</p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Thank you for your kind review. We are glad your visit felt smooth and well cared for.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-md border border-hairline p-4 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <Bell className="h-4 w-4 text-ink" />
                WhatsApp alert: New 2-star private feedback from Andheri branch.
              </span>
            </div>
          </motion.div>
        </div>
      </Section>

      <Section>
        <motion.div {...fadeUp} className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wide text-muted">Industry fit</p>
          <h2 className="mt-3 text-4xl font-normal leading-tight text-ink md:text-5xl">
            Designed for the businesses you already run.
          </h2>
        </motion.div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {industries.map((item, index) => (
            <motion.article
              key={item.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: index * 0.06 }}
              className="rounded-[10px] border border-hairline bg-white p-6"
            >
              <item.icon className="h-7 w-7 text-ink" />
              <h3 className="mt-4 text-2xl font-normal text-ink">{item.title}</h3>
              <p className="mt-3 leading-7 text-muted">{item.body}</p>
            </motion.article>
          ))}
        </div>
      </Section>

      <Section id="pricing">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-muted">Pricing</p>
          <h2 className="mt-3 text-4xl font-normal leading-tight text-ink md:text-6xl">
            Simple plans. Market-ready value.
          </h2>
          <p className="mt-4 text-lg text-muted">
            All paid plans include all core features. GST invoices supported.
          </p>
        </motion.div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {[
            { name: "Trial", price: "Free", note: "7 days, full access", action: "Start trial" },
            { name: "Monthly", price: "Rs 999", note: "per month", action: "Choose monthly", featured: true },
            { name: "Annual", price: "Rs 7,999", note: "per year, save about 33%", action: "Choose annual" },
          ].map((plan, index) => (
            <motion.article
              key={plan.name}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: index * 0.06 }}
              className={`rounded-[10px] border p-7 ${
                plan.featured ? "border-primary bg-surface-soft shadow-subtle" : "border-hairline bg-white"
              }`}
            >
              <p className="text-sm font-medium uppercase tracking-wide text-muted">{plan.name}</p>
              <p className="mt-4 text-4xl font-normal text-ink">{plan.price}</p>
              <p className="mt-2 text-sm text-muted">{plan.note}</p>
              <Button variant={plan.featured ? "primary" : "secondary"} className="mt-7 w-full">
                {plan.action}
              </Button>
            </motion.article>
          ))}
        </div>
      </Section>

      <Section id="faq" className="pt-0">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div {...fadeUp}>
            <p className="text-sm font-medium uppercase tracking-wide text-muted">FAQ</p>
            <h2 className="mt-3 text-4xl font-normal leading-tight text-ink md:text-5xl">
              Clear answers before you go live.
            </h2>
          </motion.div>
          <motion.div {...fadeUp} className="space-y-3">
            {faqs.map(([question, answer]) => (
              <article key={question} className="rounded-[10px] border border-hairline bg-white p-5">
                <h3 className="text-xl font-normal text-ink">{question}</h3>
                <p className="mt-3 leading-7 text-muted">{answer}</p>
              </article>
            ))}
          </motion.div>
        </div>
      </Section>

      <Section className="pt-0">
        <SignatureCard variant="navy" className="text-center">
          <motion.div {...fadeUp} className="mx-auto max-w-3xl">
            <h2 className="text-4xl font-normal leading-tight text-white md:text-6xl">
              Start with one branch. Expand to every location.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/78">
              More reviews, faster replies, stronger local ranking, and cleaner public reputation.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" className="bg-white text-ink hover:bg-white/90">
                Start free trial
              </Button>
              <Button variant="secondary" size="lg" className="border-white/45 bg-transparent text-white hover:bg-white/10">
                Book live demo
              </Button>
            </div>
          </motion.div>
        </SignatureCard>
      </Section>

      <footer className="border-t border-hairline py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-10">
          <p>ReviewBoost</p>
          <div className="flex gap-5">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              India-first local SEO platform
            </span>
          </div>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-ink">
              Contact
            </Link>
          </div>
        </div>
      </footer>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="fixed bottom-5 right-5 z-50 sm:hidden"
      >
        <Button size="sm" className="shadow-subtle">
          Start free trial
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="pointer-events-none fixed bottom-7 right-5 z-40 hidden sm:block"
      >
        <div className="rounded-full border border-hairline bg-white/90 px-3 py-1 text-xs text-muted backdrop-blur">
          <span className="inline-flex items-center gap-1">
            <Search className="h-3.5 w-3.5" />
            Start free trial
          </span>
        </div>
      </motion.div>
    </main>
  );
}

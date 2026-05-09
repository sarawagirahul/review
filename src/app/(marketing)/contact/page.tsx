import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-canvas">
        <Section className="pt-32 pb-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display tracking-tight text-ink mb-8">
              Get in touch
            </h1>
            <p className="text-lg text-muted mb-12 leading-relaxed">
              Have questions about JustHustle? We&apos;re here to help you manage your business
              reputation.
            </p>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-ink">
                  <Mail className="w-5 h-5" />
                  <a href="mailto:support@justhustle.in" className="font-medium hover:text-signature-forest">
                    support@justhustle.in
                  </a>
                </div>
                <div className="flex items-center gap-3 text-ink">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">
                    Goself, Bengaluru, Karnataka, India
                  </span>
                </div>
              </div>
            </div>

            <form className="flex flex-col gap-6 p-8 rounded-lg border border-hairline bg-surface-soft">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-ink">
                    Name
                  </label>
                  <input
                    type="text"
                    className="bg-white border border-hairline rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-signature-forest/10"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-ink">
                    Email
                  </label>
                  <input
                    type="email"
                    className="bg-white border border-hairline rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-signature-forest/10"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-ink">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="bg-white border border-hairline rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-signature-forest/10"
                  placeholder="How can we help?"
                />
              </div>
              <Button className="w-fit bg-signature-forest hover:bg-signature-forest/90">
                Send message
              </Button>
            </form>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}

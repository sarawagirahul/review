"use client";

import Link from "next/link";
import { Star, ArrowLeft, ExternalLink } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import QRCodesTab from "@/components/dashboard/tabs/QRCodesTab";
import ShieldInboxTab from "@/components/dashboard/tabs/ShieldInboxTab";
import ReviewsTab from "@/components/dashboard/tabs/ReviewsTab";
import CustomisationTab from "@/components/dashboard/tabs/CustomisationTab";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";
import CompetitorTab from "@/components/dashboard/tabs/CompetitorTab";
import SocialWebTab from "@/components/dashboard/tabs/SocialWebTab";

export interface Business {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  logo_url: string | null;
  google_rating: number | null;
  google_place_id: string | null;
  review_link: string | null;
  qr_slug: string;
  description: string | null;
  brand_color_primary: string | null;
  brand_color_secondary: string | null;
  review_page_tagline: string | null;
  review_page_thank_you_message: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  whatsapp_business: string | null;
  notify_email: string | null;
  notify_new_review: boolean;
  notify_shield_catch: boolean;
  notify_weekly_summary: boolean;
  is_active: boolean;
  total_scans: number;
  google_review_count: number;
  latitude: number | null;
  longitude: number | null;
  primary_category: string | null;
}

interface BusinessTabsProps {
  business: Business;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function BusinessTabs({ business }: BusinessTabsProps) {
  const reviewLink =
    business.review_link ||
    (business.google_place_id
      ? `https://search.google.com/local/writereview?placeid=${business.google_place_id}`
      : "");

  return (
    <div className="min-h-screen bg-canvas">
      {/* Business Header */}
      <div className="border-b border-hairline bg-canvas px-4 md:px-8 pt-6 pb-0">
        <div className="max-w-6xl mx-auto">
          {/* Back link */}
          <Link
            href="/dashboard/businesses"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            My Businesses
          </Link>

          {/* Business info row */}
          <div className="flex items-center justify-between gap-4 pb-4">
            <div className="flex items-center gap-3">
              {/* Logo / initials */}
              <div className="h-14 w-14 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-accent-light">
                {business.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={business.logo_url}
                    alt={business.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-accent font-semibold text-lg">
                    {getInitials(business.name)}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-ink">
                    {business.name}
                  </h1>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      business.is_active
                        ? "text-success bg-success/10"
                        : "text-muted bg-surface-soft"
                    }`}
                  >
                    {business.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted mt-0.5">
                  {business.city && <span>{business.city}</span>}
                  {business.google_rating != null && (
                    <span className="flex items-center gap-1">
                      <span className="text-muted">·</span>
                      <Star className="h-3.5 w-3.5 fill-star text-star" />
                      <span>{business.google_rating.toFixed(1)}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Preview link */}
            {business.qr_slug && (
              <a
                href={`/r/${business.qr_slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors cursor-pointer"
              >
                Preview QR Page
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          {/* Tabs row */}
          <Tabs defaultValue="qr" className="w-full">
            <TabsList className="w-full justify-start h-auto bg-transparent p-0 overflow-x-auto flex-nowrap border-0 gap-0">
              {[
                { value: "qr", label: "QR Codes" },
                { value: "shield", label: "Shield Inbox" },
                { value: "reviews", label: "Reviews" },
                { value: "customisation", label: "Customisation" },
                { value: "settings", label: "Settings" },
                { value: "competitors", label: "Competitors" },
                { value: "social", label: "Social" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="whitespace-nowrap rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:text-ink data-[state=active]:border-accent data-[state=active]:shadow-none hover:text-ink transition-colors cursor-pointer"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="max-w-6xl mx-auto py-6">
              <TabsContent value="qr" className="mt-0">
                <QRCodesTab
                  businessId={business.id}
                  businessName={business.name}
                  reviewLink={reviewLink}
                />
              </TabsContent>

              <TabsContent value="shield" className="mt-0">
                <ShieldInboxTab businessId={business.id} />
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <ReviewsTab
                  businessId={business.id}
                  googlePlaceId={business.google_place_id}
                  reviewLink={reviewLink}
                />
              </TabsContent>

              <TabsContent value="customisation" className="mt-0">
                <CustomisationTab business={business} />
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <SettingsTab business={business} />
              </TabsContent>

              <TabsContent value="competitors" className="mt-0">
                <CompetitorTab
                  businessId={business.id}
                  businessName={business.name}
                  city={business.city || ""}
                />
              </TabsContent>

              <TabsContent value="social" className="mt-0">
                <SocialWebTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

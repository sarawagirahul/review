"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Building2, Link as LinkIcon, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QRCode } from "@/components/ui/QRCode";

export function SetupWizard() {
  const [step, setStep] = useState(1);
  const [locations, setLocations] = useState<any[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  
  // Selection State
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isCreatingBusiness, setIsCreatingBusiness] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [qrSlug, setQrSlug] = useState<string | null>(null);

  // Form State
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  // 1. Fetch locations on mount
  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch("/api/google/locations");
        if (res.ok) {
          const data = await res.json();
          setLocations(data.locations || []);
        }
      } catch (err) {
        console.error("Failed to fetch locations", err);
      } finally {
        setLoadingLocations(false);
      }
    }
    fetchLocations();
  }, []);

  // 2. Handle Location Selection
  const handleCreateBusiness = async () => {
    if (!selectedLocation) return;
    setIsCreatingBusiness(true);
    
    try {
      const res = await fetch("/api/businesses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedLocation),
      });
      
      if (res.ok) {
        const data = await res.json();
        setBusinessId(data.business.id);
        setQrSlug(data.business.qr_slug);
        setStep(2);
      }
    } catch (err) {
      console.error("Failed to create business", err);
    } finally {
      setIsCreatingBusiness(false);
    }
  };

  // 3. Handle saving details
  const handleSaveDetails = async () => {
    if (!businessId) return;
    setIsSavingDetails(true);
    
    try {
      const res = await fetch(`/api/businesses/${businessId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp_business: whatsapp,
          instagram_url: instagram,
        }),
      });
      
      if (res.ok) {
        setStep(3);
      }
    } catch (err) {
      console.error("Failed to save details", err);
    } finally {
      setIsSavingDetails(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress Bar */}
      <div className="mb-12 flex items-center justify-between">
        {[
          { num: 1, title: "Connect Business" },
          { num: 2, title: "Contact Details" },
          { num: 3, title: "Your QR Code" }
        ].map((s, i) => (
          <div key={s.num} className="flex flex-1 items-center">
            <div className={`flex flex-col items-center ${step >= s.num ? "text-primary" : "text-muted"}`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors ${
                step > s.num ? "bg-primary border-primary text-white" : 
                step === s.num ? "border-primary text-primary" : "border-hairline bg-surface-soft"
              }`}>
                {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
              </div>
              <span className="mt-2 text-sm font-medium">{s.title}</span>
            </div>
            {i < 2 && (
              <div className={`mx-4 h-px flex-1 ${step > s.num ? "bg-primary" : "bg-hairline"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Steps Content */}
      <div className="rounded-2xl border border-hairline bg-canvas p-8 shadow-sm">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="mb-2 font-display text-2xl font-medium text-ink">Select your business</h2>
              <p className="mb-8 text-body">Choose the Google Business Profile you want to connect.</p>

              {loadingLocations ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  <p>Fetching your locations from Google...</p>
                </div>
              ) : locations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-hairline bg-surface-soft p-8 text-center">
                  <Building2 className="mx-auto h-12 w-12 text-muted mb-4" />
                  <h3 className="font-medium text-ink mb-2">No locations found</h3>
                  <p className="text-sm text-body mb-4">We couldn't find any Google Business profiles linked to your email.</p>
                  <Button variant="secondary">Refresh Locations</Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {locations.map((loc) => (
                    <div
                      key={loc.googleLocationId}
                      onClick={() => setSelectedLocation(loc)}
                      className={`cursor-pointer rounded-xl border p-5 transition-all ${
                        selectedLocation?.googleLocationId === loc.googleLocationId
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-hairline hover:border-border-strong hover:bg-surface-soft"
                      }`}
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="font-medium text-ink">{loc.name}</h3>
                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          selectedLocation?.googleLocationId === loc.googleLocationId ? "border-primary" : "border-muted"
                        }`}>
                          {selectedLocation?.googleLocationId === loc.googleLocationId && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                      <p className="flex items-center text-sm text-body">
                        <MapPin className="mr-1.5 h-3.5 w-3.5" />
                        {loc.addressLine1}, {loc.city}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <Button 
                  disabled={!selectedLocation || isCreatingBusiness} 
                  onClick={handleCreateBusiness}
                  className="gap-2"
                >
                  {isCreatingBusiness && <Loader2 className="h-4 w-4 animate-spin" />}
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="mb-2 font-display text-2xl font-medium text-ink">Contact Details</h2>
              <p className="mb-8 text-body">Add a WhatsApp number to receive private feedback alerts, and your Instagram to show on the Thank You page.</p>

              <div className="space-y-6 max-w-md">
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink">WhatsApp Business Number</label>
                  <input 
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full rounded-lg border border-hairline px-4 py-2.5 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <p className="mt-1 text-xs text-muted">We'll notify you here if Review Shield catches a bad review.</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-ink">Instagram URL (Optional)</label>
                  <div className="flex items-center rounded-lg border border-hairline focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                    <div className="flex h-10 items-center bg-surface-soft pl-3 pr-2 text-muted border-r border-hairline rounded-l-lg">
                      <LinkIcon className="h-4 w-4" />
                    </div>
                    <input 
                      type="url"
                      placeholder="https://instagram.com/yourbusiness"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="flex-1 rounded-r-lg px-3 py-2.5 text-ink focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button disabled={isSavingDetails} onClick={handleSaveDetails} className="gap-2">
                  {isSavingDetails && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save & Continue <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mb-2 font-display text-2xl font-medium text-ink">You're all set!</h2>
              <p className="mb-8 text-body max-w-md mx-auto">
                Your business has been successfully connected. Print this QR code and place it on your counter to start collecting 5-star reviews.
              </p>

              <div className="my-8 flex justify-center">
                {qrSlug && <QRCode slug={qrSlug} />}
              </div>

              <div className="mt-12 flex justify-center">
                <Button size="lg" asChild>
                  <a href="/dashboard">Go to Dashboard</a>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import type { Business } from '@/app/(dashboard)/dashboard/businesses/[id]/BusinessTabs'

interface Props {
  business: Business
}

export default function CustomisationTab({ business }: Props) {
  const [logoUrl, setLogoUrl] = useState(business.logo_url || '')
  const [primaryColor, setPrimaryColor] = useState(business.brand_color_primary || '#6366F1')
  const [secondaryColor, setSecondaryColor] = useState(business.brand_color_secondary || '#FFFFFF')
  const [tagline, setTagline] = useState(business.review_page_tagline || '')
  const [description, setDescription] = useState(business.description || '')
  const [thankYouMessage, setThankYouMessage] = useState(business.review_page_thank_you_message || '')
  const [frameTitle, setFrameTitle] = useState('')
  const [frameTagline, setFrameTagline] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    const ext = file.name.split('.').pop()
    const path = `${business.id}/logo.${ext}`
    const supabase = createClient()
    const { error } = await supabase.storage.from('logos').upload(path, file, { upsert: true })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(path)
      setLogoUrl(publicUrl)
    }
    setUploadingLogo(false)
  }

  async function handleSave() {
    setSaving(true)
    await fetch(`/api/businesses/${business.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        logo_url: logoUrl,
        brand_color_primary: primaryColor,
        brand_color_secondary: secondaryColor,
        review_page_tagline: tagline,
        description,
        review_page_thank_you_message: thankYouMessage,
        qr_frame_text: frameTagline,
      }),
    })
    setSaving(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Business Logo</h3>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full overflow-hidden flex-shrink-0 bg-accent-light flex items-center justify-center">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <span className="text-accent font-semibold text-xl">{business.name[0]}</span>
              )}
            </div>
            <div>
              <label
                htmlFor="logo-upload"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-hairline rounded-lg text-sm hover:bg-surface-soft transition-colors"
              >
                <Upload className="h-4 w-4" />
                {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
              </label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <p className="text-xs text-muted mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Brand Colours</h3>
          <div className="flex gap-6">
            <div>
              <Label className="text-xs text-muted mb-1 block">Primary</Label>
              <input
                type="color"
                value={primaryColor}
                onChange={e => setPrimaryColor(e.target.value)}
                className="h-10 w-20 rounded-md border border-hairline cursor-pointer"
              />
            </div>
            <div>
              <Label className="text-xs text-muted mb-1 block">Secondary</Label>
              <input
                type="color"
                value={secondaryColor}
                onChange={e => setSecondaryColor(e.target.value)}
                className="h-10 w-20 rounded-md border border-hairline cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Review Page Tagline</h3>
          <div className="space-y-1">
            <Input
              value={tagline}
              onChange={e => setTagline(e.target.value.slice(0, 80))}
              placeholder="e.g. Tell us about your experience!"
            />
            <span className="text-xs text-muted block text-right">{tagline.length}/80</span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Business Description</h3>
          <div className="space-y-1">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value.slice(0, 200))}
              placeholder="A short description of your business..."
              className="w-full min-h-[80px] resize-none rounded-md border border-hairline bg-canvas px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <span className="text-xs text-muted block text-right">{description.length}/200</span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Thank-You Message</h3>
          <div className="space-y-1">
            <Input
              value={thankYouMessage}
              onChange={e => setThankYouMessage(e.target.value.slice(0, 120))}
              placeholder="e.g. Thank you for sharing your feedback!"
            />
            <span className="text-xs text-muted block text-right">{thankYouMessage.length}/120</span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">QR Frame Defaults</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted mb-1 block">Frame Title</Label>
              <Input
                value={frameTitle}
                onChange={e => setFrameTitle(e.target.value)}
                placeholder="e.g. Scan to Review Us"
              />
            </div>
            <div>
              <Label className="text-xs text-muted mb-1 block">Frame Tagline</Label>
              <Input
                value={frameTagline}
                onChange={e => setFrameTagline(e.target.value)}
                placeholder="e.g. We value your feedback!"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors cursor-pointer disabled:opacity-50 mt-6"
        >
          {saving ? 'Saving...' : 'Save Customisation'}
        </button>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Customer Review Page Preview</p>
        <div className="mx-auto max-w-[280px]">
          <div className="rounded-[2rem] border-[6px] border-ink overflow-hidden shadow-lg">
            <div className="bg-white min-h-[400px] p-5">
              {logoUrl && (
                <div className="flex justify-center mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
                </div>
              )}
              <h3 className="text-center font-semibold text-ink text-base">{business.name}</h3>
              {description && (
                <p className="text-center text-xs text-muted mt-1 line-clamp-2">{description}</p>
              )}
              {tagline && (
                <p className="text-center text-sm font-medium mt-3" style={{ color: primaryColor }}>
                  {tagline}
                </p>
              )}
              <div className="flex justify-center gap-2 mt-4">
                {[1, 2, 3, 4, 5].map(s => (
                  <div
                    key={s}
                    className="h-8 w-8 rounded-full border-2 flex items-center justify-center text-sm"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    {s}★
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-muted mt-4">Powered by JustHustle</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

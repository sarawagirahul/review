'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import type { Business } from '@/app/(dashboard)/dashboard/businesses/[id]/BusinessTabs'

interface Props {
  business: Business
}

export default function SettingsTab({ business }: Props) {
  const [contactEmail, setContactEmail] = useState(business.contact_email || '')
  const [contactPhone, setContactPhone] = useState(business.contact_phone || '')
  const [whatsappBusiness, setWhatsappBusiness] = useState(business.whatsapp_business || '')
  const [notifyEmail, setNotifyEmail] = useState(business.notify_email || '')
  const [notifyShieldCatch, setNotifyShieldCatch] = useState(business.notify_shield_catch)
  const [notifyNewReview, setNotifyNewReview] = useState(business.notify_new_review)
  const [notifyWeeklySummary, setNotifyWeeklySummary] = useState(business.notify_weekly_summary)
  const [savingContact, setSavingContact] = useState(false)
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false)
  const [isActive, setIsActive] = useState(business.is_active)

  async function patchField(field: string, value: unknown) {
    await fetch(`/api/businesses/${business.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    })
  }

  async function handleSaveContact() {
    setSavingContact(true)
    await fetch(`/api/businesses/${business.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contact_email: contactEmail,
        contact_phone: contactPhone,
        whatsapp_business: whatsappBusiness,
      }),
    })
    setSavingContact(false)
  }

  async function handleDeactivate() {
    await fetch(`/api/businesses/${business.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: false }),
    })
    setIsActive(false)
    setDeactivateDialogOpen(false)
  }

  async function handleReactivate() {
    await fetch(`/api/businesses/${business.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: true }),
    })
    setIsActive(true)
  }

  return (
    <div>
      <div className="rounded-xl border border-hairline bg-canvas p-5 mb-6">
        <h3 className="text-base font-semibold text-ink mb-4">Business Contact</h3>
        <div className="space-y-4">
          <div>
            <Label className="mb-1 block">Contact Email</Label>
            <Input
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
              type="email"
            />
          </div>
          <div>
            <Label className="mb-1 block">Contact Phone</Label>
            <Input
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
              type="tel"
            />
          </div>
          <div>
            <Label className="mb-1 block">WhatsApp Number</Label>
            <Input
              value={whatsappBusiness}
              onChange={e => setWhatsappBusiness(e.target.value)}
              type="tel"
            />
          </div>
        </div>
        <button
          onClick={handleSaveContact}
          disabled={savingContact}
          className="mt-4 px-5 py-2 bg-ink text-white rounded-lg text-sm font-medium hover:bg-ink/90 transition-colors cursor-pointer disabled:opacity-50"
        >
          {savingContact ? 'Saving...' : 'Save Contact'}
        </button>
      </div>

      <div className="rounded-xl border border-hairline bg-canvas p-5 mb-6">
        <h3 className="text-base font-semibold text-ink mb-4">Notification Preferences</h3>
        <div className="mb-4">
          <Label className="mb-1 block">Notification Email</Label>
          <Input
            value={notifyEmail}
            onChange={e => {
              setNotifyEmail(e.target.value)
              patchField('notify_email', e.target.value)
            }}
            type="email"
          />
        </div>
        <div>
          <div className="flex items-center justify-between py-3 border-b border-hairline last:border-0">
            <div>
              <p className="text-sm font-medium text-ink">Email me when Shield catches a low-rating review</p>
            </div>
            <Switch
              checked={notifyShieldCatch}
              onCheckedChange={v => {
                setNotifyShieldCatch(v)
                patchField('notify_shield_catch', v)
              }}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-hairline last:border-0">
            <div>
              <p className="text-sm font-medium text-ink">Email me when a review is posted via JustHustle</p>
            </div>
            <Switch
              checked={notifyNewReview}
              onCheckedChange={v => {
                setNotifyNewReview(v)
                patchField('notify_new_review', v)
              }}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-hairline last:border-0">
            <div>
              <p className="text-sm font-medium text-ink">Weekly analytics summary</p>
            </div>
            <Switch
              checked={notifyWeeklySummary}
              onCheckedChange={v => {
                setNotifyWeeklySummary(v)
                patchField('notify_weekly_summary', v)
              }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-red-200 bg-red-50/30 p-5">
        <h3 className="text-base font-semibold text-red-700 mb-2">Danger Zone</h3>
        {isActive ? (
          <>
            <p className="text-sm text-muted mb-4">
              Deactivating will disable your QR review page. Customers will see a basic Google review link.
            </p>
            <button
              onClick={() => setDeactivateDialogOpen(true)}
              className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors cursor-pointer"
            >
              Deactivate This Business
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted mb-4">
              This business is currently inactive. Your QR page is showing a basic fallback.
            </p>
            <button
              onClick={handleReactivate}
              className="px-4 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-success/90 transition-colors cursor-pointer"
            >
              Reactivate Business
            </button>
          </>
        )}
      </div>

      <Dialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate This Business?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted">
            This will disable your QR page. Customers will see a basic Google review link. You can reactivate anytime.
          </p>
          <DialogFooter>
            <button
              onClick={() => setDeactivateDialogOpen(false)}
              className="px-4 py-2 border border-hairline rounded-lg text-sm font-medium text-ink hover:bg-surface-soft transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeactivate}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
            >
              Yes, Deactivate
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

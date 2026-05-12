'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
  user: {
    full_name: string
    email: string
    avatar_url: string
  }
  hasBusinesses: boolean
}

export default function ProfileSetupClient({ user, hasBusinesses }: Props) {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [sameAsPhone, setSameAsPhone] = useState(false)
  const [gst, setGst] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSameAsPhone = (checked: boolean) => {
    setSameAsPhone(checked)
    if (checked) setWhatsapp(phone)
  }

  const handlePhoneChange = (value: string) => {
    setPhone(value)
    if (sameAsPhone) setWhatsapp(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!phone.trim()) {
      setError('Phone number is required.')
      return
    }
    if (!sameAsPhone && !whatsapp.trim()) {
      setError('WhatsApp number is required.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          whatsapp_phone: sameAsPhone ? phone.trim() : whatsapp.trim(),
          gst_number: gst.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      router.push(hasBusinesses ? '/dashboard' : '/dashboard/setup')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Wordmark */}
        <div className="text-center mb-8">
          <span className="font-display text-2xl font-bold text-ink tracking-tight">
            JustHustle
          </span>
        </div>

        <div className="rounded-2xl border border-hairline bg-canvas p-8 shadow-subtle">
          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-normal text-ink">Complete your profile</h1>
            <p className="mt-1 text-sm text-muted">
              We need a few details before you get started
            </p>
          </div>

          {/* User info (read-only) */}
          <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-surface-soft">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.full_name}
                width={48}
                height={48}
                className="rounded-full flex-shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center text-accent font-semibold text-lg flex-shrink-0">
                {user.full_name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{user.full_name}</p>
              <p className="text-xs text-muted truncate">{user.email}</p>
              <span className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-muted bg-canvas border border-hairline rounded-full px-2.5 py-1">
                <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Signed in with Google
              </span>
            </div>
          </div>

          <div className="border-t border-hairline mb-6" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="block text-sm font-medium text-ink">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="w-full rounded-lg border border-hairline bg-canvas px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              />
              <p className="text-xs text-muted">For important account notifications</p>
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <label htmlFor="whatsapp" className="block text-sm font-medium text-ink">
                WhatsApp Number
              </label>
              <input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 98765 43210"
                disabled={sameAsPhone}
                className="w-full rounded-lg border border-hairline bg-canvas px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors disabled:opacity-60 disabled:bg-surface-soft cursor-text disabled:cursor-not-allowed"
              />
              <p className="text-xs text-muted">
                We&apos;ll send business alerts here (Phase 2)
              </p>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={sameAsPhone}
                  onChange={(e) => handleSameAsPhone(e.target.checked)}
                  className="w-4 h-4 rounded border-hairline cursor-pointer accent-accent"
                />
                <span className="text-xs text-muted">Same as phone number</span>
              </label>
            </div>

            {/* GST (Optional) */}
            <div className="space-y-1.5">
              <label htmlFor="gst" className="block text-sm font-medium text-ink">
                GST Number{' '}
                <span className="font-normal text-muted">(Optional)</span>
              </label>
              <input
                id="gst"
                type="text"
                value={gst}
                onChange={(e) => setGst(e.target.value.toUpperCase())}
                placeholder="22AAAAA0000A1Z5"
                className="w-full rounded-lg border border-hairline bg-canvas px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors font-mono tracking-wide"
              />
              <p className="text-xs text-muted">
                Used for invoicing — you can update this later
              </p>
            </div>

            {/* Inline error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-signature-coral"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent-hover text-white rounded-xl py-3 text-sm font-semibold cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  'Complete Setup →'
                )}
              </Button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

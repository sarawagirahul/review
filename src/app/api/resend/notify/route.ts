import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/components'
import * as React from 'react'
import { TrialEnding, subject as trialEndingSubject } from '@/emails/TrialEnding'
import { TrialExpired, subject as trialExpiredSubject } from '@/emails/TrialExpired'
import { ShieldCatch, subject as shieldCatchSubject } from '@/emails/ShieldCatch'
import { PaymentFailed, subject as paymentFailedSubject } from '@/emails/PaymentFailed'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM || 'JustHustle <noreply@justhustle.in>'

export async function POST(request: Request) {
  try {
    const { template, to, data } = await request.json()

    if (!template || !to) {
      return NextResponse.json({ error: 'Missing template or to' }, { status: 400 })
    }

    let subject: string
    let html: string

    switch (template) {
      case 'trial_ending': {
        subject = trialEndingSubject(data.daysLeft)
        html = await render(React.createElement(TrialEnding, data))
        break
      }
      case 'trial_expired': {
        subject = trialExpiredSubject
        html = await render(React.createElement(TrialExpired, data))
        break
      }
      case 'shield_catch': {
        subject = shieldCatchSubject(data.businessName)
        html = await render(React.createElement(ShieldCatch, data))
        break
      }
      case 'payment_failed': {
        subject = paymentFailedSubject
        html = await render(React.createElement(PaymentFailed, data))
        break
      }
      case 'subscription_activated': {
        subject = 'Your JustHustle subscription is now active'
        html = `<p>Hi ${data.ownerName},</p><p>Your JustHustle subscription is now active. You have full access to all features.</p><p>Visit your dashboard: <a href="${data.appUrl}/dashboard">${data.appUrl}/dashboard</a></p>`
        break
      }
      case 'subscription_cancelled': {
        subject = 'Your JustHustle subscription has been cancelled'
        html = `<p>Hi ${data.ownerName},</p><p>Your subscription has been cancelled. You can re-subscribe anytime from the billing page.</p><p><a href="${data.appUrl}/dashboard/billing">Go to Billing</a></p>`
        break
      }
      default:
        return NextResponse.json({ error: 'Unknown template' }, { status: 400 })
    }

    const result = await resend.emails.send({ from: FROM, to, subject, html })
    return NextResponse.json({ success: true, id: result.data?.id })
  } catch (error) {
    console.error('Notify error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}

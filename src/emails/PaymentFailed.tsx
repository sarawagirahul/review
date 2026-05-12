import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface PaymentFailedProps {
  ownerName: string
  appUrl: string
}

export const subject = 'Action required — payment failed for JustHustle'

export function PaymentFailed({ ownerName, appUrl }: PaymentFailedProps) {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={{ backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
          <Heading
            style={{
              color: '#0a2e0e',
              fontSize: '28px',
              fontWeight: '700',
              margin: '0 0 4px 0',
            }}
          >
            JustHustle
          </Heading>
          <Text style={{ color: '#E68369', fontSize: '13px', margin: '0 0 24px 0' }}>
            Helping Indian businesses collect more 5-star Google reviews
          </Text>
          <Hr style={{ borderColor: '#e2e8f0', margin: '0 0 24px 0' }} />

          <Section>
            <Text style={{ color: '#181d26', fontSize: '16px', margin: '0 0 16px 0' }}>
              Hi {ownerName},
            </Text>
            <Text style={{ color: '#181d26', fontSize: '16px', margin: '0 0 16px 0' }}>
              We were unable to process your most recent payment for JustHustle. Your subscription
              is now <strong>past due</strong>.
            </Text>
            <Text style={{ color: '#181d26', fontSize: '16px', margin: '0 0 16px 0' }}>
              Please update your payment method to avoid any interruption to your service. If
              payment is not resolved, your access to AI-generated reviews and Review Shield may be
              suspended.
            </Text>
            <Text style={{ color: '#181d26', fontSize: '16px', margin: '0 0 24px 0' }}>
              Update your payment details now to keep your subscription active.
            </Text>

            <Button
              href={`${appUrl}/dashboard/billing`}
              style={{
                backgroundColor: '#E68369',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600',
                display: 'inline-block',
              }}
            >
              Update Payment Method →
            </Button>
          </Section>

          <Hr style={{ borderColor: '#e2e8f0', margin: '32px 0 16px 0' }} />
          <Text style={{ color: '#94a3b8', fontSize: '12px', margin: '0' }}>
            JustHustle — Helping Indian businesses collect more 5-star Google reviews.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default PaymentFailed

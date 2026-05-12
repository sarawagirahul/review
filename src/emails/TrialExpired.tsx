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

interface TrialExpiredProps {
  ownerName: string
  appUrl: string
}

export const subject = 'Your JustHustle trial has ended'

export function TrialExpired({ ownerName, appUrl }: TrialExpiredProps) {
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
              Your JustHustle free trial has ended.
            </Text>
            <Text style={{ color: '#181d26', fontSize: '16px', margin: '0 0 16px 0' }}>
              Your QR pages are currently showing a basic fallback — customers see your business
              name and a direct Google link, but{' '}
              <strong>AI-generated review drafts and Review Shield are disabled</strong>.
            </Text>
            <Text style={{ color: '#181d26', fontSize: '16px', margin: '0 0 24px 0' }}>
              Upgrade to restore full access and get back to collecting 5-star reviews
              effortlessly.
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
              Restore Full Access →
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

export default TrialExpired

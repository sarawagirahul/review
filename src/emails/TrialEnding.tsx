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

interface TrialEndingProps {
  ownerName: string
  daysLeft: number
  trialEndDate: string
  appUrl: string
}

export const subject = (daysLeft: number) =>
  `Your JustHustle trial ends in ${daysLeft} days`

export function TrialEnding({ ownerName, daysLeft, trialEndDate, appUrl }: TrialEndingProps) {
  return (
    <Html>
      <Head />
      <Preview>{subject(daysLeft)}</Preview>
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
              Your JustHustle free trial ends in{' '}
              <strong>{daysLeft} {daysLeft === 1 ? 'day' : 'days'}</strong> on{' '}
              <strong>{trialEndDate}</strong>.
            </Text>
            <Text style={{ color: '#181d26', fontSize: '16px', margin: '0 0 8px 0' }}>
              After your trial expires, you&apos;ll lose access to:
            </Text>
            <Text style={{ color: '#475569', fontSize: '15px', margin: '0 0 6px 0', paddingLeft: '16px' }}>
              • <strong>AI-generated review drafts</strong> — customers will no longer receive personalised review options
            </Text>
            <Text style={{ color: '#475569', fontSize: '15px', margin: '0 0 24px 0', paddingLeft: '16px' }}>
              • <strong>Review Shield</strong> — negative feedback will no longer be intercepted before reaching Google
            </Text>
            <Text style={{ color: '#181d26', fontSize: '16px', margin: '0 0 24px 0' }}>
              Upgrade now to keep everything running without interruption.
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
              Upgrade Now →
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

export default TrialEnding

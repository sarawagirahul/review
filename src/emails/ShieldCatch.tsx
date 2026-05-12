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

interface ShieldCatchProps {
  ownerName: string
  businessName: string
  businessId: string
  rating: number
  message: string
  customerContact?: string
  appUrl: string
}

export const subject = (businessName: string) =>
  `⚠️ New private feedback for ${businessName}`

export function ShieldCatch({
  ownerName,
  businessName,
  businessId,
  rating,
  message,
  customerContact,
  appUrl,
}: ShieldCatchProps) {
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)

  return (
    <Html>
      <Head />
      <Preview>{subject(businessName)}</Preview>
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
              A customer left a{' '}
              <strong>
                {rating}-star
              </strong>{' '}
              private review for <strong>{businessName}</strong>.
            </Text>
            <Text
              style={{
                color: '#f59e0b',
                fontSize: '20px',
                margin: '0 0 20px 0',
                letterSpacing: '2px',
              }}
            >
              {stars}
            </Text>

            {/* Quoted feedback block */}
            <Section
              style={{
                backgroundColor: '#f1f5f9',
                borderLeft: '4px solid #cbd5e1',
                borderRadius: '4px',
                padding: '16px 20px',
                margin: '0 0 20px 0',
              }}
            >
              <Text
                style={{
                  color: '#334155',
                  fontSize: '15px',
                  fontStyle: 'italic',
                  margin: '0',
                  lineHeight: '1.6',
                }}
              >
                &ldquo;{message}&rdquo;
              </Text>
            </Section>

            {customerContact && (
              <Text style={{ color: '#475569', fontSize: '15px', margin: '0 0 20px 0' }}>
                <strong>Customer contact:</strong> {customerContact}
              </Text>
            )}

            <Text
              style={{
                color: '#0a2e0e',
                fontSize: '15px',
                fontWeight: '700',
                margin: '0 0 24px 0',
                padding: '12px 16px',
                backgroundColor: '#dcfce7',
                borderRadius: '6px',
              }}
            >
              This was caught by Review Shield — it was NOT posted to Google.
            </Text>

            <Button
              href={`${appUrl}/dashboard/businesses/${businessId}`}
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
              View in Shield Inbox →
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

export default ShieldCatch

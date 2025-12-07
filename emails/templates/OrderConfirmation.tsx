import { Section, Heading, Text, Button } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from '../components/EmailLayout';
import { OrderTable } from '../components/OrderTable';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { DeliveryInfo } from '../components/DeliveryInfo';
import { getEmailTranslations, type OrderEmailData } from '@/lib/email';

interface OrderConfirmationProps {
  orderData: OrderEmailData;
  locale: string;
}

export function OrderConfirmation({ orderData, locale = 'bg' }: OrderConfirmationProps) {
  const t = getEmailTranslations(locale);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rodasoleil.bg';

  return (
    <EmailLayout locale={locale}>
      {/* Hero Section */}
      <Section style={hero}>
        <Heading style={h1}>{t.thankYou}</Heading>
        <Text style={subtitle}>{t.orderReceived}</Text>
        <Text style={greeting}>
          {t.greeting}, {orderData.customerName}!
        </Text>
      </Section>

      {/* CTA Button */}
      <Section style={buttonContainer}>
        <Button
          style={button}
          href={`${baseUrl}/${locale}/orders/${orderData.orderId || 'pending'}`}
        >
          {t.viewOrderButton}
        </Button>
      </Section>

      {/* Order Table */}
      <OrderTable items={orderData.items} locale={locale} />

      {/* Price Breakdown */}
      <PriceBreakdown
        subtotal={orderData.subtotal}
        discount={orderData.discount}
        shipping={orderData.deliveryPrice}
        total={orderData.total}
        promoCode={orderData.promoCode}
        locale={locale}
      />

      {/* Delivery Info */}
      <DeliveryInfo
        method={orderData.deliveryMethod}
        details={orderData.deliveryDetails}
        locale={locale}
      />

      {/* Customer Info */}
      <Section style={infoSection}>
        <Heading as="h2" style={h2}>
          {t.customerInfo}
        </Heading>
        <Text style={infoText}>{orderData.customerName}</Text>
        <Text style={infoText}>{orderData.customerEmail}</Text>
        <Text style={infoText}>{orderData.customerPhone}</Text>
      </Section>

      {/* Notes */}
      {orderData.notes && (
        <Section style={notesSection}>
          <Text style={notesLabel}>{t.notes}:</Text>
          <Text style={notesText}>{orderData.notes}</Text>
        </Section>
      )}

      {/* Thank You Message */}
      <Section style={thanksSection}>
        <Text style={thanksText}>
          {locale === 'bg' && 'Благодарим Ви, че избрахте RODASOLEIL!'}
          {locale === 'ru' && 'Спасибо, что выбрали RODASOLEIL!'}
          {locale === 'en' && 'Thank you for choosing RODASOLEIL!'}
        </Text>
      </Section>
    </EmailLayout>
  );
}

// Стили в духе RODA Soleil
const hero = {
  padding: '40px 20px',
  textAlign: 'center' as const,
  backgroundColor: '#FAF8F4',
  borderRadius: '0',
  marginBottom: '32px',
  borderBottom: '2px solid rgba(208, 102, 52, 0.2)',
};

const h1 = {
  color: '#2A2422',
  fontSize: '32px',
  fontWeight: '600',
  margin: '0 0 16px',
  lineHeight: '40px',
  letterSpacing: '-0.5px',
};

const subtitle = {
  fontSize: '16px',
  color: '#666',
  margin: '0 0 8px',
  lineHeight: '24px',
};

const greeting = {
  fontSize: '18px',
  color: '#2A2422',
  margin: '20px 0 0',
  lineHeight: '28px',
  fontWeight: '500',
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginBottom: '40px',
  marginTop: '32px',
};

const button = {
  backgroundColor: '#d06634',
  borderRadius: '36px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '16px 40px',
  display: 'inline-block',
  lineHeight: '24px',
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
};

const infoSection = {
  backgroundColor: '#FAF8F4',
  borderRadius: '4px',
  padding: '24px',
  marginTop: '24px',
  marginBottom: '24px',
  border: '1px solid rgba(208, 102, 52, 0.15)',
};

const h2 = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#2A2422',
  margin: '0 0 16px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const infoText = {
  fontSize: '15px',
  color: '#2A2422',
  margin: '8px 0',
  lineHeight: '22px',
};

const notesSection = {
  backgroundColor: '#FAF8F4',
  borderRadius: '4px',
  padding: '20px',
  marginTop: '24px',
  marginBottom: '24px',
  borderLeft: '4px solid #d06634',
};

const notesLabel = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#d06634',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const notesText = {
  fontSize: '15px',
  color: '#2A2422',
  margin: '0',
  lineHeight: '22px',
};

const thanksSection = {
  textAlign: 'center' as const,
  marginTop: '40px',
  padding: '24px 0',
};

const thanksText = {
  fontSize: '16px',
  color: '#666',
  margin: '0',
  fontStyle: 'normal',
  fontWeight: '500',
};

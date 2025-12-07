import { Section, Row, Column, Text, Hr } from '@react-email/components';
import * as React from 'react';
import { getEmailTranslations } from '@/lib/email';

interface PriceBreakdownProps {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode?: string;
  locale: string;
}

export function PriceBreakdown({
  subtotal,
  discount,
  shipping,
  total,
  promoCode,
  locale,
}: PriceBreakdownProps) {
  const t = getEmailTranslations(locale);

  return (
    <Section style={container}>
      {/* Subtotal */}
      <Row style={row}>
        <Column style={labelColumn}>
          <Text style={label}>{t.subtotal}</Text>
        </Column>
        <Column style={valueColumn}>
          <Text style={value}>€{subtotal.toFixed(2)}</Text>
        </Column>
      </Row>

      {/* Discount */}
      {discount > 0 && promoCode && (
        <Row style={row}>
          <Column style={labelColumn}>
            <Text style={label}>
              {t.discount} ({promoCode})
            </Text>
          </Column>
          <Column style={valueColumn}>
            <Text style={discountValue}>-€{discount.toFixed(2)}</Text>
          </Column>
        </Row>
      )}

      {/* Shipping */}
      <Row style={row}>
        <Column style={labelColumn}>
          <Text style={label}>{t.shipping}</Text>
        </Column>
        <Column style={valueColumn}>
          <Text style={value}>€{shipping.toFixed(2)}</Text>
        </Column>
      </Row>

      <Hr style={divider} />

      {/* Total */}
      <Row style={row}>
        <Column style={labelColumn}>
          <Text style={totalLabel}>{t.total}</Text>
        </Column>
        <Column style={valueColumn}>
          <Text style={totalValue}>€{total.toFixed(2)}</Text>
        </Column>
      </Row>

      {/* Savings Highlight */}
      {discount > 0 && (
        <Row style={savingsRow}>
          <Column>
            <Text style={savingsText}>
              {t.youSaved}: €{discount.toFixed(2)}
            </Text>
          </Column>
        </Row>
      )}
    </Section>
  );
}

// Стили
const container = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '24px',
  marginBottom: '24px',
};

const row = {
  marginBottom: '12px',
};

const labelColumn = {
  width: '60%',
  verticalAlign: 'middle' as const,
};

const valueColumn = {
  width: '40%',
  textAlign: 'right' as const,
  verticalAlign: 'middle' as const,
};

const label = {
  margin: '0',
  fontSize: '14px',
  color: '#6b7280',
  lineHeight: '20px',
};

const value = {
  margin: '0',
  fontSize: '14px',
  color: '#1f2937',
  fontWeight: '500',
  lineHeight: '20px',
};

const discountValue = {
  margin: '0',
  fontSize: '14px',
  color: '#16a34a',
  fontWeight: '600',
  lineHeight: '20px',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '16px 0',
};

const totalLabel = {
  margin: '0',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1f2937',
  lineHeight: '24px',
};

const totalValue = {
  margin: '0',
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1f2937',
  lineHeight: '28px',
};

const savingsRow = {
  marginTop: '16px',
  textAlign: 'center' as const,
};

const savingsText = {
  margin: '0',
  fontSize: '14px',
  color: '#16a34a',
  fontWeight: '600',
  backgroundColor: '#dcfce7',
  padding: '8px 16px',
  borderRadius: '6px',
  display: 'inline-block',
};

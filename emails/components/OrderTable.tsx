import { Section, Row, Column, Img, Text } from '@react-email/components';
import * as React from 'react';
import { getEmailTranslations } from '@/lib/email';

interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image?: string;
}

interface OrderTableProps {
  items: OrderItem[];
  locale: string;
}

export function OrderTable({ items, locale }: OrderTableProps) {
  const t = getEmailTranslations(locale);

  return (
    <Section style={container}>
      <Text style={heading}>{t.orderDetails}</Text>

      {/* Table Header */}
      <Row style={tableHeader}>
        <Column style={columnProduct}>{t.productName}</Column>
        <Column style={columnQuantity}>{t.quantity}</Column>
        <Column style={columnPrice}>{t.price}</Column>
      </Row>

      {/* Table Rows */}
      {items.map((item, index) => (
        <div key={index}>
          <Row style={tableRow}>
            {/* Product Column with Image and Name */}
            <Column style={columnProduct}>
              <Row>
                {item.image && (
                  <Column style={{ width: '64px', paddingRight: '12px' }}>
                    <Img
                      src={item.image}
                      width="64"
                      height="64"
                      alt={item.name}
                      style={productImage}
                    />
                  </Column>
                )}
                <Column>
                  <Text style={productName}>{item.name}</Text>
                  {item.size && (
                    <Text style={productDetail}>
                      {t.size}: {item.size}
                    </Text>
                  )}
                  {item.color && (
                    <Text style={productDetail}>
                      {t.color}: {item.color}
                    </Text>
                  )}
                </Column>
              </Row>
            </Column>

            {/* Quantity Column */}
            <Column style={columnQuantity}>
              <Text style={cellText}>{item.quantity}</Text>
            </Column>

            {/* Price Column */}
            <Column style={columnPrice}>
              <Text style={cellText}>€{(item.price * item.quantity).toFixed(2)}</Text>
            </Column>
          </Row>

          {index < items.length - 1 && <hr style={rowDivider} />}
        </div>
      ))}
    </Section>
  );
}

// Стили
const container = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  padding: '20px',
  marginTop: '24px',
  marginBottom: '24px',
};

const heading = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 16px',
};

const tableHeader = {
  borderBottom: '2px solid #e5e7eb',
  paddingBottom: '12px',
  marginBottom: '12px',
};

const tableRow = {
  paddingTop: '12px',
  paddingBottom: '12px',
};

const columnProduct = {
  width: '50%',
  verticalAlign: 'top',
};

const columnQuantity = {
  width: '20%',
  textAlign: 'center' as const,
  verticalAlign: 'middle' as const,
};

const columnPrice = {
  width: '30%',
  textAlign: 'right' as const,
  verticalAlign: 'middle' as const,
};

const productImage = {
  borderRadius: '8px',
  objectFit: 'cover' as const,
  border: '1px solid #e5e7eb',
};

const productName = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#1f2937',
  margin: '0 0 4px',
};

const productDetail = {
  fontSize: '12px',
  color: '#6b7280',
  margin: '2px 0',
};

const cellText = {
  fontSize: '14px',
  color: '#1f2937',
  margin: '0',
};

const rowDivider = {
  borderColor: '#e5e7eb',
  margin: '0',
  borderWidth: '1px 0 0 0',
};

import { Section, Text } from '@react-email/components';
import * as React from 'react';
import { getEmailTranslations } from '@/lib/email';

interface DeliveryDetails {
  econtOfficeId?: number;
  econtOfficeCode?: string;
  econtOfficeName?: string;
  city?: string;
  cityId?: number;
  postalCode?: string;
  address?: string;
}

interface DeliveryInfoProps {
  method: string;
  details: DeliveryDetails;
  locale: string;
}

export function DeliveryInfo({ method, details, locale }: DeliveryInfoProps) {
  const t = getEmailTranslations(locale);

  return (
    <Section style={container}>
      <Text style={heading}>{t.deliveryInfo}</Text>

      {/* Delivery Method */}
      <Text style={label}>{t.deliveryMethod}:</Text>
      <Text style={value}>
        {method === 'econt_office'
          ? t.econtOffice
          : method === 'econt_address'
          ? t.econtAddress
          : t.pickup}
      </Text>

      {/* Econt Office Details */}
      {method === 'econt_office' && (
        <>
          {details.econtOfficeName && (
            <>
              <Text style={label}>Офис:</Text>
              <Text style={value}>{details.econtOfficeName}</Text>
            </>
          )}
          {details.econtOfficeCode && (
            <>
              <Text style={label}>Код офиса:</Text>
              <Text style={value}>{details.econtOfficeCode}</Text>
            </>
          )}
          {details.city && (
            <>
              <Text style={label}>Град:</Text>
              <Text style={value}>{details.city}</Text>
            </>
          )}
        </>
      )}

      {/* Address Delivery Details */}
      {method === 'econt_address' && (
        <>
          {details.city && (
            <>
              <Text style={label}>Град:</Text>
              <Text style={value}>{details.city}</Text>
            </>
          )}
          {details.postalCode && (
            <>
              <Text style={label}>Пощенски код:</Text>
              <Text style={value}>{details.postalCode}</Text>
            </>
          )}
          {details.address && (
            <>
              <Text style={label}>Адрес:</Text>
              <Text style={value}>{details.address}</Text>
            </>
          )}
        </>
      )}

      {/* Pickup Details */}
      {method === 'pickup_burgas' && (
        <>
          <Text style={infoBox}>
            Самовземане от нашия магазин в Бургас.
            Ние ще се свържем с вас за уточняване на място и време за получаване.
          </Text>
        </>
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

const heading = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 16px',
};

const label = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '12px 0 4px',
};

const value = {
  fontSize: '14px',
  color: '#1f2937',
  margin: '0 0 8px',
  lineHeight: '20px',
};

const infoBox = {
  fontSize: '14px',
  color: '#1f2937',
  backgroundColor: '#fef3c7',
  padding: '12px',
  borderRadius: '6px',
  marginTop: '12px',
  lineHeight: '20px',
};

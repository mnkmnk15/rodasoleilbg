import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Hr,
  Text,
  Link,
} from '@react-email/components';
import * as React from 'react';

interface EmailLayoutProps {
  children: React.ReactNode;
  locale?: string;
}

export function EmailLayout({ children, locale = 'bg' }: EmailLayoutProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rodasoleil.bg';

  const footerText = {
    bg: {
      contact: 'Свържете се с нас',
      phone: 'Телефон',
      email: 'Имейл',
      followUs: 'Последвайте ни',
      returnPolicy: 'Условия за връщане',
      unsubscribe: 'Отпишете се от известията',
    },
    ru: {
      contact: 'Свяжитесь с нами',
      phone: 'Телефон',
      email: 'Email',
      followUs: 'Следите за нами',
      returnPolicy: 'Условия возврата',
      unsubscribe: 'Отписаться от уведомлений',
    },
    en: {
      contact: 'Contact us',
      phone: 'Phone',
      email: 'Email',
      followUs: 'Follow us',
      returnPolicy: 'Return policy',
      unsubscribe: 'Unsubscribe from notifications',
    },
  };

  const t = footerText[locale as keyof typeof footerText] || footerText.bg;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Img
              src="https://github.com/mnkmnk15/rsoleilvideo/blob/main/logo_RDS_2024_.png?raw=true"
              width="180"
              height="60"
              alt="RODASOLEIL"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>
            {children}
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerHeading}>{t.contact}</Text>
            <Text style={footerTextStyle}>
              {t.email}: <Link href="mailto:rodasoleilbg@gmail.com" style={link}>rodasoleilbg@gmail.com</Link>
            </Text>
            <Text style={footerTextStyle}>
              {t.phone}: +359 896 235 961
            </Text>

            <Text style={footerHeading}>{t.followUs}</Text>
            <Text style={footerTextStyle}>
              <Link href="https://www.instagram.com/rodasoleil.bg/" style={link}>Instagram</Link> • {' '}
              <Link href="https://www.facebook.com/people/Rodasoleilbulgaria/61550255667531/" style={link}>Facebook</Link>
            </Text>

            <Hr style={footerDivider} />

            <Text style={footerSmall}>
              © 2025 RODASOLEIL Bulgaria. All rights reserved.
            </Text>
            <Text style={footerSmall}>
              <Link href="https://www.rodasoleil.bg/bg#shipping-returns" style={mutedLink}>{t.returnPolicy}</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Стили в духе RODA Soleil - Fresh Luxury Coastal
const main = {
  backgroundColor: '#FAF8F4', // --background
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  WebkitFontSmoothing: 'antialiased' as const,
  MozOsxFontSmoothing: 'grayscale' as const,
};

const container = {
  backgroundColor: '#FFFFFF', // --pure-white
  margin: '0 auto',
  padding: '20px 0',
  marginBottom: '64px',
  maxWidth: '600px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)', // --shadow-medium
};

const header = {
  padding: '40px 20px',
  textAlign: 'center' as const,
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid rgba(208, 102, 52, 0.15)',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const content = {
  padding: '0 20px 32px',
};

const divider = {
  borderColor: 'rgba(208, 102, 52, 0.25)', // --line-gold
  margin: '24px 0',
};

const footer = {
  padding: '24px 20px',
  backgroundColor: '#FAF8F4',
  color: '#2A2422', // --foreground
};

const footerHeading = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#2A2422',
  margin: '16px 0 8px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const footerTextStyle = {
  fontSize: '14px',
  lineHeight: '22px',
  margin: '6px 0',
  color: '#2A2422',
};

const footerDivider = {
  borderColor: 'rgba(208, 102, 52, 0.25)',
  margin: '16px 0',
};

const footerSmall = {
  fontSize: '12px',
  lineHeight: '18px',
  color: '#666',
  margin: '4px 0',
  textAlign: 'center' as const,
};

const link = {
  color: '#d06634', // --subtle-gold
  textDecoration: 'none',
  fontWeight: '500',
};

const mutedLink = {
  color: '#666',
  textDecoration: 'none',
};

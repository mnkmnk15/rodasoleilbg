import Script from 'next/script';

interface StructuredDataProps {
  locale: string;
}

export default function StructuredData({ locale }: StructuredDataProps) {
  // Данные организации
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': 'https://rodasoleil.bg/#organization',
    name: 'RoDaSoleil Bulgaria',
    alternateName: 'Roda Soleil',
    url: 'https://rodasoleil.bg',
    logo: 'https://rodasoleil.bg/logo.png',
    image: 'https://rodasoleil.bg/og-image.jpg',
    description:
      locale === 'bg'
        ? 'Премиум дамски и мъжки бански с tan-through технология. Дамска плажна облекла: панталони, поли, шорти, халати, шалове. Безплатна доставка в България.'
        : 'Premium swimwear with tan-through technology',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BG',
      addressLocality: 'София',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Bulgarian', 'Russian', 'English'],
    },
    sameAs: [
      'https://www.instagram.com/rodasoleil.bg/',
      'https://www.facebook.com/people/Rodasoleilbulgaria/61550255667531/',
    ],
    priceRange: '$$',
  };

  // Данные веб-сайта
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://rodasoleil.bg/#website',
    url: 'https://rodasoleil.bg',
    name: 'RoDaSoleil Bulgaria',
    description:
      locale === 'bg'
        ? 'Купи дамски бански, мъжки шорти за плаж, детски купальници в България. Дамска плажна облекла с tan-through технология.'
        : 'Buy premium swimwear in Bulgaria',
    publisher: {
      '@id': 'https://rodasoleil.bg/#organization',
    },
    inLanguage: [locale],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://rodasoleil.bg/${locale}/catalog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Данные для хлебных крошек (breadcrumb)
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'bg' ? 'Начало' : 'Home',
        item: `https://rodasoleil.bg/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'bg' ? 'Каталог' : 'Catalog',
        item: `https://rodasoleil.bg/${locale}/catalog`,
      },
    ],
  };

  // Данные о товарной категории
  const productCategoryData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `https://rodasoleil.bg/${locale}/catalog`,
    name: locale === 'bg' ? 'Каталог бански' : 'Swimwear Catalog',
    description:
      locale === 'bg'
        ? 'Дамски бански, мъжки шорти, детски купальници и плажна облекла с tan-through технология'
        : 'Swimwear collection with tan-through technology',
    url: `https://rodasoleil.bg/${locale}/catalog`,
    isPartOf: {
      '@id': 'https://rodasoleil.bg/#website',
    },
    about: {
      '@type': 'Thing',
      name:
        locale === 'bg' ? 'Бански и плажна облекла' : 'Swimwear and beachwear',
    },
  };

  // Локальный бизнес
  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': 'https://rodasoleil.bg/#store',
    name: 'RoDaSoleil Bulgaria',
    image: 'https://rodasoleil.bg/og-image.jpg',
    description:
      locale === 'bg'
        ? 'Онлайн магазин за дамски и мъжки бански с tan-through технология в България'
        : 'Online swimwear store in Bulgaria',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 42.6977,
      longitude: 23.3219,
    },
    url: 'https://rodasoleil.bg',
    telephone: '+359-XXX-XXX-XXX',
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    paymentAccepted: 'Cash, Credit Card, Debit Card',
    currenciesAccepted: 'BGN, EUR',
  };

  return (
    <>
      <Script
        id="structured-data-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <Script
        id="structured-data-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <Script
        id="structured-data-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <Script
        id="structured-data-product-category"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productCategoryData),
        }}
      />
      <Script
        id="structured-data-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
      />
    </>
  );
}

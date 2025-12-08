import Script from 'next/script';

interface StructuredDataProps {
  locale: string;
}

export default function StructuredData({ locale }: StructuredDataProps) {
  // Данные организации
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': 'https://www.rodasoleil.bg/#organization',
    name: 'RoDaSoleil Bulgaria',
    alternateName: 'Roda Soleil',
    url: 'https://www.rodasoleil.bg',
    logo: 'https://www.rodasoleil.bg/logo.png',
    image: 'https://www.rodasoleil.bg/og-image.jpg',
    description:
      locale === 'bg'
        ? 'Умни бански с tan-through технология за равномерен загар. Дамски, мъжки и детски бански. UV защита SPF 35+. Бърза доставка с Еконт в България.'
        : locale === 'ru'
        ? 'Умные купальники с tan-through технологией для равномерного загара. Женские, мужские и детские купальники. UV защита SPF 35+. Быстрая доставка Econt.'
        : 'Smart swimwear with tan-through technology for even tan. Women, men and kids swimwear. UV protection SPF 35+. Fast delivery with Econt in Bulgaria.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BG',
      addressLocality: 'Бургас',
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
    '@id': 'https://www.rodasoleil.bg/#website',
    url: 'https://www.rodasoleil.bg',
    name: 'RoDaSoleil Bulgaria',
    description:
      locale === 'bg'
        ? 'Купи умни бански с tan-through технология в България. Дамски, мъжки и детски бански с UV защита SPF 35+.'
        : locale === 'ru'
        ? 'Купить умные купальники с tan-through технологией в Болгарии. Женские, мужские и детские купальники с UV защитой SPF 35+.'
        : 'Buy smart swimwear with tan-through technology in Bulgaria. Women, men and kids swimwear with UV protection SPF 35+.',
    publisher: {
      '@id': 'https://www.rodasoleil.bg/#organization',
    },
    inLanguage: [locale],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://www.rodasoleil.bg/${locale}/catalog?search={search_term_string}`,
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
        name: locale === 'bg' ? 'Начало' : locale === 'ru' ? 'Главная' : 'Home',
        item: `https://www.rodasoleil.bg/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'bg' ? 'Каталог' : locale === 'ru' ? 'Каталог' : 'Catalog',
        item: `https://www.rodasoleil.bg/${locale}/catalog`,
      },
    ],
  };

  // Данные о товарной категории
  const productCategoryData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `https://www.rodasoleil.bg/${locale}/catalog`,
    name: locale === 'bg' ? 'Каталог бански' : 'Swimwear Catalog',
    description:
      locale === 'bg'
        ? 'Умни бански с tan-through технология - пропускат слънцето за равномерен загар. Дамски, мъжки и детски бански.'
        : locale === 'ru'
        ? 'Умные купальники с tan-through технологией - пропускают солнце для равномерного загара. Женские, мужские и детские купальники.'
        : 'Smart swimwear with tan-through technology - let sun through for even tan. Women, men and kids swimwear.',
    url: `https://www.rodasoleil.bg/${locale}/catalog`,
    isPartOf: {
      '@id': 'https://www.rodasoleil.bg/#website',
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
    '@id': 'https://www.rodasoleil.bg/#store',
    name: 'RoDaSoleil Bulgaria',
    image: 'https://www.rodasoleil.bg/og-image.jpg',
    description:
      locale === 'bg'
        ? 'Онлайн магазин за умни бански с tan-through технология в България. Дамски, мъжки и детски бански с UV защита.'
        : locale === 'ru'
        ? 'Интернет-магазин умных купальников с tan-through технологией в Болгарии. Женские, мужские и детские купальники с UV защитой.'
        : 'Online store for smart swimwear with tan-through technology in Bulgaria. Women, men and kids swimwear with UV protection.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 42.5048,
      longitude: 27.4626,
    },
    url: 'https://www.rodasoleil.bg',
    telephone: '+359896235961',
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

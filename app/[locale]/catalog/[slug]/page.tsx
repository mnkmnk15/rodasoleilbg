import { Metadata } from 'next';
import { createClient } from '@sanity/client';
import ProductClient from './ProductClient';

// Sanity client for metadata generation
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7bepndor',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// Fetch product data for metadata
async function getProductForMetadata(slug: string) {
  const query = `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    shortDescription,
    description,
    "images": images[].asset->url,
    price,
    compareAtPrice,
    inStock,
    category->{
      name,
      slug
    },
    gender,
    productType
  }`;

  return await sanityClient.fetch(query, { slug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rodasoleil.bg';

  const product = await getProductForMetadata(slug);

  if (!product) {
    return {
      title: locale === 'bg' ? 'Продуктът не е намерен | RoDaSoleil' : locale === 'ru' ? 'Товар не найден | RoDaSoleil' : 'Product Not Found | RoDaSoleil',
    };
  }

  const productName = product.name[locale] || product.name.bg || product.name.en;
  const productDescription = product.shortDescription?.[locale] || product.description?.[locale] || product.shortDescription?.bg || '';

  // Gender-specific keywords
  const genderKeywords: Record<string, Record<string, string[]>> = {
    women: {
      bg: ['дамски бански', 'дамски купальници', 'бикини', 'цял бански дамски'],
      ru: ['женские купальники', 'бикини', 'слитные купальники женские'],
      en: ['women swimwear', 'bikini', 'one-piece swimsuit'],
    },
    mens: {
      bg: ['мъжки бански', 'мъжки шорти за плаж', 'мъжки плажни шорти'],
      ru: ['мужские купальники', 'мужские пляжные шорты'],
      en: ['men swimwear', 'men swim shorts'],
    },
    kids: {
      bg: ['детски бански', 'детски купальници', 'бански за деца'],
      ru: ['детские купальники', 'купальники для детей'],
      en: ['kids swimwear', 'children swimwear'],
    },
  };

  const gender = product.gender || 'women';
  const genderKw = genderKeywords[gender]?.[locale] || genderKeywords.women.bg;

  const title = `${productName} | ${locale === 'bg' ? 'Купи онлайн' : locale === 'ru' ? 'Купить онлайн' : 'Buy Online'} | RoDaSoleil`;
  const description = productDescription
    ? `${productDescription.slice(0, 140)}... ${locale === 'bg' ? 'Бърза доставка с Еконт.' : locale === 'ru' ? 'Быстрая доставка Econt.' : 'Fast delivery with Econt.'}`
    : `${productName} - ${locale === 'bg' ? 'Умен бански с tan-through технология. UV защита SPF 35+. Бърза доставка с Еконт.' : locale === 'ru' ? 'Умный купальник с tan-through технологией. UV защита SPF 35+. Быстрая доставка Econt.' : 'Smart swimwear with tan-through technology. UV protection SPF 35+. Fast delivery with Econt.'}`;

  const keywords = [
    productName,
    ...genderKw,
    'умни бански',
    'tan-through',
    'UV защита',
    'RoDaSoleil',
    locale === 'bg' ? 'бански българия' : locale === 'ru' ? 'купальники болгария' : 'swimwear bulgaria',
  ];

  const productImage = product.images?.[0] || `${baseUrl}/images/category-women.webp`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${baseUrl}/${locale}/catalog/${slug}`,
      languages: {
        bg: `${baseUrl}/bg/catalog/${slug}`,
        ru: `${baseUrl}/ru/catalog/${slug}`,
        en: `${baseUrl}/en/catalog/${slug}`,
      },
    },
    openGraph: {
      title: productName,
      description,
      url: `${baseUrl}/${locale}/catalog/${slug}`,
      type: 'website',
      images: [
        {
          url: productImage,
          width: 800,
          height: 1000,
          alt: productName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: productName,
      description,
      images: [productImage],
    },
  };
}

// Generate Product structured data (JSON-LD)
async function getProductStructuredData(slug: string, locale: string) {
  const product = await getProductForMetadata(slug);

  if (!product) return null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rodasoleil.bg';
  const productName = product.name[locale] || product.name.bg;
  const productDescription = product.shortDescription?.[locale] || product.description?.[locale] || '';
  const productImage = product.images?.[0] || `${baseUrl}/images/category-women.webp`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: productDescription,
    image: product.images || [productImage],
    brand: {
      '@type': 'Brand',
      name: 'RoDaSoleil',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/${locale}/catalog/${slug}`,
      priceCurrency: 'EUR',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'RoDaSoleil Bulgaria',
      },
    },
    category: product.category?.name?.[locale] || 'Swimwear',
    ...(product.compareAtPrice && product.compareAtPrice > product.price && {
      offers: {
        '@type': 'Offer',
        url: `${baseUrl}/${locale}/catalog/${slug}`,
        priceCurrency: 'EUR',
        price: product.price,
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: product.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'RoDaSoleil Bulgaria',
        },
        discount: {
          '@type': 'PriceSpecification',
          price: product.compareAtPrice,
          priceCurrency: 'EUR',
        },
      },
    }),
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  const structuredData = await getProductStructuredData(slug, locale);

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <ProductClient />
    </>
  );
}

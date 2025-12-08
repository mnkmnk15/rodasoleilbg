import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { Suspense } from 'react';
import CatalogClient from './CatalogClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rodasoleil.bg';

  const titles: Record<string, string> = {
    bg: 'Каталог Бански | Дамски, Мъжки и Детски Бански България | RoDaSoleil',
    ru: 'Каталог Купальников | Женские, Мужские и Детские Купальники | RoDaSoleil',
    en: 'Swimwear Catalog | Women\'s, Men\'s & Kids Swimwear | RoDaSoleil',
  };

  const descriptions: Record<string, string> = {
    bg: 'Разгледайте нашия каталог с умни бански с tan-through технология. Дамски бански, мъжки шорти за плаж, детски купальници. Бърза доставка в цяла България с Еконт. UV защита SPF 35+.',
    ru: 'Каталог умных купальников с tan-through технологией. Женские купальники, мужские пляжные шорты, детские купальники. Быстрая доставка по Болгарии курьером Econt. UV защита SPF 35+.',
    en: 'Browse our smart swimwear catalog with tan-through technology. Women\'s swimsuits, men\'s swim shorts, kids\' swimwear. Fast delivery across Bulgaria with Econt. UV protection SPF 35+.',
  };

  const keywords: Record<string, string[]> = {
    bg: [
      'каталог бански', 'дамски бански', 'мъжки бански', 'детски бански',
      'умни бански', 'tan-through бански', 'бански българия',
      'купальници онлайн', 'плажна мода', 'бикини', 'цял бански',
      'бански с UV защита', 'луксозни бански'
    ],
    ru: [
      'каталог купальников', 'женские купальники', 'мужские купальники', 'детские купальники',
      'умные купальники', 'tan-through купальники', 'купальники болгария',
      'пляжная мода', 'бикини', 'слитные купальники', 'купальники с UV защитой'
    ],
    en: [
      'swimwear catalog', 'women swimwear', 'men swimwear', 'kids swimwear',
      'smart swimwear', 'tan-through swimwear', 'swimwear bulgaria',
      'beach fashion', 'bikini', 'one-piece swimsuit', 'UV protection swimwear'
    ],
  };

  return {
    title: titles[locale] || titles.bg,
    description: descriptions[locale] || descriptions.bg,
    keywords: keywords[locale] || keywords.bg,
    alternates: {
      canonical: `${baseUrl}/${locale}/catalog`,
      languages: {
        bg: `${baseUrl}/bg/catalog`,
        ru: `${baseUrl}/ru/catalog`,
        en: `${baseUrl}/en/catalog`,
      },
    },
    openGraph: {
      title: titles[locale] || titles.bg,
      description: descriptions[locale] || descriptions.bg,
      url: `${baseUrl}/${locale}/catalog`,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/images/category-women.webp`,
          width: 1200,
          height: 630,
          alt: locale === 'bg' ? 'Каталог бански RoDaSoleil' : locale === 'ru' ? 'Каталог купальников RoDaSoleil' : 'RoDaSoleil Swimwear Catalog',
        },
      ],
    },
  };
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
    </div>}>
      <CatalogClient />
    </Suspense>
  );
}

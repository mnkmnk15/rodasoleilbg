import { MetadataRoute } from 'next';
import { createClient } from '@sanity/client';

// Sanity client for sitemap (server-side only)
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7bepndor',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

// Fetch all product slugs from Sanity
async function getAllProductSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const query = `*[_type == "product"] {
      "slug": slug.current,
      "updatedAt": _updatedAt
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching product slugs for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rodasoleil.bg';
  const locales = ['bg', 'ru', 'en'];

  // Основные страницы
  const mainPages = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/catalog', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/about', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/contacts', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFreq: 'yearly' as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Генерируем записи для основных страниц на всех языках
  locales.forEach(locale => {
    mainPages.forEach(page => {
      entries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
        alternates: {
          languages: {
            bg: `${baseUrl}/bg${page.path}`,
            ru: `${baseUrl}/ru${page.path}`,
            en: `${baseUrl}/en${page.path}`,
          },
        },
      });
    });
  });

  // Добавляем корневую страницу с редиректом на болгарский
  entries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
    alternates: {
      languages: {
        bg: `${baseUrl}/bg`,
        ru: `${baseUrl}/ru`,
        en: `${baseUrl}/en`,
      },
    },
  });

  // Получаем все товары из Sanity и добавляем их в sitemap
  const products = await getAllProductSlugs();

  products.forEach(product => {
    locales.forEach(locale => {
      entries.push({
        url: `${baseUrl}/${locale}/catalog/${product.slug}`,
        lastModified: new Date(product.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            bg: `${baseUrl}/bg/catalog/${product.slug}`,
            ru: `${baseUrl}/ru/catalog/${product.slug}`,
            en: `${baseUrl}/en/catalog/${product.slug}`,
          },
        },
      });
    });
  });

  return entries;
}

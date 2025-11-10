import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rodasoleil.bg';
  const locales = ['bg', 'ru', 'en'];

  // Основные страницы
  const mainPages = [
    '',
    '/catalog',
    '/about',
    '/contacts',
    '/privacy',
  ];

  // Генерируем записи для всех языков
  const entries: MetadataRoute.Sitemap = [];

  locales.forEach(locale => {
    mainPages.forEach(page => {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            bg: `${baseUrl}/bg${page}`,
            ru: `${baseUrl}/ru${page}`,
            en: `${baseUrl}/en${page}`,
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

  return entries;
}

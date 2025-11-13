import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'RoDaSoleil България - Дамски и Мъжки Бански | Купи Купальници Онлайн',
  description: 'Купи дамски бански, мъжки шорти за плаж, детски купальници в България. Дамска плажна облекла: панталони, поли, шорти, халати, шалове. Tan-through технология, UV защита SPF 35+. Безплатна доставка!',
  keywords: [
    // Основни ключови думи за бански
    'бански',
    'бански костюми',
    'купальници',
    'купальник',
    'дамски бански',
    'дамски купальници',
    'мъжки бански',
    'детски бански',
    // Одежда женская
    'дамска плажна облекла',
    'плажни панталони',
    'плажни поли',
    'плажни шорти',
    'плажни халати',
    'плажни шалове',
    'парео',
    'туника за плаж',
    // Специфични модели
    'цял бански',
    'бикини',
    'tankini',
    'монокини',
    'бански с висока талия',
    // Характеристики продуктов
    'tan-through',
    'UV защита',
    'италиански бански',
    'луксозни бански',
    'дизайнерски бански',
    // География
    'бански българия',
    'купальници българия',
    'онлайн магазин бански',
    'плажна мода българия',
    // Брендовые
    'rodasoleil',
    'roda soleil',
    'премиум бански'
  ],
  authors: [{ name: 'RoDaSoleil Bulgaria' }],
  creator: 'RoDaSoleil',
  publisher: 'RoDaSoleil Bulgaria',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rodasoleil.bg'),
  alternates: {
    canonical: '/',
    languages: {
      'bg': '/bg',
      'ru': '/ru',
      'en': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'bg_BG',
    alternateLocale: ['ru_RU', 'en_US'],
    url: '/',
    title: 'RoDaSoleil България - Дамски и Мъжки Бански | Купи Купальници Онлайн',
    description: 'Премиум дамски бански с tan-through технология. Дамска плажна облекла: панталони, поли, шорти, халати. Мъжки и детски купальници. Безплатна доставка в България!',
    siteName: 'RoDaSoleil Bulgaria',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RoDaSoleil - Луксозни бански с tan-through технология',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoDaSoleil България - Дамски и Мъжки Бански',
    description: 'Премиум дамски бански и плажна облекла с tan-through технология. Безплатна доставка!',
    images: ['/og-image.jpg'],
    creator: '@rodasoleil.bg',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

// Root layout - minimal structure as locale layout handles full HTML
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'RoDaSoleil България - Дамски и Мъжки Бански | Умни Бански с Tan-Through',
  description: 'Купи умни бански с tan-through технология в България. Дамски бански, мъжки шорти за плаж, детски купальници. UV защита SPF 35+, бързо съхнене. Бърза доставка с Еконт!',
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
    // Умни бански - приоритет
    'умни бански',
    'smart swimwear',
    'tan through бански',
    'tan-through',
    'бански за загар',
    'бански пропускащи слънце',
    // География - България
    'бански българия',
    'купальници българия',
    'онлайн магазин бански',
    'плажна мода българия',
    'магазин бански онлайн',
    // Дамска плажна облекла
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
    'UV защита',
    'италиански бански',
    'луксозни бански',
    'дизайнерски бански',
    'бързосъхнещи бански',
    // Бренд
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
    title: 'RoDaSoleil България - Умни Бански с Tan-Through Технология',
    description: 'Умни бански с tan-through технология - пропускат слънцето за равномерен загар. Дамски, мъжки и детски бански в България. Бърза доставка с Еконт!',
    siteName: 'RoDaSoleil Bulgaria',
    images: [
      {
        url: '/images/category-women.webp',
        width: 1200,
        height: 630,
        alt: 'RoDaSoleil - Умни бански с tan-through технология',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoDaSoleil България - Умни Бански с Tan-Through',
    description: 'Умни бански пропускащи слънцето за равномерен загар. Дамски, мъжки и детски бански. Доставка с Еконт!',
    images: ['/images/category-women.webp'],
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

import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RoDaSoleil България - Умни Бански с Tan-Through',
    short_name: 'RoDaSoleil',
    description: 'Умни бански с tan-through технология за равномерен загар. Дамски, мъжки и детски бански. UV защита SPF 35+. Бърза доставка с Еконт в България.',
    start_url: '/bg',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'bg',
    dir: 'ltr',
    categories: ['shopping', 'fashion', 'lifestyle'],
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}

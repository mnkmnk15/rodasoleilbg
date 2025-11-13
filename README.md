# RoDaSoleil Shop - E-commerce Platform

Профессиональный интернет-магазин одежды премиум-класса с интеграцией Sanity CMS и Stripe Payment Gateway.

## Технологический Стек

### Frontend
- **Next.js 16.0.3** - React framework с App Router
- **TypeScript 5** - Строгая типизация
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion 12** - Плавные анимации
- **next-intl 4** - Многоязычность (BG/RU/EN)

### Backend & Services
- **Sanity CMS** - Headless CMS для управления контентом
- **Stripe API v2025** - Платежный шлюз
- **Telegram Bot API** - Уведомления о заказах

### Developer Tools
- **ESLint 9** - Code quality
- **TypeScript** - Type safety
- **Git** - Version control

## Ключевые Особенности

### E-commerce
- 🛍️ **Каталог товаров** с фильтрацией и сортировкой
- 🛒 **Корзина покупок** с localStorage синхронизацией
- ❤️ **Список желаний** (Wishlist)
- 💳 **Stripe Checkout** - безопасная оплата картой
- 📦 **Webhook обработка** платежей в реальном времени
- 📱 **Telegram уведомления** о заказах

### UX/UI
- 🎨 **Адаптивный дизайн** для всех устройств
- ⚡ **Оптимизированная загрузка** изображений
- 🎭 **Framer Motion анимации**
- 🌍 **Мультиязычность** (BG/RU/EN)
- 🍪 **GDPR Cookie Consent**

### SEO & Performance
- 🚀 **Next.js 16 Turbopack** для быстрой сборки
- 📊 **SEO оптимизация** (meta tags, Open Graph, Twitter Cards)
- 🗺️ **XML Sitemap** автогенерация
- 📱 **PWA готовность** (manifest, theme-color)
- ⚡ **Static Generation** для быстрой загрузки

## Быстрый Старт

### Установка

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd rodasoleil-shop

# Установите зависимости
npm install
```

### Настройка переменных окружения

Создайте файл `.env` на основе `.env.example`:

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Запуск проекта

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start

# Lint check
npm run lint
```

## Структура Проекта

```
rodasoleil-shop/
├── app/                      # Next.js App Router
│   ├── [locale]/            # Локализованные страницы
│   │   ├── catalog/         # Каталог товаров
│   │   ├── checkout/        # Оформление заказа
│   │   └── ...
│   ├── api/                 # API routes
│   │   ├── checkout/        # Stripe checkout
│   │   ├── webhooks/        # Stripe webhooks
│   │   └── sync-stripe/     # Синхронизация товаров
│   ├── layout.tsx           # Root layout + SEO
│   └── globals.css          # Global styles
├── components/              # React компоненты
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── ...
├── contexts/                # React Context API
│   ├── CartContext.tsx
│   └── WishlistContext.tsx
├── hooks/                   # Custom React hooks
├── lib/                     # Утилиты и библиотеки
│   ├── stripe.ts           # Stripe клиент
│   ├── telegram.ts         # Telegram уведомления
│   └── sanity.ts           # Sanity клиент (deprecated)
├── sanity/                  # Sanity CMS конфигурация
│   ├── config.ts
│   ├── queries.ts
│   └── schemaTypes/        # Схемы данных
├── types/                   # TypeScript типы
├── messages/                # i18n переводы
│   ├── bg.json
│   ├── ru.json
│   └── en.json
├── public/                  # Статические файлы
└── scripts/                 # Утилиты для деплоя

```

## Документация

- [Интеграция Stripe](./STRIPE_INTEGRATION.md) - Полное руководство по Stripe
- [Чеклист деплоя](./DEPLOYMENT_CHECKLIST.md) - Подготовка к продакшену
- [Sanity Schemas](./sanity/README.md) - Схемы данных CMS

## API Endpoints

### Stripe Checkout
- `POST /api/checkout` - Создание checkout сессии
- `POST /api/webhooks/stripe` - Webhook обработчик

### Stripe Sync
- `POST /api/sync-stripe` - Синхронизация товаров с Stripe

## Деплой

### Vercel (Рекомендуется)

```bash
# Установите Vercel CLI
npm i -g vercel

# Деплой в production
vercel --prod
```

### Настройка на Vercel

1. Добавьте все переменные окружения в Vercel Dashboard
2. Настройте Stripe Webhook URL: `https://your-domain.com/api/webhooks/stripe`
3. Добавьте события: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

## Безопасность

- ✅ Все секретные ключи в `.env` (не коммитятся)
- ✅ Stripe webhook signature verification
- ✅ HTTPS обязателен для продакшена
- ✅ TypeScript строгая типизация
- ✅ ESLint правила безопасности
- ✅ No vulnerabilities (npm audit)

## Производительность

- ⚡ Next.js 16 Turbopack (3x быстрее Webpack)
- 📦 Оптимизированные изображения (Next Image)
- 🎯 Code splitting автоматический
- 💾 localStorage для корзины и wishlist
- 🚀 Static generation для SEO

## Browser Support

- Chrome (последние 2 версии)
- Firefox (последние 2 версии)
- Safari (последние 2 версии)
- Edge (последние 2 версии)

## Лицензия

© 2024 RoDaSoleil Bulgaria. Все права защищены.

## Контакты

- Website: [https://rodasoleil.bg](https://rodasoleil.bg)
- Email: info@rodasoleil.bg

---

**Статус:** ✅ Ready for Production
**Версия:** 0.1.3
**Last Updated:** November 2024

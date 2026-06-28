# RoDaSoleil Shop

Професионален онлайн магазин за дрехи премиум клас с интеграция на Sanity CMS и Stripe Payment Gateway.

**Website:** https://www.rodasoleil.bg

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

1. **Добавьте переменные окружения:**
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_TOKEN`
   - `STRIPE_SECRET_KEY` (live key для продакшена)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live key)
   - `STRIPE_WEBHOOK_SECRET`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `NEXT_PUBLIC_BASE_URL=https://www.rodasoleil.bg`
   - `NEXT_PUBLIC_SITE_URL=https://www.rodasoleil.bg`

2. **Настройте Stripe Webhook:**
   - URL: `https://www.rodasoleil.bg/api/webhooks/stripe`
   - События: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

3. **Настройте домен:**
   - Основной домен: `www.rodasoleil.bg`
   - Редирект с `rodasoleil.bg` на `www.rodasoleil.bg`

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

© 2025 RoDaSoleil Bulgaria. Все права защищены.

## Контакты

- Website: [https://www.rodasoleil.bg](https://www.rodasoleil.bg)
- Instagram: [https://www.instagram.com/rodasoleil.bg/](https://www.instagram.com/rodasoleil.bg/)
- Facebook: [https://www.facebook.com/people/Rodasoleilbulgaria/61550255667531/](https://www.facebook.com/people/Rodasoleilbulgaria/61550255667531/)

---

**Статус:** ✅ Production Ready
**Версия:** 0.1.0
**Обновлено:** Июнь 2026

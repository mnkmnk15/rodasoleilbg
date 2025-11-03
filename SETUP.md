# RoDaSoleil - Setup Instructions

## Обзор проекта

Современный интернет-магазин купальников RoDaSoleil с многоязычной поддержкой (BG/RU/EN) и интеграцией Sanity CMS.

## Технологический стек

- **Frontend**: Next.js 14 (App Router)
- **Язык**: TypeScript
- **Стилизация**: Tailwind CSS
- **Анимации**: Framer Motion
- **Интернационализация**: next-intl
- **CMS**: Sanity
- **Иконки**: Lucide React

## Установка и запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

Скопируйте `.env.example` в `.env.local`:

```bash
cp .env.example .env.local
```

Затем заполните значения в `.env.local` (см. раздел "Настройка Sanity CMS" ниже).

### 3. Запуск проекта

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Настройка Sanity CMS

### 1. Создание проекта Sanity

```bash
npm create sanity@latest
```

Следуйте инструкциям для создания нового проекта.

### 2. Настройка схем

В вашем Sanity Studio проекте, создайте файлы схем на основе определений в `sanity/schemas.ts`:

- `schemas/product.ts` - схема товаров
- `schemas/category.ts` - схема категорий
- `schemas/banner.ts` - схема баннеров

### 3. Получение Project ID

После создания проекта Sanity, найдите ваш Project ID в настройках проекта и добавьте его в `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=ваш-project-id
```

### 4. Создание API Token (опционально)

Для использования функций записи, создайте API token в Sanity и добавьте в `.env.local`:

```
SANITY_API_TOKEN=ваш-api-token
```

## Структура проекта

```
rodasoleil-shop/
├── app/
│   ├── [locale]/           # Локализованные страницы
│   │   ├── layout.tsx      # Layout с провайдером интернационализации
│   │   └── page.tsx        # Главная страница
│   └── globals.css         # Глобальные стили
├── components/             # React компоненты
│   ├── Header.tsx          # Шапка с навигацией и выбором языка
│   ├── Hero.tsx            # Hero секция с видео фоном
│   ├── ParallaxSection.tsx # Параллакс секция с моделью
│   ├── ProductCatalog.tsx  # Каталог товаров
│   ├── Features.tsx        # Секция преимуществ
│   ├── Footer.tsx          # Футер
│   └── CookieConsent.tsx   # Уведомление о cookies
├── messages/               # Переводы
│   ├── bg.json            # Болгарский
│   ├── ru.json            # Русский
│   └── en.json            # Английский
├── sanity/                # Конфигурация Sanity CMS
│   ├── config.ts          # Клиент Sanity
│   ├── schemas.ts         # Схемы данных
│   └── queries.ts         # GROQ запросы
├── i18n.ts                # Конфигурация интернационализации
├── middleware.ts          # Middleware для определения языка
└── tailwind.config.ts     # Конфигурация Tailwind
```

## Основные функции

### 1. Многоязычность

- Автоматическое определение языка браузера
- Выпадающий список выбора языка (BG/RU/EN)
- Все тексты переведены на 3 языка

### 2. Компоненты

#### Header
- Кремовый цвет (#FFE1AF)
- Элегантный логотип "RoDaSoleil Bulgaria"
- Иконки: поиск, корзина, профиль
- Выпадающий список языков
- Плавная анимация при прокрутке

#### Hero
- Видео фон (placeholder)
- Элегантный текст по центру
- Анимированная кнопка
- Индикатор прокрутки

#### ParallaxSection
- Параллакс эффект при скролле
- Модель увеличивается, фон отдаляется
- Описание товара слева
- Плавающий бейдж "2025 Collection"

#### ProductCatalog
- Сетка товаров (4 товара)
- Анимация при наведении
- Кнопка "Добавить в корзину"
- Иконка избранного
- Бейдж "Bestseller"
- Кнопка "Смотреть все"

#### Features
- 4 преимущества с иконками и градиентами
- UV защита, качество, дизайн, tan-through технология
- Статистика компании (10+ лет, 5000+ клиентов, 100% гарантия)

#### Footer
- Информация о компании
- Быстрые ссылки
- Контакты
- Социальные сети
- Платежные системы

#### CookieConsent
- GDPR-совместимое уведомление
- Анимированное появление
- Кнопки принятия/отклонения
- Сохранение в cookies

### 3. Анимации

Использованы премиум-анимации Framer Motion:
- Параллакс эффекты
- Fade-in анимации
- Hover эффекты
- Smooth scroll
- Scale и rotate анимации

### 4. Подготовка к Sanity CMS

Проект полностью готов к интеграции с Sanity CMS:

- **Схемы данных**: product, category, banner
- **Запросы**: getFeaturedProducts, searchProducts, и др.
- **Многоязычные поля**: все тексты поддерживают BG/RU/EN
- **Изображения**: интеграция с Sanity Image URL Builder

## Добавление контента

### Изображения и видео

Разместите следующие файлы в папке `public/`:

```
public/
├── images/
│   ├── hero-poster.jpg          # Постер для Hero видео
│   ├── background-pattern.jpg   # Фон для параллакс секции
│   ├── model-swimwear.jpg       # Модель в купальнике
│   ├── product-1.jpg            # Товары (4 шт)
│   ├── product-2.jpg
│   ├── product-3.jpg
│   ├── product-4.jpg
│   ├── payment-visa.svg         # Логотипы платежных систем
│   ├── payment-mastercard.svg
│   └── payment-paypal.svg
└── videos/
    └── hero-video.mp4           # Hero видео
```

### Или используйте Sanity CMS

После настройки Sanity CMS, вы можете загружать все медиа-файлы через Sanity Studio.

## Будущие улучшения

- [ ] Интеграция платежной системы (Stripe/PayPal)
- [ ] Полнофункциональная корзина покупок
- [ ] Страница товара с детальной информацией
- [ ] Фильтрация и сортировка каталога
- [ ] Личный кабинет пользователя
- [ ] Система отзывов
- [ ] Wishlist функционал
- [ ] Email уведомления
- [ ] SEO оптимизация
- [ ] Аналитика (Google Analytics)

## Деплой

### Vercel (рекомендуется)

```bash
vercel deploy
```

### Другие платформы

Проект совместим с любыми платформами, поддерживающими Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## Поддержка

Для вопросов и поддержки:
- Email: info@rodasoleil.bg
- GitHub Issues: [ссылка на репозиторий]

---

**Разработано с ❤️ для RoDaSoleil Bulgaria**

# Настройка переменных окружения на Vercel

## ❌ Проблема: STRIPE_SECRET_KEY is not defined

Это означает, что переменные окружения из `.env` файла **не попадают на Vercel автоматически**.

Файл `.env` работает только локально! На Vercel нужно добавить переменные вручную.

---

## ✅ Решение: Добавить переменные в Vercel Dashboard

### Шаг 1: Откройте настройки проекта

1. Перейдите на https://vercel.com/dashboard
2. Выберите ваш проект (например, `rodasoleil-shop`)
3. Нажмите **Settings** (в верхнем меню)
4. Выберите **Environment Variables** (слева в меню)

### Шаг 2: Добавьте все необходимые переменные

Нажимайте **"Add New"** для каждой переменной:

#### 1. Sanity CMS
```
Name: NEXT_PUBLIC_SANITY_PROJECT_ID
Value: 7bepndor
Environment: Production, Preview, Development (все три ✅)
```

```
Name: NEXT_PUBLIC_SANITY_DATASET
Value: production
Environment: Production, Preview, Development (все три ✅)
```

```
Name: SANITY_API_TOKEN
Value: skXXXXXXXXXXXXXXXXXXXX (скопируйте из .env файла)
Environment: Production, Preview, Development (все три ✅)
```

#### 2. Stripe (Test режим)
```
Name: STRIPE_SECRET_KEY
Value: sk_test_xxxxxxxxxxxxx (скопируйте из .env файла)
Environment: Production, Preview, Development (все три ✅)
```

```
Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_xxxxxxxxxxxxx (скопируйте из .env файла)
Environment: Production, Preview, Development (все три ✅)
```

#### 3. Stripe Webhook Secret
**ВАЖНО:** Для Vercel нужен НОВЫЙ webhook secret!

Сначала создайте webhook endpoint в Stripe:
1. Перейдите на https://dashboard.stripe.com/test/webhooks
2. Нажмите "Add endpoint"
3. URL: `https://ваш-проект.vercel.app/api/webhooks/stripe`
4. Выберите события: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Скопируйте новый webhook secret

Затем добавьте в Vercel:
```
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_новый_секрет_от_vercel_webhook
Environment: Production, Preview, Development (все три ✅)
```

#### 4. Telegram Bot
```
Name: TELEGRAM_BOT_TOKEN
Value: ваш_telegram_bot_token (скопируйте из .env файла)
Environment: Production, Preview, Development (все три ✅)
```

```
Name: TELEGRAM_CHAT_ID
Value: ваш_telegram_chat_id (скопируйте из .env файла)
Environment: Production, Preview, Development (все три ✅)
```

#### 5. Base URL
```
Name: NEXT_PUBLIC_BASE_URL
Value: https://ваш-проект.vercel.app
Environment: Production, Preview, Development
```

**Примечание:** Замените `ваш-проект.vercel.app` на реальный URL вашего проекта!

### Шаг 3: Redeploy приложения

После добавления всех переменных:

1. Перейдите во вкладку **Deployments**
2. Найдите последний деплой
3. Нажмите на три точки **"⋯"** → **"Redeploy"**
4. Подтвердите **"Redeploy"**

Или просто сделайте новый commit:
```bash
git add .
git commit -m "Update environment variables"
git push
```

---

## 📋 Быстрый чеклист всех переменных

Скопируйте эту таблицу и проверьте, что все добавлено:

| Переменная | Значение | Добавлено? |
|------------|----------|------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `7bepndor` | ☐ |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | ☐ |
| `SANITY_API_TOKEN` | `skWrWXG...` | ☐ |
| `STRIPE_SECRET_KEY` | `sk_test_51ST4MB...` | ☐ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_51ST4MB...` | ☐ |
| `STRIPE_WEBHOOK_SECRET` | `whsec_новый_от_vercel` | ☐ |
| `TELEGRAM_BOT_TOKEN` | `8343970844:AAEOnz...` | ☐ |
| `TELEGRAM_CHAT_ID` | `6279876822` | ☐ |
| `NEXT_PUBLIC_BASE_URL` | `https://ваш-проект.vercel.app` | ☐ |

---

## 🔍 Проверка после деплоя

### 1. Проверьте логи деплоя

В Vercel → Deployments → последний деплой → Build Logs

Не должно быть ошибок про отсутствующие переменные.

### 2. Проверьте Runtime Logs

Deployments → Functions → выберите функцию → Logs

При обращении к webhook должно появиться:
```
🔔 Webhook received at: ...
✅ Webhook secret found, constructing event...
```

А НЕ:
```
❌ STRIPE_WEBHOOK_SECRET is not configured
```

### 3. Проверьте работу сайта

Откройте ваш сайт, попробуйте:
- Загрузку главной страницы
- Отображение продуктов из Sanity
- Добавление в корзину
- Оформление заказа (checkout)

---

## ⚠️ Важные заметки

### 1. Не коммитьте `.env` в git!

Убедитесь, что `.env` добавлен в `.gitignore`:

```bash
# В файле .gitignore должно быть:
.env
.env.local
.env*.local
```

### 2. Разные webhook secret для localhost и Vercel

- **Localhost:** `whsec_6QcvPee0FrgKKyJZAIu8xpILAN2V6pOg` (через Stripe CLI)
- **Vercel:** Новый webhook secret (создайте отдельный endpoint в Stripe Dashboard)

### 3. Base URL должен быть правильным

Для Vercel:
```
NEXT_PUBLIC_BASE_URL=https://rodasoleil-shop.vercel.app
```

Для production домена:
```
NEXT_PUBLIC_BASE_URL=https://rodasoleil.bg
```

---

## 🚀 После настройки

Когда все переменные добавлены и деплой завершён:

1. ✅ Stripe платежи будут работать
2. ✅ Webhook будут приходить на Vercel
3. ✅ Telegram уведомления будут отправляться
4. ✅ Продукты из Sanity будут загружаться

**Протестируйте оплату с картой:** `4242 4242 4242 4242`

Должно прийти уведомление в Telegram! 🎉

---

## 🐛 Если всё ещё не работает

1. **Проверьте Environment Variables в Vercel:**
   - Settings → Environment Variables
   - Убедитесь, что все 9 переменных добавлены
   - Проверьте, что выбраны правильные окружения (Production/Preview/Development)

2. **Проверьте webhook endpoint в Stripe:**
   - Dashboard → Webhooks
   - URL должен быть точно: `https://ваш-проект.vercel.app/api/webhooks/stripe`
   - События выбраны: `checkout.session.completed`, etc.

3. **Проверьте логи в Vercel:**
   - Deployments → последний деплой → Functions → Logs
   - Должны видеть логи с 🔔 при webhook запросах

4. **Сделайте полный redeploy:**
   - Deployments → Redeploy
   - Или новый git push

Удачи! 🚀

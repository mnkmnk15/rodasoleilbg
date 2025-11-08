# Настройка Stripe для RoDaSoleil Shop

## Шаг 1: Регистрация в Stripe

1. Зарегистрируйтесь на [stripe.com](https://stripe.com)
2. Активируйте свой аккаунт
3. Получите API ключи из Dashboard → Developers → API keys

## Шаг 2: Установка зависимостей

```bash
npm install stripe @stripe/stripe-js
```

## Шаг 3: Настройка переменных окружения

Добавьте в `.env.local`:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=ваш_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Stripe - Public Key (для клиента)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe - Secret Key (только для сервера)
STRIPE_SECRET_KEY=sk_test_...

# URL вашего сайта
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **Важно**: Никогда не публикуйте `STRIPE_SECRET_KEY` в публичном коде!

## Шаг 4: Создание Stripe клиента

Создайте файл `lib/stripe.ts`:

\`\`\`typescript
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
};
\`\`\`

## Шаг 5: Создание API маршрута для Checkout

Создайте файл `app/api/checkout/route.ts`:

\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const { items, locale } = await req.json();

    // Создаем line items для Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: [item.image],
          metadata: {
            size: item.size || '',
            color: item.color || '',
          },
        },
        unit_amount: Math.round(item.price * 100), // Stripe использует центы
      },
      quantity: item.quantity,
    }));

    // Создаем Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: \`\${process.env.NEXT_PUBLIC_SITE_URL}/\${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}\`,
      cancel_url: \`\${process.env.NEXT_PUBLIC_SITE_URL}/\${locale}/checkout/cancel\`,
      shipping_address_collection: {
        allowed_countries: ['BG', 'RO', 'GR', 'RS', 'TR', 'DE', 'FR', 'IT', 'ES'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 500, // 5 EUR
              currency: 'eur',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1000, // 10 EUR
              currency: 'eur',
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 2,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
\`\`\`

## Шаг 6: Создание страницы корзины с Checkout

Создайте файл `app/[locale]/cart/page.tsx`:

\`\`\`typescript
'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useCart } from '@/contexts/CartContext';
import { getStripe } from '@/lib/stripe';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatPrice } from '@/sanity/config';

export default function CartPage() {
  const locale = useLocale();
  const { cart, removeItem, updateQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items,
          locale,
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await getStripe();

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Ошибка при оформлении заказа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">
          {locale === 'bg' ? 'Кошница' : locale === 'ru' ? 'Корзина' : 'Shopping Cart'}
        </h1>

        {cart.items.length === 0 ? (
          <p className="text-center text-gray-500">
            {locale === 'bg' ? 'Кошницата е празна' : locale === 'ru' ? 'Корзина пуста' : 'Cart is empty'}
          </p>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.items.map((item) => (
                <div key={\`\${item.id}-\${item.size}-\${item.color}\`} className="flex gap-4 border-b pb-4">
                  <img src={item.image} alt={item.name} className="w-24 h-32 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.size && \`Size: \${item.size}\`} {item.color && \`| Color: \${item.color}\`}
                    </p>
                    <p className="font-bold mt-2">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id, item.size, item.color)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between text-xl font-bold mb-4">
                <span>Total:</span>
                <span>{formatPrice(cart.total)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
              >
                {isLoading
                  ? (locale === 'bg' ? 'Обработка...' : locale === 'ru' ? 'Обработка...' : 'Processing...')
                  : (locale === 'bg' ? 'Към Плащане' : locale === 'ru' ? 'К Оплате' : 'Proceed to Checkout')
                }
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
\`\`\`

## Шаг 7: Создание страниц успеха и отмены

### Success Page - `app/[locale]/checkout/success/page.tsx`:

\`\`\`typescript
'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SuccessPage() {
  const locale = useLocale();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold mb-4">
          {locale === 'bg' ? 'Благодарим за поръчката!' : locale === 'ru' ? 'Спасибо за заказ!' : 'Thank you for your order!'}
        </h1>
        <p className="text-gray-600 mb-8">
          {locale === 'bg'
            ? 'Ще получите имейл с потвърждение скоро.'
            : locale === 'ru'
            ? 'Вы получите письмо с подтверждением в ближайшее время.'
            : 'You will receive a confirmation email soon.'
          }
        </p>
        <Link href={\`/\${locale}/shop\`} className="bg-black text-white px-8 py-3 rounded-lg">
          {locale === 'bg' ? 'Продължи пазаруването' : locale === 'ru' ? 'Продолжить покупки' : 'Continue Shopping'}
        </Link>
      </div>
      <Footer />
    </main>
  );
}
\`\`\`

### Cancel Page - `app/[locale]/checkout/cancel/page.tsx`:

\`\`\`typescript
'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CancelPage() {
  const locale = useLocale();

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {locale === 'bg' ? 'Поръчката е отменена' : locale === 'ru' ? 'Заказ отменен' : 'Order Cancelled'}
        </h1>
        <p className="text-gray-600 mb-8">
          {locale === 'bg'
            ? 'Вашата поръчка не беше завършена. Можете да се върнете към кошницата.'
            : locale === 'ru'
            ? 'Ваш заказ не был завершен. Вы можете вернуться в корзину.'
            : 'Your order was not completed. You can return to your cart.'
          }
        </p>
        <Link href={\`/\${locale}/cart\`} className="bg-black text-white px-8 py-3 rounded-lg">
          {locale === 'bg' ? 'Обратно към кошницата' : locale === 'ru' ? 'Вернуться в корзину' : 'Back to Cart'}
        </Link>
      </div>
      <Footer />
    </main>
  );
}
\`\`\`

## Шаг 8: Тестирование

### Тестовые карты Stripe:

- **Успешная оплата**: 4242 4242 4242 4242
- **Требует аутентификации**: 4000 0025 0000 3155
- **Отклонена**: 4000 0000 0000 9995

Используйте:
- Любую дату истечения в будущем (например, 12/34)
- Любой CVC (например, 123)
- Любой почтовый индекс

## Шаг 9: Переход на продакшн

1. Замените тестовые ключи на продакшн ключи из Stripe Dashboard
2. Настройте вебхуки для обработки событий (опционально)
3. Настройте налоги и правила доставки в Stripe Dashboard

## Дополнительные возможности

### Вебхуки (для автоматизации)

Создайте `app/api/webhooks/stripe/route.ts` для обработки событий:

\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: \`Webhook Error: \${err.message}\` }, { status: 400 });
  }

  // Обработка событий
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Здесь можно отправить email, обновить базу данных и т.д.
      console.log('Payment successful:', session);
      break;
    default:
      console.log(\`Unhandled event type: \${event.type}\`);
  }

  return NextResponse.json({ received: true });
}
\`\`\`

## Готово!

Теперь ваш магазин готов принимать платежи через Stripe!

## Полезные ссылки

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Next.js + Stripe](https://stripe.com/docs/payments/checkout/how-checkout-works)

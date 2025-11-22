import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { sanityClient } from '@/sanity/config';
import { sendTelegramNotification } from '@/lib/telegram';
import { DELIVERY_PRICES } from '@/types/checkout';
import { validateCartItems, validateCheckoutForm } from '@/lib/validation';
import { checkRateLimit, getRequestIdentifier, RATE_LIMIT_CONFIGS, createRateLimitResponse } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // Rate limiting protection against abuse
  const identifier = getRequestIdentifier(req);
  const rateLimit = checkRateLimit(`checkout:${identifier}`, RATE_LIMIT_CONFIGS.checkout);

  if (!rateLimit.allowed) {
    console.warn(`[Checkout] Rate limit exceeded for: ${identifier}`);
    return createRateLimitResponse(rateLimit.resetTime);
  }

  try {
    const body = await req.json();
    const { items, formData, locale } = body;

    // Validate cart items
    const validatedItems = validateCartItems(items);
    if (!validatedItems) {
      return NextResponse.json(
        { error: 'Invalid items: must be a non-empty array with valid quantities (1-99)' },
        { status: 400 }
      );
    }

    // Validate form data
    const formValidation = validateCheckoutForm(formData);
    if (!formValidation.valid || !formValidation.sanitizedData) {
      return NextResponse.json(
        { error: `Validation failed: ${formValidation.errors.join(', ')}` },
        { status: 400 }
      );
    }

    const sanitizedFormData = formValidation.sanitizedData;

    // Получаем информацию о продуктах из Sanity
    const productIds = validatedItems.map((item) => item.id);
    const products = await sanityClient.fetch(
      `*[_id in $ids]{ _id, name, price, stripeProductId, stripePriceId }`,
      { ids: productIds }
    );

    // Проверяем, что все продукты найдены
    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'One or more products not found' },
        { status: 400 }
      );
    }

    // Вычисляем итоговую сумму используя цены из БД (не от клиента!)
    const itemsTotal = validatedItems.reduce((sum: number, item) => {
      const product = products.find((p: any) => p._id === item.id);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const deliveryPrice =
      DELIVERY_PRICES[sanitizedFormData.deliveryMethod as keyof typeof DELIVERY_PRICES];
    const grandTotal = itemsTotal + deliveryPrice;

    // Создаём метаданные с полной информацией о заказе
    const metadata = {
      // Личные данные
      customerFirstName: sanitizedFormData.firstName,
      customerLastName: sanitizedFormData.lastName,
      customerEmail: sanitizedFormData.email,
      customerPhone: sanitizedFormData.phone,

      // Способ оплаты
      paymentMethod: sanitizedFormData.paymentMethod,

      // Доставка
      deliveryMethod: sanitizedFormData.deliveryMethod,
      deliveryPrice: deliveryPrice.toString(),

      // Данные доставки
      ...(sanitizedFormData.deliveryMethod === 'econt_office'
        ? {
            econtOfficeId: sanitizedFormData.econtOfficeId?.toString() || '',
            econtOfficeCode: sanitizedFormData.econtOfficeCode || '',
            econtOfficeName: sanitizedFormData.econtOfficeName || '',
          }
        : sanitizedFormData.deliveryMethod === 'pickup_burgas'
        ? {
            pickupLocation: 'Бургас',
          }
        : {
            city: sanitizedFormData.city || '',
            postalCode: sanitizedFormData.postalCode || '',
            address: sanitizedFormData.address || '',
          }),

      // Примечания
      notes: sanitizedFormData.notes || '',

      // Товары (используем данные из БД для названий и цен)
      orderItems: JSON.stringify(
        validatedItems.map((item) => {
          const product = products.find((p: any) => p._id === item.id);
          return {
            id: item.id,
            name: product?.name?.en || product?.name?.bg || item.name || 'Unknown',
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: product?.price || 0,
          };
        })
      ),
    };

    // Если оплата наложенным платежом
    if (sanitizedFormData.paymentMethod === 'cash_on_delivery') {
      // Отправляем уведомление в Telegram
      const telegramMessage = formatOrderMessageWithDelivery({
        customerName: `${sanitizedFormData.firstName} ${sanitizedFormData.lastName}`,
        customerEmail: sanitizedFormData.email,
        customerPhone: sanitizedFormData.phone,
        amount: grandTotal * 100, // в центах для совместимости
        currency: 'EUR',
        items: validatedItems.map((item) => {
          const product = products.find((p: any) => p._id === item.id);
          return {
            name: product?.name?.en || product?.name?.bg || item.name || 'Unknown',
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          };
        }),
        paymentMethod: 'Наложен платеж',
        deliveryMethod: sanitizedFormData.deliveryMethod,
        deliveryPrice,
        deliveryDetails:
          sanitizedFormData.deliveryMethod === 'econt_office'
            ? {
                type: 'office',
                officeName: sanitizedFormData.econtOfficeName,
                city: sanitizedFormData.city,
              }
            : sanitizedFormData.deliveryMethod === 'pickup_burgas'
            ? {
                type: 'pickup',
              }
            : {
                type: 'address',
                city: sanitizedFormData.city,
                postalCode: sanitizedFormData.postalCode,
                address: sanitizedFormData.address,
              },
        notes: sanitizedFormData.notes,
      });

      await sendTelegramNotification(telegramMessage);

      return NextResponse.json({
        success: true,
        orderId: `COD-${Date.now()}`,
      });
    }

    // Если оплата картой - создаём Stripe сессию
    const lineItems = validatedItems.map((item) => {
      const product = products.find((p: any) => p._id === item.id);

      if (!product) {
        throw new Error(`Product not found: ${item.id}`);
      }

      if (!product.stripePriceId) {
        throw new Error(
          `Product ${product.name?.en || product.name?.bg || item.id} is not synced with Stripe`
        );
      }

      return {
        priceId: product.stripePriceId,
        quantity: item.quantity,
      };
    });

    const session = await createCheckoutSession(lineItems, metadata, deliveryPrice, locale || 'bg');

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Вспомогательная функция для форматирования сообщения с доставкой
function formatOrderMessageWithDelivery(orderData: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  currency: string;
  items: Array<{
    name: string;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  paymentMethod: string;
  deliveryMethod: string;
  deliveryPrice: number;
  deliveryDetails: any;
  notes?: string;
}) {
  const {
    customerName,
    customerEmail,
    customerPhone,
    amount,
    items,
    paymentMethod,
    deliveryMethod,
    deliveryPrice,
    deliveryDetails,
    notes,
  } = orderData;

  let message = `<b>НОВА ПОРЪЧКА</b>\n\n`;

  // Информация о клиенте
  message += `<b>👤 ДАННИ НА КЛИЕНТА:</b>\n`;
  message += `Име: ${customerName}\n`;
  message += `Email: ${customerEmail}\n`;
  message += `Телефон: ${customerPhone}\n`;

  // Способ оплаты
  message += `\n<b>💳 НАЧИН НА ПЛАЩАНЕ:</b>\n`;
  message += `${paymentMethod}\n`;

  // Доставка
  message += `\n<b>🚚 ДОСТАВКА:</b>\n`;
  if (deliveryMethod === 'econt_office') {
    message += `Тип: До офис/автомат Еконт\n`;
    message += `Офис: ${deliveryDetails.officeName}\n`;
    message += `Град: ${deliveryDetails.city}\n`;
  } else if (deliveryMethod === 'pickup_burgas') {
    message += `Тип: Самовземане в Бургас\n`;
    message += `⚠️ Моля, свържете се с клиента за уточняване на място и време!\n`;
  } else {
    message += `Тип: До адрес\n`;
    message += `Град: ${deliveryDetails.city}\n`;
    message += `Пощенски код: ${deliveryDetails.postalCode}\n`;
    message += `Адрес: ${deliveryDetails.address}\n`;
  }
  message += `Цена на доставка: €${deliveryPrice.toFixed(2)}\n`;

  // Товары
  message += `\n<b>📦 ПОРЪЧАНИ ПРОДУКТИ:</b>\n`;
  items.forEach((item, index) => {
    message += `\n${index + 1}. ${item.name}\n`;
    message += `   Количество: ${item.quantity} бр.\n`;
    if (item.size) message += `   Размер: ${item.size}\n`;
    if (item.color) message += `   Цвят: ${item.color}\n`;
  });

  // Примечания
  if (notes) {
    message += `\n<b>📝 БЕЛЕЖКИ:</b>\n${notes}\n`;
  }

  // Сумма заказа
  const total = (amount / 100).toFixed(2);
  message += `\n<b>💰 ОБЩА СУМА: €${total}</b>\n`;

  return message;
}

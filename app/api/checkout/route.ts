import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { sanityClient, urlFor } from '@/sanity/config';
import { sendTelegramNotification } from '@/lib/telegram';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { DELIVERY_PRICES } from '@/types/checkout';
import { validateCartItems, validateCheckoutForm } from '@/lib/validation';
import { checkRateLimit, getRequestIdentifier, RATE_LIMIT_CONFIGS, createRateLimitResponse } from '@/lib/rate-limit';
import { createOrder, type OrderData } from '@/lib/sanity-orders';
import { incrementPromoCodeUsage } from '../validate-promo/route';
import { checkCODRateLimit } from '@/lib/rate-limit-kv';

// Хелпер для получения URL картинки товара
function getProductImageUrl(product: any): string {
  if (!product?.images || !product.images[0]) {
    return '';
  }
  try {
    return urlFor(product.images[0]).width(300).height(300).url();
  } catch (error) {
    console.error('Error generating image URL:', error);
    return '';
  }
}

// Хелпер для получения цены и stripePriceId на основе размера для детских товаров
function getKidsPriceData(product: any, size: string | undefined): { price: number; stripePriceId: string | null } {
  // Если это детский товар с kidsSizePrices
  if (product.gender === 'kids' && product.kidsSizePrices && product.kidsSizePrices.length > 0 && size) {
    const sizePrice = product.kidsSizePrices.find((sp: any) => sp.size === size);
    if (sizePrice) {
      return {
        price: sizePrice.price,
        stripePriceId: sizePrice.stripePriceId || null,
      };
    }
  }

  // Fallback на базовую цену
  return {
    price: product.price,
    stripePriceId: product.stripePriceId || null,
  };
}

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

    // Honeypot защита от ботов
    if (formData.honeypot && formData.honeypot.trim() !== '') {
      console.warn('[Checkout] Honeypot triggered - likely a bot');
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // Получаем информацию о продуктах из Sanity (включая данные для детских товаров)
    const productIds = validatedItems.map((item) => item.id);
    const products = await sanityClient.fetch(
      `*[_id in $ids]{ _id, name, price, stripeProductId, stripePriceId, gender, kidsSizePrices, images }`,
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
    // Для детских товаров используем цену на основе размера
    const itemsTotal = validatedItems.reduce((sum: number, item) => {
      const product = products.find((p: any) => p._id === item.id);
      if (!product) return sum;

      const priceData = getKidsPriceData(product, item.size);
      return sum + priceData.price * item.quantity;
    }, 0);

    let deliveryPrice =
      DELIVERY_PRICES[sanitizedFormData.deliveryMethod as keyof typeof DELIVERY_PRICES];

    // Применение промокода
    let discount = 0;
    let promoCodeApplied: string | undefined;

    if (sanitizedFormData.promoCode) {
      try {
        const promoCode = await sanityClient.fetch(
          `*[_type == "promoCode" && code == $code && active == true][0]`,
          { code: sanitizedFormData.promoCode.toUpperCase().trim() }
        );

        if (promoCode) {
          // Проверка срока действия и лимитов (повторная проверка на серверной стороне)
          const now = new Date();
          const validFrom = promoCode.validFrom ? new Date(promoCode.validFrom) : null;
          const validUntil = promoCode.validUntil ? new Date(promoCode.validUntil) : null;
          const limitReached = promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit;

          const isValid = (!validFrom || validFrom <= now) &&
                          (!validUntil || validUntil >= now) &&
                          !limitReached;

          if (isValid) {
            if (promoCode.discountType === 'percentage') {
              discount = (itemsTotal * promoCode.discountValue) / 100;
              discount = Math.min(discount, itemsTotal); // Скидка не больше стоимости корзины
            } else if (promoCode.discountType === 'fixed') {
              discount = Math.min(promoCode.discountValue, itemsTotal);
            } else if (promoCode.discountType === 'free_shipping') {
              discount = deliveryPrice; // Сохраняем стоимость доставки как скидку для отображения
              deliveryPrice = 0;
            }

            discount = Math.round(discount * 100) / 100;
            promoCodeApplied = sanitizedFormData.promoCode.toUpperCase().trim();

            // Увеличиваем счетчик использований
            await incrementPromoCodeUsage(promoCodeApplied);
          }
        }
      } catch (error) {
        console.error('[Checkout] Promo code validation error:', error);
      }
    }

    const grandTotal = itemsTotal - discount + deliveryPrice;

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

      // Промокод и скидка
      ...(promoCodeApplied ? {
        promoCode: promoCodeApplied,
        discount: discount.toString(),
      } : {}),

      // Товары (используем данные из БД для названий и цен)
      orderItems: JSON.stringify(
        validatedItems.map((item) => {
          const product = products.find((p: any) => p._id === item.id);
          const priceData = product ? getKidsPriceData(product, item.size) : { price: 0 };
          return {
            id: item.id,
            name: product?.name?.en || product?.name?.bg || item.name || 'Unknown',
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: priceData.price,
            image: product ? getProductImageUrl(product) : '',
          };
        })
      ),
    };

    // Если оплата наложенным платежом
    if (sanitizedFormData.paymentMethod === 'cash_on_delivery') {
      // Дополнительная проверка rate limit для COD (3 заказа в час)
      const codRateLimit = await checkCODRateLimit(identifier);
      if (!codRateLimit.allowed) {
        console.warn(`[Checkout] COD rate limit exceeded for: ${identifier}`);
        return NextResponse.json(
          {
            error: 'Превишен лимит заявок. Моля, опитайте отново след известно време.',
            rateLimitExceeded: true,
            resetTime: codRateLimit.resetTime
          },
          { status: 429 }
        );
      }

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
        discount,
        promoCode: promoCodeApplied,
      });

      await sendTelegramNotification(telegramMessage);

      // Сохранение заказа в Sanity СНАЧАЛА (чтобы получить orderId для email)
      let sanityOrderId = null;
      try {
        const orderData: OrderData = {
          customerInfo: {
            firstName: sanitizedFormData.firstName,
            lastName: sanitizedFormData.lastName,
            email: sanitizedFormData.email,
            phone: sanitizedFormData.phone,
          },
          paymentMethod: 'cash_on_delivery',
          paymentStatus: 'pending',
          deliveryMethod: sanitizedFormData.deliveryMethod,
          deliveryDetails: {
            econtOfficeId: sanitizedFormData.econtOfficeId,
            econtOfficeCode: sanitizedFormData.econtOfficeCode,
            econtOfficeName: sanitizedFormData.econtOfficeName,
            city: sanitizedFormData.city,
            cityId: sanitizedFormData.cityId,
            postalCode: sanitizedFormData.postalCode,
            address: sanitizedFormData.address,
          },
          deliveryPrice,
          items: validatedItems.map((item) => {
            const product = products.find((p: any) => p._id === item.id);
            const priceData = getKidsPriceData(product, item.size);
            return {
              productId: item.id,
              productName: product?.name?.bg || product?.name?.en || 'Unknown',
              price: priceData.price,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
            };
          }),
          subtotal: itemsTotal,
          discount,
          total: grandTotal,
          promoCode: promoCodeApplied,
          customerNotes: sanitizedFormData.notes,
        };

        sanityOrderId = await createOrder(orderData);
      } catch (err) {
        console.error('[Checkout] Sanity order creation failed (non-critical):', err);
      }

      // Отправляем email клиенту (используем orderId из Sanity или fallback)
      console.log('📧 Sending COD order email...');
      try {
        await sendOrderConfirmationEmail({
          customerEmail: sanitizedFormData.email,
          customerName: `${sanitizedFormData.firstName} ${sanitizedFormData.lastName}`,
          customerPhone: sanitizedFormData.phone,
          items: validatedItems.map((item) => {
            const product = products.find((p: any) => p._id === item.id);
            const priceData = getKidsPriceData(product, item.size);
            return {
              name: product?.name?.en || product?.name?.bg || item.name || 'Unknown',
              quantity: item.quantity,
              price: priceData.price,
              size: item.size,
              color: item.color,
              image: product ? getProductImageUrl(product) : '',
            };
          }),
          paymentMethod: 'cash_on_delivery',
          deliveryMethod: sanitizedFormData.deliveryMethod,
          deliveryDetails: {
            econtOfficeId: sanitizedFormData.econtOfficeId,
            econtOfficeCode: sanitizedFormData.econtOfficeCode,
            econtOfficeName: sanitizedFormData.econtOfficeName,
            city: sanitizedFormData.city,
            cityId: sanitizedFormData.cityId,
            postalCode: sanitizedFormData.postalCode,
            address: sanitizedFormData.address,
          },
          deliveryPrice,
          subtotal: itemsTotal,
          discount,
          total: grandTotal,
          promoCode: promoCodeApplied,
          notes: sanitizedFormData.notes,
          orderId: sanityOrderId || `COD-${Date.now()}`,
        }, locale || 'bg');

        console.log('✅ COD email sent');
      } catch (emailError) {
        console.error('❌ COD email error (non-critical):', emailError);
      }

      return NextResponse.json({
        success: true,
        orderId: sanityOrderId || `COD-${Date.now()}`,
      });
    }

    // Если оплата картой - создаём Stripe сессию
    const lineItems = validatedItems.map((item) => {
      const product = products.find((p: any) => p._id === item.id);

      if (!product) {
        throw new Error(`Product not found: ${item.id}`);
      }

      // Получаем правильный stripePriceId на основе размера для детских товаров
      const priceData = getKidsPriceData(product, item.size);

      if (!priceData.stripePriceId) {
        throw new Error(
          `Product ${product.name?.en || product.name?.bg || item.id} (size: ${item.size || 'default'}) is not synced with Stripe`
        );
      }

      return {
        priceId: priceData.stripePriceId,
        quantity: item.quantity,
      };
    });

    const session = await createCheckoutSession(lineItems, metadata, deliveryPrice, locale || 'bg', discount);

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
  discount?: number;
  promoCode?: string;
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
    discount,
    promoCode,
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

  // Промокод и скидка
  if (promoCode && discount && discount > 0) {
    message += `\n<b>🎁 ПРОМОКОД:</b> ${promoCode}\n`;
    message += `Отстъпка: -€${discount.toFixed(2)}\n`;
  }

  // Сумма заказа
  const total = (amount / 100).toFixed(2);
  message += `\n<b>💰 ОБЩА СУМА: €${total}</b>\n`;

  return message;
}

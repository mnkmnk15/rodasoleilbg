import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { sanityClient } from '@/sanity/config';
import { sendTelegramNotification, formatOrderMessage } from '@/lib/telegram';
import { CheckoutFormData, DELIVERY_PRICES } from '@/types/checkout';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, formData } = body as {
      items: any[];
      formData?: CheckoutFormData;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid items array' },
        { status: 400 }
      );
    }

    if (!formData) {
      return NextResponse.json(
        { error: 'Missing checkout form data' },
        { status: 400 }
      );
    }

    // Получаем информацию о продуктах из Sanity
    const productIds = items.map((item: any) => item.id);
    const products = await sanityClient.fetch(
      `*[_id in $ids]{ _id, name, price, stripeProductId, stripePriceId }`,
      { ids: productIds }
    );

    // Вычисляем итоговую сумму
    const itemsTotal = items.reduce((sum: number, item: any) => {
      const product = products.find((p: any) => p._id === item.id);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const deliveryPrice =
      DELIVERY_PRICES[formData.deliveryMethod as keyof typeof DELIVERY_PRICES];
    const grandTotal = itemsTotal + deliveryPrice;

    // Создаём метаданные с полной информацией о заказе
    const metadata = {
      // Личные данные
      customerFirstName: formData.firstName,
      customerLastName: formData.lastName,
      customerEmail: formData.email,
      customerPhone: formData.phone,

      // Способ оплаты
      paymentMethod: formData.paymentMethod,

      // Доставка
      deliveryMethod: formData.deliveryMethod,
      deliveryPrice: deliveryPrice.toString(),

      // Данные доставки
      ...(formData.deliveryMethod === 'econt_office'
        ? {
            econtOfficeId: formData.econtOfficeId?.toString() || '',
            econtOfficeCode: formData.econtOfficeCode || '',
            econtOfficeName: formData.econtOfficeName || '',
          }
        : {
            city: formData.city || '',
            postalCode: formData.postalCode || '',
            address: formData.address || '',
          }),

      // Примечания
      notes: formData.notes || '',

      // Товары
      orderItems: JSON.stringify(
        items.map((item: any) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
        }))
      ),
    };

    // Если оплата наложенным платежом
    if (formData.paymentMethod === 'cash_on_delivery') {
      // Отправляем уведомление в Telegram
      const telegramMessage = formatOrderMessageWithDelivery({
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        amount: grandTotal * 100, // в центах для совместимости
        currency: 'EUR',
        items: items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        paymentMethod: 'Наложен платеж',
        deliveryMethod: formData.deliveryMethod,
        deliveryPrice,
        deliveryDetails:
          formData.deliveryMethod === 'econt_office'
            ? {
                type: 'office',
                officeName: formData.econtOfficeName,
                city: formData.city,
              }
            : {
                type: 'address',
                city: formData.city,
                postalCode: formData.postalCode,
                address: formData.address,
              },
        notes: formData.notes,
      });

      await sendTelegramNotification(telegramMessage);

      return NextResponse.json({
        success: true,
        orderId: `COD-${Date.now()}`,
      });
    }

    // Если оплата картой - создаём Stripe сессию
    const lineItems = items.map((item: any) => {
      const product = products.find((p: any) => p._id === item.id);

      if (!product) {
        throw new Error(`Product not found: ${item.id}`);
      }

      if (!product.stripePriceId) {
        throw new Error(
          `Product ${product.name.en || product.name.bg} is not synced with Stripe`
        );
      }

      return {
        priceId: product.stripePriceId,
        quantity: item.quantity,
      };
    });

    // Добавляем доставку как отдельный line item
    // Примечание: здесь нужно создать отдельный Price в Stripe для доставки
    // или добавить доставку в метаданные

    const session = await createCheckoutSession(lineItems, metadata);

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

  let message = `<b>🎉 НОВА ПОРЪЧКА</b>\n\n`;

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

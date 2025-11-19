import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';
import { sendTelegramNotification, formatOrderMessage } from '@/lib/telegram';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    console.log('🔔 Webhook received at:', new Date().toISOString());

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('❌ Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    console.log('✅ Webhook secret found, constructing event...');

    // Проверяем подпись webhook
    const event = constructWebhookEvent(body, signature, webhookSecret);

    console.log('📦 Event type:', event.type);

    // Обрабатываем событие
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Получаем детали заказа
        const customerEmail = session.customer_details?.email ?? session.metadata?.customerEmail ?? undefined;
        const customerName = session.customer_details?.name
          ?? (session.metadata?.customerFirstName && session.metadata?.customerLastName
            ? `${session.metadata.customerFirstName} ${session.metadata.customerLastName}`
            : undefined);
        const customerPhone = session.customer_details?.phone ?? session.metadata?.customerPhone ?? undefined;
        const amount = session.amount_total || 0;
        const currency = session.currency ?? 'eur';

        // Парсим информацию о товарах из метаданных
        let items: Array<{
          name: string;
          quantity: number;
          size?: string;
          color?: string;
        }> = [];

        if (session.metadata?.orderItems) {
          try {
            items = JSON.parse(session.metadata.orderItems);
          } catch (error) {
            console.error('Error parsing order items:', error);
          }
        }

        // Формируем расширенное сообщение для Telegram с данными доставки
        let message = `<b>🎉 НОВА ПОРЪЧКА (Платена с карта)</b>\n\n`;

        // Информация о клиенте
        message += `<b>👤 ДАННИ НА КЛИЕНТА:</b>\n`;
        if (customerName) message += `Име: ${customerName}\n`;
        if (customerEmail) message += `Email: ${customerEmail}\n`;
        if (customerPhone) message += `Телефон: ${customerPhone}\n`;

        // Способ оплаты
        message += `\n<b>💳 НАЧИН НА ПЛАЩАНЕ:</b>\n`;
        message += `Кредитна/дебитна карта (платена)\n`;

        // Доставка
        message += `\n<b>🚚 ДОСТАВКА:</b>\n`;
        const deliveryMethod = session.metadata?.deliveryMethod;
        const deliveryPrice = session.metadata?.deliveryPrice;

        if (deliveryMethod === 'econt_office') {
          message += `Тип: До офис/автомат Еконт\n`;
          if (session.metadata?.econtOfficeName) {
            message += `Офис: ${session.metadata.econtOfficeName}\n`;
          }
          if (session.metadata?.econtOfficeCode) {
            message += `Код офис: ${session.metadata.econtOfficeCode}\n`;
          }
        } else if (deliveryMethod === 'econt_address') {
          message += `Тип: До адрес\n`;
          if (session.metadata?.city) {
            message += `Град: ${session.metadata.city}\n`;
          }
          if (session.metadata?.postalCode) {
            message += `Пощенски код: ${session.metadata.postalCode}\n`;
          }
          if (session.metadata?.address) {
            message += `Адрес: ${session.metadata.address}\n`;
          }
        }

        if (deliveryPrice) {
          message += `Цена на доставка: €${deliveryPrice}\n`;
        }

        // Товары
        message += `\n<b>📦 ПОРЪЧАНИ ПРОДУКТИ:</b>\n`;
        items.forEach((item, index) => {
          message += `\n${index + 1}. ${item.name}\n`;
          message += `   Количество: ${item.quantity} бр.\n`;
          if (item.size) message += `   Размер: ${item.size}\n`;
          if (item.color) message += `   Цвят: ${item.color}\n`;
        });

        // Примечания
        if (session.metadata?.notes) {
          message += `\n<b>📝 БЕЛЕЖКИ:</b>\n${session.metadata.notes}\n`;
        }

        // Сумма заказа
        const total = (amount / 100).toFixed(2);
        message += `\n<b>💰 ОБЩА СУМА: €${total}</b>\n`;
        message += `\n<i>Session ID: ${session.id}</i>`;

        // Отправляем уведомление в Telegram
        console.log('📤 Sending Telegram notification...');
        await sendTelegramNotification(message);
        console.log('✅ Telegram notification sent successfully');

        console.log('✅ Order processed successfully:', session.id);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);

        // Можно отправить уведомление об ошибке
        await sendTelegramNotification(
          `❌ <b>Ошибка оплаты</b>\n\nPayment Intent: ${paymentIntent.id}\nError: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`
        );
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

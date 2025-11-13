import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';
import { sendTelegramNotification, formatOrderMessage } from '@/lib/telegram';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Проверяем подпись webhook
    const event = constructWebhookEvent(body, signature, webhookSecret);

    // Обрабатываем событие
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Получаем детали заказа
        const customerEmail = session.customer_details?.email;
        const customerName = session.customer_details?.name;
        const customerPhone = session.customer_details?.phone;
        const amount = session.amount_total || 0;
        const currency = session.currency;
        const shippingAddress = session.shipping_details?.address;

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

        // Формируем сообщение для Telegram
        const message = formatOrderMessage({
          sessionId: session.id,
          customerEmail,
          customerName,
          customerPhone,
          amount,
          currency,
          items,
          shippingAddress: shippingAddress
            ? {
                line1: shippingAddress.line1 || undefined,
                line2: shippingAddress.line2 || undefined,
                city: shippingAddress.city || undefined,
                postal_code: shippingAddress.postal_code || undefined,
                country: shippingAddress.country || undefined,
              }
            : undefined,
        });

        // Отправляем уведомление в Telegram
        await sendTelegramNotification(message);

        console.log('Order processed successfully:', session.id);
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

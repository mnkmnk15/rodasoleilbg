import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { sanityClient } from '@/sanity/config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid items array' },
        { status: 400 }
      );
    }

    // Получаем информацию о продуктах из Sanity
    const productIds = items.map((item: any) => item.id);
    const products = await sanityClient.fetch(
      `*[_id in $ids]{ _id, name, price, stripeProductId, stripePriceId }`,
      { ids: productIds }
    );

    // Создаём массив line items для Stripe
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

    // Создаём метаданные с информацией о заказе
    const metadata = {
      orderItems: JSON.stringify(
        items.map((item: any) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        }))
      ),
    };

    // Создаём сессию оформления заказа
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

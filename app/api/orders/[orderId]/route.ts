import { NextRequest, NextResponse } from 'next/server';
import { sanityClientWithToken } from '@/sanity/config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Получаем заказ из Sanity
    const order = await sanityClientWithToken.fetch(
      `*[_type == "order" && orderId == $orderId][0]{
        orderId,
        createdAt,
        orderStatus,
        paymentStatus,
        paymentMethod,
        deliveryMethod,
        deliveryDetails,
        deliveryPrice,
        items[]{
          productName,
          price,
          quantity,
          size,
          color
        },
        subtotal,
        discount,
        total,
        promoCode,
        customerInfo{
          firstName,
          lastName,
          email,
          phone
        },
        customerNotes
      }`,
      { orderId }
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('[Order API] Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

import { sanityClientWithToken } from '@/sanity/config';

export interface OrderData {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  paymentMethod: 'card' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'paid' | 'failed';
  stripeSessionId?: string;
  deliveryMethod: string;
  deliveryDetails: {
    econtOfficeId?: number;
    econtOfficeCode?: string;
    econtOfficeName?: string;
    city?: string;
    cityId?: number;
    postalCode?: string;
    address?: string;
  };
  deliveryPrice: number;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  promoCode?: string;
  customerNotes?: string;
}

export async function createOrder(orderData: OrderData): Promise<string | null> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Проверка дубликата (для Stripe webhooks - idempotency)
      if (orderData.stripeSessionId) {
        const existing = await sanityClientWithToken.fetch(
          `*[_type == "order" && stripeSessionId == $sid][0]{orderId}`,
          { sid: orderData.stripeSessionId }
        );
        if (existing) {
          console.log(`[Sanity Order] Already exists: ${existing.orderId}`);
          return existing.orderId;
        }
      }

      // Генерация ID заказа
      const prefix = orderData.paymentMethod === 'card' ? 'CARD' : 'COD';
      const orderId = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Создание документа заказа
      const doc = {
        _type: 'order',
        orderId,
        createdAt: new Date().toISOString(),
        customerInfo: orderData.customerInfo,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentStatus,
        stripeSessionId: orderData.stripeSessionId,
        deliveryMethod: orderData.deliveryMethod,
        deliveryDetails: orderData.deliveryDetails,
        deliveryPrice: orderData.deliveryPrice,
        items: orderData.items.map(item => ({
          _type: 'object',
          _key: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          productId: {
            _type: 'reference',
            _ref: item.productId,
            _weak: true // Слабая ссылка - товар МОЖНО удалить из каталога
          },
          productName: item.productName, // Дублируем название для истории
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        promoCode: orderData.promoCode,
        discount: orderData.discount,
        subtotal: orderData.subtotal,
        total: orderData.total,
        orderStatus: 'new',
        customerNotes: orderData.customerNotes,
      };

      const result = await sanityClientWithToken.create(doc);
      console.log(`[Sanity Order] ✅ Created: ${result._id} (${orderId})`);
      return orderId;

    } catch (error: any) {
      lastError = error;
      console.error(`[Sanity Order] ❌ Attempt ${attempt}/${maxRetries} failed:`, error.message);

      // Exponential backoff: 1s, 2s, 4s (max 5s)
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`[Sanity Order] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error('[Sanity Order] ❌ Failed after all retries:', lastError?.message);
  return null;
}

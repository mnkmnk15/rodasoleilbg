import Stripe from 'stripe';

// Ленивая инициализация Stripe клиента
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }

    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
      typescript: true,
    });
  }

  return stripeInstance;
}

export const stripe = getStripe;

// Интерфейс для детских размеров с ценами
export interface KidsSizePrice {
  size: string;
  price: number;
  stripePriceId?: string;
}

// Функция для создания или обновления продукта в Stripe
export async function syncProductToStripe(product: {
  id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
  stripeProductId?: string;
  stripePriceId?: string;
}) {
  try {
    const stripeClient = stripe();
    let stripeProduct: Stripe.Product;

    // Если у продукта уже есть Stripe Product ID, обновляем его
    if (product.stripeProductId) {
      stripeProduct = await stripeClient.products.update(product.stripeProductId, {
        name: product.name,
        description: product.description,
        images: product.images?.slice(0, 8), // Stripe позволяет максимум 8 изображений
        metadata: {
          sanityId: product.id,
        },
      });
    } else {
      // Создаём новый продукт в Stripe
      stripeProduct = await stripeClient.products.create({
        name: product.name,
        description: product.description,
        images: product.images?.slice(0, 8),
        metadata: {
          sanityId: product.id,
        },
      });
    }

    // Создаём или обновляем цену
    let stripePriceId = product.stripePriceId;

    // Если цена изменилась, создаём новую цену (в Stripe нельзя изменить существующую цену)
    if (!stripePriceId) {
      const price = await stripeClient.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(product.price * 100), // Конвертируем в центы
        currency: 'eur',
        metadata: {
          sanityId: product.id,
        },
      });
      stripePriceId = price.id;

      // Устанавливаем новую цену как default
      await stripeClient.products.update(stripeProduct.id, {
        default_price: stripePriceId,
      });
    } else {
      // Проверяем, изменилась ли цена
      try {
        const existingPrice = await stripeClient.prices.retrieve(stripePriceId);
        const newAmount = Math.round(product.price * 100);

        if (existingPrice.unit_amount !== newAmount) {
          // Деактивируем старую цену
          await stripeClient.prices.update(stripePriceId, { active: false });

          // Создаём новую цену
          const price = await stripeClient.prices.create({
            product: stripeProduct.id,
            unit_amount: newAmount,
            currency: 'eur',
            metadata: {
              sanityId: product.id,
            },
          });
          stripePriceId = price.id;

          // Устанавливаем новую цену как default
          await stripeClient.products.update(stripeProduct.id, {
            default_price: stripePriceId,
          });
        }
      } catch (error) {
        // Если старая цена не найдена, создаём новую
        const price = await stripeClient.prices.create({
          product: stripeProduct.id,
          unit_amount: Math.round(product.price * 100),
          currency: 'eur',
          metadata: {
            sanityId: product.id,
          },
        });
        stripePriceId = price.id;

        // Устанавливаем новую цену как default
        await stripeClient.products.update(stripeProduct.id, {
          default_price: stripePriceId,
        });
      }
    }

    return {
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePriceId,
    };
  } catch (error) {
    console.error('Error syncing product to Stripe:', error);
    throw error;
  }
}

// Функция для синхронизации детского товара с множественными ценами по размерам
export async function syncKidsProductToStripe(product: {
  id: string;
  name: string;
  description?: string;
  images?: string[];
  stripeProductId?: string;
  kidsSizePrices: KidsSizePrice[];
}) {
  try {
    const stripeClient = stripe();
    let stripeProduct: Stripe.Product;

    // Если у продукта уже есть Stripe Product ID, обновляем его
    if (product.stripeProductId) {
      stripeProduct = await stripeClient.products.update(product.stripeProductId, {
        name: product.name,
        description: product.description,
        images: product.images?.slice(0, 8),
        metadata: {
          sanityId: product.id,
          isKidsProduct: 'true',
        },
      });
    } else {
      // Создаём новый продукт в Stripe
      stripeProduct = await stripeClient.products.create({
        name: product.name,
        description: product.description,
        images: product.images?.slice(0, 8),
        metadata: {
          sanityId: product.id,
          isKidsProduct: 'true',
        },
      });
    }

    // Синхронизируем цены для каждого размера
    const updatedSizePrices: KidsSizePrice[] = [];

    for (const sizePrice of product.kidsSizePrices) {
      let stripePriceId = sizePrice.stripePriceId;
      const newAmount = Math.round(sizePrice.price * 100);

      if (!stripePriceId) {
        // Создаём новую цену для размера
        const price = await stripeClient.prices.create({
          product: stripeProduct.id,
          unit_amount: newAmount,
          currency: 'eur',
          metadata: {
            sanityId: product.id,
            size: sizePrice.size,
          },
          nickname: `${product.name} - ${sizePrice.size} см`,
        });
        stripePriceId = price.id;
      } else {
        // Проверяем, изменилась ли цена
        try {
          const existingPrice = await stripeClient.prices.retrieve(stripePriceId);

          if (existingPrice.unit_amount !== newAmount) {
            // Деактивируем старую цену
            await stripeClient.prices.update(stripePriceId, { active: false });

            // Создаём новую цену
            const price = await stripeClient.prices.create({
              product: stripeProduct.id,
              unit_amount: newAmount,
              currency: 'eur',
              metadata: {
                sanityId: product.id,
                size: sizePrice.size,
              },
              nickname: `${product.name} - ${sizePrice.size} см`,
            });
            stripePriceId = price.id;
          }
        } catch (error) {
          // Если старая цена не найдена, создаём новую
          const price = await stripeClient.prices.create({
            product: stripeProduct.id,
            unit_amount: newAmount,
            currency: 'eur',
            metadata: {
              sanityId: product.id,
              size: sizePrice.size,
            },
            nickname: `${product.name} - ${sizePrice.size} см`,
          });
          stripePriceId = price.id;
        }
      }

      updatedSizePrices.push({
        size: sizePrice.size,
        price: sizePrice.price,
        stripePriceId,
      });
    }

    // Устанавливаем первую цену как default (минимальную)
    if (updatedSizePrices.length > 0) {
      const minPriceItem = updatedSizePrices.reduce((min, curr) =>
        curr.price < min.price ? curr : min
      );
      await stripeClient.products.update(stripeProduct.id, {
        default_price: minPriceItem.stripePriceId,
      });
    }

    return {
      stripeProductId: stripeProduct.id,
      kidsSizePrices: updatedSizePrices,
    };
  } catch (error) {
    console.error('Error syncing kids product to Stripe:', error);
    throw error;
  }
}

// Функция для создания сессии оформления заказа
export async function createCheckoutSession(
  items: Array<{
    priceId: string;
    quantity: number;
  }>,
  metadata?: Record<string, string>,
  deliveryPrice?: number,
  locale: string = 'bg',
  discount?: number
) {
  try {
    const stripeClient = stripe();

    // Добавляем товары
    const lineItems = items.map(item => ({
      price: item.priceId,
      quantity: item.quantity,
    }));

    // Если есть стоимость доставки, добавляем её как динамический line item
    if (deliveryPrice && deliveryPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(deliveryPrice * 100), // Конвертируем в центы
          product_data: {
            name: 'Доставка',
            description: 'Стоимость доставки',
          },
        },
        quantity: 1,
      } as any);
    }

    // Создаём конфигурацию сессии
    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/checkout/cancel`,
      metadata: metadata || {},
      shipping_address_collection: {
        allowed_countries: ['BG', 'RO', 'GR', 'TR', 'RS', 'MK', 'AL'], // Балканские страны
      },
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      locale: 'auto',
    };

    // Если есть скидка, создаём одноразовый купон
    if (discount && discount > 0) {
      const coupon = await stripeClient.coupons.create({
        amount_off: Math.round(discount * 100), // Скидка в центах
        currency: 'eur',
        duration: 'once',
        name: `Промокод скидка €${discount.toFixed(2)}`,
      });

      sessionConfig.discounts = [{
        coupon: coupon.id,
      }];
    }

    const session = await stripeClient.checkout.sessions.create(sessionConfig);

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Функция для получения информации о сессии
export async function getCheckoutSession(sessionId: string) {
  try {
    const stripeClient = stripe();
    const session = await stripeClient.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer'],
    });
    return session;
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    throw error;
  }
}

// Функция для проверки webhook подписи
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
) {
  try {
    const stripeClient = stripe();
    return stripeClient.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Error constructing webhook event:', error);
    throw error;
  }
}

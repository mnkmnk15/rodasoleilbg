import { Resend } from 'resend';
import { render } from '@react-email/render';
import { sendCriticalTelegramNotification } from './telegram';

let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 секунда

interface OrderEmailData {
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    id?: string;
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
    image?: string;
  }>;
  paymentMethod?: string;
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
  subtotal: number;
  discount: number;
  total: number;
  promoCode?: string;
  notes?: string;
  orderId?: string;
}

// Helper function to delay execution
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Отправка email с retry механизмом
 */
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.error('[Email] RESEND_API_KEY не настроен');
    return false;
  }

  if (!process.env.EMAIL_FROM) {
    console.error('[Email] EMAIL_FROM не настроен');
    return false;
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const fromAddress = process.env.EMAIL_FROM_NAME
        ? `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`
        : process.env.EMAIL_FROM;

      console.log(`[Email] Attempt ${attempt}/${MAX_RETRIES} - Sending to: ${to}`);

      const client = getResendClient();
      const response = await client.emails.send({
        from: fromAddress,
        to,
        subject,
        html,
        text,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (attempt > 1) {
        console.log(`[Email] ✅ Успешно отправлено на попытке ${attempt}`);
      } else {
        console.log('[Email] ✅ Email отправлен успешно');
      }

      return true;
    } catch (error) {
      lastError = error as Error;
      console.error(`[Email] ❌ Попытка ${attempt}/${MAX_RETRIES} не удалась:`, error);

      if (attempt < MAX_RETRIES) {
        const delayMs = RETRY_DELAY * attempt;
        console.log(`[Email] ⏳ Ожидание ${delayMs}ms до следующей попытки...`);
        await delay(delayMs);
      }
    }
  }

  // Все попытки исчерпаны
  console.error('[Email] 🚨 КРИТИЧНО: Все попытки отправки исчерпаны!', lastError);

  // Отправляем критическое уведомление в Telegram
  try {
    await sendCriticalTelegramNotification(
      `🚨 Email отправка не удалась!\n\nПолучатель: ${to}\nОшибка: ${lastError?.message || 'Unknown error'}`
    );
  } catch (telegramError) {
    console.error('[Email] Не удалось отправить уведомление в Telegram:', telegramError);
  }

  return false;
}

/**
 * Генерация plain text версии письма
 */
function generatePlainTextOrder(orderData: OrderEmailData, locale: string): string {
  const { customerName, customerEmail, customerPhone, items, deliveryMethod, deliveryDetails, deliveryPrice, subtotal, discount, total, promoCode, notes } = orderData;

  let text = `RODASOLEIL - Благодарим за покупку!\n\n`;
  text += `Здравствуйте, ${customerName}!\n\n`;
  text += `Ваш заказ получен и обрабатывается.\n\n`;

  text += `=== ДАННЫЕ КЛИЕНТА ===\n`;
  text += `Имя: ${customerName}\n`;
  text += `Email: ${customerEmail}\n`;
  text += `Телефон: ${customerPhone}\n\n`;

  text += `=== ТОВАРЫ ===\n`;
  items.forEach((item, index) => {
    text += `${index + 1}. ${item.name}\n`;
    text += `   Количество: ${item.quantity} шт.\n`;
    text += `   Цена: €${item.price.toFixed(2)}\n`;
    if (item.size) text += `   Размер: ${item.size}\n`;
    if (item.color) text += `   Цвет: ${item.color}\n`;
    text += `\n`;
  });

  text += `=== РАСЧЕТЫ ===\n`;
  text += `Сумма товаров: €${subtotal.toFixed(2)}\n`;

  if (discount > 0 && promoCode) {
    text += `Промокод (${promoCode}): -€${discount.toFixed(2)}\n`;
  }

  text += `Доставка: €${deliveryPrice.toFixed(2)}\n`;
  text += `ИТОГО: €${total.toFixed(2)}\n`;

  if (discount > 0) {
    text += `Вы сэкономили: €${discount.toFixed(2)}\n`;
  }
  text += `\n`;

  text += `=== ДОСТАВКА ===\n`;
  if (deliveryMethod === 'econt_office') {
    text += `Способ: До офиса Econt\n`;
    if (deliveryDetails.econtOfficeName) text += `Офис: ${deliveryDetails.econtOfficeName}\n`;
    if (deliveryDetails.city) text += `Город: ${deliveryDetails.city}\n`;
  } else if (deliveryMethod === 'econt_address') {
    text += `Способ: До адреса (Econt)\n`;
    if (deliveryDetails.city) text += `Город: ${deliveryDetails.city}\n`;
    if (deliveryDetails.postalCode) text += `Индекс: ${deliveryDetails.postalCode}\n`;
    if (deliveryDetails.address) text += `Адрес: ${deliveryDetails.address}\n`;
  } else if (deliveryMethod === 'pickup_burgas') {
    text += `Способ: Самовывоз - Бургас\n`;
  }
  text += `\n`;

  if (notes) {
    text += `=== ПРИМЕЧАНИЯ ===\n${notes}\n\n`;
  }

  text += `С уважением,\nКоманда RODASOLEIL\n`;
  text += `Email: rodasoleilbg@gmail.com\n`;

  return text;
}

/**
 * Получение переводов для email на основе локали
 */
export function getEmailTranslations(locale: string) {
  // Временная заглушка - переводы будут добавлены в messages/*.json
  const translations: Record<string, any> = {
    bg: {
      subject: 'Благодарим за поръчката!',
      greeting: 'Здравейте',
      thankYou: 'Благодарим Ви за поръчката в RODASOLEIL',
      orderReceived: 'Вашата поръчка е получена и се обработва.',
      viewOrderButton: 'Виж статус на поръчката',
      orderDetails: 'Детайли на поръчката',
      productName: 'Продукт',
      quantity: 'Количество',
      price: 'Цена',
      size: 'Размер',
      color: 'Цвят',
      subtotal: 'Междинна сума',
      discount: 'Отстъпка',
      discountCode: 'Промокод',
      shipping: 'Доставка',
      total: 'Обща сума',
      youSaved: 'Спестихте',
      deliveryInfo: 'Информация за доставка',
      deliveryMethod: 'Начин на доставка',
      econtOffice: 'До офис/автомат Еконт',
      econtAddress: 'До адрес (Еконт)',
      pickup: 'Самовземане - Бургас',
      customerInfo: 'Вашите данни',
      notes: 'Бележки',
    },
    ru: {
      subject: 'Благодарим за заказ!',
      greeting: 'Здравствуйте',
      thankYou: 'Благодарим вас за заказ в RODASOLEIL',
      orderReceived: 'Ваш заказ получен и обрабатывается.',
      viewOrderButton: 'Посмотреть статус заказа',
      orderDetails: 'Детали заказа',
      productName: 'Товар',
      quantity: 'Количество',
      price: 'Цена',
      size: 'Размер',
      color: 'Цвет',
      subtotal: 'Сумма товаров',
      discount: 'Скидка',
      discountCode: 'Промокод',
      shipping: 'Доставка',
      total: 'Итого',
      youSaved: 'Вы сэкономили',
      deliveryInfo: 'Информация о доставке',
      deliveryMethod: 'Способ доставки',
      econtOffice: 'До офиса Econt',
      econtAddress: 'До адреса (Econt)',
      pickup: 'Самовывоз - Бургас',
      customerInfo: 'Ваши данные',
      notes: 'Примечания',
    },
    en: {
      subject: 'Thank you for your order!',
      greeting: 'Hello',
      thankYou: 'Thank you for your order at RODASOLEIL',
      orderReceived: 'Your order has been received and is being processed.',
      viewOrderButton: 'View order status',
      orderDetails: 'Order details',
      productName: 'Product',
      quantity: 'Quantity',
      price: 'Price',
      size: 'Size',
      color: 'Color',
      subtotal: 'Subtotal',
      discount: 'Discount',
      discountCode: 'Promo code',
      shipping: 'Shipping',
      total: 'Total',
      youSaved: 'You saved',
      deliveryInfo: 'Delivery information',
      deliveryMethod: 'Delivery method',
      econtOffice: 'To Econt office',
      econtAddress: 'To address (Econt)',
      pickup: 'Pickup - Burgas',
      customerInfo: 'Your information',
      notes: 'Notes',
    },
  };

  return translations[locale] || translations.bg;
}

/**
 * Основная функция отправки email подтверждения заказа
 */
export async function sendOrderConfirmationEmail(
  orderData: OrderEmailData,
  locale: string = 'bg'
): Promise<boolean> {
  const { customerEmail, customerName } = orderData;

  console.log('[Email] Подготовка email для:', customerEmail);

  try {
    // Динамический импорт шаблона для избежания проблем с SSR
    const { OrderConfirmation } = await import('@/emails/templates/OrderConfirmation');

    // Генерируем HTML из React компонента
    const emailHtml = await render(OrderConfirmation({ orderData, locale }));

    // Plain text версия
    const emailText = generatePlainTextOrder(orderData, locale);

    // Переводы для subject
    const t = getEmailTranslations(locale);
    const subject = `${t.subject} ${orderData.orderId ? `#${orderData.orderId}` : ''}`;

    return await sendEmail(customerEmail, subject, emailHtml, emailText);
  } catch (error) {
    console.error('[Email] Ошибка при подготовке email:', error);
    return false;
  }
}

export type { OrderEmailData };

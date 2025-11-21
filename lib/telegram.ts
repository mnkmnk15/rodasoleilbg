// Функция для отправки уведомления в Telegram с retry механизмом
// КРИТИЧЕСКИ ВАЖНО: Уведомления должны доходить ВСЕГДА

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 секунда

// Функция задержки
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Основная функция отправки с retry
export async function sendTelegramNotification(message: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('[Telegram] Credentials not configured - notification skipped');
    return false;
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (response.ok) {
        if (attempt > 1) {
          console.log(`[Telegram] Message sent successfully on attempt ${attempt}`);
        }
        return true;
      }

      const errorText = await response.text();
      lastError = new Error(`Telegram API error (${response.status}): ${errorText}`);
      console.error(`[Telegram] Attempt ${attempt}/${MAX_RETRIES} failed:`, errorText);

    } catch (error) {
      lastError = error as Error;
      console.error(`[Telegram] Attempt ${attempt}/${MAX_RETRIES} error:`, error);
    }

    // Ждем перед следующей попыткой (если это не последняя)
    if (attempt < MAX_RETRIES) {
      await delay(RETRY_DELAY * attempt); // Exponential backoff
    }
  }

  // Все попытки неудачны - логируем критическую ошибку
  console.error('[Telegram] CRITICAL: All retry attempts failed!', lastError);
  console.error('[Telegram] Message that failed to send:', message);

  // В production можно добавить отправку на резервный email
  // await sendFallbackEmail(message);

  return false;
}

// Функция для отправки критических уведомлений (с увеличенным retry)
export async function sendCriticalTelegramNotification(message: string): Promise<boolean> {
  const criticalMessage = `🚨 <b>КРИТИЧЕСКОЕ УВЕДОМЛЕНИЕ</b>\n\n${message}`;

  // Для критических - 5 попыток
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('[Telegram] CRITICAL: Cannot send notification - credentials missing!');
    return false;
  }

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: criticalMessage,
          parse_mode: 'HTML',
        }),
      });

      if (response.ok) return true;
    } catch (error) {
      console.error(`[Telegram] Critical notification attempt ${attempt}/5 failed`);
    }

    if (attempt < 5) await delay(2000 * attempt);
  }

  return false;
}

// Форматирование информации о заказе для Telegram
export function formatOrderMessage(orderData: {
  sessionId: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  amount: number;
  currency: string;
  items: Array<{
    name: string;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}) {
  const {
    customerEmail,
    customerName,
    customerPhone,
    amount,
    items,
    shippingAddress,
  } = orderData;

  let message = `<b>НОВЫЙ ЗАКАЗ</b>\n\n`;

  // Информация о клиенте
  message += `<b>ДАННЫЕ КЛИЕНТА:</b>\n`;
  if (customerName) {
    message += `Имя: ${customerName}\n`;
  }
  if (customerEmail) {
    message += `Email: ${customerEmail}\n`;
  }
  if (customerPhone) {
    message += `Телефон: ${customerPhone}\n`;
  }

  // Адрес доставки
  if (shippingAddress) {
    message += `\n<b>АДРЕС ДОСТАВКИ:</b>\n`;
    if (shippingAddress.line1) {
      message += `${shippingAddress.line1}\n`;
    }
    if (shippingAddress.line2) {
      message += `${shippingAddress.line2}\n`;
    }
    const cityLine = [
      shippingAddress.postal_code,
      shippingAddress.city,
      shippingAddress.state
    ].filter(Boolean).join(', ');
    if (cityLine) {
      message += `${cityLine}\n`;
    }
    if (shippingAddress.country) {
      message += `${shippingAddress.country}\n`;
    }
  }

  // Товары
  message += `\n<b>📦 ЗАКАЗАННЫЕ ТОВАРЫ:</b>\n`;
  items.forEach((item, index) => {
    message += `\n${index + 1}. ${item.name}\n`;
    message += `   Количество: ${item.quantity} шт.\n`;
    if (item.size) message += `   Размер: ${item.size}\n`;
    if (item.color) message += `   Цвет: ${item.color}\n`;
  });

  // Сумма заказа
  const total = (amount / 100).toFixed(2);
  message += `\n<b>💰 ИТОГО: ${total} EUR</b>\n`;

  return message;
}

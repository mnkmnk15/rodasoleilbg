// Функция для отправки уведомления в Telegram
export async function sendTelegramNotification(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram credentials not configured');
    return;
  }

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

    if (!response.ok) {
      const error = await response.text();
      console.error('Telegram API error:', error);
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
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
    currency,
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
  message += `\n <b>💰 ИТОГО: ${total} EUR</b>\n`;

  return message;
}

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
    postal_code?: string;
    country?: string;
  };
}) {
  const {
    sessionId,
    customerEmail,
    customerName,
    customerPhone,
    amount,
    currency,
    items,
    shippingAddress,
  } = orderData;

  let message = `🎉 <b>Новый заказ!</b>\n\n`;
  message += `📋 <b>ID сессии:</b> ${sessionId}\n\n`;

  if (customerName) {
    message += `👤 <b>Клиент:</b> ${customerName}\n`;
  }
  if (customerEmail) {
    message += `📧 <b>Email:</b> ${customerEmail}\n`;
  }
  if (customerPhone) {
    message += `📱 <b>Телефон:</b> ${customerPhone}\n`;
  }

  message += `\n💰 <b>Сумма:</b> ${(amount / 100).toFixed(2)} ${currency.toUpperCase()}\n\n`;

  message += `📦 <b>Товары:</b>\n`;
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name} (x${item.quantity})`;
    if (item.size) message += ` - Размер: ${item.size}`;
    if (item.color) message += ` - Цвет: ${item.color}`;
    message += `\n`;
  });

  if (shippingAddress) {
    message += `\n📍 <b>Адрес доставки:</b>\n`;
    if (shippingAddress.line1) message += `${shippingAddress.line1}\n`;
    if (shippingAddress.line2) message += `${shippingAddress.line2}\n`;
    if (shippingAddress.city)
      message += `${shippingAddress.city}${
        shippingAddress.postal_code ? ', ' + shippingAddress.postal_code : ''
      }\n`;
    if (shippingAddress.country) message += `${shippingAddress.country}\n`;
  }

  return message;
}

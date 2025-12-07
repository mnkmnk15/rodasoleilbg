'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface OrderData {
  orderId: string;
  createdAt: string;
  orderStatus: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'card' | 'cash_on_delivery';
  deliveryMethod: string;
  deliveryDetails: {
    econtOfficeName?: string;
    city?: string;
    address?: string;
  };
  deliveryPrice: number;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  promoCode?: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  customerNotes?: string;
}

const statusConfig = {
  new: {
    bg: { label: '🆕 Нов', color: 'bg-blue-100 text-blue-800' },
    ru: { label: '🆕 Новый', color: 'bg-blue-100 text-blue-800' },
    en: { label: '🆕 New', color: 'bg-blue-100 text-blue-800' },
  },
  processing: {
    bg: { label: '⚙️ В обработка', color: 'bg-yellow-100 text-yellow-800' },
    ru: { label: '⚙️ В обработке', color: 'bg-yellow-100 text-yellow-800' },
    en: { label: '⚙️ Processing', color: 'bg-yellow-100 text-yellow-800' },
  },
  shipped: {
    bg: { label: '📦 Изпратен', color: 'bg-purple-100 text-purple-800' },
    ru: { label: '📦 Отправлен', color: 'bg-purple-100 text-purple-800' },
    en: { label: '📦 Shipped', color: 'bg-purple-100 text-purple-800' },
  },
  delivered: {
    bg: { label: '✅ Доставен', color: 'bg-green-100 text-green-800' },
    ru: { label: '✅ Доставлен', color: 'bg-green-100 text-green-800' },
    en: { label: '✅ Delivered', color: 'bg-green-100 text-green-800' },
  },
  cancelled: {
    bg: { label: '❌ Отменен', color: 'bg-red-100 text-red-800' },
    ru: { label: '❌ Отменён', color: 'bg-red-100 text-red-800' },
    en: { label: '❌ Cancelled', color: 'bg-red-100 text-red-800' },
  },
};

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const locale = (params.locale as string) || 'bg';
  const t = useTranslations();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${orderId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Заказ не найден');
          } else {
            setError('Ошибка при загрузке заказа');
          }
          return;
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Ошибка при загрузке заказа');
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--foreground)]">
            {locale === 'bg' && 'Зареждане...'}
            {locale === 'ru' && 'Загрузка...'}
            {locale === 'en' && 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
            {locale === 'bg' && 'Заказът не е намерен'}
            {locale === 'ru' && 'Заказ не найден'}
            {locale === 'en' && 'Order not found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {locale === 'bg' && 'Моля, проверете номера на поръчката и опитайте отново.'}
            {locale === 'ru' && 'Пожалуйста, проверьте номер заказа и попробуйте снова.'}
            {locale === 'en' && 'Please check your order number and try again.'}
          </p>
          <a
            href={`/${locale}`}
            className="inline-block bg-[var(--accent)] text-white px-6 py-3 rounded hover:opacity-90 transition-opacity"
          >
            {locale === 'bg' && 'Към началото'}
            {locale === 'ru' && 'На главную'}
            {locale === 'en' && 'Go to homepage'}
          </a>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[order.orderStatus]?.[locale as 'bg' | 'ru' | 'en'] || statusConfig.new.bg;

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-semibold text-[var(--foreground)] mb-2">
                  {locale === 'bg' && 'Статус на поръчката'}
                  {locale === 'ru' && 'Статус заказа'}
                  {locale === 'en' && 'Order Status'}
                </h1>
                <p className="text-gray-600">
                  {locale === 'bg' && 'Поръчка'}
                  {locale === 'ru' && 'Заказ'}
                  {locale === 'en' && 'Order'} #{order.orderId}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">
                  {locale === 'bg' && 'Дата:'}
                  {locale === 'ru' && 'Дата:'}
                  {locale === 'en' && 'Date:'}
                </span>
                <span className="ml-2 text-[var(--foreground)] font-medium">
                  {new Date(order.createdAt).toLocaleDateString(locale)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">
                  {locale === 'bg' && 'Плащане:'}
                  {locale === 'ru' && 'Оплата:'}
                  {locale === 'en' && 'Payment:'}
                </span>
                <span className="ml-2 text-[var(--foreground)] font-medium">
                  {order.paymentStatus === 'paid' && (locale === 'bg' ? '✅ Платено' : locale === 'ru' ? '✅ Оплачено' : '✅ Paid')}
                  {order.paymentStatus === 'pending' && (locale === 'bg' ? '⏳ Очакване' : locale === 'ru' ? '⏳ Ожидание' : '⏳ Pending')}
                  {order.paymentStatus === 'failed' && (locale === 'bg' ? '❌ Грешка' : locale === 'ru' ? '❌ Ошибка' : '❌ Failed')}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
              {locale === 'bg' && 'Продукти'}
              {locale === 'ru' && 'Товары'}
              {locale === 'en' && 'Products'}
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-[var(--foreground)]">{item.productName}</p>
                    <div className="text-sm text-gray-600 mt-1 space-x-3">
                      {item.size && <span>{locale === 'bg' ? 'Размер' : locale === 'ru' ? 'Размер' : 'Size'}: {item.size}</span>}
                      {item.color && <span>{locale === 'bg' ? 'Цвят' : locale === 'ru' ? 'Цвет' : 'Color'}: {item.color}</span>}
                      <span>{locale === 'bg' ? 'Количество' : locale === 'ru' ? 'Количество' : 'Quantity'}: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-[var(--foreground)]">€{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">€{item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {locale === 'bg' && 'Междинна сума:'}
                  {locale === 'ru' && 'Сумма товаров:'}
                  {locale === 'en' && 'Subtotal:'}
                </span>
                <span className="text-[var(--foreground)]">€{order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {locale === 'bg' && 'Отстъпка'}
                    {locale === 'ru' && 'Скидка'}
                    {locale === 'en' && 'Discount'}
                    {order.promoCode && ` (${order.promoCode})`}:
                  </span>
                  <span className="text-green-600">-€{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {locale === 'bg' && 'Доставка:'}
                  {locale === 'ru' && 'Доставка:'}
                  {locale === 'en' && 'Shipping:'}
                </span>
                <span className="text-[var(--foreground)]">€{order.deliveryPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                <span className="text-[var(--foreground)]">
                  {locale === 'bg' && 'Обща сума:'}
                  {locale === 'ru' && 'Итого:'}
                  {locale === 'en' && 'Total:'}
                </span>
                <span className="text-[var(--accent)]">€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
              {locale === 'bg' && 'Доставка'}
              {locale === 'ru' && 'Доставка'}
              {locale === 'en' && 'Delivery'}
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-600">
                  {locale === 'bg' && 'Начин:'}
                  {locale === 'ru' && 'Способ:'}
                  {locale === 'en' && 'Method:'}
                </span>
                <span className="ml-2 text-[var(--foreground)]">
                  {order.deliveryMethod === 'econt_office' && (locale === 'bg' ? 'До офис Еконт' : locale === 'ru' ? 'До офиса Econt' : 'To Econt office')}
                  {order.deliveryMethod === 'econt_address' && (locale === 'bg' ? 'До адрес (Еконт)' : locale === 'ru' ? 'До адреса (Econt)' : 'To address (Econt)')}
                  {order.deliveryMethod === 'pickup_burgas' && (locale === 'bg' ? 'Самовземане - Бургас' : locale === 'ru' ? 'Самовывоз - Бургас' : 'Pickup - Burgas')}
                </span>
              </p>
              {order.deliveryDetails.econtOfficeName && (
                <p>
                  <span className="text-gray-600">
                    {locale === 'bg' && 'Офис:'}
                    {locale === 'ru' && 'Офис:'}
                    {locale === 'en' && 'Office:'}
                  </span>
                  <span className="ml-2 text-[var(--foreground)]">{order.deliveryDetails.econtOfficeName}</span>
                </p>
              )}
              {order.deliveryDetails.city && (
                <p>
                  <span className="text-gray-600">
                    {locale === 'bg' && 'Град:'}
                    {locale === 'ru' && 'Город:'}
                    {locale === 'en' && 'City:'}
                  </span>
                  <span className="ml-2 text-[var(--foreground)]">{order.deliveryDetails.city}</span>
                </p>
              )}
              {order.deliveryDetails.address && (
                <p>
                  <span className="text-gray-600">
                    {locale === 'bg' && 'Адрес:'}
                    {locale === 'ru' && 'Адрес:'}
                    {locale === 'en' && 'Address:'}
                  </span>
                  <span className="ml-2 text-[var(--foreground)]">{order.deliveryDetails.address}</span>
                </p>
              )}
            </div>
          </div>

          {/* Customer Notes */}
          {order.customerNotes && (
            <div className="bg-[var(--background)] border-l-4 border-[var(--accent)] rounded-lg p-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                {locale === 'bg' && 'Бележки'}
                {locale === 'ru' && 'Примечания'}
                {locale === 'en' && 'Notes'}
              </h3>
              <p className="text-[var(--foreground)]">{order.customerNotes}</p>
            </div>
          )}

          {/* Back button */}
          <div className="mt-8 text-center">
            <a
              href={`/${locale}`}
              className="inline-block bg-[var(--accent)] text-white px-8 py-3 rounded hover:opacity-90 transition-opacity font-medium"
            >
              {locale === 'bg' && 'Към началото'}
              {locale === 'ru' && 'На главную'}
              {locale === 'en' && 'Go to homepage'}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

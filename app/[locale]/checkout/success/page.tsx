'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const t = useTranslations('checkout');
  const locale = useLocale();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const isCashPayment = searchParams.get('cash') === 'true';

  useEffect(() => {
    const session = searchParams.get('session_id');
    const isCashPayment = searchParams.get('cash');

    if (session || isCashPayment) {
      setSessionId(session);
      // Очищаем корзину после успешной оплаты
      // Используем setTimeout чтобы дать useCart время загрузиться
      setTimeout(() => {
        clearCart();
      }, 0);
    } else {
      // Если нет session_id и не наложенный платеж, перенаправляем на главную
      router.push(`/${locale}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          {isCashPayment
            ? 'Поръчката е приета успешно!'
            : t('successTitle') || 'Поръчката е завършена успешно!'}
        </h1>

        <p className="text-gray-600 mb-6">
          {isCashPayment
            ? 'Благодарим ви за поръчката! Ще получите потвърждение на вашия имейл. Плащането ще се извърши при получаване на пратката.'
            : t('successMessage') ||
              'Благодарим ви за поръчката! Изпратихме потвърждение на вашия имейл.'}
        </p>

        {sessionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">
              {t('orderNumber') || 'Номер заказа'}:
            </p>
            <p className="text-xs font-mono text-gray-800 break-all">
              {sessionId}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href={`/${locale}/catalog`}
            className="block w-full py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:bg-neutral-900 transition-colors text-center"
          >
            {t('continueShopping') || 'Продолжить покупки'}
          </Link>

          <p className="text-sm text-gray-500 mb-2">
            {t('contactSupport') ||
              'По вопросам о заказе свяжитесь с нашей службой поддержки'}
          </p>

          <Link
            href={`/${locale}/contacts`}
            className="inline-flex items-center justify-center w-full py-2.5 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors text-center"
          >
            {locale === 'bg' ? 'Нашите контакти' : locale === 'ru' ? 'Наши контакты' : 'Our Contacts'}
          </Link>
        </div>
      </div>
    </div>
  );
}

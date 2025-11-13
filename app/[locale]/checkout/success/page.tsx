'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const t = useTranslations('checkout');
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const session = searchParams.get('session_id');

    if (session) {
      setSessionId(session);
      // Очищаем корзину после успешной оплаты
      clearCart();
    } else {
      // Если нет session_id, перенаправляем на главную
      router.push('/');
    }
  }, [searchParams, clearCart, router]);

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
          {t('successTitle') || 'Заказ оформлен успешно!'}
        </h1>

        <p className="text-gray-600 mb-6">
          {t('successMessage') ||
            'Спасибо за ваш заказ! Мы отправили подтверждение на вашу электронную почту.'}
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
          <Link href="/" className="block w-full">
            <button className="w-full py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:bg-neutral-900 transition-colors">
              {t('continueShopping') || 'Продолжить покупки'}
            </button>
          </Link>

          <p className="text-sm text-gray-500">
            {t('contactSupport') ||
              'По вопросам о заказе свяжитесь с нашей службой поддержки'}
          </p>
        </div>
      </div>
    </div>
  );
}

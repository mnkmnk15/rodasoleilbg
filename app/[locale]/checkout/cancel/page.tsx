'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutCancelPage() {
  const t = useTranslations('checkout');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Cancel Icon */}
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Cancel Message */}
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          {t('cancelTitle') || 'Оплата отменена'}
        </h1>

        <p className="text-gray-600 mb-6">
          {t('cancelMessage') ||
            'Ваш заказ не был оформлен. Товары остались в корзине.'}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:bg-neutral-900 transition-colors"
          >
            {t('backToCheckout') || 'Вернуться к оформлению'}
          </button>

          <Link href="/" className="block w-full">
            <button className="w-full py-3 border border-neutral-800 text-neutral-800 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              {t('continueShopping') || 'Продолжить покупки'}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

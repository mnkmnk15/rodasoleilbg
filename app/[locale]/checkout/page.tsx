'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { urlFor } from '@/sanity/config';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const t = useTranslations('checkout');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Если корзина пуста, перенаправляем на главную
    if (cart.items.length === 0) {
      router.push('/');
    }
  }, [cart.items.length, router]);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Отправляем запрос на создание сессии оформления заказа
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Перенаправляем на Stripe Checkout
      if (data.url) {
        // Используем URL напрямую (современный подход)
        window.location.href = data.url;
      } else {
        throw new Error('Checkout URL not received');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  if (cart.items.length === 0) {
    return null; // Или можно показать загрузку
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          {t('title') || 'Оформление заказа'}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {t('orderSummary') || 'Ваш заказ'}
          </h2>

          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={`${item.id}-${item.size || ''}-${item.color || ''}`}
                className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
              >
                {/* Product Image */}
                <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                  {item.image ? (
                    <Image
                      src={
                        typeof item.image === 'string'
                          ? item.image
                          : urlFor(item.image).url()
                      }
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-900">{item.name}</h3>

                  <div className="flex gap-2 mt-1 text-sm text-gray-600">
                    {item.size && (
                      <span>
                        {t('size') || 'Размер'}: {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span>
                        {t('color') || 'Цвет'}: {item.color}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">
                      {t('quantity') || 'Количество'}: {item.quantity}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-xl font-bold">
              <span>{t('total') || 'Итого'}:</span>
              <span>{formatPrice(cart.total)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full py-4 bg-neutral-800 text-white rounded-lg font-semibold hover:bg-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? t('processing') || 'Обработка...'
            : t('proceedToPayment') || 'Перейти к оплате'}
        </button>

        {/* Security Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            🔒 {t('securePayment') || 'Безопасная оплата через Stripe'}
          </p>
        </div>
      </div>
    </div>
  );
}

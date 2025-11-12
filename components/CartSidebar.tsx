'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/config';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeItem, updateQuantity } = useCart();
  const t = useTranslations('cart');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleQuantityChange = (
    id: string,
    currentQuantity: number,
    delta: number,
    size?: string,
    color?: string
  ) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity, size, color);
    } else {
      removeItem(id, size, color);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'BGN',
    }).format(price);
  };

  if (!mounted) return null;

  const content = (
    <>
      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'tween',
              duration: 0.3,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            style={{
              transform: 'translateZ(0)',
              willChange: 'transform'
            }}
            className="fixed right-0 top-0 h-screen w-[85%] sm:w-[450px] bg-white shadow-2xl z-[9999] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <h2 className="text-2xl font-bold text-neutral-900">{t('title')}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <svg
                  className="w-6 h-6 text-neutral-700"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg
                    className="w-24 h-24 text-gray-300 mb-4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-gray-500 text-lg">{t('empty')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size || ''}-${item.color || ''}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                        {item.image ? (
                          <Image
                            src={typeof item.image === 'string' ? item.image : urlFor(item.image).url()}
                            alt={item.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {item.name}
                        </h3>

                        {/* Size and Color */}
                        <div className="flex gap-2 mt-1 text-xs text-gray-600">
                          {item.size && <span>{t('size')}: {item.size}</span>}
                          {item.color && <span>{t('color')}: {item.color}</span>}
                        </div>

                        {/* Price */}
                        <p className="text-sm font-semibold mt-2">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.quantity,
                                -1,
                                item.size,
                                item.color
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            -
                          </button>

                          <span className="text-sm font-medium min-w-[20px] text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.quantity,
                                1,
                                item.size,
                                item.color
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id, item.size, item.color)}
                            className="ml-auto text-red-500 hover:text-red-700 text-sm"
                          >
                            {t('remove')}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Total and Checkout */}
            {cart.items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4 bg-white shadow-lg">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg">
                  <span className="font-medium">{t('subtotal')}:</span>
                  <span className="font-bold">{formatPrice(cart.total)}</span>
                </div>

                {/* Item Count */}
                <p className="text-sm text-gray-600">
                  {t('itemCount', { count: cart.itemCount })}
                </p>

                {/* Checkout Button */}
                <Link href="/checkout" onClick={onClose}>
                  <button className="w-full py-4 bg-neutral-800 text-white rounded-lg font-semibold hover:bg-neutral-900 transition-colors">
                    {t('checkout')}
                  </button>
                </Link>

                {/* Continue Shopping */}
                <button
                  onClick={onClose}
                  className="w-full py-3 border border-neutral-800 text-neutral-800 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  {t('continueShopping')}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return createPortal(content, document.body);
}

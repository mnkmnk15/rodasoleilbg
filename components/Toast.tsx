'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

export interface ToastProps {
  id: string;
  message: string;
  productName?: string;
  productImage?: string;
  productPrice?: number;
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({
  id,
  message,
  productName,
  productImage,
  productPrice,
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -100, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-md w-full pointer-events-auto"
      style={{
        border: '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Success Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {message}
            </p>

            {productName && (
              <div className="flex items-center gap-3 mt-2">
                {/* Product Image */}
                {productImage && (
                  <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={productImage}
                      alt={productName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {productName}
                  </p>
                  {productPrice && (
                    <p className="text-sm text-gray-600 mt-0.5">
                      €{productPrice.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={() => onClose(id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className="h-1 bg-green-500"
      />
    </motion.div>
  );
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {children}
      </AnimatePresence>
    </div>
  );
}

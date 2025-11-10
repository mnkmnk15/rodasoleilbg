'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { searchProducts } from '@/sanity/queries';
import { urlFor } from '@/sanity/config';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  _id: string;
  name: {
    bg: string;
    ru: string;
    en: string;
  };
  slug: {
    current: string;
  };
  image: any;
  price: number;
  inStock: boolean;
  gender?: string;
  productType?: string;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const t = useTranslations('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locale, setLocale] = useState<'bg' | 'ru' | 'en'>('bg');
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Get current locale
  useEffect(() => {
    const currentLocale = window.location.pathname.split('/')[1] || 'bg';
    setLocale(currentLocale as 'bg' | 'ru' | 'en');
  }, []);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
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

  // Debounced search function
  const performSearch = useCallback(
    async (query: string) => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchProducts(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Debounce search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, performSearch]);

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'BGN',
    }).format(price);
  };

  if (!mounted) return null;

  const content = (
    <>
      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 mx-auto mt-20 max-w-3xl bg-white rounded-lg shadow-2xl z-[9999] overflow-hidden"
          >
            {/* Search Input */}
            <div className="relative p-6 border-b">
              <div className="flex items-center gap-4">
                {/* Search Icon */}
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                {/* Input */}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('placeholder')}
                  className="flex-1 text-lg outline-none placeholder:text-gray-400"
                  autoFocus
                />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close search"
                >
                  <svg
                    className="w-5 h-5"
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
            </div>

            {/* Search Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-800"></div>
                </div>
              ) : searchTerm.trim().length < 2 ? (
                <div className="p-8 text-center text-gray-500">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p>{t('startTyping')}</p>
                </div>
              ) : results.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{t('noResults')}</p>
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4 px-2">
                    {t('resultsCount', { count: results.length })}
                  </p>

                  <div className="space-y-2">
                    {results.map((product) => (
                      <Link
                        key={product._id}
                        href={`/${locale}/catalog/${product.slug.current}`}
                        onClick={onClose}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {/* Product Image */}
                          <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                            {product.image && (
                              <Image
                                src={urlFor(product.image).url()}
                                alt={product.name[locale] || product.name.bg}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">
                              {product.name[locale] || product.name.bg}
                            </h3>

                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm font-semibold">
                                {formatPrice(product.price)}
                              </p>

                              {!product.inStock && (
                                <span className="text-xs text-red-600">
                                  {t('outOfStock')}
                                </span>
                              )}
                            </div>

                            {/* Product Meta */}
                            <div className="flex gap-2 mt-1 text-xs text-gray-500">
                              {product.gender && (
                                <span className="capitalize">{product.gender}</span>
                              )}
                              {product.productType && (
                                <span>{product.productType}</span>
                              )}
                            </div>
                          </div>

                          {/* Arrow Icon */}
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="border-t px-6 py-3 bg-gray-50 text-xs text-gray-500">
              <span className="font-medium">Tip:</span> {t('escToClose')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return createPortal(content, document.body);
}

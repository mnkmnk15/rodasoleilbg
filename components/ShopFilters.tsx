'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { useLocale } from 'next-intl';
import { SanityCategory } from '@/types/sanity';

interface ShopFiltersProps {
  categories: SanityCategory[];
  selectedCategory: string | null;
  onCategoryChange: (categorySlug: string | null) => void;
  selectedGender: string | null;
  onGenderChange: (genderSlug: string | null) => void;
  selectedProductType: string | null;
  onProductTypeChange: (typeSlug: string | null) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  showSaleOnly: boolean;
  onSaleToggle: () => void;
  showInStockOnly: boolean;
  onInStockToggle: () => void;
}

// Основные категории (по полу/возрасту)
const GENDER_CATEGORIES = [
  { slug: 'women', labelBg: 'Женски', labelRu: 'Женские', labelEn: 'Women' },
  { slug: 'mens', labelBg: 'Мъжки', labelRu: 'Мужские', labelEn: 'Men' },
  { slug: 'kids', labelBg: 'Детски', labelRu: 'Детские', labelEn: 'Kids' },
];

// Типы товаров
const PRODUCT_TYPES = [
  { slug: 'swimwear', labelBg: 'Бански', labelRu: 'Купальники', labelEn: 'Swimwear' },
  { slug: 'beachwear', labelBg: 'Плажни', labelRu: 'Пляжная Одежда', labelEn: 'Beachwear' },
  { slug: 'pants-skirts', labelBg: 'Панталони и Поли', labelRu: 'Штаны и Юбки', labelEn: 'Pants & Skirts' },
  { slug: 'robes-tunics', labelBg: 'Роби и Туники', labelRu: 'Халаты и Туники', labelEn: 'Robes & Tunics' },
  { slug: 't-shirts-shorts', labelBg: 'Тениски и Шорти', labelRu: 'Футболки и Шорты', labelEn: 'T-Shirts & Shorts' },
  { slug: 'sleeveless', labelBg: 'Без Ръкави', labelRu: 'Без Рукавов', labelEn: 'Sleeveless' },
  { slug: 'long-sleeve', labelBg: 'Дълъг Ръкав', labelRu: 'Длинный Рукав', labelEn: 'Long Sleeve' },
  { slug: 'zippers', labelBg: 'С Ципове', labelRu: 'С Молниями', labelEn: 'Zippers' },
  { slug: 'accessories', labelBg: 'Аксесоари', labelRu: 'Аксессуары', labelEn: 'Accessories' },
  { slug: 'other', labelBg: 'Други', labelRu: 'Другие', labelEn: 'Other' },
];

export default function ShopFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedGender,
  onGenderChange,
  selectedProductType,
  onProductTypeChange,
  sortBy,
  onSortChange,
  showSaleOnly,
  onSaleToggle,
  showInStockOnly,
  onInStockToggle,
}: ShopFiltersProps) {
  const locale = useLocale() as 'bg' | 'ru' | 'en';
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isGenderExpanded, setIsGenderExpanded] = useState(true);
  const [isTypesExpanded, setIsTypesExpanded] = useState(true);

  const getCategoryLabel = (cat: typeof GENDER_CATEGORIES[0] | typeof PRODUCT_TYPES[0]) => {
    if (locale === 'bg') return cat.labelBg;
    if (locale === 'ru') return cat.labelRu;
    return cat.labelEn;
  };

  const activeFiltersCount =
    (selectedGender ? 1 : 0) +
    (selectedProductType ? 1 : 0) +
    (showSaleOnly ? 1 : 0) +
    (showInStockOnly ? 1 : 0);

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-neutral-200 px-4 py-3">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center justify-center gap-2 w-full py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="font-medium">
            {locale === 'bg' ? 'Филтри' : locale === 'ru' ? 'Фильтры' : 'Filters'}
          </span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-white text-neutral-900 text-xs font-bold rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block space-y-6">
        <h2 className="text-2xl text-neutral-900" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontWeight: 600 }}>
          {locale === 'bg' ? 'Филтри' : locale === 'ru' ? 'Фильтры' : 'Filters'}
        </h2>

        {/* Gender Categories */}
        <div className="border-b border-neutral-200 pb-6">
          <button
            onClick={() => setIsGenderExpanded(!isGenderExpanded)}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
              {locale === 'bg' ? 'Категория' : locale === 'ru' ? 'Категория' : 'Category'}
            </h3>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isGenderExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {isGenderExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {GENDER_CATEGORIES.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() =>
                      onGenderChange(
                        selectedGender === category.slug ? null : category.slug
                      )
                    }
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedGender === category.slug
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {getCategoryLabel(category)}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Types */}
        <div className="border-b border-neutral-200 pb-6">
          <button
            onClick={() => setIsTypesExpanded(!isTypesExpanded)}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
              {locale === 'bg' ? 'Тип Продукт' : locale === 'ru' ? 'Тип Товара' : 'Product Type'}
            </h3>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isTypesExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {isTypesExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {PRODUCT_TYPES.map((type) => (
                  <button
                    key={type.slug}
                    onClick={() =>
                      onProductTypeChange(
                        selectedProductType === type.slug ? null : type.slug
                      )
                    }
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedProductType === type.slug
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {getCategoryLabel(type)}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Additional Filters */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={showSaleOnly}
              onChange={onSaleToggle}
              className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
            />
            <span className="text-sm text-neutral-700 group-hover:text-neutral-900">
              {locale === 'bg' ? 'Само Намаления' : locale === 'ru' ? 'Только Скидки' : 'Sale Items Only'}
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={showInStockOnly}
              onChange={onInStockToggle}
              className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
            />
            <span className="text-sm text-neutral-700 group-hover:text-neutral-900">
              {locale === 'bg' ? 'Само Налични' : locale === 'ru' ? 'Только В Наличии' : 'In Stock Only'}
            </span>
          </label>
        </div>
      </div>

      {/* Mobile Filters Sidebar */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 overflow-y-auto lg:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl text-neutral-900" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontWeight: 600 }}>
                    {locale === 'bg' ? 'Филтри' : locale === 'ru' ? 'Фильтры' : 'Filters'}
                  </h2>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Same filters as desktop */}
                <div className="space-y-6">
                  {/* Gender Categories */}
                  <div className="border-b border-neutral-200 pb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-4">
                      {locale === 'bg' ? 'Категория' : locale === 'ru' ? 'Категория' : 'Category'}
                    </h3>
                    <div className="space-y-2">
                      {GENDER_CATEGORIES.map((category) => (
                        <button
                          key={category.slug}
                          onClick={() => {
                            onGenderChange(
                              selectedGender === category.slug ? null : category.slug
                            );
                          }}
                          className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedGender === category.slug
                              ? 'bg-neutral-900 text-white'
                              : 'text-neutral-600 hover:bg-neutral-100'
                          }`}
                        >
                          {getCategoryLabel(category)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Types */}
                  <div className="border-b border-neutral-200 pb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-4">
                      {locale === 'bg' ? 'Тип Продукт' : locale === 'ru' ? 'Тип Товара' : 'Product Type'}
                    </h3>
                    <div className="space-y-2">
                      {PRODUCT_TYPES.map((type) => (
                        <button
                          key={type.slug}
                          onClick={() => {
                            onProductTypeChange(
                              selectedProductType === type.slug ? null : type.slug
                            );
                          }}
                          className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedProductType === type.slug
                              ? 'bg-neutral-900 text-white'
                              : 'text-neutral-600 hover:bg-neutral-100'
                          }`}
                        >
                          {getCategoryLabel(type)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Filters */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showSaleOnly}
                        onChange={onSaleToggle}
                        className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                      />
                      <span className="text-sm text-neutral-700">
                        {locale === 'bg' ? 'Само Намаления' : locale === 'ru' ? 'Только Скидки' : 'Sale Items Only'}
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showInStockOnly}
                        onChange={onInStockToggle}
                        className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                      />
                      <span className="text-sm text-neutral-700">
                        {locale === 'bg' ? 'Само Налични' : locale === 'ru' ? 'Только В Наличии' : 'In Stock Only'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

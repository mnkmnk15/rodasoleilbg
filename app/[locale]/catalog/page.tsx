'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ShopFilters from '@/components/ShopFilters';
import { SanityProduct, SanityCategory } from '@/types/sanity';
import { getAllProducts, getAllCategories } from '@/sanity/queries';
import { Loader2 } from 'lucide-react';

export default function ShopPage() {
  const locale = useLocale() as 'bg' | 'ru' | 'en';
  const t = useTranslations('catalog');
  const [products, setProducts] = useState<SanityProduct[]>([]);
  const [categories, setCategories] = useState<SanityCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);
        setProducts(productsData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply gender filter using new gender field
    if (selectedGender) {
      filtered = filtered.filter(
        (product) => product.gender === selectedGender
      );
    }

    // Apply product type filter using new productType field
    if (selectedProductType) {
      filtered = filtered.filter(
        (product) => product.productType === selectedProductType
      );
    }

    // Apply old category filter (for backward compatibility)
    if (selectedCategory && selectedCategory !== 'shop-all') {
      filtered = filtered.filter(
        (product) => product.category?.slug.current === selectedCategory
      );
    }

    // Apply sale filter
    if (showSaleOnly) {
      filtered = filtered.filter(
        (product) => product.compareAtPrice && product.compareAtPrice > product.price
      );
    }

    // Apply stock filter
    if (showInStockOnly) {
      filtered = filtered.filter((product) => product.inStock);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name[locale].localeCompare(b.name[locale]);
        case 'newest':
        default:
          return 0; // Already sorted by creation date from query
      }
    });

    return filtered;
  }, [products, selectedCategory, selectedGender, selectedProductType, showSaleOnly, showInStockOnly, sortBy, locale]);

  return (
    <main className="min-h-screen bg-white">
      <Header forceWhite={true} />

      {/* Hero Section with Background */}
      <section
        className="relative w-full pt-24 pb-20 md:pt-28 md:pb-24 lg:pt-32 lg:pb-32 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/catalogPage/backgroundHero.jpg)',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-5 md:mb-6 lg:mb-8 text-white"
              style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontWeight: 600 }}
            >
              {t('introTitle')}
            </h1>
            <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto">
              {t('introDescription')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1400px] mx-auto px-4 pt-12 pb-12 md:pt-16 md:pb-16 lg:pt-20 lg:pb-24">

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-28">
              <ShopFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedGender={selectedGender}
                onGenderChange={setSelectedGender}
                selectedProductType={selectedProductType}
                onProductTypeChange={setSelectedProductType}
                sortBy={sortBy}
                onSortChange={setSortBy}
                showSaleOnly={showSaleOnly}
                onSaleToggle={() => setShowSaleOnly(!showSaleOnly)}
                showInStockOnly={showInStockOnly}
                onInStockToggle={() => setShowInStockOnly(!showInStockOnly)}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Count and Sort */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
              <p className="text-sm text-neutral-600">
                {isLoading
                  ? locale === 'bg'
                    ? 'Зареждане...'
                    : locale === 'ru'
                    ? 'Загрузка...'
                    : 'Loading...'
                  : `${filteredAndSortedProducts.length} ${
                      locale === 'bg'
                        ? filteredAndSortedProducts.length === 1
                          ? 'продукт'
                          : 'продукта'
                        : locale === 'ru'
                        ? filteredAndSortedProducts.length === 1
                          ? 'товар'
                          : 'товаров'
                        : filteredAndSortedProducts.length === 1
                        ? 'product'
                        : 'products'
                    }`}
              </p>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-neutral-300 rounded-md text-sm text-neutral-700 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              >
                <option value="newest">{locale === 'bg' ? 'Най-нови' : locale === 'ru' ? 'Новейшие' : 'Newest'}</option>
                <option value="price-asc">{locale === 'bg' ? 'Цена: Ниска към Висока' : locale === 'ru' ? 'Цена: От низкой к высокой' : 'Price: Low to High'}</option>
                <option value="price-desc">{locale === 'bg' ? 'Цена: Висока към Ниска' : locale === 'ru' ? 'Цена: От высокой к низкой' : 'Price: High to Low'}</option>
                <option value="name-asc">{locale === 'bg' ? 'Име: А-Я' : locale === 'ru' ? 'Имя: А-Я' : 'Name: A-Z'}</option>
              </select>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-neutral-500 mb-2">
                  {locale === 'bg'
                    ? 'Няма намерени продукти'
                    : locale === 'ru'
                    ? 'Товары не найдены'
                    : 'No products found'}
                </p>
                <p className="text-sm text-neutral-400">
                  {locale === 'bg'
                    ? 'Опитайте да промените филтрите'
                    : locale === 'ru'
                    ? 'Попробуйте изменить фильтры'
                    : 'Try adjusting your filters'}
                </p>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && filteredAndSortedProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

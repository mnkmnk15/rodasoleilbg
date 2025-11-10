'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import { SanityProduct } from '@/types/sanity';
import { urlFor } from '@/sanity/config';
import { useCart } from '@/contexts/CartContext';

interface ProductCatalogClientProps {
  products: SanityProduct[];
}

interface ProductCardProps {
  product: SanityProduct;
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  const locale = useLocale() as 'bg' | 'ru' | 'en';
  const t = useTranslations('catalog');
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Get product images
  const frontImage = product.images && product.images[0] ? product.images[0] : '/images/placeholder.jpg';
  const backImage = product.images && product.images[1] ? product.images[1] : frontImage;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product._id,
      name: product.name[locale] || product.name.en,
      price: product.price,
      image: product.images[0],
      size: product.sizes?.[0],
      color: product.colors?.[0]?.name,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden bg-white rounded-sm"
        style={{
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isHovered ? '0 8px 30px rgba(0, 0, 0, 0.08)' : '0 4px 20px rgba(0, 0, 0, 0.06)',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          border: isHovered ? '1px solid rgba(208, 102, 52, 0.18)' : '1px solid transparent'
        }}
      >
        {/* Front Image */}
        <motion.img
          src={frontImage}
          alt={product.name[locale] || product.name.en}
          className="w-full h-full object-cover absolute inset-0"
          initial={{ opacity: 1 }}
          animate={{ opacity: isHovered ? 0 : 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Back Image */}
        <motion.img
          src={backImage}
          alt={`${product.name[locale] || product.name.en} - back`}
          className="w-full h-full object-cover absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* New Badge */}
        {product.newArrival && !product.bestseller && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-5 left-5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em]"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#1a1a1a',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              letterSpacing: '0.15em'
            }}
          >
            {locale === 'bg' ? 'Ново' : locale === 'ru' ? 'Новое' : 'New'}
          </motion.div>
        )}

        {/* Bestseller Badge */}
        {product.bestseller && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-2 left-2 md:bottom-auto md:top-3 md:left-3 px-3 py-1.5 text-[10px] md:text-xs font-medium uppercase tracking-[0.12em] z-20 rounded-sm"
            style={{
              background: '#1a1a1a',
              color: '#ffffff',
              letterSpacing: '0.12em'
            }}
          >
            {t('bestseller')}
          </motion.div>
        )}

        {/* Add to Cart Button */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 p-5"
            >
              <button
                onClick={handleAddToCart}
                className="w-full text-white py-3.5 px-6 flex items-center justify-center space-x-2.5 font-medium text-sm uppercase tracking-wider cursor-pointer"
                style={{
                  background: '#1a1a1a',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.1em'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#2a2a2a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1a1a1a';
                }}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="font-raleway">
                  {locale === 'bg' ? 'Добави в количка' :
                   locale === 'ru' ? 'Добавить в корзину' :
                   'Add to Cart'}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Favorite Button */}
        <motion.button
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center z-10 cursor-pointer"
          style={{
            background: isFavorite ? '#1a1a1a' : 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.3s ease'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart
            className="w-4 h-4 transition-all"
            style={{
              color: isFavorite ? '#ffffff' : '#1a1a1a',
              fill: isFavorite ? '#ffffff' : 'none',
              strokeWidth: 1.5
            }}
          />
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="mt-5 md:mt-7 space-y-1.5 md:space-y-2">
        <h3
          className="text-base sm:text-[17px] md:text-lg font-semibold text-[#1a1a1a] uppercase tracking-wide font-raleway"
          style={{
            letterSpacing: '0.08em'
          }}
        >
          {product.name[locale] || product.name.en}
        </h3>
        {product.description && (
          <p className="text-sm sm:text-[15px] md:text-base font-normal text-[#666666] font-raleway">
            {product.description[locale] || product.description.en}
          </p>
        )}
        <div className="flex items-center gap-2 pt-0.5 md:pt-1">
          <p className="text-base sm:text-lg md:text-xl font-medium text-[#1a1a1a] font-raleway">
            €{product.price.toFixed(2)}
          </p>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <p className="text-sm text-[#999999] line-through font-raleway">
              €{product.compareAtPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductCatalogClient({ products }: ProductCatalogClientProps) {
  const t = useTranslations('catalog');
  const locale = useLocale();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05
  });

  // Show only new arrivals or first 8 products
  const displayProducts = products.filter(p => p.newArrival).slice(0, 8);
  const productsToShow = displayProducts.length > 0 ? displayProducts : products.slice(0, 8);

  return (
    <section
      ref={ref}
      className="py-12 md:py-16 lg:py-20 relative"
      style={{
        background: '#FFFFFF'
      }}
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10 md:mb-14 lg:mb-16"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#1a1a1a] font-cormorant"
                style={{
                  fontWeight: 300,
                  letterSpacing: '0.01em',
                  lineHeight: 1.2
                }}
              >
                {locale === 'bg' ? 'Нови постъпления' : locale === 'ru' ? 'Новые поступления' : 'New Arrivals'}
              </h2>
            </div>

            {/* View All Link - Desktop */}
            <motion.a
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              href={`/${locale}/catalog`}
              className="hidden lg:flex items-center text-sm uppercase tracking-[0.15em] text-[#1a1a1a] font-medium group"
            >
              <span className="mr-2">{t('viewAll')}</span>
              <motion.span
                className="inline-block"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </motion.a>
          </div>
        </motion.div>

        {/* Products Grid */}
        {productsToShow.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 lg:gap-10 xl:gap-12 mb-12 md:mb-16 lg:mb-20">
            {productsToShow.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-[#666666] font-raleway">
              {locale === 'bg' ? 'Няма налични продукти' :
               locale === 'ru' ? 'Нет доступных товаров' :
               'No products available'}
            </p>
          </div>
        )}

        {/* View All Link - Centered Bottom */}
        {productsToShow.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-center"
          >
            <motion.a
              href={`/${locale}/catalog`}
              className="inline-flex items-center text-base uppercase tracking-[0.15em] text-[#1a1a1a] font-semibold font-raleway px-4 py-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <span className="mr-3">{t('viewAll')}</span>
              <motion.span
                className="inline-block text-lg"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  );
}

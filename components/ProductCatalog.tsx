'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';

// Mock product data - will be replaced with Strapi CMS
const mockProducts = [
  {
    id: 1,
    name: { bg: 'Shorts "Fashion"', ru: 'Shorts "Fashion"', en: 'Shorts "Fashion"' },
    description: { bg: 'Дамски шорти', ru: 'Женские шорты', en: 'Women shorts' },
    price: 89,
    imageFront: '/images/catalogmodels/ShortsFashionfront.webp',
    imageBack: '/images/catalogmodels/ShortsFashionback.webp',
    bestseller: true,
    isNew: true
  },
  {
    id: 2,
    name: { bg: 'Brasil', ru: 'Brasil', en: 'Brasil' },
    description: { bg: 'Еднокомпонентен бански', ru: 'Слитный купальник', en: 'One-piece Swimsuit' },
    price: 219,
    imageFront: '/images/catalogmodels/brasilfront.jpg',
    imageBack: '/images/catalogmodels/brasilback.jpg',
    bestseller: false,
    isNew: true
  },
  {
    id: 3,
    name: { bg: 'Meow', ru: 'Meow', en: 'Meow' },
    description: { bg: 'Еднокомпонентен бански', ru: 'Слитный купальник', en: 'One-piece Swimsuit' },
    price: 219,
    imageFront: '/images/catalogmodels/meowfront.webp',
    imageBack: '/images/catalogmodels/meowback.jpg',
    bestseller: true,
    isNew: false
  },
  {
    id: 4,
    name: { bg: 'Portofino', ru: 'Portofino', en: 'Portofino' },
    description: { bg: 'Еднокомпонентен бански', ru: 'Слитный купальник', en: 'One-piece Swimsuit' },
    price: 219,
    imageFront: '/images/catalogmodels/portofinofront.webp',
    imageBack: '/images/catalogmodels/portofinoback.webp',
    bestseller: false,
    isNew: true
  },
  {
    id: 5,
    name: { bg: 'Peacock Mayura', ru: 'Peacock Mayura', en: 'Peacock Mayura' },
    description: { bg: 'Еднокомпонентен бански с цип', ru: 'Слитный купальник с молнией', en: 'One-piece Zipper Swimsuit' },
    price: 259,
    imageFront: '/images/catalogmodels/PeacockMayurafront.webp',
    imageBack: '/images/catalogmodels/PeacockMayuraback.jpg',
    bestseller: true,
    isNew: true
  },
  {
    id: 6,
    name: { bg: 'Dragon and Phoenix', ru: 'Dragon and Phoenix', en: 'Dragon and Phoenix' },
    description: { bg: 'Еднокомпонентен бански с цип', ru: 'Слитный купальник с молнией', en: 'One-piece Zipper Swimsuit' },
    price: 219,
    imageFront: '/images/catalogmodels/DragonandPhoenixfront.webp',
    imageBack: '/images/catalogmodels/dragonandphoenixback.webp',
    bestseller: false,
    isNew: false
  },
  {
    id: 7,
    name: { bg: 'Art', ru: 'Art', en: 'Art' },
    description: { bg: 'Еднокомпонентен бански', ru: 'Слитный купальник', en: 'One-piece Swimsuit' },
    price: 189,
    imageFront: '/images/catalogmodels/artfront.webp',
    imageBack: '/images/catalogmodels/artback.webp',
    bestseller: false,
    isNew: true
  },
  {
    id: 8,
    name: { bg: 'Leopard', ru: 'Leopard', en: 'Leopard' },
    description: { bg: 'Еднокомпонентен бански с цип', ru: 'Слитный купальник с молнией', en: 'One-piece Zipper Swimsuit' },
    price: 189,
    imageFront: '/images/catalogmodels/leopardfront.webp',
    imageBack: '/images/catalogmodels/leopardback.webp',
    bestseller: false,
    isNew: false
  }
];

interface ProductCardProps {
  product: typeof mockProducts[0];
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations('catalog');
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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
      <div className="relative aspect-[2/3] overflow-hidden bg-[#f8f8f8]"
        style={{
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Front Image */}
        <motion.img
          src={product.imageFront}
          alt={product.name[locale as keyof typeof product.name]}
          className="w-full h-full object-cover absolute inset-0"
          initial={{ opacity: 1 }}
          animate={{ opacity: isHovered ? 0 : 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Back Image */}
        <motion.img
          src={product.imageBack}
          alt={`${product.name[locale as keyof typeof product.name]} - back`}
          className="w-full h-full object-cover absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Minimal Badges */}
        {product.isNew && (
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

        {product.bestseller && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-5 left-5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em]"
            style={{
              background: '#1a1a1a',
              color: '#ffffff',
              letterSpacing: '0.15em'
            }}
          >
            {t('bestseller')}
          </motion.div>
        )}

        {/* Add to Cart - Bottom Bar on Hover */}
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

        {/* Favorite Button - Always Visible */}
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

      {/* Product Info - Improved Typography */}
      <div className="mt-7 space-y-2">
        <h3
          className="text-[17px] md:text-lg font-semibold text-[#1a1a1a] uppercase tracking-wide font-raleway"
          style={{
            letterSpacing: '0.08em'
          }}
        >
          {product.name[locale as keyof typeof product.name]}
        </h3>
        <p className="text-[15px] md:text-base font-normal text-[#666666] font-raleway">
          {product.description[locale as keyof typeof product.description]}
        </p>
        <p className="text-lg md:text-xl font-medium text-[#1a1a1a] font-raleway pt-1">
          €{product.price.toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
}

export default function ProductCatalog() {
  const t = useTranslations('catalog');
  const locale = useLocale();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05
  });

  return (
    <section
      ref={ref}
      className="py-16 lg:py-20 relative"
      style={{
        background: '#f9f9f9'
      }}
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - Minimalist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 lg:mb-16"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-light text-[#1a1a1a] font-cormorant"
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
              href="#"
              className="hidden lg:flex items-center text-sm uppercase tracking-[0.15em] text-[#1a1a1a] font-medium group"
              whileHover={{ scale: 1.05 }}
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

        {/* Products Grid - Larger, More Impactful */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10 xl:gap-12 mb-20">
          {mockProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All Link - Centered Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center"
        >
          <motion.a
            href="#"
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
      </div>
    </section>
  );
}

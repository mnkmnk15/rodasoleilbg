'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { SanityProduct } from '@/types/sanity';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { formatPrice } from '@/sanity/config';

interface ProductCardProps {
  product: SanityProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale() as 'bg' | 'ru' | 'en';
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productName = product.name[locale];
  const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = isOnSale && product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product._id,
      name: productName,
      price: product.price,
      image: product.images[0],
      size: product.sizes?.[0],
      color: product.colors?.[0]?.name,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist({
      id: product._id,
      name: productName,
      price: product.price,
      image: product.images[0],
    });
  };

  const inWishlist = isInWishlist(product._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      <Link href={`/${locale}/catalog/${product.slug.current}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 rounded-lg">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.newArrival && (
              <span className="px-3 py-1 bg-black text-white text-xs font-medium uppercase tracking-wider">
                New
              </span>
            )}
            {isOnSale && (
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-medium uppercase tracking-wider">
                -{discount}%
              </span>
            )}
            {!product.inStock && (
              <span className="px-3 py-1 bg-gray-400 text-white text-xs font-medium uppercase tracking-wider">
                {locale === 'bg' ? 'Изчерпано' : locale === 'ru' ? 'Нет в наличии' : 'Out of Stock'}
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
              transition={{ duration: 0.2 }}
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                inWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-neutral-800 hover:bg-red-500 hover:text-white'
              }`}
              aria-label="Add to wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="p-2 bg-white/90 rounded-full backdrop-blur-md hover:bg-neutral-800 hover:text-white transition-colors"
              aria-label="Quick view"
            >
              <Eye className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Product Images */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={product.images[currentImageIndex] || '/placeholder-product.jpg'}
                alt={productName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Image Indicators */}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Add to Cart Button */}
          {product.inStock && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              onClick={handleAddToCart}
              className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-center gap-2 py-3 bg-white/95 backdrop-blur-md hover:bg-neutral-800 hover:text-white transition-all duration-300 rounded-md font-medium"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wider">
                {locale === 'bg' ? 'Добави в кошницата' : locale === 'ru' ? 'Добавить в корзину' : 'Add to Cart'}
              </span>
            </motion.button>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-2">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              {product.category.name[locale]}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-medium text-neutral-900 line-clamp-2 group-hover:text-neutral-600 transition-colors">
            {productName}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg text-neutral-900">
              {formatPrice(product.price)}
            </span>
            {isOnSale && (
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5">
              {product.colors.slice(0, 5).map((color, index) => (
                <div
                  key={index}
                  className="w-5 h-5 rounded-full border-2 border-neutral-200"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-xs text-neutral-500">
                  +{product.colors.length - 5}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

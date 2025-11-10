'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Minus, Plus, Check, ArrowLeft, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { SanityProduct } from '@/types/sanity';
import { getProductBySlug, getAllProducts } from '@/sanity/queries';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { formatPrice } from '@/sanity/config';

export default function ProductPage() {
  const params = useParams();
  const locale = useLocale() as 'bg' | 'ru' | 'en';
  const slug = params.slug as string;

  const [product, setProduct] = useState<SanityProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<SanityProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const productData = await getProductBySlug(slug);
        setProduct(productData);

        // Set default selections
        if (productData?.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
        if (productData?.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0].name);
        }

        // Fetch related products
        if (productData?.category) {
          const allProducts = await getAllProducts();
          const related = allProducts
            .filter(
              (p: SanityProduct) =>
                p.category?.slug.current === productData.category.slug.current &&
                p._id !== productData._id
            )
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Header forceWhite={true} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-neutral-200 border-t-neutral-900" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <Header forceWhite={true} />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            {locale === 'bg' ? 'Продуктът не е намерен' : locale === 'ru' ? 'Товар не найден' : 'Product Not Found'}
          </h1>
          <Link
            href={`/${locale}/catalog`}
            className="text-neutral-600 hover:text-neutral-900 underline"
          >
            {locale === 'bg' ? 'Обратно към каталога' : locale === 'ru' ? 'Вернуться в каталог' : 'Back to Catalog'}
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const productName = product.name[locale];
  const productDescription = product.description[locale];
  const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = isOnSale && product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: productName,
      price: product.price,
      image: product.images[0],
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product._id,
      name: productName,
      price: product.price,
      image: product.images[0],
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <Header forceWhite={true} />

      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Link href={`/${locale}`} className="hover:text-neutral-900">
            {locale === 'bg' ? 'Начало' : locale === 'ru' ? 'Главная' : 'Home'}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/catalog`} className="hover:text-neutral-900">
            {locale === 'bg' ? 'Каталог' : locale === 'ru' ? 'Каталог' : 'Catalog'}
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <span className="text-neutral-400">{product.category.name[locale]}</span>
            </>
          )}
        </div>
      </div>

      {/* Product Details */}
      <section className="max-w-[1400px] mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden"
            >
              <Image
                src={product.images[selectedImage]}
                alt={productName}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
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
              </div>
            </motion.div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-neutral-100 rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-neutral-900'
                        : 'border-transparent hover:border-neutral-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${productName} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {product.category && (
              <p className="text-sm text-neutral-500 uppercase tracking-wider">
                {product.category.name[locale]}
              </p>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-neutral-900">
              {productName}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-neutral-900">
                {formatPrice(product.price)}
              </span>
              {isOnSale && (
                <span className="text-xl text-neutral-400 line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-neutral-600 leading-relaxed">{productDescription}</p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                  {locale === 'bg' ? 'Цвят' : locale === 'ru' ? 'Цвет' : 'Color'}
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-md border-2 transition-all ${
                        selectedColor === color.name
                          ? 'border-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                      title={color.name}
                    >
                      <div
                        className="w-6 h-6 rounded-full border-2 border-neutral-200"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm font-medium">{color.name}</span>
                      {selectedColor === color.name && (
                        <Check className="w-4 h-4 text-neutral-900 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                  {locale === 'bg' ? 'Размер' : locale === 'ru' ? 'Размер' : 'Size'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 rounded-md border-2 font-medium uppercase text-sm transition-all ${
                        selectedSize === size
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {size.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                {locale === 'bg' ? 'Количество' : locale === 'ru' ? 'Количество' : 'Quantity'}
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2 border-2 border-neutral-200 rounded-md hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border-2 border-neutral-200 rounded-md hover:border-neutral-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all font-semibold uppercase tracking-wider"
              >
                {isAddedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    {locale === 'bg' ? 'Добавено!' : locale === 'ru' ? 'Добавлено!' : 'Added!'}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    {product.inStock
                      ? locale === 'bg'
                        ? 'Добави в кошницата'
                        : locale === 'ru'
                        ? 'Добавить в корзину'
                        : 'Add to Cart'
                      : locale === 'bg'
                      ? 'Изчерпано'
                      : locale === 'ru'
                      ? 'Нет в наличии'
                      : 'Out of Stock'}
                  </>
                )}
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`px-6 py-4 rounded-md border-2 transition-all ${
                  inWishlist
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-neutral-200 hover:border-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-200">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-neutral-600" />
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {locale === 'bg' ? 'Безплатна доставка' : locale === 'ru' ? 'Бесплатная доставка' : 'Free Shipping'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {locale === 'bg' ? 'Над 100 лв' : locale === 'ru' ? 'Свыше 100 лв' : 'Over €100'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-neutral-600" />
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {locale === 'bg' ? 'Сигурно плащане' : locale === 'ru' ? 'Безопасная оплата' : 'Secure Payment'}
                  </p>
                  <p className="text-xs text-neutral-500">100% {locale === 'bg' ? 'защитено' : locale === 'ru' ? 'защищено' : 'Protected'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RefreshCw className="w-6 h-6 text-neutral-600" />
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {locale === 'bg' ? 'Лесно връщане' : locale === 'ru' ? 'Легкий возврат' : 'Easy Returns'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {locale === 'bg' ? '30 дни' : locale === 'ru' ? '30 дней' : '30 Days'}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Features */}
            {product.features && product.features.length > 0 && (
              <div className="pt-6 border-t border-neutral-200">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-4">
                  {locale === 'bg' ? 'Характеристики' : locale === 'ru' ? 'Характеристики' : 'Features'}
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-neutral-600">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature[locale]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-neutral-200">
            <h2 className="text-3xl font-playfair font-bold text-neutral-900 mb-8">
              {locale === 'bg' ? 'Подобни продукти' : locale === 'ru' ? 'Похожие товары' : 'Related Products'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

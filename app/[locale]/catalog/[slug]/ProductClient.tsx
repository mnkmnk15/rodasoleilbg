'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, ShoppingBag, Minus, Plus, Check, Truck, ShieldCheck, RefreshCw, Ruler, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { SanityProduct } from '@/types/sanity';
import { getProductBySlug, getProductsByCategory } from '@/sanity/queries';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { formatPrice } from '@/sanity/config';

export default function ProductClient() {
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
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const productData = await getProductBySlug(slug);
        setProduct(productData);

        // Set default selections - check for kids sizes first, then adult sizes
        let availableSizes: string[] = [];
        if (productData?.gender === 'kids') {
          // Для детских товаров приоритет у kidsSizePrices
          if (productData?.kidsSizePrices && productData.kidsSizePrices.length > 0) {
            availableSizes = productData.kidsSizePrices.map((sp: { size: string }) => sp.size);
          } else if (productData?.kidsSizes) {
            availableSizes = productData.kidsSizes;
          }
        } else {
          availableSizes = productData?.sizes || [];
        }

        if (availableSizes.length > 0) {
          setSelectedSize(availableSizes[0]);
        }
        if (productData?.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0].name);
        }

        // Fetch related products
        if (productData?.category) {
          const related = await getProductsByCategory(productData.category.slug.current);
          setRelatedProducts(
            related.filter((p: SanityProduct) => p._id !== productData._id).slice(0, 4)
          );
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
  const productDescription = product.fullDescription?.[locale] || product.fullDescription?.en || product.description?.[locale] || product.description?.en;

  // Вычисляем текущую цену на основе выбранного размера для детских товаров
  const getCurrentPrice = (): number => {
    if (product.gender === 'kids' && product.kidsSizePrices && product.kidsSizePrices.length > 0 && selectedSize) {
      const sizePrice = product.kidsSizePrices.find(sp => sp.size === selectedSize);
      if (sizePrice) {
        return sizePrice.price;
      }
    }
    return product.price;
  };

  const currentPrice = getCurrentPrice();
  const isOnSale = product.compareAtPrice && product.compareAtPrice > currentPrice;
  const discount = isOnSale && product.compareAtPrice
    ? Math.round(((product.compareAtPrice - currentPrice) / product.compareAtPrice) * 100)
    : 0;
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: productName,
      price: currentPrice, // Используем текущую цену на основе выбранного размера
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
      <div className="max-w-[1400px] mx-auto px-4 py-6 lg:pt-28">
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
              <img
                src={product.images[selectedImage]}
                alt={productName}
                loading="eager"
                className="object-contain absolute inset-0 w-full h-full"
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
                    <img
                      src={image}
                      alt={`${productName} ${index + 1}`}
                      loading="lazy"
                      className="object-contain absolute inset-0 w-full h-full"
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
                {formatPrice(currentPrice)}
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

            {/* Size Selection - handles both adult and kids sizes */}
            {(() => {
              const isKids = product.gender === 'kids';

              // Для детских товаров используем kidsSizePrices (с ценами) или fallback на kidsSizes
              let availableSizes: string[] = [];
              let sizePriceMap: Record<string, number> = {};

              if (isKids) {
                if (product.kidsSizePrices && product.kidsSizePrices.length > 0) {
                  availableSizes = product.kidsSizePrices.map(sp => sp.size);
                  sizePriceMap = Object.fromEntries(product.kidsSizePrices.map(sp => [sp.size, sp.price]));
                } else if (product.kidsSizes) {
                  availableSizes = product.kidsSizes;
                }
              } else {
                availableSizes = product.sizes || [];
              }

              if (availableSizes.length === 0) return null;

              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                      {isKids
                        ? (locale === 'bg' ? 'Ръст' : locale === 'ru' ? 'Рост' : 'Height')
                        : (locale === 'bg' ? 'Размер' : locale === 'ru' ? 'Размер' : 'Size')}
                    </label>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      <Ruler className="w-4 h-4" />
                      {locale === 'bg' ? 'Размерна таблица' : locale === 'ru' ? 'Таблица размеров' : 'Size Guide'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => {
                      const sizePrice = sizePriceMap[size];
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-5 py-2.5 rounded-md border-2 font-medium text-sm transition-all ${
                            selectedSize === size
                              ? 'border-neutral-900 bg-neutral-900 text-white'
                              : 'border-neutral-200 hover:border-neutral-400'
                          }`}
                        >
                          {isKids ? `${size} см` : size.toUpperCase()}
                          {isKids && sizePrice && (
                            <span className="ml-1 text-xs opacity-75">
                              ({formatPrice(sizePrice)})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

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
                    {locale === 'bg' ? 'Бърза доставка' : locale === 'ru' ? 'Быстрая доставка' : 'Fast Shipping'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {locale === 'bg' ? 'С Еконт' : locale === 'ru' ? 'Курьером Econt' : 'With Econt'}
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
                    {locale === 'bg' ? '14 дни' : locale === 'ru' ? '14 дней' : '14 Days'}
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

            {/* Materials */}
            <div className="pt-6 border-t border-neutral-200">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-3">
                {locale === 'bg' ? 'Материали' : locale === 'ru' ? 'Материалы' : 'Materials'}
              </h3>
              <p className="text-neutral-600">72% Polyester, 28% Elastane</p>
            </div>
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

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsSizeGuideOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-900">
                {locale === 'bg' ? 'Размерна таблица' : locale === 'ru' ? 'Таблица размеров' : 'Size Guide'}
              </h2>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Women's Sizes */}
              <div>
                <h3 className="text-lg font-semibold text-[#d06634] mb-4 uppercase tracking-wider">
                  {locale === 'bg' ? 'Дамско облекло' : locale === 'ru' ? 'Женская одежда' : "Women's Clothing"}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-neutral-100">
                        <th className="px-3 py-2 text-left font-medium text-neutral-700 border border-neutral-200"></th>
                        <th className="px-3 py-2 text-center font-medium text-neutral-700 border border-neutral-200">XS</th>
                        <th className="px-3 py-2 text-center font-medium text-neutral-700 border border-neutral-200">S</th>
                        <th className="px-3 py-2 text-center font-medium text-neutral-700 border border-neutral-200">M</th>
                        <th className="px-3 py-2 text-center font-medium text-neutral-700 border border-neutral-200">L</th>
                        <th className="px-3 py-2 text-center font-medium text-neutral-700 border border-neutral-200">XL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-2 font-medium text-neutral-700 border border-neutral-200">
                          {locale === 'bg' ? 'гръдна обиколка' : locale === 'ru' ? 'обхват груди' : 'bust'}
                        </td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">76-80</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">84-88</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">92-96</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">100-104</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">110-116</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-medium text-neutral-700 border border-neutral-200">
                          {locale === 'bg' ? 'обиколка талия' : locale === 'ru' ? 'обхват талии' : 'waist'}
                        </td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">60-64</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">68-72</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">76-80</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">84-88</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">96-100</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-medium text-neutral-700 border border-neutral-200">
                          {locale === 'bg' ? 'обиколка ханш' : locale === 'ru' ? 'обхват бёдер' : 'hips'}
                        </td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">84-88</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">92-96</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">100-104</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">108-112</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">117-122</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-medium text-neutral-700 border border-neutral-200">
                          {locale === 'bg' ? 'диагонал' : locale === 'ru' ? 'диагональ' : 'diagonal'}
                        </td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">140-145</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">145-150</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">155-160</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">165-170</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">175-180</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Men's Sizes */}
              <div>
                <h3 className="text-lg font-semibold text-[#d06634] mb-4 uppercase tracking-wider">
                  {locale === 'bg' ? 'Мъжко облекло' : locale === 'ru' ? 'Мужская одежда' : "Men's Clothing"}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-neutral-100">
                        <th className="px-3 py-2 text-left font-medium text-neutral-700 border border-neutral-200"></th>
                        <th className="px-3 py-2 text-center font-medium text-neutral-700 border border-neutral-200">XS</th>
                        <th className="px-3 py-2 text-center font-medium text-neutral-700 border border-neutral-200">S</th>
                        <th className="px-3 py-2 text-center font-medium text-neutral-700 border border-neutral-200">M</th>
                        <th className="px-3 py-2 text-center font-medium text-neutral-700 border border-neutral-200">L</th>
                        <th className="px-3 py-2 text-center font-medium text-neutral-700 border border-neutral-200">XL</th>
                        <th className="px-3 py-2 text-center font-medium text-neutral-700 border border-neutral-200">2XL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-2 font-medium text-neutral-700 border border-neutral-200">
                          {locale === 'bg' ? 'гръдна обиколка' : locale === 'ru' ? 'обхват груди' : 'chest'}
                        </td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">80-84</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">88-92</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">96-100</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">104-108</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">112-116</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">120-124</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-medium text-neutral-700 border border-neutral-200">
                          {locale === 'bg' ? 'обиколка талия' : locale === 'ru' ? 'обхват талии' : 'waist'}
                        </td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">80-83</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">84-86</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">90-93</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">96-100</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">110-114</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">118-122</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-medium text-neutral-700 border border-neutral-200">
                          {locale === 'bg' ? 'обиколка ханш' : locale === 'ru' ? 'обхват бёдер' : 'hips'}
                        </td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">80-84</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">88-90</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">94-98</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">102-106</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">110-114</td>
                        <td className="px-3 py-2 text-center text-neutral-600 border border-neutral-200">118-122</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Kids' Sizes */}
              <div>
                <h3 className="text-lg font-semibold text-[#d06634] mb-4 uppercase tracking-wider">
                  {locale === 'bg' ? 'Детска размерна сетка' : locale === 'ru' ? 'Детская размерная сетка' : "Kids' Size Chart"}
                </h3>
                <p className="text-sm text-neutral-600 mb-3">
                  {locale === 'bg'
                    ? 'Детските размери са базирани на ръста на детето в сантиметри'
                    : locale === 'ru'
                    ? 'Детские размеры основаны на росте ребенка в сантиметрах'
                    : 'Kids sizes are based on child height in centimeters'}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-neutral-100">
                        <th className="px-2 py-2 text-center font-medium text-neutral-700 border border-neutral-200">104см</th>
                        <th className="px-2 py-2 text-center font-medium text-neutral-700 border border-neutral-200">110см</th>
                        <th className="px-2 py-2 text-center font-medium text-neutral-700 border border-neutral-200">116см</th>
                        <th className="px-2 py-2 text-center font-medium text-neutral-700 border border-neutral-200">122см</th>
                        <th className="px-2 py-2 text-center font-medium text-neutral-700 border border-neutral-200">128см</th>
                        <th className="px-2 py-2 text-center font-medium text-neutral-700 border border-neutral-200">134см</th>
                        <th className="px-2 py-2 text-center font-medium text-neutral-700 border border-neutral-200">140см</th>
                        <th className="px-2 py-2 text-center font-medium text-neutral-700 border border-neutral-200">146см</th>
                        <th className="px-2 py-2 text-center font-medium text-neutral-700 border border-neutral-200">152см</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-2 py-2 text-center text-neutral-600 border border-neutral-200 text-xs">3-4 {locale === 'bg' ? 'г.' : locale === 'ru' ? 'г.' : 'y'}</td>
                        <td className="px-2 py-2 text-center text-neutral-600 border border-neutral-200 text-xs">4-5 {locale === 'bg' ? 'г.' : locale === 'ru' ? 'г.' : 'y'}</td>
                        <td className="px-2 py-2 text-center text-neutral-600 border border-neutral-200 text-xs">5-6 {locale === 'bg' ? 'г.' : locale === 'ru' ? 'г.' : 'y'}</td>
                        <td className="px-2 py-2 text-center text-neutral-600 border border-neutral-200 text-xs">6-7 {locale === 'bg' ? 'г.' : locale === 'ru' ? 'г.' : 'y'}</td>
                        <td className="px-2 py-2 text-center text-neutral-600 border border-neutral-200 text-xs">7-8 {locale === 'bg' ? 'г.' : locale === 'ru' ? 'г.' : 'y'}</td>
                        <td className="px-2 py-2 text-center text-neutral-600 border border-neutral-200 text-xs">8-9 {locale === 'bg' ? 'г.' : locale === 'ru' ? 'г.' : 'y'}</td>
                        <td className="px-2 py-2 text-center text-neutral-600 border border-neutral-200 text-xs">9-10 {locale === 'bg' ? 'г.' : locale === 'ru' ? 'г.' : 'y'}</td>
                        <td className="px-2 py-2 text-center text-neutral-600 border border-neutral-200 text-xs">10-11 {locale === 'bg' ? 'г.' : locale === 'ru' ? 'г.' : 'y'}</td>
                        <td className="px-2 py-2 text-center text-neutral-600 border border-neutral-200 text-xs">11-12 {locale === 'bg' ? 'г.' : locale === 'ru' ? 'г.' : 'y'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-xs text-neutral-500 text-center">
                {locale === 'bg'
                  ? 'Всички измервания са в сантиметри (см)'
                  : locale === 'ru'
                  ? 'Все измерения указаны в сантиметрах (см)'
                  : 'All measurements are in centimeters (cm)'}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}

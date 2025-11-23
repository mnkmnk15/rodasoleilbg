// Sanity Product Types

// Интерфейс для детских размеров с индивидуальными ценами
export interface KidsSizePrice {
  size: string; // '104', '110', '116', '122', '128', '134', '140', '146', '152'
  price: number;
  stripePriceId?: string;
}

export interface SanityProduct {
  _id: string;
  name: {
    bg: string;
    ru: string;
    en: string;
  };
  slug: {
    current: string;
  };
  shortDescription?: {
    bg: string;
    ru: string;
    en: string;
  };
  fullDescription?: {
    bg: string;
    ru: string;
    en: string;
  };
  description?: { // Legacy field
    bg: string;
    ru: string;
    en: string;
  };
  images: string[];
  price: number; // Базовая цена (для взрослых товаров или fallback)
  compareAtPrice?: number;
  inStock: boolean;
  bestseller: boolean;
  newArrival: boolean;
  category?: SanityCategory; // Legacy field, now optional
  gender: 'women' | 'mens' | 'kids'; // New required field
  productType: 'swimwear' | 'beachwear' | 'pants-skirts' | 'robes-tunics' | 't-shirts-shorts' | 'sleeveless' | 'long-sleeve' | 'zippers' | 'accessories' | 'other'; // New required field
  sizes?: string[]; // For adults (XS, S, M, L, XL, XXL)
  kidsSizes?: string[]; // Legacy: For kids (height-based: 104, 110, 116, 122, 128, 134, 140, 146, 152)
  kidsSizePrices?: KidsSizePrice[]; // NEW: Детские размеры с индивидуальными ценами
  colors?: {
    name: string;
    hex: string;
  }[];
  features?: {
    bg: string;
    ru: string;
    en: string;
  }[];
  stripeProductId?: string;
  stripePriceId?: string;
}

export interface SanityCategory {
  _id: string;
  name: {
    bg: string;
    ru: string;
    en: string;
  };
  slug: {
    current: string;
  };
  categoryType: 'gender' | 'product-type' | 'general';
  image?: string;
  description?: {
    bg: string;
    ru: string;
    en: string;
  };
  order: number;
}

export interface SanityBanner {
  _id: string;
  title: {
    bg: string;
    ru: string;
    en: string;
  };
  subtitle: {
    bg: string;
    ru: string;
    en: string;
  };
  videoUrl: string;
  posterImage: string;
  active: boolean;
}

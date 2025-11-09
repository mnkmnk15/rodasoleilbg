// Sanity Product Types

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
  description: {
    bg: string;
    ru: string;
    en: string;
  };
  images: string[];
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  bestseller: boolean;
  newArrival: boolean;
  category?: SanityCategory; // Legacy field, now optional
  gender: 'women' | 'mens' | 'kids'; // New required field
  productType: 'swimwear' | 'beachwear' | 'pants-skirts' | 'robes-tunics' | 't-shirts-shorts' | 'sleeveless' | 'long-sleeve' | 'zippers' | 'accessories' | 'other'; // New required field
  sizes?: string[];
  colors?: {
    name: string;
    hex: string;
  }[];
  features?: {
    bg: string;
    ru: string;
    en: string;
  }[];
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

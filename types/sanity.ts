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
  category: SanityCategory;
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
  image?: string;
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

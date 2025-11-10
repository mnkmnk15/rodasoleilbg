import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Sanity client configuration
export const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7bepndor',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
};

// Set up the client for fetching data
export const sanityClient = createClient(config);

// Set up a helper function for generating Image URLs with only the asset reference data
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Helper function to format price
export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency,
  }).format(price);
}

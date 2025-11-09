import { sanityClient } from './config';

/**
 * GROQ Queries for Sanity CMS
 */

// Get all products
export async function getAllProducts() {
  const query = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    slug,
    description,
    "images": images[].asset->url,
    price,
    compareAtPrice,
    inStock,
    bestseller,
    newArrival,
    category->{
      name,
      slug,
      categoryType
    },
    gender,
    productType,
    sizes,
    colors,
    features
  }`;

  return await sanityClient.fetch(query);
}

// Get featured products (bestsellers)
export async function getFeaturedProducts(limit: number = 4) {
  const query = `*[_type == "product" && bestseller == true] | order(_createdAt desc) [0...${limit}] {
    _id,
    name,
    slug,
    "image": images[0].asset->url,
    price,
    compareAtPrice,
    inStock,
    bestseller
  }`;

  return await sanityClient.fetch(query);
}

// Get product by slug
export async function getProductBySlug(slug: string) {
  const query = `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    "images": images[].asset->url,
    price,
    compareAtPrice,
    inStock,
    bestseller,
    newArrival,
    category->{
      name,
      slug,
      categoryType
    },
    gender,
    productType,
    sizes,
    colors,
    features
  }`;

  return await sanityClient.fetch(query, { slug });
}

// Get products by category
export async function getProductsByCategory(categorySlug: string) {
  const query = `*[_type == "product" && category->slug.current == $categorySlug] {
    _id,
    name,
    slug,
    "image": images[0].asset->url,
    price,
    compareAtPrice,
    inStock,
    bestseller,
    category->{
      name,
      slug
    }
  }`;

  return await sanityClient.fetch(query, { categorySlug });
}

// Get all categories
export async function getAllCategories() {
  const query = `*[_type == "category"] | order(order asc) {
    _id,
    name,
    slug,
    categoryType,
    "image": image.asset->url,
    description,
    order
  }`;

  return await sanityClient.fetch(query);
}

// Get active homepage banner
export async function getActiveBanner() {
  const query = `*[_type == "banner" && active == true][0] {
    _id,
    title,
    subtitle,
    "videoUrl": video.asset->url,
    "posterImage": posterImage.asset->url
  }`;

  return await sanityClient.fetch(query);
}

// Search products
export async function searchProducts(searchTerm: string) {
  const query = `*[_type == "product" && (
    name.bg match $searchTerm ||
    name.ru match $searchTerm ||
    name.en match $searchTerm ||
    description.bg match $searchTerm ||
    description.ru match $searchTerm ||
    description.en match $searchTerm
  )] {
    _id,
    name,
    slug,
    "image": images[0].asset->url,
    price,
    inStock,
    gender,
    productType
  }`;

  return await sanityClient.fetch(query, { searchTerm: `*${searchTerm}*` });
}

// Get products by gender
export async function getProductsByGender(gender: 'women' | 'mens' | 'kids') {
  const query = `*[_type == "product" && gender == $gender] | order(_createdAt desc) {
    _id,
    name,
    slug,
    "image": images[0].asset->url,
    price,
    compareAtPrice,
    inStock,
    bestseller,
    gender,
    productType
  }`;

  return await sanityClient.fetch(query, { gender });
}

// Get products by product type
export async function getProductsByType(productType: string) {
  const query = `*[_type == "product" && productType == $productType] | order(_createdAt desc) {
    _id,
    name,
    slug,
    "image": images[0].asset->url,
    price,
    compareAtPrice,
    inStock,
    bestseller,
    gender,
    productType
  }`;

  return await sanityClient.fetch(query, { productType });
}

// Get products by gender and product type
export async function getProductsByGenderAndType(gender: 'women' | 'mens' | 'kids', productType: string) {
  const query = `*[_type == "product" && gender == $gender && productType == $productType] | order(_createdAt desc) {
    _id,
    name,
    slug,
    "image": images[0].asset->url,
    price,
    compareAtPrice,
    inStock,
    bestseller,
    gender,
    productType
  }`;

  return await sanityClient.fetch(query, { gender, productType });
}

// Get categories by type
export async function getCategoriesByType(categoryType: 'gender' | 'product-type' | 'general') {
  const query = `*[_type == "category" && categoryType == $categoryType] | order(order asc) {
    _id,
    name,
    slug,
    categoryType,
    "image": image.asset->url,
    description,
    order
  }`;

  return await sanityClient.fetch(query, { categoryType });
}

import { getAllProducts } from '@/sanity/queries';
import ProductCatalogClient from './ProductCatalogClient';

export default async function ProductCatalogServer() {
  try {
    const products = await getAllProducts();
    return <ProductCatalogClient products={products} />;
  } catch (error) {
    console.error('Error fetching products:', error);
    return <ProductCatalogClient products={[]} />;
  }
}

import { Product } from '../../types';
import { smartphoneProducts } from './smartphones';
import { tvProducts } from './tvs';
import { homeApplianceProducts } from './homeAppliances';
import { personalElectronicsProducts } from './personalElectronics';
import { computerProducts } from './computers';
import { kitchenApplianceProducts } from './kitchenAppliances';
import { audioProducts } from './audio';

export const allProducts: Product[] = [
  ...smartphoneProducts,
  ...tvProducts,
  ...homeApplianceProducts,
  ...personalElectronicsProducts,
  ...computerProducts,
  ...kitchenApplianceProducts,
  ...audioProducts
].filter((p): p is Product => Boolean(p && p.productId));

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getProductSlug(product: Product): string {
  if (!product) return '';
  return `${slugify(product.productName || '')}-${(product.productId || '').toLowerCase()}`;
}

export function getAllProducts(): Product[] {
  return allProducts.filter(p => p?.active);
}

export function getProductById(productId: string): Product | undefined {
  if (!productId) return undefined;
  return allProducts.find(p => p?.productId?.toLowerCase() === productId.toLowerCase());
}

export function getProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  // If slug contains the product ID suffix (e.g. dm-sp-001)
  const idMatch = slug.match(/dm-[a-z]+-[0-9]+/i);
  if (idMatch) {
    const id = idMatch[0].toUpperCase();
    const found = allProducts.find(p => p?.productId?.toUpperCase() === id);
    if (found) return found;
  }

  // Fallback to match slug of name
  return allProducts.find(p => p && (slugify(p.productName || '') === slug || getProductSlug(p) === slug));
}

export function getProductsByCategory(categoryNameOrSlug: string): Product[] {
  if (!categoryNameOrSlug) return [];
  const norm = categoryNameOrSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
  return allProducts.filter(p => {
    if (!p?.category) return false;
    const pNorm = p.category.toLowerCase().replace(/[^a-z0-9]/g, '');
    return pNorm === norm || pNorm.includes(norm) || norm.includes(pNorm);
  });
}

export function getMegaDeals(): Product[] {
  return allProducts.filter(p => p?.isMegaDeal).slice(0, 8);
}

export function getTrendingProducts(): Product[] {
  return allProducts.filter(p => p?.isTrending).slice(0, 8);
}

export function getPopularPicks(): Product[] {
  return allProducts.filter(p => p?.isPopularPick).slice(0, 8);
}

export function getLimitedTimeDeals(): Product[] {
  return allProducts.filter(p => p?.isLimitedTime).slice(0, 8);
}

export function getElectronicsForEveryHome(): Product[] {
  return allProducts.filter(p => p?.category === 'Home Appliances' || p?.category === 'Small Kitchen Appliances').slice(0, 8);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  if (!product) return [];
  return allProducts
    .filter(p => p && p.productId !== product.productId && (p.category === product.category || p.brand === product.brand))
    .slice(0, limit);
}

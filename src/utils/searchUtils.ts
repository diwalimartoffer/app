import { Product } from '../types';

export interface SearchMatchResult {
  products: Product[];
  matchType: 'exact' | 'partial' | 'brand_fallback' | 'category_fallback' | 'fuzzy_fallback' | 'none';
  fallbackNote?: string;
  matchedBrand?: string;
  matchedCategory?: string;
}

// Common brand aliases and synonyms
const BRAND_ALIASES: Record<string, string> = {
  iphone: 'Apple',
  ipad: 'Apple',
  macbook: 'Apple',
  airpods: 'Apple',
  galaxy: 'Samsung',
  bravia: 'Sony',
  playstation: 'Sony',
  oneplus: 'OnePlus',
  '1+': 'OnePlus',
  xiaomi: 'Xiaomi',
  redmi: 'Xiaomi',
  mi: 'Xiaomi',
  realme: 'Realme',
  vivo: 'Vivo',
  oppo: 'Oppo',
  motorola: 'Motorola',
  moto: 'Motorola',
  pixel: 'Google',
  asus: 'ASUS',
  rog: 'ASUS',
  lenovo: 'Lenovo',
  legion: 'Lenovo',
  dell: 'Dell',
  xps: 'Dell',
  alienware: 'Dell',
  hp: 'HP',
  spectre: 'HP',
  omen: 'HP',
  boat: 'boAt',
  noise: 'Noise',
  bose: 'Bose',
  marshall: 'Marshall',
  jbl: 'JBL',
  dyson: 'Dyson',
  philips: 'Philips',
  lg: 'LG',
  haier: 'Haier',
  voltas: 'Voltas',
  havells: 'Havells',
  prestige: 'Prestige',
  bajaj: 'Bajaj',
  morphy: 'Morphy Richards',
  morphi: 'Morphy Richards'
};

// Common category keyword mappings
const CATEGORY_KEYWORDS: Record<string, string> = {
  phone: 'Smartphones / Mobiles',
  phones: 'Smartphones / Mobiles',
  smartphone: 'Smartphones / Mobiles',
  smartphones: 'Smartphones / Mobiles',
  mobile: 'Smartphones / Mobiles',
  mobiles: 'Smartphones / Mobiles',
  cellphone: 'Smartphones / Mobiles',
  tv: 'TVs / Smart TVs',
  tvs: 'TVs / Smart TVs',
  television: 'TVs / Smart TVs',
  televisions: 'TVs / Smart TVs',
  oled: 'TVs / Smart TVs',
  qled: 'TVs / Smart TVs',
  laptop: 'Computers / Laptops',
  laptops: 'Computers / Laptops',
  pc: 'Computers / Laptops',
  computer: 'Computers / Laptops',
  computers: 'Computers / Laptops',
  notebook: 'Computers / Laptops',
  macbook: 'Computers / Laptops',
  headphone: 'Audio / Speakers',
  headphones: 'Audio / Speakers',
  earphone: 'Audio / Speakers',
  earphones: 'Audio / Speakers',
  earbuds: 'Audio / Speakers',
  tws: 'Audio / Speakers',
  speaker: 'Audio / Speakers',
  speakers: 'Audio / Speakers',
  soundbar: 'Audio / Speakers',
  audio: 'Audio / Speakers',
  airpods: 'Audio / Speakers',
  watch: 'Personal Electronics',
  watches: 'Personal Electronics',
  smartwatch: 'Personal Electronics',
  smartwatches: 'Personal Electronics',
  tablet: 'Personal Electronics',
  tablets: 'Personal Electronics',
  ipad: 'Personal Electronics',
  kindle: 'Personal Electronics',
  powerbank: 'Personal Electronics',
  fridge: 'Home Appliances',
  refrigerator: 'Home Appliances',
  washing: 'Home Appliances',
  washer: 'Home Appliances',
  purifier: 'Home Appliances',
  cleaner: 'Home Appliances',
  vacuum: 'Home Appliances',
  fryer: 'Small Kitchen Appliances',
  mixer: 'Small Kitchen Appliances',
  grinder: 'Small Kitchen Appliances',
  kettle: 'Small Kitchen Appliances',
  induction: 'Small Kitchen Appliances',
  cooker: 'Small Kitchen Appliances',
  coffee: 'Small Kitchen Appliances'
};

export function performSmartProductSearch(
  query: string,
  productList: Product[]
): SearchMatchResult {
  const raw = query.trim().toLowerCase();
  if (!raw) {
    return { products: productList, matchType: 'exact' };
  }

  // 1. First attempt: Direct exact or substring match across Name, Brand, Category, Specs
  const tokens = raw.split(/\s+/).filter(Boolean);

  const exactMatches = productList.filter(p => {
    const fullName = p.productName.toLowerCase();
    const brand = p.brand.toLowerCase();
    const category = p.category.toLowerCase();
    const subcategory = p.subcategory.toLowerCase();
    const fullText = `${fullName} ${brand} ${category} ${subcategory}`;

    // All tokens must match
    return tokens.every(token => fullText.includes(token));
  });

  if (exactMatches.length > 0) {
    return {
      products: exactMatches,
      matchType: 'exact'
    };
  }

  // 2. Partial match: At least 50% or primary tokens match
  const partialMatches = productList.filter(p => {
    const fullName = p.productName.toLowerCase();
    const brand = p.brand.toLowerCase();
    const category = p.category.toLowerCase();
    const subcategory = p.subcategory.toLowerCase();
    const desc = p.description.toLowerCase();
    const fullText = `${fullName} ${brand} ${category} ${subcategory} ${desc}`;

    const matchCount = tokens.filter(t => fullText.includes(t)).length;
    return matchCount > 0 && matchCount >= Math.ceil(tokens.length * 0.5);
  });

  if (partialMatches.length > 0) {
    return {
      products: partialMatches,
      matchType: 'partial',
      fallbackNote: `Showing top matches for "${query}"`
    };
  }

  // 3. Fallback: Identify Brand or Category from tokens & synonyms
  let detectedBrand: string | undefined;
  let detectedCategory: string | undefined;

  for (const token of tokens) {
    // Check brand aliases
    if (BRAND_ALIASES[token]) {
      detectedBrand = BRAND_ALIASES[token];
    }
    // Check known product brands directly
    for (const p of productList) {
      if (p.brand.toLowerCase() === token) {
        detectedBrand = p.brand;
        break;
      }
    }
    // Check category keywords
    if (CATEGORY_KEYWORDS[token]) {
      detectedCategory = CATEGORY_KEYWORDS[token];
    }
  }

  // If both Brand and Category detected (e.g. "oneplus phone", "apple laptop")
  if (detectedBrand && detectedCategory) {
    const brandCatMatches = productList.filter(
      p => p.brand.toLowerCase() === detectedBrand!.toLowerCase() && p.category === detectedCategory
    );
    if (brandCatMatches.length > 0) {
      return {
        products: brandCatMatches,
        matchType: 'brand_fallback',
        matchedBrand: detectedBrand,
        matchedCategory: detectedCategory,
        fallbackNote: `Exact model not found. Showing best results for ${detectedBrand} ${detectedCategory.split('/')[0].trim()}:`
      };
    }
  }

  // If Brand detected (e.g. "oneplus 11 pro", "iphone 15", "samsung s23")
  if (detectedBrand) {
    const brandMatches = productList.filter(
      p => p.brand.toLowerCase() === detectedBrand!.toLowerCase()
    );
    if (brandMatches.length > 0) {
      return {
        products: brandMatches,
        matchType: 'brand_fallback',
        matchedBrand: detectedBrand,
        fallbackNote: `Exact model not found. Showing available ${detectedBrand} festive deals:`
      };
    }
  }

  // If Category detected (e.g. "4k oled tv", "gaming laptop", "smartwatch")
  if (detectedCategory) {
    const catMatches = productList.filter(p => p.category === detectedCategory);
    if (catMatches.length > 0) {
      return {
        products: catMatches,
        matchType: 'category_fallback',
        matchedCategory: detectedCategory,
        fallbackNote: `Showing top deals in ${detectedCategory}:`
      };
    }
  }

  // 4. Ultimate graceful fallback: Top trending & popular festival picks
  const popularFallback = productList
    .filter(p => p && (p.isMegaDeal || p.isTrending || p.isPopularPick))
    .slice(0, 8);

  return {
    products: popularFallback.length > 0 ? popularFallback : productList.slice(0, 8),
    matchType: 'fuzzy_fallback',
    fallbackNote: `No exact matches for "${query}". Here are our top-rated Diwali electronics deals:`
  };
}

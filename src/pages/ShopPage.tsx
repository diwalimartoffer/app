import React, { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '../components/product/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { allProducts } from '../data/products';
import { STORE_CONFIG } from '../../src/config/storeConfig';
import { performSmartProductSearch } from '../utils/searchUtils';
import { SearchBar } from '../components/common/SearchBar';
import {
  SlidersHorizontal,
  X,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { DiyaIcon } from '../components/common/DiyaIcon';

interface ShopPageProps {
  navigate: (path: string) => void;
  initialFilter?: string | null;
  initialSearch?: string | null;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  navigate,
  initialFilter,
  initialSearch
}) => {
  const [search, setSearch] = useState<string>(initialSearch || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(150000);
  const [availabilityOnly, setAvailabilityOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    if (initialSearch !== undefined && initialSearch !== null) {
      setSearch(initialSearch);
    }
  }, [initialSearch]);

  useEffect(() => {
    if (initialFilter === 'megadeals') {
      setSortBy('popular');
    }
  }, [initialFilter]);

  // Extract all distinct brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach(p => set.add(p.brand));
    return Array.from(set).sort();
  }, []);

  // Smart Search matching
  const searchResult = useMemo(() => {
    if (!search.trim()) return null;
    return performSmartProductSearch(search, allProducts);
  }, [search]);

  // Filter products based on search results and active facets
  const filteredProducts = useMemo(() => {
    const baseList = searchResult ? searchResult.products : allProducts;

    return baseList.filter(p => {
      if (!p) return false;
      // Mega deals filter
      if (initialFilter === 'megadeals' && !p.isMegaDeal) return false;
      if (initialFilter === 'trending' && !p.isTrending) return false;
      if (initialFilter === 'popular' && !p.isPopularPick) return false;
      if (initialFilter === 'limited' && !p.isLimitedTime) return false;

      // Category filter (only apply if explicitly selected by user)
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
        return false;
      }

      // Price filter (Diwali price)
      if (p.diwaliPrice > priceMax) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }

      // Availability
      if (availabilityOnly && p.availability === 'out_of_stock') {
        return false;
      }

      return true;
    });
  }, [
    searchResult,
    selectedCategory,
    selectedBrand,
    minRating,
    priceMax,
    availabilityOnly,
    initialFilter
  ]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price_low_high':
        return list.sort((a, b) => a.diwaliPrice - b.diwaliPrice);
      case 'price_high_low':
        return list.sort((a, b) => b.diwaliPrice - a.diwaliPrice);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'popular':
      default:
        return list.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [filteredProducts, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMinRating(0);
    setPriceMax(150000);
    setAvailabilityOnly(false);
  };

  // Reusable Filter Sidebar
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
          Category
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[10px] text-stone-500 font-mono">({allProducts.length})</span>
          </button>
          {STORE_CONFIG.categories.map(c => {
            const count = allProducts.filter(p => p.category === c.name).length;
            return (
              <button
                key={c.slug}
                onClick={() => setSelectedCategory(c.name)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  selectedCategory === c.name
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <span className="truncate pr-1">{c.name}</span>
                <span className="text-[10px] text-stone-500 font-mono shrink-0">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
          Brand
        </h4>
        <select
          value={selectedBrand}
          onChange={e => setSelectedBrand(e.target.value)}
          aria-label="Filter by brand"
          className="w-full bg-[#1c120a] border border-amber-950/60 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Brands ({brands.length})</option>
          {brands.map(b => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Price Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
          <span>Max Price</span>
          <span className="text-stone-200 font-mono">₹{priceMax.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="1000"
          max="150000"
          step="1000"
          value={priceMax}
          onChange={e => setPriceMax(Number(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-stone-500 mt-1 font-mono">
          <span>₹1,000</span>
          <span>₹1,50,000</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
          Minimum Rating
        </h4>
        <div className="space-y-1.5">
          {[4.5, 4.0, 3.5].map(r => (
            <label
              key={r}
              className="flex items-center gap-2.5 text-xs text-stone-300 hover:text-white cursor-pointer select-none"
            >
              <input
                type="radio"
                name="minRating"
                checked={minRating === r}
                onChange={() => setMinRating(minRating === r ? 0 : r)}
                className="accent-amber-500"
              />
              <span>{r}★ and above</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Toggle */}
      <div>
        <label className="flex items-center gap-2.5 text-xs text-stone-300 hover:text-white cursor-pointer select-none">
          <input
            type="checkbox"
            checked={availabilityOnly}
            onChange={e => setAvailabilityOnly(e.target.checked)}
            className="accent-amber-500 rounded"
          />
          <span>In Stock items only</span>
        </label>
      </div>

      {/* Reset Filter Button */}
      <button
        onClick={resetFilters}
        className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Filters</span>
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-amber-950/60 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
            <DiyaIcon size={16} />
            <span>Diwali Electronics Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif">
            {search.trim()
              ? `Search: "${search}"`
              : initialFilter === 'megadeals'
              ? 'Diwali Mega Deals (50% to 60% Off)'
              : 'All Electronics'}
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Showing {sortedProducts.length} of {allProducts.length} festive electronics products with verified discounts.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-[#1c120a] border border-amber-900/40 text-stone-200 text-xs font-semibold flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400 hidden sm:block" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              aria-label="Sort products"
              className="w-full sm:w-44 bg-[#1c120a] border border-amber-900/40 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="popular">Popular Picks</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newly Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* Smart Fallback Search Feedback Banner */}
      {searchResult?.fallbackNote && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-3 text-xs shadow-md glow-gold">
          <div className="flex items-center gap-2.5 text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold text-stone-200">{searchResult.fallbackNote}</span>
          </div>
          <button
            onClick={() => setSearch('')}
            className="text-amber-400 hover:text-amber-300 font-semibold text-[11px] underline shrink-0 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 h-fit sticky top-28 shadow-xl">
          <FilterSidebar />
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.map(p => (
                <ProductCard key={p.productId} product={p} navigate={navigate} />
              ))}
            </div>
          ) : (
            <EmptyState
              type="search"
              onAction={resetFilters}
              actionText="Reset All Filters"
              customMessage="We couldn't find matching products for your specific filter combination. Try resetting your price or rating filters."
            />
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm lg:hidden">
          <div className="relative w-4/5 max-w-sm bg-[#120c07] border-r border-amber-950/60 p-6 flex flex-col h-full overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-amber-950/60 mb-6">
              <h3 className="font-serif font-bold text-stone-100 text-sm">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterSidebar />

            <div className="mt-8 pt-4 border-t border-amber-950/60">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
              >
                Apply Filters ({sortedProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

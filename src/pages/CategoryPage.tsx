import React, { useState, useMemo } from 'react';
import { STORE_CONFIG } from '../../src/config/storeConfig';
import { getProductsByCategory } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { DiyaIcon } from '../components/common/DiyaIcon';
import { ArrowLeft, ArrowUpDown } from 'lucide-react';

interface CategoryPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ slug, navigate }) => {
  const [selectedSubcat, setSelectedSubcat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');

  const categoryMeta = STORE_CONFIG.categories.find(c => c.slug === slug);
  const categoryName = categoryMeta?.name || slug.replace(/-/g, ' ');

  const products = useMemo(() => {
    return getProductsByCategory(categoryName);
  }, [categoryName]);

  const subcategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => set.add(p.subcategory));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedSubcat !== 'all') {
      list = list.filter(p => p.subcategory === selectedSubcat);
    }
    switch (sortBy) {
      case 'price_low_high':
        return list.sort((a, b) => a.diwaliPrice - b.diwaliPrice);
      case 'price_high_low':
        return list.sort((a, b) => b.diwaliPrice - a.diwaliPrice);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'popular':
      default:
        return list.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [products, selectedSubcat, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Breadcrumb / Back button */}
      <button
        onClick={() => navigate('/shop')}
        className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Electronics</span>
      </button>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-[#180f08] via-[#21140b] to-[#160e08] border border-amber-950/60 rounded-3xl p-6 sm:p-10 mb-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <DiyaIcon size={14} />
          <span>Festive Department</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-100 font-serif mb-2">
          {categoryName}
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
          {categoryMeta?.description || 'Explore our hand-picked Diwali collection with exclusive 50% festival discount.'}
        </p>
      </div>

      {/* Filter Tabs & Sorting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-amber-950/50 gap-4">
        {/* Subcategory Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedSubcat('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedSubcat === 'all'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            All Subcategories ({products.length})
          </button>
          {subcategories.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubcat(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedSubcat === sub
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full sm:w-44 bg-[#1c120a] border border-amber-950/60 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
          >
            <option value="popular">Popular</option>
            <option value="price_low_high">Price: Low to High</option>
            <option value="price_high_low">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map(product => (
          <ProductCard key={product.productId} product={product} navigate={navigate} />
        ))}
      </div>
    </div>
  );
};

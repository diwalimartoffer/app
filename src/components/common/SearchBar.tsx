import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { allProducts, getProductSlug } from '../../data/products';
import { performSmartProductSearch } from '../../utils/searchUtils';
import { Product } from '../../types';
import { ImageWithFallback } from './ImageWithFallback';

interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  navigate: (path: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = '',
  placeholder = 'Search smartphones, 4K TVs, laptops, air fryers...',
  onSearch,
  navigate,
  className = '',
  autoFocus = false
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const searchResult = query.trim()
    ? performSmartProductSearch(query, allProducts)
    : null;

  const suggestions = searchResult ? searchResult.products.slice(0, 5) : [];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (clean) {
      setIsOpen(false);
      if (onSearch) {
        onSearch(clean);
      } else {
        navigate(`/shop?search=${encodeURIComponent(clean)}`);
      }
    }
  };

  const handleSelectProduct = (product: Product) => {
    setIsOpen(false);
    navigate(`/product/${getProductSlug(product)}`);
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleFormSubmit} className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-[#160f09] border border-amber-950/70 hover:border-amber-500/50 focus:border-amber-400 rounded-2xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all shadow-inner"
        />
        <Search className="w-4 h-4 text-amber-500/80 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Live Suggestions Dropdown */}
      {isOpen && query.trim().length > 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#140e09] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-amber-950/40 glow-gold">
          {searchResult?.fallbackNote && (
            <div className="p-2.5 bg-amber-950/40 text-[11px] text-amber-300 font-medium flex items-center gap-1.5 px-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{searchResult.fallbackNote}</span>
            </div>
          )}

          {suggestions.length > 0 ? (
            <div className="py-1">
              {suggestions.map(p => {
                const discount = Math.round(
                  ((p.referenceOnlineSalePrice - p.diwaliPrice) / p.referenceOnlineSalePrice) * 100
                );
                return (
                  <button
                    key={p.productId}
                    type="button"
                    onClick={() => handleSelectProduct(p)}
                    className="w-full px-3 py-2.5 hover:bg-[#1f150c] flex items-center justify-between text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <ImageWithFallback
                        src={p.productImages[0]}
                        alt={p.productName}
                        fallbackTitle={p.productName}
                        category={p.category}
                        subcategory={p.subcategory}
                        brand={p.brand}
                        className="w-9 h-9 rounded-lg object-contain bg-white p-0.5 border border-amber-950/50 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-stone-200 group-hover:text-amber-300 truncate">
                          {p.productName}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {p.brand} · {p.category.split('/')[0]}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-amber-400 font-mono">
                        ₹{p.diwaliPrice.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[9px] font-bold text-red-400 bg-red-950/60 px-1.5 py-0.2 rounded">
                        {discount}% OFF
                      </span>
                    </div>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleFormSubmit}
                className="w-full py-2.5 px-3 bg-[#19110a] hover:bg-[#22160d] text-center text-xs font-semibold text-amber-400 flex items-center justify-center gap-1.5 transition-colors border-t border-amber-950/40"
              >
                <span>View all results for &ldquo;{query}&rdquo;</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-stone-400">
              No matching products found. Try &ldquo;OnePlus&rdquo;, &ldquo;iPhone&rdquo;, or &ldquo;4K TV&rdquo;.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

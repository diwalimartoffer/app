import React, { useState, useRef, useEffect } from 'react';
import { DiyaIcon } from '../common/DiyaIcon';
import { STORE_CONFIG } from '../../config/storeConfig';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Package,
  Layers,
  HelpCircle
} from 'lucide-react';
import { allProducts, getProductSlug } from '../../data/products';
import { SearchBar } from '../common/SearchBar';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const { totalItemsCount } = useCart();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0e0906]/95 backdrop-blur-md border-b border-amber-950/60 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 border border-amber-500/40 flex items-center justify-center shadow-md shadow-amber-950/60 group-hover:scale-105 transition-transform">
                <DiyaIcon size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-stone-100 group-hover:text-amber-300 transition-colors">
                  {STORE_CONFIG.brandName}
                </span>
                <span className="text-[10px] text-amber-500/80 font-medium tracking-wider -mt-1 hidden sm:block">
                  FESTIVAL ELECTRONICS
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <SearchBar navigate={navigate} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-stone-300">
            <button
              onClick={() => navigate('/')}
              className={`hover:text-amber-400 transition-colors ${
                currentPath === '/' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Home
            </button>

            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className="flex items-center gap-1 hover:text-amber-400 transition-colors py-2 focus:outline-none"
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    categoriesDropdownOpen ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 mt-1 bg-[#160f09] border border-amber-900/50 rounded-xl shadow-2xl shadow-black/80 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {STORE_CONFIG.categories.map(cat => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        navigate(`/category/${cat.slug}`);
                        setCategoriesDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-stone-300 hover:bg-amber-950/50 hover:text-amber-300 transition-colors flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-amber-500/60 font-mono">50% OFF</span>
                    </button>
                  ))}
                  <div className="border-t border-amber-950/60 mt-1 pt-1">
                    <button
                      onClick={() => {
                        navigate('/shop');
                        setCategoriesDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-950/40"
                    >
                      View All Electronics →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/shop?filter=megadeals')}
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Deals</span>
            </button>

            <button
              onClick={() => navigate('/orders')}
              className={`hover:text-amber-400 transition-colors ${
                currentPath.startsWith('/orders') ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              My Orders
            </button>

            <button
              onClick={() => navigate('/help')}
              className={`hover:text-amber-400 transition-colors ${
                currentPath.startsWith('/help') || currentPath.startsWith('/contact')
                  ? 'text-amber-400 font-semibold'
                  : ''
              }`}
            >
              Help & Contact
            </button>
          </nav>

          {/* Action Zone: Account & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Account CTA */}
            <button
              onClick={() => navigate('/account')}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-800 text-xs font-medium flex items-center gap-2 transition-colors"
              title="My Account"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">
                {user ? user.fullName.split(' ')[0] : 'Account'}
              </span>
            </button>

            {/* Cart CTA */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="bg-stone-950 text-amber-300 text-[11px] font-extrabold px-1.5 py-0.5 rounded-full min-w-5 text-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="md:hidden pb-3">
          <SearchBar navigate={navigate} placeholder="Search Diwali deals & electronics..." />
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-950/60 bg-[#120c07] px-4 py-5 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-sm font-medium text-stone-200 py-2 border-b border-stone-800/60"
            >
              <DiyaIcon size={18} />
              <span>Home</span>
            </button>

            <button
              onClick={() => {
                navigate('/shop');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-sm font-medium text-stone-200 py-2 border-b border-stone-800/60"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>All Electronics & Shop</span>
            </button>

            <button
              onClick={() => {
                navigate('/shop?filter=megadeals');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-sm font-semibold text-amber-400 py-2 border-b border-stone-800/60"
            >
              <Sparkles className="w-4 h-4" />
              <span>Diwali Mega Deals (50% OFF)</span>
            </button>

            <button
              onClick={() => {
                navigate('/orders');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-sm font-medium text-stone-200 py-2 border-b border-stone-800/60"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>My Orders</span>
            </button>

            <button
              onClick={() => {
                navigate('/help');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-sm font-medium text-stone-200 py-2 border-b border-stone-800/60"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Help & Contact Us</span>
            </button>

            <div className="pt-2">
              <span className="text-[11px] font-bold text-amber-500/80 tracking-wider uppercase block mb-2">
                Categories
              </span>
              <div className="grid grid-cols-1 gap-1.5 pl-2">
                {STORE_CONFIG.categories.map(c => (
                  <button
                    key={c.slug}
                    onClick={() => {
                      navigate(`/category/${c.slug}`);
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-xs text-stone-300 py-1.5 hover:text-amber-300 flex items-center justify-between"
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-amber-500/60">50% OFF</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

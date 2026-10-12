import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryCard } from '../components/home/CategoryCard';
import { ProductCard } from '../components/product/ProductCard';
import { DiyaIcon } from '../components/common/DiyaIcon';
import { STORE_CONFIG } from '../../src/config/storeConfig';
import {
  getMegaDeals,
  getTrendingProducts,
  getPopularPicks,
  getElectronicsForEveryHome,
  getLimitedTimeDeals
} from '../data/products';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Tag,
  Headphones,
  Truck,
  RotateCcw,
  Clock
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const megaDeals = getMegaDeals();
  const trending = getTrendingProducts();
  const popular = getPopularPicks();
  const everyHome = getElectronicsForEveryHome();
  const limitedTime = getLimitedTimeDeals();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 3. Hero Diwali Sale Banner */}
      <HeroBanner navigate={navigate} />

      {/* 4. Shop by Category */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
              <DiyaIcon size={16} />
              <span>Festive Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STORE_CONFIG.categories.map(cat => (
            <CategoryCard
              key={cat.slug}
              name={cat.name}
              slug={cat.slug}
              description={cat.description}
              iconName={cat.icon}
              onClick={() => navigate(`/category/${cat.slug}`)}
            />
          ))}
        </div>
      </section>

      {/* 5. Diwali Mega Deals */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-amber-950/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Flat 50% Off</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif">
              Diwali Mega Deals
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Top-tier flagship electronics with genuine festive pricing.
            </p>
          </div>
          <button
            onClick={() => navigate('/shop?filter=megadeals')}
            className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>See All Mega Deals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {megaDeals.map(product => (
            <ProductCard key={product.productId} product={product} navigate={navigate} />
          ))}
        </div>
      </section>

      {/* 6. Trending Electronics */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-amber-950/40 bg-[#0f0a06]/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
              <DiyaIcon size={16} />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif">
              Trending Electronics
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Most browsed smartphones, soundbars, and smart wearables this festive week.
            </p>
          </div>
          <button
            onClick={() => navigate('/shop?filter=trending')}
            className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>Explore Trending</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trending.map(product => (
            <ProductCard key={product.productId} product={product} navigate={navigate} />
          ))}
        </div>
      </section>

      {/* 7. Popular Picks */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-amber-950/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Editor's Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif">
              Popular Picks
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              High-rating 4K smart screens, gaming rigs, and luxury festive audio.
            </p>
          </div>
          <button
            onClick={() => navigate('/shop?filter=popular')}
            className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Picks</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {popular.map(product => (
            <ProductCard key={product.productId} product={product} navigate={navigate} />
          ))}
        </div>
      </section>

      {/* 8. Electronics for Every Home */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-amber-950/40 bg-[#0e0906]/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
              <DiyaIcon size={16} />
              <span>Home & Kitchen Upgrade</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif">
              Electronics for Every Home
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Air purifiers, robotic cleaners, air fryers, and mixer grinders for seamless celebration.
            </p>
          </div>
          <button
            onClick={() => navigate('/category/home-appliances')}
            className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>Shop Home Upgrades</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {everyHome.map(product => (
            <ProductCard key={product.productId} product={product} navigate={navigate} />
          ))}
        </div>
      </section>

      {/* 9. Limited-Time Deals */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-amber-950/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-widest mb-1.5">
              <Clock className="w-4 h-4 text-red-400" />
              <span>Special Festival Window</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif">
              Limited-Time Deals
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Exclusive festive inventory available until Diwali stock depletes.
            </p>
          </div>
          <button
            onClick={() => navigate('/shop?filter=limited')}
            className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>See Limited Inventory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {limitedTime.map(product => (
            <ProductCard key={product.productId} product={product} navigate={navigate} />
          ))}
        </div>
      </section>

      {/* 10. Why Shop With Diwali Mart */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-amber-950/40 bg-gradient-to-b from-[#130d08] to-[#0c0805]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
            <DiyaIcon size={18} />
            <span>Customer First Experience</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif">
            Why Shop With Diwali Mart?
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-2">
            Built for a hassle-free, secure, and celebratory electronics shopping experience across India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-[#18110b] border border-amber-950/60 p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Tag className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-stone-200 text-sm mb-2">Festive Pricing</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Special Diwali pricing across selected electronics.
            </p>
          </div>

          <div className="bg-[#18110b] border border-amber-950/60 p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-stone-200 text-sm mb-2">UPI Checkout</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Simple UPI payment experience.
            </p>
          </div>

          <div className="bg-[#18110b] border border-amber-950/60 p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-stone-200 text-sm mb-2">Easy Shopping</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Simple product discovery and checkout.
            </p>
          </div>

          <div className="bg-[#18110b] border border-amber-950/60 p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-stone-200 text-sm mb-2">Order Tracking</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Track orders from your account.
            </p>
          </div>

          <div className="bg-[#18110b] border border-amber-950/60 p-6 rounded-2xl flex flex-col items-center text-center sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-stone-200 text-sm mb-2">Customer Support</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Simple support/contact experience.
            </p>
          </div>
        </div>
      </section>

      {/* 11. Delivery & Support */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-amber-950/40">
        <div className="bg-gradient-to-r from-[#1b120a] via-[#22160d] to-[#1a110a] rounded-3xl border border-amber-500/30 p-8 sm:p-12 shadow-xl glow-gold">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-stone-100">Estimated Delivery: 7–15 Days</h4>
              <p className="text-xs text-stone-400">
                Orders are carefully packed in multi-layered protective bubble wrap and dispatched across India.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-stone-100">Official Brand Warranty</h4>
              <p className="text-xs text-stone-400">
                All seeded electronic items come backed with valid brand warranty cards and repair support.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-stone-100">7-Day Replacement Policy</h4>
              <p className="text-xs text-stone-400">
                In case of transit defect or hardware fault, request replacement within 7 calendar days.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

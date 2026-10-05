import React from 'react';
import { DiyaIcon } from '../common/DiyaIcon';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Zap } from 'lucide-react';

interface HeroBannerProps {
  navigate: (path: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ navigate }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#180f08] via-[#120a05] to-[#0c0805] border-b border-amber-950/60 py-12 md:py-20">
      {/* Subtle festive background lighting glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-amber-600/15 via-orange-600/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Festive Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-5">
            {/* Promotional Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/40 backdrop-blur-md shadow-md">
              <DiyaIcon size={18} />
              <span className="text-xs font-bold text-amber-300 tracking-wider uppercase">
                UP TO 50% OFF
              </span>
              <span className="text-amber-500">·</span>
              <span className="text-xs text-amber-100 font-medium">Diwali Festive Special</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-100 tracking-tight leading-[1.1] font-serif">
              Diwali Mega <br className="hidden sm:inline" />
              <span className="text-festive-gradient">Electronics Sale</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-stone-300 max-w-xl font-normal leading-relaxed">
              Celebrate Diwali with premium electronics at extraordinary festival prices.
            </p>

            {/* Supporting Text */}
            <p className="text-xs sm:text-sm text-amber-400/90 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Special Diwali pricing across selected electronics.</span>
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => navigate('/shop')}
                className="px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-950/60 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <span>Shop Electronics</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/shop?filter=megadeals')}
                className="px-6 sm:px-7 py-3.5 rounded-xl bg-[#1d130b] hover:bg-[#281b10] text-amber-200 border border-amber-500/30 hover:border-amber-400/50 font-semibold text-sm sm:text-base shadow-lg transition-all"
              >
                View Diwali Deals
              </button>
            </div>

            {/* Mini Trust Highlights */}
            <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-stone-400 border-t border-amber-950/40 w-full">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Brand Warranty Guaranteed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Instant UPI Checkout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Flat 50% Festival Off</span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered 3D Festive Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Diya Accent Glow Ring */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-amber-500/30 via-orange-500/20 to-red-500/30 blur-xl opacity-75" />

              {/* Main 3D Card Composite */}
              <div className="relative rounded-3xl bg-gradient-to-b from-[#1e130b] to-[#120b06] border border-amber-500/30 p-5 sm:p-6 shadow-2xl overflow-hidden">
                {/* Diwali Header Banner inside card */}
                <div className="flex items-center justify-between pb-4 border-b border-amber-900/40 mb-4">
                  <div className="flex items-center gap-2">
                    <DiyaIcon size={24} />
                    <span className="font-serif font-bold text-amber-300 text-sm">
                      Festival Showcase
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                    50% FESTIVAL OFF
                  </span>
                </div>

                {/* 2x2 Festive Product Montage Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Smartphone Showcase */}
                  <div className="relative rounded-xl overflow-hidden bg-black/40 border border-amber-950/60 p-2 text-center group">
                    <img
                      src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80"
                      alt="Smartphone"
                      className="w-full h-24 sm:h-28 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform"
                    />
                    <div className="text-[11px] font-semibold text-stone-200 truncate">Galaxy S24 Ultra</div>
                    <div className="text-[11px] text-amber-400 font-bold">₹64,999</div>
                  </div>

                  {/* Smart TV Showcase */}
                  <div className="relative rounded-xl overflow-hidden bg-black/40 border border-amber-950/60 p-2 text-center group">
                    <img
                      src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80"
                      alt="Smart TV"
                      className="w-full h-24 sm:h-28 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform"
                    />
                    <div className="text-[11px] font-semibold text-stone-200 truncate">Bravia 65" OLED</div>
                    <div className="text-[11px] text-amber-400 font-bold">₹1,24,995</div>
                  </div>

                  {/* Laptop Showcase */}
                  <div className="relative rounded-xl overflow-hidden bg-black/40 border border-amber-950/60 p-2 text-center group">
                    <img
                      src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80"
                      alt="MacBook"
                      className="w-full h-24 sm:h-28 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform"
                    />
                    <div className="text-[11px] font-semibold text-stone-200 truncate">MacBook Air M3</div>
                    <div className="text-[11px] text-amber-400 font-bold">₹77,450</div>
                  </div>

                  {/* Audio Showcase */}
                  <div className="relative rounded-xl overflow-hidden bg-black/40 border border-amber-950/60 p-2 text-center group">
                    <img
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
                      alt="Headphones"
                      className="w-full h-24 sm:h-28 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform"
                    />
                    <div className="text-[11px] font-semibold text-stone-200 truncate">Sony WH-1000XM5</div>
                    <div className="text-[11px] text-amber-400 font-bold">₹17,495</div>
                  </div>
                </div>

                {/* Bottom Card CTA */}
                <button
                  onClick={() => navigate('/shop')}
                  className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs shadow-md transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span>Explore All 70+ Diwali Deals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

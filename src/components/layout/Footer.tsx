import React from 'react';
import { STORE_CONFIG } from '../../config/storeConfig';
import { DiyaIcon } from '../common/DiyaIcon';
import {
  ShieldCheck,
  QrCode,
  Truck,
  RotateCcw,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  HelpCircle
} from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const SUPPORT_EMAIL = 'supportdiwalimart@gmail.com';

  return (
    <footer className="bg-[#0a0705] border-t border-amber-950/60 text-stone-400 text-xs mt-auto">
      {/* Trust Badges Strip */}
      <div className="border-b border-amber-950/40 py-8 bg-[#0f0a06]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/50 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <DiyaIcon size={20} />
            </div>
            <div>
              <h4 className="text-stone-200 font-semibold text-xs sm:text-sm">Festive Pricing</h4>
              <p className="text-[11px] text-stone-500">Special Diwali pricing across selected electronics.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/50 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-stone-200 font-semibold text-xs sm:text-sm">UPI Checkout</h4>
              <p className="text-[11px] text-stone-500">Simple UPI payment experience.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/50 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-stone-200 font-semibold text-xs sm:text-sm">Delivery & Support</h4>
              <p className="text-[11px] text-stone-500">Estimated delivery: 7–15 days.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/50 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-stone-200 font-semibold text-xs sm:text-sm">Order Tracking</h4>
              <p className="text-[11px] text-stone-500">Track orders from your account.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand & Support Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-900 border border-amber-500/40 flex items-center justify-center">
              <DiyaIcon size={18} />
            </div>
            <span className="font-serif text-lg font-bold text-stone-100">
              {STORE_CONFIG.brandName}
            </span>
          </div>
          <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
            “Premium electronics for a brighter Diwali.” Discover hand-selected smartphones, smart TVs, home appliances, computers, and audio gear at exclusive festival prices.
          </p>

          {/* Official Support Email Card */}
          <div className="pt-1 space-y-1.5 bg-[#140e09] border border-amber-950/50 rounded-2xl p-3.5 max-w-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-500/90 uppercase tracking-wider">
                Official Support Desk
              </span>
              <span className="text-[10px] text-stone-500">Mon–Sat, 10 AM – 7 PM</span>
            </div>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{SUPPORT_EMAIL}</span>
            </a>
          </div>

          {/* Sleek Social Media Icon Row (Icons Only) */}
          <div className="pt-2">
            <span className="text-[10px] text-stone-500 uppercase tracking-widest block mb-2 font-medium">
              Connect With Us
            </span>
            <div className="flex items-center gap-2.5">
              <a
                href="#"
                onClick={e => e.preventDefault()}
                className="w-8 h-8 rounded-lg bg-stone-900/90 border border-stone-800 hover:border-amber-500/60 text-stone-400 hover:text-amber-400 hover:bg-amber-950/30 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                title="Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="#"
                onClick={e => e.preventDefault()}
                className="w-8 h-8 rounded-lg bg-stone-900/90 border border-stone-800 hover:border-amber-500/60 text-stone-400 hover:text-amber-400 hover:bg-amber-950/30 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                title="X (Twitter)"
                aria-label="X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </a>

              <a
                href="#"
                onClick={e => e.preventDefault()}
                className="w-8 h-8 rounded-lg bg-stone-900/90 border border-stone-800 hover:border-amber-500/60 text-stone-400 hover:text-amber-400 hover:bg-amber-950/30 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                title="Facebook"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href="#"
                onClick={e => e.preventDefault()}
                className="w-8 h-8 rounded-lg bg-stone-900/90 border border-stone-800 hover:border-amber-500/60 text-stone-400 hover:text-amber-400 hover:bg-amber-950/30 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                title="YouTube"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Shop Electronics */}
        <div>
          <h4 className="text-stone-200 font-semibold text-xs uppercase tracking-wider mb-3">
            Shop Electronics
          </h4>
          <ul className="space-y-2">
            {STORE_CONFIG.categories.slice(0, 6).map(cat => (
              <li key={cat.slug}>
                <button
                  onClick={() => navigate(`/category/${cat.slug}`)}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  {cat.name}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => navigate('/shop?filter=megadeals')}
                className="hover:text-amber-400 text-amber-500/90 font-medium transition-colors text-left"
              >
                Mega Deals (50% OFF)
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Care & Help */}
        <div>
          <h4 className="text-stone-200 font-semibold text-xs uppercase tracking-wider mb-3">
            Help & Customer Care
          </h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => navigate('/help')} className="hover:text-amber-400 font-medium text-amber-300 transition-colors">
                Help Center
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/contact')} className="hover:text-amber-400 transition-colors">
                Contact Us
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/help')} className="hover:text-amber-400 transition-colors">
                FAQs & Guides
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/orders')} className="hover:text-amber-400 transition-colors">
                Track My Orders
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/account')} className="hover:text-amber-400 transition-colors">
                Account & Addresses
              </button>
            </li>
          </ul>
        </div>

        {/* Policies & Info */}
        <div>
          <h4 className="text-stone-200 font-semibold text-xs uppercase tracking-wider mb-3">
            Policies & Info
          </h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => navigate('/returns')} className="hover:text-amber-400 transition-colors">
                Returns & Replacement
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/privacy')} className="hover:text-amber-400 transition-colors">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/terms')} className="hover:text-amber-400 transition-colors">
                Terms of Service
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/cart')} className="hover:text-amber-400 transition-colors">
                Shopping Cart
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright & Disclaimer Bar */}
      <div className="border-t border-amber-950/40 py-6 bg-[#080503]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© 2026 {STORE_CONFIG.brandName}. All rights reserved. Demo electronics marketplace.</p>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">Accepted Payment: UPI (GPay, PhonePe, Paytm, BHIM)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

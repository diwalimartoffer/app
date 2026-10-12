import React, { useState, useMemo } from 'react';
import { getProductBySlug, getRelatedProducts } from '../data/products';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { ProductCard } from '../components/product/ProductCard';
import { DiyaIcon } from '../components/common/DiyaIcon';
import { useCart } from '../context/CartContext';
import {
  Star,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ProductDetailsPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  slug,
  navigate
}) => {
  const product = useMemo(() => getProductBySlug(slug), [slug]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-serif text-stone-100 mb-4">
          Product Not Found
        </h2>
        <p className="text-stone-400 text-sm mb-6">
          The requested electronic product might have been moved or is currently unavailable.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const related = getRelatedProducts(product, 4);
  const discountPercentage = Math.round(
    ((product.referenceOnlineSalePrice - product.diwaliPrice) / product.referenceOnlineSalePrice) * 100
  );

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/shop')}
          className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-xs text-stone-400 hover:text-amber-400 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Deal</span>
        </button>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
        {/* Left Gallery (col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white p-6 border border-amber-950/60 shadow-xl glow-gold flex items-center justify-center">
            <div className="absolute top-4 left-4 z-20">
              <span className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-lg tracking-wider uppercase">
                {discountPercentage}% OFF DIWALI DEAL
              </span>
            </div>

            <ImageWithFallback
              src={product.productImages[selectedImageIndex] || product.productImages[0]}
              alt={product.productName}
              fallbackTitle={product.productName}
              category={product.category}
              subcategory={product.subcategory}
              brand={product.brand}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Thumbnail Strip */}
          {product.productImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-white p-1 transition-all shrink-0 flex items-center justify-center ${
                    selectedImageIndex === idx
                      ? 'border-amber-500 scale-95 shadow-md shadow-amber-950/60'
                      : 'border-stone-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${product.productName} thumbnail ${idx + 1}`}
                    fallbackTitle={product.productName}
                    category={product.category}
                    subcategory={product.subcategory}
                    brand={product.brand}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Purchase Module (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col">
          {/* Brand & Subcategory */}
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest mb-1.5">
            <span>{product.brand}</span>
            <span>·</span>
            <span className="text-stone-400 font-normal tracking-normal">{product.subcategory}</span>
          </div>

          {/* Product Name */}
          <h1 className="text-xl sm:text-2xl font-bold text-stone-100 leading-snug mb-3 font-serif">
            {product.productName}
          </h1>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-amber-950/40 text-xs text-stone-400">
            <div className="flex items-center text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="ml-1 font-bold text-stone-100">{product.rating}</span>
            </div>
            <span>·</span>
            <span>{product.reviewCount} customer reviews</span>
            <span>·</span>
            <span className="text-amber-400 font-medium">In Stock ({product.stockQuantity} units)</span>
          </div>

          {/* Price Box */}
          <div className="bg-[#18110b] border border-amber-950/60 rounded-2xl p-4 mb-6">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                ₹{product.diwaliPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-base text-stone-500 line-through">
                ₹{product.referenceOnlineSalePrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-red-400 bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded">
                Save ₹{(product.referenceOnlineSalePrice - product.diwaliPrice).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[11px] text-stone-400">
              Online Reference Price: ₹{product.referenceOnlineSalePrice.toLocaleString('en-IN')} ({discountPercentage}% Festival Discount applied)
            </div>
          </div>

          {/* Quantity Selector & CTAs */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-4">
              <label htmlFor="quantity-select" className="text-xs font-semibold text-stone-300">Quantity:</label>
              <div className="flex items-center border border-amber-950/60 rounded-xl bg-[#140e09]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-stone-400 hover:text-white"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-mono font-bold text-stone-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="px-3 py-1.5 text-stone-400 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 border border-stone-800 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-950/50 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Key Trust Notes */}
          <div className="bg-[#120c07] rounded-xl p-4 border border-amber-950/40 space-y-2.5 text-xs text-stone-400 mb-6">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Free Delivery across India · Estimated Delivery: 7–15 days</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{product.warranty}</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
              <span>7-Day Replacement Policy for transit or hardware defects</span>
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
              Key Highlights
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-300">
              {product.highlights.map((h, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Specifications & Description Section */}
      <div className="border-t border-amber-950/60 pt-10 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Description */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-lg font-bold text-stone-100 font-serif">
              Product Overview
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              {product.description}
            </p>
            <div className="bg-[#150f09] border border-amber-950/50 p-4 rounded-xl text-xs space-y-1">
              <div className="text-stone-400">
                <span className="font-semibold text-stone-300">Data Source:</span> {product.sourceName}
              </div>
              <div className="text-stone-400">
                <span className="font-semibold text-stone-300">Specifications Verified:</span> {product.sourceCheckedAt}
              </div>
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="lg:col-span-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-stone-100 font-serif">
                Technical Specifications
              </h3>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Hardware Specs</span>
              </span>
            </div>
            
            <div className="bg-[#140e09] border border-amber-950/60 rounded-2xl overflow-hidden shadow-xl text-xs divide-y divide-amber-950/40">
              {Object.entries(product.specifications).map(([key, val], idx) => (
                <div
                  key={key}
                  className={`grid grid-cols-1 sm:grid-cols-12 p-3.5 transition-colors ${
                    idx % 2 === 0 ? 'bg-[#140e09]' : 'bg-[#18110b]'
                  } hover:bg-[#20150c]`}
                >
                  <div className="sm:col-span-4 text-amber-400/90 font-semibold mb-1 sm:mb-0">
                    {key}
                  </div>
                  <div className="sm:col-span-8 text-stone-200 leading-relaxed font-normal">
                    {val}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500 px-1">
              <span>All hardware parameters are certified brand retail units</span>
              <span className="font-mono text-stone-400">SKU: {product.productId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="border-t border-amber-950/60 pt-12">
          <div className="flex items-center gap-2 mb-6">
            <DiyaIcon size={18} />
            <h3 className="text-xl font-bold text-stone-100 font-serif">
              You May Also Like
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map(p => (
              <ProductCard key={p.productId} product={p} navigate={navigate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

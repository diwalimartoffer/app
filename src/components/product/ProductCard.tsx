import React from 'react';
import { Product } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { useCart } from '../../context/CartContext';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { getProductSlug } from '../../data/products';

interface ProductCardProps {
  product: Product;
  navigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, navigate }) => {
  const { addToCart } = useCart();
  const slug = getProductSlug(product);
  const discountPercentage = Math.round(
    ((product.referenceOnlineSalePrice - product.diwaliPrice) / product.referenceOnlineSalePrice) * 100
  );

  const handleCardClick = () => {
    navigate(`/product/${slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-[#140e09] border border-amber-950/50 hover:border-amber-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-amber-950/40 hover:glow-gold"
    >
      {/* Dynamic Discount Badge (50% to 60%) */}
      <div className="absolute top-2.5 left-2.5 z-20">
        <span className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-lg shadow-md tracking-wider uppercase">
          {discountPercentage}% OFF
        </span>
      </div>

      {/* Stock Tag */}
      {product.availability === 'limited_stock' && (
        <div className="absolute top-2.5 right-2.5 z-20">
          <span className="bg-stone-900/90 backdrop-blur-md text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-500/30">
            Limited Stock
          </span>
        </div>
      )}

      {/* Product Image with Hover Zoom */}
      <div className="relative w-full aspect-[4/3] bg-white rounded-xl flex items-center justify-center overflow-hidden">
        <ImageWithFallback
          src={product.productImages[0]}
          alt={product.productName}
          fallbackTitle={product.productName}
          category={product.category}
          subcategory={product.subcategory}
          brand={product.brand}
          className="w-full h-full"
          imgClassName="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product Details Content */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-[11px] text-amber-500/80 uppercase tracking-wider mb-1 font-medium">
          <span>{product.brand}</span>
          <span className="text-stone-400 normal-case tracking-normal">
            {product.subcategory}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="font-semibold text-xs sm:text-sm text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-2 min-h-[2.5rem] mb-2">
          {product.productName}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 text-xs mb-3 text-stone-400">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="ml-1 font-semibold text-stone-200">{product.rating}</span>
          </div>
          <span>·</span>
          <span className="text-[11px]">({product.reviewCount})</span>
        </div>

        {/* Pricing Block */}
        <div className="mt-auto pt-2 border-t border-amber-950/40">
          <div className="flex flex-col mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-amber-400">
                ₹{product.diwaliPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-stone-400 line-through">
                ₹{product.referenceOnlineSalePrice.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[10px] text-stone-400">
              Online Reference Price: ₹{product.referenceOnlineSalePrice.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-2 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="truncate">Add to Cart</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="w-full py-2 px-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 font-semibold text-xs flex items-center justify-center gap-1 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

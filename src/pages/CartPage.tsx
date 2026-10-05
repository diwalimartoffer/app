import React from 'react';
import { useCart } from '../context/CartContext';
import { EmptyState } from '../components/common/EmptyState';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { DiyaIcon } from '../components/common/DiyaIcon';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { getProductSlug } from '../data/products';

interface CartPageProps {
  navigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    onlineReferenceSubtotal,
    deliveryFee,
    discount,
    totalAmount,
    totalItemsCount
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          type="cart"
          onAction={() => navigate('/shop')}
          actionText="Explore Electronics"
        />
      </div>
    );
  }

  const savings = onlineReferenceSubtotal - subtotal;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-amber-950/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
            <DiyaIcon size={16} />
            <span>Festive Cart</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif">
            Shopping Cart ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-red-400 flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List (col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(item => (
            <div
              key={item.product.productId}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-[#140e09] border border-amber-950/50 shadow-md"
            >
              {/* Product Thumbnail */}
              <div
                onClick={() => navigate(`/product/${getProductSlug(item.product)}`)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white p-1 border border-amber-900/30 shrink-0 cursor-pointer flex items-center justify-center"
              >
                <ImageWithFallback
                  src={item.product.productImages[0]}
                  alt={item.product.productName}
                  fallbackTitle={item.product.productName}
                  category={item.product.category}
                  subcategory={item.product.subcategory}
                  brand={item.product.brand}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider mb-0.5">
                  {item.product.brand}
                </div>
                <h3
                  onClick={() => navigate(`/product/${getProductSlug(item.product)}`)}
                  className="text-xs sm:text-sm font-semibold text-stone-100 hover:text-amber-300 transition-colors line-clamp-2 cursor-pointer mb-2"
                >
                  {item.product.productName}
                </h3>

                <div className="flex items-baseline gap-2">
                  <span className="text-sm sm:text-base font-bold text-amber-400">
                    ₹{item.product.diwaliPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-stone-500 line-through">
                    ₹{item.product.referenceOnlineSalePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-red-400 font-bold">50% OFF</span>
                </div>
              </div>

              {/* Quantity Stepper & Removal */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-0 border-amber-950/40">
                <div className="flex items-center border border-amber-950/60 rounded-xl bg-[#1a110a]">
                  <button
                    onClick={() => updateQuantity(item.product.productId, item.quantity - 1)}
                    className="p-1.5 px-2.5 text-stone-400 hover:text-white"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2 text-xs font-mono font-bold text-stone-200">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.productId, item.quantity + 1)}
                    className="p-1.5 px-2.5 text-stone-400 hover:text-white"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right sm:min-w-24">
                  <div className="text-sm font-bold text-stone-100 font-mono">
                    ₹{(item.product.diwaliPrice * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.productId)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card (col-span-4) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-[#160f09] border border-amber-950/60 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="font-serif font-bold text-stone-100 text-base pb-3 border-b border-amber-950/40">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span className="font-mono text-stone-200">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-stone-400">
                <span>Diwali Festival Savings</span>
                <span className="font-mono text-amber-400 font-semibold">
                  -₹{savings.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-stone-400">
                <span>Delivery Fee</span>
                <span className="font-semibold text-emerald-400 uppercase text-[11px]">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-stone-400">
                  <span>Special Discount</span>
                  <span className="font-mono text-amber-400">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="pt-3 border-t border-amber-950/40 flex justify-between items-baseline">
                <span className="text-sm font-bold text-stone-100">Total Amount</span>
                <span className="text-xl font-extrabold text-amber-400 font-mono">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-950/60 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Mini Info */}
            <div className="pt-2 border-t border-amber-950/40 space-y-2 text-[11px] text-stone-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>UPI Payment Only · 100% Secure Transaction</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Estimated Delivery: 7–15 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

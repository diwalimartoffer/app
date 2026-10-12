import React from 'react';
import { ShoppingBag, PackageOpen, SearchX } from 'lucide-react';
import { DiyaIcon } from './DiyaIcon';

interface EmptyStateProps {
  type: 'cart' | 'orders' | 'search';
  onAction?: () => void;
  actionText?: string;
  customMessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  onAction,
  actionText,
  customMessage
}) => {
  if (type === 'cart') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-amber-500/15 to-transparent border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="absolute -bottom-2 -right-2">
            <DiyaIcon size={24} />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-stone-100 mb-2 font-serif">
          Your cart is waiting for some Diwali shopping.
        </h3>
        <p className="text-sm text-stone-400 max-w-sm mb-6">
          Explore our hand-picked Diwali electronics collection with exclusive 50% festival discounts.
        </p>
        <button
          onClick={onAction}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold text-sm shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {actionText || 'Explore Electronics'}
        </button>
      </div>
    );
  }

  if (type === 'orders') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400 mb-6">
          <PackageOpen className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-semibold text-stone-100 mb-2 font-serif">
          {customMessage || 'No orders yet.'}
        </h3>
        <p className="text-sm text-stone-400 max-w-sm mb-6">
          You haven't placed any festival orders yet. Light up your home with our Diwali electronics deals!
        </p>
        <button
          onClick={onAction}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold text-sm shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {actionText || 'Start Shopping'}
        </button>
      </div>
    );
  }

  // Search empty state
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#18110b] border border-amber-900/30 flex items-center justify-center text-amber-500 mb-6">
        <SearchX className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-semibold text-stone-100 mb-2 font-serif">
        {customMessage || "We couldn't find that product."}
      </h3>
      <p className="text-sm text-stone-400 max-w-sm mb-6">
        Try checking your spelling, using more general search terms, or explore our curated Diwali festive categories.
      </p>
      <button
        onClick={onAction}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold text-sm shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        {actionText || 'Browse Categories'}
      </button>
    </div>
  );
};

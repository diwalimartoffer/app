import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#140e09] border border-amber-950/40 rounded-2xl p-4 flex flex-col animate-pulse">
      <div className="w-full aspect-[4/3] bg-stone-900 rounded-xl mb-4" />
      <div className="w-20 h-3 bg-stone-800 rounded mb-2" />
      <div className="w-full h-5 bg-stone-800 rounded mb-2" />
      <div className="w-3/4 h-5 bg-stone-800 rounded mb-4" />
      <div className="flex items-center gap-3 mt-auto pt-2 border-t border-stone-800/60">
        <div className="w-24 h-6 bg-stone-800 rounded" />
        <div className="w-16 h-4 bg-stone-900 rounded" />
      </div>
      <div className="w-full h-10 bg-stone-800 rounded-xl mt-4" />
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};

import React from 'react';
import { Smartphone, Tv, Refrigerator, Watch, Laptop, Coffee, Headphones } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  slug: string;
  description: string;
  iconName: string;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  description,
  iconName,
  onClick
}) => {
  const renderIcon = () => {
    switch (iconName) {
      case 'smartphone':
        return <Smartphone className="w-7 h-7 text-amber-400" />;
      case 'tv':
        return <Tv className="w-7 h-7 text-amber-400" />;
      case 'refrigerator':
        return <Refrigerator className="w-7 h-7 text-amber-400" />;
      case 'watch':
        return <Watch className="w-7 h-7 text-amber-400" />;
      case 'laptop':
        return <Laptop className="w-7 h-7 text-amber-400" />;
      case 'coffee':
        return <Coffee className="w-7 h-7 text-amber-400" />;
      case 'headphones':
      default:
        return <Headphones className="w-7 h-7 text-amber-400" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-start p-5 rounded-2xl bg-[#150f0a] border border-amber-950/60 hover:border-amber-500/60 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/50 hover:glow-gold focus:outline-none"
    >
      <div className="flex items-center justify-between w-full mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-950/80 to-[#1f140b] border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
          {renderIcon()}
        </div>
        <span className="text-[10px] font-bold tracking-wider text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded-full">
          UP TO 50% OFF
        </span>
      </div>

      <h3 className="text-sm sm:text-base font-semibold text-stone-100 group-hover:text-amber-300 transition-colors mb-1">
        {name}
      </h3>

      <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
        {description}
      </p>

      <div className="mt-4 pt-3 border-t border-amber-950/40 w-full flex items-center justify-between text-xs text-amber-400/90 font-medium">
        <span>Explore Collection</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </button>
  );
};

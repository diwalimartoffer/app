import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { getAccurateProductFallback } from '../../utils/imageFallbacks';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  imgClassName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Product image',
  className = '',
  imgClassName = '',
  fallbackTitle,
  category,
  subcategory,
  brand,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [hasTriedFallback, setHasTriedFallback] = useState<boolean>(false);
  const [isFullyFailed, setIsFullyFailed] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  // Sync state if src changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasTriedFallback(false);
    setIsFullyFailed(false);
    setLoaded(false);
  }, [src]);

  const accurateFallbackUrl = getAccurateProductFallback({
    category,
    subcategory,
    brand,
    productName: fallbackTitle || alt
  });

  const handleError = () => {
    if (!hasTriedFallback && accurateFallbackUrl && currentSrc !== accurateFallbackUrl) {
      // Immediately swap to reliable category/brand authentic Unsplash photo
      setHasTriedFallback(true);
      setLoaded(false);
      setCurrentSrc(accurateFallbackUrl);
    } else {
      setIsFullyFailed(true);
    }
  };

  if (isFullyFailed || !currentSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-2 bg-white rounded-xl text-stone-700 border border-stone-200 overflow-hidden ${className}`}
      >
        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-1 text-amber-600">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        <span className="text-[11px] font-medium text-center text-stone-800 line-clamp-1 px-1">
          {fallbackTitle || alt}
        </span>
        {category && (
          <span className="text-[9px] text-amber-700 font-semibold uppercase tracking-wider">
            {category.split('/')[0]}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative bg-white rounded-xl flex items-center justify-center overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-stone-50 animate-pulse flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105 transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
        {...props}
      />
    </div>
  );
};

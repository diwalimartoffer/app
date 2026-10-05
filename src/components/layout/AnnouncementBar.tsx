import React from 'react';
import { STORE_CONFIG } from '../../config/storeConfig';
import { Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="relative z-40 bg-gradient-to-r from-amber-700 via-amber-600 to-orange-700 text-stone-950 font-medium text-xs sm:text-sm py-2 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center font-semibold tracking-wide">
        <Sparkles className="w-3.5 h-3.5 hidden sm:inline-block animate-pulse text-amber-200" />
        <span>{STORE_CONFIG.announcementText}</span>
        <Sparkles className="w-3.5 h-3.5 hidden sm:inline-block animate-pulse text-amber-200" />
      </div>
    </div>
  );
};

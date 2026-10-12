import React from 'react';

interface DiyaIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const DiyaIcon: React.FC<DiyaIconProps> = ({ className = 'w-6 h-6', size, glow = true }) => {
  return (
    <span className={`inline-flex items-center justify-center relative ${className}`} style={size ? { width: size, height: size } : undefined}>
      {glow && (
        <span className="absolute -top-1 w-2.5 h-3 bg-amber-400/80 rounded-full blur-[3px] animate-pulse" />
      )}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Flame */}
        <path
          d="M12 2C12 2 14.5 5.5 14.5 8C14.5 9.38 13.38 10.5 12 10.5C10.62 10.5 9.5 9.38 9.5 8C9.5 5.5 12 2 12 2Z"
          fill="url(#diyaFlameGrad)"
        />
        <path
          d="M12 4.5C12 4.5 13.2 6.5 13.2 8C13.2 8.7 12.7 9.2 12 9.2C11.3 9.2 10.8 8.7 10.8 8C10.8 6.5 12 4.5 12 4.5Z"
          fill="#FEF08A"
        />
        {/* Base Bowl of Diya */}
        <path
          d="M3 12C3.8 17.5 7.5 20.5 12 20.5C16.5 20.5 20.2 17.5 21 12H3Z"
          fill="url(#diyaBaseGrad)"
          stroke="#D97706"
          strokeWidth="1"
        />
        {/* Rim of Diya */}
        <path
          d="M2.5 12C2.5 11.2 6.7 10.5 12 10.5C17.3 10.5 21.5 11.2 21.5 12C21.5 12.8 17.3 13.5 12 13.5C6.7 13.5 2.5 12.8 2.5 12Z"
          fill="url(#diyaRimGrad)"
        />
        {/* Diya Base Stand */}
        <path
          d="M9 20.5L8 22H16L15 20.5H9Z"
          fill="#92400E"
        />

        <defs>
          <linearGradient id="diyaFlameGrad" x1="12" y1="2" x2="12" y2="10.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" />
            <stop offset="0.5" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#DC2626" />
          </linearGradient>
          <linearGradient id="diyaBaseGrad" x1="12" y1="12" x2="12" y2="20.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B45309" />
            <stop offset="0.5" stopColor="#78350F" />
            <stop offset="1" stopColor="#451A03" />
          </linearGradient>
          <linearGradient id="diyaRimGrad" x1="2.5" y1="12" x2="21.5" y2="12" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="0.5" stopColor="#FDE68A" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
};

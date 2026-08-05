import React from 'react';
import { motion } from 'motion/react';
import { MenuItem, IconStyle } from '../types/portal';
import { IconRenderer } from '../utils/iconHelper';

interface AppIconProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
  iconStyle?: IconStyle;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({
  item,
  onClick,
  iconStyle = 'squircle',
  size = 'md',
  showLabel = true,
}) => {
  // Shape styling map
  const shapeClasses = {
    squircle: 'rounded-[22px]',
    circle: 'rounded-full',
    rounded: 'rounded-2xl',
    teardrop: 'rounded-t-[22px] rounded-bl-[22px] rounded-br-sm',
  };

  // Dimensions
  const dimensionClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-18 h-18 sm:w-20 sm:h-20',
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 36,
  };

  // Check if color is gradient or solid hex/tailwind
  const isGradient = item.color.includes('from-') || item.color.includes('to-');
  const backgroundStyle = isGradient
    ? `bg-gradient-to-br ${item.color}`
    : '';

  return (
    <motion.button
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => onClick(item)}
      className="group relative flex flex-col items-center justify-center focus:outline-none select-none cursor-pointer p-1"
      title={`${item.title} - ${item.description}`}
    >
      {/* Icon Shape Container */}
      <div
        className={`relative ${dimensionClasses[size]} ${shapeClasses[iconStyle]} ${
          isGradient ? backgroundStyle : 'bg-slate-800'
        } flex items-center justify-center text-white shadow-xl border border-white/20 transition-all duration-300 group-hover:shadow-2xl group-hover:border-white/40 overflow-hidden`}
        style={!isGradient && item.color ? { backgroundColor: item.color } : undefined}
      >
        {/* Glass gloss highlight overlay */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent opacity-60 pointer-events-none" />

        {/* Icon Render */}
        <div className="relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-md">
          <IconRenderer name={item.icon} size={iconSizes[size]} />
        </div>

        {/* Badge Overlay */}
        {item.badge && (
          <span className="absolute top-1 right-1 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full border border-black/30 shadow-md">
            {item.badge}
          </span>
        )}
      </div>

      {/* App Title Label */}
      {showLabel && (
        <span className="mt-1.5 text-xs font-medium text-white text-center leading-tight tracking-tight line-clamp-1 max-w-[80px] sm:max-w-[90px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] group-hover:text-amber-300 transition-colors">
          {item.title}
        </span>
      )}
    </motion.button>
  );
};

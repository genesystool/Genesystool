import React from 'react';
import { motion } from 'motion/react';
import { MenuItem, IconStyle } from '../types/portal';
import { AppIcon } from './AppIcon';
import { Grid, LayoutGrid } from 'lucide-react';

interface DockProps {
  dockItems: MenuItem[];
  onOpenApp: (item: MenuItem) => void;
  onToggleDrawer: () => void;
  iconStyle: IconStyle;
  isDrawerOpen: boolean;
}

export const Dock: React.FC<DockProps> = ({
  dockItems,
  onOpenApp,
  onToggleDrawer,
  iconStyle,
  isDrawerOpen,
}) => {
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-xl select-none">
      <div className="bg-black/50 backdrop-blur-2xl border border-white/15 rounded-3xl p-2.5 sm:p-3 shadow-2xl flex items-center justify-around gap-2">
        {dockItems.slice(0, 5).map((item) => (
          <AppIcon
            key={item.id}
            item={item}
            onClick={onOpenApp}
            iconStyle={iconStyle}
            size="md"
            showLabel={false}
          />
        ))}

        {/* App Drawer Launcher Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleDrawer}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white border transition-all duration-300 shadow-xl ${
            isDrawerOpen
              ? 'bg-amber-500 text-black border-amber-300 ring-4 ring-amber-500/30'
              : 'bg-white/15 hover:bg-white/25 border-white/20'
          }`}
          title="Semua Aplikasi (App Drawer)"
        >
          {isDrawerOpen ? <LayoutGrid size={24} /> : <Grid size={24} />}
        </motion.button>
      </div>
    </div>
  );
};

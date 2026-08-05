import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem, IconStyle } from '../types/portal';
import { AppIcon } from './AppIcon';
import { Plus, SearchX, Shield } from 'lucide-react';

interface AppGridProps {
  items: MenuItem[];
  onOpenApp: (item: MenuItem) => void;
  iconStyle: IconStyle;
  onOpenAdmin: () => void;
}

export const AppGrid: React.FC<AppGridProps> = ({
  items,
  onOpenApp,
  iconStyle,
  onOpenAdmin,
}) => {
  if (items.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto my-12 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 text-center text-white select-none">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-400">
          <SearchX size={32} />
        </div>
        <h3 className="text-lg font-bold">Tidak ada menu ditemukan</h3>
        <p className="text-xs text-white/60 mt-1">
          Tidak ada aplikasi yang cocok dengan kata kunci atau kategori terpilih.
        </p>
        <button
          onClick={onOpenAdmin}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold rounded-xl text-xs shadow-lg transition active:scale-95"
        >
          <Plus size={16} /> Kelola / Tambah Menu di Admin
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 select-none">
      <motion.div
        layout
        className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-y-6 gap-x-2 sm:gap-x-4 justify-items-center"
      >
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <AppIcon
                item={item}
                onClick={onOpenApp}
                iconStyle={iconStyle}
                size="md"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

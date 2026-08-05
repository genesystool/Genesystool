import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem, IconStyle } from '../types/portal';
import { AppIcon } from './AppIcon';
import { Search, X, Layers, Plus, ShieldCheck } from 'lucide-react';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
  onOpenApp: (item: MenuItem) => void;
  iconStyle: IconStyle;
  onOpenAdmin: () => void;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onOpenApp,
  iconStyle,
  onOpenAdmin,
}) => {
  const [drawerSearch, setDrawerSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  if (!isOpen) return null;

  // Categories list
  const categories = Array.from(new Set(items.map((i) => i.category)));

  // Filtering
  const filtered = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(drawerSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(drawerSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex flex-col justify-end bg-black/75 backdrop-blur-xl transition-opacity">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Drawer Container */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative z-10 w-full max-w-4xl mx-auto h-[85vh] bg-slate-950/90 border-t border-white/15 rounded-t-[36px] flex flex-col overflow-hidden text-white shadow-2xl p-4 sm:p-6"
        >
          {/* Header handle & Search */}
          <div className="flex flex-col items-center gap-3 pb-3 border-b border-white/10 shrink-0">
            {/* Drag Handle Bar */}
            <div className="w-12 h-1.5 bg-white/30 rounded-full cursor-pointer hover:bg-white/50" onClick={onClose} />

            <div className="w-full flex items-center justify-between gap-3">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  value={drawerSearch}
                  onChange={(e) => setDrawerSearch(e.target.value)}
                  placeholder="Cari semua aplikasi portal..."
                  className="w-full bg-white/10 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-500 focus:bg-white/15"
                />
              </div>

              <button
                onClick={onClose}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition"
                title="Tutup App Drawer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Category Pills */}
            <div className="w-full flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
              <button
                onClick={() => setSelectedCategory('Semua')}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition ${
                  selectedCategory === 'Semua'
                    ? 'bg-amber-500 text-black'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Semua ({items.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-black'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Content */}
          <div className="flex-1 overflow-y-auto py-6 px-2 no-scrollbar">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-white/50">
                <p className="text-sm">Tidak ada aplikasi yang cocok.</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-y-6 gap-x-2 justify-items-center">
                {filtered.map((item) => (
                  <AppIcon
                    key={item.id}
                    item={item}
                    onClick={(app) => {
                      onOpenApp(app);
                      onClose();
                    }}
                    iconStyle={iconStyle}
                    size="md"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer Admin Shortcut */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60 shrink-0">
            <span>Portal Launch Pad • {items.length} Menu</span>
            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold"
            >
              <ShieldCheck size={14} /> Kelola Menu Admin
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

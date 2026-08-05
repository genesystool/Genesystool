import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Palette, LayoutGrid, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { AndroidTheme, IconStyle } from '../types/portal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: AndroidTheme;
  onUpdateTheme: (updated: Partial<AndroidTheme>) => void;
}

export const WALLPAPERS = [
  {
    id: 'material-dark',
    name: 'Material Dark',
    style: 'bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950',
  },
  {
    id: 'neon-aurora',
    name: 'Neon Aurora',
    style: 'bg-gradient-to-tr from-emerald-950 via-slate-900 to-teal-950',
  },
  {
    id: 'cyber-grid',
    name: 'Cyber Violet',
    style: 'bg-gradient-to-tr from-purple-950 via-slate-900 to-rose-950',
  },
  {
    id: 'warm-sunset',
    name: 'Warm Sunset',
    style: 'bg-gradient-to-tr from-amber-950 via-slate-900 to-orange-950',
  },
  {
    id: 'amoled-black',
    name: 'AMOLED Pure',
    style: 'bg-black',
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onUpdateTheme,
}) => {
  if (!isOpen) return null;

  const iconShapes: { id: IconStyle; name: string; classStr: string }[] = [
    { id: 'squircle', name: 'Squircle', classStr: 'rounded-[16px]' },
    { id: 'circle', name: 'Lingkaran', classStr: 'rounded-full' },
    { id: 'rounded', name: 'Persegi Halus', classStr: 'rounded-xl' },
    { id: 'teardrop', name: 'Teardrop', classStr: 'rounded-t-xl rounded-bl-xl rounded-br-none' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl shadow-2xl p-6 text-white overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Palette className="text-amber-400" size={22} />
              <h3 className="font-bold text-lg">Pengaturan Tampilan Launcher</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition text-white/80"
            >
              <X size={20} />
            </button>
          </div>

          <div className="py-4 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
            {/* Wallpaper Selection */}
            <div>
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-3">
                Wallpaper Latar Belakang
              </label>
              <div className="grid grid-cols-3 gap-3">
                {WALLPAPERS.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => onUpdateTheme({ wallpaper: wp.style, customWallpaperUrl: '' })}
                    className={`h-20 rounded-2xl ${wp.style} border-2 flex items-center justify-center p-2 relative overflow-hidden transition ${
                      theme.wallpaper === wp.style && !theme.customWallpaperUrl
                        ? 'border-amber-400 ring-4 ring-amber-400/30'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-white drop-shadow-md text-center">
                      {wp.name}
                    </span>
                    {theme.wallpaper === wp.style && !theme.customWallpaperUrl && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-amber-400 text-black rounded-full flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Image URL Wallpaper */}
              <div className="mt-3">
                <label className="text-[11px] text-white/60 block mb-1">
                  Atau gunakan Custom Image URL Wallpaper:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={theme.customWallpaperUrl || ''}
                    onChange={(e) =>
                      onUpdateTheme({ customWallpaperUrl: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                  />
                  {theme.customWallpaperUrl && (
                    <button
                      onClick={() => onUpdateTheme({ customWallpaperUrl: '' })}
                      className="px-3 py-2 bg-red-500/20 text-red-300 text-xs rounded-xl hover:bg-red-500 hover:text-white"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Icon Shape */}
            <div>
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-3">
                Bentuk Ikon Aplikasi (Icon Mask)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {iconShapes.map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => onUpdateTheme({ iconStyle: shape.id })}
                    className={`p-3 rounded-2xl bg-white/5 border flex flex-col items-center gap-2 transition ${
                      theme.iconStyle === shape.id
                        ? 'border-amber-400 bg-amber-500/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 ${shape.classStr} bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md flex items-center justify-center text-white`}
                    >
                      <Sparkles size={18} />
                    </div>
                    <span className="text-[11px] font-medium text-white/80">{shape.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Widgets Toggle */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
              <div>
                <div className="text-sm font-semibold">Tampilkan Widget Android</div>
                <div className="text-xs text-white/60">Jam, cuaca, dan pencarian cepat</div>
              </div>
              <input
                type="checkbox"
                checked={theme.showWidgets}
                onChange={(e) => onUpdateTheme({ showWidgets: e.target.checked })}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Admin Key Shortcut Info */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" /> Pintasan Keyboard Admin Real-time
              </div>
              <p className="text-white/80">
                Tekan tombol <kbd className="bg-black/60 px-1.5 py-0.5 rounded font-mono text-amber-300">Ctrl + Shift + Alt + A</kbd> di mana saja untuk membuka popup autentikasi & dasbor admin.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-amber-500 text-black font-bold rounded-xl text-xs shadow-lg hover:bg-amber-400 transition"
            >
              Selesai
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

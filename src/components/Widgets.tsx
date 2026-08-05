import React, { useState, useEffect } from 'react';
import { Search, Sun, Cloud, Calendar, Sparkles, Megaphone, Layers, Clock, Heart } from 'lucide-react';
import { AndroidTheme } from '../types/portal';

interface WidgetsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  theme: AndroidTheme;
  totalApps: number;
  activeCategory: string;
  categories: string[];
  onSelectCategory: (category: string) => void;
  onOpenAdmin: () => void;
}

export const Widgets: React.FC<WidgetsProps> = ({
  searchQuery,
  onSearchChange,
  theme,
  totalApps,
  activeCategory,
  categories,
  onSelectCategory,
  onOpenAdmin,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeFormatted = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const dateFormatted = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (!theme.showWidgets) return null;

  const showClock = theme.showClock !== false;
  const showInfoTicker = theme.showInfoTicker !== false && theme.infoText && theme.infoText.trim().length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-4 select-none">
      {/* Admin Announcement Ticker / Information Banner */}
      {showInfoTicker && (
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-500/20 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-3 text-white shadow-xl flex items-center gap-3">
          <div className="p-2 bg-amber-500 text-black rounded-xl shrink-0 font-bold shadow-md animate-pulse">
            <Megaphone size={16} />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
                PENGUMUMAN ADMIN
              </span>
            </div>
            <p className="text-xs text-amber-100 font-medium truncate mt-0.5">
              {theme.infoText}
            </p>
          </div>
        </div>
      )}

      {/* Main Clock & Weather Android Card */}
      <div className="bg-black/35 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition hover:border-white/20">
        {/* Left: Clock (Conditional Display) */}
        {showClock ? (
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="text-5xl sm:text-6xl font-light tracking-tight text-white font-mono drop-shadow-md">
              {timeFormatted}
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm mt-1 font-medium">
              <Calendar size={15} className="text-amber-400" />
              <span>{dateFormatted}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl text-xs text-white/70">
            <Clock size={16} className="text-amber-400 shrink-0" />
            <span>Tampilan Jam Disembunyikan (Atur di Admin/Settings)</span>
          </div>
        )}

        {/* Center: Weather & Location */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
          <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl">
            <Sun size={28} className="animate-spin-slow" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">29°C</div>
            <div className="text-xs text-white/70 flex items-center gap-1">
              <Cloud size={12} /> Indonesia • Cerah
            </div>
          </div>
        </div>

        {/* Right: Donation Info */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
          <div className="flex items-center gap-2 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3.5 py-1.5 rounded-2xl shadow-md">
            <Heart size={14} className="text-rose-400 shrink-0 animate-pulse" />
            <span>Jika aplikasi ini berguna donasi seikhlasnya ke akun Dana 085270444156</span>
          </div>
        </div>
      </div>

      {/* Android Google-style Search Widget */}
      <div className="relative w-full">
        <div className="flex items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-full shadow-lg px-4 py-3 gap-3 transition-all focus-within:ring-2 focus-within:ring-amber-500">
          <Search size={20} className="text-amber-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari aplikasi, portal, atau menu internal..."
            className="w-full bg-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 text-sm focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded-full"
            >
              Hapus
            </button>
          )}
          <div className="flex items-center gap-2 text-slate-400 border-l border-slate-300 dark:border-slate-700 pl-3">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hidden sm:inline">
              PORTAL
            </span>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <div className="flex items-center text-xs font-semibold text-white/70 gap-1 pr-2 shrink-0">
            <Layers size={14} className="text-amber-400" /> Kategori:
          </div>
          <button
            onClick={() => onSelectCategory('Semua')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition shrink-0 ${
              activeCategory === 'Semua'
                ? 'bg-amber-500 text-black font-bold shadow-md'
                : 'bg-black/40 text-white/80 hover:bg-black/60 border border-white/10'
            }`}
          >
            Semua ({totalApps})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition shrink-0 ${
                activeCategory === cat
                  ? 'bg-amber-500 text-black font-bold shadow-md'
                  : 'bg-black/40 text-white/80 hover:bg-black/60 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

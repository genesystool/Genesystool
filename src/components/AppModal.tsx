import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem } from '../types/portal';
import {
  X,
  ExternalLink,
  RotateCw,
  ArrowLeft,
  Shield,
  Maximize2,
  Minimize2,
  AlertCircle,
} from 'lucide-react';
import { IconRenderer } from '../utils/iconHelper';

interface AppModalProps {
  app: MenuItem | null;
  onClose: () => void;
}

export const AppModal: React.FC<AppModalProps> = ({ app, onClose }) => {
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  if (!app) return null;

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full ${
            isFullscreen ? 'h-full max-w-none rounded-none' : 'max-w-5xl h-[90vh] rounded-3xl'
          } bg-slate-900 border border-white/20 shadow-2xl flex flex-col overflow-hidden text-white select-none transition-all duration-300`}
        >
          {/* Android App Window Header Bar */}
          <div className="h-14 bg-slate-950 border-b border-white/10 px-4 flex items-center justify-between shrink-0">
            {/* Left: Back & Title */}
            <div className="flex items-center space-x-3 overflow-hidden">
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition"
                title="Kembali ke Portal"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="flex items-center space-x-2.5 truncate">
                <div
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shrink-0 shadow-md`}
                >
                  <IconRenderer name={app.icon} size={16} />
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-bold truncate leading-tight">{app.title}</h3>
                  <p className="text-[11px] text-white/50 truncate">{app.description || app.url}</p>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleRefresh}
                className="p-2 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition"
                title="Muat Ulang Halaman"
              >
                <RotateCw size={18} className={isLoading ? 'animate-spin' : ''} />
              </button>

              <a
                href={app.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition flex items-center gap-1 text-xs"
                title="Buka di Tab Baru Browser"
              >
                <ExternalLink size={18} />
              </a>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hidden sm:block p-2 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition"
                title={isFullscreen ? 'Layar Normal' : 'Layar Penuh'}
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>

              <button
                onClick={onClose}
                className="p-2 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-xl transition"
                title="Tutup Window Aplikasi"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Iframe View Content */}
          <div className="relative flex-1 bg-white dark:bg-slate-950 w-full h-full overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900 text-white gap-3">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-white/70">Memuat portal {app.title}...</p>
              </div>
            )}

            <iframe
              key={iframeKey}
              src={app.url}
              title={app.title}
              onLoad={() => setIsLoading(false)}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
            />
          </div>

          {/* Android Bottom Navigation Bar */}
          <div className="h-10 bg-black/90 border-t border-white/10 px-6 flex items-center justify-center space-x-12 shrink-0">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition"
              title="Kembali"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={onClose}
              className="w-5 h-5 rounded-md border-2 border-white/60 hover:border-white transition"
              title="Home Portal"
            />
            <button
              onClick={handleRefresh}
              className="w-5 h-5 rounded-full border-2 border-white/60 hover:border-white flex items-center justify-center transition text-[10px] font-bold text-white/60 hover:text-white"
              title="Recents / Refresh"
            >
              ||
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wifi,
  Moon,
  Sun,
  Shield,
  Settings,
  Bell,
  Trash2,
  X,
  Sparkles,
  Layout,
  Volume2,
  Bluetooth,
  Smartphone,
  Download,
} from 'lucide-react';
import { AndroidTheme, AppNotification } from '../types/portal';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onClearNotifications: () => void;
  theme: AndroidTheme;
  onUpdateTheme: (newTheme: Partial<AndroidTheme>) => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  onOpenInstallModal?: () => void;
  isAdminLoggedIn: boolean;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearNotifications,
  theme,
  onUpdateTheme,
  onOpenSettings,
  onOpenAdmin,
  onOpenInstallModal,
  isAdminLoggedIn,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-center bg-black/60 backdrop-blur-md">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative z-10 w-full max-w-lg bg-slate-950/95 border-b border-x border-white/20 rounded-b-[32px] shadow-2xl p-5 text-white flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center space-x-2">
              <Smartphone size={20} className="text-amber-400" />
              <span className="font-bold text-sm">Android Portal Controls</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onOpenSettings}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition text-white/80"
                title="Pengaturan Portal"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition text-white/80"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Settings Grid */}
          <div className="py-4 border-b border-white/10 shrink-0">
            <h4 className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-3">
              Quick Settings
            </h4>

            <div className="grid grid-cols-4 gap-3 text-center">
              {/* Wi-Fi Toggle */}
              <button className="flex flex-col items-center gap-1.5 p-2 bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-500/30">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold">
                  <Wifi size={20} />
                </div>
                <span className="text-[11px] font-medium truncate w-full">Wi-Fi (5G)</span>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => onUpdateTheme({ darkMode: !theme.darkMode })}
                className="flex flex-col items-center gap-1.5 p-2 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/10"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  {theme.darkMode ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <span className="text-[11px] font-medium truncate w-full">
                  {theme.darkMode ? 'Gelap' : 'Terang'}
                </span>
              </button>

              {/* Widgets Toggle */}
              <button
                onClick={() => onUpdateTheme({ showWidgets: !theme.showWidgets })}
                className="flex flex-col items-center gap-1.5 p-2 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/10"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    theme.showWidgets ? 'bg-emerald-500 text-black' : 'bg-slate-700 text-white'
                  }`}
                >
                  <Layout size={20} />
                </div>
                <span className="text-[11px] font-medium truncate w-full">Widget</span>
              </button>

              {/* Admin Panel Toggle */}
              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="flex flex-col items-center gap-1.5 p-2 bg-gradient-to-br from-amber-500/30 to-orange-600/30 text-amber-300 rounded-2xl border border-amber-500/40"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black flex items-center justify-center font-bold">
                  <Shield size={20} />
                </div>
                <span className="text-[11px] font-bold truncate w-full">Admin</span>
              </button>
            </div>
          </div>

          {/* Install Android Card */}
          {onOpenInstallModal && (
            <div className="mb-3 p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-500/40 flex items-center justify-between text-xs shrink-0 shadow-md">
              <div className="flex items-center gap-2">
                <Download size={18} className="text-emerald-400 shrink-0 animate-bounce" />
                <div>
                  <div className="font-bold text-emerald-200">Instal Aplikasi di Android</div>
                  <div className="text-[10px] text-white/70">
                    Pasang ke Layar Utama HP tanpa PlayStore
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenInstallModal();
                }}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold rounded-xl text-[11px] shadow"
              >
                Instal
              </button>
            </div>
          )}

          {/* Admin Hint Card */}
          <div className="my-3 p-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl border border-amber-500/30 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400 shrink-0" />
              <div>
                <div className="font-bold text-amber-200">Akses Admin Real-Time</div>
                <div className="text-[10px] text-white/70">
                  Pintas Keyboard: <kbd className="bg-black/50 px-1 rounded text-amber-300 font-mono">Ctrl+Shift+Alt+A</kbd>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-[11px]"
            >
              Buka
            </button>
          </div>

          {/* Notifications Section */}
          <div className="flex-1 overflow-y-auto no-scrollbar py-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-bold text-white/50 uppercase tracking-wider flex items-center gap-1">
                <Bell size={12} /> Notifikasi ({notifications.length})
              </h4>
              {notifications.length > 0 && (
                <button
                  onClick={onClearNotifications}
                  className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <Trash2 size={12} /> Bersihkan
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-8 text-white/40 text-xs">
                Tidak ada notifikasi baru
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-xs transition flex items-start gap-3"
                  >
                    <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl shrink-0 mt-0.5">
                      <Bell size={14} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{notif.title}</span>
                        <span className="text-[10px] text-white/40">{notif.time}</span>
                      </div>
                      <p className="text-white/70 text-[11px] mt-0.5">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React, { useState, useEffect } from 'react';
import { Wifi, BatteryCharging, Bell, Settings, ShieldAlert, Sparkles } from 'lucide-react';

interface StatusBarProps {
  onToggleNotificationPanel: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  unreadCount: number;
  isAdminLoggedIn: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  onToggleNotificationPanel,
  onOpenSettings,
  onOpenAdmin,
  unreadCount,
  isAdminLoggedIn,
}) => {
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [batteryLevel, setBatteryLevel] = useState<number>(88);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }));
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-8 bg-black/40 backdrop-blur-md text-white px-4 flex items-center justify-between text-xs font-medium select-none z-30 sticky top-0 border-b border-white/5">
      {/* Left: Clock & Date */}
      <div className="flex items-center space-x-3">
        <span className="font-semibold tracking-wide text-white">{time}</span>
        <span className="hidden sm:inline text-white/60 text-[11px]">{dateStr}</span>
        {isAdminLoggedIn && (
          <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1 font-semibold animate-pulse">
            <ShieldAlert size={10} /> ADMIN
          </span>
        )}
      </div>

      {/* Center: Quick Notice / Hint */}
      <div className="hidden md:flex items-center space-x-1 text-[11px] text-white/50 bg-white/5 px-3 py-0.5 rounded-full">
        <Sparkles size={11} className="text-amber-400" />
        <span>Akses Admin: <kbd className="bg-white/10 text-amber-300 font-mono px-1 rounded text-[10px]">Ctrl+Shift+Alt+A</kbd></span>
      </div>

      {/* Right: Icons (Wifi, Battery, Notifications, Settings) */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={onToggleNotificationPanel}
          className="relative p-1 hover:bg-white/10 rounded transition text-white/80 hover:text-white"
          title="Notifikasi & Quick Settings"
        >
          <Bell size={14} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          )}
        </button>

        <div className="flex items-center space-x-1 text-white/80" title="Koneksi Terhubung">
          <Wifi size={14} />
          <span className="hidden sm:inline text-[10px] text-white/60">5G</span>
        </div>

        <div className="flex items-center space-x-1 text-white/80" title="Baterai 88%">
          <span className="text-[10px] text-white/70">{batteryLevel}%</span>
          <BatteryCharging size={15} className="text-emerald-400" />
        </div>

        <button
          onClick={onOpenSettings}
          className="p-1 hover:bg-white/10 rounded transition text-white/80 hover:text-white"
          title="Pengaturan Tampilan"
        >
          <Settings size={14} />
        </button>

        <button
          onClick={onOpenAdmin}
          className="ml-1 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded text-[10px] font-bold shadow-sm transition active:scale-95"
          title="Masuk Dasbor Admin (Ctrl+Shift+Alt+A)"
        >
          Admin
        </button>
      </div>
    </div>
  );
};

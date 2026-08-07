import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  X,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  MoreVertical,
  PlusSquare,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface InstallAndroidModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onTriggerPrompt: () => void;
}

export const InstallAndroidModal: React.FC<InstallAndroidModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerPrompt,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 p-5 text-black flex items-start justify-between shrink-0 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-black/20 rounded-2xl text-black border border-black/10 shadow-inner">
                <Smartphone size={28} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest bg-black text-amber-300 px-2 py-0.5 rounded-full">
                  Android App Ready
                </span>
                <h3 className="text-xl font-black text-slate-950 mt-0.5">
                  Instal Aplikasi di Android
                </h3>
                <p className="text-xs text-black/80 font-medium">
                  Pasang langsung ke layar utama HP Android Anda
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 bg-black/20 hover:bg-black/30 rounded-full transition text-slate-950"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto space-y-5 text-slate-200 text-sm no-scrollbar">
            {/* Direct PWA One-Tap Install Prompt (if browser supports beforeinstallprompt) */}
            {deferredPrompt ? (
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/50 rounded-2xl p-4 flex flex-col items-center text-center gap-3 shadow-lg">
                <div className="p-3 bg-amber-500 text-black rounded-full font-bold shadow-md animate-bounce">
                  <Download size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    Dukungan Instal Otomatis Terdeteksi!
                  </h4>
                  <p className="text-xs text-amber-200/90 mt-1">
                    Browser Anda mendukung instalasi 1-klik langsung ke sistem HP Android.
                  </p>
                </div>
                <button
                  onClick={onTriggerPrompt}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 text-sm"
                >
                  <Download size={18} />
                  INSTAL SEKARANG KE HP ANDROID
                </button>
              </div>
            ) : null}

            {/* Step by Step Manual Installation Guide */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-white/10 pb-2">
                <Sparkles size={18} />
                <span>Cara Instal Manual di HP Android (Google Chrome)</span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Step 1 */}
                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      Buka Menu Browser Chrome
                      <span className="bg-white/10 text-amber-300 p-1 rounded inline-flex">
                        <MoreVertical size={13} />
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Tekan tombol **titik tiga (⋮)** di pojok kanan atas layar browser Chrome Anda.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      Pilih "Tambahkan ke Layar Utama"
                      <span className="bg-white/10 text-amber-300 p-1 rounded inline-flex">
                        <PlusSquare size={13} />
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Cari opsi **"Tambahkan ke Layar Utama" (Add to Home screen)** atau **"Instal aplikasi"**.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      Tekan "Instal" / "Tambah"
                      <span className="bg-emerald-500/20 text-emerald-400 p-1 rounded inline-flex">
                        <CheckCircle2 size={13} />
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Ikon aplikasi akan otomatis muncul di menu aplikasi & layar depan HP Android Anda.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share / Copy URL section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Share2 size={15} className="text-amber-400" />
                <span>Bagikan Link Aplikasi ke HP Android Lain</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Kirim link ini via WhatsApp untuk membuka & menginstal di smartphone Android mana saja:
              </p>
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="bg-transparent text-xs text-amber-200 w-full focus:outline-none truncate px-1"
                />
                <button
                  onClick={handleCopyUrl}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition shrink-0 flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check size={14} /> Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Salin Link
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Features summary */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 text-xs text-amber-200/90 space-y-2">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck size={16} /> Keunggulan Aplikasi Android Terinstal:
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-amber-400 shrink-0" />
                  Akses 1-Klik dari Homescreen HP
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-amber-400 shrink-0" />
                  Layar Penuh (Full Screen App)
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-amber-400 shrink-0" />
                  Lebih Cepat & Hemat Kuota Data
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-amber-400 shrink-0" />
                  Update Database Real-Time
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-950 border-t border-white/10 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-400">PWA Android Version 2.0</span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

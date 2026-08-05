import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
  Sparkles,
  ArrowRight,
  UserPlus,
} from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [email, setEmail] = useState<string>('admin@portal.id');
  const [password, setPassword] = useState<string>('Admin#123456');
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setLoading(false);
      onSuccessLogin();
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Gagal autentikasi.';

      // Handle common Firebase Auth error codes
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Email atau password salah. Silakan periksa kembali atau buat akun baru.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Email ini sudah terdaftar. Silakan gunakan mode Masuk Login.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password terlalu lemah. Minimal 6 karakter.';
      }

      setErrorMsg(msg);
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = async () => {
    setErrorMsg('');
    setLoading(true);

    // First try sign in
    try {
      await signInWithEmailAndPassword(auth, 'admin@portal.id', 'Admin#123456');
      setLoading(false);
      onSuccessLogin();
      return;
    } catch (e1) {
      // Try creating default demo admin account
      try {
        await createUserWithEmailAndPassword(auth, 'admin@portal.id', 'Admin#123456');
        setLoading(false);
        onSuccessLogin();
        return;
      } catch (e2) {
        // Fallback to anonymous admin sign in for quick dev preview
        try {
          await signInAnonymously(auth);
          setLoading(false);
          onSuccessLogin();
          return;
        } catch (e3) {
          setErrorMsg('Gagal masuk demo admin. Silakan buat akun secara manual.');
          setLoading(false);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl p-6 text-white overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl text-black font-bold">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base">Autentikasi Dasbor Admin</h3>
                <p className="text-[11px] text-white/50">
                  {isRegisterMode ? 'Buat Akun Admin Baru' : 'Akses Terproteksi Firebase Auth'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition text-white/80"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Info Keyboard Shortcut */}
          <div className="my-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400 shrink-0" />
            <span>Pintasan Cepat: <kbd className="bg-black/60 px-1.5 py-0.5 rounded font-mono text-amber-300">Ctrl+Shift+Alt+A</kbd></span>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-2xl text-xs text-red-200 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-white/70 block mb-1">
                Email Admin
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@portal.id"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/70 block mb-1">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold rounded-xl text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Memproses Autentikasi...</span>
              ) : (
                <>
                  <span>{isRegisterMode ? 'Daftar Admin Baru' : 'Masuk Ke Dasbor Admin'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Auto Login Button & Toggle Register */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={handleQuickDemoAdmin}
              disabled={loading}
              className="w-full py-2 bg-white/10 hover:bg-white/20 text-amber-300 font-semibold rounded-xl text-xs border border-amber-500/30 transition flex items-center justify-center gap-1.5"
            >
              <KeyRound size={14} /> Auto-Masuk Admin Demo Kunci
            </button>

            <div className="text-center mt-1">
              <button
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-xs text-white/60 hover:text-white underline"
              >
                {isRegisterMode
                  ? 'Sudah punya akun? Masuk di sini'
                  : 'Belum punya akun admin? Buat akun admin baru'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

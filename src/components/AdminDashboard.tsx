import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Pencil,
  Trash2,
  Shield,
  Save,
  RotateCcw,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  LogOut,
  Layers,
  ArrowUpDown,
  Database,
  Eye,
  Clock,
  Megaphone,
  SlidersHorizontal,
} from 'lucide-react';
import { MenuItem, OpenTarget, AndroidTheme } from '../types/portal';
import { IconRenderer, AVAILABLE_ICONS } from '../utils/iconHelper';
import { db, auth } from '../lib/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
  setDoc,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { INITIAL_MENUS } from '../data/initialMenus';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  userEmail: string | null;
  theme?: AndroidTheme;
  onUpdateTheme?: (updated: Partial<AndroidTheme>) => void;
}

const COLOR_PRESETS = [
  'from-blue-600 to-indigo-700',
  'from-purple-600 to-violet-700',
  'from-emerald-500 to-teal-600',
  'from-red-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-blue-600',
  'from-teal-500 to-cyan-700',
  'from-gray-700 to-slate-900',
  '#2563eb',
  '#059669',
  '#dc2626',
  '#d97706',
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  menuItems,
  userEmail,
  theme,
  onUpdateTheme,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'menus' | 'settings'>('menus');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<string>('');
  const [errorNotice, setErrorNotice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State for Menus
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [icon, setIcon] = useState<string>('LayoutDashboard');
  const [category, setCategory] = useState<string>('Produktivitas');
  const [url, setUrl] = useState<string>('https://example.com');
  const [target, setTarget] = useState<OpenTarget>('iframe');
  const [color, setColor] = useState<string>('from-blue-600 to-indigo-700');
  const [order, setOrder] = useState<number>(menuItems.length + 1);
  const [isDock, setIsDock] = useState<boolean>(false);
  const [badge, setBadge] = useState<string>('');

  // Settings State
  const [showClockLocal, setShowClockLocal] = useState<boolean>(
    theme?.showClock !== false
  );
  const [showInfoTickerLocal, setShowInfoTickerLocal] = useState<boolean>(
    theme?.showInfoTicker !== false
  );
  const [infoTextLocal, setInfoTextLocal] = useState<string>(
    theme?.infoText || 'Selamat datang di Portal Utama. Pengumuman: Akses aplikasi internal aktif.'
  );
  const [showWidgetsLocal, setShowWidgetsLocal] = useState<boolean>(
    theme?.showWidgets !== false
  );

  if (!isOpen) return null;

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setIcon('LayoutDashboard');
    setCategory('Produktivitas');
    setUrl('https://example.com');
    setTarget('iframe');
    setColor('from-blue-600 to-indigo-700');
    setOrder(menuItems.length + 1);
    setIsDock(false);
    setBadge('');
    setShowForm(false);
  };

  const handleEditClick = (item: MenuItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setIcon(item.icon);
    setCategory(item.category);
    setUrl(item.url);
    setTarget(item.target);
    setColor(item.color);
    setOrder(item.order);
    setIsDock(item.isDock);
    setBadge(item.badge || '');
    setShowForm(true);
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) {
      setErrorNotice('Judul dan URL wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setErrorNotice('');
    setSuccessNotice('');

    try {
      const payload = {
        title,
        description,
        icon,
        category: category || 'Umum',
        url,
        target,
        color,
        order: Number(order) || 1,
        isDock,
        badge: badge.trim() || null,
        updatedAt: new Date().toISOString(),
      };

      if (editingId) {
        // Update Firestore Doc
        const itemRef = doc(db, 'menus', editingId);
        await updateDoc(itemRef, payload);
        setSuccessNotice(`Menu "${title}" berhasil diperbarui real-time!`);
      } else {
        // Add new Firestore Doc
        const newPayload = {
          ...payload,
          createdAt: new Date().toISOString(),
        };
        await addDoc(collection(db, 'menus'), newPayload);
        setSuccessNotice(`Menu baru "${title}" berhasil ditambahkan ke Firestore!`);
      }

      setIsSubmitting(false);
      resetForm();
      setTimeout(() => setSuccessNotice(''), 4000);
    } catch (err: any) {
      console.error('Error saving menu:', err);
      setErrorNotice('Gagal menyimpan menu ke Firestore: ' + (err.message || 'Izin ditolak'));
      setIsSubmitting(false);
    }
  };

  const handleSavePortalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorNotice('');
    setSuccessNotice('');

    const updatedSettings = {
      showClock: showClockLocal,
      showInfoTicker: showInfoTickerLocal,
      infoText: infoTextLocal,
      showWidgets: showWidgetsLocal,
      updatedAt: new Date().toISOString(),
    };

    try {
      // 1. Update Firestore doc `settings/portal`
      await setDoc(doc(db, 'settings', 'portal'), updatedSettings, { merge: true });

      // 2. Update local state
      if (onUpdateTheme) {
        onUpdateTheme(updatedSettings);
      }

      setIsSubmitting(false);
      setSuccessNotice('Pengaturan Info & Jam berhasil disimpan ke Firestore secara real-time!');
      setTimeout(() => setSuccessNotice(''), 4000);
    } catch (err: any) {
      console.error('Error saving settings to Firestore:', err);
      // Fallback local update if Firestore permissions error
      if (onUpdateTheme) {
        onUpdateTheme(updatedSettings);
      }
      setIsSubmitting(false);
      setSuccessNotice('Pengaturan Info & Jam berhasil diperbarui lokal!');
      setTimeout(() => setSuccessNotice(''), 4000);
    }
  };

  const handleDeleteMenu = async (id: string, itemTitle: string) => {
    if (!window.confirm(`Yakin ingin menghapus menu "${itemTitle}" secara permanen?`)) return;

    try {
      await deleteDoc(doc(db, 'menus', id));
      setSuccessNotice(`Menu "${itemTitle}" berhasil dihapus secara real-time.`);
      setTimeout(() => setSuccessNotice(''), 4000);
    } catch (err: any) {
      console.error('Error deleting menu:', err);
      setErrorNotice('Gagal menghapus menu: ' + err.message);
    }
  };

  const handleSeedDefaults = async () => {
    if (
      menuItems.length > 0 &&
      !window.confirm('Ini akan menambahkan kumpulan menu default ke database Anda. Lanjutkan?')
    ) {
      return;
    }

    setIsSubmitting(true);
    setErrorNotice('');
    try {
      const batch = writeBatch(db);
      INITIAL_MENUS.forEach((item, index) => {
        const docRef = doc(collection(db, 'menus'));
        batch.set(docRef, {
          ...item,
          order: index + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });

      await batch.commit();
      setIsSubmitting(false);
      setSuccessNotice('12 Menu Default Android berhasil di-seed ke Firestore!');
      setTimeout(() => setSuccessNotice(''), 4000);
    } catch (err: any) {
      console.error('Error seeding defaults:', err);
      setErrorNotice('Gagal meng-seed menu: ' + err.message);
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl h-[92vh] bg-slate-950 border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white select-none"
        >
          {/* Header Bar */}
          <div className="h-16 bg-slate-900 border-b border-white/10 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-black rounded-2xl font-black shadow-md">
                <Shield size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-base sm:text-lg">Dasbor Admin Portal</h2>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Database size={10} /> Real-Time Firestore
                  </span>
                </div>
                <p className="text-xs text-white/50 truncate">
                  Akses Admin: {userEmail || 'Terautentikasi'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                title="Keluar Admin"
              >
                <LogOut size={14} /> Keluar
              </button>

              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition text-white/80"
                title="Tutup Admin Modal"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Sub-Header Tab Bar */}
          <div className="bg-slate-900/80 border-b border-white/10 px-6 py-2 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveAdminTab('menus')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeAdminTab === 'menus'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <LayoutGrid size={15} /> Kelola Menu Portal ({menuItems.length})
              </button>

              <button
                onClick={() => setActiveAdminTab('settings')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeAdminTab === 'settings'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <SlidersHorizontal size={15} /> Pengaturan Info & Jam Portal
              </button>
            </div>

            {/* Quick Admin Credentials Reference */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] bg-black/40 border border-amber-500/30 px-3 py-1 rounded-xl text-amber-300 font-mono">
              <span>ADMIN: <strong>admin</strong></span>
              <span className="text-white/30">|</span>
              <span>PASS: <strong>@Mautauaja1</strong></span>
            </div>
          </div>

          {/* Alert Notices */}
          {successNotice && (
            <div className="bg-emerald-500/20 border-b border-emerald-500/40 px-6 py-2.5 text-emerald-300 text-xs font-semibold flex items-center gap-2 shrink-0">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {errorNotice && (
            <div className="bg-red-500/20 border-b border-red-500/40 px-6 py-2.5 text-red-300 text-xs font-semibold flex items-center gap-2 shrink-0">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Main Body */}
          {activeAdminTab === 'settings' ? (
            <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <SlidersHorizontal className="text-amber-400" size={20} />
                    Pengaturan Tampilan Jam & Informasi Admin
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Atur visibilitas jam, pengumuman portal, dan bar widget secara langsung ke Firestore.
                  </p>
                </div>

                <form onSubmit={handleSavePortalSettings} className="space-y-5">
                  {/* Info Ticker Toggle */}
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/10">
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Megaphone size={16} className="text-amber-400" /> Tampilkan Bar Pengumuman Admin
                      </div>
                      <div className="text-xs text-white/60 mt-0.5">
                        Menampilkan banner running text informasi di atas widget utama.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={showInfoTickerLocal}
                      onChange={(e) => setShowInfoTickerLocal(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  {/* Info Text Content */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/80 block">
                      Teks Informasi / Pengumuman Admin
                    </label>
                    <textarea
                      rows={3}
                      value={infoTextLocal}
                      onChange={(e) => setInfoTextLocal(e.target.value)}
                      placeholder="Masukkan teks pengumuman yang akan ditampilkan kepada seluruh pengguna..."
                      className="w-full bg-black/40 border border-white/20 rounded-2xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
                    />
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="text-[10px] text-white/50 self-center">Preset Cepat:</span>
                      <button
                        type="button"
                        onClick={() => setInfoTextLocal('Selamat datang di Portal Utama. Pengumuman: Akses aplikasi internal aktif.')}
                        className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg text-white/80 transition"
                      >
                        Selamat Datang
                      </button>
                      <button
                        type="button"
                        onClick={() => setInfoTextLocal('Maintenance server terjadwal hari ini pukul 22:00 WIB. Mohon simpan pekerjaan Anda.')}
                        className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg text-white/80 transition"
                      >
                        Maintenance Server
                      </button>
                      <button
                        type="button"
                        onClick={() => setInfoTextLocal('Sistem Portal Berjalan Normal. Silakan akses menu yang tersedia.')}
                        className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg text-white/80 transition"
                      >
                        Sistem Normal
                      </button>
                    </div>
                  </div>

                  {/* Show Clock Toggle */}
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/10">
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Clock size={16} className="text-amber-400" /> Tampilkan Jam Digital Android
                      </div>
                      <div className="text-xs text-white/60 mt-0.5">
                        Pilih "Tidak" jika ingin menyembunyikan jam dari tampilan layar depan.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={showClockLocal}
                      onChange={(e) => setShowClockLocal(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  {/* Show Widgets Toggle */}
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/10">
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <LayoutGrid size={16} className="text-amber-400" /> Tampilkan Seluruh Widget Bar
                      </div>
                      <div className="text-xs text-white/60 mt-0.5">
                        Menyembunyikan atau menampilkan seluruh bar widget atas.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={showWidgetsLocal}
                      onChange={(e) => setShowWidgetsLocal(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold rounded-2xl text-xs shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Save size={16} />
                      <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Pengaturan Ke Firestore Real-Time'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left / Top Controls & Item List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 border-r border-white/10 space-y-4 no-scrollbar">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">Daftar Menu Portal ({menuItems.length})</h3>
                  <p className="text-xs text-white/50">
                    Perubahan langsung tersinkron secara real-time.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {menuItems.length === 0 && (
                    <button
                      onClick={handleSeedDefaults}
                      disabled={isSubmitting}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                    >
                      <Sparkles size={14} /> Isi Default Menus
                    </button>
                  )}

                  <button
                    onClick={() => {
                      resetForm();
                      setShowForm(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
                  >
                    <Plus size={16} /> Tambah Menu Baru
                  </button>
                </div>
              </div>

              {/* Items Table / List */}
              {menuItems.length === 0 ? (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center text-white/50 my-6">
                  <LayoutGrid size={40} className="mx-auto mb-2 text-amber-400/60" />
                  <p className="text-sm font-semibold text-white">Database Menu Masih Kosong</p>
                  <p className="text-xs text-white/60 mt-1 mb-4">
                    Klik tombol di bawah untuk mengisi 12 menu sampel Android secara otomatis!
                  </p>
                  <button
                    onClick={handleSeedDefaults}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 bg-amber-500 text-black font-bold text-xs rounded-xl hover:bg-amber-400 shadow-lg"
                  >
                    Isi 12 Menu Default Android
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border transition flex items-center justify-between gap-3 ${
                        editingId === item.id ? 'border-amber-400 bg-amber-500/10' : 'border-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shrink-0 shadow-md`}
                        >
                          <IconRenderer name={item.icon} size={20} />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white truncate">{item.title}</span>
                            <span className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full font-medium">
                              #{item.order}
                            </span>
                            {item.isDock && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-full font-semibold">
                                Dock
                              </span>
                            )}
                            {item.badge && (
                              <span className="text-[9px] bg-red-500 text-white font-bold px-1.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/50 truncate">
                            [{item.category}] • {item.url}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition"
                          title="Edit Menu Ini"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => handleDeleteMenu(item.id, item.title)}
                          className="p-2 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-xl transition"
                          title="Hapus Menu"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Form Sidebar (Add / Edit Form) */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  className="w-full md:w-96 bg-slate-900 border-t md:border-t-0 border-white/10 p-5 overflow-y-auto shrink-0 space-y-4 no-scrollbar"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h4 className="font-bold text-sm flex items-center gap-1.5">
                      {editingId ? <Pencil size={16} className="text-amber-400" /> : <Plus size={16} className="text-amber-400" />}
                      {editingId ? 'Edit Menu Portal' : 'Tambah Menu Baru'}
                    </h4>
                    <button
                      onClick={resetForm}
                      className="text-xs text-white/50 hover:text-white underline"
                    >
                      Batal
                    </button>
                  </div>

                  <form onSubmit={handleSaveMenu} className="space-y-3 text-xs">
                    {/* Title */}
                    <div>
                      <label className="font-semibold text-white/80 block mb-1">
                        Nama / Judul Menu <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="contoh: Portal HRIS, Laporan Sales"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="font-semibold text-white/80 block mb-1">Deskripsi Singkat</label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="contoh: Akses sistem presensi & gaji"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Category & Order */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-white/80 block mb-1">Kategori</label>
                        <input
                          type="text"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          placeholder="Sistem Internal, Tools..."
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-white/80 block mb-1">Urutan (Order)</label>
                        <input
                          type="number"
                          value={order}
                          onChange={(e) => setOrder(Number(e.target.value))}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Icon Selector */}
                    <div>
                      <label className="font-semibold text-white/80 block mb-1">
                        Pilih Ikon (Lucide)
                      </label>
                      <div className="flex gap-2 mb-2">
                        <div className="p-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl flex items-center justify-center shrink-0">
                          <IconRenderer name={icon} size={20} />
                        </div>
                        <input
                          type="text"
                          value={icon}
                          onChange={(e) => setIcon(e.target.value)}
                          placeholder="Nama Ikon..."
                          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      {/* Icon Grid Quick Pick */}
                      <div className="grid grid-cols-6 gap-1 bg-black/40 p-2 rounded-xl max-h-24 overflow-y-auto no-scrollbar border border-white/10">
                        {AVAILABLE_ICONS.map((ic) => (
                          <button
                            type="button"
                            key={ic}
                            onClick={() => setIcon(ic)}
                            className={`p-1.5 rounded-lg flex items-center justify-center transition ${
                              icon === ic ? 'bg-amber-500 text-black' : 'hover:bg-white/10 text-white/70'
                            }`}
                            title={ic}
                          >
                            <IconRenderer name={ic} size={16} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* URL */}
                    <div>
                      <label className="font-semibold text-white/80 block mb-1">
                        URL Link / Portal <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Target & Color */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-white/80 block mb-1">Buka Di</label>
                        <select
                          value={target}
                          onChange={(e) => setTarget(e.target.value as OpenTarget)}
                          className="w-full bg-slate-800 border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="iframe">iFrame Window Portal</option>
                          <option value="_blank">Tab Baru Browser</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-white/80 block mb-1">Badge (Opsional)</label>
                        <input
                          type="text"
                          value={badge}
                          onChange={(e) => setBadge(e.target.value)}
                          placeholder="HOT, NEW, PRO"
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Color Presets */}
                    <div>
                      <label className="font-semibold text-white/80 block mb-1">Warna Background Ikon</label>
                      <div className="grid grid-cols-6 gap-1.5">
                        {COLOR_PRESETS.map((c) => (
                          <button
                            type="button"
                            key={c}
                            onClick={() => setColor(c)}
                            className={`h-7 rounded-lg border flex items-center justify-center ${
                              c.includes('from-') ? `bg-gradient-to-r ${c}` : ''
                            } ${color === c ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-white/20'}`}
                            style={!c.includes('from-') ? { backgroundColor: c } : undefined}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Pin to Dock Checkbox */}
                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                      <input
                        type="checkbox"
                        id="isDock"
                        checked={isDock}
                        onChange={(e) => setIsDock(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                      <label htmlFor="isDock" className="text-xs font-medium cursor-pointer">
                        Sematkan di Dock Bawah (Android Dock)
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold rounded-xl text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5 mt-2"
                    >
                      <Save size={16} />
                      <span>{editingId ? 'Simpan Pembaruan' : 'Tambah Ke Firestore'}</span>
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
      </div>
    </AnimatePresence>
  );
};

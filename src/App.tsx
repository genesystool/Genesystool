/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db, auth } from './lib/firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

import { MenuItem, AndroidTheme, AppNotification } from './types/portal';
import { INITIAL_MENUS } from './data/initialMenus';

import { StatusBar } from './components/StatusBar';
import { Widgets } from './components/Widgets';
import { AppGrid } from './components/AppGrid';
import { Dock } from './components/Dock';
import { AppDrawer } from './components/AppDrawer';
import { AppModal } from './components/AppModal';
import { NotificationPanel } from './components/NotificationPanel';
import { SettingsModal, WALLPAPERS } from './components/SettingsModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  // Menu items state synced with Firestore
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Active user / admin authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modal & Panel Visibility States
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState<boolean>(false);

  // Active opened app modal
  const [activeApp, setActiveApp] = useState<MenuItem | null>(null);

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  // Android Theme Customization State
  const [theme, setTheme] = useState<AndroidTheme>({
    wallpaper: WALLPAPERS[0].style,
    darkMode: true,
    iconStyle: 'squircle',
    gridSize: '4x5',
    accentColor: '#f59e0b',
    showWidgets: true,
    showClock: true,
    showInfoTicker: true,
    infoText: 'Selamat datang di Portal Utama. Pengumuman: Akses aplikasi internal aktif.',
    clockStyle: 'digital',
  });

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n1',
      title: 'Portal Android Terhubung',
      message: 'Database Firestore aktif & tersambung real-time.',
      time: 'Baru saja',
      read: false,
    },
    {
      id: 'n2',
      title: 'Pintasan Keyboard Admin',
      message: 'Tekan Ctrl+Shift+Alt+A untuk mengelola menu.',
      time: 'Sistem',
      read: false,
    },
  ]);

  // 1. Firebase Auth State Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Real-Time Firestore Menu Collection Listener
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'menus'), orderBy('order', 'asc'));

    const unsubscribeFirestore = onSnapshot(
      q,
      async (snapshot) => {
        const items: MenuItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            title: data.title || 'Untitled',
            description: data.description || '',
            icon: data.icon || 'LayoutDashboard',
            category: data.category || 'Umum',
            url: data.url || '',
            target: data.target || 'iframe',
            color: data.color || 'from-blue-600 to-indigo-700',
            order: data.order || 1,
            isDock: Boolean(data.isDock),
            badge: data.badge || undefined,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        });

        if (snapshot.empty) {
          // Check if database was initialized before (to know if empty is intentional by user deleting menus)
          try {
            const settingsSnap = await getDoc(doc(db, 'settings', 'portal'));
            if (settingsSnap.exists() && settingsSnap.data()?.initialized) {
              setMenuItems([]);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn('Error reading portal settings init:', e);
          }

          // Database is fresh/uninitialized -> seed defaults into Firestore
          try {
            const batch = writeBatch(db);
            INITIAL_MENUS.forEach((item, index) => {
              const docRef = doc(db, 'menus', `initial-${index + 1}`);
              batch.set(docRef, {
                ...item,
                order: index + 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            });
            await setDoc(doc(db, 'settings', 'portal'), { initialized: true }, { merge: true });
            await batch.commit();
            // batch commit will automatically re-trigger onSnapshot
            return;
          } catch (seedErr) {
            console.error('Auto-seed failed:', seedErr);
            const fallbackItems: MenuItem[] = INITIAL_MENUS.map((item, index) => ({
              ...item,
              id: `initial-${index + 1}`,
            }));
            setMenuItems(fallbackItems);
          }
        } else {
          setMenuItems(items);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Firestore snapshot error:', error);
        const fallbackItems: MenuItem[] = INITIAL_MENUS.map((item, index) => ({
          ...item,
          id: `fallback-${index + 1}`,
        }));
        setMenuItems(fallbackItems);
        setLoading(false);
      }
    );

    return () => unsubscribeFirestore();
  }, []);

  // 3. Real-Time Firestore Settings Listener (Portal Info & Clock Toggles)
  useEffect(() => {
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'portal'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTheme((prev) => ({
            ...prev,
            showClock: data.showClock !== undefined ? Boolean(data.showClock) : prev.showClock,
            showInfoTicker: data.showInfoTicker !== undefined ? Boolean(data.showInfoTicker) : prev.showInfoTicker,
            infoText: data.infoText !== undefined ? String(data.infoText) : prev.infoText,
            showWidgets: data.showWidgets !== undefined ? Boolean(data.showWidgets) : prev.showWidgets,
          }));
        }
      },
      (error) => {
        console.error('Firestore settings snapshot error:', error);
      }
    );

    return () => unsubSettings();
  }, []);

  // 3. Global Shortcut Key Handler: Ctrl + Shift + Alt + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.ctrlKey &&
        e.shiftKey &&
        e.altKey &&
        (e.key === 'a' || e.key === 'A')
      ) {
        e.preventDefault();
        handleTriggerAdmin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentUser]);

  // Admin Trigger Action
  const handleTriggerAdmin = () => {
    if (currentUser) {
      setIsAdminDashboardOpen(true);
      setIsAdminLoginOpen(false);
    } else {
      setIsAdminLoginOpen(true);
      setIsAdminDashboardOpen(false);
    }
  };

  // Launching an App
  const handleOpenApp = (item: MenuItem) => {
    if (item.target === 'modal' || item.url === '#admin') {
      handleTriggerAdmin();
      return;
    }

    if (item.target === '_blank') {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Otherwise open in iFrame Android Modal
    setActiveApp(item);
  };

  // Categories extraction
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  ).filter(Boolean);

  // Filtered Menu Items based on category & search
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === 'Semua' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Dock items (Pinned items or fallback first 4)
  const dockItems = menuItems.filter((i) => i.isDock);
  const finalDockItems =
    dockItems.length > 0 ? dockItems : menuItems.slice(0, 4);

  // Background style computation
  const backgroundStyleClass = theme.customWallpaperUrl
    ? 'bg-cover bg-center'
    : theme.wallpaper;

  return (
    <div
      className={`relative min-h-screen w-full ${backgroundStyleClass} transition-all duration-500 overflow-x-hidden flex flex-col justify-between font-sans selection:bg-amber-500 selection:text-black`}
      style={
        theme.customWallpaperUrl
          ? { backgroundImage: `url(${theme.customWallpaperUrl})` }
          : undefined
      }
    >
      {/* Background Dim Overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />

      {/* 1. Android Status Bar */}
      <StatusBar
        onToggleNotificationPanel={() =>
          setIsNotificationPanelOpen(!isNotificationPanelOpen)
        }
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAdmin={handleTriggerAdmin}
        unreadCount={notifications.filter((n) => !n.read).length}
        isAdminLoggedIn={Boolean(currentUser)}
      />

      {/* 2. Main Portal Content Canvas */}
      <main className="relative z-10 flex-1 flex flex-col justify-between pb-28">
        {/* Android Clock & Search Widgets */}
        <Widgets
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          theme={theme}
          totalApps={menuItems.length}
          activeCategory={activeCategory}
          categories={categories}
          onSelectCategory={setActiveCategory}
          onOpenAdmin={handleTriggerAdmin}
        />

        {/* Loading Indicator or App Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center my-12 text-white gap-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-white/70 font-medium">
              Menghubungkan ke Firestore Real-Time...
            </p>
          </div>
        ) : (
          <AppGrid
            items={filteredMenuItems}
            onOpenApp={handleOpenApp}
            iconStyle={theme.iconStyle}
            onOpenAdmin={handleTriggerAdmin}
          />
        )}
      </main>

      {/* 3. Android Pinned Bottom Dock */}
      <Dock
        dockItems={finalDockItems}
        onOpenApp={handleOpenApp}
        onToggleDrawer={() => setIsAppDrawerOpen(!isAppDrawerOpen)}
        iconStyle={theme.iconStyle}
        isDrawerOpen={isAppDrawerOpen}
      />

      {/* 4. App Drawer Overlay */}
      <AppDrawer
        isOpen={isAppDrawerOpen}
        onClose={() => setIsAppDrawerOpen(false)}
        items={menuItems}
        onOpenApp={handleOpenApp}
        iconStyle={theme.iconStyle}
        onOpenAdmin={handleTriggerAdmin}
      />

      {/* 5. Android iFrame Window Modal */}
      <AppModal app={activeApp} onClose={() => setActiveApp(null)} />

      {/* 6. Notification & Quick Settings Panel */}
      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
        notifications={notifications}
        onClearNotifications={() => setNotifications([])}
        theme={theme}
        onUpdateTheme={(updated) => setTheme({ ...theme, ...updated })}
        onOpenSettings={() => {
          setIsNotificationPanelOpen(false);
          setIsSettingsOpen(true);
        }}
        onOpenAdmin={() => {
          setIsNotificationPanelOpen(false);
          handleTriggerAdmin();
        }}
        isAdminLoggedIn={Boolean(currentUser)}
      />

      {/* 7. Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onUpdateTheme={(updated) => setTheme({ ...theme, ...updated })}
      />

      {/* 8. Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccessLogin={() => {
          setIsAdminLoginOpen(false);
          setIsAdminDashboardOpen(true);
        }}
      />

      {/* 9. Admin Real-Time Dashboard */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        menuItems={menuItems}
        userEmail={currentUser?.email || null}
        theme={theme}
        onUpdateTheme={(updated) => setTheme({ ...theme, ...updated })}
      />
    </div>
  );
}

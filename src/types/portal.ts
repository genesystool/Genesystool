export type OpenTarget = 'iframe' | '_blank' | 'modal';

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  url: string;
  target: OpenTarget;
  color: string;
  order: number;
  isDock: boolean;
  badge?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type IconStyle = 'squircle' | 'circle' | 'rounded' | 'teardrop';
export type GridRowsCols = '4x4' | '4x5' | '5x5';

export interface AndroidTheme {
  wallpaper: string;
  customWallpaperUrl?: string;
  darkMode: boolean;
  iconStyle: IconStyle;
  gridSize: GridRowsCols;
  accentColor: string;
  showWidgets: boolean;
  showClock: boolean;
  showInfoTicker: boolean;
  infoText: string;
  clockStyle: 'digital' | 'analog' | 'minimal';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  icon?: string;
  read: boolean;
  category?: string;
}

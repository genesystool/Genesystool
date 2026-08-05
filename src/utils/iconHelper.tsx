import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconProps> = ({ name, className = 'w-6 h-6', size = 24 }) => {
  // Check if name is a valid Lucide icon
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ className?: string; size?: number }>>)[name];

  if (IconComponent) {
    return <IconComponent className={className} size={size} />;
  }

  // Fallback icon if name not found
  const DefaultIcon = LucideIcons.Grid;
  return <DefaultIcon className={className} size={size} />;
};

export const AVAILABLE_ICONS = [
  'LayoutDashboard',
  'Mail',
  'Search',
  'ShieldCheck',
  'Camera',
  'Users',
  'BarChart3',
  'Calendar',
  'FolderKanban',
  'Youtube',
  'Headphones',
  'Server',
  'Globe',
  'Cpu',
  'FileText',
  'ShoppingBag',
  'Sparkles',
  'Settings',
  'Radio',
  'Clock',
  'Database',
  'Bell',
  'CheckSquare',
  'Briefcase',
  'Activity',
  'Compass',
  'BookOpen',
  'MessageSquare',
  'Cloud',
  'Zap',
  'Code',
  'Layers',
  'Key',
  'MapPin',
  'Lock',
  'Smartphone',
];

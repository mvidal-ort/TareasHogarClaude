// src/theme.ts
export const Colors = {
  bg: '#0F0F14',
  surface: '#17171F',
  card: '#1E1E2A',
  cardHover: '#242432',
  border: '#2A2A3A',
  accent: '#7C6AF7',
  accentLight: '#9D8FFF',
  accentGlow: 'rgba(124,106,247,0.15)',
  green: '#4ADE80',
  greenDim: 'rgba(74,222,128,0.12)',
  yellow: '#FBBF24',
  yellowDim: 'rgba(251,191,36,0.12)',
  red: '#F87171',
  redDim: 'rgba(248,113,113,0.12)',
  blue: '#60A5FA',
  blueDim: 'rgba(96,165,250,0.12)',
  pink: '#F472B6',
  pinkDim: 'rgba(244,114,182,0.12)',
  text: '#E8E8F0',
  textMuted: '#8888AA',
  textDim: '#4A4A6A',
  white: '#FFFFFF',
};

export const Fonts = {
  regular: 'Nunito_400Regular',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
  mono: 'SpaceMono_400Regular',
  monoBold: 'SpaceMono_700Bold',
};

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const PRIORITY_MAP = {
  alta: { label: 'Alta', color: Colors.red, bg: Colors.redDim },
  media: { label: 'Media', color: Colors.yellow, bg: Colors.yellowDim },
  baja: { label: 'Baja', color: Colors.green, bg: Colors.greenDim },
} as const;

export const STATUS_MAP = {
  pendiente: { label: 'Pendiente', color: Colors.yellow, icon: '⏳' },
  en_progreso: { label: 'En progreso', color: Colors.blue, icon: '🔄' },
  completada: { label: 'Completada', color: Colors.green, icon: '✅' },
  vencida: { label: 'Vencida', color: Colors.red, icon: '⚠️' },
} as const;

export const CATEGORY_MAP = {
  limpieza: { label: 'Limpieza', icon: '🧹' },
  cocina:   { label: 'Cocina',   icon: '🍳' },
  compras:  { label: 'Compras',  icon: '🛒' },
  mascotas: { label: 'Mascotas', icon: '🐾' },
  jardín:   { label: 'Jardín',   icon: '🌿' },
  otros:    { label: 'Otros',    icon: '📋' },
} as const;

export const AVATARS = ['👦', '👧', '👩', '👨', '👴', '👵', '🧑', '👶', '🧒', '🧓'];

export const ROLE_COLORS = [
  '#7C6AF7', '#60A5FA', '#4ADE80', '#F472B6',
  '#FBBF24', '#F87171', '#34D399', '#A78BFA',
];

export type Priority = keyof typeof PRIORITY_MAP;
export type Status = keyof typeof STATUS_MAP;
export type Category = keyof typeof CATEGORY_MAP;
export type Role = 'admin' | 'member';

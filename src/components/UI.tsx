// src/components/UI.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { Colors, Fonts, Radii, Spacing } from '../theme';

// ── Chip ──────────────────────────────────────────────────────
interface ChipProps {
  label: string;
  color?: string;
  bg?: string;
  icon?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}
export const Chip: React.FC<ChipProps> = ({
  label, color = Colors.textMuted, bg = Colors.card,
  icon, size = 'sm', style,
}) => (
  <View style={[chipStyles.wrap, { backgroundColor: bg }, style]}>
    {icon ? <Text style={[chipStyles.icon, size === 'sm' ? chipStyles.iconSm : chipStyles.iconMd]}>{icon}</Text> : null}
    <Text style={[chipStyles.text, { color }, size === 'sm' ? chipStyles.textSm : chipStyles.textMd]}>
      {label}
    </Text>
  </View>
);
const chipStyles = StyleSheet.create({
  wrap:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radii.sm, gap: 3 },
  icon:    {},
  iconSm:  { fontSize: 11 },
  iconMd:  { fontSize: 14 },
  text:    { fontFamily: Fonts.bold },
  textSm:  { fontSize: 11 },
  textMd:  { fontSize: 13 },
});

// ── Badge ─────────────────────────────────────────────────────
export const Badge: React.FC<{ count: number }> = ({ count }) => (
  <View style={badgeStyles.wrap}>
    <Text style={badgeStyles.text}>{count}</Text>
  </View>
);
const badgeStyles = StyleSheet.create({
  wrap: { backgroundColor: Colors.accentGlow, width: 22, height: 22, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: Fonts.black, fontSize: 11, color: Colors.accentLight },
});

// ── Button ────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'ghost' | 'danger' | 'success';
interface BtnProps {
  label?: string;
  icon?: string;
  variant?: BtnVariant;
  onPress: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  fullWidth?: boolean;
}
export const Btn: React.FC<BtnProps> = ({
  label, icon, variant = 'ghost', onPress, disabled, size = 'md', style, fullWidth,
}) => {
  const vs = btnVariants[variant];
  const ss = btnSizes[size];
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[btnStyles.base, vs.container, ss.container, fullWidth && btnStyles.full, disabled && btnStyles.disabled, style]}
    >
      {icon ? <Text style={[btnStyles.icon, ss.icon]}>{icon}</Text> : null}
      {label ? <Text style={[btnStyles.label, vs.label, ss.label]}>{label}</Text> : null}
    </TouchableOpacity>
  );
};
const btnVariants: Record<BtnVariant, { container: ViewStyle; label: TextStyle }> = {
  primary: { container: { backgroundColor: Colors.accent }, label: { color: Colors.white } },
  ghost:   { container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.border }, label: { color: Colors.textMuted } },
  danger:  { container: { backgroundColor: Colors.redDim, borderWidth: 1, borderColor: 'rgba(248,113,113,0.2)' }, label: { color: Colors.red } },
  success: { container: { backgroundColor: Colors.greenDim, borderWidth: 1, borderColor: 'rgba(74,222,128,0.2)' }, label: { color: Colors.green } },
};
const btnSizes = {
  sm: { container: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radii.sm, gap: 4 } as ViewStyle, icon: { fontSize: 12 } as TextStyle, label: { fontSize: 12 } as TextStyle },
  md: { container: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: Radii.md, gap: 6 } as ViewStyle, icon: { fontSize: 14 } as TextStyle, label: { fontSize: 14 } as TextStyle },
  lg: { container: { paddingHorizontal: 20, paddingVertical: 14, borderRadius: Radii.lg, gap: 8 } as ViewStyle, icon: { fontSize: 16 } as TextStyle, label: { fontSize: 16 } as TextStyle },
};
const btnStyles = StyleSheet.create({
  base:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  full:     { alignSelf: 'stretch', width: '100%' },
  disabled: { opacity: 0.4 },
  label:    { fontFamily: Fonts.bold },
  icon:     {},
});

// ── Card ──────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
}
export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  const content = (
    <View style={[cardStyles.card, style]}>
      {children}
    </View>
  );
  if (onPress) return <TouchableOpacity onPress={onPress} activeOpacity={0.85}>{content}</TouchableOpacity>;
  return content;
};
const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
});

// ── SectionHeader ─────────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  count?: number;
  action?: React.ReactNode;
}
export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, count, action }) => (
  <View style={shStyles.row}>
    <Text style={shStyles.title}>{title}</Text>
    {count !== undefined ? <Badge count={count} /> : null}
    {action ? <View style={{ marginLeft: 'auto' }}>{action}</View> : null}
  </View>
);
const shStyles = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  title: { fontFamily: Fonts.extrabold, fontSize: 16, color: Colors.text },
});

// ── ProgressBar ───────────────────────────────────────────────
export const ProgressBar: React.FC<{ pct: number; color?: string; height?: number }> = ({
  pct, color = Colors.accent, height = 6,
}) => (
  <View style={[pbStyles.track, { height }]}>
    <View style={[pbStyles.fill, { width: `${Math.min(pct, 100)}%`, backgroundColor: color, height }]} />
  </View>
);
const pbStyles = StyleSheet.create({
  track: { backgroundColor: Colors.border, borderRadius: 99, overflow: 'hidden', width: '100%' },
  fill:  { borderRadius: 99 },
});

// ── EmptyState ────────────────────────────────────────────────
export const EmptyState: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <View style={esStyles.wrap}>
    <Text style={esStyles.icon}>{icon}</Text>
    <Text style={esStyles.text}>{text}</Text>
  </View>
);
const esStyles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  icon: { fontSize: 48, marginBottom: 12 },
  text: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
});

// ── Divider ───────────────────────────────────────────────────
export const Divider: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[divStyles.line, style]} />
);
const divStyles = StyleSheet.create({
  line: { height: 1, backgroundColor: Colors.border, width: '100%' },
});

// ── AvatarBubble ──────────────────────────────────────────────
export const AvatarBubble: React.FC<{ avatar: string; color?: string; size?: number; name?: string }> = ({
  avatar, color = Colors.accent, size = 40, name,
}) => (
  <View style={{ alignItems: 'center', gap: 4 }}>
    <View style={[avStyles.bubble, { width: size, height: size, borderRadius: size / 4, backgroundColor: color + '25' }]}>
      <Text style={{ fontSize: size * 0.55 }}>{avatar}</Text>
    </View>
    {name ? <Text style={avStyles.name}>{name}</Text> : null}
  </View>
);
const avStyles = StyleSheet.create({
  bubble: { alignItems: 'center', justifyContent: 'center' },
  name:   { fontFamily: Fonts.bold, fontSize: 10, color: Colors.textMuted },
});

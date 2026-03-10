// src/components/UserFormModal.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  Modal, TouchableOpacity, TouchableWithoutFeedback,
} from 'react-native';
import { Colors, Fonts, Radii, Spacing, AVATARS, ROLE_COLORS } from '../theme';
import { Btn, Divider } from './UI';
import { useStore } from '../context/store';
import type { User } from '../data/models';

interface Props {
  visible: boolean;
  user?: User;
  onClose: () => void;
}

export const UserFormModal: React.FC<Props> = ({ visible, user, onClose }) => {
  const { addUser, updateUser } = useStore();
  const blank: { name: string; avatar: string; role: 'admin' | 'member'; color: string; pin: string } = 
  { name: '', avatar: '👦', role: 'member', color: ROLE_COLORS[0], pin: '' };
  const [form, setForm] = useState(user ? {
    name: user.name, avatar: user.avatar, role: user.role, color: user.color, pin: user.pin ?? '',
  } : blank);

  const up = <K extends keyof typeof blank>(k: K, v: typeof blank[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    const data = {
      name: form.name,
      avatar: form.avatar,
      role: form.role,
      color: form.color,
      pin: form.role === 'admin' ? form.pin : '',
    };
    if (user) {
      updateUser(user.id, data);
    } else {
      addUser(data);
    }
    setForm(blank);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>{user ? '✏️ Editar miembro' : '👤 Nuevo miembro'}</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
          {/* Name */}
          <View style={styles.group}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={v => up('name', v)}
              placeholder="Nombre del miembro"
              placeholderTextColor={Colors.textDim}
            />
          </View>

          {/* Avatar */}
          <View style={styles.group}>
            <Text style={styles.label}>Avatar</Text>
            <View style={styles.avatarGrid}>
              {AVATARS.map(a => (
                <TouchableOpacity
                  key={a}
                  onPress={() => up('avatar', a)}
                  style={[styles.avatarOpt, form.avatar === a && styles.avatarOptSelected]}
                >
                  <Text style={styles.avatarEmoji}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Color */}
          <View style={styles.group}>
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorGrid}>
              {ROLE_COLORS.map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => up('color', c)}
                  style={[styles.colorDot, { backgroundColor: c }, form.color === c && styles.colorDotSelected]}
                />
              ))}
            </View>
          </View>

          {/* Preview */}
          <View style={styles.preview}>
            <View style={[styles.previewBubble, { backgroundColor: form.color + '30' }]}>
              <Text style={styles.previewEmoji}>{form.avatar}</Text>
            </View>
            <View>
              <Text style={styles.previewName}>{form.name || 'Vista previa'}</Text>
              <Text style={styles.previewRole}>{form.role === 'admin' ? '👑 Administrador' : '👤 Miembro'}</Text>
            </View>
          </View>

          {/* Role */}
          <View style={styles.group}>
            <Text style={styles.label}>Rol</Text>
            <View style={styles.roleRow}>
              {(['admin', 'member'] as const).map(r => (
                <TouchableOpacity
                  key={r}
                  onPress={() => up('role', r)}
                  style={[styles.roleChip, form.role === r && styles.roleChipActive]}
                >
                  <Text style={[styles.roleChipText, form.role === r && styles.roleChipTextActive]}>
                    {r === 'admin' ? '👑 Administrador' : '👤 Miembro'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* PIN — solo si es admin */}
          {form.role === 'admin' && (
            <View style={styles.group}>
              <Text style={styles.label}>PIN de acceso 🔐</Text>
              <TextInput
                style={styles.input}
                value={form.pin}
                onChangeText={v => up('pin', v.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="Ej: 1234"
                placeholderTextColor={Colors.textDim}
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
              />
              <Text style={{ fontFamily: Fonts.semibold, fontSize: 11, color: Colors.textDim, marginTop: 4 }}>
                Se pedirá al cambiar a este perfil. Dejalo vacío para no requerir PIN.
              </Text>
            </View>
          )}

          <Divider style={{ marginVertical: 16 }} />

          <View style={styles.btnRow}>
            <Btn label="Cancelar" variant="ghost" onPress={onClose} style={{ flex: 1 }} />
            <Btn label={user ? 'Guardar' : 'Crear miembro'} variant="primary" onPress={handleSave} disabled={!form.name.trim()} style={{ flex: 2 }} />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: Colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderWidth: 1, borderColor: Colors.border, maxHeight: '90%',
    padding: Spacing.xxl, paddingTop: 16, gap: Spacing.md,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 8 },
  title: { fontFamily: Fonts.black, fontSize: 20, color: Colors.text, marginBottom: 4 },
  group: { gap: 8, marginBottom: 16 },
  label: { fontFamily: Fonts.extrabold, fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  input: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radii.md, color: Colors.text, fontFamily: Fonts.semibold,
    fontSize: 14, paddingHorizontal: 12, paddingVertical: 10,
  },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  avatarOpt: {
    width: 48, height: 48, borderRadius: 12, backgroundColor: Colors.surface,
    borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  avatarOptSelected: { borderColor: Colors.accent, backgroundColor: Colors.accentGlow },
  avatarEmoji: { fontSize: 24 },
  colorGrid: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  colorDotSelected: { borderWidth: 3, borderColor: Colors.white },
  preview: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: 14, marginBottom: 16,
  },
  previewBubble: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  previewEmoji: { fontSize: 28 },
  previewName: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.text },
  previewRole: { fontFamily: Fonts.semibold, fontSize: 12, color: Colors.textMuted },
  roleRow: { flexDirection: 'row', gap: 10 },
  roleChip: {
    flex: 1, paddingVertical: 10, borderRadius: Radii.md,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center',
  },
  roleChipActive: { backgroundColor: Colors.accentGlow, borderColor: Colors.accent },
  roleChipText: { fontFamily: Fonts.bold, fontSize: 14, color: Colors.textMuted },
  roleChipTextActive: { color: Colors.accentLight },
  btnRow: { flexDirection: 'row', gap: 10 },
});
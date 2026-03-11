// src/components/RewardFormModal.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Fonts, Radii, Spacing } from '../theme';
import { useStore } from '../context/store';
import type { Reward } from '../data/models';

const ICONS = ['🍕','🎬','😴','🌳','🎮','🎨','🏖️','🎪','🍦','🎁','🏆','⭐','🎯','🎲','🎭','🛍️','🎠','🎡','🎢','🎪'];

interface Props {
  visible: boolean;
  reward?: Reward;
  onClose: () => void;
}

export const RewardFormModal: React.FC<Props> = ({ visible, reward, onClose }) => {
  const { addReward, updateReward } = useStore();
  const [name, setName]     = useState(reward?.name   ?? '');
  const [icon, setIcon]     = useState(reward?.icon   ?? '🎁');
  const [points, setPoints] = useState(String(reward?.points ?? 100));

  const handleSave = async () => {
    if (!name.trim()) return;
    if (reward) {
      await updateReward(reward.id, { name, icon, points: parseInt(points) || 100 });
    } else {
      await addReward({ name, icon, points: parseInt(points) || 100 });
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{reward ? '✏️ Editar recompensa' : '🎁 Nueva recompensa'}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.group}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ej: Noche de película"
              placeholderTextColor={Colors.textDim}
            />
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>Puntos necesarios ⭐</Text>
            <TextInput
              style={styles.input}
              value={points}
              onChangeText={v => setPoints(v.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholder="100"
              placeholderTextColor={Colors.textDim}
            />
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>Ícono</Text>
            <View style={styles.iconGrid}>
              {ICONS.map(ic => (
                <TouchableOpacity
                  key={ic}
                  onPress={() => setIcon(ic)}
                  style={[styles.iconOpt, icon === ic && styles.iconOptActive]}
                >
                  <Text style={styles.iconText}>{ic}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.preview}>
            <Text style={styles.previewIcon}>{icon}</Text>
            <View>
              <Text style={styles.previewName}>{name || 'Vista previa'}</Text>
              <Text style={styles.previewPts}>🏷️ {points || '100'} pts</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onClose} style={[styles.footerBtn, styles.cancelBtn]}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.footerBtn, styles.saveBtn, !name.trim() && styles.disabled]}
            disabled={!name.trim()}
          >
            <Text style={styles.saveText}>{reward ? 'Guardar' : 'Crear'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: Colors.bg },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, paddingTop: 52, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.surface },
  title:         { fontFamily: Fonts.black, fontSize: 20, color: Colors.text },
  closeBtn:      { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center' },
  closeText:     { color: Colors.textMuted, fontSize: 16, fontFamily: Fonts.bold },
  content:       { padding: Spacing.lg, paddingBottom: 32 },
  group:         { marginBottom: 16 },
  label:         { fontFamily: Fonts.extrabold, fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  input:         { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radii.md, color: Colors.text, fontFamily: Fonts.semibold, fontSize: 14, paddingHorizontal: 12, paddingVertical: 10 },
  iconGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  iconOpt:       { width: 46, height: 46, borderRadius: 12, backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  iconOptActive: { borderColor: Colors.accent, backgroundColor: Colors.accentGlow },
  iconText:      { fontSize: 24 },
  preview:       { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: 14, marginTop: 8 },
  previewIcon:   { fontSize: 36 },
  previewName:   { fontFamily: Fonts.bold, fontSize: 16, color: Colors.text },
  previewPts:    { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.textMuted },
  footer:        { flexDirection: 'row', gap: 10, padding: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.surface },
  footerBtn:     { flex: 1, paddingVertical: 12, borderRadius: Radii.md, alignItems: 'center' },
  cancelBtn:     { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  cancelText:    { fontFamily: Fonts.bold, fontSize: 14, color: Colors.textMuted },
  saveBtn:       { flex: 2, backgroundColor: Colors.accent },
  saveText:      { fontFamily: Fonts.bold, fontSize: 14, color: '#fff' },
  disabled:      { opacity: 0.4 },
}); 
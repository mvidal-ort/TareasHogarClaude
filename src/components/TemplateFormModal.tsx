// src/components/TemplateFormModal.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Fonts, Radii, Spacing, CATEGORY_MAP } from '../theme';
import { useStore } from '../context/store';
import type { TaskTemplate } from '../data/models';

interface Props {
  visible: boolean;
  template?: TaskTemplate;
  onClose: () => void;
}

export const TemplateFormModal: React.FC<Props> = ({ visible, template, onClose }) => {
  const { addTemplate, updateTemplate } = useStore();
  const [title, setTitle]   = useState(template?.title   ?? '');
  const [desc, setDesc]     = useState(template?.desc    ?? '');
  const [category, setCategory] = useState<string>(template?.category ?? 'limpieza');
  const [points, setPoints] = useState(String(template?.points ?? 20));

  const handleSave = async () => {
    if (!title.trim()) return;
    if (template) {
      await updateTemplate(template.id, { title, desc, category: category as any, points: parseInt(points) || 20 });
    } else {
      await addTemplate({ title, desc, category: category as any, points: parseInt(points) || 20 });
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{template ? '✏️ Editar plantilla' : '📋 Nueva plantilla'}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.group}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Nombre de la tarea"
              placeholderTextColor={Colors.textDim}
            />
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={desc}
              onChangeText={setDesc}
              placeholder="Detalles opcionales..."
              placeholderTextColor={Colors.textDim}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.pickerRow}>
              {Object.entries(CATEGORY_MAP).map(([k, v]) => (
                <TouchableOpacity
                  key={k}
                  onPress={() => setCategory(k)}
                  style={[styles.pickerChip, category === k && styles.pickerChipActive]}
                >
                  <Text style={[styles.pickerText, category === k && styles.pickerTextActive]}>
                    {v.icon} {v.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>Puntos base ⭐</Text>
            <TextInput
              style={styles.input}
              value={points}
              onChangeText={v => setPoints(v.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholder="20"
              placeholderTextColor={Colors.textDim}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onClose} style={[styles.footerBtn, styles.cancelBtn]}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.footerBtn, styles.saveBtn, !title.trim() && styles.disabled]}
            disabled={!title.trim()}
          >
            <Text style={styles.saveText}>{template ? 'Guardar' : 'Crear'}</Text>
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
  textarea:      { height: 72, textAlignVertical: 'top' },
  pickerRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pickerChip:    { backgroundColor: Colors.surface, borderRadius: Radii.md, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: Colors.border },
  pickerChipActive: { backgroundColor: Colors.accentGlow, borderColor: Colors.accent },
  pickerText:    { fontFamily: Fonts.bold, fontSize: 13, color: Colors.textMuted },
  pickerTextActive: { color: Colors.accentLight },
  footer:        { flexDirection: 'row', gap: 10, padding: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.surface },
  footerBtn:     { flex: 1, paddingVertical: 12, borderRadius: Radii.md, alignItems: 'center' },
  cancelBtn:     { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  cancelText:    { fontFamily: Fonts.bold, fontSize: 14, color: Colors.textMuted },
  saveBtn:       { flex: 2, backgroundColor: Colors.accent },
  saveText:      { fontFamily: Fonts.bold, fontSize: 14, color: '#fff' },
  disabled:      { opacity: 0.4 },
});
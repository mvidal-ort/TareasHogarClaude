// src/components/AssignTemplateModal.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Fonts, Radii, Spacing, CATEGORY_MAP } from '../theme';
import { useStore } from '../context/store';
import type { TaskTemplate } from '../data/models';

interface Props {
  visible: boolean;
  template: TaskTemplate | null;
  onClose: () => void;
}

const today = new Date().toISOString().split('T')[0];

export const AssignTemplateModal: React.FC<Props> = ({ visible, template, onClose }) => {
  const { users, assignTemplate } = useStore();
  const [assignee, setAssignee] = useState(users[0]?.id ?? 1);
  const [priority, setPriority] = useState('media');
  const [due, setDue]           = useState(today);
  const [repeat, setRepeat]     = useState('');

  const cat = template ? (CATEGORY_MAP[template.category] ?? { label: template.category, icon: '📋' }) : null;

  const handleAssign = async () => {
    if (!template) return;
    await assignTemplate(template.id, assignee, priority, due, repeat || null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📌 Asignar tarea</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Preview */}
          {template && (
            <View style={styles.preview}>
              <Text style={styles.previewIcon}>{cat?.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.previewTitle}>{template.title}</Text>
                <Text style={styles.previewDesc}>{cat?.label} · ⭐ {template.points} pts</Text>
                {template.desc ? <Text style={styles.previewDesc2}>{template.desc}</Text> : null}
              </View>
            </View>
          )}

          <View style={styles.group}>
            <Text style={styles.label}>Asignar a</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.pickerRow}>
                {users.map(u => (
                  <TouchableOpacity
                    key={u.id}
                    onPress={() => setAssignee(u.id)}
                    style={[styles.pickerChip, assignee === u.id && styles.pickerChipActive]}
                  >
                    <Text style={[styles.pickerText, assignee === u.id && styles.pickerTextActive]}>
                      {u.avatar} {u.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>Prioridad</Text>
            <View style={styles.pickerRow}>
              {[['alta','🔴 Alta'],['media','🟡 Media'],['baja','🟢 Baja']].map(([k,l]) => (
                <TouchableOpacity
                  key={k}
                  onPress={() => setPriority(k)}
                  style={[styles.pickerChip, priority === k && styles.pickerChipActive]}
                >
                  <Text style={[styles.pickerText, priority === k && styles.pickerTextActive]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>Fecha</Text>
            <TextInput
              style={styles.input}
              value={due}
              onChangeText={setDue}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.textDim}
            />
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>Repetición</Text>
            <View style={styles.pickerRow}>
              {[['','🚫 No repite'],['diaria','🔁 Diaria'],['semanal','📅 Semanal']].map(([k,l]) => (
                <TouchableOpacity
                  key={k}
                  onPress={() => setRepeat(k)}
                  style={[styles.pickerChip, repeat === k && styles.pickerChipActive]}
                >
                  <Text style={[styles.pickerText, repeat === k && styles.pickerTextActive]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onClose} style={[styles.footerBtn, styles.cancelBtn]}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAssign} style={[styles.footerBtn, styles.saveBtn]}>
            <Text style={styles.saveText}>Asignar tarea</Text>
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
  preview:       { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
  previewIcon:   { fontSize: 32 },
  previewTitle:  { fontFamily: Fonts.black, fontSize: 16, color: Colors.text },
  previewDesc:   { fontFamily: Fonts.semibold, fontSize: 12, color: Colors.accentLight, marginTop: 2 },
  previewDesc2:  { fontFamily: Fonts.regular, fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  group:         { marginBottom: 16 },
  label:         { fontFamily: Fonts.extrabold, fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  input:         { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radii.md, color: Colors.text, fontFamily: Fonts.semibold, fontSize: 14, paddingHorizontal: 12, paddingVertical: 10 },
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
});
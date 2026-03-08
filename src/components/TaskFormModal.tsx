// src/components/TaskFormModal.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  Modal, TouchableOpacity,
} from 'react-native';
import { Colors, Fonts, Radii, Spacing, CATEGORY_MAP, PRIORITY_MAP } from '../theme';
import { Btn, Divider } from './UI';
import { useStore } from '../context/store';
import type { Task } from '../data/models';

type TaskFormData = Omit<Task, 'id' | 'comments'>;

interface Props {
  visible: boolean;
  task?: Task;
  onClose: () => void;
}

const today = new Date().toISOString().split('T')[0];

export const TaskFormModal: React.FC<Props> = ({ visible, task, onClose }) => {
  const { users, addTask, updateTask } = useStore();

  const blank: TaskFormData = {
    title: '', desc: '', assignee: users[0]?.id ?? 1,
    due: today, priority: 'media', status: 'pendiente',
    category: 'limpieza', points: 20, repeat: null,
  };

  const [form, setForm] = useState<TaskFormData>(task ? {
    title: task.title, desc: task.desc, assignee: task.assignee,
    due: task.due, priority: task.priority, status: task.status,
    category: task.category, points: task.points, repeat: task.repeat,
  } : blank);

  const up = <K extends keyof TaskFormData>(k: K, v: TaskFormData[K]) =>
    setForm(f => ({ ...f, [k]: v }));

 const handleSave = () => {
  if (!form.title.trim()) return;
  if (task) {
    updateTask(task.id, form);
  } else {
    addTask(form);    
  }
  setForm(blank);
  onClose();
};

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{task ? '✏️ Editar tarea' : '➕ Nueva tarea'}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.group}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              value={form.title}
              onChangeText={v => up('title', v)}
              placeholder="¿Qué hay que hacer?"
              placeholderTextColor={Colors.textDim}
            />
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={form.desc}
              onChangeText={v => up('desc', v)}
              placeholder="Detalles opcionales..."
              placeholderTextColor={Colors.textDim}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>Asignar a</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.pickerRow}>
                {users.map(u => (
                  <TouchableOpacity
                    key={u.id}
                    onPress={() => up('assignee', u.id)}
                    style={[styles.pickerChip, form.assignee === u.id && styles.pickerChipActive]}
                  >
                    <Text style={[styles.pickerText, form.assignee === u.id && styles.pickerTextActive]}>
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
                  onPress={() => up('priority', k as any)}
                  style={[styles.pickerChip, form.priority === k && styles.pickerChipActive]}
                >
                  <Text style={[styles.pickerText, form.priority === k && styles.pickerTextActive]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.pickerRow}>
              {Object.entries(CATEGORY_MAP).map(([k, v]) => (
                <TouchableOpacity
                  key={k}
                  onPress={() => up('category', k as any)}
                  style={[styles.pickerChip, form.category === k && styles.pickerChipActive]}
                >
                  <Text style={[styles.pickerText, form.category === k && styles.pickerTextActive]}>
                    {v.icon} {v.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.row2}>
            <View style={[styles.group, { flex: 1 }]}>
              <Text style={styles.label}>Fecha</Text>
              <TextInput
                style={styles.input}
                value={form.due}
                onChangeText={v => up('due', v)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textDim}
              />
            </View>
            <View style={[styles.group, { flex: 1 }]}>
              <Text style={styles.label}>Puntos ⭐</Text>
              <TextInput
                style={styles.input}
                value={String(form.points)}
                onChangeText={v => up('points', Number(v) || 10)}
                keyboardType="numeric"
                placeholderTextColor={Colors.textDim}
              />
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>Repetición</Text>
            <View style={styles.pickerRow}>
              {[['','🚫 No repite'],['diaria','🔁 Diaria'],['semanal','📅 Semanal']].map(([k,l]) => (
                <TouchableOpacity
                  key={k}
                  onPress={() => up('repeat', k === '' ? null : k as any)}
                  style={[styles.pickerChip, (form.repeat ?? '') === k && styles.pickerChipActive]}
                >
                  <Text style={[styles.pickerText, (form.repeat ?? '') === k && styles.pickerTextActive]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onClose} style={[styles.footerBtn, styles.cancelBtn]}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.footerBtn, styles.saveBtn, !form.title.trim() && styles.disabled]}
            disabled={!form.title.trim()}
          >
            <Text style={styles.saveText}>{task ? 'Guardar' : 'Crear tarea'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.bg },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, paddingTop: 52, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.surface },
  title:       { fontFamily: Fonts.black, fontSize: 20, color: Colors.text },
  closeBtn:    { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center' },
  closeText:   { color: Colors.textMuted, fontSize: 16, fontFamily: Fonts.bold },
  scroll:      { flex: 1 },
  scrollContent: { padding: Spacing.lg, paddingBottom: 32 },
  group:       { marginBottom: 16 },
  label:       { fontFamily: Fonts.extrabold, fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  input:       { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radii.md, color: Colors.text, fontFamily: Fonts.semibold, fontSize: 14, paddingHorizontal: 12, paddingVertical: 10 },
  textarea:    { height: 72, textAlignVertical: 'top' },
  row2:        { flexDirection: 'row', gap: 12 },
  pickerRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pickerChip:  { backgroundColor: Colors.surface, borderRadius: Radii.md, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: Colors.border },
  pickerChipActive: { backgroundColor: Colors.accentGlow, borderColor: Colors.accent },
  pickerText:  { fontFamily: Fonts.bold, fontSize: 13, color: Colors.textMuted },
  pickerTextActive: { color: Colors.accentLight },
  footer:      { flexDirection: 'row', gap: 10, padding: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.surface },
  footerBtn:   { flex: 1, paddingVertical: 12, borderRadius: Radii.md, alignItems: 'center' },
  cancelBtn:   { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  cancelText:  { fontFamily: Fonts.bold, fontSize: 14, color: Colors.textMuted },
  saveBtn:     { flex: 2, backgroundColor: Colors.accent },
  saveText:    { fontFamily: Fonts.bold, fontSize: 14, color: '#fff' },
  disabled:    { opacity: 0.4 },
});
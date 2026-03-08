// src/components/TaskDetailModal.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Modal,
  TouchableWithoutFeedback, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors, Fonts, Radii, Spacing, PRIORITY_MAP, STATUS_MAP, CATEGORY_MAP } from '../theme';
import { Btn, Chip, Divider, AvatarBubble } from './UI';
import { useStore } from '../context/store';
import type { Task } from '../data/models';

interface Props {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onEdit?: () => void;
}

export const TaskDetailModal: React.FC<Props> = ({ visible, task, onClose, onEdit }) => {
  const { users, toggleTaskComplete, addComment, isAdmin } = useStore();
  const [comment, setComment] = useState('');
  const admin = isAdmin();

  if (!task) return null;

  const assignee = users.find(u => u.id === task.assignee);
  const pr = PRIORITY_MAP[task.priority];
  const st = STATUS_MAP[task.status];
  const cat = CATEGORY_MAP[task.category];
  const isCompleted = task.status === 'completada';

  const handleComment = () => {
    if (!comment.trim()) return;
    addComment(task.id, comment.trim());
    setComment('');
  };

  const handleToggle = () => {
    toggleTaskComplete(task.id);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View style={{ flex: 1, gap: 6 }}>
                <View style={styles.catRow}>
                  <Text style={styles.catText}>{cat.icon} {cat.label}</Text>
                  {task.repeat && <Text style={styles.catText}>🔁 {task.repeat}</Text>}
                </View>
                <Text style={[styles.taskTitle, isCompleted && styles.taskTitleDone]}>{task.title}</Text>
                {task.desc ? <Text style={styles.taskDesc}>{task.desc}</Text> : null}
              </View>
              {assignee && <AvatarBubble avatar={assignee.avatar} color={assignee.color} size={52} name={assignee.name} />}
            </View>

            {/* Status chips */}
            <View style={styles.chipRow}>
              <Chip label={pr.label} color={pr.color} bg={pr.bg} size="md" icon={pr.label === 'Alta' ? '🔴' : pr.label === 'Media' ? '🟡' : '🟢'} />
              <Chip label={st.label} color={st.color} bg={Colors.surface} size="md" icon={st.icon} />
              <Chip label={task.due} color={Colors.textMuted} bg={Colors.surface} size="md" icon="📅" />
              <Chip label={`${task.points} pts`} color={Colors.accentLight} bg={Colors.accentGlow} size="md" icon="⭐" />
            </View>

            <Divider style={{ marginVertical: 16 }} />

            {/* Comments */}
            <Text style={styles.sectionLabel}>💬 Comentarios</Text>
            {task.comments.length === 0 ? (
              <Text style={styles.emptyComments}>Sin comentarios aún. ¡Añade el primero!</Text>
            ) : (
              <View style={styles.commentList}>
                {task.comments.map((c, i) => (
                  <View key={i} style={styles.commentBubble}>
                    <Text style={styles.commentText}>{c}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                value={comment}
                onChangeText={setComment}
                placeholder="Escribir comentario..."
                placeholderTextColor={Colors.textDim}
                onSubmitEditing={handleComment}
              />
              <Btn icon="↑" variant="primary" onPress={handleComment} size="md" />
            </View>

            <Divider style={{ marginVertical: 16 }} />

            {/* Actions */}
            <View style={styles.actionRow}>
              {admin && onEdit && (
                <Btn label="Editar" icon="✏️" variant="ghost" onPress={() => { onClose(); setTimeout(onEdit, 100); }} style={{ flex: 1 }} />
              )}
              <Btn
                label={isCompleted ? 'Reabrir' : 'Completar'}
                icon={isCompleted ? '↩' : '✅'}
                variant={isCompleted ? 'ghost' : 'success'}
                onPress={handleToggle}
                style={{ flex: 2 }}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  keyboardView: { justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderWidth: 1, borderColor: Colors.border,
    maxHeight: '88%', padding: Spacing.xxl, paddingTop: 16,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 16,
  },
  header:   { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 14 },
  catRow:   { flexDirection: 'row', gap: 8 },
  catText:  { fontFamily: Fonts.bold, fontSize: 12, color: Colors.textMuted },
  taskTitle: { fontFamily: Fonts.black, fontSize: 22, color: Colors.text, lineHeight: 28 },
  taskTitleDone: { textDecorationLine: 'line-through', color: Colors.textMuted },
  taskDesc:  { fontFamily: Fonts.regular, fontSize: 14, color: Colors.textMuted },
  chipRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sectionLabel: { fontFamily: Fonts.extrabold, fontSize: 12, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  emptyComments: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.textDim, marginBottom: 10 },
  commentList: { gap: 8, marginBottom: 12 },
  commentBubble: {
    backgroundColor: Colors.surface, borderRadius: Radii.md,
    padding: Spacing.sm + 2, paddingHorizontal: 14,
    borderLeftWidth: 3, borderLeftColor: Colors.accent,
  },
  commentText: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.text },
  commentInputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  commentInput: {
    flex: 1, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radii.md, color: Colors.text, fontFamily: Fonts.semibold, fontSize: 14,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  actionRow: { flexDirection: 'row', gap: 10, paddingBottom: 8 },
});

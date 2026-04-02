// src/components/TaskCard.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Colors, Fonts, Radii, Spacing, PRIORITY_MAP, STATUS_MAP, CATEGORY_MAP } from '../theme';
import { Chip, Btn } from './UI';
import type { Task, User } from '../data/models';

interface TaskCardProps {
  task: Task;
  assignee?: User;
  isAdmin?: boolean;
  onPress: () => void;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task, assignee, isAdmin, onPress, onToggle, onEdit, onDelete,
}) => {
  const isCompleted = task.status === 'completada';
  const pr = PRIORITY_MAP[task.priority];
  const st = STATUS_MAP[task.status];
  const cat = CATEGORY_MAP[task.category] ?? { label: task.category, icon: '📋' };
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, isCompleted && styles.cardCompleted]}
    >
      {/* Priority stripe */}
      <View style={[styles.stripe, { backgroundColor: pr.color }]} />

      <View style={styles.row}>
        {/* Checkbox */}
        <TouchableOpacity onPress={onToggle} activeOpacity={0.7} style={[styles.check, isCompleted && styles.checkDone]}>
          {isCompleted && <Text style={styles.checkMark}>✓</Text>}
        </TouchableOpacity>

        {/* Body */}
        <View style={styles.body}>
          <Text style={[styles.title, isCompleted && styles.titleDone]} numberOfLines={2}>
            {task.title}
          </Text>
          {task.desc ? (
            <Text style={styles.desc} numberOfLines={1}>{task.desc}</Text>
          ) : null}
          <View style={styles.chips}>
            <Chip label={pr.label} color={pr.color} bg={pr.bg} />
            <Chip label={`${cat.icon} ${cat.label}`} color={Colors.textMuted} bg={Colors.surface} />
            <Chip label={`${st.icon} ${st.label}`} color={st.color} bg={Colors.surface} />
            {task.repeat && (
              <Chip label={`🔁 ${task.repeat}`} color={Colors.textMuted} bg={Colors.surface} />
            )}
          </View>
          <View style={styles.footer}>
            <Text style={styles.date}>📅 {task.due}</Text>
            <Text style={styles.pts}>⭐ {task.points} pts</Text>
            {task.comments.length > 0 && (
              <Text style={styles.comments}>💬 {task.comments.length}</Text>
            )}
          </View>
        </View>

        {/* Assignee */}
        {assignee && (
          <View style={styles.assignee}>
            <View style={[styles.avatarBubble, { backgroundColor: (assignee.color ?? Colors.accent) + '25' }]}>
              <Text style={styles.avatarText}>{assignee.avatar}</Text>
            </View>
            <Text style={styles.assigneeName} numberOfLines={1}>{assignee.name}</Text>
          </View>
        )}
      </View>

      {/* Admin actions */}
      {isAdmin && (
        <View style={styles.actions}>
          {onEdit && <Btn icon="✏️" variant="ghost" size="sm" onPress={onEdit} />}
          {onDelete && <Btn icon="🗑️" variant="danger" size="sm" onPress={onDelete} />}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  cardCompleted: { opacity: 0.55 },
  stripe: { height: 3, width: '100%' },
  row: { flexDirection: 'row', padding: Spacing.md, gap: Spacing.sm, alignItems: 'flex-start' },
  check: {
    width: 24, height: 24, borderRadius: 7, borderWidth: 2,
    borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
    marginTop: 2, flexShrink: 0,
  },
  checkDone:  { backgroundColor: Colors.green, borderColor: Colors.green },
  checkMark:  { fontSize: 13, color: Colors.bg, fontFamily: Fonts.black },
  body:       { flex: 1, gap: 6 },
  title:      { fontFamily: Fonts.bold, fontSize: 15, color: Colors.text, lineHeight: 20 },
  titleDone:  { textDecorationLine: 'line-through', color: Colors.textMuted },
  desc:       { fontFamily: Fonts.regular, fontSize: 12, color: Colors.textMuted },
  chips:      { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  footer:     { flexDirection: 'row', gap: 10, alignItems: 'center' },
  date:       { fontFamily: Fonts.semibold, fontSize: 11, color: Colors.textDim },
  pts:        { fontFamily: Fonts.bold,     fontSize: 11, color: Colors.accentLight },
  comments:   { fontFamily: Fonts.bold,     fontSize: 11, color: Colors.textMuted },
  assignee:   { alignItems: 'center', gap: 4, minWidth: 48 },
  avatarBubble: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  avatarText:   { fontSize: 20 },
  assigneeName: { fontFamily: Fonts.bold, fontSize: 10, color: Colors.textMuted, maxWidth: 50, textAlign: 'center' },
  actions:    { flexDirection: 'row', gap: 6, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, justifyContent: 'flex-end' },
});

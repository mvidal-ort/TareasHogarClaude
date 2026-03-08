// src/screens/DashboardScreen.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radii, Spacing, CATEGORY_MAP } from '../theme';
import { Card, SectionHeader, ProgressBar, AvatarBubble } from '../components/UI';
import { TaskCard } from '../components/TaskCard';
import { useStore } from '../context/store';

interface Props {
  navigation: any;
}

const today = new Date().toISOString().split('T')[0];

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { tasks, users, currentUser, toggleTaskComplete, deleteTask } = useStore(s => ({
    tasks: s.tasks,
    users: s.users,
    currentUser: s.currentUser(),
    toggleTaskComplete: s.toggleTaskComplete,
    deleteTask: s.deleteTask,
  }));
  const isAdmin = useStore(s => s.isAdmin());

  const stats = {
    pending: tasks.filter(t => t.status === 'pendiente').length,
    overdue: tasks.filter(t => t.status === 'vencida').length,
    completedToday: tasks.filter(t => t.status === 'completada' && t.due === today).length,
    total: tasks.length,
  };

  const myTasksToday = tasks.filter(t => t.assignee === currentUser.id && t.due === today);

  const catStats = Object.entries(CATEGORY_MAP).map(([key, val]) => {
    const catTasks = tasks.filter(t => t.category === key as any);
    return {
      key, label: val.label, icon: val.icon,
      done: catTasks.filter(t => t.status === 'completada').length,
      total: catTasks.length,
    };
  }).filter(c => c.total > 0);

  const ranking = [...users].sort((a, b) => b.points - a.points).slice(0, 3);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Points banner */}
        <View style={styles.pointsBanner}>
          <Text style={styles.pointsIcon}>⭐</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.pointsGreeting}>Hola, {currentUser.name}!</Text>
            <Text style={styles.pointsLabel}>Tus puntos esta semana</Text>
          </View>
          <Text style={styles.pointsValue}>{currentUser.points}</Text>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {[
            { icon: '⏳', label: 'Pendientes',      value: stats.pending,       color: Colors.yellow },
            { icon: '⚠️', label: 'Vencidas',        value: stats.overdue,       color: Colors.red    },
            { icon: '✅', label: 'Completadas hoy', value: stats.completedToday, color: Colors.green  },
            { icon: '📋', label: 'Total tareas',    value: stats.total,         color: Colors.text   },
          ].map(s => (
            <Card key={s.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </Card>
          ))}
        </View>

        {/* Category progress */}
        <Card style={styles.sectionCard}>
          <SectionHeader title="Por categoría" />
          {catStats.map(c => (
            <View key={c.key} style={styles.catRow}>
              <Text style={styles.catIcon}>{c.icon}</Text>
              <Text style={styles.catLabel} numberOfLines={1}>{c.label}</Text>
              <View style={{ flex: 1 }}>
                <ProgressBar pct={c.total ? (c.done / c.total) * 100 : 0} />
              </View>
              <Text style={styles.catCount}>{c.done}/{c.total}</Text>
            </View>
          ))}
        </Card>

        {/* Mini ranking */}
        <Card style={styles.sectionCard}>
          <SectionHeader title="🏆 Top familia" />
          {ranking.map((u, i) => (
            <View key={u.id} style={styles.rankRow}>
              <Text style={styles.rankPos}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</Text>
              <AvatarBubble avatar={u.avatar} color={u.color} size={36} />
              <Text style={styles.rankName}>{u.name}</Text>
              <Text style={styles.rankPts}>{u.points} pts</Text>
            </View>
          ))}
        </Card>

        {/* My tasks today */}
        <SectionHeader title="Mis tareas de hoy" count={myTasksToday.length} />
        {myTasksToday.length === 0 ? (
          <View style={styles.emptyToday}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyText}>¡Sin tareas por hoy!</Text>
          </View>
        ) : (
          myTasksToday.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              assignee={users.find(u => u.id === task.assignee)}
              isAdmin={isAdmin}
              onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
              onToggle={() => toggleTaskComplete(task.id)}
              onEdit={() => navigation.navigate('TaskForm', { taskId: task.id })}
              onDelete={() => deleteTask(task.id)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  scroll:  { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: 32 },

  pointsBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.accentGlow, borderRadius: Radii.lg,
    borderWidth: 1, borderColor: 'rgba(124,106,247,0.2)',
    padding: Spacing.lg, marginBottom: 16,
  },
  pointsIcon:     { fontSize: 28 },
  pointsGreeting: { fontFamily: Fonts.extrabold, fontSize: 16, color: Colors.accentLight },
  pointsLabel:    { fontFamily: Fonts.semibold,  fontSize: 12, color: Colors.textMuted },
  pointsValue:    { fontFamily: Fonts.monoBold,  fontSize: 26, color: Colors.accentLight },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: { width: '47.5%', gap: 6, padding: 14 },
  statIcon:  { fontSize: 22 },
  statValue: { fontFamily: Fonts.monoBold, fontSize: 28 },
  statLabel: { fontFamily: Fonts.semibold, fontSize: 11, color: Colors.textMuted },

  sectionCard:  { marginBottom: 16, gap: 12 },
  catRow:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catIcon:      { fontSize: 16, width: 22, textAlign: 'center' },
  catLabel:     { fontFamily: Fonts.bold, fontSize: 12, color: Colors.textMuted, width: 62 },
  catCount:     { fontFamily: Fonts.monoBold, fontSize: 11, color: Colors.accentLight, width: 34, textAlign: 'right' },

  rankRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rankPos:  { fontSize: 22, width: 32 },
  rankName: { fontFamily: Fonts.bold, fontSize: 14, color: Colors.text, flex: 1 },
  rankPts:  { fontFamily: Fonts.monoBold, fontSize: 14, color: Colors.accentLight },

  emptyToday: { alignItems: 'center', paddingVertical: 32 },
  emptyIcon:  { fontSize: 40, marginBottom: 8 },
  emptyText:  { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.textMuted },
});

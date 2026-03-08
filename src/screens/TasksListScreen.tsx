// src/screens/TasksListScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radii, Spacing, CATEGORY_MAP, STATUS_MAP } from '../theme';
import { TaskCard } from '../components/TaskCard';
import { TaskFormModal } from '../components/TaskFormModal';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { EmptyState, Btn } from '../components/UI';
import { useStore } from '../context/store';
import type { Task } from '../data/models';

type FilterMode = 'mine' | 'all';

interface Props {
  navigation?: any;
  route?: any;
}

export const TasksListScreen: React.FC<Props> = () => {
  const { tasks, users, currentUser, toggleTaskComplete, deleteTask, isAdmin } = useStore(s => ({
    tasks: s.tasks,
    users: s.users,
    currentUser: s.currentUser(),
    toggleTaskComplete: s.toggleTaskComplete,
    deleteTask: s.deleteTask,
    isAdmin: s.isAdmin(),
  }));

  const [mode, setMode] = useState<FilterMode>('mine');
  const [filterUser, setFilterUser]   = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCat, setFilterCat]     = useState<string>('all');
  const [search, setSearch]           = useState('');

  const [showForm, setShowForm]     = useState(false);
  console.log('showForm:', showForm);
  const [editTask, setEditTask]     = useState<Task | undefined>();
  const [detailTask, setDetailTask] = useState<Task | null>(null);

  const filtered = useMemo(() => {
    let list = mode === 'mine' ? tasks.filter(t => t.assignee === currentUser.id) : [...tasks];
    if (filterUser  !== 'all') list = list.filter(t => t.assignee === Number(filterUser));
    if (filterStatus !== 'all') list = list.filter(t => t.status === filterStatus);
    if (filterCat   !== 'all') list = list.filter(t => t.category === filterCat);
    if (search.trim())         list = list.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    return list.sort((a, b) => {
      const order: Record<string, number> = { vencida: 0, alta: 1, media: 2, baja: 3 };
      return (order[a.status === 'vencida' ? 'vencida' : a.priority] ?? 9) -
             (order[b.status === 'vencida' ? 'vencida' : b.priority] ?? 9);
    });
  }, [tasks, mode, filterUser, filterStatus, filterCat, search, currentUser.id]);

  const FilterChip: React.FC<{ label: string; active: boolean; onPress: () => void }> = ({ label, active, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[fStyles.chip, active && fStyles.chipActive]}>
      <Text style={[fStyles.chipText, active && fStyles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setMode('mine')} style={[styles.tab, mode === 'mine' && styles.tabActive]}>
          <Text style={[styles.tabText, mode === 'mine' && styles.tabTextActive]}>📋 Mis tareas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMode('all')} style={[styles.tab, mode === 'all' && styles.tabActive]}>
          <Text style={[styles.tabText, mode === 'all' && styles.tabTextActive]}>📊 Todas</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="🔍 Buscar tareas..."
          placeholderTextColor={Colors.textDim}
        />
        {isAdmin && (
          <Btn icon="➕" variant="primary" onPress={() => { setEditTask(undefined); setShowForm(true); }} size="md" />
        )}
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersWrap} contentContainerStyle={styles.filters}>
        <FilterChip label="👥 Todos" active={filterUser === 'all'} onPress={() => setFilterUser('all')} />
        {users.map(u => (
          <FilterChip key={u.id} label={`${u.avatar} ${u.name}`} active={filterUser === String(u.id)} onPress={() => setFilterUser(String(u.id))} />
        ))}
        <View style={styles.filterDivider} />
        <FilterChip label="🔵 Todos" active={filterStatus === 'all'} onPress={() => setFilterStatus('all')} />
        {Object.entries(STATUS_MAP).map(([k, v]) => (
          <FilterChip key={k} label={`${v.icon} ${v.label}`} active={filterStatus === k} onPress={() => setFilterStatus(k)} />
        ))}
        <View style={styles.filterDivider} />
        <FilterChip label="📁 Todas" active={filterCat === 'all'} onPress={() => setFilterCat('all')} />
        {Object.entries(CATEGORY_MAP).map(([k, v]) => (
          <FilterChip key={k} label={`${v.icon} ${v.label}`} active={filterCat === k} onPress={() => setFilterCat(k)} />
        ))}
      </ScrollView>

      {/* Count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>{filtered.length} tarea{filtered.length !== 1 ? 's' : ''}</Text>
        {(filterUser !== 'all' || filterStatus !== 'all' || filterCat !== 'all' || search) && (
          <TouchableOpacity onPress={() => { setFilterUser('all'); setFilterStatus('all'); setFilterCat('all'); setSearch(''); }}>
            <Text style={styles.clearText}>✖ Limpiar filtros</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <EmptyState icon="📭" text={search ? 'Sin resultados para tu búsqueda' : 'Sin tareas con estos filtros'} />
        ) : (
          filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              assignee={users.find(u => u.id === task.assignee)}
              isAdmin={isAdmin}
              onPress={() => setDetailTask(task)}
              onToggle={() => toggleTaskComplete(task.id)}
              onEdit={() => { setEditTask(task); setShowForm(true); }}
              onDelete={() => deleteTask(task.id)}
            />
          ))
        )}
      </ScrollView>

      <TaskFormModal
        visible={showForm}
        task={editTask}
        onClose={() => { setShowForm(false); setEditTask(undefined); }}
      />
      <TaskDetailModal
        visible={!!detailTask}
        task={detailTask}
        onClose={() => setDetailTask(null)}
        onEdit={() => { if (detailTask) { setEditTask(detailTask); setShowForm(true); setDetailTask(null); } }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  tabBar:  { flexDirection: 'row', backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg, paddingTop: 8, gap: 4 },
  tab: {
    flex: 1, paddingVertical: 10, borderRadius: Radii.md,
    alignItems: 'center', marginBottom: 8,
  },
  tabActive:     { backgroundColor: Colors.card },
  tabText:       { fontFamily: Fonts.extrabold, fontSize: 13, color: Colors.textMuted },
  tabTextActive: { color: Colors.text },
  searchRow: {
    flexDirection: 'row', gap: 10, alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: 10,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  search: {
    flex: 1, backgroundColor: Colors.card, borderRadius: Radii.md,
    borderWidth: 1, borderColor: Colors.border, color: Colors.text,
    fontFamily: Fonts.semibold, fontSize: 14, paddingHorizontal: 12, paddingVertical: 9,
  },
  filtersWrap: { backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border, maxHeight: 52 },
  filters: { paddingHorizontal: Spacing.lg, paddingVertical: 8, gap: 6, flexDirection: 'row', alignItems: 'center' },
  filterDivider: { width: 1, height: 20, backgroundColor: Colors.border, marginHorizontal: 4 },
  countRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: 8,
  },
  countText: { fontFamily: Fonts.semibold, fontSize: 12, color: Colors.textMuted },
  clearText: { fontFamily: Fonts.bold, fontSize: 12, color: Colors.red },
  list:        { flex: 1 },
  listContent: { padding: Spacing.lg, paddingBottom: 32 },
});

const fStyles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radii.full,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
  },
  chipActive:     { backgroundColor: Colors.accentGlow, borderColor: Colors.accent },
  chipText:       { fontFamily: Fonts.bold, fontSize: 12, color: Colors.textMuted },
  chipTextActive: { color: Colors.accentLight },
});

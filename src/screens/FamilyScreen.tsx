// src/screens/FamilyScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radii, Spacing } from '../theme';
import { Card, Btn, AvatarBubble, ProgressBar, Divider } from '../components/UI';
import { UserFormModal } from '../components/UserFormModal';
import { useStore } from '../context/store';
import type { User } from '../data/models';

export const FamilyScreen: React.FC = () => {
  const { users, tasks, currentUser, isAdmin, deleteUser, setCurrentUser } = useStore(s => ({
    users: s.users,
    tasks: s.tasks,
    currentUser: s.currentUser(),
    isAdmin: s.isAdmin(),
    deleteUser: s.deleteUser,
    setCurrentUser: s.setCurrentUser,
  }));

  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<User | undefined>();

  const handleDelete = (user: User) => {
    Alert.alert(
      'Eliminar miembro',
      `¿Seguro que querés eliminar a ${user.name}? Sus tareas se reasignarán.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteUser(user.id) },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>👨‍👩‍👧‍👦 Miembros</Text>
          {isAdmin && (
            <Btn label="+ Añadir" variant="primary" size="sm"
              onPress={() => { setEditUser(undefined); setShowForm(true); }} />
          )}
        </View>

        {/* User cards */}
        {users.map(user => {
          const userTasks = tasks.filter(t => t.assignee === user.id);
          const done = userTasks.filter(t => t.status === 'completada').length;
          const pct = userTasks.length ? (done / userTasks.length) * 100 : 0;
          const isCurrent = user.id === currentUser.id;

          return (
            <Card key={user.id} style={[styles.userCard, isCurrent ? styles.userCardActive : {}]}>
              
              {/* User header */} 
              <View style={styles.userHeader}>
                <AvatarBubble avatar={user.avatar} color={user.color} size={56} />
                <View style={styles.userInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.userName}>{user.name}</Text>
                    {isCurrent && <View style={styles.youBadge}><Text style={styles.youText}>Tú</Text></View>}
                  </View>
                  <Text style={styles.userRole}>{user.role === 'admin' ? '👑 Administrador' : '👤 Miembro'}</Text>
                  <Text style={styles.userPoints}>⭐ {user.points} puntos</Text>
                </View>
              </View>

              <Divider style={{ marginVertical: 12 }} />

              {/* Progress */}
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Progreso de tareas</Text>
                <Text style={styles.progressCount}>{done}/{userTasks.length}</Text>
              </View>
              <ProgressBar pct={pct} color={user.color} height={8} />

              {/* Stats mini */}
              <View style={styles.miniStats}>
                {[
                  { label: 'Pendientes', value: userTasks.filter(t => t.status === 'pendiente').length,  color: Colors.yellow },
                  { label: 'En progreso', value: userTasks.filter(t => t.status === 'en_progreso').length, color: Colors.blue  },
                  { label: 'Completadas', value: done, color: Colors.green },
                  { label: 'Vencidas',    value: userTasks.filter(t => t.status === 'vencida').length,   color: Colors.red   },
                ].map(s => (
                  <View key={s.label} style={styles.miniStat}>
                    <Text style={[styles.miniStatValue, { color: s.color }]}>{s.value}</Text>
                    <Text style={styles.miniStatLabel}>{s.label}</Text>
                  </View>
                ))}
              </View>

              <Divider style={{ marginVertical: 12 }} />

              {/* Actions */}
              <View style={styles.actionsRow}>
                {!isCurrent && (
                  <Btn label={`Cambiar a ${user.name}`} icon={user.avatar} variant="ghost" size="sm"
                    onPress={() => setCurrentUser(user.id)} style={{ flex: 1 }} />
                )}
                {isAdmin && (
                  <>
                    <Btn icon="✏️" variant="ghost" size="sm"
                      onPress={() => { setEditUser(user); setShowForm(true); }} />
                    {user.id !== currentUser.id && (
                      <Btn icon="🗑️" variant="danger" size="sm"
                        onPress={() => handleDelete(user)} />
                    )}
                  </>
                )}
              </View>
            </Card>
          );
        })}
      </ScrollView>

      <UserFormModal
        visible={showForm}
        user={editUser}
        onClose={() => { setShowForm(false); setEditUser(undefined); }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.lg, paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerTitle: { fontFamily: Fonts.black, fontSize: 22, color: Colors.text },

  userCard: { marginBottom: 14 },
  userCardActive: { borderColor: Colors.accent },

  userHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  userInfo:   { flex: 1, gap: 3 },
  nameRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  userName:   { fontFamily: Fonts.black, fontSize: 18, color: Colors.text },
  youBadge:   { backgroundColor: Colors.accentGlow, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  youText:    { fontFamily: Fonts.bold, fontSize: 11, color: Colors.accentLight },
  userRole:   { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.textMuted },
  userPoints: { fontFamily: Fonts.bold,    fontSize: 13, color: Colors.accentLight },

  progressRow:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontFamily: Fonts.bold, fontSize: 12, color: Colors.textMuted },
  progressCount: { fontFamily: Fonts.monoBold, fontSize: 12, color: Colors.textMuted },

  miniStats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
  miniStat:  { alignItems: 'center', gap: 2 },
  miniStatValue: { fontFamily: Fonts.monoBold, fontSize: 20 },
  miniStatLabel: { fontFamily: Fonts.semibold, fontSize: 10, color: Colors.textDim },

  actionsRow: { flexDirection: 'row', gap: 8 },
});

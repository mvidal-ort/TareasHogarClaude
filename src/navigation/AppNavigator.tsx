// src/navigation/AppNavigator.tsx
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radii, Spacing } from '../theme';
import { DashboardScreen } from '../screens/DashboardScreen';
import { TasksListScreen } from '../screens/TasksListScreen';
import { FamilyScreen } from '../screens/FamilyScreen';
import { RankingScreen } from '../screens/RankingScreen';
import { UserSelectorScreen } from '../screens/UserSelectorScreen';
import { useStore } from '../context/store';

type Tab = 'dashboard' | 'tasks' | 'family' | 'ranking';

const TABS: Array<{ id: Tab; label: string; icon: string }> = [
  { id: 'dashboard', label: 'Inicio',  icon: '🏠' },
  { id: 'tasks',     label: 'Tareas',  icon: '📋' },
  { id: 'family',    label: 'Familia', icon: '👥' },
  { id: 'ranking',   label: 'Ranking', icon: '🏆' },
];

export const AppNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loggedIn, setLoggedIn] = useState(false);

  const { currentUser, tasks } = useStore(s => ({
    currentUser: s.currentUser(),
    tasks: s.tasks,
  }));

  const myPendingCount = tasks.filter(t =>
    t.assignee === currentUser.id &&
    (t.status === 'pendiente' || t.status === 'vencida'),
  ).length;

  if (!loggedIn) {
    return <UserSelectorScreen onSelect={() => setLoggedIn(true)} />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardScreen navigation={{ navigate: () => {} }} />;
      case 'tasks':     return <TasksListScreen />;
      case 'family':    return <FamilyScreen />;
      case 'ranking':   return <RankingScreen />;
    }
  };

  return (
    <View style={styles.root}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <View style={[styles.currentAvatarWrap, { backgroundColor: currentUser.color + '30' }]}>
            <Text style={styles.currentAvatar}>{currentUser.avatar}</Text>
          </View>
          <View>
            <Text style={styles.topName}>{currentUser.name}</Text>
            <Text style={styles.topRole}>{currentUser.role === 'admin' ? '👑 Admin' : '👤 Miembro'}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setLoggedIn(false)} style={styles.switchBtn}>
          <Text style={styles.switchText}>🔄 Cambiar</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom tab bar */}
      <SafeAreaView edges={['bottom']} style={styles.tabBarSafe}>
        <View style={styles.tabBar}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            const badge = tab.id === 'tasks' && myPendingCount > 0 ? myPendingCount : null;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.75}
                style={styles.tabItem}
              >
                <View style={[styles.tabIconWrap, isActive && styles.tabIconActive]}>
                  <Text style={styles.tabIcon}>{tab.icon}</Text>
                  {badge && (
                    <View style={styles.tabBadge}>
                      <Text style={styles.tabBadgeText}>{badge > 9 ? '9+' : badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: Colors.bg },
  content: { flex: 1 },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.lg, paddingVertical: 10,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
  },
  topLeft:       { flexDirection: 'row', alignItems: 'center', gap: 10 },
  currentAvatarWrap: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  currentAvatar: { fontSize: 22 },
  topName:       { fontFamily: Fonts.extrabold, fontSize: 15, color: Colors.text },
  topRole:       { fontFamily: Fonts.semibold,  fontSize: 11, color: Colors.textMuted },
  switchBtn:     { backgroundColor: Colors.card, borderRadius: Radii.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 7 },
  switchText:    { fontFamily: Fonts.bold, fontSize: 13, color: Colors.textMuted },

  tabBarSafe: { backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border },
  tabBar: { flexDirection: 'row', paddingHorizontal: 8, paddingTop: 8, paddingBottom: 4 },
  tabItem: { flex: 1, alignItems: 'center', gap: 3 },
  tabIconWrap: { width: 44, height: 36, borderRadius: Radii.md, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  tabIconActive: { backgroundColor: Colors.accentGlow },
  tabIcon:  { fontSize: 20 },
  tabLabel: { fontFamily: Fonts.bold, fontSize: 10, color: Colors.textDim },
  tabLabelActive: { color: Colors.accentLight },
  tabBadge: {
    position: 'absolute', top: 2, right: 2,
    backgroundColor: Colors.red, borderRadius: 10,
    minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
  },
  tabBadgeText: { fontFamily: Fonts.black, fontSize: 9, color: Colors.white },
});

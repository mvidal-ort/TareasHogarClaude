// src/screens/UserSelectorScreen.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Radii, Spacing } from '../theme';
import { useStore } from '../context/store';

interface Props {
  onSelect: () => void;
}

export const UserSelectorScreen: React.FC<Props> = ({ onSelect }) => {
  const { users, setCurrentUser } = useStore(s => ({
    users: s.users,
    setCurrentUser: s.setCurrentUser,
  }));

  const handleSelect = (id: number) => {
    setCurrentUser(id);
    onSelect();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[Colors.bg, '#12101A']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoWrap}>
          <Text style={styles.logoIcon}>🏠</Text>
          <Text style={styles.logoText}>FamilyTasks</Text>
          <Text style={styles.logoSub}>¿Quién sos hoy?</Text>
        </View>

        <View style={styles.grid}>
          {users.map(user => (
            <TouchableOpacity
              key={user.id}
              onPress={() => handleSelect(user.id)}
              activeOpacity={0.8}
              style={styles.userBtn}
            >
              <View style={[styles.avatarRing, { borderColor: user.color }]}>
                <View style={[styles.avatarBubble, { backgroundColor: user.color + '30' }]}>
                  <Text style={styles.avatarEmoji}>{user.avatar}</Text>
                </View>
              </View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userRole}>
                {user.role === 'admin' ? '👑 Admin' : '👤 Miembro'}
              </Text>
              <View style={[styles.ptsChip, { backgroundColor: user.color + '20' }]}>
                <Text style={[styles.ptsText, { color: user.color }]}>⭐ {user.points}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footer}>FamilyTasks · Gestión del hogar en familia</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  content: { flexGrow: 1, alignItems: 'center', paddingVertical: 48, paddingHorizontal: Spacing.xl },

  logoWrap: { alignItems: 'center', marginBottom: 40, gap: 8 },
  logoIcon: { fontSize: 56 },
  logoText: { fontFamily: Fonts.monoBold, fontSize: 32, color: Colors.accentLight, letterSpacing: -1 },
  logoSub:  { fontFamily: Fonts.extrabold, fontSize: 18, color: Colors.textMuted },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, width: '100%', maxWidth: 400 },

  userBtn: {
    alignItems: 'center', gap: 8,
    width: '44%',
    backgroundColor: Colors.card, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.border,
    padding: 20, paddingTop: 24,
  },
  avatarRing: {
    width: 72, height: 72, borderRadius: 22, borderWidth: 2.5,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarBubble: {
    width: 62, height: 62, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 36 },
  userName:    { fontFamily: Fonts.extrabold, fontSize: 16, color: Colors.text },
  userRole:    { fontFamily: Fonts.semibold,  fontSize: 12, color: Colors.textMuted },
  ptsChip:     { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.full },
  ptsText:     { fontFamily: Fonts.bold, fontSize: 12 },

  footer: { marginTop: 48, fontFamily: Fonts.regular, fontSize: 12, color: Colors.textDim },
});

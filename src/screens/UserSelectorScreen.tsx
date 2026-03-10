// src/screens/UserSelectorScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Radii, Spacing } from '../theme';
import { useStore } from '../context/store';
import type { User } from '../data/models';

interface Props {
  onSelect: () => void;
}

export const UserSelectorScreen: React.FC<Props> = ({ onSelect }) => {
  const { users, setCurrentUser } = useStore(s => ({
    users: s.users,
    setCurrentUser: s.setCurrentUser,
  }));

  const [pinModal, setPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pinError, setPinError] = useState(false);

  const handleSelect = (user: User) => {
    if (user.role === 'admin' && user.pin) {
      setSelectedUser(user);
      setPinInput('');
      setPinError(false);
      setPinModal(true);
    } else {
      setCurrentUser(user.id);
      onSelect();
    }
  };

  const handlePinConfirm = () => {
    if (!selectedUser) return;
    if (pinInput === selectedUser.pin) {
      setCurrentUser(selectedUser.id);
      setPinModal(false);
      onSelect();
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={[Colors.bg, '#12101A']} style={StyleSheet.absoluteFill} />
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
              onPress={() => handleSelect(user)}
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
              {user.role === 'admin' && user.pin ? (
                <Text style={styles.pinIndicator}>🔐</Text>
              ) : null}
              <View style={[styles.ptsChip, { backgroundColor: user.color + '20' }]}>
                <Text style={[styles.ptsText, { color: user.color }]}>⭐ {user.points}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footer}>FamilyTasks · Gestión del hogar en familia</Text>
      </ScrollView>

      {/* PIN Modal */}
      <Modal visible={pinModal} transparent animationType="fade" onRequestClose={() => setPinModal(false)}>
        <View style={styles.pinOverlay}>
          <View style={styles.pinCard}>
            <Text style={styles.pinTitle}>🔐 Ingresá tu PIN</Text>
            <Text style={styles.pinSub}>Perfil: {selectedUser?.name}</Text>

            <TextInput
              style={[styles.pinInput, pinError && styles.pinInputError]}
              value={pinInput}
              onChangeText={v => { setPinInput(v.replace(/[^0-9]/g, '').slice(0, 6)); setPinError(false); }}
              placeholder="••••"
              placeholderTextColor={Colors.textDim}
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
              autoFocus
            />

            {pinError && (
              <Text style={styles.pinErrorText}>PIN incorrecto. Intentá de nuevo.</Text>
            )}

            <View style={styles.pinBtns}>
              <TouchableOpacity onPress={() => setPinModal(false)} style={[styles.pinBtn, styles.pinBtnCancel]}>
                <Text style={styles.pinBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePinConfirm} style={[styles.pinBtn, styles.pinBtnConfirm]}>
                <Text style={styles.pinBtnConfirmText}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  avatarRing:   { width: 72, height: 72, borderRadius: 22, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center' },
  avatarBubble: { width: 62, height: 62, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji:  { fontSize: 36 },
  userName:     { fontFamily: Fonts.extrabold, fontSize: 16, color: Colors.text },
  userRole:     { fontFamily: Fonts.semibold, fontSize: 12, color: Colors.textMuted },
  pinIndicator: { fontSize: 14 },
  ptsChip:      { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.full },
  ptsText:      { fontFamily: Fonts.bold, fontSize: 12 },
  footer:       { marginTop: 48, fontFamily: Fonts.regular, fontSize: 12, color: Colors.textDim },

  // PIN Modal
  pinOverlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  pinCard:     { backgroundColor: Colors.card, borderRadius: Radii.xl, borderWidth: 1, borderColor: Colors.border, padding: 28, width: '100%', maxWidth: 320, alignItems: 'center', gap: 12 },
  pinTitle:    { fontFamily: Fonts.black, fontSize: 20, color: Colors.text },
  pinSub:      { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.textMuted },
  pinInput:    { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radii.md, color: Colors.text, fontFamily: Fonts.monoBold, fontSize: 28, paddingHorizontal: 16, paddingVertical: 12, width: '100%', textAlign: 'center', letterSpacing: 8 },
  pinInputError: { borderColor: Colors.red },
  pinErrorText:  { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.red },
  pinBtns:       { flexDirection: 'row', gap: 10, width: '100%', marginTop: 4 },
  pinBtn:        { flex: 1, paddingVertical: 12, borderRadius: Radii.md, alignItems: 'center' },
  pinBtnCancel:  { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  pinBtnCancelText: { fontFamily: Fonts.bold, fontSize: 14, color: Colors.textMuted },
  pinBtnConfirm: { backgroundColor: Colors.accent },
  pinBtnConfirmText: { fontFamily: Fonts.bold, fontSize: 14, color: '#fff' },
});
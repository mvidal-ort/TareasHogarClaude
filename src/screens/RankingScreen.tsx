// src/screens/RankingScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radii, Spacing } from '../theme';
import { Card, ProgressBar, AvatarBubble, Btn } from '../components/UI';
import { useStore } from '../context/store';
import { RewardFormModal } from '../components/RewardFormModal';
import type { Reward } from '../data/models';

export const RankingScreen: React.FC = () => {
  const { users, tasks, rewards, currentUser, isAdmin, awardPoints, deleteReward, resetWeeklyRanking } = useStore(s => ({
    users: s.users,
    tasks: s.tasks,
    rewards: s.rewards,
    currentUser: s.currentUser(),
    isAdmin: s.isAdmin(),
    awardPoints: s.awardPoints,
    deleteReward: s.deleteReward,
    resetWeeklyRanking: s.resetWeeklyRanking,
  }));

  const [showForm, setShowForm] = useState(false);
  const [editReward, setEditReward] = useState<Reward | undefined>();

  const weeklyRanking = [...users].sort((a, b) => (b.weeklyPoints ?? 0) - (a.weeklyPoints ?? 0));

  const handleRedeem = (name: string, pts: number) => {
    if (currentUser.points < pts) {
      Alert.alert('Puntos insuficientes', `Necesitás ${pts - currentUser.points} puntos más.`);
      return;
    }
    Alert.alert('🎁 ¡Canjear recompensa!', `¿Querés canjear "${name}" por ${pts} puntos?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Canjear', onPress: () => {
        awardPoints(currentUser.id, -pts);
        Alert.alert('✅ ¡Canjeado!', `Disfrutá de "${name}". ¡Te lo ganaste!`);
      }},
    ]);
  };

  const handleDelete = (reward: Reward) => {
    Alert.alert('Eliminar recompensa', `¿Eliminar "${reward.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteReward(reward.id) },
    ]);
  };

  const handleResetWeekly = () => {
    Alert.alert(
      '🔄 Resetear ranking semanal',
      'Los puntos semanales de todos volverán a 0. Los puntos totales para canjear recompensas NO se modifican.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Resetear', style: 'destructive', onPress: () => resetWeeklyRanking() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>🏆</Text>
          <Text style={styles.heroTitle}>Ranking Semanal</Text>
          <Text style={styles.heroSub}>¡Completá tareas para ganar puntos esta semana!</Text>
        </View>

        {/* Reset button — solo admin */}
        {isAdmin && (
          <Btn
            label="🔄 Resetear ranking semanal"
            variant="ghost"
            onPress={handleResetWeekly}
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Podium */}
        {weeklyRanking.length >= 3 && (
          <View style={styles.podium}>
            <View style={[styles.podiumSlot, styles.podiumSilver]}>
              <AvatarBubble avatar={weeklyRanking[1].avatar} color={weeklyRanking[1].color} size={48} />
              <Text style={styles.podiumMedal}>🥈</Text>
              <Text style={styles.podiumName}>{weeklyRanking[1].name}</Text>
              <Text style={styles.podiumPts}>{weeklyRanking[1].weeklyPoints ?? 0}</Text>
            </View>
            <View style={[styles.podiumSlot, styles.podiumGold]}>
              <AvatarBubble avatar={weeklyRanking[0].avatar} color={weeklyRanking[0].color} size={60} />
              <Text style={styles.podiumMedal}>🥇</Text>
              <Text style={styles.podiumName}>{weeklyRanking[0].name}</Text>
              <Text style={styles.podiumPts}>{weeklyRanking[0].weeklyPoints ?? 0}</Text>
            </View>
            <View style={[styles.podiumSlot, styles.podiumBronze]}>
              <AvatarBubble avatar={weeklyRanking[2].avatar} color={weeklyRanking[2].color} size={44} />
              <Text style={styles.podiumMedal}>🥉</Text>
              <Text style={styles.podiumName}>{weeklyRanking[2].name}</Text>
              <Text style={styles.podiumPts}>{weeklyRanking[2].weeklyPoints ?? 0}</Text>
            </View>
          </View>
        )}

        {/* Full ranking */}
        <Text style={styles.sectionTitle}>Clasificación semanal</Text>
        {weeklyRanking.map((user, i) => {
          const userTasks = tasks.filter(t => t.assignee === user.id);
          const done = userTasks.filter(t => t.status === 'completada').length;
          const pct = userTasks.length ? (done / userTasks.length) * 100 : 0;
          const isCurrent = user.id === currentUser.id;
          return (
            <Card key={user.id} style={[styles.rankCard, isCurrent ? styles.rankCardActive : {}]}>
              <View style={styles.rankRow}>
                <Text style={styles.rankPos}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</Text>
                <AvatarBubble avatar={user.avatar} color={user.color} size={44} />
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.rankName}>{user.name}</Text>
                    {isCurrent && <View style={styles.youBadge}><Text style={styles.youText}>Tú</Text></View>}
                  </View>
                  <ProgressBar pct={pct} color={user.color} height={5} />
                  <Text style={styles.rankMeta}>{done} de {userTasks.length} tareas · {user.points} pts totales</Text>
                </View>
                <Text style={styles.rankPts}>{user.weeklyPoints ?? 0}</Text>
              </View>
            </Card>
          );
        })}

        {/* Rewards */}
        <View style={styles.rewardsHeader}>
          <Text style={styles.sectionTitle}>🎁 Recompensas</Text>
          {isAdmin && (
            <Btn label="+ Nueva" variant="primary" size="sm"
              onPress={() => { setEditReward(undefined); setShowForm(true); }} />
          )}
        </View>
        <Card>
          <Text style={styles.rewardBalance}>
            Tus puntos totales: <Text style={{ color: Colors.accentLight }}>{currentUser.points} ⭐</Text>
          </Text>
          <View style={styles.rewardList}>
            {rewards.map(r => {
              const canRedeem = currentUser.points >= r.points;
              return (
                <View key={r.id} style={styles.rewardRow}>
                  <Text style={styles.rewardIcon}>{r.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rewardName}>{r.name}</Text>
                    <Text style={styles.rewardCost}>🏷️ {r.points} pts</Text>
                  </View>
                  {isAdmin ? (
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <Btn icon="✏️" variant="ghost" size="sm"
                        onPress={() => { setEditReward(r); setShowForm(true); }} />
                      <Btn icon="🗑️" variant="danger" size="sm"
                        onPress={() => handleDelete(r)} />
                    </View>
                  ) : (
                    <Btn
                      label="Canjear"
                      variant={canRedeem ? 'primary' : 'ghost'}
                      size="sm"
                      disabled={!canRedeem}
                      onPress={() => handleRedeem(r.name, r.points)}
                    />
                  )}
                </View>
              );
            })}
            {rewards.length === 0 && (
              <Text style={{ color: Colors.textDim, fontFamily: Fonts.semibold, fontSize: 13 }}>
                No hay recompensas todavía.
              </Text>
            )}
          </View>
        </Card>

      </ScrollView>

      <RewardFormModal
        visible={showForm}
        reward={editReward}
        onClose={() => { setShowForm(false); setEditReward(undefined); }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.lg, paddingBottom: 40 },

  hero:      { alignItems: 'center', paddingVertical: 24, gap: 8 },
  heroIcon:  { fontSize: 56 },
  heroTitle: { fontFamily: Fonts.black, fontSize: 26, color: Colors.text },
  heroSub:   { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.textMuted, textAlign: 'center' },

  podium:       { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 8, marginBottom: 24 },
  podiumSlot:   { alignItems: 'center', gap: 6, padding: 12, borderRadius: Radii.lg, borderWidth: 1, flex: 1 },
  podiumGold:   { backgroundColor: 'rgba(255,215,0,0.08)',   borderColor: 'rgba(255,215,0,0.2)',   paddingBottom: 20 },
  podiumSilver: { backgroundColor: 'rgba(192,192,192,0.08)', borderColor: 'rgba(192,192,192,0.2)' },
  podiumBronze: { backgroundColor: 'rgba(205,127,50,0.08)',  borderColor: 'rgba(205,127,50,0.2)'  },
  podiumMedal:  { fontSize: 22 },
  podiumName:   { fontFamily: Fonts.extrabold, fontSize: 13, color: Colors.text },
  podiumPts:    { fontFamily: Fonts.monoBold,  fontSize: 14, color: Colors.accentLight },

  sectionTitle:  { fontFamily: Fonts.extrabold, fontSize: 16, color: Colors.text, marginBottom: 12 },
  rewardsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginBottom: 12 },

  rankCard:       { marginBottom: 10 },
  rankCardActive: { borderColor: Colors.accent },
  rankRow:        { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rankPos:        { fontSize: 22, width: 36 },
  rankName:       { fontFamily: Fonts.extrabold, fontSize: 15, color: Colors.text },
  youBadge:       { backgroundColor: Colors.accentGlow, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  youText:        { fontFamily: Fonts.bold, fontSize: 10, color: Colors.accentLight },
  rankMeta:       { fontFamily: Fonts.semibold, fontSize: 11, color: Colors.textDim },
  rankPts:        { fontFamily: Fonts.monoBold, fontSize: 20, color: Colors.accentLight, minWidth: 52, textAlign: 'right' },

  rewardBalance: { fontFamily: Fonts.bold, fontSize: 14, color: Colors.text, marginBottom: 14 },
  rewardList:    { gap: 12 },
  rewardRow:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rewardIcon:    { fontSize: 28 },
  rewardName:    { fontFamily: Fonts.bold, fontSize: 14, color: Colors.text },
  rewardCost:    { fontFamily: Fonts.semibold, fontSize: 12, color: Colors.textMuted },
});
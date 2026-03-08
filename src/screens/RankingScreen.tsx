// src/screens/RankingScreen.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radii, Spacing } from '../theme';
import { Card, ProgressBar, AvatarBubble, Btn } from '../components/UI';
import { useStore } from '../context/store';

export const RankingScreen: React.FC = () => {
  const { users, tasks, rewards, currentUser, awardPoints } = useStore(s => ({
    users: s.users,
    tasks: s.tasks,
    rewards: s.rewards,
    currentUser: s.currentUser(),
    awardPoints: s.awardPoints,
  }));

  const ranking = [...users].sort((a, b) => b.points - a.points);
  const top = ranking[0];

  const handleRedeem = (name: string, pts: number) => {
    if (currentUser.points < pts) {
      Alert.alert('Puntos insuficientes', `Necesitás ${pts - currentUser.points} puntos más para canjear esta recompensa.`);
      return;
    }
    Alert.alert(
      '🎁 ¡Canjear recompensa!',
      `¿Querés canjear "${name}" por ${pts} puntos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Canjear', onPress: () => {
            awardPoints(currentUser.id, -pts);
            Alert.alert('✅ ¡Canjeado!', `Disfrutá de "${name}". ¡Te lo ganaste!`);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>🏆</Text>
          <Text style={styles.heroTitle}>Ranking Familiar</Text>
          <Text style={styles.heroSub}>¡Completá tareas para ganar puntos y recompensas!</Text>
        </View>

        {/* Podium */}
        {ranking.length >= 3 && (
          <View style={styles.podium}>
            {/* 2nd */}
            <View style={[styles.podiumSlot, styles.podiumSilver]}>
              <AvatarBubble avatar={ranking[1].avatar} color={ranking[1].color} size={48} />
              <Text style={styles.podiumMedal}>🥈</Text>
              <Text style={styles.podiumName}>{ranking[1].name}</Text>
              <Text style={styles.podiumPts}>{ranking[1].points}</Text>
            </View>
            {/* 1st */}
            <View style={[styles.podiumSlot, styles.podiumGold]}>
              <AvatarBubble avatar={ranking[0].avatar} color={ranking[0].color} size={60} />
              <Text style={styles.podiumMedal}>🥇</Text>
              <Text style={styles.podiumName}>{ranking[0].name}</Text>
              <Text style={styles.podiumPts}>{ranking[0].points}</Text>
            </View>
            {/* 3rd */}
            <View style={[styles.podiumSlot, styles.podiumBronze]}>
              <AvatarBubble avatar={ranking[2].avatar} color={ranking[2].color} size={44} />
              <Text style={styles.podiumMedal}>🥉</Text>
              <Text style={styles.podiumName}>{ranking[2].name}</Text>
              <Text style={styles.podiumPts}>{ranking[2].points}</Text>
            </View>
          </View>
        )}

        {/* Full ranking */}
        <Text style={styles.sectionTitle}>Clasificación completa</Text>
        {ranking.map((user, i) => {
          const userTasks = tasks.filter(t => t.assignee === user.id);
          const done = userTasks.filter(t => t.status === 'completada').length;
          const pct = userTasks.length ? (done / userTasks.length) * 100 : 0;
          const isCurrent = user.id === currentUser.id;

          return (
            <Card key={user.id} style={[styles.rankCard, isCurrent && styles.rankCardActive]}>
              <View style={styles.rankRow}>
                <Text style={styles.rankPos}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </Text>
                <AvatarBubble avatar={user.avatar} color={user.color} size={44} />
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.rankName}>{user.name}</Text>
                    {isCurrent && <View style={styles.youBadge}><Text style={styles.youText}>Tú</Text></View>}
                  </View>
                  <ProgressBar pct={pct} color={user.color} height={5} />
                  <Text style={styles.rankMeta}>{done} de {userTasks.length} tareas completadas</Text>
                </View>
                <Text style={styles.rankPts}>{user.points}</Text>
              </View>
            </Card>
          );
        })}

        {/* Rewards */}
        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>🎁 Canje de recompensas</Text>
        <Card>
          <Text style={styles.rewardBalance}>
            Tus puntos: <Text style={{ color: Colors.accentLight }}>{currentUser.points} ⭐</Text>
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
                  <Btn
                    label="Canjear"
                    variant={canRedeem ? 'primary' : 'ghost'}
                    size="sm"
                    disabled={!canRedeem}
                    onPress={() => handleRedeem(r.name, r.points)}
                  />
                </View>
              );
            })}
          </View>
        </Card>

      </ScrollView>
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

  sectionTitle: { fontFamily: Fonts.extrabold, fontSize: 16, color: Colors.text, marginBottom: 12 },

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

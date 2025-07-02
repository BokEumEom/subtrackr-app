import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface StatsCardProps {
  subscriptions: any[];
}

export default function StatsCard({ subscriptions }: StatsCardProps) {
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'subscribed').length;
  const cancelledSubscriptions = subscriptions.filter(sub => sub.status === 'cancelled').length;

  return (
    <View style={styles.quickStats}>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{subscriptions.length}</Text>
        <Text style={styles.statLabel}>총 구독</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{activeSubscriptions}</Text>
        <Text style={styles.statLabel}>활성</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{cancelledSubscriptions}</Text>
        <Text style={styles.statLabel}>해지</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    color: '#191F28',
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 13,
    color: '#8B95A1',
    marginTop: 4,
    fontWeight: '500',
  },
}); 
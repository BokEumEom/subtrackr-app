import { formatCurrency } from '@/utils/calculations';
import React from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface SubscriptionStatsProps {
  activeCount: number;
  totalMonthlySpend: number;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export default function SubscriptionStats({
  activeCount,
  totalMonthlySpend,
  fadeAnim,
  slideAnim,
}: SubscriptionStatsProps) {
  return (
    <Animated.View style={[styles.statsContainer, { 
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }] 
    }]}>
      <View style={styles.headerStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{activeCount}</Text>
          <Text style={styles.statLabel}>구독 중</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatCurrency(totalMonthlySpend)}</Text>
          <Text style={styles.statLabel}>월 지출</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 18,
    color: '#191F28',
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 13,
    color: '#8B95A1',
    fontWeight: '500',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E8EB',
    marginHorizontal: 20,
  },
}); 
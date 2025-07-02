import { formatCurrency } from '@/utils/calculations';
import { Plus } from 'lucide-react-native';
import React from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface SubscriptionHeaderProps {
  title: string;
  subtitle: string;
  activeCount: number;
  totalMonthlySpend: number;
  onAddPress: () => void;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export default function SubscriptionHeader({
  title,
  subtitle,
  activeCount,
  totalMonthlySpend,
  onAddPress,
  fadeAnim,
  slideAnim,
}: SubscriptionHeaderProps) {
  return (
    <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={onAddPress}
          activeOpacity={0.8}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* 통계 섹션 */}
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: '#191F28',
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B95A1',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#0066FF',
    borderRadius: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
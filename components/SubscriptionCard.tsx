import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Subscription } from '@/types/subscription';
import { CATEGORIES, STATUS_COLORS } from '@/constants/categories';
import { formatCurrency } from '@/utils/calculations';
import { Calendar, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress?: () => void;
}

const SubscriptionCard = React.memo(({ subscription, onPress }: SubscriptionCardProps) => {
  const category = CATEGORIES.find(cat => cat.id === subscription.category);
  const statusColor = STATUS_COLORS[subscription.status];

  const formatInterval = (interval: string) => {
    switch (interval) {
      case 'weekly': return '/주';
      case 'monthly': return '/월';
      case 'yearly': return '/년';
      default: return '/월';
    }
  };

  const formatNextPayment = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '내일';
    if (diffDays < 7) return `${diffDays}일 후`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'subscribed': return '구독 중';
      case 'upcoming': return '예정';
      case 'cancelled': return '해지됨';
      default: return status;
    }
  };

  const IconComponent = category?.icon;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.serviceInfo}>
            <View style={[styles.iconContainer, { backgroundColor: category?.color + '15' }]}>
              {IconComponent && (
                <IconComponent 
                  size={24} 
                  color={category?.color}
                  strokeWidth={2}
                />
              )}
            </View>
            <View style={styles.details}>
              <Text style={styles.serviceName}>{subscription.name}</Text>
              <Text style={styles.category}>{category?.name}</Text>
            </View>
          </View>
          
          <View style={styles.rightSection}>
            <Text style={styles.cost}>
              {formatCurrency(subscription.cost, subscription.currency)}
            </Text>
            <Text style={styles.interval}>{formatInterval(subscription.interval)}</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            {subscription.status === 'subscribed' && (
              <View style={styles.nextPaymentContainer}>
                <Calendar size={14} color="#8B95A1" strokeWidth={2} />
                <Text style={styles.nextPayment}>
                  {formatNextPayment(subscription.nextPayment)} 결제
                </Text>
              </View>
            )}
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '10' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {getStatusText(subscription.status)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

SubscriptionCard.displayName = 'SubscriptionCard';

export default SubscriptionCard;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 6,
  },
  cardContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    color: '#191F28',
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  category: {
    fontSize: 14,
    color: '#8B95A1',
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  cost: {
    fontSize: 18,
    color: '#191F28',
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  interval: {
    fontSize: 12,
    color: '#8B95A1',
    fontWeight: '500',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F4',
  },
  footerLeft: {
    flex: 1,
  },
  nextPaymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextPayment: {
    fontSize: 14,
    color: '#8B95A1',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
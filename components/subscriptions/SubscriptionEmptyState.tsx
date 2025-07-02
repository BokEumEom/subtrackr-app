import { Search } from 'lucide-react-native';
import React from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface SubscriptionEmptyStateProps {
  hasSubscriptions: boolean;
  onAddPress: () => void;
  fadeAnim: Animated.Value;
}

export default function SubscriptionEmptyState({
  hasSubscriptions,
  onAddPress,
  fadeAnim,
}: SubscriptionEmptyStateProps) {
  const title = hasSubscriptions ? '검색 결과가 없어요' : '구독 서비스가 없어요';
  const description = hasSubscriptions
    ? '다른 검색어를 시도해보세요'
    : '구독 서비스를 추가하고\n지출을 관리해보세요';

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.icon}>
        <Search size={48} color="#8B95A1" strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {!hasSubscriptions && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onAddPress}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>구독 서비스 추가하기</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    color: '#191F28',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 16,
    color: '#8B95A1',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  actionButton: {
    backgroundColor: '#0066FF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  actionText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
}); 
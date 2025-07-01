import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  color: string;
  backgroundColor: string;
  onPress?: () => void;
  valueType?: 'currency' | 'count' | 'default';
}

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: IconComponent, 
  color, 
  backgroundColor,
  onPress,
  valueType = 'default'
}: StatCardProps) {
  const CardComponent = onPress ? TouchableOpacity : View;
  
  // 값 타입에 따른 스타일 결정
  const getValueStyle = () => {
    switch (valueType) {
      case 'currency':
        return styles.valueCurrency;
      case 'count':
        return styles.valueCount;
      default:
        return styles.value;
    }
  };
  
  return (
    <CardComponent 
      style={[styles.card, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.95 : 1}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <IconComponent size={22} color={color} strokeWidth={2} />
        </View>
      </View>
      <Text style={getValueStyle()}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  header: {
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.8,
  },
  valueCurrency: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  valueCount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
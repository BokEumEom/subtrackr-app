import { Subscription } from '@/types/subscription';
import { formatCurrency, getUpcomingPayments } from '@/utils/calculations';
import { Calendar, Clock, DollarSign, X } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PaymentScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  subscriptions: Subscription[];
}

export default function PaymentScheduleModal({ 
  visible, 
  onClose, 
  subscriptions 
}: PaymentScheduleModalProps) {
  const upcomingPayments = getUpcomingPayments(subscriptions);
  
  // 이번 주, 다음 주, 이번 달로 그룹화
  const now = new Date();
  const thisWeek = upcomingPayments.filter(payment => {
    const paymentDate = new Date(payment.nextPayment);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return paymentDate >= weekStart && paymentDate <= weekEnd;
  });

  const nextWeek = upcomingPayments.filter(payment => {
    const paymentDate = new Date(payment.nextPayment);
    const nextWeekStart = new Date(now);
    nextWeekStart.setDate(now.getDate() - now.getDay() + 7);
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
    return paymentDate >= nextWeekStart && paymentDate <= nextWeekEnd;
  });

  const thisMonth = upcomingPayments.filter(payment => {
    const paymentDate = new Date(payment.nextPayment);
    return paymentDate.getMonth() === now.getMonth() && 
           paymentDate.getFullYear() === now.getFullYear();
  });

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const renderPaymentGroup = (title: string, payments: Subscription[], icon: React.ReactNode) => {
    if (payments.length === 0) return null;

    const totalAmount = payments.reduce((sum, payment) => sum + payment.cost, 0);

    return (
      <View style={styles.paymentGroup}>
        <View style={styles.groupHeader}>
          <View style={styles.groupTitleContainer}>
            {icon}
            <Text style={styles.groupTitle}>{title}</Text>
          </View>
          <Text style={styles.groupTotal}>{formatCurrency(totalAmount)}</Text>
        </View>
        <View style={styles.paymentList}>
          {payments.map((payment, index) => (
            <View key={`${payment.id}-${index}`} style={styles.paymentItem}>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>{payment.name}</Text>
                <Text style={styles.paymentDate}>{formatDate(payment.nextPayment)}</Text>
              </View>
              <Text style={styles.paymentAmount}>{formatCurrency(payment.cost)}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>결제 일정</Text>
            <Text style={styles.subtitle}>다가오는 결제 내역을 확인하세요</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#8B95A1" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* 내용 */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {upcomingPayments.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Calendar size={48} color="#8B95A1" strokeWidth={1.5} />
              </View>
              <Text style={styles.emptyTitle}>다가오는 결제가 없어요</Text>
              <Text style={styles.emptyDescription}>
                현재 구독 중인 서비스의{'\n'}다음 결제일을 확인해보세요
              </Text>
            </View>
          ) : (
            <>
              {renderPaymentGroup(
                '이번 주',
                thisWeek,
                <Clock size={20} color="#F59E0B" strokeWidth={2} />
              )}
              {renderPaymentGroup(
                '다음 주',
                nextWeek,
                <Calendar size={20} color="#10B981" strokeWidth={2} />
              )}
              {renderPaymentGroup(
                '이번 달',
                thisMonth,
                <DollarSign size={20} color="#0066FF" strokeWidth={2} />
              )}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerContent: {
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
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    color: '#191F28',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#8B95A1',
    textAlign: 'center',
    lineHeight: 24,
  },
  paymentGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  groupTitle: {
    fontSize: 18,
    color: '#191F28',
    fontWeight: '700',
  },
  groupTotal: {
    fontSize: 18,
    color: '#0066FF',
    fontWeight: '700',
  },
  paymentList: {
    gap: 12,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    color: '#191F28',
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 14,
    color: '#8B95A1',
    fontWeight: '500',
  },
  paymentAmount: {
    fontSize: 16,
    color: '#191F28',
    fontWeight: '700',
  },
}); 
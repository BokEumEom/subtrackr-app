import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import PaymentScheduleModal from '@/components/PaymentScheduleModal';
import StatCard from '@/components/StatCard';
import SubscriptionCard from '@/components/SubscriptionCard';
import { useProfile } from '@/hooks/useProfile';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Subscription } from '@/types/subscription';
import {
  calculateMonthlyTotal,
  calculateYearlyTotal,
  formatCurrency,
  getUpcomingPayments,
} from '@/utils/calculations';
import { router } from 'expo-router';
import { ArrowRight, Bell, Calendar, Clock, CreditCard, DollarSign, ChartPie as PieChart, Plus, TrendingUp, User } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const PROFILE_STORAGE_KEY = 'subtrackr_profile';

export default function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentScheduleModal, setShowPaymentScheduleModal] = useState(false);

  // 공통 훅 사용
  const { profile, setProfile, loading: profileLoading, reload: reloadProfile } = useProfile();
  const { subscriptions, loading: subscriptionsLoading, addSubscription } = useSubscriptions();

  // Animated.Value를 useRef로 관리하여 재생성 방지
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (!subscriptionsLoading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [subscriptionsLoading, fadeAnim, slideAnim]);

  const handleAddSubscription = async (subscription: Subscription) => {
    await addSubscription(subscription);
  };

  // 프로필 아이콘 클릭 시 설정 화면으로 이동
  const handleProfilePress = () => {
    router.push('/(tabs)/settings');
  };

  // 결제 일정 버튼 클릭 시 모달 열기
  const handlePaymentSchedulePress = () => {
    setShowPaymentScheduleModal(true);
  };

  // 분석 버튼 클릭 시 분석 화면으로 이동
  const handleAnalyticsPress = () => {
    router.push('/(tabs)/analytics');
  };

  const monthlyTotal = calculateMonthlyTotal(subscriptions);
  const yearlyTotal = calculateYearlyTotal(subscriptions);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'subscribed');
  const upcomingPayments = getUpcomingPayments(subscriptions);

  if (subscriptionsLoading || profileLoading || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingSpinner, {
            transform: [{
              rotate: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              })
            }]
          }]} />
          <Text style={styles.loadingText}>잠시만요</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* 토스 스타일 헤더 */}
        <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>홈</Text>
              <Text style={styles.subtitle}>안녕하세요, {profile.name}님</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
                <Bell size={24} color="#191F28" strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={handleProfilePress}
                activeOpacity={0.8}
              >
                {profile.profileImage ? (
                  <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
                ) : (
                  <User size={24} color="#191F28" strokeWidth={1.5} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* 토스 스타일 메인 카드 */}
        <Animated.View style={[styles.mainCard, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.mainCardContent}>
            <Text style={styles.mainCardLabel}>이번 달 구독료</Text>
            <Text style={styles.mainCardAmount}>{formatCurrency(monthlyTotal)}</Text>
            <View style={styles.mainCardFooter}>
              <View style={styles.changeIndicator}>
                <TrendingUp size={16} color="#0066FF" strokeWidth={2} />
                <Text style={styles.changeText}>전월 대비 2.3% 증가</Text>
              </View>
              <Text style={styles.serviceCount}>{activeSubscriptions.length}개 서비스</Text>
            </View>
          </View>
        </Animated.View>

        {/* 토스 스타일 퀵 액션 */}
        <Animated.View style={[styles.quickActions, { transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.quickActionIcon}>
              <Plus size={24} color="#0066FF" strokeWidth={2} />
            </View>
            <Text style={styles.quickActionText}>구독 추가</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton} 
            onPress={handlePaymentSchedulePress}
            activeOpacity={0.8}
          >
            <View style={styles.quickActionIcon}>
              <Calendar size={24} color="#0066FF" strokeWidth={2} />
            </View>
            <Text style={styles.quickActionText}>결제 일정</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton} 
            onPress={handleAnalyticsPress}
            activeOpacity={0.8}
          >
            <View style={styles.quickActionIcon}>
              <PieChart size={24} color="#0066FF" strokeWidth={2} />
            </View>
            <Text style={styles.quickActionText}>분석</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* 토스 스타일 통계 카드들 */}
        <Animated.View style={[styles.statsSection, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.statsGrid}>
            <StatCard
              title="연간 예상"
              value={formatCurrency(yearlyTotal)}
              icon={DollarSign}
              color="#10B981"
              backgroundColor="#FFFFFF"
            />
            <StatCard
              title="이번 주 결제"
              value={`${upcomingPayments.length}건`}
              icon={Clock}
              color="#F59E0B"
              backgroundColor="#FFFFFF"
            />
          </View>
        </Animated.View>

        {/* 다가오는 결제 섹션 */}
        {upcomingPayments.length > 0 && (
          <Animated.View style={[styles.section, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>곧 결제될 구독</Text>
              <TouchableOpacity 
                style={styles.seeAllButton} 
                onPress={() => router.push('/(tabs)/subscriptions')}
                activeOpacity={0.8}
              >
                <Text style={styles.seeAllText}>전체보기</Text>
                <ArrowRight size={16} color="#8B95A1" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <View style={styles.cardList}>
              {upcomingPayments.slice(0, 3).map((subscription, index) => (
                <Animated.View
                  key={subscription.id}
                  style={{
                    opacity: fadeAnim,
                    transform: [{
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 30],
                        outputRange: [0, 30 + (index * 10)],
                      })
                    }]
                  }}
                >
                  <SubscriptionCard subscription={subscription} />
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* 최근 구독 서비스 */}
        {activeSubscriptions.length > 0 ? (
          <Animated.View style={[styles.section, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>구독 중인 서비스</Text>
              <TouchableOpacity 
                style={styles.seeAllButton} 
                onPress={() => router.push('/(tabs)/subscriptions')}
                activeOpacity={0.8}
              >
                <Text style={styles.seeAllText}>전체보기</Text>
                <ArrowRight size={16} color="#8B95A1" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <View style={styles.cardList}>
              {activeSubscriptions.slice(0, 3).map((subscription, index) => (
                <Animated.View
                  key={subscription.id}
                  style={{
                    opacity: fadeAnim,
                    transform: [{
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 30],
                        outputRange: [0, 30 + (index * 10)],
                      })
                    }]
                  }}
                >
                  <SubscriptionCard subscription={subscription} />
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        ) : (
          <Animated.View style={[styles.emptyState, { opacity: fadeAnim }]}>
            <View style={styles.emptyIcon}>
              <CreditCard size={48} color="#8B95A1" strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>아직 구독 서비스가 없어요</Text>
            <Text style={styles.emptyDescription}>
              구독 서비스를 추가하고{'\n'}지출을 관리해보세요
            </Text>
            <TouchableOpacity
              style={styles.emptyActionButton}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyActionText}>구독 서비스 추가하기</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>

      <AddSubscriptionModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSubscription}
      />

      <PaymentScheduleModal
        visible={showPaymentScheduleModal}
        onClose={() => setShowPaymentScheduleModal(false)}
        subscriptions={subscriptions}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingSpinner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#E5E7EB',
    borderTopColor: '#0066FF',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#4E5968',
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
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
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  mainCard: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  mainCardContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  mainCardLabel: {
    fontSize: 16,
    color: '#8B95A1',
    fontWeight: '500',
    marginBottom: 8,
  },
  mainCardAmount: {
    fontSize: 32,
    color: '#191F28',
    fontWeight: '700',
    letterSpacing: -0.8,
    marginBottom: 16,
  },
  mainCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changeText: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '600',
  },
  serviceCount: {
    fontSize: 14,
    color: '#8B95A1',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  quickActionButton: {
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
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#191F28',
    fontWeight: '600',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },

  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#191F28',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#8B95A1',
    fontWeight: '500',
  },
  cardList: {
    gap: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
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
    letterSpacing: -0.3,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#8B95A1',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyActionButton: {
    backgroundColor: '#0066FF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  emptyActionText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 32,
  },
});
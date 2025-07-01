import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import SubscriptionCard from '@/components/SubscriptionCard';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Subscription } from '@/types/subscription';
import { calculateMonthlyTotal, formatCurrency } from '@/utils/calculations';
import { Filter, Plus, Search, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

type FilterType = 'all' | 'subscribed' | 'upcoming' | 'cancelled';
type CategoryFilter = 'all' | string;
type SortType = 'name' | 'cost' | 'date' | 'category';

export default function Subscriptions() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [showFilters, setShowFilters] = useState(false);
  
  // 공통 훅 사용
  const { subscriptions, loading, addSubscription } = useSubscriptions();
  
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  useEffect(() => {
    if (!loading) {
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
  }, [loading]);

  const handleAddSubscription = async (subscription: Subscription) => {
    await addSubscription(subscription);
  };

  // 필터링 및 정렬 로직
  const filteredAndSortedSubscriptions = subscriptions
    .filter(sub => {
      const statusMatch = statusFilter === 'all' || sub.status === statusFilter;
      const categoryMatch = categoryFilter === 'all' || sub.category === categoryFilter;
      const searchMatch = searchQuery === '' || 
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'cost':
          return b.cost - a.cost;
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const statusFilters: { key: FilterType; label: string; count: number }[] = [
    {
      key: 'all',
      label: '전체',
      count: subscriptions.length,
    },
    {
      key: 'subscribed',
      label: '구독 중',
      count: subscriptions.filter(sub => sub.status === 'subscribed').length,
    },
    {
      key: 'upcoming',
      label: '예정',
      count: subscriptions.filter(sub => sub.status === 'upcoming').length,
    },
    {
      key: 'cancelled',
      label: '해지',
      count: subscriptions.filter(sub => sub.status === 'cancelled').length,
    },
  ];

  const totalMonthlySpend = calculateMonthlyTotal(subscriptions.filter(sub => sub.status === 'subscribed'));
  const activeCount = subscriptions.filter(sub => sub.status === 'subscribed').length;

  if (loading) {
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
      <Animated.ScrollView style={[styles.content, { opacity: fadeAnim }]}>
        {/* 토스 스타일 헤더 */}
        <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>구독 관리</Text>
              <Text style={styles.subtitle}>구독 서비스를 관리해보세요</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.8}
            >
              <Plus size={20} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* 통계 및 검색 컨테이너 */}
        <Animated.View style={[styles.statsSearchContainer, { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }] 
        }]}>
          {/* 통계 섹션 */}
          <View style={styles.statsSection}>
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
          </View>

          {/* 구분선 */}
          <View style={styles.sectionDivider} />

          {/* 검색 섹션 */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Search size={20} color="#8B95A1" strokeWidth={2} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="구독 서비스 검색"
                  placeholderTextColor="#8B95A1"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <X size={18} color="#8B95A1" strokeWidth={2} />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity 
                style={[styles.filterButton, showFilters && styles.filterButtonActive]}
                onPress={() => setShowFilters(!showFilters)}
                activeOpacity={0.8}
              >
                <Filter size={20} color={showFilters ? "#FFFFFF" : "#8B95A1"} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* 필터 섹션 */}
        {showFilters && (
          <Animated.View style={[styles.filtersSection, {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterRow}>
                {statusFilters.map((filter) => (
                  <TouchableOpacity
                    key={filter.key}
                    style={[
                      styles.filterChip,
                      statusFilter === filter.key && styles.filterChipActive,
                    ]}
                    onPress={() => setStatusFilter(filter.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.filterChipText,
                      statusFilter === filter.key && styles.filterChipTextActive,
                    ]}>
                      {filter.label} {filter.count}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        )}

        {/* 구독 목록 */}
        <ScrollView style={styles.subscriptionsList} showsVerticalScrollIndicator={false}>
          {filteredAndSortedSubscriptions.length > 0 ? (
            <>
              {filteredAndSortedSubscriptions.map((subscription, index) => (
                <Animated.View
                  key={subscription.id}
                  style={{
                    opacity: fadeAnim,
                    transform: [{
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20 + (index * 5), 0],
                      })
                    }]
                  }}
                >
                  <SubscriptionCard subscription={subscription} />
                </Animated.View>
              ))}
              <View style={styles.bottomPadding} />
            </>
          ) : (
            <Animated.View style={[styles.emptyState, { opacity: fadeAnim }]}>
              <View style={styles.emptyIcon}>
                <Search size={48} color="#8B95A1" strokeWidth={1.5} />
              </View>
              <Text style={styles.emptyTitle}>
                {subscriptions.length === 0 ? '구독 서비스가 없어요' : '검색 결과가 없어요'}
              </Text>
              <Text style={styles.emptyDescription}>
                {subscriptions.length === 0
                  ? '구독 서비스를 추가하고\n지출을 관리해보세요'
                  : '다른 검색어를 시도해보세요'}
              </Text>
              {subscriptions.length === 0 && (
                <TouchableOpacity
                  style={styles.emptyActionButton}
                  onPress={() => setShowAddModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.emptyActionText}>구독 서비스 추가하기</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          )}
        </ScrollView>
      </Animated.ScrollView>

      <AddSubscriptionModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSubscription}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
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
    paddingBottom: 20,
  },
  statsSearchContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#F1F3F4',
    marginHorizontal: 20,
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
  addButton: {
    backgroundColor: '#0066FF',
    borderRadius: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
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
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E8EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#191F28',
    marginLeft: 12,
    fontWeight: '500',
  },
  filterButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E8EB',
  },
  filterButtonActive: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  filtersSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E8EB',
  },
  filterChipActive: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  filterChipText: {
    fontSize: 14,
    color: '#8B95A1',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  subscriptionsList: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 16,
  },
  bottomPadding: {
    height: 32,
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
});
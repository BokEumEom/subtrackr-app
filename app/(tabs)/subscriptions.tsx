import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import TabHeader from '@/components/common/TabHeader';
import SubscriptionCard from '@/components/SubscriptionCard';
import SubscriptionEmptyState from '@/components/subscriptions/SubscriptionEmptyState';
import SubscriptionSearch from '@/components/subscriptions/SubscriptionSearch';
import SubscriptionStats from '@/components/subscriptions/SubscriptionStats';
import { ANIMATION_CONSTANTS, FLATLIST_CONSTANTS } from '@/constants/subscriptions';
import { useSubscriptions } from '@/contexts/SubscriptionContext';
import { usePageAnimation } from '@/hooks/usePageAnimation';
import { CategoryFilter, FilterType, SortType, useSubscriptionFilters } from '@/hooks/useSubscriptionFilters';
import { Subscription } from '@/types/subscription';
import { Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Subscriptions() {
  // 상태 관리
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [showFilters, setShowFilters] = useState(true);
  
  // 공통 훅 사용
  const { subscriptions, loading, addSubscription } = useSubscriptions();
  
  // 애니메이션 훅 사용
  const { fadeAnim, slideAnim } = usePageAnimation(!loading);

  // 애니메이션 초기값 설정 (로딩 완료 시 즉시 보이도록)
  useEffect(() => {
    if (!loading) {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
    }
  }, [loading, fadeAnim, slideAnim]);

  // 필터링 및 정렬 훅 사용
  const { filteredAndSortedSubscriptions, statusFilters, stats } = useSubscriptionFilters({
    subscriptions,
    statusFilter,
    categoryFilter,
    searchQuery,
    sortBy,
  });

  // 이벤트 핸들러
  const handleAddSubscription = async (subscription: Subscription) => {
    await addSubscription(subscription);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleStatusFilterChange = (filter: FilterType) => {
    setStatusFilter(filter);
  };

  // FlatList 헤더 컴포넌트
  const renderHeader = () => (
    <>
      {/* 공통 헤더 사용 */}
      <TabHeader
        title="구독 관리"
        subtitle="구독 서비스를 관리해보세요"
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
        rightContent={
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.8}
          >
            <Plus size={20} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        }
      />
      
      {/* 통계 정보 */}
      <SubscriptionStats
        activeCount={stats.activeCount}
        totalMonthlySpend={stats.totalMonthlySpend}
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
      />
      
      {/* 검색 및 필터 */}
      <SubscriptionSearch
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        showFilters={showFilters}
        onToggleFilters={handleToggleFilters}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        statusFilters={statusFilters}
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
      />
    </>
  );

  // FlatList 빈 상태 컴포넌트
  const renderEmptyComponent = () => (
    <SubscriptionEmptyState
      hasSubscriptions={subscriptions.length > 0}
      onAddPress={() => setShowAddModal(true)}
      fadeAnim={fadeAnim}
    />
  );

  // FlatList 아이템 렌더링
  const renderItem = ({ item, index }: { item: Subscription; index: number }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [
              ANIMATION_CONSTANTS.ITEM_ANIMATION_OFFSET + (index * ANIMATION_CONSTANTS.ITEM_ANIMATION_DELAY), 
              0
            ],
          })
        }]
      }}
    >
      <SubscriptionCard subscription={item} />
    </Animated.View>
  );

  // 로딩 상태
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
      <FlatList
        data={filteredAndSortedSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        getItemLayout={(data, index) => ({
          length: FLATLIST_CONSTANTS.ITEM_HEIGHT,
          offset: FLATLIST_CONSTANTS.ITEM_HEIGHT * index,
          index,
        })}
        initialNumToRender={FLATLIST_CONSTANTS.INITIAL_NUM_TO_RENDER}
        maxToRenderPerBatch={FLATLIST_CONSTANTS.MAX_TO_RENDER_PER_BATCH}
        windowSize={FLATLIST_CONSTANTS.WINDOW_SIZE}
        removeClippedSubviews={true}
      />

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
  flatListContent: {
    flexGrow: 1,
  },
  addButton: {
    backgroundColor: '#0066FF',
    borderRadius: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
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
});
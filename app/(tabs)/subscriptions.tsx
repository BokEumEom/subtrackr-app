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
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const ITEMS_PER_PAGE = 20;
  
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

  // 페이지네이션된 데이터 계산
  const paginatedSubscriptions = filteredAndSortedSubscriptions.slice(0, currentPage * ITEMS_PER_PAGE);

  // 더 많은 데이터가 있는지 확인
  useEffect(() => {
    setHasMoreData(paginatedSubscriptions.length < filteredAndSortedSubscriptions.length);
  }, [paginatedSubscriptions.length, filteredAndSortedSubscriptions.length]);

  // 추가 데이터 로딩
  const loadMoreData = () => {
    if (isLoadingMore || !hasMoreData) return;
    
    setIsLoadingMore(true);
    
    // 실제 API 호출을 시뮬레이션 (로컬 데이터이므로 지연만 추가)
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsLoadingMore(false);
    }, 500);
  };

  // 필터/검색 변경 시 페이지 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, categoryFilter, searchQuery, sortBy]);

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
            <Plus size={24} color="#0066FF" strokeWidth={2} />
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

  // FlatList 푸터 컴포넌트 (로딩 인디케이터)
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.loadingMoreContainer}>
        <Animated.View style={[styles.loadingMoreSpinner, {
          transform: [{
            rotate: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            })
          }]
        }]} />
        <Text style={styles.loadingMoreText}>더 많은 구독 서비스를 불러오는 중...</Text>
      </View>
    );
  };

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
        data={paginatedSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
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
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.1}
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
    backgroundColor: '#F0F6FF',
    borderRadius: 24,
    width: 48,
    height: 48,
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
  loadingMoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingMoreSpinner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#E5E7EB',
    borderTopColor: '#0066FF',
    marginBottom: 16,
  },
  loadingMoreText: {
    fontSize: 16,
    color: '#4E5968',
    fontWeight: '600',
  },
});
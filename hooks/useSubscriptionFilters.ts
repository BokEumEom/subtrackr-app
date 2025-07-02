import { Subscription } from '@/types/subscription';
import { useMemo } from 'react';

export type FilterType = 'all' | 'subscribed' | 'upcoming' | 'cancelled';
export type CategoryFilter = 'all' | string;
export type SortType = 'name' | 'cost' | 'date' | 'category';

interface UseSubscriptionFiltersProps {
  subscriptions: Subscription[];
  statusFilter: FilterType;
  categoryFilter: CategoryFilter;
  searchQuery: string;
  sortBy: SortType;
}

interface FilterOption {
  key: FilterType;
  label: string;
  count: number;
}

export function useSubscriptionFilters({
  subscriptions,
  statusFilter,
  categoryFilter,
  searchQuery,
  sortBy,
}: UseSubscriptionFiltersProps) {
  // 필터링된 구독 목록
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      const statusMatch = statusFilter === 'all' || sub.status === statusFilter;
      const categoryMatch = categoryFilter === 'all' || sub.category === categoryFilter;
      const searchMatch = searchQuery === '' || 
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return statusMatch && categoryMatch && searchMatch;
    });
  }, [subscriptions, statusFilter, categoryFilter, searchQuery]);

  // 정렬된 구독 목록
  const filteredAndSortedSubscriptions = useMemo(() => {
    return [...filteredSubscriptions].sort((a, b) => {
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
  }, [filteredSubscriptions, sortBy]);

  // 상태별 필터 옵션
  const statusFilters = useMemo((): FilterOption[] => {
    const statusCounts = subscriptions.reduce((acc, sub) => {
      acc[sub.status] = (acc[sub.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      {
        key: 'all',
        label: '전체',
        count: subscriptions.length,
      },
      {
        key: 'subscribed',
        label: '구독 중',
        count: statusCounts['subscribed'] || 0,
      },
      {
        key: 'upcoming',
        label: '예정',
        count: statusCounts['upcoming'] || 0,
      },
      {
        key: 'cancelled',
        label: '해지',
        count: statusCounts['cancelled'] || 0,
      },
    ];
  }, [subscriptions]);

  // 통계 데이터
  const stats = useMemo(() => {
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'subscribed');
    const totalMonthlySpend = activeSubscriptions.reduce((sum, sub) => sum + sub.cost, 0);
    
    return {
      activeCount: activeSubscriptions.length,
      totalMonthlySpend,
    };
  }, [subscriptions]);

  return {
    filteredAndSortedSubscriptions,
    statusFilters,
    stats,
  };
} 
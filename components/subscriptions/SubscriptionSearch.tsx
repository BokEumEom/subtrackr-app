import { FilterType } from '@/hooks/useSubscriptionFilters';
import { Filter, Search, X } from 'lucide-react-native';
import React from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface FilterOption {
  key: FilterType;
  label: string;
  count: number;
}

interface SubscriptionSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  statusFilter: FilterType;
  onStatusFilterChange: (filter: FilterType) => void;
  statusFilters: FilterOption[];
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export default function SubscriptionSearch({
  searchQuery,
  onSearchChange,
  onClearSearch,
  showFilters,
  onToggleFilters,
  statusFilter,
  onStatusFilterChange,
  statusFilters,
  fadeAnim,
  slideAnim,
}: SubscriptionSearchProps) {
  return (
    <Animated.View style={[styles.container, { 
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }] 
    }]}>
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
              onChangeText={onSearchChange}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={onClearSearch}>
                <X size={18} color="#8B95A1" strokeWidth={2} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
            style={[styles.filterButton, showFilters && styles.filterButtonActive]}
            onPress={onToggleFilters}
            activeOpacity={0.8}
          >
            <Filter size={20} color={showFilters ? "#FFFFFF" : "#8B95A1"} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

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
                  onPress={() => onStatusFilterChange(filter.key)}
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    borderTopWidth: 1,
    borderTopColor: '#F1F3F4',
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
}); 
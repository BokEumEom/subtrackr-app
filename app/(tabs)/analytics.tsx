import ChartSection from '@/components/analytics/ChartSection';
import { Subscription } from '@/types/subscription';
import {
  calculateCategorySpending,
  calculateMonthlyTotal,
  calculateYearlyTotal,
  formatCurrency,
} from '@/utils/calculations';
import { loadSubscriptions } from '@/utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowDownRight, ArrowUpRight, Calendar, DollarSign, Target, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';



type TimeRange = '1M' | '3M' | '6M' | '1Y';

export default function Analytics() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('1M');
  const [selectedChart, setSelectedChart] = useState<'bar' | 'trend'>('bar');
  
  // Animated.Value를 useRef로 관리하여 재생성 방지
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // 탭 포커스 시 애니메이션 실행
  useFocusEffect(
    React.useCallback(() => {
      if (!isLoading) {
        // 애니메이션 초기화
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
        
        // 애니메이션 실행
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
    }, [isLoading, fadeAnim, slideAnim])
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await loadSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error('구독 정보 로딩 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const monthlyTotal = calculateMonthlyTotal(subscriptions);
  const yearlyTotal = calculateYearlyTotal(subscriptions);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'subscribed');
  const categorySpending = calculateCategorySpending(subscriptions);



  const averageCost = activeSubscriptions.length > 0 
    ? monthlyTotal / activeSubscriptions.length 
    : 0;

  const timeRanges = [
    { key: '1M' as TimeRange, label: '1개월' },
    { key: '3M' as TimeRange, label: '3개월' },
    { key: '6M' as TimeRange, label: '6개월' },
    { key: '1Y' as TimeRange, label: '1년' },
  ];



  const keyMetrics = [
    {
      title: '월 지출',
      value: formatCurrency(monthlyTotal),
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: '#0066FF',
    },
    {
      title: '연간 예상',
      value: formatCurrency(yearlyTotal),
      change: '+8.2%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: '#00C896',
    },
    {
      title: '활성 서비스',
      value: activeSubscriptions.length.toString(),
      change: '+2',
      trend: 'up' as const,
      icon: Target,
      color: '#FF6B35',
    },
    {
      title: '평균 비용',
      value: formatCurrency(averageCost),
      change: '-3.1%',
      trend: 'down' as const,
      icon: Calendar,
      color: '#8B5CF6',
    },
  ];

  if (isLoading) {
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
          <Text style={styles.title}>분석</Text>
          <Text style={styles.subtitle}>구독 지출을 한눈에 확인해보세요</Text>
        </Animated.View>

        {/* 시간 범위 선택 */}
        <Animated.View style={[styles.timeRangeSection, { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }] 
        }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.timeRangeContainer}>
              {timeRanges.map((range) => (
                <TouchableOpacity
                  key={range.key}
                  style={[
                    styles.timeRangeButton,
                    selectedTimeRange === range.key && styles.timeRangeButtonActive,
                  ]}
                  onPress={() => setSelectedTimeRange(range.key)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.timeRangeText,
                      selectedTimeRange === range.key && styles.timeRangeTextActive,
                    ]}
                  >
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* 핵심 지표 */}
        <Animated.View style={[styles.metricsSection, { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }] 
        }]}>
          <View style={styles.metricsGrid}>
            {keyMetrics.map((metric, index) => (
              <Animated.View
                key={metric.title}
                style={[styles.metricCard, {
                  transform: [{
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 30],
                      outputRange: [0, 30 + (index * 5)],
                    })
                  }]
                }]}
              >
                <View style={styles.metricHeader}>
                  <View style={[styles.metricIcon, { backgroundColor: metric.color + '15' }]}>
                    <metric.icon size={20} color={metric.color} strokeWidth={2} />
                  </View>
                  <View style={[styles.trendBadge, { 
                    backgroundColor: metric.trend === 'up' ? '#00C89615' : '#FF6B3515' 
                  }]}>
                    {metric.trend === 'up' ? (
                      <ArrowUpRight size={12} color="#00C896" strokeWidth={2} />
                    ) : (
                      <ArrowDownRight size={12} color="#FF6B35" strokeWidth={2} />
                    )}
                    <Text style={[styles.trendText, { 
                      color: metric.trend === 'up' ? '#00C896' : '#FF6B35' 
                    }]}>
                      {metric.change}
                    </Text>
                  </View>
                </View>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricTitle}>{metric.title}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* 차트 섹션 */}
        {categorySpending.length > 0 && (
          <Animated.View style={{ 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }] 
          }}>
            <ChartSection
              selectedChart={selectedChart}
              onChartTypeChange={setSelectedChart}
              categorySpending={categorySpending}
              monthlyTotal={monthlyTotal}
            />
          </Animated.View>
        )}

        {/* 카테고리별 상세 */}
        {categorySpending.length > 0 && (
          <Animated.View style={[styles.categorySection, { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }] 
          }]}>
            <View style={styles.categoryHeader}>
              <Text style={styles.sectionTitle}>카테고리별 지출</Text>
            </View>
            <View style={styles.categoryList}>
              {categorySpending.map((item, index) => (
                <Animated.View
                  key={index}
                  style={[styles.categoryItem, {
                    transform: [{
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 30],
                        outputRange: [0, 30 + (index * 5)],
                      })
                    }]
                  }]}
                >
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryColorDot, { backgroundColor: item.color }]} />
                    <View style={styles.categoryDetails}>
                      <View style={styles.categoryItemHeader}>
                        <Text style={styles.categoryName}>{item.category}</Text>
                        <Text style={styles.categoryAmount}>{formatCurrency(item.amount)}</Text>
                      </View>
                      <View style={styles.categoryProgress}>
                        <View style={styles.progressBar}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { 
                                width: `${item.percentage}%`,
                                backgroundColor: item.color 
                              }
                            ]} 
                          />
                        </View>
                        <Text style={styles.categoryPercentage}>{item.percentage.toFixed(1)}%</Text>
                      </View>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
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
    paddingBottom: 20,
  },
  timeRangeSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  title: {
    fontSize: 24,
    color: '#191F28',
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B95A1',
    fontWeight: '500',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E8EB',
  },
  timeRangeButtonActive: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  timeRangeText: {
    fontSize: 14,
    color: '#8B95A1',
    fontWeight: '600',
  },
  timeRangeTextActive: {
    color: '#FFFFFF',
  },
  metricsSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 20,
    color: '#191F28',
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 14,
    color: '#8B95A1',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#191F28',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    color: '#191F28',
    fontWeight: '600',
  },
  categoryProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F1F3F4',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#8B95A1',
    fontWeight: '600',
    minWidth: 40,
  },
  categoryAmount: {
    fontSize: 14,
    color: '#191F28',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  bottomPadding: {
    height: 32,
  },
});
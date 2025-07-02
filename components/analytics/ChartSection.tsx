import { ChartLine as Activity, ChartColumnBig as BarChart3 } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

type ChartType = 'bar' | 'trend';

interface ChartSectionProps {
  selectedChart: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  categorySpending: Array<{
    category: string;
    amount: number;
    color: string;
    percentage: number;
  }>;
  monthlyTotal: number;
}

export default function ChartSection({
  selectedChart,
  onChartTypeChange,
  categorySpending,
  monthlyTotal,
}: ChartSectionProps) {
  // 가상의 트렌드 데이터
  const trendData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [
      {
        data: [monthlyTotal * 0.8, monthlyTotal * 0.9, monthlyTotal * 1.1, monthlyTotal * 0.95, monthlyTotal * 1.05, monthlyTotal],
        color: (opacity = 1) => `rgba(0, 102, 255, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };



  // Prepare data for bar chart
  const barChartData = {
    labels: categorySpending.slice(0, 5).map(item => 
      item.category.length > 6 ? item.category.substring(0, 6) + '..' : item.category
    ),
    datasets: [
      {
        data: categorySpending.slice(0, 5).map(item => item.amount),
        colors: categorySpending.slice(0, 5).map((item, index) => () => item.color),
      },
    ],
  };

  const chartTypes = [
    { key: 'bar' as const, label: '비교', icon: BarChart3 },
    { key: 'trend' as const, label: '트렌드', icon: Activity },
  ];

  return (
    <View style={styles.chartSection}>
      <View style={styles.chartHeader}>
        <Text style={styles.sectionTitle}>지출 분석</Text>
        <View style={styles.chartTypeSelector}>
          {chartTypes.map((type) => (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.chartTypeButton,
                selectedChart === type.key && styles.chartTypeButtonActive,
              ]}
              onPress={() => onChartTypeChange(type.key)}
              activeOpacity={0.8}
            >
              <type.icon 
                size={16} 
                color={selectedChart === type.key ? "#FFFFFF" : "#8B95A1"} 
                strokeWidth={2} 
              />
              <Text style={[
                styles.chartTypeText,
                selectedChart === type.key && styles.chartTypeTextActive,
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.chartContainer}>
        {selectedChart === 'bar' && (
          <BarChart
            data={barChartData}
            width={width - 40}
            height={240}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 102, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(139, 149, 161, ${opacity})`,
              style: { borderRadius: 16 },
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: '#F1F3F4',
                strokeWidth: 1,
              },
            }}
            style={styles.chart}
            withCustomBarColorFromData
            flatColor
            showBarTops={false}
            fromZero
          />
        )}

        {selectedChart === 'trend' && (
          <LineChart
            data={trendData}
            width={width - 40}
            height={240}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 102, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(139, 149, 161, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: {
                r: "6",
                strokeWidth: "3",
                stroke: "#0066FF"
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: '#F1F3F4',
                strokeWidth: 1,
              },
            }}
            bezier
            style={styles.chart}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartSection: {
    marginBottom: 32,
  },
  chartHeader: {
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
  chartTypeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  chartTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  chartTypeButtonActive: {
    backgroundColor: '#0066FF',
  },
  chartTypeText: {
    fontSize: 12,
    color: '#8B95A1',
    fontWeight: '600',
  },
  chartTypeTextActive: {
    color: '#FFFFFF',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  chart: {
    borderRadius: 16,
  },
}); 
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  selectedDate: Date;
}

export default function DatePickerModal({ 
  visible, 
  onClose, 
  onConfirm, 
  selectedDate 
}: DatePickerModalProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate);

  const months = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleConfirm = () => {
    onConfirm(currentDate);
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const selectDay = (day: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(day);
    setCurrentDate(newDate);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    const today = new Date();
    
    // 이전 달의 마지막 날들
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }
    
    // 현재 달의 날들
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = currentDate.getDate() === day && 
                        currentDate.getMonth() === month && 
                        currentDate.getFullYear() === year;
      const isToday = today.getDate() === day && 
                     today.getMonth() === month && 
                     today.getFullYear() === year;
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isSelected && styles.selectedDay,
            isToday && styles.today
          ]}
          onPress={() => selectDay(day)}
        >
          <Text style={[
            styles.dayText,
            isSelected && styles.selectedDayText,
            isToday && !isSelected && styles.todayText
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return days;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#8B95A1" strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.title}>결제일 선택</Text>
            <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>

          {/* 월 네비게이션 */}
          <View style={styles.monthNavigation}>
            <TouchableOpacity onPress={() => changeMonth('prev')} style={styles.navButton}>
              <ChevronLeft size={24} color="#8B95A1" strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.monthText}>
              {currentDate.getFullYear()}년 {months[currentDate.getMonth()]}
            </Text>
            <TouchableOpacity onPress={() => changeMonth('next')} style={styles.navButton}>
              <ChevronRight size={24} color="#8B95A1" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* 요일 헤더 */}
          <View style={styles.weekHeader}>
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <View key={day} style={styles.weekDay}>
                <Text style={[
                  styles.weekDayText,
                  index === 0 && styles.sundayText
                ]}>
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* 캘린더 */}
          <View style={styles.calendar}>
            {renderCalendar()}
          </View>

          {/* 선택된 날짜 표시 */}
          <View style={styles.selectedDateInfo}>
            <Text style={styles.selectedDateText}>
              선택된 결제일: {currentDate.getFullYear()}년 {months[currentDate.getMonth()]} {currentDate.getDate()}일
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxWidth: 350,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 18,
    color: '#191F28',
    fontWeight: '700',
  },
  confirmButton: {
    backgroundColor: '#0066FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  navButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  monthText: {
    fontSize: 18,
    color: '#191F28',
    fontWeight: '700',
  },
  weekHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 14,
    color: '#8B95A1',
    fontWeight: '600',
  },
  sundayText: {
    color: '#FF6B6B',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  calendarDay: {
    width: '14.28%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  dayText: {
    fontSize: 16,
    color: '#191F28',
    fontWeight: '500',
  },
  selectedDay: {
    backgroundColor: '#0066FF',
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  today: {
    borderWidth: 2,
    borderColor: '#0066FF',
    borderRadius: 20,
  },
  todayText: {
    color: '#0066FF',
    fontWeight: '700',
  },
  selectedDateInfo: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 16,
    color: '#191F28',
    fontWeight: '600',
  },
}); 
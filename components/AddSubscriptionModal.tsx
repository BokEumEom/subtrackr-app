import { CATEGORIES } from '@/constants/categories';
import { Subscription } from '@/types/subscription';
import { addSubscription } from '@/utils/storage';
import { Calendar, ChevronDown, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import DatePickerModal from './DatePickerModal';

interface AddSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (subscription: Subscription) => void;
}

export default function AddSubscriptionModal({ visible, onClose, onAdd }: AddSubscriptionModalProps) {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [currency, setCurrency] = useState('KRW');
  const [interval, setInterval] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [category, setCategory] = useState<string>('entertainment');
  const [description, setDescription] = useState('');
  const [nextPayment, setNextPayment] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Animated.Value를 useRef로 관리하여 재생성 방지
  const slideAnim = useRef(new Animated.Value(300)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, overlayAnim, slideAnim]);

  const resetForm = () => {
    setName('');
    setCost('');
    setCurrency('KRW');
    setInterval('monthly');
    setCategory('entertainment');
    setDescription('');
    setNextPayment(new Date());
  };

  const handleDateChange = (selectedDate: Date) => {
    setNextPayment(selectedDate);
    setShowDatePicker(false);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const handleAdd = async () => {
    if (!name.trim() || !cost.trim()) {
      Alert.alert('입력 확인', '서비스 이름과 비용을 입력해주세요');
      return;
    }

    const costNumber = parseFloat(cost);
    if (isNaN(costNumber) || costNumber <= 0) {
      Alert.alert('비용 확인', '올바른 금액을 입력해주세요');
      return;
    }

    const newSubscription: Subscription = {
      id: Date.now().toString(),
      name: name.trim(),
      cost: costNumber,
      currency,
      interval,
      category: category as any,
      status: 'subscribed',
      nextPayment: nextPayment,
      description: description.trim(),
      createdAt: new Date(),
    };

    try {
      await addSubscription(newSubscription);
      onAdd(newSubscription);
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert('오류', '구독 서비스 추가에 실패했습니다');
    }
  };

  return (
    <Modal visible={visible} animationType="none" transparent>
      <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
            {/* 토스 스타일 헤더 */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#8B95A1" strokeWidth={2} />
              </TouchableOpacity>
              <Text style={styles.title}>구독 서비스 추가</Text>
              <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
                <Text style={styles.addButtonText}>완료</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.form}>
                {/* 서비스 이름 */}
                <View style={styles.field}>
                  <Text style={styles.label}>서비스 이름</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                      placeholder="예: 넷플릭스, 스포티파이"
                      placeholderTextColor="#8B95A1"
                    />
                  </View>
                </View>

                {/* 비용과 통화 */}
                <View style={styles.row}>
                  <View style={[styles.field, { flex: 2 }]}>
                    <Text style={styles.label}>비용</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={cost}
                        onChangeText={setCost}
                        placeholder="0"
                        placeholderTextColor="#8B95A1"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  <View style={[styles.field, { flex: 1, marginLeft: 12 }]}>
                    <Text style={styles.label}>통화</Text>
                    <View style={styles.pickerContainer}>
                      <Text style={styles.pickerText}>{currency}</Text>
                      <ChevronDown size={16} color="#8B95A1" strokeWidth={2} />
                    </View>
                  </View>
                </View>

                {/* 결제 주기 */}
                <View style={styles.field}>
                  <Text style={styles.label}>결제 주기</Text>
                  <View style={styles.segmentedControl}>
                    {(['weekly', 'monthly', 'yearly'] as const).map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.segmentedOption,
                          interval === option && styles.segmentedOptionActive,
                        ]}
                        onPress={() => setInterval(option)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.segmentedText,
                            interval === option && styles.segmentedTextActive,
                          ]}
                        >
                          {option === 'weekly' ? '주간' : option === 'monthly' ? '월간' : '연간'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* 카테고리 */}
                <View style={styles.field}>
                  <Text style={styles.label}>카테고리</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.categoryRow}>
                      {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                          key={cat.id}
                          style={[
                            styles.categoryOption,
                            { backgroundColor: cat.color + '10' },
                            category === cat.id && { 
                              backgroundColor: cat.color + '20',
                              borderColor: cat.color,
                              borderWidth: 2,
                            },
                          ]}
                          onPress={() => setCategory(cat.id)}
                          activeOpacity={0.8}
                        >
                          <cat.icon size={18} color={cat.color} strokeWidth={2} />
                          <Text style={[styles.categoryText, { color: cat.color }]}>{cat.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                {/* 메모 */}
                <View style={styles.field}>
                  <Text style={styles.label}>메모 (선택사항)</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={description}
                      onChangeText={setDescription}
                      placeholder="이 구독 서비스에 대한 메모를 추가하세요"
                      placeholderTextColor="#8B95A1"
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>

                {/* 결제일 */}
                <View style={styles.field}>
                  <Text style={styles.label}>결제일</Text>
                  <View style={styles.inputContainer}>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={showDatePickerModal}
                    >
                      <Text style={styles.datePickerText}>{formatDate(nextPayment)}</Text>
                      <Calendar size={20} color="#8B95A1" strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>

      {showDatePicker && (
        <DatePickerModal
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onConfirm={handleDateChange}
          selectedDate={nextPayment}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
    letterSpacing: -0.2,
  },
  addButton: {
    backgroundColor: '#0066FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#191F28',
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E8EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#191F28',
    fontWeight: '500',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E8EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    fontSize: 16,
    color: '#191F28',
    fontWeight: '500',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F1F3F4',
    borderRadius: 12,
    padding: 4,
  },
  segmentedOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentedOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentedText: {
    fontSize: 14,
    color: '#8B95A1',
    fontWeight: '600',
  },
  segmentedTextActive: {
    color: '#0066FF',
    fontWeight: '700',
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    gap: 12,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E8EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  datePickerText: {
    fontSize: 16,
    color: '#191F28',
    fontWeight: '500',
  },
});
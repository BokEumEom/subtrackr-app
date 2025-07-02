import { CATEGORIES } from '@/constants/categories';
import { Subscription } from '@/types/subscription';
import { addSubscription } from '@/utils/storage';
import { Calendar, ChevronDown, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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

  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>구독 서비스 추가</Text>
            <Text style={styles.subtitle}>새로운 구독 서비스를 등록하세요</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#8B95A1" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* 내용 */}
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
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
                  <TouchableOpacity
                    style={[
                      styles.segmentedOption,
                      interval === 'weekly' && styles.segmentedOptionActive,
                    ]}
                    onPress={() => setInterval('weekly')}
                  >
                    <Text
                      style={[
                        styles.segmentedText,
                        interval === 'weekly' && styles.segmentedTextActive,
                      ]}
                    >
                      주간
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.segmentedOption,
                      interval === 'monthly' && styles.segmentedOptionActive,
                    ]}
                    onPress={() => setInterval('monthly')}
                  >
                    <Text
                      style={[
                        styles.segmentedText,
                        interval === 'monthly' && styles.segmentedTextActive,
                      ]}
                    >
                      월간
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.segmentedOption,
                      interval === 'yearly' && styles.segmentedOptionActive,
                    ]}
                    onPress={() => setInterval('yearly')}
                  >
                    <Text
                      style={[
                        styles.segmentedText,
                        interval === 'yearly' && styles.segmentedTextActive,
                      ]}
                    >
                      연간
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 카테고리 */}
              <View style={styles.field}>
                <Text style={styles.label}>카테고리</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryContainer}
                >
                  {CATEGORIES.map((categoryInfo) => (
                    <TouchableOpacity
                      key={categoryInfo.id}
                      style={[
                        styles.categoryOption,
                        category === categoryInfo.id && {
                          backgroundColor: categoryInfo.color + '20',
                          borderColor: categoryInfo.color,
                        },
                      ]}
                      onPress={() => setCategory(categoryInfo.id)}
                    >
                      <View
                        style={[
                          styles.categoryIcon,
                          { backgroundColor: categoryInfo.color },
                        ]}
                      />
                      <Text
                        style={[
                          styles.categoryText,
                          category === categoryInfo.id && { color: categoryInfo.color },
                        ]}
                      >
                        {categoryInfo.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* 설명 */}
              <View style={styles.field}>
                <Text style={styles.label}>설명 (선택사항)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="구독 서비스에 대한 설명을 입력하세요"
                    placeholderTextColor="#8B95A1"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
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

          {/* 하단 버튼 */}
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>구독 서비스 추가</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>

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
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
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
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  form: {
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#191F28',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
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
    minHeight: 80,
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
  categoryContainer: {
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
  categoryIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B95A1',
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
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  addButton: {
    backgroundColor: '#0066FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
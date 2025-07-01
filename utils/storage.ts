import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subscription } from '@/types/subscription';

const STORAGE_KEY = 'subtrackr_subscriptions';
const STORAGE_TIMEOUT = 5000; // 5초 타임아웃

// 타임아웃이 있는 AsyncStorage 래퍼
const storageWithTimeout = async (operation: () => Promise<any>, timeoutMs: number = STORAGE_TIMEOUT) => {
  return Promise.race([
    operation(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Storage operation timeout')), timeoutMs)
    )
  ]);
};

export const saveSubscriptions = async (subscriptions: Subscription[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(subscriptions);
    await storageWithTimeout(() => AsyncStorage.setItem(STORAGE_KEY, jsonValue));
  } catch (error) {
    console.error('구독 정보 저장 오류:', error);
    throw error;
  }
};

export const loadSubscriptions = async (): Promise<Subscription[]> => {
  try {
    const jsonValue = await storageWithTimeout(() => AsyncStorage.getItem(STORAGE_KEY));
    if (jsonValue != null) {
      const subscriptions = JSON.parse(jsonValue);
      // Convert date strings back to Date objects
      return subscriptions.map((sub: any) => ({
        ...sub,
        nextPayment: new Date(sub.nextPayment),
        createdAt: new Date(sub.createdAt)
      }));
    }
    return [];
  } catch (error) {
    console.error('구독 정보 로딩 오류:', error);
    return [];
  }
};

export const addSubscription = async (subscription: Subscription): Promise<void> => {
  try {
    const subscriptions = await loadSubscriptions();
    subscriptions.push(subscription);
    await saveSubscriptions(subscriptions);
  } catch (error) {
    console.error('구독 서비스 추가 오류:', error);
    throw error;
  }
};

export const updateSubscription = async (updatedSubscription: Subscription): Promise<void> => {
  try {
    const subscriptions = await loadSubscriptions();
    const index = subscriptions.findIndex(sub => sub.id === updatedSubscription.id);
    if (index !== -1) {
      subscriptions[index] = updatedSubscription;
      await saveSubscriptions(subscriptions);
    }
  } catch (error) {
    console.error('구독 정보 업데이트 오류:', error);
    throw error;
  }
};

export const deleteSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    const subscriptions = await loadSubscriptions();
    const filteredSubscriptions = subscriptions.filter(sub => sub.id !== subscriptionId);
    await saveSubscriptions(filteredSubscriptions);
  } catch (error) {
    console.error('구독 서비스 삭제 오류:', error);
    throw error;
  }
};
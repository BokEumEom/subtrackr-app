import { Subscription } from '@/types/subscription';
import { loadSubscriptions, saveSubscriptions } from '@/utils/storage';
import { useEffect, useState } from 'react';

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // 초기 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await loadSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error('구독 데이터 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 구독 추가
  const addSubscription = async (subscription: Subscription) => {
    try {
      const newSubscriptions = [...subscriptions, subscription];
      await saveSubscriptions(newSubscriptions);
      setSubscriptions(newSubscriptions);
    } catch (error) {
      console.error('구독 추가 오류:', error);
    }
  };

  // 구독 업데이트
  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    try {
      const newSubscriptions = subscriptions.map(sub => 
        sub.id === id ? { ...sub, ...updates } : sub
      );
      await saveSubscriptions(newSubscriptions);
      setSubscriptions(newSubscriptions);
    } catch (error) {
      console.error('구독 업데이트 오류:', error);
    }
  };

  // 구독 삭제
  const deleteSubscription = async (id: string) => {
    try {
      const newSubscriptions = subscriptions.filter(sub => sub.id !== id);
      await saveSubscriptions(newSubscriptions);
      setSubscriptions(newSubscriptions);
    } catch (error) {
      console.error('구독 삭제 오류:', error);
    }
  };

  // 데이터 새로고침
  const reload = () => {
    loadData();
  };

  return {
    subscriptions,
    loading,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    reload,
  };
} 
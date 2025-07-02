import { Subscription } from '@/types/subscription';
import { loadSubscriptions, saveSubscriptions } from '@/utils/storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  loading: boolean;
  addSubscription: (subscription: Subscription) => Promise<void>;
  updateSubscription: (id: string, updates: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  reload: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
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
      
      // 테스트용 샘플 데이터 (데이터가 없을 때만 추가)
      if (data.length === 0) {
        const sampleData: Subscription[] = [
          {
            id: '1',
            name: 'Netflix',
            description: '스트리밍 서비스',
            cost: 17000,
            currency: 'KRW',
            interval: 'monthly',
            category: 'entertainment',
            status: 'subscribed',
            nextPayment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
            createdAt: new Date(),
          },
          {
            id: '2',
            name: 'Spotify',
            description: '음악 스트리밍',
            cost: 13900,
            currency: 'KRW',
            interval: 'monthly',
            category: 'entertainment',
            status: 'subscribed',
            nextPayment: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14일 후
            createdAt: new Date(),
          },
          {
            id: '3',
            name: 'Notion',
            description: '노트 앱',
            cost: 8000,
            currency: 'KRW',
            interval: 'monthly',
            category: 'productivity',
            status: 'subscribed',
            nextPayment: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21일 후
            createdAt: new Date(),
          },
        ];
        
        await saveSubscriptions(sampleData);
        setSubscriptions(sampleData);
      } else {
        setSubscriptions(data);
      }
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

  const value = {
    subscriptions,
    loading,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    reload,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
} 
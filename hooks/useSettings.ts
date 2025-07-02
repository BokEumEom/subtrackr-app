import { Subscription } from '@/types/subscription';
import { loadSubscriptions, saveSubscriptions } from '@/utils/storage';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useSettings() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [switchValues, setSwitchValues] = useState<Record<string, boolean>>({
    'push-notifications': true,
    'dark-mode': false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const subscriptionsData = await loadSubscriptions();
      setSubscriptions(subscriptionsData);
    } catch (error) {
      console.error('데이터 로딩 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchChange = (id: string, value: boolean) => {
    setSwitchValues(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleItemPress = (id: string) => {
    switch (id) {
      case 'export-data':
        handleExportData();
        break;
      case 'privacy-policy':
        Alert.alert('개인정보 처리방침', '개인정보 처리방침 내용이 여기에 표시됩니다.');
        break;
      case 'clear-data':
        handleClearData();
        break;
      case 'help':
        Alert.alert('도움말', '자주 묻는 질문이 여기에 표시됩니다.');
        break;
      case 'contact-support':
        handleContactSupport();
        break;
      case 'rate-app':
        handleRateApp();
        break;
      case 'app-info':
        Alert.alert('앱 정보', 'SubTrackr v1.0.0\n구독 관리 앱');
        break;
    }
  };

  const handleExportData = () => {
    Alert.alert(
      '데이터 내보내기',
      '구독 데이터를 CSV 파일로 내보냅니다.',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '내보내기', 
          onPress: () => {
            Alert.alert('완료', '데이터가 성공적으로 내보내졌습니다!');
          }
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      '모든 데이터 삭제',
      '모든 구독 정보가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: async () => {
            try {
              await saveSubscriptions([]);
              setSubscriptions([]);
              Alert.alert('완료', '모든 데이터가 삭제되었습니다.');
            } catch (error) {
              Alert.alert('오류', '데이터 삭제에 실패했습니다.');
            }
          }
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      '고객 지원',
      '도움이 필요하시면 support@subtrackr.app로 연락해주세요',
      [{ text: '확인' }]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      '앱 평가하기',
      '앱이 마음에 드시나요? 앱스토어에서 평가해주세요!',
      [
        { text: '나중에' },
        { text: '지금 평가하기', onPress: () => {} },
      ]
    );
  };

  return {
    subscriptions,
    isLoading,
    switchValues,
    handleSwitchChange,
    handleItemPress,
  };
} 
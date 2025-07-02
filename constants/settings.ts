import { Bell, Download, HelpCircle, Info, Mail, Moon, Shield, Star, Trash2 } from 'lucide-react-native';

export interface SettingItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  iconColor: string;
  iconBackground: string;
  type: 'switch' | 'navigation' | 'action';
  onPress?: () => void;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  isDestructive?: boolean;
  disabled?: boolean;
}

export interface SettingSection {
  id: string;
  title: string;
  items: SettingItem[];
}

export const SETTINGS_SECTIONS: SettingSection[] = [
  {
    id: 'notifications',
    title: '알림',
    items: [
      {
        id: 'push-notifications',
        title: '푸시 알림',
        subtitle: '결제 예정일 알림 받기',
        icon: Bell,
        iconColor: '#0066FF',
        iconBackground: '#0066FF15',
        type: 'switch',
        disabled: true,
      },
    ],
  },
  {
    id: 'app-settings',
    title: '앱 설정',
    items: [
      {
        id: 'dark-mode',
        title: '다크 모드',
        subtitle: '어두운 테마 사용',
        icon: Moon,
        iconColor: '#8B95A1',
        iconBackground: '#8B95A115',
        type: 'switch',
        disabled: true,
      },
    ],
  },
  {
    id: 'data-management',
    title: '데이터 관리',
    items: [
      {
        id: 'export-data',
        title: '데이터 내보내기',
        subtitle: '구독 데이터 다운로드',
        icon: Download,
        iconColor: '#00C896',
        iconBackground: '#00C89615',
        type: 'action',
      },
      {
        id: 'privacy-policy',
        title: '개인정보 처리방침',
        subtitle: '개인정보 보호 정책',
        icon: Shield,
        iconColor: '#8B5CF6',
        iconBackground: '#8B5CF615',
        type: 'navigation',
      },
      {
        id: 'clear-data',
        title: '모든 데이터 삭제',
        subtitle: '모든 구독 정보 영구 삭제',
        icon: Trash2,
        iconColor: '#FF6B35',
        iconBackground: '#FF6B3515',
        type: 'action',
        isDestructive: true,
      },
    ],
  },
  {
    id: 'support',
    title: '지원',
    items: [
      {
        id: 'help',
        title: '도움말',
        subtitle: '자주 묻는 질문',
        icon: HelpCircle,
        iconColor: '#F59E0B',
        iconBackground: '#F59E0B15',
        type: 'navigation',
      },
      {
        id: 'contact-support',
        title: '고객 지원',
        subtitle: '문의하기',
        icon: Mail,
        iconColor: '#8B5CF6',
        iconBackground: '#8B5CF615',
        type: 'action',
      },
      {
        id: 'rate-app',
        title: '앱 평가하기',
        subtitle: '피드백 공유하기',
        icon: Star,
        iconColor: '#F59E0B',
        iconBackground: '#F59E0B15',
        type: 'action',
      },
    ],
  },
  {
    id: 'info',
    title: '정보',
    items: [
      {
        id: 'app-info',
        title: '앱 정보',
        subtitle: '버전 1.0.0',
        icon: Info,
        iconColor: '#8B95A1',
        iconBackground: '#8B95A115',
        type: 'navigation',
      },
    ],
  },
]; 
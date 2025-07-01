import { CategoryInfo } from '@/types/subscription';
import { CirclePlay as PlayCircle, Briefcase, GraduationCap, Heart, Building, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'entertainment',
    name: '엔터테인먼트',
    icon: PlayCircle,
    color: '#FF6B9D'
  },
  {
    id: 'productivity',
    name: '생산성',
    icon: Briefcase,
    color: '#4ECDC4'
  },
  {
    id: 'education',
    name: '교육',
    icon: GraduationCap,
    color: '#45B7D1'
  },
  {
    id: 'lifestyle',
    name: '라이프스타일',
    icon: Heart,
    color: '#96CEB4'
  },
  {
    id: 'business',
    name: '비즈니스',
    icon: Building,
    color: '#FCEA2B'
  },
  {
    id: 'other',
    name: '기타',
    icon: MoreHorizontal,
    color: '#DDA0DD'
  }
];

export const STATUS_COLORS = {
  subscribed: '#4CAF50',
  upcoming: '#FF9800',
  cancelled: '#9E9E9E'
};

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  CAD: 'C$',
  AUD: 'A$',
  KRW: '₩'
};
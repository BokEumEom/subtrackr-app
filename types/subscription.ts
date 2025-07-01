export interface Subscription {
  id: string;
  name: string;
  cost: number;
  currency: string;
  interval: 'weekly' | 'monthly' | 'yearly';
  category: 'entertainment' | 'productivity' | 'education' | 'lifestyle' | 'business' | 'other';
  status: 'subscribed' | 'upcoming' | 'cancelled';
  nextPayment: Date;
  description?: string;
  color?: string;
  createdAt: Date;
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: any;
  color: string;
}

export interface SpendingData {
  category: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  amount: number;
}
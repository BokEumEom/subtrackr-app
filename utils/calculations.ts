import { CATEGORIES } from '@/constants/categories';
import { SpendingData, Subscription } from '@/types/subscription';

export const calculateMonthlyTotal = (subscriptions: Subscription[]): number => {
  return subscriptions
    .filter(sub => sub.status === 'subscribed')
    .reduce((total, sub) => {
      let monthlyCost = sub.cost;
      if (sub.interval === 'yearly') {
        monthlyCost = sub.cost / 12;
      } else if (sub.interval === 'weekly') {
        monthlyCost = sub.cost * 4.33; // Average weeks per month
      }
      return total + monthlyCost;
    }, 0);
};

export const calculateYearlyTotal = (subscriptions: Subscription[]): number => {
  return calculateMonthlyTotal(subscriptions) * 12;
};

export const calculateCategorySpending = (subscriptions: Subscription[]): SpendingData[] => {
  const categoryTotals: { [key: string]: number } = {};
  const total = calculateMonthlyTotal(subscriptions);

  // Initialize categories
  CATEGORIES.forEach(cat => {
    categoryTotals[cat.id] = 0;
  });

  // Calculate totals by category
  subscriptions
    .filter(sub => sub.status === 'subscribed')
    .forEach(sub => {
      let monthlyCost = sub.cost;
      if (sub.interval === 'yearly') {
        monthlyCost = sub.cost / 12;
      } else if (sub.interval === 'weekly') {
        monthlyCost = sub.cost * 4.33;
      }
      categoryTotals[sub.category] += monthlyCost;
    });

  // Convert to SpendingData format
  return CATEGORIES
    .filter(cat => categoryTotals[cat.id] > 0)
    .map(cat => ({
      category: cat.name,
      amount: categoryTotals[cat.id],
      color: cat.color,
      percentage: total > 0 ? (categoryTotals[cat.id] / total) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const formatCurrency = (amount: number, currency: string = 'KRW'): string => {
  if (currency === 'KRW') {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

export const getUpcomingPayments = (subscriptions: Subscription[]): Subscription[] => {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return subscriptions
    .filter(sub => sub.status === 'subscribed' && sub.nextPayment <= nextWeek)
    .sort((a, b) => a.nextPayment.getTime() - b.nextPayment.getTime());
};

export const calculateNextPaymentDate = (interval: string): Date => {
  const now = new Date();
  switch (interval) {
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    case 'yearly':
      return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    default:
      return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }
};

export const calculateNextPaymentDateFromBase = (
  baseDate: Date, 
  interval: 'weekly' | 'monthly' | 'yearly'
): Date => {
  const now = new Date();
  let nextPayment = new Date(baseDate);
  
  if (nextPayment > now) {
    return nextPayment;
  }
  
  switch (interval) {
    case 'weekly':
      while (nextPayment <= now) {
        nextPayment.setDate(nextPayment.getDate() + 7);
      }
      break;
      
    case 'monthly':
      const monthlyBaseDay = baseDate.getDate();
      nextPayment = new Date(now.getFullYear(), now.getMonth(), monthlyBaseDay);
      
      if (nextPayment <= now) {
        nextPayment = new Date(now.getFullYear(), now.getMonth() + 1, monthlyBaseDay);
      }
      break;
      
    case 'yearly':
      const yearlyBaseMonth = baseDate.getMonth();
      const yearlyBaseDay = baseDate.getDate();
      nextPayment = new Date(now.getFullYear(), yearlyBaseMonth, yearlyBaseDay);
      
      if (nextPayment <= now) {
        nextPayment = new Date(now.getFullYear() + 1, yearlyBaseMonth, yearlyBaseDay);
      }
      break;
  }
  
  return nextPayment;
};

export const updateNextPaymentDate = (subscription: Subscription): Subscription => {
  const updatedNextPayment = calculateNextPaymentDateFromBase(
    subscription.nextPayment, 
    subscription.interval
  );
  
  return {
    ...subscription,
    nextPayment: updatedNextPayment
  };
};
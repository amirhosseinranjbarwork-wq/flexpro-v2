import { useMemo } from 'react';

export interface SubscriptionStatus {
  isActive: boolean;
  isExpired: boolean;
  daysRemaining: number;
  subscriptionEndDate: Date | null;
  canAccessTraining: boolean;
}

export function useSubscription(financialInfo?: {
  startDate?: string;
  duration?: number;
  subscription_end_date?: string;
  is_active?: boolean;
}): SubscriptionStatus {
  return useMemo(() => {
    // اگر اطلاعات مالی وجود ندارد، دسترسی کامل بده
    if (!financialInfo) {
      return {
        isActive: true,
        isExpired: false,
        daysRemaining: Infinity,
        subscriptionEndDate: null,
        canAccessTraining: true,
      };
    }

    const now = new Date();

    // اگر subscription_end_date مستقیماً وجود دارد
    if (financialInfo.subscription_end_date) {
      const endDate = new Date(financialInfo.subscription_end_date);
      const isExpired = endDate < now;
      const daysRemaining = isExpired ? 0 : Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        isActive: !isExpired,
        isExpired,
        daysRemaining,
        subscriptionEndDate: endDate,
        canAccessTraining: !isExpired,
      };
    }

    // اگر startDate و duration وجود دارد، تاریخ پایان را محاسبه کن
    if (financialInfo.startDate && financialInfo.duration) {
      const startDate = new Date(financialInfo.startDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + financialInfo.duration);

      const isExpired = endDate < now;
      const daysRemaining = isExpired ? 0 : Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        isActive: !isExpired,
        isExpired,
        daysRemaining,
        subscriptionEndDate: endDate,
        canAccessTraining: !isExpired,
      };
    }

    // اگر is_active مستقیماً مشخص شده
    if (financialInfo.is_active !== undefined) {
      return {
        isActive: financialInfo.is_active,
        isExpired: !financialInfo.is_active,
        daysRemaining: financialInfo.is_active ? Infinity : 0,
        subscriptionEndDate: null,
        canAccessTraining: financialInfo.is_active,
      };
    }

    // پیش‌فرض: دسترسی کامل
    return {
      isActive: true,
      isExpired: false,
      daysRemaining: Infinity,
      subscriptionEndDate: null,
      canAccessTraining: true,
    };
  }, [financialInfo]);
}






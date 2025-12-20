import React, { Suspense } from 'react';
import { X, Save, User as UserIcon, Activity, Heart, DollarSign } from 'lucide-react';
import { useUserForm } from '../hooks/useUserForm';
import { IdentityTab } from './tabs/IdentityTab';
import { AnthropometryTab } from './tabs/AnthropometryTab';
import { MedicalTab } from './tabs/MedicalTab';
import { FinancialTab } from './tabs/FinancialTab';
import type { User, UserInput } from '../types/index';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UserInput) => void;
  initialData?: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const form = useUserForm(initialData);

  if (!isOpen) return null;

  const tabs = [
    { id: 'identity', label: 'مشخصات هویتی', icon: <UserIcon size={16} /> },
    { id: 'anthropometry', label: 'اندازه‌گیری‌ها', icon: <Activity size={16} /> },
    { id: 'medical', label: 'وضعیت پزشکی', icon: <Heart size={16} /> },
    { id: 'financial', label: 'اطلاعات مالی', icon: <DollarSign size={16} /> }
  ];

  const renderTabContent = () => {
    switch (form.activeTab) {
      case 'identity':
        return <IdentityTab form={form} />;
      case 'anthropometry':
        return <AnthropometryTab form={form} />;
      case 'medical':
        return <MedicalTab form={form} />;
      case 'financial':
        return <FinancialTab form={form} />;
      default:
        return <IdentityTab form={form} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl border border-[var(--glass-border)] w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--glass-border)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {initialData ? 'ویرایش شاگرد' : 'افزودن شاگرد جدید'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--glass-bg)] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--glass-border)] overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => form.setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                form.activeTab === tab.id
                  ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <Suspense fallback={<div className="text-center py-8">در حال بارگذاری...</div>}>
            {renderTabContent()}
          </Suspense>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[var(--glass-border)]">
          <div className="text-sm text-[var(--text-secondary)]">
            {Object.keys(form.errors).length > 0 && (
              <span className="text-red-500">
                لطفاً خطاهای فرم را برطرف کنید
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] transition-colors"
            >
              انصراف
            </button>
            <button
              onClick={() => form.handleSubmit(onSave)}
              disabled={form.isSubmitting}
              className="flex items-center gap-2 px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-l from-[var(--accent-color)] to-[var(--accent-secondary)] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Save size={16} />
              {form.isSubmitting ? 'در حال ذخیره...' : 'ذخیره'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
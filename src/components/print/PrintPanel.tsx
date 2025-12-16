import React, { useState } from 'react';
import type { User } from '../../types';
import PrintPrograms from './PrintPrograms';
import PrintClientReport from './PrintClientReport';
import PrintProgress from './PrintProgress';

interface PrintPanelProps {
  user: User;
  onGeneratePrint: (type: string, data: any) => void;
}

type PrintTab = 'programs' | 'report' | 'progress';

const PrintPanel: React.FC<PrintPanelProps> = ({ user, onGeneratePrint }) => {
  const [activeTab, setActiveTab] = useState<PrintTab>('programs');

  const handlePrint = (type: string, data?: any) => {
    onGeneratePrint(type, { user, ...data });
  };

  const tabs = [
    {
      id: 'programs' as PrintTab,
      label: 'برنامه‌ها',
      icon: '🏋️',
      description: 'پرینت برنامه‌های تمرینی، غذایی و مکمل'
    },
    {
      id: 'report' as PrintTab,
      label: 'گزارش شاگرد',
      icon: '📊',
      description: 'پرینت اطلاعات کامل شاگرد'
    },
    {
      id: 'progress' as PrintTab,
      label: 'پیشرفت',
      icon: '📈',
      description: 'پرینت گزارش پیشرفت و شاخص‌ها'
    }
  ];

  return (
    <div className="space-y-6">
      {/* تب‌ها */}
      <div className="flex flex-wrap gap-2 p-1 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--glass-border)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-0 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-[var(--accent-color)] text-white shadow-lg transform scale-105'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs">{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* توضیح تب فعال */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--glass-border)]">
          <span className="text-2xl">{tabs.find(t => t.id === activeTab)?.icon}</span>
          <div className="text-right">
            <div className="font-semibold text-[var(--text-primary)]">
              {tabs.find(t => t.id === activeTab)?.label}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">
              {tabs.find(t => t.id === activeTab)?.description}
            </div>
          </div>
        </div>
      </div>

      {/* محتوای تب‌ها */}
      <div className="min-h-[400px]">
        {activeTab === 'programs' && (
          <PrintPrograms
            user={user}
            onPrint={(type) => handlePrint('program', { programType: type })}
          />
        )}

        {activeTab === 'report' && (
          <PrintClientReport
            user={user}
            onPrint={() => handlePrint('client-report')}
          />
        )}

        {activeTab === 'progress' && (
          <PrintProgress
            user={user}
            onPrint={() => handlePrint('progress')}
          />
        )}
      </div>
    </div>
  );
};

export default PrintPanel;

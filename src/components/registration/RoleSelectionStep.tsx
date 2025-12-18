import React from 'react';
import { Users, Award, Check } from 'lucide-react';

interface RoleSelectionStepProps {
  selectedRole: 'coach' | 'client' | null;
  onRoleSelect: (role: 'coach' | 'client') => void;
}

interface RoleOption {
  id: 'coach' | 'client';
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  color: string;
  hoverColor: string;
}

const RoleSelectionStep: React.FC<RoleSelectionStepProps> = ({
  selectedRole,
  onRoleSelect
}) => {
  const roles: RoleOption[] = [
    {
      id: 'coach',
      title: 'مربی',
      description: 'برای کسانی که می‌خواهند برنامه‌های تمرینی طراحی کنند و شاگردان را راهنمایی کنند',
      icon: <Award size={32} />,
      benefits: [
        'طراحی برنامه‌های تمرینی شخصی‌سازی شده',
        'مدیریت چندین شاگرد همزمان',
        'پیگیری پیشرفت شاگردان',
        'دسترسی به ابزارهای پیشرفته تحلیل'
      ],
      color: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
      hoverColor: 'hover:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30'
    },
    {
      id: 'client',
      title: 'شاگرد',
      description: 'برای کسانی که می‌خواهند از برنامه‌های تمرینی حرفه‌ای استفاده کنند',
      icon: <Users size={32} />,
      benefits: [
        'دسترسی به برنامه‌های تمرینی طراحی شده',
        'پیگیری پیشرفت شخصی',
        'ارتباط مستقیم با مربی',
        'آمار و تحلیل‌های شخصی'
      ],
      color: 'border-green-500 bg-green-50 dark:bg-green-900/20',
      hoverColor: 'hover:border-green-600 hover:bg-green-100 dark:hover:bg-green-900/30'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          چه نوع حسابی می‌خواهید ایجاد کنید؟
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          نقش خود را انتخاب کنید تا امکانات متناسب با نیاز شما نمایش داده شود
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;

          return (
            <div
              key={role.id}
              onClick={() => onRoleSelect(role.id)}
              className={`
                relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ease-in-out transform
                ${isSelected
                  ? `${role.color} scale-105 shadow-xl`
                  : `border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:scale-102 ${role.hoverColor} hover:shadow-lg`
                }
              `}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-secondary)] rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                  <Check size={16} className="text-white" />
                </div>
              )}

              {/* Icon */}
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto transition-colors duration-300
                ${isSelected
                  ? 'bg-white dark:bg-gray-700'
                  : 'bg-gray-100 dark:bg-gray-700'
                }
              `}>
                <div className={`
                  transition-colors duration-300
                  ${isSelected
                    ? role.id === 'coach' ? 'text-blue-600' : 'text-green-600'
                    : 'text-gray-600 dark:text-gray-300'
                  }
                `}>
                  {role.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className={`
                text-lg font-bold text-center mb-2 transition-colors duration-300
                ${isSelected
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-primary)]'
                }
              `}>
                {role.title}
              </h3>

              {/* Description */}
              <p className={`
                text-sm text-center mb-4 leading-relaxed transition-colors duration-300
                ${isSelected
                  ? 'text-[var(--text-secondary)]'
                  : 'text-[var(--text-secondary)]'
                }
              `}>
                {role.description}
              </p>

              {/* Benefits */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                  مزایا:
                </h4>
                <ul className="space-y-1">
                  {role.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className={`
                        text-xs flex items-center gap-2 transition-colors duration-300
                        ${isSelected
                          ? 'text-[var(--text-secondary)]'
                          : 'text-gray-600 dark:text-gray-400'
                        }
                      `}
                    >
                      <div className={`
                        w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-300
                        ${isSelected
                          ? role.id === 'coach' ? 'bg-blue-500' : 'bg-green-500'
                          : 'bg-gray-400'
                        }
                      `} />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hover Effect Overlay */}
              <div className={`
                absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none
                ${isSelected
                  ? 'opacity-10'
                  : 'opacity-0 hover:opacity-5'
                }
                ${role.id === 'coach' ? 'bg-blue-500' : 'bg-green-500'}
              `} />
            </div>
          );
        })}
      </div>

      {/* Helper Text */}
      <div className="text-center">
        <p className="text-xs text-[var(--text-secondary)]">
          می‌توانید بعداً نقش خود را تغییر دهید
        </p>
      </div>
    </div>
  );
};

export default RoleSelectionStep;
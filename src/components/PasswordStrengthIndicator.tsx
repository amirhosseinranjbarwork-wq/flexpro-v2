import React from 'react';
import { Check, X, AlertTriangle, Shield, ShieldCheck } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

interface StrengthConfig {
  level: StrengthLevel;
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  progress: number;
  checks: string[];
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const getPasswordStrength = (pwd: string): StrengthConfig => {
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    };

    const score = Object.values(checks).filter(Boolean).length;

    const configs: Record<StrengthLevel, StrengthConfig> = {
      weak: {
        level: 'weak',
        label: 'ضعیف',
        color: 'text-red-500',
        bgColor: 'bg-red-500',
        icon: <X size={16} />,
        progress: 25,
        checks: ['حداقل 8 کاراکتر', 'حروف بزرگ', 'حروف کوچک', 'اعداد', 'کاراکترهای ویژه'],
      },
      fair: {
        level: 'fair',
        label: 'متوسط',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500',
        icon: <AlertTriangle size={16} />,
        progress: 50,
        checks: ['حداقل 8 کاراکتر', 'حروف بزرگ', 'حروف کوچک', 'اعداد'],
      },
      good: {
        level: 'good',
        label: 'خوب',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500',
        icon: <Shield size={16} />,
        progress: 75,
        checks: ['حداقل 8 کاراکتر', 'حروف بزرگ', 'حروف کوچک', 'اعداد'],
      },
      strong: {
        level: 'strong',
        label: 'بسیار قوی',
        color: 'text-green-500',
        bgColor: 'bg-green-500',
        icon: <ShieldCheck size={16} />,
        progress: 100,
        checks: ['حداقل 8 کاراکتر', 'حروف بزرگ', 'حروف کوچک', 'اعداد', 'کاراکترهای ویژه'],
      },
    };

    if (pwd.length === 0) {
      return {
        level: 'weak',
        label: 'وارد کنید',
        color: 'text-gray-400',
        bgColor: 'bg-gray-400',
        icon: <X size={16} />,
        progress: 0,
        checks: ['حداقل 8 کاراکتر', 'حروف بزرگ', 'حروف کوچک', 'اعداد'],
      };
    }

    if (score <= 2) return configs.weak;
    if (score === 3) return configs.fair;
    if (score === 4) return configs.good;
    return configs.strong;
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-secondary)]">قدرت رمز عبور</span>
          <div className={`flex items-center gap-1 font-medium ${strength.color}`}>
            {strength.icon}
            <span>{strength.label}</span>
          </div>
        </div>

        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${strength.bgColor} transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${strength.progress}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
            <Check size={12} className={password.length >= 8 ? 'text-green-600' : 'text-gray-400'} />
            <span>حداقل 8 کاراکتر</span>
          </div>

          <div className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
            <Check size={12} className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'} />
            <span>حروف بزرگ</span>
          </div>

          <div className={`flex items-center gap-2 ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
            <Check size={12} className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'} />
            <span>حروف کوچک</span>
          </div>

          <div className={`flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
            <Check size={12} className={/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'} />
            <span>اعداد</span>
          </div>
        </div>

        {strength.level === 'strong' && (
          <div className="flex items-center gap-2 text-xs text-green-600 animate-pulse">
            <ShieldCheck size={12} />
            <span>رمز عبور شما بسیار امن است!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
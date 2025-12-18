import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import PasswordStrengthIndicator from '../PasswordStrengthIndicator';

interface PasswordSetupStepProps {
  password: string;
  onPasswordChange: (value: string) => void;
  error?: string;
}

const PasswordSetupStep: React.FC<PasswordSetupStepProps> = ({
  password,
  onPasswordChange,
  error
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrengthLevel = (pwd: string): 'weak' | 'fair' | 'good' | 'strong' => {
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    };

    const score = Object.values(checks).filter(Boolean).length;

    if (score <= 2) return 'weak';
    if (score === 3) return 'fair';
    if (score === 4) return 'good';
    return 'strong';
  };

  const strengthLevel = getPasswordStrengthLevel(password);
  const isValidPassword = strengthLevel !== 'weak' && password.length >= 8;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          رمز عبور خود را تنظیم کنید
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          یک رمز عبور قوی انتخاب کنید تا حساب شما امن باشد
        </p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
            رمز عبور
            <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={16} />
            </div>

            <input
              type={showPassword ? 'text' : 'password'}
              className={`
                input-glass pl-10 pr-24 transition-all duration-200
                ${error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : isValidPassword
                  ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                  : ''
                }
              `}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
            />

            {/* Show/Hide Password Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>

            {/* Strength Indicator Badge */}
            {password && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <div className={`
                  px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
                  ${strengthLevel === 'strong'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : strengthLevel === 'good'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : strengthLevel === 'fair'
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }
                `}>
                  <Shield size={10} />
                  {strengthLevel === 'strong' ? 'قوی' :
                   strengthLevel === 'good' ? 'خوب' :
                   strengthLevel === 'fair' ? 'متوسط' : 'ضعیف'}
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
              <AlertCircle size={12} />
              {error}
            </p>
          )}
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <PasswordStrengthIndicator password={password} />
        )}

        {/* Password Tips */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-amber-600 dark:text-amber-400 mt-0.5">
              <Shield size={16} />
            </div>
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <h4 className="font-semibold mb-2">نکات برای رمز عبور قوی:</h4>
              <ul className="space-y-1 text-xs">
                <li>• حداقل 8 کاراکتر داشته باشد</li>
                <li>• شامل حروف بزرگ و کوچک باشد</li>
                <li>• حداقل یک عدد داشته باشد</li>
                <li>• از کاراکترهای ویژه استفاده کنید (!@#$%)</li>
                <li>• از کلمات رایج یا اطلاعات شخصی خودداری کنید</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Reminder */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-green-600 dark:text-green-400 mt-0.5">
              <Lock size={16} />
            </div>
            <div className="text-sm text-green-800 dark:text-green-200">
              <p className="text-xs leading-relaxed">
                <strong>امنیت حساب شما برای ما مهم است.</strong> رمز عبور شما به صورت رمزنگاری شده ذخیره می‌شود و هیچ‌کس به جز خود شما به آن دسترسی ندارد.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordSetupStep;
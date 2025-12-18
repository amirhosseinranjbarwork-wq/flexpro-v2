import React from 'react';
import { User, AtSign, Mail, AlertCircle, CheckCircle } from 'lucide-react';

interface PersonalInfoStepProps {
  fullName: string;
  username: string;
  email: string;
  onFullNameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  errors?: {
    fullName?: string;
    username?: string;
    email?: string;
  };
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  helperText?: string;
  pattern?: string;
  title?: string;
  maxLength?: number;
  minLength?: number;
}

const Field: React.FC<FieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = 'text',
  required = false,
  error,
  success,
  helperText,
  pattern,
  title,
  maxLength,
  minLength
}) => {
  const hasError = !!error;
  const hasSuccess = success && !hasError;

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>

        <input
          type={type}
          className={`
            input-glass pl-10 pr-10 transition-all duration-200
            ${hasError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : hasSuccess
              ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
              : ''
            }
          `}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          pattern={pattern}
          title={title}
          maxLength={maxLength}
          minLength={minLength}
        />

        {/* Status Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {hasError && <AlertCircle size={16} className="text-red-500" />}
          {hasSuccess && <CheckCircle size={16} className="text-green-500" />}
        </div>
      </div>

      {/* Helper Text */}
      {helperText && !hasError && (
        <p className="text-[10px] text-[var(--text-secondary)] mt-1.5 opacity-70">
          {helperText}
        </p>
      )}

      {/* Error Message */}
      {hasError && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  fullName,
  username,
  email,
  onFullNameChange,
  onUsernameChange,
  onEmailChange,
  errors = {}
}) => {
  // Real-time validation for username
  const validateUsername = (value: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]*$/;
    return usernameRegex.test(value) && value.length >= 3 && value.length <= 20;
  };

  // Real-time validation for email
  const validateEmail = (value: string): boolean => {
    if (!value.trim()) return false; // Email is optional, but if provided, must be valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          اطلاعات شخصی خود را وارد کنید
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          این اطلاعات برای ایجاد پروفایل شما استفاده خواهد شد
        </p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        {/* Full Name Field */}
        <Field
          label="نام کامل"
          value={fullName}
          onChange={onFullNameChange}
          placeholder="نام و نام خانوادگی"
          icon={<User size={16} />}
          required
          error={errors.fullName}
          success={fullName.length >= 2 && fullName.length <= 100}
          helperText="نام و نام خانوادگی خود را وارد کنید"
          maxLength={100}
          minLength={2}
        />

        {/* Username Field */}
        <Field
          label="نام کاربری"
          value={username}
          onChange={(value) => {
            // Only allow valid characters
            const sanitized = value.replace(/[^a-zA-Z0-9_]/g, '');
            onUsernameChange(sanitized);
          }}
          placeholder="username"
          icon={<AtSign size={16} />}
          required
          error={errors.username}
          success={validateUsername(username)}
          helperText="3 تا 20 کاراکتر، فقط حروف انگلیسی، اعداد و _"
          pattern="[a-zA-Z0-9_]{3,20}"
          title="نام کاربری باید 3 تا 20 کاراکتر و فقط شامل حروف انگلیسی، اعداد و خط زیر باشد"
          maxLength={20}
          minLength={3}
        />

        {/* Email Field */}
        <Field
          label="ایمیل"
          value={email}
          onChange={onEmailChange}
          placeholder="example@email.com (اختیاری)"
          icon={<Mail size={16} />}
          type="email"
          error={errors.email}
          success={email.trim() === '' || validateEmail(email)}
          helperText="اختیاری - برای بازیابی رمز عبور و اطلاع‌رسانی‌ها"
        />
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 dark:text-blue-400 mt-0.5">
            <AlertCircle size={16} />
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <h4 className="font-semibold mb-1">نکات مهم:</h4>
            <ul className="space-y-1 text-xs">
              <li>• نام کاربری باید یکتا باشد</li>
              <li>• ایمیل اختیاری است اما توصیه می‌شود</li>
              <li>• این اطلاعات بعداً قابل تغییر هستند</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Loader2, User, KeyRound, ShieldCheck, UserPlus, Users, Mail, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

// Validation Schemas
const step1Schema = z.object({
  role: z.enum(['coach', 'client'], { errorMap: () => ({ message: 'لطفاً یک نقش را انتخاب کنید' }) }),
});

const step2Schema = z.object({
  fullName: z.string().min(2, 'نام کامل باید حداقل 2 کاراکتر باشد').max(100, 'نام کامل نمی‌تواند بیشتر از 100 کاراکتر باشد'),
  username: z.string().regex(/^[a-zA-Z0-9_]{3,20}$/, 'نام کاربری باید 3 تا 20 کاراکتر و فقط شامل حروف انگلیسی، اعداد و خط زیر باشد'),
  email: z.string().email('ایمیل وارد شده معتبر نیست').optional().or(z.literal('')),
});

const step3Schema = z.object({
  password: z.string().min(8, 'رمز عبور باید حداقل 8 کاراکتر باشد').max(128, 'رمز عبور نمی‌تواند بیشتر از 128 کاراکتر باشد')
    .regex(/[A-Z]/, 'رمز عبور باید شامل حداقل یک حرف بزرگ باشد')
    .regex(/[a-z]/, 'رمز عبور باید شامل حداقل یک حرف کوچک باشد')
    .regex(/[0-9]/, 'رمز عبور باید شامل حداقل یک عدد باشد'),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type FormData = Step1Data & Step2Data & Step3Data;

const RegisterPage: React.FC = () => {
  const { register, signOut, loading, user } = useAuth();
  const { toggleTheme, theme } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({
    role: 'coach',
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    return strength;
  };

  const validateStep = async (currentStep: number, data: Partial<FormData>) => {
    let schema;
    let dataToValidate;
    
    switch (currentStep) {
      case 1:
        schema = step1Schema;
        dataToValidate = { role: data.role };
        break;
      case 2:
        schema = step2Schema;
        dataToValidate = { fullName: data.fullName, username: data.username, email: data.email };
        break;
      case 3:
        schema = step3Schema;
        dataToValidate = { password: data.password };
        break;
      default:
        return true;
    }

    try {
      await schema.parseAsync(dataToValidate);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            fieldErrors[e.path[0] as string] = e.message;
          }
        });
        setErrors(fieldErrors);
        Object.values(fieldErrors).forEach(toast.error);
      }
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(step, formData);
    if (isValid) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        await handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role: 'coach' | 'client') => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async () => {
    try {
      // Final validation before submission
      const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);
      const validatedData = fullSchema.parse(formData);

      await register(validatedData);

      toast.success('ثبت‌نام موفق');
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        toast.error('لطفاً تمام فیلدها را به درستی پر کنید.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'خطای ناشناخته در ثبت‌نام';
        toast.error(errorMessage || 'خطا در ثبت‌نام');
      }
      if (import.meta.env.DEV) console.error('Registration error:', err);
    }
  };

  const steps = [
    { num: 1, title: "انتخاب نقش", icon: UserPlus },
    { num: 2, title: "اطلاعات کاربری", icon: User },
    { num: 3, title: "رمز عبور", icon: KeyRound }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] px-3 sm:px-4 py-4 sm:py-8 transition-colors">
      <div className="w-full max-w-md glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 relative animate-fade-in">
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute left-4 top-4 p-2 rounded-xl hover:bg-[var(--text-primary)]/10 transition text-[var(--text-secondary)] hover:text-[var(--accent-color)]"
          aria-label="تغییر تم"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="text-center space-y-2 pt-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">ساخت حساب جدید</h1>
          <p className="text-sm text-[var(--text-secondary)]">ثبت‌نام در FlexPro.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between items-center px-2">
          {steps.map((s, index) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    step > s.num ? 'bg-green-500/20 border-green-500' :
                    step === s.num ? 'bg-[var(--accent-color)]/20 border-[var(--accent-color)]' : 'bg-transparent border-[var(--glass-border)]'
                  }`}
                >
                  {step > s.num ? <ShieldCheck size={20} className="text-green-500"/> : <s.icon size={20} className={step === s.num ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)]'} />}
                </div>
                <p className={`text-xs mt-2 transition-colors ${step >= s.num ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{s.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded-full transition-colors ${step > s.num ? 'bg-green-500' : 'bg-[var(--glass-border)]'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => handleRoleSelect('coach')}
                  className={`glass-card p-6 text-center cursor-pointer transition-all duration-300 ${
                    formData.role === 'coach' ? 'border-[var(--accent-color)] scale-105 shadow-colored' : ''
                  }`}
                >
                  <Users size={40} className="mx-auto mb-3 text-[var(--accent-color)]" />
                  <h3 className="font-bold text-lg">مربی</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">برای مدیریت شاگردان و برنامه‌ها.</p>
                </div>
                <div
                  onClick={() => handleRoleSelect('client')}
                  className={`glass-card p-6 text-center cursor-pointer transition-all duration-300 ${
                    formData.role === 'client' ? 'border-[var(--accent-color)] scale-105 shadow-colored' : ''
                  }`}
                >
                  <User size={40} className="mx-auto mb-3 text-[var(--accent-secondary)]" />
                  <h3 className="font-bold text-lg">شاگرد</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">برای دریافت برنامه و پیگیری پیشرفت.</p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  name="fullName"
                  className="input-glass pl-12"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="نام و نام خانوادگی"
                  aria-invalid={!!errors.fullName}
                />
              </div>
              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  name="username"
                  className="input-glass pl-12"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="نام کاربری"
                  aria-invalid={!!errors.username}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                <input
                  type="email"
                  name="email"
                  className="input-glass pl-12"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ایمیل (اختیاری)"
                  aria-invalid={!!errors.email}
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="input-glass px-12"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="رمز عبور"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--accent-color)]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      getPasswordStrength(formData.password || '') > i
                        ? ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'][i]
                        : 'bg-[var(--glass-border)]'
                    }`}
                  ></div>
                ))}
              </div>
              <ul className="text-xs text-[var(--text-secondary)] space-y-1 mt-2">
                <li className={`transition-colors ${formData.password && formData.password.length >= 8 ? 'text-green-500' : ''}`}>حداقل 8 کاراکتر</li>
                <li className={`transition-colors ${formData.password && /[A-Z]/.test(formData.password) ? 'text-green-500' : ''}`}>حرف بزرگ</li>
                <li className={`transition-colors ${formData.password && /[a-z]/.test(formData.password) ? 'text-green-500' : ''}`}>حرف کوچک</li>
                <li className={`transition-colors ${formData.password && /[0-9]/.test(formData.password) ? 'text-green-500' : ''}`}>عدد</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="w-full btn-glass text-sm"
            >
              بازگشت
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="w-full btn-glass text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, var(--accent-color), var(--accent-secondary))` }}
            aria-label={loading ? 'در حال پردازش...' : step === 3 ? 'ثبت‌نام' : 'بعدی'}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>در حال پردازش...</span>
              </>
            ) : (
              step === 3 ? 'ثبت‌نام نهایی' : 'مرحله بعد'
            )}
          </button>
        </div>

        <div className="text-center text-xs text-[var(--text-secondary)]">
          حساب دارید؟ <Link to="/login" className="text-[var(--accent-color)] hover:text-[var(--accent-secondary)] font-semibold transition">ورود</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

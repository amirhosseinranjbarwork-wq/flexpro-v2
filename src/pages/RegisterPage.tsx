import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Loader2 } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const { register, signOut, loading, user } = useAuth();
  const { toggleTheme, theme } = useApp();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'coach' | 'client'>('coach');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const validateInputs = (): string | null => {
    // Validation نام کامل
    if (!fullName.trim() || fullName.trim().length < 2) {
      return 'نام کامل باید حداقل 2 کاراکتر باشد';
    }
    if (fullName.trim().length > 100) {
      return 'نام کامل نمی‌تواند بیشتر از 100 کاراکتر باشد';
    }
    
    // Validation نام کاربری
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return 'نام کاربری باید 3 تا 20 کاراکتر و فقط شامل حروف انگلیسی، اعداد و خط زیر باشد';
    }
    
    // Validation ایمیل (اگر وارد شده باشد)
    if (email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return 'ایمیل وارد شده معتبر نیست';
      }
    }
    
    // Validation رمز عبور
    if (password.length < 8) {
      return 'رمز عبور باید حداقل 8 کاراکتر باشد';
    }
    if (password.length > 128) {
      return 'رمز عبور نمی‌تواند بیشتر از 128 کاراکتر باشد';
    }
    // بررسی قدرت رمز عبور
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return 'رمز عبور باید شامل حروف بزرگ، کوچک و عدد باشد';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const validationError = validateInputs();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    
    try {
      await register({ email, password, fullName, role, username });
      toast.success('ثبت‌نام موفق');
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'خطای ناشناخته در ثبت‌نام';
      toast.error(errorMessage || 'خطا در ثبت‌نام');
      if (import.meta.env.DEV) console.error('Registration error:', err);
    }
  };

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
          <p className="text-sm text-[var(--text-secondary)]">ثبت‌نام مربی یا شاگرد در FlexPro.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block">نام کامل *</label>
            <input
              type="text"
              className="input-glass"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="نام و نام خانوادگی"
              aria-required="true"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block">نام کاربری *</label>
            <input
              type="text"
              className="input-glass"
              value={username}
              onChange={(e) => {
                const value = e.target.value.trim();
                // فقط حروف انگلیسی، اعداد و خط زیر
                if (value === '' || /^[a-zA-Z0-9_]*$/.test(value)) {
                  setUsername(value);
                }
              }}
              required
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_]{3,20}"
              title="نام کاربری باید 3 تا 20 کاراکتر و فقط شامل حروف انگلیسی، اعداد و خط زیر باشد"
              placeholder="username"
              aria-required="true"
            />
            <p className="text-[10px] text-[var(--text-secondary)] mt-1.5 opacity-70">3 تا 20 کاراکتر، فقط حروف انگلیسی، اعداد و _</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block">ایمیل (اختیاری)</label>
            <input
              type="email"
              className="input-glass"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com (اختیاری)"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block">رمز عبور *</label>
            <input
              type="password"
              className="input-glass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              maxLength={128}
              placeholder="••••••••"
              aria-required="true"
            />
            <p className="text-[10px] text-[var(--text-secondary)] mt-1.5 opacity-70">حداقل 8 کاراکتر، شامل حروف بزرگ، کوچک و عدد</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block">نقش *</label>
            <select
              className="input-glass"
              value={role}
              onChange={(e) => setRole(e.target.value as 'coach' | 'client')}
              aria-required="true"
            >
              <option value="coach">مربی</option>
              <option value="client">شاگرد</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-glass text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, var(--accent-color), var(--accent-secondary))` }}
            aria-label={loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>در حال ثبت‌نام...</span>
              </>
            ) : (
              'ثبت‌نام'
            )}
          </button>
        </form>
        <div className="text-center text-xs text-[var(--text-secondary)]">
          حساب دارید؟ <Link to="/login" className="text-[var(--accent-color)] hover:text-[var(--accent-secondary)] font-semibold transition">ورود</Link>
        </div>
        {user && (
          <div className="text-center mt-1">
            <button
              type="button"
              onClick={() => signOut().then(() => navigate('/login', { replace: true }))}
              className="text-xs text-red-400 hover:text-red-500 font-semibold transition"
            >
              خروج از حساب
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;


import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useRole } from '../hooks/useRole';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import LightRays from '../components/backgrounds/LightRays';

const LoginPage: React.FC = () => {
  const { signInWithPassword, signOut, loading, user } = useAuth();
  const { toggleTheme, theme } = useUI();
  const { role: userRole, loading: roleLoading } = useRole();
  const [activeTab, setActiveTab] = useState<'coach' | 'client'>('coach');
  const [coachId, setCoachId] = useState('');
  const [coachPass, setCoachPass] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientPass, setClientPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (roleLoading) return;
    if (user && userRole) {
      navigate('/dashboard', { replace: true });
      return;
    }
    if (user && !userRole) {
      toast.error('نقش کاربر شناسایی نشد. لطفا دوباره وارد شوید.');
      signOut();
    }
  }, [user, userRole, roleLoading, navigate, signOut]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const identifier = activeTab === 'coach' ? coachId : clientId;
    const password = activeTab === 'coach' ? coachPass : clientPass;

    // اعتبارسنجی اولیه
    if (!identifier.trim()) {
      setError('ایمیل یا نام کاربری الزامی است');
      return;
    }

    if (!password || password.length < 6) {
      setError('رمز عبور باید حداقل 6 کاراکتر باشد');
      return;
    }

    try {
      await signInWithPassword(identifier, password);
      
      // بررسی role بعد از لاگین موفق
      // این بررسی در useEffect انجام می‌شود
      toast.success('ورود موفق');
      
      // پاک کردن فیلد password برای امنیت
      if (activeTab === 'coach') {
        setCoachPass('');
      } else {
        setClientPass('');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در ورود';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // پاک کردن فیلد password بعد از خطا
      if (activeTab === 'coach') {
        setCoachPass('');
      } else {
        setClientPass('');
      }
    }
  };

  return (
    <>
      <LightRays speed="slow" intensity="normal" />
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8 transition-colors relative z-10">
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
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">ورود به پنل FlexPro</h1>
          <p className="text-sm text-[var(--text-secondary)]">ایمیل یا نام کاربری و رمز عبور را وارد کنید.</p>
        </div>
        <div className="flex gap-2 text-sm font-semibold" role="tablist" aria-label="نوع ورود">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'coach'}
            aria-controls="coach-login-panel"
            id="coach-tab"
            onClick={() => setActiveTab('coach')}
            className={`flex-1 rounded-xl px-4 py-3 border-2 transition-all duration-300 ${
              activeTab === 'coach'
                ? 'border-[var(--accent-color)] text-[var(--accent-color)] bg-[var(--accent-color)]/10 shadow-lg shadow-[var(--accent-color)]/20'
                : 'border-[var(--glass-border)] text-[var(--text-secondary)] bg-[var(--glass-bg)] hover:border-[var(--accent-color)]/50'
            }`}
          >
            ورود مربی
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'client'}
            aria-controls="client-login-panel"
            id="client-tab"
            onClick={() => setActiveTab('client')}
            className={`flex-1 rounded-xl px-4 py-3 border-2 transition-all duration-300 ${
              activeTab === 'client'
                ? 'border-[var(--accent-color)] text-[var(--accent-color)] bg-[var(--accent-color)]/10 shadow-lg shadow-[var(--accent-color)]/20'
                : 'border-[var(--glass-border)] text-[var(--text-secondary)] bg-[var(--glass-bg)] hover:border-[var(--accent-color)]/50'
            }`}
          >
            ورود شاگرد
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit} role="tabpanel" id={activeTab === 'coach' ? 'coach-login-panel' : 'client-login-panel'} aria-labelledby={activeTab === 'coach' ? 'coach-tab' : 'client-tab'}>
          <div>
            <label htmlFor="login-identifier" className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block">ایمیل یا نام کاربری</label>
            <input
              id="login-identifier"
              type="text"
              autoComplete="username"
              className="input-glass"
              value={activeTab === 'coach' ? coachId : clientId}
              onChange={(e) => {
                setError(null);
                activeTab === 'coach' ? setCoachId(e.target.value) : setClientId(e.target.value);
              }}
              required
              disabled={loading}
              aria-required="true"
              aria-label="ایمیل یا نام کاربری"
              placeholder="example@mail.com یا username"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block">رمز عبور</label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="input-glass pr-10"
                value={activeTab === 'coach' ? coachPass : clientPass}
                onChange={(e) => activeTab === 'coach' ? setCoachPass(e.target.value) : setClientPass(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                aria-required="true"
                aria-label="رمز عبور"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition"
                aria-label={showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
              />
              <span>مرا به خاطر بسپار</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-[var(--accent-color)] hover:text-[var(--accent-secondary)] font-semibold transition"
            >
              فراموشی رمز عبور؟
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-glass text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, var(--accent-color), var(--accent-secondary))` }}
            aria-label={loading ? 'در حال ورود...' : 'ورود به سیستم'}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>در حال ورود...</span>
              </>
            ) : (
              'ورود'
            )}
          </button>
        </form>
        <div className="text-center text-xs text-[var(--text-secondary)]">
          حساب ندارید؟ <Link to="/register" className="text-[var(--accent-color)] hover:text-[var(--accent-secondary)] font-semibold transition">ثبت‌نام</Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;


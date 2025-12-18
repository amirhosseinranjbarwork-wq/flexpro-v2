import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import RegistrationWizard from '../components/registration/RegistrationWizard';

const RegisterPage: React.FC = () => {
  const { signOut, user } = useAuth();
  const { toggleTheme, theme } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] px-3 sm:px-4 py-4 sm:py-8 transition-colors">
      <div className="w-full max-w-4xl glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 relative animate-fade-in">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute left-4 top-4 p-2 rounded-xl hover:bg-[var(--text-primary)]/10 transition text-[var(--text-secondary)] hover:text-[var(--accent-color)]"
          aria-label="تغییر تم"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            ساخت حساب جدید
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            ثبت‌نام مربی یا شاگرد در FlexPro - سریع و آسان
          </p>
        </div>

        {/* Registration Wizard */}
        <RegistrationWizard />

        {/* Footer Links */}
        <div className="text-center text-xs text-[var(--text-secondary)] space-y-2">
          <p>
            حساب دارید؟{' '}
            <Link
              to="/login"
              className="text-[var(--accent-color)] hover:text-[var(--accent-secondary)] font-semibold transition"
            >
              ورود به حساب
            </Link>
          </p>
          {user && (
            <div>
              <button
                type="button"
                onClick={() => signOut().then(() => navigate('/login', { replace: true }))}
                className="text-red-400 hover:text-red-500 font-semibold transition"
              >
                خروج از حساب فعلی
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;


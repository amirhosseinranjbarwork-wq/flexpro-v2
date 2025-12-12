import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithPassword, signUpWithPassword, loading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('ایمیل و رمز عبور الزامی است');
      return;
    }
    try {
      if (mode === 'signin') {
        await signInWithPassword(email, password);
        toast.success('ورود موفق');
      } else {
        await signUpWithPassword(email, password);
        toast.success('ثبت‌نام موفق، ایمیل را تأیید کنید');
      }
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'خطای ناشناخته در احراز هویت';
      toast.error(errorMessage || 'خطا در ورود/ثبت‌نام');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">
            {mode === 'signin' ? 'ورود' : 'ثبت‌نام'}
          </h3>
          <button onClick={onClose} className="text-sm text-[var(--text-secondary)]">✕</button>
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 btn-glass ${mode === 'signin' ? 'text-white' : 'bg-white/5 text-[var(--text-secondary)]'}`}
            style={mode === 'signin' ? { background: `linear-gradient(135deg, var(--accent-color), var(--accent-secondary))` } : {}}
          >
            ورود
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 btn-glass ${mode === 'signup' ? 'text-white' : 'bg-white/5 text-[var(--text-secondary)]'}`}
            style={mode === 'signup' ? { background: `linear-gradient(135deg, var(--accent-color), var(--accent-secondary))` } : {}}
          >
            ثبت‌نام
          </button>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-1">ایمیل</label>
            <input
              type="email"
              className="input-glass w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-1">رمز عبور</label>
            <input
              type="password"
              className="input-glass w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-glass text-white py-3 font-bold"
            style={{ background: `linear-gradient(135deg, var(--accent-color), var(--accent-secondary))` }}
          >
            {loading ? '...' : mode === 'signin' ? 'ورود' : 'ثبت‌نام'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;


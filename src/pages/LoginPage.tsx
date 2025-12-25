import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../hooks/useRole';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, AlertCircle, Loader2, Activity, 
  Mail, Lock, ArrowRight, Sparkles, CheckCircle2,
  Users, LayoutDashboard
} from 'lucide-react';

// Animated Background
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" 
           style={{ animation: 'pulse 4s ease-in-out infinite reverse' }} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
    </div>
  );
};

const LoginPage: React.FC = () => {
  const { signInWithPassword, signOut, loading, user } = useAuth();
  const { role: userRole, loading: roleLoading } = useRole();
  const [activeTab, setActiveTab] = useState<'coach' | 'client'>('coach');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    // Validation
    if (!email.trim()) {
      setError('ایمیل یا نام کاربری الزامی است');
      return;
    }

    if (!password || password.length < 6) {
      setError('رمز عبور باید حداقل 6 کاراکتر باشد');
      return;
    }

    try {
      await signInWithPassword(email, password);
      toast.success('ورود موفق!');
      setPassword('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در ورود';
      setError(errorMessage);
      toast.error(errorMessage);
      setPassword('');
    }
  };

  return (
    <>
      <AnimatedBackground />
      
      <div dir="rtl" className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding */}
          <div className="hidden lg:block space-y-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-75" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Activity className="w-9 h-9 text-white" />
                </div>
              </div>
              <span className="text-5xl font-black bg-gradient-to-l from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                فلکس‌پرو
              </span>
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl font-black text-white leading-tight">
                به پلتفرم برتر
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  مدیریت ورزش
                </span>
                <br />
                خوش آمدید
              </h2>
              
              <p className="text-xl text-slate-400 leading-relaxed">
                مدیریت حرفه‌ای بدنسازی، طراحی برنامه‌های تمرینی و پیگیری پیشرفت در یک پلتفرم یکپارچه
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Sparkles, text: 'طراحی برنامه در چند کلیک' },
                { icon: CheckCircle2, text: 'پیگیری دقیق پیشرفت' },
                { icon: CheckCircle2, text: 'پشتیبانی ۲۴ ساعته' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                { value: '5000+', label: 'برنامه تمرینی' },
                { value: '1200+', label: 'کاربر فعال' },
                { value: '95%', label: 'رضایت' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="relative">
            {/* Back to Home Link */}
            <Link
              to="/"
              className="absolute -top-12 right-0 flex items-center gap-2 text-slate-400 hover:text-white transition"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>بازگشت به صفحه اصلی</span>
            </Link>

            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/50 shadow-2xl overflow-hidden">
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-50" />
              
              <div className="relative p-8 md:p-10 space-y-8">
                {/* Mobile Logo */}
                <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Activity className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-3xl font-black bg-gradient-to-l from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    فلکس‌پرو
                  </span>
                </div>

                {/* Header */}
                <div className="text-center space-y-2">
                  <h1 className="text-3xl md:text-4xl font-black text-white">
                    ورود به حساب
                  </h1>
                  <p className="text-slate-400">
                    به عنوان مربی یا شاگرد وارد شوید
                  </p>
                </div>

                {/* Role Tabs */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('coach')}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === 'coach'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>مربی</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setActiveTab('client')}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === 'client'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span>شاگرد</span>
                  </button>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-300">
                      ایمیل یا نام کاربری
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        id="email"
                        type="text"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError(null);
                        }}
                        className="w-full pr-12 pl-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                        placeholder="example@mail.com"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-semibold text-slate-300">
                      رمز عبور
                    </label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError(null);
                        }}
                        className="w-full pr-12 pl-12 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                        placeholder="••••••••"
                        required
                        minLength={6}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 rounded-lg border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <span className="text-sm text-slate-400 group-hover:text-white transition">
                        مرا به خاطر بسپار
                      </span>
                    </label>
                    
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-400 hover:text-blue-300 transition font-semibold"
                    >
                      فراموشی رمز عبور؟
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition" />
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>در حال ورود...</span>
                        </>
                      ) : (
                        <>
                          <span>ورود به حساب</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Sign Up Link */}
                <div className="text-center pt-6 border-t border-slate-800">
                  <span className="text-slate-400">حساب ندارید؟ </span>
                  <Link
                    to="/register"
                    className="text-blue-400 hover:text-blue-300 font-semibold transition"
                  >
                    ثبت‌نام رایگان
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

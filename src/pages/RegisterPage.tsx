import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, ArrowRight, CheckCircle2, Shield, 
  Zap, Users, Sparkles, Star, Award
} from 'lucide-react';
import RegistrationWizard from '../components/registration/RegistrationWizard';

// Animated Background
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" 
           style={{ animation: 'pulse 4s ease-in-out infinite reverse' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px]" 
           style={{ animation: 'pulse 6s ease-in-out infinite' }} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
    </div>
  );
};

const RegisterPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const benefits = [
    {
      icon: Zap,
      title: 'راه‌اندازی سریع',
      description: 'ثبت‌نام در کمتر از ۳۰ ثانیه',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'امنیت کامل',
      description: 'حفاظت از اطلاعات شما',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'پشتیبانی ۲۴/۷',
      description: 'همیشه در کنار شما هستیم',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const features = [
    'طراحی برنامه‌های تمرینی هوشمند',
    'پیگیری دقیق پیشرفت',
    'مدیریت تغذیه تخصصی',
    'گزارش‌های پیشرفته',
    'دسترسی از همه جا',
    'پشتیبانی حرفه‌ای'
  ];

  return (
    <>
      <AnimatedBackground />
      
      <div dir="rtl" className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding & Benefits */}
          <div className="hidden lg:block space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-75" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Activity className="w-9 h-9 text-white" />
                </div>
              </div>
              <span className="text-5xl font-black bg-gradient-to-l from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                فلکس‌پرو
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-400 font-medium">ثبت‌نام رایگان</span>
              </div>

              <h2 className="text-5xl font-black text-white leading-tight">
                به جمع هزاران
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  ورزشکار موفق
                </span>
                <br />
                بپیوندید
              </h2>
              
              <p className="text-xl text-slate-400 leading-relaxed">
                شروع سفر موفقیت شما با فلکس‌پرو. بهترین پلتفرم برای مدیریت حرفه‌ای بدنسازی و ورزش
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid gap-6">
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="group relative p-6 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 rounded-2xl transition`} />
                  
                  <div className="relative flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Features List */}
            <div className="space-y-4 pt-8">
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span>شامل تمام امکانات:</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-400 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800">
              {[
                { icon: Users, value: '1200+', label: 'کاربر فعال' },
                { icon: Award, value: '95%', label: 'رضایت' },
                { icon: Star, value: '4.9', label: 'امتیاز' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="relative w-full">
            {/* Back to Home Link */}
            <Link
              to="/"
              className="absolute -top-12 right-0 flex items-center gap-2 text-slate-400 hover:text-white transition z-10"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>بازگشت به صفحه اصلی</span>
            </Link>

            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/50 shadow-2xl overflow-hidden">
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 opacity-50" />
              
              <div className="relative p-8 md:p-10 space-y-8">
                {/* Mobile Logo */}
                <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Activity className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-3xl font-black bg-gradient-to-l from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    فلکس‌پرو
                  </span>
                </div>

                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm mb-4">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-purple-400 font-medium">ثبت‌نام رایگان</span>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-black text-white">
                    ساخت حساب کاربری
                  </h1>
                  <p className="text-slate-400">
                    فقط چند قدم تا شروع
                  </p>
                </div>

                {/* Mobile Benefits - Show only on mobile */}
                <div className="lg:hidden grid gap-4 py-4">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-800/50">
                      <div className={`w-10 h-10 bg-gradient-to-br ${benefit.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <benefit.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white">{benefit.title}</div>
                        <div className="text-xs text-slate-400">{benefit.description}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Registration Wizard */}
                <div className="pt-4">
                  <RegistrationWizard />
                </div>

                {/* Sign In Link */}
                <div className="text-center pt-6 border-t border-slate-800">
                  <span className="text-slate-400">قبلاً ثبت‌نام کرده‌اید؟ </span>
                  <Link
                    to="/login"
                    className="text-purple-400 hover:text-purple-300 font-semibold transition"
                  >
                    ورود به حساب
                  </Link>
                </div>

                {/* Terms & Privacy */}
                <p className="text-center text-xs text-slate-500">
                  با ثبت‌نام، شما{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300 transition">شرایط استفاده</a>
                  {' '}و{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300 transition">سیاست حفظ حریم خصوصی</a>
                  {' '}را می‌پذیرید.
                </p>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-6 flex items-center justify-center gap-6 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>امنیت ۱۰۰٪</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>رایگان برای همیشه</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;

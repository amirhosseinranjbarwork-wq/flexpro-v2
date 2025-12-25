import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Zap, BarChart3, Shield, Users, Target, 
  Award, Star, Dumbbell, Heart, Trophy,
  ArrowRight, ChevronRight, Sparkles, CheckCircle2,
  Menu, X, Clock, Flame
} from 'lucide-react';

// Animated Background Component
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px] animate-pulse" 
           style={{ animation: 'float 8s ease-in-out infinite' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px]" 
           style={{ animation: 'float 10s ease-in-out infinite reverse' }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px]" 
           style={{ animation: 'float 12s ease-in-out infinite' }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
      `}</style>
    </div>
  );
};

// Typing Animation Component
const TypingText = ({ texts }: { texts: string[] }) => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[index];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentText.slice(0, displayText.length + 1));
        if (displayText === currentText) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentText.slice(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setIndex((index + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index, texts]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Stats Counter Component
const Counter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [end]);

  return <span>{count.toLocaleString('fa-IR')}{suffix}</span>;
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'طراحی هوشمند برنامه',
      description: 'ساخت برنامه‌های تمرینی و تغذیه‌ای شخصی‌سازی شده در چند کلیک',
      color: 'from-blue-500 to-cyan-500',
      delay: '0'
    },
    {
      icon: BarChart3,
      title: 'تحلیل پیشرفته',
      description: 'نمودارها و آمار دقیق برای پیگیری روند پیشرفت ورزشی',
      color: 'from-purple-500 to-pink-500',
      delay: '100'
    },
    {
      icon: Users,
      title: 'مدیریت شاگردان',
      description: 'مدیریت آسان و حرفه‌ای تمام شاگردان در یک پنل واحد',
      color: 'from-pink-500 to-rose-500',
      delay: '200'
    },
    {
      icon: Target,
      title: 'هدف‌گذاری هوشمند',
      description: 'تعیین و پیگیری اهداف با الگوریتم‌های پیشرفته',
      color: 'from-orange-500 to-yellow-500',
      delay: '300'
    },
    {
      icon: Shield,
      title: 'امنیت بالا',
      description: 'حفاظت کامل از اطلاعات شخصی و داده‌های حساس',
      color: 'from-green-500 to-emerald-500',
      delay: '400'
    },
    {
      icon: Heart,
      title: 'پشتیبانی ۲۴/۷',
      description: 'تیم پشتیبانی همیشه آماده کمک به شما',
      color: 'from-red-500 to-pink-500',
      delay: '500'
    }
  ];

  const testimonials = [
    {
      name: 'سارا احمدی',
      role: 'مربی بدنسازی حرفه‌ای',
      image: '👩‍🏫',
      text: 'فلکس‌پرو بهترین ابزاری است که برای مدیریت شاگردانم پیدا کردم. همه چیز در یک جا!',
      rating: 5
    },
    {
      name: 'علی رضایی',
      role: 'قهرمان بدنسازی',
      image: '🏋️',
      text: 'با این پلتفرم توانستم پیشرفتم را به صورت دقیق پیگیری کنم. عالی است!',
      rating: 5
    },
    {
      name: 'مریم کریمی',
      role: 'مربی فیتنس',
      image: '💪',
      text: 'رابط کاربری فوق‌العاده و امکانات کامل. دقیقاً همان چیزی که نیاز داشتم.',
      rating: 5
    }
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <AnimatedBackground />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-blue-500/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Activity className="w-7 h-7 text-white" />
                </div>
              </div>
              <span className="text-3xl font-black bg-gradient-to-l from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                فلکس‌پرو
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-white transition font-medium">ویژگی‌ها</a>
              <a href="#stats" className="text-slate-300 hover:text-white transition font-medium">آمار</a>
              <a href="#testimonials" className="text-slate-300 hover:text-white transition font-medium">نظرات</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 text-white hover:text-blue-400 transition font-semibold"
              >
                ورود
              </button>
              <button
                onClick={() => navigate('/register')}
                className="relative group px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition" />
                <span className="relative flex items-center gap-2">
                  ثبت‌نام رایگان
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-slate-300 hover:text-white transition py-2">ویژگی‌ها</a>
              <a href="#stats" className="block text-slate-300 hover:text-white transition py-2">آمار</a>
              <a href="#testimonials" className="block text-slate-300 hover:text-white transition py-2">نظرات</a>
              <button
                onClick={() => navigate('/login')}
                className="w-full px-6 py-3 text-center border border-slate-700 rounded-xl hover:border-blue-500 transition"
              >
                ورود
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold"
              >
                ثبت‌نام رایگان
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">پلتفرم هوشمند مدیریت ورزش</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <div className="mb-4">آینده مدیریت</div>
            <TypingText texts={['بدنسازی', 'تمرینات', 'تغذیه', 'پیشرفت']} />
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            پیشرفته‌ترین پلتفرم برای مربیان و ورزشکاران حرفه‌ای.
            طراحی برنامه، پیگیری پیشرفت و مدیریت کامل در یک محیط زیبا.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <button
              onClick={() => navigate('/register')}
              className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition" />
              <span className="relative flex items-center gap-3">
                <Flame className="w-6 h-6" />
                شروع رایگان
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </span>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="px-12 py-5 bg-slate-900/50 backdrop-blur-sm border-2 border-slate-700 hover:border-purple-500 rounded-2xl font-bold text-lg hover:bg-slate-800/50 transition-all duration-300"
            >
              ورود به حساب
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>بدون نیاز به کارت اعتباری</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>نصب آسان در ۳۰ ثانیه</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>پشتیبانی رایگان</span>
            </div>
          </div>
        </div>

        {/* 3D Cards Mockup */}
        <div className="relative max-w-6xl mx-auto px-4 mt-20" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
          <div className="relative aspect-video rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-2xl shadow-blue-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
            <div className="p-8 flex items-center justify-center h-full">
              <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
                {[Dumbbell, BarChart3, Trophy].map((Icon, i) => (
                  <div key={i} className="aspect-square bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 flex items-center justify-center hover:scale-105 transition-transform">
                    <Icon className="w-16 h-16 text-blue-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Target, value: 5000, suffix: '+', label: 'برنامه تمرینی' },
              { icon: Users, value: 1200, suffix: '+', label: 'کاربر فعال' },
              { icon: Clock, value: 85000, suffix: '+', label: 'ساعت تمرین' },
              { icon: Award, value: 95, suffix: '%', label: 'رضایت کاربران' }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition" />
                  <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl flex items-center justify-center border border-slate-700 group-hover:scale-110 transition">
                    <stat.icon className="w-10 h-10 text-blue-400" />
                  </div>
                </div>
                <div className="text-5xl font-black text-white mb-2">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm mb-6">
              <Star className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400 font-medium">ویژگی‌های منحصر به فرد</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              چرا فلکس‌پرو؟
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              ابزارهای پیشرفته برای موفقیت بیشتر شما
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative p-8 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-800/50 hover:border-slate-700 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-3xl transition`} />
                
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-400 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-blue-400 opacity-0 group-hover:opacity-100 transition">
                    <span className="text-sm font-semibold">بیشتر بدانید</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full backdrop-blur-sm mb-6">
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-pink-400 font-medium">نظرات کاربران</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              تجربه واقعی کاربران
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="group relative p-8 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-800/50 hover:border-slate-700 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-slate-300 leading-relaxed mb-6 text-lg">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            آماده شروع هستید؟
          </h2>
          <p className="text-xl text-slate-400 mb-12">
            همین حالا به جمع هزاران کاربر راضی بپیوندید
          </p>
          
          <button
            onClick={() => navigate('/register')}
            className="group relative px-16 py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition" />
            <span className="relative flex items-center gap-3">
              ثبت‌نام رایگان
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition" />
            </span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-black bg-gradient-to-l from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                فلکس‌پرو
              </span>
            </div>
            
            <p className="text-slate-400 max-w-2xl">
              پیشرفته‌ترین پلتفرم مدیریت بدنسازی و ورزش حرفه‌ای
            </p>
            
            <div className="flex items-center gap-6 text-slate-500 text-sm">
              <span>© 2024 فلکس‌پرو</span>
              <span>•</span>
              <span>تمامی حقوق محفوظ است</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

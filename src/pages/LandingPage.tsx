import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dumbbell, 
  Utensils, 
  LineChart, 
  Users, 
  ChevronLeft, 
  Zap,
  Menu,
  X,
  CheckCircle2,
  ArrowUpRight,
  Smartphone,
  Globe,
  Star,
  Sun,
  Moon,
  Laptop,
  CreditCard,
  MessageCircle,
  Activity,
  Trophy,
  Flame,
  TrendingUp,
  Target,
  Gauge
} from 'lucide-react';

// --- UI Components ---

const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${className}`}>
    {children}
  </span>
);

const ShimmerButton = ({ children, onClick, className = "" }: { children: React.ReactNode, onClick?: () => void, className?: string }) => (
  <button 
    onClick={onClick}
    className={`group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(110deg,#2563eb,45%,#60a5fa,55%,#2563eb)] bg-[length:200%_100%] px-8 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-50 ${className}`}
    style={{ animation: 'shimmer 2s linear infinite' }}
  >
    {children}
  </button>
);

const SpotlightCard = ({ children, className = "", isDark = true }: { children: React.ReactNode, className?: string, isDark?: boolean }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => setOpacity(1);
  const handleBlur = () => setOpacity(0);
  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl border transition-colors duration-300 ${
        isDark 
          ? 'border-white/10 bg-gray-900/50 shadow-2xl' 
          : 'border-slate-200 bg-white/80 shadow-xl'
      } px-8 py-10 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)'}, transparent 40%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};

// --- Page Component ---

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [activeRole, setActiveRole] = useState<'coach' | 'client'>('coach');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-blue-500/30 selection:text-blue-600 overflow-x-hidden`} style={{ fontFamily: "'Vazirmatn', 'IranSans', sans-serif" }} dir="rtl">
      
      {/* CSS Injection + Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Vazirmatn', 'IranSans', sans-serif !important;
        }
        
        @keyframes shimmer {
          from { background-position: 0 0; }
          to { background-position: -200% 0; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.8);
            transform: scale(1.05);
          }
        }
        .animate-shimmer { animation: shimmer 2s linear infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .bg-grid-pattern {
          background-size: 30px 30px;
          background-image: linear-gradient(to right, ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'} 1px, transparent 1px),
                            linear-gradient(to bottom, ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'} 1px, transparent 1px);
        }
      `}</style>

      {/* --- Dynamic Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-[#020617]' : 'bg-slate-50'}`}></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-20 mask-image-gradient"></div>
        <div className={`absolute top-0 -left-40 w-96 h-96 rounded-full blur-[128px] animate-pulse transition-colors duration-500 ${isDark ? 'bg-blue-600/30' : 'bg-blue-400/20'}`}></div>
        <div className={`absolute bottom-0 -right-40 w-96 h-96 rounded-full blur-[128px] animate-pulse delay-1000 transition-colors duration-500 ${isDark ? 'bg-purple-600/20' : 'bg-purple-400/20'}`}></div>
      </div>

      {/* --- Navbar --- */}
      <nav className={`fixed w-full z-50 top-0 start-0 transition-all duration-300 ${scrolled ? (isDark ? 'bg-[#020617]/80 border-b border-white/5' : 'bg-white/80 border-b border-slate-200') + ' backdrop-blur-xl py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-6">
          <div className="flex items-center gap-3 rtl:space-x-reverse cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-lg opacity-50"></div>
              <div className={`relative bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl border ${isDark ? 'border-white/10' : 'border-white/20'}`}>
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className={`self-center text-2xl font-bold whitespace-nowrap tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              فلکس‌پرو
              <span className="text-blue-500">.</span>
            </span>
          </div>
          
          <div className="flex md:order-2 items-center gap-3">
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              title={isDark ? "حالت روشن" : "حالت تیره"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button 
              onClick={() => navigate('/login')}
              className={`font-medium text-sm px-4 py-2 transition-colors hidden sm:block ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              ورود
            </button>
            <ShimmerButton onClick={() => navigate('/register')} className="!h-10 !rounded-lg text-sm !px-5">
              شروع کنید
            </ShimmerButton>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`inline-flex items-center p-2 justify-center rounded-lg md:hidden transition-colors ${isDark ? 'text-gray-400 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
            <ul className={`flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-2xl md:space-x-8 md:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent ${isDark ? 'bg-white/5 border-white/10 backdrop-blur-md' : 'bg-slate-100 border-slate-200'}`}>
              {['ویژگی‌ها', 'مربیان', 'ورزشکاران', 'تعرفه‌ها'].map((item) => (
                <li key={item}>
                  <a href={`#${item}`} className={`block py-2 px-3 rounded md:p-0 transition-all duration-200 ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5 md:hover:bg-transparent' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-200 md:hover:bg-transparent'}`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          
          <div className="flex justify-center mb-8">
            <div className="animate-float">
              <Badge className={`${isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'} backdrop-blur-md cursor-default`}>
                <span className="relative flex h-2 w-2 ml-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                دو پنل مجزا برای مربی و شاگرد
              </Badge>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
            <span className={`block ${isDark ? 'text-white' : 'text-slate-900'}`}>تبدیل بدن، حرفه‌ای</span>
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text pb-2">
              فلکس‌پرو نسخه ۲
            </span>
          </h1>
          
          <p className={`text-lg sm:text-xl mb-10 max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
            پلتفرم جامع مدیریت ورزشی و تغذیه ایران. برای مربیانی که می‌خواهند شاگردانشان را تحت یک پلن حرفه‌ای و دقیق هدایت کنند. 
            <span className="block mt-3 text-base font-medium opacity-70">📊 طراحی تمرین | 🍽️ محاسبه رژیم | 📈 پیگیری پیشرفت | 💪 بدون حد و مرز</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <ShimmerButton onClick={() => navigate('/register')} className="!h-14 !rounded-2xl !text-lg !px-10 shadow-2xl shadow-blue-900/20">
              شروع رایگان
              <ChevronLeft className="w-5 h-5 mr-2" />
            </ShimmerButton>
            
            <button 
              onClick={() => navigate('/login')}
              className={`group px-8 py-4 border rounded-2xl font-bold text-lg transition-all backdrop-blur-sm flex items-center gap-2 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white border-white/10' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 shadow-sm'}`}
            >
              <Globe className={`w-5 h-5 transition-colors ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
              ورود به پنل کاربری
            </button>
          </div>

          {/* Role Split Visual */}
          <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 opacity-80">
             <div className="flex items-center gap-3">
                <Laptop className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>پنل دسکتاپ (مربیان)</span>
             </div>
             <div className={`w-px h-8 hidden md:block ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
             <div className="flex items-center gap-3">
                <Smartphone className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>اپلیکیشن موبایل (شاگردان)</span>
             </div>
          </div>
        </div>
      </section>

      {/* --- Interactive Role Switcher Section --- */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    تجربه کاربری اختصاصی
                </h2>
                <div className={`inline-flex p-1 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                    <button 
                        onClick={() => setActiveRole('coach')}
                        className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${activeRole === 'coach' ? (isDark ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-blue-600 shadow-md') : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
                    >
                        پنل مربیان
                    </button>
                    <button 
                        onClick={() => setActiveRole('client')}
                        className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${activeRole === 'client' ? (isDark ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-green-600 shadow-md') : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
                    >
                        پنل شاگردان
                    </button>
                </div>
            </div>

            {/* Role Specific Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="space-y-8">
                    {activeRole === 'coach' ? (
                        <>
                            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
                                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>مدیریت هوشمند شاگردان</h3>
                                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                                    در پنل مربی، شما ابزارهای قدرتمندی برای طراحی تمرین، محاسبه رژیم و مدیریت مالی دارید. دیگر نیازی به اکسل و کاغذ نیست.
                                </p>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className={`w-6 h-6 mt-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                                    <div>
                                        <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>طراحی تمرین با دیتابیس کامل</h4>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>دسترسی به هزاران حرکت با ویدیو و توضیحات.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CreditCard className={`w-6 h-6 mt-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                                    <div>
                                        <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>مدیریت مالی و شهریه</h4>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>پیگیری خودکار تمدیدها و پرداخت‌های شاگردان.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Laptop className={`w-6 h-6 mt-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                                    <div>
                                        <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>مانیتورینگ پیشرفت</h4>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>مشاهده نمودارهای وزن و سایز شاگردان در یک نگاه.</p>
                                    </div>
                                </li>
                            </ul>
                        </>
                    ) : (
                        <>
                             <div className={`p-6 rounded-2xl border ${isDark ? 'bg-green-500/5 border-green-500/20' : 'bg-green-50 border-green-100'}`}>
                                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-green-400' : 'text-green-700'}`}>همراه همیشگی در تمرین</h3>
                                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                                    شاگردان شما برنامه‌ای را که نوشته‌اید در گوشی خود می‌بینند، ویدیو حرکات را چک می‌کنند و رکوردهایشان را ثبت می‌کنند.
                                </p>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <Smartphone className={`w-6 h-6 mt-1 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                                    <div>
                                        <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>اپلیکیشن نسخه وب (PWA)</h4>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>نصب آسان روی آیفون و اندروید بدون نیاز به استور.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Activity className={`w-6 h-6 mt-1 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                                    <div>
                                        <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>ثبت رکوردها و گزارش‌گیری</h4>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>شاگرد می‌تواند وزنه‌های زده شده را یادداشت کند.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MessageCircle className={`w-6 h-6 mt-1 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                                    <div>
                                        <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>چت مستقیم با مربی</h4>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>ارسال پیام و سوالات مستقیماً از داخل برنامه.</p>
                                    </div>
                                </li>
                            </ul>
                        </>
                    )}
                </div>

                {/* Visual Representation (Mockup) */}
                <div className={`relative rounded-3xl border shadow-2xl overflow-hidden aspect-[4/3] transition-all duration-500 ${isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-slate-200'}`}>
                    <div className={`absolute inset-0 bg-grid-pattern opacity-50 ${isDark ? '' : 'opacity-10'}`}></div>
                    
                    {activeRole === 'coach' ? (
                        // Coach UI Mockup
                        <div className="absolute inset-4 flex flex-col gap-4 animate-in fade-in slide-in-from-right duration-500">
                             <div className={`h-8 w-full rounded-lg flex items-center px-4 justify-between ${isDark ? 'bg-gray-800' : 'bg-slate-100'}`}>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Coach Dashboard</div>
                             </div>
                             <div className="flex gap-4 h-full">
                                <div className={`w-1/4 rounded-xl p-3 space-y-3 ${isDark ? 'bg-gray-800/50' : 'bg-slate-50 border border-slate-100'}`}>
                                    <div className={`h-8 w-full rounded ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}></div>
                                    <div className={`h-2 w-2/3 rounded ${isDark ? 'bg-gray-700' : 'bg-slate-200'}`}></div>
                                    <div className={`h-2 w-1/2 rounded ${isDark ? 'bg-gray-700' : 'bg-slate-200'}`}></div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className={`h-20 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white border border-slate-100 shadow-sm'}`}></div>
                                        <div className={`h-20 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white border border-slate-100 shadow-sm'}`}></div>
                                        <div className={`h-20 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white border border-slate-100 shadow-sm'}`}></div>
                                    </div>
                                    <div className={`flex-1 h-40 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-slate-50 border border-slate-100'}`}></div>
                                </div>
                             </div>
                        </div>
                    ) : (
                        // Client UI Mockup (Mobile Style)
                        <div className="absolute inset-0 flex justify-center items-center animate-in fade-in slide-in-from-left duration-500">
                             <div className={`w-[280px] h-[500px] rounded-[30px] border-4 p-3 relative ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200 shadow-2xl'}`}>
                                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 rounded-b-xl ${isDark ? 'bg-gray-800' : 'bg-slate-100'}`}></div>
                                <div className="h-full w-full rounded-[20px] overflow-hidden flex flex-col relative">
                                    <div className={`h-32 p-4 flex flex-col justify-end ${isDark ? 'bg-green-600' : 'bg-green-500'}`}>
                                        <div className="w-12 h-12 rounded-full bg-white/20 mb-2"></div>
                                        <div className="h-2 w-1/2 bg-white/40 rounded"></div>
                                    </div>
                                    <div className={`flex-1 p-4 space-y-3 ${isDark ? 'bg-gray-800' : 'bg-slate-50'}`}>
                                        <div className={`h-12 rounded-xl w-full ${isDark ? 'bg-gray-700' : 'bg-white shadow-sm'}`}></div>
                                        <div className={`h-12 rounded-xl w-full ${isDark ? 'bg-gray-700' : 'bg-white shadow-sm'}`}></div>
                                        <div className={`h-12 rounded-xl w-full ${isDark ? 'bg-gray-700' : 'bg-white shadow-sm'}`}></div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </section>

      {/* --- Bento Grid Features Section --- */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              قابلیت‌های پیشرفته
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
              پوشش کامل نیازهای باشگاه‌داری مدرن، از صفر تا صد.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Large Card */}
            <SpotlightCard isDark={isDark} className="md:col-span-2 md:row-span-2 !p-0 relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
                alt="Gym" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs mb-4 backdrop-blur-md">
                  <Star className="w-3 h-3 fill-blue-300" />
                  محبوب‌ترین قابلیت
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">بانک حرکات کامل</h3>
                <p className="text-gray-300 max-w-lg">
                  بیش از ۵۰۰ حرکت بدنسازی، کراس‌فیت و اصلاحی با ویدیوهای آموزشی. شاگردان شما دقیقاً می‌دانند هر حرکت را چطور اجرا کنند.
                </p>
              </div>
            </SpotlightCard>

            {/* Side Card 1 */}
            <SpotlightCard isDark={isDark} className="group">
              <div className="h-full flex flex-col justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${isDark ? 'bg-green-500/10 border-green-500/20 group-hover:bg-green-500/20' : 'bg-green-100 border-green-200 group-hover:bg-green-200'}`}>
                  <Utensils className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>رژیم‌نویسی پیشرفته</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>محاسبه کالری، ماکروها و ارائه لیست خرید به شاگرد.</p>
                </div>
              </div>
            </SpotlightCard>

            {/* Side Card 2 */}
            <SpotlightCard isDark={isDark} className="group">
              <div className="h-full flex flex-col justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${isDark ? 'bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500/20' : 'bg-purple-100 border-purple-200 group-hover:bg-purple-200'}`}>
                  <LineChart className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>گزارش‌گیری دقیق</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>نمودارهای پیشرفت سایز و وزن برای انگیزه دادن به شاگرد.</p>
                </div>
              </div>
            </SpotlightCard>

             {/* Wide Bottom Card */}
             <SpotlightCard isDark={isDark} className="md:col-span-2 group">
              <div className="flex flex-col md:flex-row items-center gap-8 h-full">
                <div className="flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-6 transition-colors ${isDark ? 'bg-orange-500/10 border-orange-500/20 group-hover:bg-orange-500/20' : 'bg-orange-100 border-orange-200 group-hover:bg-orange-200'}`}>
                    <Users className={`w-6 h-6 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>سیستم مدیریت شاگردان (CRM)</h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    همه اطلاعات شاگردان، از تاریخچه پزشکی تا وضعیت پرداخت‌ها، در یک مکان امن.
                  </p>
                  <div className="flex gap-2">
                    <Badge className={isDark ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-orange-100 text-orange-600 border-orange-200"}>بایگانی اطلاعات</Badge>
                    <Badge className={isDark ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-orange-100 text-orange-600 border-orange-200"}>یادآور تمدید</Badge>
                  </div>
                </div>
                <div className={`flex-1 w-full h-full relative min-h-[150px] rounded-xl border overflow-hidden flex items-center justify-center ${isDark ? 'bg-gray-900/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    {/* Abstract UI representation */}
                    <div className="space-y-3 w-3/4 opacity-60 group-hover:opacity-100 transition-opacity">
                        <div className={`h-2 rounded w-1/3 ${isDark ? 'bg-gray-700' : 'bg-slate-300'}`}></div>
                        <div className={`h-2 rounded w-1/2 ${isDark ? 'bg-gray-700' : 'bg-slate-300'}`}></div>
                        <div className={`h-2 rounded w-full ${isDark ? 'bg-gray-700' : 'bg-slate-300'}`}></div>
                        <div className={`h-2 rounded w-2/3 ${isDark ? 'bg-gray-700' : 'bg-slate-300'}`}></div>
                    </div>
                </div>
              </div>
            </SpotlightCard>

            {/* Side Card 3 */}
            <SpotlightCard isDark={isDark} className="group">
              <div className="h-full flex flex-col justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${isDark ? 'bg-cyan-500/10 border-cyan-500/20 group-hover:bg-cyan-500/20' : 'bg-cyan-100 border-cyan-200 group-hover:bg-cyan-200'}`}>
                  <Smartphone className={`w-6 h-6 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>وب اپلیکیشن (PWA)</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>بدون نیاز به دانلود از اپ استور، قابل نصب روی تمام گوشی‌ها.</p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? 'bg-blue-600/5' : 'bg-blue-100/50'}`}></div>
        <div className="max-w-5xl mx-auto px-4 text-center relative">
            <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] animate-pulse ${isDark ? 'bg-purple-500/20' : 'bg-purple-300/30'}`}></div>
            <div className={`absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-[80px] animate-pulse delay-700 ${isDark ? 'bg-blue-500/20' : 'bg-blue-300/30'}`}></div>

          <h2 className={`text-4xl sm:text-6xl font-bold mb-6 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            حرفه‌ای شدن، ساده‌تر از همیشه
          </h2>
          <p className={`text-lg sm:text-xl mb-12 max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
            به جمع مربیان مدرنی بپیوندید که با فلکس‌پرو، زمان خود را مدیریت می‌کنند و کیفیت کارشان را ارتقا می‌دهند.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <ShimmerButton onClick={() => navigate('/register')} className="!h-16 !text-lg !rounded-2xl !px-12 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] transition-shadow">
              شروع به عنوان مربی / ورزشکار
              <ArrowUpRight className="w-5 h-5 mr-2" />
            </ShimmerButton>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className={`border-t pt-16 pb-8 relative z-10 ${isDark ? 'border-white/5 bg-[#020617]' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg">
                            <Dumbbell className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>فلکس‌پرو</span>
                    </div>
                    <p className={`max-w-sm leading-relaxed mb-6 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        تخصصی‌ترین پلتفرم مدیریت ورزشی ایران. <br/>
                        توسعه یافته برای ارتقای سطح سلامت جامعه.
                    </p>
                    <div className="flex gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors border ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/5' : 'bg-slate-100 hover:bg-slate-200 border-slate-200'}`}>
                                <div className={`w-4 h-4 rounded-sm ${isDark ? 'bg-gray-400' : 'bg-slate-500'}`}></div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div>
                    <h4 className={`font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>محصول</h4>
                    <ul className={`space-y-4 text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">ویژگی‌ها</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">برای مربیان</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">برای باشگاه‌ها</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">تعرفه‌ها</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 className={`font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>شرکت</h4>
                    <ul className={`space-y-4 text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">درباره ما</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">تماس با ما</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">قوانین و مقررات</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">حریم خصوصی</a></li>
                    </ul>
                </div>
            </div>
            
            <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                <div className={`text-sm ${isDark ? 'text-gray-600' : 'text-slate-500'}`}>
                    © {new Date().getFullYear()} FlexPro. طراحی شده با ❤️ برای جامعه ورزشی.
                </div>
                <div className="flex gap-6 text-sm text-gray-500">
                    <span>وضعیت سرور: <span className="text-green-500">پایدار</span></span>
                    <span>نسخه: ۲.۲.۰</span>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

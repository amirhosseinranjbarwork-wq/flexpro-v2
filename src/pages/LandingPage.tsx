import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Zap, BarChart3, Shield, Users, LayoutDashboard, Star, Award, TrendingUp, Target, ChevronDown } from 'lucide-react';

// Typing Animation Component
const TypingAnimation = ({ texts, speed = 100, delay = 2000 }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const text = texts[currentTextIndex];
    const typingDelay = isDeleting ? speed / 2 : speed;
    const timeoutDelay = !isDeleting && currentText.length === text.length ? delay : typingDelay;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < text.length) {
          setCurrentText(text.slice(0, currentText.length + 1));
        } else {
          setIsDeleting(true);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, timeoutDelay);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts, speed, delay]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className="inline-block">
      {currentText}
      <span className={`inline-block w-1 h-12 bg-gradient-to-r from-blue-400 to-purple-400 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`} />
    </span>
  );
};

// Stats Counter Component
const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span>{count.toLocaleString('fa-IR')}</span>;
};

// Particle Background Component
const ParticleBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.5 + 0.3,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `float ${particle.speed * 10}s ease-in-out infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-white selection:bg-blue-500 selection:text-white overflow-hidden font-sans">

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-l from-blue-400 to-purple-500 tracking-tight">
                فلکس‌پرو
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                نسخه توسعه آفلاین
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Particle Background */}
        <ParticleBackground />

        {/* Enhanced Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-600/30 rounded-full blur-[120px] animate-pulse" style={{ animation: 'pulse 4s ease-in-out infinite' }} />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px]" style={{ animation: 'pulse 6s ease-in-out infinite reverse' }} />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-600/20 rounded-full blur-[80px]" style={{ animation: 'float 8s ease-in-out infinite' }} />
        </div>

        {/* Floating Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-10 w-20 h-20 border border-blue-400/20 rounded-lg rotate-45 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-3/4 left-10 w-16 h-16 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/4 w-12 h-12 border border-pink-400/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-full backdrop-blur-sm mb-8">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-slate-300">پلتفرم برتر مدیریت بدنسازی</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight min-h-[200px] md:min-h-[280px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <span className="text-white">پلتفرم هوشمند</span>
              <TypingAnimation
                texts={[
                  "مدیریت بدنسازی",
                  "طراحی برنامه تمرینی",
                  "پیگیری پیشرفت",
                  "مدیریت تغذیه"
                ]}
                speed={150}
                delay={3000}
              />
            </div>
          </h1>

          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in">
            پیشرفته‌ترین ابزار برای مربیان و ورزشکاران حرفه‌ای.
            طراحی برنامه‌های تمرینی هوشمند، پیگیری پیشرفت لحظه‌ای و مدیریت تغذیه تخصصی در یک محیط یکپارچه و کاربرپسند.
          </p>

          {/* Action Buttons - Enhanced */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">

            <div className="text-center group">
              <button
                onClick={() => navigate('/dashboard?role=coach')}
                className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white rounded-3xl font-bold text-lg shadow-2xl shadow-blue-500/40 transition-all duration-500 hover:scale-110 hover:shadow-blue-500/60 flex items-center gap-3 overflow-hidden mb-4 transform hover:-translate-y-2 hover:rotate-1"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #6366f1 100%)',
                  boxShadow: '0 20px 40px -12px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.3)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                <LayoutDashboard className="w-7 h-7 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <span className="relative z-10">ورود به پنل مربی</span>
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                </div>
              </button>
              <p className="text-sm text-slate-400 transition-all duration-300 group-hover:text-blue-400 group-hover:scale-105">مدیریت شاگردان، طراحی برنامه، پیگیری پیشرفت</p>
            </div>

            <div className="text-center group">
              <button
                onClick={() => navigate('/dashboard?role=client')}
                className="group relative px-12 py-6 bg-slate-900/80 backdrop-blur-sm border-2 border-slate-700 hover:border-purple-500/80 hover:bg-slate-800/80 text-white rounded-3xl font-bold text-lg transition-all duration-500 hover:scale-110 hover:shadow-purple-500/40 flex items-center gap-3 mb-4 transform hover:-translate-y-2 hover:-rotate-1 overflow-hidden"
                style={{
                  boxShadow: '0 0 0 1px rgba(148, 163, 184, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Users className="w-7 h-7 text-slate-400 group-hover:text-purple-400 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12" />
                <span className="relative z-10">ورود به پنل شاگرد</span>
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                </div>
              </button>
              <p className="text-sm text-slate-400 transition-all duration-300 group-hover:text-purple-400 group-hover:scale-105">مشاهده برنامه، ثبت پیشرفت، پیگیری تغذیه</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-900/50 border border-slate-700 rounded-xl max-w-md mx-auto backdrop-blur-sm">
            <div className="flex items-center gap-2 justify-center mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              <span className="text-sm font-medium text-green-400">نسخه توسعه فعال</span>
            </div>
            <p className="text-xs text-slate-500 text-center">
              دسترسی مستقیم بدون نیاز به ثبت‌نام یا رمز عبور
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              اعداد و ارقام فلکس‌پرو
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              آمار و ارقام نشان‌دهنده کیفیت و محبوبیت پلتفرم ما
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-10 h-10 text-blue-400" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter target={5000} />
                <span className="text-2xl">+</span>
              </div>
              <p className="text-slate-400">برنامه تمرینی طراحی شده</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-purple-400" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter target={1200} />
                <span className="text-2xl">+</span>
              </div>
              <p className="text-slate-400">کاربر فعال</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-10 h-10 text-pink-400" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter target={85000} />
                <span className="text-2xl">+</span>
              </div>
              <p className="text-slate-400">ساعت تمرین پیگیری شده</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-10 h-10 text-green-400" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter target={95} />
                <span className="text-2xl">%</span>
              </div>
              <p className="text-slate-400">رضایت کاربران</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Grid */}
      <section className="py-24 bg-slate-950/50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-purple-500/5 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-full backdrop-blur-sm mb-4">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">ویژگی‌های منحصر به فرد</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              چرا فلکس‌پرو؟
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              تجربه‌ای بی‌نظیر در مدیریت بدنسازی با ابزارهای پیشرفته و رابط کاربری مدرن
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Enhanced Feature 1 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-slate-800/50 hover:border-blue-500/60 transition-all duration-500 backdrop-blur-sm overflow-hidden hover:scale-105 hover:-translate-y-2 transform">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-500" />
              <div className="relative z-10">
                <div className="w-18 h-18 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-blue-500/10">
                  <Zap className="w-9 h-9 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">طراحی هوشمند برنامه</h3>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">ساخت برنامه‌های تمرینی و غذایی پیچیده در چند ثانیه با رابط کاربری پیشرفته و الگوریتم‌های هوشمند.</p>
                <div className="mt-4 flex items-center gap-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm">بیشتر بدانید</span>
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </div>
              </div>
            </div>

            {/* Enhanced Feature 2 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-slate-800/50 hover:border-purple-500/60 transition-all duration-500 backdrop-blur-sm overflow-hidden hover:scale-105 hover:-translate-y-2 transform" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors duration-500" />
              <div className="relative z-10">
                <div className="w-18 h-18 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shadow-lg shadow-purple-500/10">
                  <BarChart3 className="w-9 h-9 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">آنالیز پیشرفته پیشرفت</h3>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">مشاهده نمودارهای دقیق حجم تمرین، شدت، تغییرات بدن و تحلیل روند پیشرفت به صورت لحظه‌ای و تعاملی.</p>
                <div className="mt-4 flex items-center gap-2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm">بیشتر بدانید</span>
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </div>
              </div>
            </div>

            {/* Enhanced Feature 3 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-slate-800/50 hover:border-pink-500/60 transition-all duration-500 backdrop-blur-sm overflow-hidden hover:scale-105 hover:-translate-y-2 transform" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-colors duration-500" />
              <div className="relative z-10">
                <div className="w-18 h-18 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-pink-500/10">
                  <Shield className="w-9 h-9 text-pink-400 group-hover:text-pink-300 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-pink-300 transition-colors">دسترسی کامل آفلاین</h3>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">کارکرد کامل بدون اینترنت، سرعت بالا، امنیت داده‌ها و پشتیبان‌گیری خودکار در نسخه توسعه.</p>
                <div className="mt-4 flex items-center gap-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm">بیشتر بدانید</span>
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 via-transparent to-slate-900/50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              نظرات کاربران
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              تجربه کاربران واقعی از استفاده از فلکس‌پرو
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-slate-800/50 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">
                "بهترین پلتفرمی که تا حالا استفاده کردم. طراحی برنامه‌های تمرینی خیلی سریع و راحت شده."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">س</span>
                </div>
                <div>
                  <p className="text-white font-medium">سارا احمدی</p>
                  <p className="text-slate-400 text-sm">مربی بدنسازی</p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-slate-800/50 backdrop-blur-sm hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">
                "پیگیری پیشرفت و نمودارها عالی هستن. واقعاً کمک کرده تا بهتر تمرین کنم."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ا</span>
                </div>
                <div>
                  <p className="text-white font-medium">علی رضایی</p>
                  <p className="text-slate-400 text-sm">ورزشکار حرفه‌ای</p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-slate-800/50 backdrop-blur-sm hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">
                "مدیریت تغذیه و برنامه غذایی فوق‌العاده کاربردی است. وزنم رو کنترل کردم."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">م</span>
                </div>
                <div>
                  <p className="text-white font-medium">مریم کریمی</p>
                  <p className="text-slate-400 text-sm">مربی تغذیه</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="border-t border-slate-800/50 bg-gradient-to-b from-slate-950/80 to-slate-950 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 animate-pulse">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-l from-blue-400 via-purple-400 to-pink-400 tracking-tight">
                فلکس‌پرو
              </span>
            </div>
            <p className="text-slate-400 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
              پیشرفته‌ترین پلتفرم مدیریت بدنسازی و ورزش حرفه‌ای با ابزارهای هوشمند و رابط کاربری مدرن
            </p>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/dashboard?role=coach')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50 mb-8"
            >
              <span>شروع رایگان</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl" />
            </button>

            <div className="flex justify-center gap-8 text-sm text-slate-500 mb-8">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                نسخه توسعه 2.0
              </span>
              <span>•</span>
              <span>طراحی و توسعه با ❤️</span>
              <span>•</span>
              <span>2024</span>
            </div>

            {/* Social Links or Additional Info */}
            <div className="flex justify-center gap-6 text-slate-600">
              <div className="flex items-center gap-2 hover:text-blue-400 transition-colors cursor-pointer">
                <Activity className="w-4 h-4" />
                <span className="text-sm">شبکه‌های اجتماعی</span>
              </div>
              <div className="flex items-center gap-2 hover:text-purple-400 transition-colors cursor-pointer">
                <Shield className="w-4 h-4" />
                <span className="text-sm">حریم خصوصی</span>
              </div>
              <div className="flex items-center gap-2 hover:text-pink-400 transition-colors cursor-pointer">
                <Users className="w-4 h-4" />
                <span className="text-sm">پشتیبانی</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
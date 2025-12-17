import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart, Dumbbell, Utensils, Zap, Shield, Star, Award } from 'lucide-react';

// Main Component
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

// Sub-components for better organization

const Header: React.FC = () => (
  <motion.header
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className="fixed top-0 left-0 right-0 z-50"
  >
    <div className="container mx-auto px-6 py-4 flex justify-between items-center glass-panel rounded-b-2xl border-t-0">
      <div className="font-bold text-xl">FlexPro</div>
      <nav className="hidden md:flex items-center gap-6">
        <a href="#features" className="hover:text-[var(--accent-color)] transition">ویژگی‌ها</a>
        <a href="#testimonials" className="hover:text-[var(--accent-color)] transition">نظرات</a>
      </nav>
      <div>
        <Link to="/login" className="btn-glass text-sm font-semibold mr-2">ورود</Link>
        <Link to="/register" className="btn-glass bg-[var(--accent-color)] text-white text-sm font-bold">ثبت‌نام</Link>
      </div>
    </div>
  </motion.header>
);

const HeroSection: React.FC = () => (
  <section className="pt-32 pb-20 text-center relative container mx-auto px-6">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-4xl md:text-6xl font-extrabold mb-4"
    >
      برنامه هوشمند، پیشرفت پایدار
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="max-w-2xl mx-auto text-lg text-[var(--text-secondary)] mb-8"
    >
      FlexPro ابزار جامع مربیان و ورزشکاران برای مدیریت هوشمند برنامه‌های تمرینی، تغذیه و مکمل‌ها.
    </motion.p>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Link to="/register" className="btn-glass bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-secondary)] text-white font-bold py-3 px-8 text-lg rounded-xl shadow-lg">
        شروع کنید
      </Link>
    </motion.div>
  </section>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; delay: number }> = ({ icon, title, children, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay }}
    className="glass-panel p-6 rounded-2xl text-center"
  >
    <div className="inline-block p-4 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-xl mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-[var(--text-secondary)] text-sm">{children}</p>
  </motion.div>
);

const FeaturesSection: React.FC = () => (
  <section id="features" className="py-20 bg-[var(--text-primary)]/5">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-12">چرا FlexPro؟</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard icon={<Dumbbell size={28} />} title="برنامه‌ریزی دقیق تمرین" delay={0.1}>
          طراحی و مدیریت برنامه‌های تمرینی با جزئیات کامل، شامل حرکات، ست‌ها، تکرارها و ویدیوهای آموزشی.
        </FeatureCard>
        <FeatureCard icon={<Utensils size={28} />} title="مدیریت تغذیه و مکمل" delay={0.2}>
          تجویز و پیگیری برنامه‌های غذایی و مکمل‌های ورزشی به صورت روزانه و هفتگی.
        </FeatureCard>
        <FeatureCard icon={<BarChart size={28} />} title="پیگیری پیشرفت" delay={0.3}>
          ثبت و تحلیل داده‌های مربوط به وزن، سایز و رکوردهای ورزشی با نمودارهای پیشرفته.
        </FeatureCard>
      </div>
    </div>
  </section>
);

const TestimonialCard: React.FC<{ name: string; role: string; children: React.ReactNode; delay: number }> = ({ name, role, children, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay }}
    className="glass-panel p-6 rounded-2xl"
  >
    <p className="text-[var(--text-secondary)] mb-4">"{children}"</p>
    <div className="font-bold">{name}</div>
    <div className="text-sm text-[var(--accent-color)]">{role}</div>
  </motion.div>
);

const TestimonialsSection: React.FC = () => (
  <section id="testimonials" className="py-20">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-12">نظر کاربران ما</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <TestimonialCard name="سارا رضایی" role="مربی بدنسازی" delay={0.1}>
          FlexPro مدیریت شاگردانم را متحول کرده. حالا می‌توانم با دقت و سرعت بیشتری برایشان برنامه طراحی کنم.
        </TestimonialCard>
        <TestimonialCard name="علی محمدی" role="ورزشکار حرفه‌ای" delay={0.2}>
          پیگیری پیشرفتم هیچوقت به این سادگی نبوده. تمام اطلاعاتم یکجا جمع شده و به راحتی قابل تحلیل است.
        </TestimonialCard>
        <TestimonialCard name="باشگاه ورزشی تک" role="مدیریت" delay={0.3}>
          بهترین ابزاری که برای مربیان و اعضای باشگاهمان تهیه کرده‌ایم. کارایی تیم ما را چند برابر کرده.
        </TestimonialCard>
      </div>
    </div>
  </section>
);

const CtaSection: React.FC = () => (
  <section className="py-20">
    <div className="container mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7 }}
        className="glass-panel bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-secondary)] rounded-2xl p-12"
      >
        <h2 className="text-3xl font-bold text-white mb-4">آماده‌اید پیشرفت کنید؟</h2>
        <p className="text-white/80 mb-8 max-w-xl mx-auto">
          همین امروز به FlexPro بپیوندید و اولین قدم را برای رسیدن به اهداف ورزشی خود هوشمندانه‌تر بردارید.
        </p>
        <Link to="/register" className="bg-white text-[var(--accent-color)] font-bold py-3 px-8 text-lg rounded-xl shadow-lg hover:scale-105 transition-transform">
          رایگان شروع کنید
        </Link>
      </motion.div>
    </div>
  </section>
);

const Footer: React.FC = () => (
  <footer className="py-8 border-t border-[var(--glass-border)]">
    <div className="container mx-auto px-6 text-center text-sm text-[var(--text-secondary)]">
      &copy; {new Date().getFullYear()} FlexPro. تمام حقوق محفوظ است.
    </div>
  </footer>
);

export default LandingPage;

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Flame, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

// A modern, reusable card component
const InfoCard = ({ icon, title, value, unit, colorClass, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-panel p-6 rounded-2xl flex items-center gap-4"
  >
    <div className={`p-3 rounded-xl ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-[var(--text-secondary)]">{title}</p>
      <p className="text-2xl font-bold">
        {value} <span className="text-base font-normal">{unit}</span>
      </p>
    </div>
  </motion.div>
);

// A reusable component for sections
const DashboardSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    {children}
  </div>
);

const ClientDashboard: React.FC = () => {
  const { profile } = useAuth();
  // Placeholder data - in a real app, this would come from context or hooks
  const todayWorkout = "تمرین پا و شکم";
  const caloriesTarget = 2500;
  const caloriesConsumed = 1800;
  const progressPercentage = 75;

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <InfoCard
          icon={<Flame size={24} className="text-white" />}
          title="کالری امروز"
          value={caloriesConsumed}
          unit="از 2500"
          colorClass="bg-red-500"
          delay={0.1}
        />
        <InfoCard
          icon={<Target size={24} className="text-white" />}
          title="پیشرفت کلی"
          value={`${progressPercentage}%`}
          unit="تا هدف"
          colorClass="bg-blue-500"
          delay={0.2}
        />
        <InfoCard
          icon={<CheckCircle size={24} className="text-white" />}
          title="جلسات این هفته"
          value="3"
          unit="از 5"
          colorClass="bg-green-500"
          delay={0.3}
        />
      </div>

      {/* Today's Plan Section */}
      <DashboardSection title="برنامه امروز شما">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-panel p-6 rounded-2xl"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">تمرین امروز</p>
              <h3 className="text-xl font-bold">{todayWorkout}</h3>
            </div>
            <Link
              to="/dashboard/training"
              className="btn-glass bg-[var(--accent-color)] text-white font-semibold flex items-center gap-2"
            >
              <span>مشاهده برنامه</span>
              <ArrowLeft size={18} />
            </Link>
          </div>
          <div className="mt-4">
            <p className="text-sm text-[var(--text-secondary)] mb-1">کالری دریافتی</p>
            <div className="w-full bg-[var(--glass-border)] rounded-full h-2.5">
              <motion.div
                className="bg-red-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(caloriesConsumed / caloriesTarget) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      </DashboardSection>

      {/* Quick Access Section */}
      <DashboardSection title="دسترسی سریع">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/dashboard/training" className="glass-panel p-6 rounded-2xl text-center hover:scale-105 transition-transform">
            <Dumbbell size={32} className="mx-auto text-[var(--accent-color)] mb-2" />
            <h3 className="font-bold">برنامه تمرینی</h3>
          </Link>
          <Link to="/dashboard/nutrition" className="glass-panel p-6 rounded-2xl text-center hover:scale-105 transition-transform">
            <Utensils size={32} className="mx-auto text-[var(--accent-color)] mb-2" />
            <h3 className="font-bold">برنامه تغذیه</h3>
          </Link>
          <Link to="/dashboard/progress" className="glass-panel p-6 rounded-2xl text-center hover:scale-105 transition-transform">
            <BarChart size={32} className="mx-auto text-[var(--accent-color)] mb-2" />
            <h3 className="font-bold">گزارش پیشرفت</h3>
          </Link>
        </div>
      </DashboardSection>
    </div>
  );
};

export default ClientDashboard;

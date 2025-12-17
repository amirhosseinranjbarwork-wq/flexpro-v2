import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, PlusCircle, MessageSquare, Bell } from 'lucide-react';

// A modern, reusable card component
const StatCard = ({ icon, title, value, detail, colorClass, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-panel p-6 rounded-2xl"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-[var(--text-secondary)]">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-xs text-green-500 mt-1">{detail}</p>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

// A reusable component for sections
const DashboardSection = ({ title, action, children }: { title: string, action?: React.ReactNode, children: React.ReactNode }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      {action}
    </div>
    {children}
  </div>
);

const CoachDashboard: React.FC = () => {
  const { profile } = useAuth();
  // Placeholder data
  const activeClients = 15;
  const newMessages = 3;
  const pendingTasks = 5;
  const recentClients = [
    { id: 1, name: 'علی محمدی', status: 'برنامه جدید', avatar: 'A' },
    { id: 2, name: 'سارا رضایی', status: 'نیاز به بازبینی', avatar: 'S' },
    { id: 3, name: 'رضا قاسمی', status: 'پیشرفت عالی', avatar: 'R' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          icon={<Users size={24} className="text-white" />}
          title="شاگردان فعال"
          value={activeClients}
          detail="+2 نفر در این ماه"
          colorClass="bg-blue-500"
          delay={0.1}
        />
        <StatCard
          icon={<MessageSquare size={24} className="text-white" />}
          title="پیام‌های جدید"
          value={newMessages}
          detail="از ۲ شاگرد"
          colorClass="bg-purple-500"
          delay={0.2}
        />
        <StatCard
          icon={<Bell size={24} className="text-white" />}
          title="کارهای در انتظار"
          value={pendingTasks}
          detail="نیاز به بازبینی برنامه"
          colorClass="bg-yellow-500"
          delay={0.3}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Clients Section */}
        <div className="lg:col-span-2">
          <DashboardSection
            title="فعالیت اخیر شاگردان"
            action={<Link to="/dashboard/clients" className="text-sm text-[var(--accent-color)] font-semibold">مشاهده همه</Link>}
          >
            <div className="glass-panel p-4 rounded-2xl space-y-3">
              {recentClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-3 hover:bg-[var(--text-primary)]/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">{client.avatar}</div>
                    <div>
                      <p className="font-bold">{client.name}</p>
                      <p className="text-xs text-green-400">{client.status}</p>
                    </div>
                  </div>
                  <Link to={`/dashboard/clients/${client.id}`} className="text-xs font-semibold btn-glass">
                    مشاهده پروفایل
                  </Link>
                </motion.div>
              ))}
            </div>
          </DashboardSection>
        </div>

        {/* Quick Actions Section */}
        <div className="lg:col-span-1">
          <DashboardSection title="دسترسی سریع">
            <div className="space-y-4">
              <Link
                to="/dashboard/clients/new"
                className="w-full glass-panel p-6 rounded-2xl flex items-center gap-4 hover:scale-105 transition-transform"
              >
                <PlusCircle size={28} className="text-[var(--accent-color)]" />
                <div>
                  <h3 className="font-bold">افزودن شاگرد جدید</h3>
                  <p className="text-xs text-[var(--text-secondary)]">ثبت پروفایل و شروع برنامه‌ریزی</p>
                </div>
              </Link>
              <Link
                to="/dashboard/templates"
                className="w-full glass-panel p-6 rounded-2xl flex items-center gap-4 hover:scale-105 transition-transform"
              >
                <Dumbbell size={28} className="text-[var(--accent-color)]" />
                <div>
                  <h3 className="font-bold">مدیریت قالب‌ها</h3>
                  <p className="text-xs text-[var(--text-secondary)]">ساخت و ویرایش برنامه‌های آماده</p>
                </div>
              </Link>
            </div>
          </DashboardSection>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;

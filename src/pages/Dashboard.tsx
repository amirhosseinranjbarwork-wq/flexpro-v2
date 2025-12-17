import React from 'react';
import { useAuth } from '../context/AuthContext';
import CoachDashboard from './CoachDashboard';
import ClientDashboard from './ClientDashboard';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard: React.FC = () => {
  const { role, ready, user } = useAuth();

  // Show a loading state while authentication is being verified
  if (!ready || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-8 h-8 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render the appropriate dashboard within the layout based on the user's role
  return (
    <DashboardLayout>
      {role === 'coach' && <CoachDashboard />}
      {role === 'client' && <ClientDashboard />}
      {!role && (
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-red-500">خطا: نقش کاربری یافت نشد</h2>
          <p className="text-[var(--text-secondary)]">
            نقش شما در سیستم تعریف نشده است. لطفا با پشتیبانی تماس بگیرید.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;

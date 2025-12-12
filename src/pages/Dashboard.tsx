import React, { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Code Splitting - Lazy load dashboards
const CoachDashboard = lazy(() => import('./CoachDashboard'));
const ClientDashboard = lazy(() => import('./ClientDashboard'));

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
    <div className="text-center space-y-4">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[var(--accent-color)] border-r-transparent"></div>
      <p className="text-sm text-[var(--text-secondary)]">در حال بارگذاری...</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { user, role, loading, profile } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'coach' || profile?.role === 'coach') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <CoachDashboard />
      </Suspense>
    );
  }

  if (role === 'client' || profile?.role === 'client') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <ClientDashboard />
      </Suspense>
    );
  }

  return <div className="p-4">نقش کاربر نامعتبر است.</div>;
};

export default Dashboard;


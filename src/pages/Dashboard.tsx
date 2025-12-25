import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';

// Code Splitting - Lazy load dashboards
const CoachDashboard = lazy(() => import('./CoachDashboard'));
const ClientDashboard = lazy(() => import('./ClientDashboard'));

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-slate-950">
    <div className="text-center space-y-6">
      {/* Logo */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
        <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
          <Activity className="w-12 h-12 text-white animate-pulse" />
        </div>
      </div>
      
      {/* Loading Spinner */}
      <div className="relative">
        <div className="w-16 h-16 mx-auto border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
      
      {/* Text */}
      <div>
        <h2 className="text-2xl font-black text-white mb-2">
          در حال بارگذاری فلکس‌پرو
        </h2>
        <p className="text-slate-400">لطفاً کمی صبر کنید...</p>
      </div>
      
      {/* Dots Animation */}
      <div className="flex justify-center gap-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
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

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mb-4">
          <Activity className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">نقش کاربر نامعتبر است</h2>
        <p className="text-slate-400">لطفاً دوباره وارد شوید</p>
      </div>
    </div>
  );
};

export default Dashboard;


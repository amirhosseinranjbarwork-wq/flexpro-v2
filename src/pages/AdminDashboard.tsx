import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_banned?: boolean;
  created_at: string;
}

interface Statistics {
  total_users: number;
  total_coaches: number;
  active_subscriptions: number;
  banned_users: number;
}

/**
 * AdminDashboard Component
 * Displays all users/coaches and system statistics
 * Only accessible to super admin users
 */
const AdminDashboard: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [banReason, setBanReason] = useState('');
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserData[];
    },
  });

  // Fetch statistics
  const { data: stats } = useQuery({
    queryKey: ['admin-statistics'],
    queryFn: async () => {
      const { data: allUsers, error: usersError } = await supabase
        .from('profiles')
        .select('role, is_banned');

      if (usersError) throw usersError;

      const statistics: Statistics = {
        total_users: allUsers?.filter(u => u.role === 'client').length || 0,
        total_coaches: allUsers?.filter(u => u.role === 'coach').length || 0,
        active_subscriptions: allUsers?.filter(u => u.role === 'coach').length || 0,
        banned_users: allUsers?.filter(u => u.is_banned === true).length || 0,
      };

      return statistics;
    },
  });

  // Ban user mutation
  const banUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_banned: true,
          ban_reason: banReason,
          banned_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setSelectedUser(null);
      setBanReason('');
    },
  });

  // Unban user mutation
  const unbanUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_banned: false,
          ban_reason: null,
          banned_at: null,
        })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  if (usersLoading) return <LoadingSpinner />;
  if (usersError) return <ErrorMessage message="خطا در بارگذاری کاربران" />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">پنل مدیریت</h1>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">کل کاربران</div>
            <div className="text-3xl font-bold text-blue-600">{stats?.total_users || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">کل مربی‌ها</div>
            <div className="text-3xl font-bold text-green-600">{stats?.total_coaches || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">اشتراک‌های فعال</div>
            <div className="text-3xl font-bold text-purple-600">{stats?.active_subscriptions || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">کاربران مسدود</div>
            <div className="text-3xl font-bold text-red-600">{stats?.banned_users || 0}</div>
          </div>
        </div>

        {/* Chart */}
        {stats && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">آمار سیستم</h2>
            <div className="h-64">
              <Bar
                data={{
                  labels: ['کاربران', 'مربی‌ها', 'اشتراک‌های فعال', 'کاربران مسدود'],
                  datasets: [{
                    label: 'تعداد',
                    data: [
                      stats.total_users || 0,
                      stats.total_coaches || 0,
                      stats.active_subscriptions || 0,
                      stats.banned_users || 0
                    ],
                    backgroundColor: [
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(34, 197, 94, 0.8)',
                      'rgba(168, 85, 247, 0.8)',
                      'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: [
                      'rgb(59, 130, 246)',
                      'rgb(34, 197, 94)',
                      'rgb(168, 85, 247)',
                      'rgb(239, 68, 68)'
                    ],
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: true,
                      text: 'آمار کاربران سیستم'
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">نام</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">ایمیل</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">نقش</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">وضعیت</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">تاریخ ثبت</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">اقدام</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-900">{user.full_name || '-'}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'coach' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'coach' ? 'مربی' : 'کاربر'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.is_banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.is_banned ? 'مسدود' : 'فعال'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {new Date(user.created_at).toLocaleDateString('fa-IR')}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {user.is_banned ? (
                      <button
                        onClick={() => unbanUserMutation.mutate(user.id)}
                        className="text-green-600 hover:text-green-800 font-semibold"
                      >
                        رفع مسدودیت
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        مسدود کردن
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ban Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">مسدود کردن کاربر</h2>
              <p className="text-gray-600 mb-4">آیا می‌خواهید کاربر {selectedUser.full_name} را مسدود کنید؟</p>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="دلیل مسدودیت (اختیاری)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
              />
              <div className="flex gap-4">
                <button
                  onClick={() => banUserMutation.mutate(selectedUser.id)}
                  disabled={banUserMutation.isPending}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {banUserMutation.isPending ? 'درحال پردازش...' : 'تایید'}
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

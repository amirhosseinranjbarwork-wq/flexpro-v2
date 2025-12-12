import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseEnabled, checkSupabaseHealth } from '../lib/supabaseClient';
import { testSupabaseConnection, type TestResult } from '../utils/supabaseTest';
import { motion } from 'framer-motion';
import { Database, Wifi, WifiOff, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface SupabaseDebugProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupabaseDebug: React.FC<SupabaseDebugProps> = ({ isOpen, onClose }) => {
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkConnection();
    }
  }, [isOpen]);

  const checkConnection = async () => {
    try {
      const status = await checkSupabaseHealth();
      setConnectionStatus(status);
    } catch {
      setConnectionStatus(false);
    }
  };

  const runTests = async () => {
    setIsTesting(true);
    try {
      const results = await testSupabaseConnection();
      setTestResults(results);
      setLastTestTime(new Date());
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'error':
        return <XCircle size={16} className="text-red-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Database size={24} className="text-blue-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Supabase Connection Debug
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                بررسی اتصالات و عملکرد Supabase
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <XCircle size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Connection Status */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Wifi size={20} />
              وضعیت اتصال
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  {isSupabaseEnabled ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-red-500" />
                  )}
                  <span className="font-medium">Supabase Enabled</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isSupabaseEnabled ? 'کلاینت Supabase مقداردهی شده' : 'متغیرهای محیطی تنظیم نشده'}
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  {connectionStatus === null ? (
                    <RefreshCw size={16} className="animate-spin text-blue-500" />
                  ) : connectionStatus ? (
                    <Wifi size={16} className="text-green-500" />
                  ) : (
                    <WifiOff size={16} className="text-red-500" />
                  )}
                  <span className="font-medium">Database Connection</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {connectionStatus === null ? 'در حال بررسی...' :
                   connectionStatus ? 'اتصال به دیتابیس برقرار' : 'اتصال به دیتابیس قطع'}
                </p>
              </div>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">متغیرهای محیطی</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="font-mono text-sm">VITE_SUPABASE_URL</span>
                <span className={`text-sm ${import.meta.env.VITE_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}`}>
                  {import.meta.env.VITE_SUPABASE_URL ? '✅ تنظیم شده' : '❌ تنظیم نشده'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="font-mono text-sm">VITE_SUPABASE_ANON_KEY</span>
                <span className={`text-sm ${import.meta.env.VITE_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}`}>
                  {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ تنظیم شده' : '❌ تنظیم نشده'}
                </span>
              </div>
            </div>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">نتایج تست</h3>
                {lastTestTime && (
                  <span className="text-sm text-gray-500">
                    آخرین تست: {lastTestTime.toLocaleTimeString('fa-IR')}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <span className="font-medium">{result.name}</span>
                      </div>
                      {result.duration && (
                        <span className="text-xs opacity-75">
                          {result.duration}ms
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-1 opacity-90">{result.message}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Auth Status */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">وضعیت احراز هویت</h3>
            <div className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-700">
              {supabase?.auth.getUser ? (
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">وضعیت:</span>
                    <span className="text-green-600">Supabase Auth فعال</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    سیستم احراز هویت Supabase آماده استفاده است
                  </p>
                </div>
              ) : (
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">وضعیت:</span>
                    <span className="text-red-600">Supabase Auth غیرفعال</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    سیستم احراز هویت Supabase فعال نیست
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={checkConnection}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <RefreshCw size={16} />
            بررسی اتصال
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={runTests}
              disabled={isTesting}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isTesting ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Database size={16} />
              )}
              {isTesting ? 'در حال تست...' : 'اجرای تست‌ها'}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              بستن
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SupabaseDebug;

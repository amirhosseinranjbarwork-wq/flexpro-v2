import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { pushNotificationManager } from './utils/pushNotifications';

// Lazy load main components for better performance
const ReactQueryProvider = React.lazy(() => import('./lib/queryClient').then(module => ({ default: module.ReactQueryProvider })));
const AuthProvider = React.lazy(() => import('./context/AuthContext').then(module => ({ default: module.AuthProvider })));
const AppProvider = React.lazy(() => import('./context/AppContext').then(module => ({ default: module.AppProvider })));
const App = React.lazy(() => import('./App'));

// Loading component for lazy-loaded components
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div className="text-center">
      <div className="animate-bounce-in mb-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        در حال بارگذاری FlexPro
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        لطفاً صبر کنید...
      </p>
    </div>
  </div>
);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('عنصر root پیدا نشد');
}

// Preload critical resources
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('Service Worker registered'))
      .catch(error => console.log('Service Worker registration failed:', error));
  });
}

// Add comprehensive performance monitoring
if ('PerformanceObserver' in window) {
  try {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('📊 LCP:', entry.startTime.toFixed(2) + 'ms');
        }
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('📊 FID:', entry.processingStart - entry.startTime, 'ms');
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      console.log('📊 CLS:', clsValue.toFixed(4));
    }).observe({ entryTypes: ['layout-shift'] });

  } catch (e) {
    console.warn('Performance monitoring not fully supported');
  }
}

// Performance monitoring (built-in)
if ('PerformanceObserver' in window) {
  try {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('📊 LCP:', entry.startTime.toFixed(2) + 'ms');
        }
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('📊 FID:', entry.processingStart - entry.startTime, 'ms');
      }
    }).observe({ entryTypes: ['first-input'] });

  } catch (e) {
    console.warn('Performance monitoring not supported');
  }
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Suspense fallback={<LoadingFallback />}>
    <ReactQueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </ReactQueryProvider>
    </Suspense>
  </React.StrictMode>
);

// Initialize push notifications after app is rendered
if (pushNotificationManager.isSupported()) {
  // Wait for service worker to be ready, then initialize push notifications
  navigator.serviceWorker.ready.then(() => {
    pushNotificationManager.initialize().catch(console.error);
  });
} else {
  console.log('Push notifications not supported in this browser');
}
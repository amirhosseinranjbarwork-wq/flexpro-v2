import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { ReactQueryProvider } from './lib/queryClient';
import { pushNotificationManager } from './utils/pushNotifications';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('عنصر root پیدا نشد');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ReactQueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </ReactQueryProvider>
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
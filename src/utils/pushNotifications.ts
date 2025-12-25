import { supabase, isSupabaseEnabled } from '../lib/supabaseClient';

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export class PushNotificationManager {
  private vapidPublicKey: string;

  constructor(vapidPublicKey: string) {
    this.vapidPublicKey = vapidPublicKey;
  }

  // Convert VAPID key from base64 to Uint8Array
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  // Subscribe to push notifications
  async subscribe(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service workers are not supported');
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
    });

    return subscription;
  }

  // Get current subscription
  async getSubscription(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator)) {
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  }

  // Unsubscribe from push notifications
  async unsubscribe(): Promise<boolean> {
    const subscription = await this.getSubscription();
    if (subscription) {
      return await subscription.unsubscribe();
    }
    return false;
  }

  // Send subscription to backend
  async saveSubscriptionToBackend(subscription: PushSubscription): Promise<void> {
    // Skip if Supabase is not enabled
    if (!isSupabaseEnabled || !supabase) {
      console.warn('Supabase not enabled, skipping push subscription save');
      // Save to localStorage as fallback
      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
          auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!)))
        }
      };
      localStorage.setItem('flexpro_push_subscription', JSON.stringify(subscriptionData));
      return;
    }

    const subscriptionData: PushSubscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
        auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!)))
      }
    };

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Save subscription to user profile or dedicated table
      const { error } = await supabase
        .from('user_push_subscriptions')
        .upsert({
          user_id: user.id,
          subscription: subscriptionData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.warn('Failed to save subscription to Supabase, saving locally:', error);
      localStorage.setItem('flexpro_push_subscription', JSON.stringify(subscriptionData));
    }
  }

  // Initialize push notifications
  async initialize(): Promise<void> {
    try {
      const permission = await this.requestPermission();

      if (permission === 'granted') {
        const subscription = await this.subscribe();

        if (subscription) {
          await this.saveSubscriptionToBackend(subscription);
          console.log('Push notifications initialized successfully');
        }
      } else {
        console.log('Push notification permission denied');
      }
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
    }
  }

  // Send push notification via Supabase Edge Function
  async sendNotification(message: {
    title: string;
    body: string;
    url?: string;
    userId?: string;
    actions?: Array<{ action: string; title: string }>;
  }): Promise<void> {
    // Skip if Supabase is not enabled
    if (!isSupabaseEnabled || !supabase) {
      console.warn('Supabase not enabled, showing browser notification instead');
      // Fallback to browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(message.title, {
          body: message.body,
          icon: '/pwa-192x192.svg',
        });
      }
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: message,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.warn('Failed to send notification via Supabase, using browser notification:', error);
      // Fallback to browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(message.title, {
          body: message.body,
          icon: '/pwa-192x192.svg',
        });
      }
    }
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }
}

// Create and export a singleton instance
// You'll need to replace this with your actual VAPID public key
// Temporary disable push notifications until VAPID keys are configured
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

// Create manager only if VAPID key is available
let pushNotificationManagerInstance: PushNotificationManager;
if (VAPID_PUBLIC_KEY && VAPID_PUBLIC_KEY.length > 0) {
  pushNotificationManagerInstance = new PushNotificationManager(VAPID_PUBLIC_KEY);
} else {
  // Create a dummy manager that does nothing
  pushNotificationManagerInstance = {
    isSupported: () => false,
    initialize: async () => {
      console.warn('Push notifications disabled: VITE_VAPID_PUBLIC_KEY not configured');
      return null;
    },
    subscribe: async () => null,
    unsubscribe: async () => {},
    sendNotification: async () => {}
  } as any;
}

export const pushNotificationManager = pushNotificationManagerInstance;






import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { SyncMetadata, LocalChange } from '../types/database';

interface UseSyncReturn {
  isOnline: boolean;
  isSyncing: boolean;
  lastSynced: Date | null;
  syncNow: () => Promise<void>;
  pendingChanges: number;
}

const SYNC_STORAGE_KEY = 'flexpro_sync_changes';
const SYNC_METADATA_KEY = 'flexpro_sync_metadata';

export function useSync(): UseSyncReturn {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(0);

  const syncTimeoutRef = useRef<NodeJS.Timeout>();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load pending changes count
  useEffect(() => {
    const loadPendingChanges = () => {
      try {
        const stored = localStorage.getItem(SYNC_STORAGE_KEY);
        if (stored) {
          const changes: LocalChange[] = JSON.parse(stored);
          const userChanges = changes.filter(change => change.synced === false);
          setPendingChanges(userChanges.length);
        }
      } catch (error) {
        console.error('Error loading pending changes:', error);
      }
    };

    loadPendingChanges();
  }, [user?.id]);

  // Load last sync time
  useEffect(() => {
    const loadLastSynced = () => {
      try {
        const stored = localStorage.getItem(SYNC_METADATA_KEY);
        if (stored) {
          const metadata: SyncMetadata[] = JSON.parse(stored);
          const userMetadata = metadata.find(m => m.user_id === user?.id);
          if (userMetadata) {
            setLastSynced(new Date(userMetadata.last_synced));
          }
        }
      } catch (error) {
        console.error('Error loading sync metadata:', error);
      }
    };

    if (user?.id) {
      loadLastSynced();
    }
  }, [user?.id]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && user?.id && pendingChanges > 0) {
      // Debounce auto-sync to avoid immediate sync on reconnect
      syncTimeoutRef.current = setTimeout(() => {
        syncNow();
      }, 2000);
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [isOnline, user?.id, pendingChanges]);

  const syncNow = useCallback(async () => {
    if (!user?.id || !isOnline) return;

    // Mark all changes as synced in local mode (they're already local)
    const storedChanges = localStorage.getItem(SYNC_STORAGE_KEY);
    if (storedChanges) {
      const changes: LocalChange[] = JSON.parse(storedChanges);
      changes.forEach(change => {
        change.synced = true;
        change.timestamp = Date.now();
      });
      localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(changes));
      setPendingChanges(0);
      setLastSynced(new Date());
    }
    return;

    setIsSyncing(true);

    try {
      // Get pending changes
      const storedChanges = localStorage.getItem(SYNC_STORAGE_KEY);
      if (!storedChanges) {
        setIsSyncing(false);
        return;
      }

      const changes: LocalChange[] = JSON.parse(storedChanges);
      const pendingChanges = changes.filter(change => !change.synced);

      if (pendingChanges.length === 0) {
        setIsSyncing(false);
        return;
      }

      console.log(`🔄 Syncing ${pendingChanges.length} changes...`);

      // Process each change
      for (const change of pendingChanges) {
        try {
          await processChange(change);
          change.synced = true;
          change.timestamp = Date.now();
        } catch (error) {
          console.error(`Failed to sync change:`, change, error);
          // Continue with other changes
        }
      }

      // Update local storage
      localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(changes));

      // Update sync metadata
      const metadata: SyncMetadata = {
        id: crypto.randomUUID(),
        user_id: user.id,
        table_name: 'sync_log',
        record_id: crypto.randomUUID(),
        last_synced: new Date().toISOString(),
        version: 1
      };

      const storedMetadata = localStorage.getItem(SYNC_METADATA_KEY);
      const metadataArray: SyncMetadata[] = storedMetadata ? JSON.parse(storedMetadata) : [];
      metadataArray.push(metadata);
      localStorage.setItem(SYNC_METADATA_KEY, JSON.stringify(metadataArray));

      setLastSynced(new Date());
      setPendingChanges(0);

      console.log('✅ Sync completed successfully');

    } catch (error) {
      console.error('❌ Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [user?.id, isOnline]);

  return {
    isOnline,
    isSyncing,
    lastSynced,
    syncNow,
    pendingChanges
  };
}

/**
 * Process a single change
 * Note: In local mode, changes are already stored locally, so this is a no-op
 */
async function processChange(change: LocalChange): Promise<void> {
  // In local mode, changes are already stored locally
  // This function is kept for API compatibility but does nothing
  console.log('Change processed locally:', change);
}

/**
 * Add a change to the sync queue
 */
export function queueChange(change: Omit<LocalChange, 'timestamp' | 'synced'>): void {
  try {
    const stored = localStorage.getItem(SYNC_STORAGE_KEY);
    const changes: LocalChange[] = stored ? JSON.parse(stored) : [];

    changes.push({
      ...change,
      timestamp: Date.now(),
      synced: false
    });

    localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(changes));
  } catch (error) {
    console.error('Error queuing change:', error);
  }
}
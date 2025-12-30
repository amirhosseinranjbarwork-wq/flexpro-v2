import { useState, useEffect, useCallback, useRef } from 'react';
// Supabase removed - using local API
import { Message, OptimisticMessage, UseChatReturn } from '../types/interactive';
import { useAuth } from '../context/AuthContext';

// Local storage helpers
const STORAGE_KEY = 'flexpro_chat_messages';

function getLocalMessages(userId: string, otherUserId: string): Message[] {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}_${otherUserId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLocalMessage(userId: string, otherUserId: string, message: Message): void {
  try {
    const messages = getLocalMessages(userId, otherUserId);
    messages.push(message);
    localStorage.setItem(`${STORAGE_KEY}_${userId}_${otherUserId}`, JSON.stringify(messages));
  } catch (error) {
    console.warn('Failed to save message to localStorage:', error);
  }
}

export function useChat(otherUserId: string): UseChatReturn {
  const { user } = useAuth();
  const [messages, setMessages] = useState<(Message | OptimisticMessage)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const currentOffset = useRef(0);
  const PAGE_SIZE = 50;
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Load initial messages
  const loadMessages = useCallback(async (loadMore = false) => {
    if (!user?.id || !otherUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      let newMessages: Message[] = [];

      // Use local storage if Supabase is not enabled
      if (!isSupabaseEnabled || !supabase) {
        const localMessages = getLocalMessages(user.id, otherUserId);
        const offset = loadMore ? currentOffset.current : 0;
        newMessages = localMessages
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(offset, offset + PAGE_SIZE);
        setHasMore(localMessages.length > offset + PAGE_SIZE);
      } else {
        const offset = loadMore ? currentOffset.current : 0;

        const { data, error: fetchError } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: false })
          .range(offset, offset + PAGE_SIZE - 1);

        if (fetchError) throw fetchError;
        newMessages = data || [];
        setHasMore(newMessages.length === PAGE_SIZE);
      }

      if (loadMore) {
        setMessages(prev => [...newMessages.reverse(), ...prev]);
      } else {
        setMessages(newMessages.reverse());
      }

      currentOffset.current = (loadMore ? currentOffset.current : 0) + newMessages.length;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در بارگذاری پیام‌ها';
      setError(errorMessage);
      console.error('Error loading messages:', err);
      // Fallback to local storage
      const localMessages = getLocalMessages(user.id, otherUserId);
      setMessages(localMessages);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, otherUserId]);

  // Send message with optimistic UI
  const sendMessage = useCallback(async (content: string) => {
    if (!user?.id || !otherUserId || !content.trim()) return;

    const optimisticMessage: OptimisticMessage = {
      id: `temp-${Date.now()}`,
      sender_id: user.id,
      receiver_id: otherUserId,
      content: content.trim(),
      is_read: false,
      status: 'sending',
      created_at: new Date().toISOString()
    };

    // Add optimistic message immediately
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      let savedMessage: Message;

      // Use local storage if Supabase is not enabled
      if (!isSupabaseEnabled || !supabase) {
        savedMessage = {
          ...optimisticMessage,
          id: `msg-${Date.now()}`,
          status: 'sent' as const
        } as Message;
        saveLocalMessage(user.id, otherUserId, savedMessage);
      } else {
        const { data, error: sendError } = await supabase
          .from('messages')
          .insert({
            sender_id: user.id,
            receiver_id: otherUserId,
            content: content.trim()
          })
          .select()
          .single();

        if (sendError) throw sendError;
        savedMessage = data;
      }

      // Replace optimistic message with real one
      setMessages(prev =>
        prev.map(msg =>
          msg.id === optimisticMessage.id
            ? { ...savedMessage, status: 'sent' as const }
            : msg
        )
      );

    } catch (err) {
      // Mark as failed and show error
      setMessages(prev =>
        prev.map(msg =>
          msg.id === optimisticMessage.id
            ? { ...msg, status: 'failed' as const }
            : msg
        )
      );
      const errorMessage = err instanceof Error ? err.message : 'خطا در ارسال پیام';
      setError(errorMessage);
      console.error('Error sending message:', err);
    }
  }, [user?.id, otherUserId]);

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!user?.id || !otherUserId) return;

    // Update local state immediately
    setMessages(prev =>
      prev.map(msg =>
        msg.sender_id === otherUserId && msg.receiver_id === user.id
          ? { ...msg, is_read: true }
          : msg
      )
    );

    // Skip Supabase call if not enabled
    if (!isSupabaseEnabled || !supabase) {
      return;
    }

    try {
      const { error } = await supabase.rpc('mark_messages_as_read', {
        sender_uuid: otherUserId,
        receiver_uuid: user.id
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  }, [user?.id, otherUserId]);

  // Load more messages
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadMessages(true);
    }
  }, [isLoading, hasMore, loadMessages]);

  // Set typing indicator
  const setTyping = useCallback((typing: boolean) => {
    setIsTyping(typing);
  }, []);

  // Real-time subscription (only if Supabase is enabled)
  useEffect(() => {
    if (!user?.id || !otherUserId || !isSupabaseEnabled || !supabase) return;

    // Create channel for real-time messages
    const channel = supabase.channel(`messages-${user.id}-${otherUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id}))`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => {
            // Check if message already exists (avoid duplicates)
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) return prev;

            return [...prev, newMessage];
          });

          // Auto-mark as read if we're viewing this conversation
          if (newMessage.sender_id === otherUserId) {
            markAsRead();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${user.id},receiver_id.eq.${otherUserId})`
        },
        (payload) => {
          const updatedMessage = payload.new as Message;
          setMessages(prev =>
            prev.map(msg =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current && supabase) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user?.id, otherUserId, markAsRead]);

  // Load initial messages
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    markAsRead,
    loadMore,
    hasMore,
    isTyping,
    setTyping
  };
}
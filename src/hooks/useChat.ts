import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Message, OptimisticMessage, UseChatReturn } from '../types/interactive';
import { useAuth } from '../context/AuthContext';

export function useChat(otherUserId: string): UseChatReturn {
  const { user } = useAuth();
  const [messages, setMessages] = useState<(Message | OptimisticMessage)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const currentOffset = useRef(0);
  const PAGE_SIZE = 50;
  const channelRef = useRef<any>(null);

  // Load initial messages
  const loadMessages = useCallback(async (loadMore = false) => {
    if (!user?.id || !otherUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      const offset = loadMore ? currentOffset.current : 0;

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (fetchError) throw fetchError;

      const newMessages = data || [];
      setHasMore(newMessages.length === PAGE_SIZE);

      if (loadMore) {
        setMessages(prev => [...newMessages.reverse(), ...prev]);
      } else {
        setMessages(newMessages.reverse());
      }

      currentOffset.current = offset + newMessages.length;

    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری پیام‌ها');
      console.error('Error loading messages:', err);
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

      // Replace optimistic message with real one
      setMessages(prev =>
        prev.map(msg =>
          msg.id === optimisticMessage.id
            ? { ...data, status: 'sent' as const }
            : msg
        )
      );

    } catch (err: any) {
      // Mark as failed and show error
      setMessages(prev =>
        prev.map(msg =>
          msg.id === optimisticMessage.id
            ? { ...msg, status: 'sending' as const }
            : msg
        )
      );
      setError('خطا در ارسال پیام');
      console.error('Error sending message:', err);
    }
  }, [user?.id, otherUserId]);

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!user?.id || !otherUserId) return;

    try {
      const { error } = await supabase.rpc('mark_messages_as_read', {
        sender_uuid: otherUserId,
        receiver_uuid: user.id
      });

      if (error) throw error;

      // Update local state
      setMessages(prev =>
        prev.map(msg =>
          msg.sender_id === otherUserId && msg.receiver_id === user.id
            ? { ...msg, is_read: true }
            : msg
        )
      );

    } catch (err: any) {
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

  // Real-time subscription
  useEffect(() => {
    if (!user?.id || !otherUserId) return;

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
      if (channelRef.current) {
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
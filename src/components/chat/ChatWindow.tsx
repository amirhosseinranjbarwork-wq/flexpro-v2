import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MoreVertical, Check, CheckCheck } from 'lucide-react';
import { ChatWindowProps } from '../../types/interactive';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';

const ChatWindow: React.FC<ChatWindowProps> = ({
  otherUser,
  isOpen,
  onClose,
  className = ''
}) => {
  const { user } = useAuth();
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    markAsRead,
    loadMore,
    hasMore,
    isTyping,
    setTyping
  } = useChat(otherUser.id);

  const [newMessage, setNewMessage] = useState('');
  const [isTypingLocal, setIsTypingLocal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Mark messages as read when viewing
  useEffect(() => {
    if (isOpen && messages.some(msg => !msg.is_read && msg.sender_id === otherUser.id)) {
      markAsRead();
    }
  }, [isOpen, messages, otherUser.id, markAsRead]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(newMessage);
    setNewMessage('');
    setIsTypingLocal(false);
    setTyping(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Handle typing indicator
    if (!isTypingLocal && e.target.value.trim()) {
      setIsTypingLocal(true);
      setTyping(true);

      // Clear typing after 2 seconds of no input
      setTimeout(() => {
        setIsTypingLocal(false);
        setTyping(false);
      }, 2000);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: faIR
      });
    } catch {
      return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 w-96 h-[32rem] bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded-2xl shadow-2xl z-50 flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold">
            {otherUser.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">{otherUser.name}</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              {isTyping ? 'در حال تایپ...' : 'آنلاین'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition">
            <MoreVertical size={16} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {hasMore && (
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="w-full py-2 text-sm text-[var(--accent-color)] hover:underline disabled:opacity-50"
          >
            {isLoading ? 'در حال بارگذاری...' : 'بارگذاری پیام‌های بیشتر'}
          </button>
        )}

        {messages.map((message) => {
          const isMe = message.sender_id === user?.id;
          const isOptimistic = 'status' in message;

          return (
            <div
              key={message.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-2xl ${
                  isMe
                    ? 'bg-[var(--accent-color)] text-white rounded-br-md'
                    : 'bg-[var(--glass-bg)] text-[var(--text-primary)] rounded-bl-md border border-[var(--glass-border)]'
                } ${isOptimistic ? 'opacity-70' : ''}`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                  isMe ? 'text-white/70' : 'text-[var(--text-secondary)]'
                }`}>
                  <span>{formatMessageTime(message.created_at)}</span>
                  {isMe && (
                    <span>
                      {'status' in message ? (
                        message.status === 'sending' ? '⏳' :
                        <Check size={12} />
                      ) : message.is_read ? (
                        <CheckCheck size={12} />
                      ) : (
                        <Check size={12} />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && !messages.some(msg => msg.sender_id === otherUser.id) && (
          <div className="flex justify-start">
            <div className="bg-[var(--glass-bg)] p-3 rounded-2xl rounded-bl-md border border-[var(--glass-border)]">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 text-sm text-red-400 bg-red-400/10 border-t border-red-400/20">
          {error}
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--glass-border)]">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="پیام خود را تایپ کنید..."
            className="flex-1 px-4 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-color)] transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-xl hover:bg-[var(--accent-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Search, User, Users, X } from 'lucide-react';
import type { User as UserType } from '../types/index';

interface ClientSwitcherProps {
  clients: UserType[];
  selectedClientId?: string;
  onClientSelect: (clientId: string | null) => void;
  theme: 'light' | 'dark';
  placeholder?: string;
  disabled?: boolean;
}

const ClientSwitcher: React.FC<ClientSwitcherProps> = ({
  clients,
  selectedClientId,
  onClientSelect,
  theme,
  placeholder = 'انتخاب شاگرد...',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const isDark = theme === 'dark';

  const selectedClient = useMemo(() => {
    return clients.find(client => client.id === selectedClientId);
  }, [clients, selectedClientId]);

  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clients;

    const term = searchTerm.toLowerCase();
    return clients.filter(client =>
      client.name.toLowerCase().includes(term) ||
      client.phone?.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term)
    );
  }, [clients, searchTerm]);

  const handleSelect = useCallback((clientId: string | null) => {
    onClientSelect(clientId);
    setIsOpen(false);
    setSearchTerm('');
  }, [onClientSelect]);

  const handleClear = useCallback(() => {
    onClientSelect(null);
    setSearchTerm('');
  }, [onClientSelect]);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <motion.button
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 min-w-[200px]
          ${isDark
            ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50'
            : 'bg-white/80 border-slate-200/50 hover:bg-slate-50/80'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'ring-2 ring-blue-500/50' : ''}
        `}
      >
        {/* Avatar/Icon */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
          ${selectedClient
            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
            : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
          }
        `}>
          {selectedClient ? (
            <User size={16} />
          ) : (
            <Users size={16} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 text-right min-w-0">
          <div className={`text-sm font-medium truncate ${
            selectedClient
              ? (isDark ? 'text-white' : 'text-slate-900')
              : (isDark ? 'text-slate-400' : 'text-slate-500')
          }`}>
            {selectedClient ? selectedClient.name : placeholder}
          </div>
          {selectedClient && (
            <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {selectedClient.phone || selectedClient.email || 'بدون اطلاعات تماس'}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {selectedClient && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className={`p-1 rounded-lg transition-colors ${
                isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'
              }`}
            >
              <X size={14} />
            </button>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
          </motion.div>
        </div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={`
                absolute top-full mt-2 right-0 z-50 w-80 rounded-xl border shadow-xl overflow-hidden
                ${isDark
                  ? 'bg-slate-800/95 border-slate-700/50'
                  : 'bg-white/95 border-slate-200/50'
                }
                backdrop-blur-xl
              `}
            >
              {/* Search Input */}
              <div className="p-4 border-b border-slate-200/20 dark:border-slate-700/20">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="جستجو در شاگردان..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`
                      w-full pr-10 pl-4 py-2 rounded-lg border transition-colors
                      ${isDark
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    `}
                    autoFocus
                  />
                </div>
              </div>

              {/* Client List */}
              <div className="max-h-64 overflow-y-auto">
                {filteredClients.length === 0 ? (
                  <div className="p-8 text-center">
                    <Users className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {searchTerm ? 'شاگرد یافت نشد' : 'هیچ شاگردی وجود ندارد'}
                    </p>
                  </div>
                ) : (
                  filteredClients.map((client, index) => (
                    <motion.button
                      key={client.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15, delay: index * 0.02 }}
                      onClick={() => handleSelect(String(client.id))}
                      className={`
                        w-full p-4 text-right transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-700/50
                        ${selectedClientId === client.id ? 'bg-blue-500/10' : ''}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className={`
                          flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                          ${selectedClientId === client.id
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                            : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                          }
                        `}>
                          <User size={16} />
                        </div>

                        {/* Client Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium truncate ${
                              selectedClientId === client.id
                                ? 'text-blue-600 dark:text-blue-400'
                                : isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                              {client.name}
                            </span>
                            {selectedClientId === client.id && (
                              <Check className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {client.phone && `📞 ${client.phone}`}
                            {client.phone && client.email && ' • '}
                            {client.email && `✉️ ${client.email}`}
                            {!client.phone && !client.email && 'بدون اطلاعات تماس'}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-200/20 dark:border-slate-700/20">
                <div className="flex items-center justify-between text-sm">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    {filteredClients.length} شاگرد
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-slate-700/50 text-slate-400' : 'hover:bg-slate-100/50 text-slate-600'
                    }`}
                  >
                    بستن
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientSwitcher;
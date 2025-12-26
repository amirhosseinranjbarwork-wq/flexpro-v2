import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown, Check, Search, X } from 'lucide-react';
import type { User, UserId } from '../types/index';

interface StudentSelectorProps {
  students: User[];
  selectedStudentId: UserId | null;
  onSelect: (studentId: UserId) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  className?: string;
}

export const StudentSelector: React.FC<StudentSelectorProps> = ({
  students,
  selectedStudentId,
  onSelect,
  searchQuery = '',
  onSearchChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [localSearch, setLocalSearch] = React.useState('');

  const searchValue = onSearchChange ? searchQuery : localSearch;
  const setSearchValue = onSearchChange || setLocalSearch;

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  
  const filteredStudents = React.useMemo(() => {
    if (!searchValue.trim()) return students;
    const query = searchValue.toLowerCase();
    return students.filter(s => 
      s.name?.toLowerCase().includes(query) ||
      s.email?.toLowerCase().includes(query) ||
      s.goal?.toLowerCase().includes(query)
    );
  }, [students, searchValue]);

  return (
    <div className={`relative ${className}`}>
      {/* Selected Student Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl hover:border-slate-600 transition-all duration-300"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
            {selectedStudent?.name?.charAt(0) || <Users size={20} />}
          </div>
          <div className="flex-1 min-w-0 text-right">
            <div className="text-white font-bold text-sm truncate">
              {selectedStudent?.name || 'انتخاب شاگرد'}
            </div>
            {selectedStudent && (
              <div className="text-slate-400 text-xs truncate">
                {selectedStudent.email || selectedStudent.goal || 'بدون اطلاعات'}
              </div>
            )}
          </div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden flex flex-col"
          >
            {/* Search Bar */}
            <div className="p-3 border-b border-slate-700/50">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="جستجوی شاگرد..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
                {searchValue && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchValue('');
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Students List */}
            <div className="overflow-y-auto flex-1">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">
                    {searchValue ? 'شاگردی یافت نشد' : 'شاگردی وجود ندارد'}
                  </p>
                </div>
              ) : (
                <div className="p-2">
                  {filteredStudents.map((student) => {
                    const isSelected = student.id === selectedStudentId;
                    return (
                      <button
                        key={student.id}
                        onClick={() => {
                          onSelect(student.id);
                          setIsOpen(false);
                          setSearchValue('');
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                          isSelected
                            ? 'bg-blue-500/20 border border-blue-500/30'
                            : 'hover:bg-slate-800/50 border border-transparent'
                        }`}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                          {student.name?.charAt(0) || 'S'}
                        </div>
                        <div className="flex-1 min-w-0 text-right">
                          <div className="text-white font-semibold text-sm truncate">
                            {student.name || 'شاگرد بدون نام'}
                          </div>
                          <div className="text-slate-400 text-xs truncate">
                            {student.email || student.goal || 'بدون اطلاعات'}
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default StudentSelector;



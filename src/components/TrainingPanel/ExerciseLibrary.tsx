/**
 * ExerciseLibrary Component
 * Middle column - Displays filterable, draggable exercises from the store
 * Uses @dnd-kit useDraggable for drag source functionality
 */

import React, { memo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { 
  Search, 
  Dumbbell, 
  Heart, 
  Zap, 
  Target,
  GripVertical,
  Plus,
  Filter,
  X,
  Loader2,
  ChevronDown,
  Sparkles,
  Flame
} from 'lucide-react';
import { useWorkoutStore, useFilteredExercises, useFilters } from '../../store';
import type { ExerciseFromDB } from '../../store/workoutStore';
import type { ExerciseType, MuscleGroup } from '../../types/training';
import { MUSCLE_GROUP_NAMES } from '../../types/training';
import { useDebounce } from '../../hooks/useDebounce';
import toast from 'react-hot-toast';

// ========== Draggable Exercise Card ==========

interface DraggableExerciseCardProps {
  exercise: ExerciseFromDB;
  onQuickAdd: (exercise: ExerciseFromDB) => void;
}

const DraggableExerciseCard: React.FC<DraggableExerciseCardProps> = memo(({ exercise, onQuickAdd }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `library-${exercise.id}`,
    data: { 
      exercise, 
      type: 'library-item',
      sourceType: 'library'
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    scale: isDragging ? 1.05 : 1,
  };

  const getTypeConfig = () => {
    const type = exercise.type?.toLowerCase() || '';
    const category = exercise.category?.toLowerCase() || '';
    
    if (category === 'cardio' || type === 'cardio') {
      return { 
        icon: <Heart size={14} className="text-red-400" />,
        badge: { label: 'کاردیو', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
        gradient: 'from-red-500/20 to-pink-500/20'
      };
    }
    if (category === 'corrective' || type === 'corrective' || type === 'warmup' || type === 'cooldown') {
      return { 
        icon: <Target size={14} className="text-teal-400" />,
        badge: { label: 'اصلاحی', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
        gradient: 'from-teal-500/20 to-cyan-500/20'
      };
    }
    if (type === 'plyometric' || exercise.name?.includes('جامپ') || exercise.name?.includes('پرش')) {
      return { 
        icon: <Zap size={14} className="text-yellow-400" />,
        badge: { label: 'پلایومتریک', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
        gradient: 'from-yellow-500/20 to-orange-500/20'
      };
    }
    return { 
      icon: <Dumbbell size={14} className="text-blue-400" />,
      badge: { label: 'مقاومتی', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      gradient: 'from-blue-500/20 to-indigo-500/20'
    };
  };

  const typeConfig = getTypeConfig();

  const getDifficultyBadge = () => {
    switch (exercise.difficulty_level) {
      case 'beginner':
        return { label: 'مبتدی', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
      case 'intermediate':
        return { label: 'متوسط', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
      case 'advanced':
        return { label: 'پیشرفته', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
      default:
        return null;
    }
  };

  const difficultyBadge = getDifficultyBadge();

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.02 }}
      className={`
        group relative rounded-xl overflow-hidden
        bg-gradient-to-br ${typeConfig.gradient}
        border border-slate-700/50 hover:border-slate-500/50
        cursor-grab active:cursor-grabbing
        transition-all duration-200
        ${isDragging ? 'shadow-2xl shadow-blue-500/30 ring-2 ring-blue-500/50 z-50' : 'shadow-md hover:shadow-lg'}
      `}
    >
      {/* Drag Handle Area - Full Card */}
      <div 
        {...attributes}
        {...listeners}
        className="p-3"
      >
        <div className="flex items-start gap-3">
          {/* Drag Handle Icon */}
          <div className="flex-shrink-0 mt-1 text-slate-500 group-hover:text-slate-400 transition-colors">
            <GripVertical size={16} />
          </div>

          {/* Exercise Icon/Preview */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-800/80 overflow-hidden flex items-center justify-center border border-slate-700/50">
            {exercise.gif_url || exercise.image_url ? (
              <img 
                src={exercise.gif_url || exercise.image_url} 
                alt={exercise.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="p-2 rounded-lg bg-slate-700/50">
                {typeConfig.icon}
              </div>
            )}
          </div>

          {/* Exercise Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-100 truncate leading-tight">
              {exercise.name}
            </h4>
            
            {/* Badges Row */}
            <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
              {/* Type Badge */}
              <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${typeConfig.badge.color}`}>
                {typeConfig.badge.label}
              </span>
              
              {/* Muscle Badge */}
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-400 border border-slate-600/40">
                {MUSCLE_GROUP_NAMES[exercise.muscle_group as MuscleGroup] || exercise.muscle_group || exercise.primary_muscle}
              </span>

              {/* Difficulty Badge */}
              {difficultyBadge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${difficultyBadge.color}`}>
                  {difficultyBadge.label}
                </span>
              )}
            </div>

            {/* Scientific Details Preview */}
            {(exercise.default_rpe || exercise.tempo) && (
              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                {exercise.default_rpe && (
                  <span className="flex items-center gap-0.5">
                    <Flame size={10} className="text-orange-400" />
                    RPE {exercise.default_rpe}
                  </span>
                )}
                {exercise.tempo && (
                  <span className="flex items-center gap-0.5">
                    ⏱️ {exercise.tempo}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Add Button - Outside drag listeners */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onQuickAdd(exercise);
        }}
        className="absolute top-2 left-2 p-2 rounded-lg 
                   bg-blue-500/20 text-blue-400 border border-blue-500/30
                   opacity-0 group-hover:opacity-100 
                   hover:bg-blue-500/30 hover:scale-110
                   transition-all duration-200 z-10"
        whileTap={{ scale: 0.9 }}
        title="افزودن سریع به برنامه"
      >
        <Plus size={14} />
      </motion.button>
    </motion.div>
  );
});

DraggableExerciseCard.displayName = 'DraggableExerciseCard';

// ========== Filter Bar Component ==========

const FilterBar: React.FC = () => {
  const filters = useFilters();
  const { setFilter, resetFilters, setSearchTerm } = useWorkoutStore();
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Update store when debounced search changes
  React.useEffect(() => {
    setSearchTerm(debouncedSearch);
  }, [debouncedSearch, setSearchTerm]);

  const hasActiveFilters = filters.muscleGroup || filters.exerciseType || 
                          filters.category || filters.equipment || filters.difficulty;

  const exerciseTypeOptions = [
    { value: '', label: 'همه انواع', icon: '📋' },
    { value: 'resistance', label: 'مقاومتی', icon: '💪' },
    { value: 'cardio', label: 'کاردیو', icon: '🏃' },
    { value: 'plyometric', label: 'پلایومتریک', icon: '⚡' },
    { value: 'corrective', label: 'اصلاحی', icon: '🎯' },
  ];

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="جستجوی تمرین..."
          className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl 
                     pl-10 pr-11 py-3 text-sm text-slate-100 placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                     transition-all duration-200"
        />
        <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
        {localSearch && (
          <button
            onClick={() => setLocalSearch('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-md 
                       text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Quick Type Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {exerciseTypeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter('exerciseType', option.value as ExerciseType || null)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap
              transition-all duration-200
              ${filters.exerciseType === option.value || (!filters.exerciseType && !option.value)
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' 
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700/50'
              }
            `}
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300 transition-colors"
      >
        <Filter size={14} />
        <span>فیلترهای پیشرفته</span>
        <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        {hasActiveFilters && (
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        )}
      </button>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-3 overflow-hidden"
          >
            {/* Muscle Group Filter */}
            <select
              value={filters.muscleGroup || ''}
              onChange={(e) => setFilter('muscleGroup', e.target.value as MuscleGroup || null)}
              className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2 
                         text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="">🏋️ همه گروه‌های عضلانی</option>
              {Object.entries(MUSCLE_GROUP_NAMES).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={resetFilters}
                className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg 
                           bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-medium
                           hover:bg-red-500/20 transition-colors"
              >
                <X size={14} />
                پاک کردن فیلترها
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ========== Main ExerciseLibrary Component ==========

interface ExerciseLibraryProps {
  className?: string;
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ className = '' }) => {
  const filteredExercises = useFilteredExercises();
  const availableExercises = useWorkoutStore(state => state.availableExercises);
  const isLoading = useWorkoutStore(state => state.isLoadingExercises);
  const addExerciseToWorkout = useWorkoutStore(state => state.addExerciseToWorkout);

  const handleQuickAdd = useCallback((exercise: ExerciseFromDB) => {
    addExerciseToWorkout(exercise);
    toast.success(`${exercise.name} اضافه شد`, {
      icon: '✅',
      duration: 1500,
      style: {
        background: '#1e293b',
        color: '#f1f5f9',
        border: '1px solid #334155',
      },
    });
  }, [addExerciseToWorkout]);

  // Note: groupedExercises can be used for future grouped view
  // Currently using flat list for simplicity

  return (
    <div className={`flex flex-col h-full bg-slate-900/60 backdrop-blur-xl rounded-2xl 
                     border border-slate-800/80 shadow-xl ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/20">
            <Dumbbell size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">کتابخانه تمرینات</h3>
            <p className="text-xs text-slate-500">
              {filteredExercises.length} از {availableExercises.length} تمرین
            </p>
          </div>
          <Sparkles size={16} className="text-yellow-400 mr-auto animate-pulse" />
        </div>
        
        <FilterBar />
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-500">
            <Loader2 size={28} className="animate-spin mb-3" />
            <span className="text-sm">در حال بارگذاری...</span>
          </div>
        ) : filteredExercises.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-40 text-slate-500"
          >
            <div className="p-4 rounded-full bg-slate-800/50 mb-3">
              <Filter size={28} />
            </div>
            <span className="text-sm font-medium">تمرینی یافت نشد</span>
            <span className="text-xs mt-1 text-slate-600">فیلترها را تغییر دهید</span>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredExercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.02 }}
              >
                <DraggableExerciseCard
                  exercise={exercise}
                  onQuickAdd={handleQuickAdd}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer Hint */}
      <div className="p-3 border-t border-slate-800/80 text-center bg-slate-900/50">
        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <span>🖱️</span>
          <span>تمرینات را بکشید و در ناحیه برنامه رها کنید</span>
        </p>
      </div>
    </div>
  );
};

export default ExerciseLibrary;

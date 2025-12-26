/**
 * ExerciseLibrary Component
 * Middle column - Shows filterable, draggable exercises from the database
 */

import React, { memo, useCallback } from 'react';
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
  Loader2
} from 'lucide-react';
import { useWorkoutStore, useFilteredExercises, useFilters } from '../../store';
import type { ExerciseFromDB } from '../../store/workoutStore';
import type { ExerciseType, MuscleGroup } from '../../types/training';
import { MUSCLE_GROUP_NAMES } from '../../types/training';
import { useDebounce } from '../../hooks/useDebounce';

// ========== Draggable Exercise Card ==========

interface DraggableExerciseCardProps {
  exercise: ExerciseFromDB;
  onAdd: (exercise: ExerciseFromDB) => void;
}

const DraggableExerciseCard: React.FC<DraggableExerciseCardProps> = memo(({ exercise, onAdd }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `library-${exercise.id}`,
    data: { exercise, type: 'library-item' },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const getExerciseTypeIcon = () => {
    const category = exercise.category?.toLowerCase() || '';
    const type = exercise.type?.toLowerCase() || '';
    
    if (category === 'cardio' || type === 'cardio') {
      return <Heart size={14} className="text-green-400" />;
    }
    if (category === 'corrective' || type === 'corrective') {
      return <Target size={14} className="text-teal-400" />;
    }
    if (type === 'plyometric') {
      return <Zap size={14} className="text-yellow-400" />;
    }
    return <Dumbbell size={14} className="text-blue-400" />;
  };

  const getExerciseTypeBadge = () => {
    const category = exercise.category?.toLowerCase() || '';
    const type = exercise.type?.toLowerCase() || '';
    
    if (category === 'cardio' || type === 'cardio') {
      return { label: 'کاردیو', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    }
    if (category === 'corrective' || type === 'corrective') {
      return { label: 'اصلاحی', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' };
    }
    if (type === 'plyometric') {
      return { label: 'پلایو', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    }
    return { label: 'مقاومتی', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
  };

  const typeBadge = getExerciseTypeBadge();

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        group relative bg-slate-800/50 hover:bg-slate-800 
        border border-slate-700/50 hover:border-slate-600
        rounded-xl p-3 cursor-grab active:cursor-grabbing
        transition-all duration-200
        ${isDragging ? 'shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/50' : ''}
      `}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div className="flex-shrink-0 mt-1 text-slate-500 group-hover:text-slate-400">
          <GripVertical size={16} />
        </div>

        {/* GIF/Image Preview */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-700/50 overflow-hidden flex items-center justify-center">
          {exercise.gif_url || exercise.image_url ? (
            <img 
              src={exercise.gif_url || exercise.image_url} 
              alt={exercise.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="text-slate-500">
              {getExerciseTypeIcon()}
            </div>
          )}
        </div>

        {/* Exercise Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-200 truncate mb-1">
            {exercise.name}
          </h4>
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Type Badge */}
            <span className={`text-[10px] px-2 py-0.5 rounded border ${typeBadge.color}`}>
              {typeBadge.label}
            </span>
            
            {/* Muscle Badge */}
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700/50 text-slate-400 border border-slate-600/30">
              {MUSCLE_GROUP_NAMES[exercise.muscle_group as MuscleGroup] || exercise.muscle_group}
            </span>

            {/* Difficulty Badge */}
            {exercise.difficulty_level && (
              <span className={`text-[10px] px-2 py-0.5 rounded border ${
                exercise.difficulty_level === 'beginner' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                exercise.difficulty_level === 'intermediate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {exercise.difficulty_level === 'beginner' ? 'مبتدی' :
                 exercise.difficulty_level === 'intermediate' ? 'متوسط' : 'پیشرفته'}
              </span>
            )}
          </div>
        </div>

        {/* Quick Add Button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onAdd(exercise);
          }}
          className="flex-shrink-0 p-2 rounded-lg bg-blue-500/20 text-blue-400 
                     hover:bg-blue-500/30 border border-blue-500/30 
                     opacity-0 group-hover:opacity-100 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
});

DraggableExerciseCard.displayName = 'DraggableExerciseCard';

// ========== Filter Bar ==========

const FilterBar: React.FC = () => {
  const filters = useFilters();
  const { setFilter, resetFilters, setSearchTerm } = useWorkoutStore();
  const [localSearch, setLocalSearch] = React.useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Update store when debounced search changes
  React.useEffect(() => {
    setSearchTerm(debouncedSearch);
  }, [debouncedSearch, setSearchTerm]);

  const hasActiveFilters = filters.muscleGroup || filters.exerciseType || 
                          filters.category || filters.equipment || filters.difficulty;

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="جستجوی حرکت..."
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl 
                     pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
        />
        <Search size={16} className="absolute right-3 top-3 text-slate-500" />
        {localSearch && (
          <button
            onClick={() => setLocalSearch('')}
            className="absolute left-3 top-3 text-slate-500 hover:text-slate-300"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Type Filter */}
        <select
          value={filters.exerciseType || ''}
          onChange={(e) => setFilter('exerciseType', e.target.value as ExerciseType || null)}
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 
                     text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="">همه انواع</option>
          <option value="resistance">💪 مقاومتی</option>
          <option value="cardio">🏃 کاردیو</option>
          <option value="plyometric">⚡ پلایومتریک</option>
          <option value="corrective">🩹 اصلاحی</option>
        </select>

        {/* Muscle Filter */}
        <select
          value={filters.muscleGroup || ''}
          onChange={(e) => setFilter('muscleGroup', e.target.value as MuscleGroup || null)}
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 
                     text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="">همه عضلات</option>
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
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg 
                       bg-red-500/20 text-red-400 border border-red-500/30 text-xs
                       hover:bg-red-500/30 transition-colors"
          >
            <X size={12} />
            پاک کردن
          </motion.button>
        )}
      </div>
    </div>
  );
};

// ========== Main Component ==========

interface ExerciseLibraryProps {
  className?: string;
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ className = '' }) => {
  const filteredExercises = useFilteredExercises();
  const isLoading = useWorkoutStore(state => state.isLoadingExercises);
  const addExerciseToWorkout = useWorkoutStore(state => state.addExerciseToWorkout);

  const handleAddExercise = useCallback((exercise: ExerciseFromDB) => {
    addExerciseToWorkout(exercise);
  }, [addExerciseToWorkout]);

  return (
    <div className={`flex flex-col h-full bg-slate-900/50 rounded-2xl border border-slate-800 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Dumbbell size={18} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">کتابخانه تمرینات</h3>
            <p className="text-xs text-slate-500">
              {filteredExercises.length} حرکت
            </p>
          </div>
        </div>
        
        <FilterBar />
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-500">
            <Loader2 size={24} className="animate-spin mb-2" />
            <span className="text-sm">در حال بارگذاری...</span>
          </div>
        ) : filteredExercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-500">
            <Filter size={24} className="mb-2" />
            <span className="text-sm">حرکتی یافت نشد</span>
            <span className="text-xs mt-1">فیلترها را تغییر دهید</span>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredExercises.map((exercise) => (
              <DraggableExerciseCard
                key={exercise.id}
                exercise={exercise}
                onAdd={handleAddExercise}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer Hint */}
      <div className="p-3 border-t border-slate-800 text-center">
        <p className="text-[10px] text-slate-500">
          💡 حرکات را بکشید و در ناحیه تمرین رها کنید
        </p>
      </div>
    </div>
  );
};

export default ExerciseLibrary;

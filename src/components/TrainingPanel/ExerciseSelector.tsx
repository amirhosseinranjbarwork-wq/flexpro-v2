/**
 * EXERCISE SELECTOR - Comprehensive Exercise Selection System
 * Complete rebuild with advanced filtering, parameters, and equipment selection
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Dumbbell, 
  Target, 
  Zap,
  Settings,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import type { Exercise, MuscleGroup, EquipmentType, DifficultyLevel } from '../../types/training';
import { MUSCLE_GROUP_NAMES, EQUIPMENT_NAMES, DIFFICULTY_NAMES } from '../../types/training';

interface ExerciseSelectorProps {
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
  selectedMuscle?: MuscleGroup;
  categoryFilter?: string;
}

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  exercises,
  onSelect,
  selectedMuscle,
  categoryFilter
}) => {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>(
    selectedMuscle ? [selectedMuscle] : []
  );
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel[]>([]);
  const [showCompoundOnly, setShowCompoundOnly] = useState(false);
  const [showUnilateralOnly, setShowUnilateralOnly] = useState(false);

  // Get unique values from exercises
  const availableMuscles = useMemo(() => {
    const muscles = new Set<MuscleGroup>();
    exercises.forEach(ex => {
      muscles.add(ex.primary_muscle);
      ex.secondary_muscles?.forEach(m => muscles.add(m));
    });
    return Array.from(muscles).sort();
  }, [exercises]);

  const availableEquipment = useMemo(() => {
    const equipment = new Set<EquipmentType>();
    exercises.forEach(ex => equipment.add(ex.equipment));
    return Array.from(equipment).sort();
  }, [exercises]);

  const availableDifficulties = useMemo(() => {
    const difficulties = new Set<DifficultyLevel>();
    exercises.forEach(ex => difficulties.add(ex.difficulty));
    return Array.from(difficulties).sort();
  }, [exercises]);

  // Filtered exercises
  const filteredExercises = useMemo(() => {
    let filtered = exercises;

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ex => 
        ex.name.toLowerCase().includes(query) ||
        ex.name_en?.toLowerCase().includes(query) ||
        ex.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(ex => ex.type === categoryFilter);
    }

    // Muscle filter
    if (selectedMuscles.length > 0) {
      filtered = filtered.filter(ex => 
        selectedMuscles.includes(ex.primary_muscle) ||
        ex.secondary_muscles?.some(m => selectedMuscles.includes(m))
      );
    }

    // Equipment filter
    if (selectedEquipment.length > 0) {
      filtered = filtered.filter(ex => 
        selectedEquipment.includes(ex.equipment)
      );
    }

    // Difficulty filter
    if (selectedDifficulty.length > 0) {
      filtered = filtered.filter(ex => 
        selectedDifficulty.includes(ex.difficulty)
      );
    }

    // Compound only
    if (showCompoundOnly) {
      filtered = filtered.filter(ex => ex.is_compound);
    }

    // Unilateral only
    if (showUnilateralOnly) {
      filtered = filtered.filter(ex => ex.is_unilateral);
    }

    return filtered;
  }, [exercises, searchQuery, categoryFilter, selectedMuscles, selectedEquipment, selectedDifficulty, showCompoundOnly, showUnilateralOnly]);

  // Toggle filter functions
  const toggleMuscle = (muscle: MuscleGroup) => {
    setSelectedMuscles(prev => 
      prev.includes(muscle) 
        ? prev.filter(m => m !== muscle)
        : [...prev, muscle]
    );
  };

  const toggleEquipment = (equipment: EquipmentType) => {
    setSelectedEquipment(prev => 
      prev.includes(equipment) 
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    );
  };

  const toggleDifficulty = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const clearAllFilters = () => {
    setSelectedMuscles(selectedMuscle ? [selectedMuscle] : []);
    setSelectedEquipment([]);
    setSelectedDifficulty([]);
    setShowCompoundOnly(false);
    setShowUnilateralOnly(false);
    setSearchQuery('');
  };

  const activeFilterCount = 
    selectedMuscles.length + 
    selectedEquipment.length + 
    selectedDifficulty.length +
    (showCompoundOnly ? 1 : 0) +
    (showUnilateralOnly ? 1 : 0);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800">
      {/* Header with Search */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="جستجوی حرکت..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">فیلترها</span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {activeFilterCount}
              </span>
            )}
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <div className="text-sm text-slate-600 dark:text-slate-400">
            {filteredExercises.length} حرکت
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {/* Muscle Groups */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <h3 className="font-semibold text-sm">گروه عضلانی</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableMuscles.map(muscle => (
                    <button
                      key={muscle}
                      onClick={() => toggleMuscle(muscle)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        selectedMuscles.includes(muscle)
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {MUSCLE_GROUP_NAMES[muscle]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Dumbbell className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-sm">تجهیزات</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableEquipment.map(equipment => (
                    <button
                      key={equipment}
                      onClick={() => toggleEquipment(equipment)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        selectedEquipment.includes(equipment)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {EQUIPMENT_NAMES[equipment]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <h3 className="font-semibold text-sm">سطح دشواری</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableDifficulties.map(difficulty => (
                    <button
                      key={difficulty}
                      onClick={() => toggleDifficulty(difficulty)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        selectedDifficulty.includes(difficulty)
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {DIFFICULTY_NAMES[difficulty]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Filters */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4 text-green-600" />
                  <h3 className="font-semibold text-sm">فیلترهای ویژه</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowCompoundOnly(!showCompoundOnly)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      showCompoundOnly
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    حرکات چند مفصلی
                  </button>
                  <button
                    onClick={() => setShowUnilateralOnly(!showUnilateralOnly)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      showUnilateralOnly
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    حرکات تک‌طرفه
                  </button>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="w-full px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                >
                  پاک کردن همه فیلترها
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredExercises.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
              حرکتی یافت نشد
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              لطفاً فیلترهای خود را تغییر دهید
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredExercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Exercise Card Component
interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onSelect }) => {
  const [expanded, setExpanded] = useState(false);

  const difficultyColors = {
    beginner: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    intermediate: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    advanced: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    elite: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };

  return (
    <motion.div
      layout
      className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
    >
      <div
        className="p-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              {exercise.name}
            </h4>
            <div className="flex flex-wrap gap-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[exercise.difficulty]}`}>
                {DIFFICULTY_NAMES[exercise.difficulty]}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                {MUSCLE_GROUP_NAMES[exercise.primary_muscle]}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                {EQUIPMENT_NAMES[exercise.equipment]}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(exercise);
            }}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            انتخاب
          </button>
        </div>

        {expanded && exercise.description && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {exercise.description}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ExerciseSelector;

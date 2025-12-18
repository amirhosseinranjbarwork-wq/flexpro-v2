import React from 'react';
import { Target, Clock, Zap, Dumbbell, Users, TrendingUp } from 'lucide-react';
import type { Exercise } from '../types/database';

interface ExerciseCardProps {
  exercise: Exercise;
  isSelected?: boolean;
  onClick?: () => void;
  showScientificData?: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  isSelected = false,
  onClick,
  showScientificData = true
}) => {
  // تعیین رنگ بر اساس دسته‌بندی
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bodybuilding': return 'border-red-500 bg-red-50 dark:bg-red-950';
      case 'cardio': return 'border-blue-500 bg-blue-50 dark:bg-blue-950';
      case 'corrective': return 'border-green-500 bg-green-50 dark:bg-green-950';
      case 'warmup': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      case 'cooldown': return 'border-purple-500 bg-purple-50 dark:bg-purple-950';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-950';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bodybuilding': return <Dumbbell size={16} />;
      case 'cardio': return <TrendingUp size={16} />;
      case 'corrective': return <Target size={16} />;
      case 'warmup': return <Zap size={16} />;
      case 'cooldown': return <Clock size={16} />;
      default: return <Dumbbell size={16} />;
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${getCategoryColor(exercise.category)}
        ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'}
      `}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getCategoryIcon(exercise.category)}
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
            {exercise.name}
          </h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty_level)}`}>
          {exercise.difficulty_level}
        </span>
      </div>

      {/* Primary Muscle */}
      <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
        <strong>Primary:</strong> {exercise.primary_muscle || exercise.muscle_group}
      </div>

      {/* Scientific Data */}
      {showScientificData && (
        <div className="space-y-1 text-xs">
          {/* RPE & RIR */}
          {(exercise.default_rpe || exercise.default_rir) && (
            <div className="flex items-center gap-1">
              <Target size={12} className="text-blue-500" />
              <span>
                {exercise.default_rpe && `RPE: ${exercise.default_rpe}`}
                {exercise.default_rpe && exercise.default_rir && ' | '}
                {exercise.default_rir && `RIR: ${exercise.default_rir}`}
              </span>
            </div>
          )}

          {/* Tempo */}
          {exercise.tempo && (
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-yellow-500" />
              <span>Tempo: {exercise.tempo}</span>
            </div>
          )}

          {/* Rest */}
          {exercise.rest_interval_seconds && (
            <div className="flex items-center gap-1">
              <Clock size={12} className="text-purple-500" />
              <span>Rest: {exercise.rest_interval_seconds}s</span>
            </div>
          )}

          {/* Unilateral */}
          {exercise.unilateral && (
            <div className="flex items-center gap-1">
              <Users size={12} className="text-orange-500" />
              <span>Unilateral</span>
            </div>
          )}
        </div>
      )}

      {/* Equipment */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {exercise.equipment_standardized}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>
      )}
    </motion.div>
  );
};

export default ExerciseCard;

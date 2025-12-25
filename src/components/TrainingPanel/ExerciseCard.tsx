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
  // تعیین رنگ بر اساس دسته‌بندی - استفاده از CSS Variables
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bodybuilding': return 'border-[var(--color-error)] bg-[var(--color-error)]/10 dark:bg-[var(--color-error)]/20';
      case 'cardio': return 'border-[var(--color-info)] bg-[var(--color-info)]/10 dark:bg-[var(--color-info)]/20';
      case 'corrective': return 'border-[var(--color-success)] bg-[var(--color-success)]/10 dark:bg-[var(--color-success)]/20';
      case 'warmup': return 'border-[var(--color-warning)] bg-[var(--color-warning)]/10 dark:bg-[var(--color-warning)]/20';
      case 'cooldown': return 'border-[var(--accent-secondary)] bg-[var(--accent-secondary)]/10 dark:bg-[var(--accent-secondary)]/20';
      default: return 'border-[var(--glass-border)] bg-[var(--glass-bg)]';
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
      case 'beginner': return 'text-[var(--color-success)] bg-[var(--color-success)]/20 dark:bg-[var(--color-success)]/30';
      case 'intermediate': return 'text-[var(--color-warning)] bg-[var(--color-warning)]/20 dark:bg-[var(--color-warning)]/30';
      case 'advanced': return 'text-[var(--color-error)] bg-[var(--color-error)]/20 dark:bg-[var(--color-error)]/30';
      default: return 'text-[var(--text-secondary)] bg-[var(--glass-bg)]';
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
          <h3 className="font-semibold text-sm text-[var(--text-primary)]">
            {exercise.name}
          </h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty_level)}`}>
          {exercise.difficulty_level}
        </span>
      </div>

      {/* Primary Muscle */}
      <div className="text-xs text-[var(--text-secondary)] mb-2">
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
      <div className="mt-2 text-xs text-[var(--text-secondary)] opacity-70">
        {exercise.equipment_standardized}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-[var(--accent-color)] rounded-full animate-pulse"></div>
      )}
    </motion.div>
  );
};

export default ExerciseCard;

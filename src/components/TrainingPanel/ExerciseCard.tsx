/**
 * EXERCISE CARD - Visual Exercise Display
 * Shows exercise info with category-specific icons
 */

import React from 'react';
import { Exercise, ExerciseCategory, Equipment } from '../../types/ultimate-training';
import Badge from '../ui/Badge';
import { translateExerciseName } from '../../utils/exerciseTranslations';
import {
  Dumbbell,
  Heart,
  Zap,
  Wind,
  Shield,
  Target,
  TrendingUp,
  Activity
} from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  isDragging?: boolean;
  compact?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  isDragging = false,
  compact = false
}) => {
<<<<<<< HEAD
  const getCategoryIcon = (category: ExerciseCategory | undefined) => {
    const iconClass = 'w-4 h-4';
    if (!category) return <Activity className={iconClass} />;
    switch (category) {
      case ExerciseCategory.RESISTANCE:
        return <Dumbbell className={iconClass} />;
      case ExerciseCategory.CARDIO:
        return <Heart className={iconClass} />;
      case ExerciseCategory.PLYOMETRIC:
        return <Zap className={iconClass} />;
      case ExerciseCategory.POWERLIFTING:
        return <TrendingUp className={iconClass} />;
      case ExerciseCategory.STRONGMAN:
        return <Target className={iconClass} />;
      case ExerciseCategory.STRETCHING:
        return <Wind className={iconClass} />;
      case ExerciseCategory.CORRECTIVE:
        return <Shield className={iconClass} />;
      default:
        return <Activity className={iconClass} />;
    }
  };

<<<<<<< HEAD
  const getCategoryColor = (category: ExerciseCategory | undefined) => {
    if (!category) return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    switch (category) {
      case ExerciseCategory.RESISTANCE:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case ExerciseCategory.CARDIO:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case ExerciseCategory.PLYOMETRIC:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case ExerciseCategory.POWERLIFTING:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case ExerciseCategory.STRONGMAN:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case ExerciseCategory.STRETCHING:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case ExerciseCategory.CORRECTIVE:
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    }
  };

<<<<<<< HEAD
  const getDifficultyColor = (difficulty: string | undefined) => {
    if (!difficulty) return 'bg-slate-500';
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-orange-500';
      case 'elite':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };

<<<<<<< HEAD
  const getEquipmentIcon = (equipment: Equipment | undefined) => {
    if (!equipment) return '•';
    // Map equipment to emoji/icon (simplified)
    const icons: Record<string, string> = {
      barbell: '🏋️',
      dumbbell: '💪',
      kettlebell: '⚫',
      cable: '🔗',
      machine: '⚙️',
      bodyweight: '🧘',
      bands: '🎗️',
      trx: '🔺',
      none: '✋'
    };
<<<<<<< HEAD
    return icons[String(equipment)] || '•';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-colors">
        {exercise.category && (
          <div className={`p-1.5 rounded ${getCategoryColor(exercise.category)}`}>
            {getCategoryIcon(exercise.category)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{translateExerciseName(exercise.name || 'Unnamed Exercise')}</h4>
          {exercise.equipment && exercise.equipment.length > 0 && (
            <div className="flex items-center gap-1 mt-0.5">
              {exercise.equipment
                .slice(0, 2)
                .filter(eq => eq != null)
                .map((eq, idx) => (
                  <span key={idx} className="text-xs">
                    {getEquipmentIcon(eq)}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative bg-white dark:bg-slate-800 rounded-lg border-2 
        ${isDragging ? 'border-blue-500 shadow-2xl' : 'border-slate-200 dark:border-slate-700'}
        hover:border-blue-400 hover:shadow-md
        transition-all duration-200
        overflow-hidden
      `}
    >
      {/* Difficulty Indicator */}
      {exercise.difficulty && (
        <div
          className={`absolute top-0 left-0 w-1 h-full ${getDifficultyColor(exercise.difficulty)}`}
        />
      )}

      <div className="p-3 pl-4">
        {/* Header */}
        <div className="flex items-start gap-2 mb-2">
          {exercise.category && (
            <div className={`p-2 rounded-lg ${getCategoryColor(exercise.category)}`}>
              {getCategoryIcon(exercise.category)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">
              {translateExerciseName(exercise.name || 'Unnamed Exercise')}
            </h3>
            <div className="flex flex-wrap gap-1">
              {exercise.category && (
                <Badge variant="default" className="text-xs px-1.5 py-0">
                  {String(exercise.category)}
                </Badge>
              )}
              {exercise.difficulty && (
                <Badge variant="default" className="text-xs px-1.5 py-0 capitalize">
                  {String(exercise.difficulty)}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Muscle Groups */}
        <div className="mb-2">
          {exercise.primaryMuscles && exercise.primaryMuscles.length > 0 && (
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
              Primary: {exercise.primaryMuscles
                .filter(m => m != null)
                .map(m => String(m).replace('_', ' '))
                .join(', ')}
            </div>
          )}
          {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
            <div className="text-xs text-slate-500 dark:text-slate-500">
              Secondary: {exercise.secondaryMuscles
                .slice(0, 2)
                .filter(m => m != null)
                .map(m => String(m).replace('_', ' '))
                .join(', ')}
            </div>
          )}
            </div>
          )}
        </div>

        {/* Equipment */}
        {exercise.equipment && exercise.equipment.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {exercise.equipment
              .filter(eq => eq != null)
              .map((eq, idx) => (
                <span
                  key={idx}
                  className="text-sm px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-400"
                >
                  {getEquipmentIcon(eq)} {String(eq).replace('_', ' ')}
                </span>
              ))}
          </div>
        )}

        {/* Description */}
        {exercise.description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
            {exercise.description}
          </p>
        )}

        {/* Tags */}
        {exercise.tags && exercise.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {exercise.tags
              .slice(0, 3)
              .filter(tag => tag != null)
              .map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs px-1.5 py-0"
                >
                  {String(tag)}
                </Badge>
              ))}
          </div>
        )}
          </div>
        )}

        {/* Drag Hint */}
        {!isDragging && (
          <div className="text-xs text-slate-400 mt-2 text-center">
            ← Drag to add →
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseCard;

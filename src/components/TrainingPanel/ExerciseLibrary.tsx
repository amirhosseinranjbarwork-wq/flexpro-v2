/**
 * EXERCISE LIBRARY - Draggable Exercise Cards
 * Column 2: The Library
 */

import React, { useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useWorkoutStore } from '../../store/workoutStore';
import { Exercise } from '../../types/ultimate-training';
import { ExerciseCard } from './ExerciseCard';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Library, Lightbulb } from 'lucide-react';

export const ExerciseLibrary: React.FC = () => {
  const { getFilteredExercises, getSmartSuggestions, activeDayId } = useWorkoutStore();
  const filteredExercises = getFilteredExercises();
  const smartSuggestions = activeDayId ? getSmartSuggestions(activeDayId) : [];

  const hasSuggestions = smartSuggestions.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Library className="w-5 h-5 text-purple-600" />
          <h2 className="font-semibold text-lg">Exercise Library</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {filteredExercises.length} exercises
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Smart Suggestions */}
          {hasSuggestions && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <h3 className="font-semibold text-sm text-yellow-700 dark:text-yellow-500">
                  Smart Suggestions
                </h3>
              </div>
              <div className="space-y-2">
                {smartSuggestions.slice(0, 3).map(exercise => (
                  <DraggableExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    isSuggestion
                  />
                ))}
              </div>
              <div className="my-4 border-t border-slate-200 dark:border-slate-700" />
            </div>
          )}

          {/* All Exercises */}
          <div className="space-y-2">
            {filteredExercises.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Library className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No exercises found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              filteredExercises.map(exercise => (
                <DraggableExerciseCard key={exercise.id} exercise={exercise} />
              ))
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

// Draggable wrapper for exercise cards
interface DraggableExerciseCardProps {
  exercise: Exercise;
  isSuggestion?: boolean;
}

const DraggableExerciseCard: React.FC<DraggableExerciseCardProps> = ({
  exercise,
  isSuggestion = false
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: exercise.id,
    data: { exercise }
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing ${
        isSuggestion ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''
      }`}
    >
      <ExerciseCard exercise={exercise} isDragging={isDragging} />
      {isSuggestion && (
        <Badge
          variant="default"
          className="absolute top-2 right-2 bg-yellow-500 text-yellow-900"
        >
          Suggested
        </Badge>
      )}
    </div>
  );
};

export default ExerciseLibrary;

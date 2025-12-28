/**
 * EXERCISE LIBRARY - Draggable Exercise Cards
 * Column 2: The Library
 */

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useWorkoutStore } from '../../store/workoutStore';
import { Exercise, ExerciseCategory } from '../../types/ultimate-training';
import { ExerciseCard } from './ExerciseCard';
import { ScrollArea } from '../ui/scroll-area';
import Badge from '../ui/Badge';
import { Library } from 'lucide-react';

interface ExerciseLibraryProps {
  categoryFilter?: ExerciseCategory;
}

export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ categoryFilter }) => {
  const { getFilteredExercises } = useWorkoutStore();
  let filteredExercises = getFilteredExercises();
  
  // Filter by category if provided
  if (categoryFilter) {
    filteredExercises = filteredExercises.filter(ex => ex.category === categoryFilter);
  }

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
        <div className="p-4 space-y-2">
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
}

const DraggableExerciseCard: React.FC<DraggableExerciseCardProps> = ({
  exercise
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
      className="cursor-grab active:cursor-grabbing"
    >
      <ExerciseCard exercise={exercise} isDragging={isDragging} />
    </div>
  );
};

export default ExerciseLibrary;

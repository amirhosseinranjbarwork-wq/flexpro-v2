/**
 * WORKOUT CANVAS - Workout Day Builder
 * Column 3: The Canvas
 */

import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useWorkoutStore } from '../../store/workoutStore';
import { WorkoutExerciseCard } from './WorkoutExerciseCard';
import { WorkoutDaySelector } from './WorkoutDaySelector';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Plus,
  Copy,
  Trash2,
  Calendar,
  Target,
  Timer,
  TrendingUp
} from 'lucide-react';

export const WorkoutCanvas: React.FC = () => {
  const {
    currentProgram,
    activeDayId,
    getCurrentDay,
    addDay,
    deleteDay,
    copyDay,
    setActiveDay
  } = useWorkoutStore();

  const currentDay = getCurrentDay();
  const [showAddDay, setShowAddDay] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: 'workout-canvas',
    data: {
      accepts: ['exercise']
    }
  });

  if (!currentProgram) {
    return null;
  }

  const handleAddDay = () => {
    const dayNumber = currentProgram.weeklySchedule.length + 1;
    addDay(`Day ${dayNumber}`, `Training Day ${dayNumber}`);
    setShowAddDay(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Day Selector */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Workout Days
          </h2>
          <Button
            size="sm"
            onClick={handleAddDay}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Day
          </Button>
        </div>

        {/* Day Tabs */}
        <Tabs value={activeDayId || undefined} onValueChange={setActiveDay}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {currentProgram.weeklySchedule.map(day => (
              <TabsTrigger key={day.id} value={day.id} className="flex items-center gap-2">
                {day.name}
                <span className="text-xs text-slate-500">
                  ({day.exercises.length})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Day Info */}
      {currentDay && (
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-purple-600" />
                <h3 className="font-semibold">{currentDay.name}</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {currentDay.focus || 'No focus set'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => activeDayId && copyDay(activeDayId)}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => activeDayId && deleteDay(activeDayId)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise List */}
      <ScrollArea className="flex-1">
        <div
          ref={setNodeRef}
          className={`
            min-h-full p-4 transition-all duration-200
            ${isOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
          `}
        >
          {!currentDay ? (
            <div className="flex items-center justify-center h-full text-center py-20">
              <div>
                <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold mb-2">No Day Selected</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Create or select a workout day to start building your program
                </p>
                <Button onClick={handleAddDay}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Day
                </Button>
              </div>
            </div>
          ) : currentDay.exercises.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center py-20">
              <div>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                  <Target className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Empty Canvas</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md">
                  Drag exercises from the library to build your workout.
                  Or use the smart suggestions to get started!
                </p>
                {isOver && (
                  <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-200 font-medium">
                      Drop exercise here to add it!
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <SortableContext
              items={currentDay.exercises.map(ex => ex.exerciseId)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3 max-w-4xl mx-auto">
                {currentDay.exercises.map((workoutExercise, index) => (
                  <WorkoutExerciseCard
                    key={workoutExercise.exerciseId}
                    workoutExercise={workoutExercise}
                    dayId={currentDay.id}
                    index={index}
                  />
                ))}

                {/* Drop Zone Hint */}
                {isOver && (
                  <div className="border-2 border-dashed border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 text-center">
                    <Plus className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-blue-800 dark:text-blue-200 font-medium">
                      Drop here to add to end
                    </p>
                  </div>
                )}
              </div>
            </SortableContext>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WorkoutCanvas;

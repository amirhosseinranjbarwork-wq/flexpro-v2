/**
 * ULTIMATE TRAINING PANEL - Modern 3-Column Layout
 * Revolutionary fitness programming interface
 */

import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { useWorkoutStore } from '../../store/workoutStore';
import { Exercise } from '../../types/ultimate-training';
import { ExerciseLibrary } from './ExerciseLibrary';
import { ExerciseCard } from './ExerciseCard';
import { WorkoutCanvas } from './WorkoutCanvas';
import { ExerciseFilterSidebar } from './ExerciseFilterSidebar';
import { WorkoutAnalyticsFooter } from './WorkoutAnalyticsFooter';
import { Button } from '../ui/button';
import { 
  LayoutDashboard, 
  PanelLeftClose, 
  PanelLeftOpen,
  Plus,
  Save,
  Download,
  Share2
} from 'lucide-react';

export const UltimateTrainingPanel: React.FC = () => {
  const {
    currentProgram,
    activeDayId,
    isLibraryOpen,
    isSidebarCollapsed,
    toggleSidebar,
    createProgram,
    addDay
  } = useWorkoutStore();

  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  // Initialize program if none exists
  useEffect(() => {
    if (!currentProgram) {
      createProgram('My Training Program', 'hypertrophy');
      addDay('Day 1', 'Upper Body Push');
    }
  }, [currentProgram, createProgram, addDay]);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const exerciseId = event.active.id as string;
    const exercise = useWorkoutStore.getState().getFilteredExercises()
      .find(ex => ex.id === exerciseId);
    if (exercise) {
      setActiveExercise(exercise);
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && activeDayId) {
      const exerciseId = active.id as string;
      const exercise = useWorkoutStore.getState().getFilteredExercises()
        .find(ex => ex.id === exerciseId);
      
      if (exercise) {
        useWorkoutStore.getState().addExerciseToDay(activeDayId, exercise);
      }
    }
    
    setActiveExercise(null);
  };

  if (!currentProgram) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LayoutDashboard className="w-16 h-16 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">No Program Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Create a new training program to get started</p>
          <Button onClick={() => createProgram('My Training Program', 'hypertrophy')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Program
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                {isSidebarCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {currentProgram.name}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {currentProgram.goalType.charAt(0).toUpperCase() + currentProgram.goalType.slice(1)} Program
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Main 3-Column Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Column 1: Filter Sidebar (The Source) */}
          <ExerciseFilterSidebar />

          {/* Column 2: Exercise Library (The Library) */}
          {isLibraryOpen && (
            <div className="w-80 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col">
              <ExerciseLibrary />
            </div>
          )}

          {/* Column 3: Workout Canvas (The Canvas) */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <WorkoutCanvas />
            
            {/* Analytics Footer */}
            {activeDayId && <WorkoutAnalyticsFooter dayId={activeDayId} />}
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeExercise && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-4 border-2 border-blue-500 opacity-90">
            <ExerciseCard exercise={activeExercise} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default UltimateTrainingPanel;

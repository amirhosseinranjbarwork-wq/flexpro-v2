/**
 * TrainingLayout Component
 * Main 3-column layout for the Scientific Workout Builder
 * Orchestrates drag-and-drop between ExerciseLibrary and WorkoutCanvas
 */

import React, { useEffect, useCallback, useState } from 'react';
import { 
  DndContext, 
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { 
  Dumbbell, 
  Heart, 
  Zap, 
  Target, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useWorkoutStore } from '../../store';
import type { ExerciseFromDB } from '../../store/workoutStore';
import ExerciseLibrary from './ExerciseLibrary';
import WorkoutCanvas from './WorkoutCanvas';
import { useExercises } from '../../hooks/useExercises';
import toast from 'react-hot-toast';

// ========== Drag Overlay Item ==========

interface DragOverlayItemProps {
  exercise: ExerciseFromDB;
}

const DragOverlayItem: React.FC<DragOverlayItemProps> = ({ exercise }) => {
  const getTypeIcon = () => {
    const category = exercise.category?.toLowerCase() || '';
    const type = exercise.type?.toLowerCase() || '';
    
    if (category === 'cardio' || type === 'cardio') {
      return <Heart size={16} className="text-green-400" />;
    }
    if (category === 'corrective' || type === 'corrective') {
      return <Target size={16} className="text-teal-400" />;
    }
    if (type === 'plyometric') {
      return <Zap size={16} className="text-yellow-400" />;
    }
    return <Dumbbell size={16} className="text-blue-400" />;
  };

  return (
    <div className="bg-slate-800 border border-blue-500/50 rounded-xl p-4 shadow-2xl shadow-blue-500/20 
                    transform rotate-3 scale-105">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-500/20">
          {getTypeIcon()}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-200">{exercise.name}</h4>
          <span className="text-xs text-slate-400">{exercise.muscle_group}</span>
        </div>
      </div>
    </div>
  );
};

// ========== Quick Stats Panel (Left Column) ==========

const QuickStatsPanel: React.FC = () => {
  const currentDay = useWorkoutStore(state => state.currentDay);
  const workoutDays = useWorkoutStore(state => state.workoutDays);
  
  const dayStats = Object.entries(workoutDays).map(([day, data]) => ({
    day: parseInt(day),
    count: data?.exercises?.length || 0,
  }));

  const totalExercises = dayStats.reduce((sum, d) => sum + d.count, 0);
  const activeDays = dayStats.filter(d => d.count > 0).length;

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Weekly Overview */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <RefreshCw size={14} className="text-blue-400" />
          نمای هفتگی
        </h3>
        
        <div className="space-y-2">
          {dayStats.map(({ day, count }) => (
            <div 
              key={day}
              className={`
                flex items-center justify-between p-2 rounded-lg
                ${currentDay === day ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-slate-800/30'}
              `}
            >
              <span className={`text-xs ${currentDay === day ? 'text-blue-400 font-semibold' : 'text-slate-400'}`}>
                روز {day}
              </span>
              <span className={`text-xs ${count > 0 ? 'text-green-400' : 'text-slate-600'}`}>
                {count} حرکت
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-slate-800/30 rounded-lg p-2">
              <span className="text-lg font-bold text-blue-400">{totalExercises}</span>
              <span className="block text-[10px] text-slate-500">کل حرکات</span>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-2">
              <span className="text-lg font-bold text-green-400">{activeDays}</span>
              <span className="block text-[10px] text-slate-500">روز فعال</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4 flex-1">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <AlertCircle size={14} className="text-yellow-400" />
          راهنما
        </h3>
        
        <div className="space-y-3 text-xs text-slate-400">
          <div className="flex items-start gap-2">
            <span className="text-blue-400">💡</span>
            <span>حرکات را از کتابخانه به ناحیه تمرین بکشید</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400">📊</span>
            <span>RPE ۷-۸ برای حجم، ۸-۹ برای قدرت ایده‌آل است</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-400">⏱️</span>
            <span>تمپو 3-1-2-0 کنترل و TUT را افزایش می‌دهد</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-400">❤️</span>
            <span>Zone 2 برای چربی‌سوزی، Zone 4 برای استقامت</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-400">🩹</span>
            <span>حرکات اصلاحی را قبل از تمرین اصلی انجام دهید</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== Main Layout ==========

interface TrainingLayoutProps {
  onSaveWorkout?: () => void;
}

const TrainingLayout: React.FC<TrainingLayoutProps> = ({ onSaveWorkout }) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [draggedExercise, setDraggedExercise] = useState<ExerciseFromDB | null>(null);

  const { 
    setAvailableExercises, 
    setLoadingExercises,
    addExerciseToWorkout,
    reorderExercises,
    setDragging,
    availableExercises,
  } = useWorkoutStore();

  // Fetch exercises from hook
  const { data: exercisesData, isLoading, error } = useExercises();

  // Load exercises into store
  useEffect(() => {
    setLoadingExercises(isLoading);
    
    if (exercisesData && Array.isArray(exercisesData)) {
      setAvailableExercises(exercisesData as ExerciseFromDB[]);
    }
  }, [exercisesData, isLoading, setAvailableExercises, setLoadingExercises]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error('خطا در بارگذاری تمرینات');
    }
  }, [error]);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);
    setDragging(true);

    // Check if dragging from library
    if (String(active.id).startsWith('library-')) {
      const exerciseId = String(active.id).replace('library-', '');
      const exercise = availableExercises.find(e => e.id === exerciseId);
      if (exercise) {
        setDraggedExercise(exercise);
      }
    }
  }, [availableExercises, setDragging]);

  // Handle drag over
  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // Could add visual feedback here
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setDraggedExercise(null);
    setDragging(false);

    if (!over) return;

    // Dragging from library to canvas
    if (String(active.id).startsWith('library-') && over.id === 'workout-canvas') {
      const exerciseId = String(active.id).replace('library-', '');
      const exercise = availableExercises.find(e => e.id === exerciseId);
      if (exercise) {
        addExerciseToWorkout(exercise);
        toast.success(`${exercise.name} اضافه شد`, { duration: 1500 });
      }
      return;
    }

    // Reordering within canvas
    if (!String(active.id).startsWith('library-') && !String(over.id).startsWith('library-')) {
      if (active.id !== over.id) {
        const exercises = useWorkoutStore.getState().getCurrentDayExercises();
        const oldIndex = exercises.findIndex(e => e.instanceId === active.id);
        const newIndex = exercises.findIndex(e => e.instanceId === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          reorderExercises(oldIndex, newIndex);
        }
      }
    }
  }, [availableExercises, addExerciseToWorkout, reorderExercises, setDragging]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-[calc(100vh-200px)] min-h-[600px]">
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Left Column - Quick Stats */}
          <div className="col-span-2 hidden lg:block">
            <QuickStatsPanel />
          </div>

          {/* Middle Column - Exercise Library */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <ExerciseLibrary className="h-full" />
          </div>

          {/* Right Column - Workout Canvas */}
          <div className="col-span-12 md:col-span-7 lg:col-span-6">
            <WorkoutCanvas className="h-full" onSave={onSaveWorkout} />
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={null}>
        {activeId && draggedExercise && (
          <DragOverlayItem exercise={draggedExercise} />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default TrainingLayout;

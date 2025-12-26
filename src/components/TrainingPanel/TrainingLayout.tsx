/**
 * TrainingLayout Component
 * Main container for the 3-column Scientific Workout Builder
 * Handles DndContext, drag events, and orchestrates library <-> canvas interactions
 */

import React, { useState, useCallback } from 'react';
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
  UniqueIdentifier,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Heart, 
  Zap, 
  Target, 
  Info,
  TrendingUp,
  Award,
  Flame,
  Clock,
  Activity
} from 'lucide-react';
import { useWorkoutStore } from '../../store';
import type { ExerciseFromDB } from '../../store/workoutStore';
import ExerciseLibrary from './ExerciseLibrary';
import WorkoutCanvas from './WorkoutCanvas';
import toast from 'react-hot-toast';

// ========== Drag Overlay Item ==========

interface DragOverlayItemProps {
  exercise: ExerciseFromDB;
}

const DragOverlayItem: React.FC<DragOverlayItemProps> = ({ exercise }) => {
  const getTypeConfig = () => {
    const type = exercise.type?.toLowerCase() || '';
    const category = exercise.category?.toLowerCase() || '';
    
    if (category === 'cardio' || type === 'cardio') {
      return { icon: <Heart size={18} />, color: 'from-red-500 to-pink-500', label: 'کاردیو' };
    }
    if (category === 'corrective' || type === 'corrective') {
      return { icon: <Target size={18} />, color: 'from-teal-500 to-cyan-500', label: 'اصلاحی' };
    }
    if (type === 'plyometric') {
      return { icon: <Zap size={18} />, color: 'from-yellow-500 to-orange-500', label: 'پلایومتریک' };
    }
    return { icon: <Dumbbell size={18} />, color: 'from-blue-500 to-indigo-500', label: 'مقاومتی' };
  };

  const typeConfig = getTypeConfig();

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, rotate: -5 }}
      animate={{ scale: 1.05, opacity: 1, rotate: 3 }}
      className={`
        bg-gradient-to-br ${typeConfig.color} 
        border-2 border-white/20 rounded-2xl p-4 
        shadow-2xl shadow-blue-500/30
        min-w-[200px] max-w-[280px]
      `}
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
          <span className="text-white">{typeConfig.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white truncate">{exercise.name}</h4>
          <span className="text-xs text-white/70">{typeConfig.label}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
        <span>🎯 در حال انتقال...</span>
      </div>
    </motion.div>
  );
};

// ========== Quick Stats Sidebar (Left Column) ==========

const QuickStatsSidebar: React.FC = () => {
  const currentDay = useWorkoutStore(state => state.currentDay);
  const workoutDays = useWorkoutStore(state => state.workoutDays);
  
  // Calculate weekly stats
  const weeklyStats = Object.values(workoutDays).reduce(
    (acc, day) => {
      if (!day?.exercises) return acc;
      const dayExercises = day.exercises;
      
      acc.totalExercises += dayExercises.length;
      dayExercises.forEach(ex => {
        if (ex.config.type === 'resistance') {
          acc.totalSets += (ex.config as any).sets || 0;
        }
        if (ex.config.type === 'cardio') {
          acc.totalCardioMinutes += (ex.config as any).durationMinutes || 0;
        }
      });
      if (dayExercises.length > 0) acc.activeDays++;
      
      return acc;
    },
    { totalExercises: 0, totalSets: 0, totalCardioMinutes: 0, activeDays: 0 }
  );

  const statItems = [
    { 
      icon: <Activity size={16} />, 
      label: 'روز فعال', 
      value: weeklyStats.activeDays,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    { 
      icon: <Dumbbell size={16} />, 
      label: 'کل تمرینات', 
      value: weeklyStats.totalExercises,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    { 
      icon: <TrendingUp size={16} />, 
      label: 'کل ست‌ها', 
      value: weeklyStats.totalSets,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    { 
      icon: <Clock size={16} />, 
      label: 'کاردیو (دقیقه)', 
      value: weeklyStats.totalCardioMinutes,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10'
    },
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Weekly Overview Card */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Award size={18} className="text-yellow-400" />
          <h3 className="text-sm font-bold text-white">نمای هفتگی</h3>
        </div>
        
        <div className="space-y-3">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-2.5 rounded-xl ${item.bgColor} border border-slate-700/30`}
            >
              <span className={item.color}>{item.icon}</span>
              <div className="flex-1">
                <span className="text-[11px] text-slate-500 block">{item.label}</span>
                <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Day Progress Card */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Flame size={18} className="text-orange-400" />
          <h3 className="text-sm font-bold text-white">پیشرفت هفته</h3>
        </div>
        
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const hasExercises = (workoutDays[day]?.exercises?.length || 0) > 0;
            const isCurrentDay = currentDay === day;
            
            return (
              <div 
                key={day}
                className={`
                  flex items-center gap-2 p-2 rounded-lg transition-colors
                  ${isCurrentDay ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-slate-800/30'}
                `}
              >
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
                  ${hasExercises 
                    ? 'bg-green-500 text-white' 
                    : isCurrentDay 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-700 text-slate-400'
                  }
                `}>
                  {hasExercises ? '✓' : day}
                </div>
                <span className={`text-xs ${isCurrentDay ? 'text-blue-400 font-medium' : 'text-slate-500'}`}>
                  روز {day}
                </span>
                <span className="text-[10px] text-slate-600 mr-auto">
                  {workoutDays[day]?.exercises?.length || 0} تمرین
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips Card */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-4 shadow-xl flex-1">
        <div className="flex items-center gap-2 mb-4">
          <Info size={18} className="text-cyan-400" />
          <h3 className="text-sm font-bold text-white">نکات علمی</h3>
        </div>
        
        <div className="space-y-3 text-xs text-slate-400">
          <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <span className="text-blue-400 mt-0.5">💡</span>
            <span>برای حجم عضلانی، RPE 7-8 ایده‌آل است</span>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-lg bg-green-500/5 border border-green-500/10">
            <span className="text-green-400 mt-0.5">⏱️</span>
            <span>تمپو 3-1-2-0 برای کنترل بیشتر</span>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
            <span className="text-red-400 mt-0.5">❤️</span>
            <span>Zone 2 برای چربی‌سوزی بهینه</span>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
            <span className="text-yellow-400 mt-0.5">⚡</span>
            <span>پلایومتریک قبل از تمرین مقاومتی</span>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-lg bg-teal-500/5 border border-teal-500/10">
            <span className="text-teal-400 mt-0.5">🎯</span>
            <span>حرکات اصلاحی در گرم‌کردن</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== Main TrainingLayout Component ==========

interface TrainingLayoutProps {
  onSaveWorkout?: () => void;
}

const TrainingLayout: React.FC<TrainingLayoutProps> = ({ onSaveWorkout }) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [draggedExercise, setDraggedExercise] = useState<ExerciseFromDB | null>(null);

  const { 
    addExerciseToWorkout,
    reorderExercises,
    setDragging,
    availableExercises,
  } = useWorkoutStore();

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activation
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

    // If dragging from library, find the exercise
    if (String(active.id).startsWith('library-')) {
      const exerciseId = String(active.id).replace('library-', '');
      const exercise = availableExercises.find(e => e.id === exerciseId);
      if (exercise) {
        setDraggedExercise(exercise);
      }
    }
  }, [availableExercises, setDragging]);

  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setDraggedExercise(null);
    setDragging(false);

    if (!over) return;

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);

    // Scenario A: Dragging from Library to Canvas (Add New Exercise)
    if (activeIdStr.startsWith('library-') && overIdStr === 'workout-canvas') {
      const exerciseId = activeIdStr.replace('library-', '');
      const exercise = availableExercises.find(e => e.id === exerciseId);
      
      if (exercise) {
        addExerciseToWorkout(exercise);
        toast.success(`${exercise.name} اضافه شد`, {
          icon: '✅',
          duration: 2000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
        });
      }
      return;
    }

    // Scenario B: Reordering within Canvas
    if (!activeIdStr.startsWith('library-') && !overIdStr.startsWith('library-') && overIdStr !== 'workout-canvas') {
      if (active.id !== over.id) {
        const exercises = useWorkoutStore.getState().getCurrentDayExercises();
        const oldIndex = exercises.findIndex(e => e.instanceId === activeIdStr);
        const newIndex = exercises.findIndex(e => e.instanceId === overIdStr);
        
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
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
      onDragEnd={handleDragEnd}
    >
      <div className="h-[calc(100vh-180px)] min-h-[650px]">
        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Left Column - Quick Stats (Hidden on small screens) */}
          <div className="col-span-2 hidden lg:block">
            <QuickStatsSidebar />
          </div>

          {/* Middle Column - Exercise Library */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4 h-full">
            <ExerciseLibrary className="h-full" />
          </div>

          {/* Right Column - Workout Canvas */}
          <div className="col-span-12 md:col-span-7 lg:col-span-6 h-full">
            <WorkoutCanvas className="h-full" onSave={onSaveWorkout} />
          </div>
        </div>
      </div>

      {/* Drag Overlay - Floating preview while dragging */}
      <DragOverlay dropAnimation={{
        duration: 200,
        easing: 'ease-out',
      }}>
        {activeId && draggedExercise && (
          <DragOverlayItem exercise={draggedExercise} />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default TrainingLayout;

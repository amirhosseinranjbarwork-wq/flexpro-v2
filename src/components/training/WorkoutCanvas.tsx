/**
 * WorkoutCanvas Component
 * Right column - Droppable area for workout exercises with sorting
 */

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { 
  Target, 
  Clock, 
  Dumbbell, 
  Trash2, 
  Save,
  Share2,
  BarChart2
} from 'lucide-react';
import { useWorkoutStore, useCurrentDayExercises, useWorkoutStats } from '../../store';
import ExerciseConfigCard from './ExerciseConfigCard';
import type { WorkoutExerciseInstance } from '../../store/workoutStore';

// ========== Empty State ==========

const EmptyCanvasState: React.FC<{ isOver: boolean }> = ({ isOver }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`
      flex flex-col items-center justify-center h-64 rounded-xl border-2 border-dashed
      transition-all duration-300
      ${isOver 
        ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
        : 'border-slate-700 bg-slate-800/30'
      }
    `}
  >
    <motion.div
      animate={isOver ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Dumbbell size={48} className={`mb-4 ${isOver ? 'text-blue-400' : 'text-slate-600'}`} />
    </motion.div>
    <h4 className={`text-lg font-semibold mb-2 ${isOver ? 'text-blue-400' : 'text-slate-500'}`}>
      {isOver ? 'رها کنید!' : 'برنامه خالی است'}
    </h4>
    <p className="text-sm text-slate-600 text-center max-w-xs">
      {isOver 
        ? 'حرکت را اینجا رها کنید تا به برنامه اضافه شود' 
        : 'حرکات را از کتابخانه بکشید و اینجا رها کنید تا برنامه تمرینی بسازید'
      }
    </p>
  </motion.div>
);

// ========== Summary Footer ==========

const WorkoutSummary: React.FC = memo(() => {
  const stats = useWorkoutStats();

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Exercise Count */}
      <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-1">
          <Dumbbell size={14} className="text-blue-400" />
          <span className="text-[10px] text-slate-400">حرکات</span>
        </div>
        <span className="text-xl font-bold text-slate-200">{stats.exerciseCount}</span>
      </div>

      {/* Total Sets */}
      <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-1">
          <BarChart2 size={14} className="text-green-400" />
          <span className="text-[10px] text-slate-400">کل ست‌ها</span>
        </div>
        <span className="text-xl font-bold text-slate-200">{stats.totalSets}</span>
      </div>

      {/* Estimated Duration */}
      <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-1">
          <Clock size={14} className="text-yellow-400" />
          <span className="text-[10px] text-slate-400">زمان تخمینی</span>
        </div>
        <span className="text-xl font-bold text-slate-200">{stats.estimatedMinutes}′</span>
      </div>
    </div>
  );
});

WorkoutSummary.displayName = 'WorkoutSummary';

// ========== Action Bar ==========

interface ActionBarProps {
  onClear: () => void;
  onSave: () => void;
  exerciseCount: number;
}

const ActionBar: React.FC<ActionBarProps> = memo(({ onClear, onSave, exerciseCount }) => (
  <div className="flex items-center gap-2">
    <motion.button
      onClick={onSave}
      disabled={exerciseCount === 0}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
        transition-all duration-200
        ${exerciseCount > 0
          ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20'
          : 'bg-slate-700 text-slate-500 cursor-not-allowed'
        }
      `}
      whileHover={exerciseCount > 0 ? { scale: 1.02 } : {}}
      whileTap={exerciseCount > 0 ? { scale: 0.98 } : {}}
    >
      <Save size={14} />
      ذخیره برنامه
    </motion.button>

    <button
      onClick={onClear}
      disabled={exerciseCount === 0}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-xl text-sm
        border transition-colors
        ${exerciseCount > 0
          ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
          : 'border-slate-700 text-slate-600 cursor-not-allowed'
        }
      `}
    >
      <Trash2 size={14} />
    </button>

    <button
      disabled={exerciseCount === 0}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-xl text-sm
        border transition-colors
        ${exerciseCount > 0
          ? 'border-slate-600 text-slate-400 hover:bg-slate-700/50'
          : 'border-slate-700 text-slate-600 cursor-not-allowed'
        }
      `}
    >
      <Share2 size={14} />
    </button>
  </div>
));

ActionBar.displayName = 'ActionBar';

// ========== Day Tabs ==========

interface DayTabsProps {
  currentDay: number;
  onDayChange: (day: number) => void;
  workoutDays: Record<number, { exercises: WorkoutExerciseInstance[] }>;
}

const DayTabs: React.FC<DayTabsProps> = memo(({ currentDay, onDayChange, workoutDays }) => (
  <div className="flex gap-1 p-1 bg-slate-800/30 rounded-xl">
    {[1, 2, 3, 4, 5, 6, 7].map(day => {
      const hasExercises = (workoutDays[day]?.exercises?.length || 0) > 0;
      return (
        <button
          key={day}
          onClick={() => onDayChange(day)}
          className={`
            relative flex-1 px-3 py-2 rounded-lg text-xs font-semibold
            transition-all duration-200
            ${currentDay === day
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }
          `}
        >
          روز {day}
          {hasExercises && currentDay !== day && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-400" />
          )}
        </button>
      );
    })}
  </div>
));

DayTabs.displayName = 'DayTabs';

// ========== Main Component ==========

interface WorkoutCanvasProps {
  className?: string;
  onSave?: () => void;
}

const WorkoutCanvas: React.FC<WorkoutCanvasProps> = ({ className = '', onSave }) => {
  const exercises = useCurrentDayExercises();
  const currentDay = useWorkoutStore(state => state.currentDay);
  const workoutDays = useWorkoutStore(state => state.workoutDays);
  const selectedInstanceId = useWorkoutStore(state => state.selectedInstanceId);
  const { setCurrentDay, clearWorkout } = useWorkoutStore();

  const { setNodeRef, isOver } = useDroppable({
    id: 'workout-canvas',
  });

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      // Default save behavior
      console.log('Saving workout:', exercises);
    }
  };

  const handleClear = () => {
    if (exercises.length > 0 && window.confirm('آیا از پاک کردن برنامه مطمئن هستید؟')) {
      clearWorkout();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-slate-900/50 rounded-2xl border border-slate-800 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Target size={18} className="text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">برنامه تمرین</h3>
              <p className="text-xs text-slate-500">
                جلسه {currentDay}
              </p>
            </div>
          </div>
          
          <ActionBar 
            onClear={handleClear}
            onSave={handleSave}
            exerciseCount={exercises.length}
          />
        </div>

        {/* Day Tabs */}
        <DayTabs 
          currentDay={currentDay}
          onDayChange={setCurrentDay}
          workoutDays={workoutDays}
        />
      </div>

      {/* Canvas Area */}
      <div 
        ref={setNodeRef}
        className={`
          flex-1 overflow-y-auto p-4 space-y-3
          transition-colors duration-200
          ${isOver ? 'bg-blue-500/5' : ''}
        `}
      >
        {exercises.length === 0 ? (
          <EmptyCanvasState isOver={isOver} />
        ) : (
          <SortableContext 
            items={exercises.map(e => e.instanceId)} 
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence mode="popLayout">
              {exercises.map((instance) => (
                <ExerciseConfigCard
                  key={instance.instanceId}
                  instance={instance}
                  isSelected={selectedInstanceId === instance.instanceId}
                />
              ))}
            </AnimatePresence>
          </SortableContext>
        )}

        {/* Drop Zone Indicator when dragging */}
        {isOver && exercises.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 60 }}
            exit={{ opacity: 0, height: 0 }}
            className="border-2 border-dashed border-blue-500 rounded-xl bg-blue-500/10 
                       flex items-center justify-center"
          >
            <span className="text-sm text-blue-400">رها کنید اینجا</span>
          </motion.div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="p-4 border-t border-slate-800">
        <WorkoutSummary />
      </div>
    </div>
  );
};

export default WorkoutCanvas;

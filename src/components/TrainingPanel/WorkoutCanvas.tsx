/**
 * WorkoutCanvas Component
 * Right column - Droppable area for building workouts
 * Uses @dnd-kit useDroppable and SortableContext for reordering
 */

import React, { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { 
  Target, 
  Clock, 
  Trash2, 
  Save,
  RotateCcw,
  Layers,
  Calendar,
  Plus,
  MousePointerClick
} from 'lucide-react';
import { useWorkoutStore, useCurrentDayExercises, useWorkoutStats } from '../../store';
import ExerciseConfigCard from './ExerciseConfigCard';
import toast from 'react-hot-toast';

// ========== Day Tabs Component ==========

const DayTabs: React.FC = () => {
  const currentDay = useWorkoutStore(state => state.currentDay);
  const workoutDays = useWorkoutStore(state => state.workoutDays);
  const setCurrentDay = useWorkoutStore(state => state.setCurrentDay);

  const days = [1, 2, 3, 4, 5, 6, 7];
  const dayNames = ['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {days.map((day, index) => {
        const exerciseCount = workoutDays[day]?.exercises?.length || 0;
        const isActive = currentDay === day;
        
        return (
          <button
            key={day}
            onClick={() => setCurrentDay(day)}
            className={`
              relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl 
              transition-all duration-200 min-w-[70px]
              ${isActive 
                ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 scale-105' 
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
              }
            `}
          >
            <span className="text-[10px] font-medium opacity-70">{dayNames[index]}</span>
            <span className="text-xs font-bold">روز {day}</span>
            {exerciseCount > 0 && (
              <span className={`
                absolute -top-1 -left-1 w-5 h-5 rounded-full text-[10px] font-bold
                flex items-center justify-center
                ${isActive 
                  ? 'bg-white text-blue-500' 
                  : 'bg-blue-500 text-white'
                }
              `}>
                {exerciseCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ========== Workout Summary Component ==========

const WorkoutSummary: React.FC = () => {
  const stats = useWorkoutStats();

  const summaryItems = [
    { 
      icon: <Layers size={14} />, 
      label: 'تمرین', 
      value: stats.exerciseCount,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    { 
      icon: <RotateCcw size={14} />, 
      label: 'ست', 
      value: stats.totalSets,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    { 
      icon: <Clock size={14} />, 
      label: 'دقیقه', 
      value: stats.estimatedMinutes,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
  ];

  return (
    <div className="flex items-center justify-between gap-3">
      {summaryItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl ${item.bgColor} border border-slate-700/30`}
        >
          <span className={item.color}>{item.icon}</span>
          <div className="text-center">
            <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
            <span className="text-[10px] text-slate-500 mr-1">{item.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ========== Empty Canvas State ==========

interface EmptyCanvasStateProps {
  isOver: boolean;
}

const EmptyCanvasState: React.FC<EmptyCanvasStateProps> = ({ isOver }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        flex flex-col items-center justify-center h-full min-h-[400px]
        rounded-2xl border-2 border-dashed transition-all duration-300
        ${isOver 
          ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
          : 'border-slate-700 bg-slate-800/30'
        }
      `}
    >
      <motion.div
        animate={{ 
          y: isOver ? -10 : [0, -10, 0],
          scale: isOver ? 1.1 : 1
        }}
        transition={{ 
          y: isOver ? { duration: 0.2 } : { duration: 2, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.2 }
        }}
        className={`
          p-6 rounded-3xl mb-4 transition-colors duration-300
          ${isOver ? 'bg-blue-500/20' : 'bg-slate-800/50'}
        `}
      >
        {isOver ? (
          <MousePointerClick size={48} className="text-blue-400" />
        ) : (
          <Target size={48} className="text-slate-500" />
        )}
      </motion.div>
      
      <h3 className={`text-lg font-bold mb-2 transition-colors ${isOver ? 'text-blue-400' : 'text-slate-300'}`}>
        {isOver ? 'رها کنید!' : 'برنامه تمرینی خالی است'}
      </h3>
      
      <p className="text-sm text-slate-500 text-center max-w-xs mb-4">
        {isOver 
          ? 'تمرین را اینجا رها کنید تا به برنامه اضافه شود'
          : 'تمرینات را از کتابخانه بکشید و اینجا رها کنید تا برنامه تمرینی بسازید'
        }
      </p>

      {!isOver && (
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">Drag</span>
          <span>+</span>
          <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">Drop</span>
        </div>
      )}
    </motion.div>
  );
};

// ========== Action Bar Component ==========

interface ActionBarProps {
  onSave?: () => void;
  onClear: () => void;
  exerciseCount: number;
}

const ActionBar: React.FC<ActionBarProps> = ({ onSave, onClear, exerciseCount }) => {
  return (
    <div className="flex items-center gap-2">
      {exerciseCount > 0 && (
        <>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                       bg-red-500/10 text-red-400 border border-red-500/30
                       hover:bg-red-500/20 transition-all text-xs font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 size={14} />
            <span>پاک کردن</span>
          </motion.button>
          
          {onSave && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg
                         bg-gradient-to-r from-green-500 to-emerald-500 text-white
                         hover:from-green-400 hover:to-emerald-400 
                         transition-all text-xs font-bold shadow-lg shadow-green-500/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save size={14} />
              <span>ذخیره برنامه</span>
            </motion.button>
          )}
        </>
      )}
    </div>
  );
};

// ========== Main WorkoutCanvas Component ==========

interface WorkoutCanvasProps {
  className?: string;
  onSave?: () => void;
}

const WorkoutCanvas: React.FC<WorkoutCanvasProps> = ({ className = '', onSave }) => {
  const exercises = useCurrentDayExercises();
  const currentDay = useWorkoutStore(state => state.currentDay);
  const clearWorkout = useWorkoutStore(state => state.clearWorkout);
  const selectedInstanceId = useWorkoutStore(state => state.selectedInstanceId);

  // Setup droppable
  const { setNodeRef, isOver, active } = useDroppable({
    id: 'workout-canvas',
    data: {
      type: 'canvas',
      accepts: ['library-item']
    }
  });

  // Check if we're dragging from library (show drop indicator)
  const isDraggingFromLibrary = active?.data?.current?.sourceType === 'library';

  const handleClear = useCallback(() => {
    if (exercises.length === 0) return;
    
    if (window.confirm('آیا از پاک کردن تمام تمرینات این روز مطمئن هستید؟')) {
      clearWorkout();
      toast.success('برنامه پاک شد', {
        icon: '🗑️',
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid #334155',
        },
      });
    }
  }, [exercises.length, clearWorkout]);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave();
    } else {
      toast.success('برنامه ذخیره شد', {
        icon: '✅',
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid #334155',
        },
      });
    }
  }, [onSave]);

  return (
    <div className={`flex flex-col h-full bg-slate-900/60 backdrop-blur-xl rounded-2xl 
                     border border-slate-800/80 shadow-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 space-y-4">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                برنامه تمرینی
                <span className="text-xs font-normal text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
                  روز {currentDay}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {exercises.length} تمرین در برنامه
              </p>
            </div>
          </div>
          
          <ActionBar 
            onSave={handleSave} 
            onClear={handleClear} 
            exerciseCount={exercises.length} 
          />
        </div>

        {/* Day Tabs */}
        <DayTabs />
      </div>

      {/* Canvas Area (Droppable) */}
      <div 
        ref={setNodeRef}
        className={`
          flex-1 overflow-y-auto p-4 custom-scrollbar transition-all duration-300
          ${isOver && isDraggingFromLibrary ? 'bg-blue-500/5' : ''}
        `}
      >
        {exercises.length === 0 ? (
          <EmptyCanvasState isOver={isOver && isDraggingFromLibrary} />
        ) : (
          <SortableContext 
            items={exercises.map(e => e.instanceId)} 
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {exercises.map((instance, index) => (
                  <motion.div
                    key={instance.instanceId}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ 
                      delay: index * 0.02,
                      layout: { duration: 0.2 }
                    }}
                  >
                    <ExerciseConfigCard 
                      instance={instance} 
                      isSelected={selectedInstanceId === instance.instanceId}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Drop Zone Indicator at Bottom */}
            {isDraggingFromLibrary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 80 }}
                exit={{ opacity: 0, height: 0 }}
                className={`
                  mt-3 rounded-xl border-2 border-dashed flex items-center justify-center
                  transition-colors duration-200
                  ${isOver ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/30'}
                `}
              >
                <div className="flex items-center gap-2 text-sm">
                  <Plus size={18} className={isOver ? 'text-blue-400' : 'text-slate-500'} />
                  <span className={isOver ? 'text-blue-400' : 'text-slate-500'}>
                    اینجا رها کنید
                  </span>
                </div>
              </motion.div>
            )}
          </SortableContext>
        )}
      </div>

      {/* Summary Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
        <WorkoutSummary />
      </div>
    </div>
  );
};

export default memo(WorkoutCanvas);

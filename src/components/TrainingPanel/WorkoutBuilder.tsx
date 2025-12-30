import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Heart, Zap, Target, Flame, Snowflake, Info } from 'lucide-react';
import { ResistanceForm, CardioForm, PlyometricForm, CorrectiveForm } from './forms';
import type { WorkoutSet } from '../../types/training';
import type { ExerciseCategory, DifficultyLevel, EquipmentType } from '../../types/database';

// Extended mode to include warmup/cooldown
type WorkoutMode = 'warmup' | 'resistance' | 'cardio' | 'plyometric' | 'corrective' | 'cooldown';

interface WorkoutBuilderProps {
  onAddExercise: (set: WorkoutSet) => void;
  exercises: ExerciseData[];
  isLoading?: boolean;
  clientInjuries?: string[];
}

interface ExerciseData {
  id: string;
  name: string;
  muscle_group: string;
  sub_muscle_group?: string | null;
  equipment?: string;
  type: string;
  mechanics?: string;
  description?: string;
  category?: ExerciseCategory;
  primary_muscle?: string;
  equipment_standardized?: EquipmentType;
  difficulty_level?: DifficultyLevel;
}

// Adapter to convert ExerciseData to form-compatible format
function adaptExercises(exercises: ExerciseData[]) {
  return exercises.map(ex => ({
    ...ex,
    sub_muscle_group: ex.sub_muscle_group ?? undefined,
  }));
}

const MODE_TABS: { mode: WorkoutMode; label: string; icon: React.ReactNode; color: string; description: string }[] = [
  { 
    mode: 'warmup', 
    label: 'گرم کردن', 
    icon: <Flame size={14} />,
    color: '#f59e0b',
    description: 'آماده‌سازی بدن برای تمرین اصلی'
  },
  { 
    mode: 'resistance', 
    label: 'مقاومتی', 
    icon: <Dumbbell size={14} />,
    color: '#0ea5e9',
    description: 'تمرینات قدرتی و حجمی'
  },
  { 
    mode: 'cardio', 
    label: 'کاردیو', 
    icon: <Heart size={14} />,
    color: '#22c55e',
    description: 'تمرینات قلبی-عروقی'
  },
  { 
    mode: 'plyometric', 
    label: 'پلایومتریک', 
    icon: <Zap size={14} />,
    color: '#eab308',
    description: 'تمرینات توان و انفجاری'
  },
  { 
    mode: 'corrective', 
    label: 'اصلاحی', 
    icon: <Target size={14} />,
    color: '#14b8a6',
    description: 'اصلاح ناهنجاری‌ها و ریکاوری'
  },
  { 
    mode: 'cooldown', 
    label: 'سرد کردن', 
    icon: <Snowflake size={14} />,
    color: '#06b6d4',
    description: 'کاهش تدریجی ضربان قلب و کشش'
  },
];

const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({
  onAddExercise,
  exercises,
  isLoading,
  clientInjuries
}) => {
  const [activeMode, setActiveMode] = useState<WorkoutMode>('resistance');
  const [showModeInfo, setShowModeInfo] = useState(false);

  // Filter exercises by category/type for each mode (improved filtering)
  const resistanceExercises = useMemo(() => 
    exercises.filter(ex => 
      ex.type === 'resistance' ||
      (ex.muscleGroup && ex.muscleGroup !== 'قلبی' && !ex.type) ||
      ex.category === 'bodybuilding' ||
      (!ex.category && !ex.type && ex.muscleGroup && ex.muscleGroup !== 'قلبی')
    ), [exercises]);

  const cardioExercises = useMemo(() => 
    exercises.filter(ex => 
      ex.type === 'cardio' ||
      ex.muscleGroup === 'قلبی' ||
      ex.category === 'cardio' ||
      ex.name.toLowerCase().includes('دویدن') ||
      ex.name.toLowerCase().includes('دوچرخه') ||
      ex.name.toLowerCase().includes('تردمیل') ||
      ex.name.toLowerCase().includes('الپتیکال') ||
      ex.name.toLowerCase().includes('روئینگ')
    ), [exercises]);

  const plyometricExercises = useMemo(() => 
    exercises.filter(ex => 
      ex.type === 'plyometric' ||
      ex.name.toLowerCase().includes('جامپ') ||
      ex.name.toLowerCase().includes('پرش') ||
      ex.name.toLowerCase().includes('باکس') ||
      ex.name.toLowerCase().includes('jump') ||
      ex.name.toLowerCase().includes('box')
    ), [exercises]);

  const correctiveExercises = useMemo(() => 
    exercises.filter(ex => 
      ex.type === 'corrective' ||
      ex.category === 'corrective' ||
      ex.name.toLowerCase().includes('کشش') ||
      ex.name.toLowerCase().includes('فوم رولر') ||
      ex.name.toLowerCase().includes('اصلاحی') ||
      ex.name.toLowerCase().includes('stretch') ||
      ex.name.toLowerCase().includes('corrective')
    ), [exercises]);

  const warmupExercises = useMemo(() => 
    exercises.filter(ex => 
      ex.type === 'warmup' ||
      ex.category === 'warmup' ||
      ex.name.toLowerCase().includes('گرم') ||
      ex.name.toLowerCase().includes('پویا') ||
      ex.name.toLowerCase().includes('warmup') ||
      ex.name.toLowerCase().includes('dynamic')
    ), [exercises]);

  const cooldownExercises = useMemo(() => 
    exercises.filter(ex => 
      ex.type === 'cooldown' ||
      ex.category === 'cooldown' ||
      ex.name.toLowerCase().includes('سرد') ||
      ex.name.toLowerCase().includes('ایستا') ||
      ex.name.toLowerCase().includes('cooldown') ||
      ex.name.toLowerCase().includes('static')
    ), [exercises]);

  // Handle adding exercise
  const handleAddExercise = useCallback((set: WorkoutSet) => {
    onAddExercise(set);
  }, [onAddExercise]);

  const currentModeInfo = MODE_TABS.find(tab => tab.mode === activeMode);

  return (
    <div className="glass-panel p-6 rounded-3xl sticky top-6 border border-[var(--glass-border)] shadow-xl backdrop-blur-xl">
      {/* Header */}
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <span 
          className="w-1.5 h-6 rounded-full animate-pulse-glow"
          style={{ 
            background: `linear-gradient(to bottom, ${currentModeInfo?.color || 'var(--accent-color)'}, ${currentModeInfo?.color || 'var(--accent-secondary)'}88)`
          }}
        />
        <span>Workout Builder</span>
        <button
          type="button"
          onClick={() => setShowModeInfo(!showModeInfo)}
          className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors mr-auto"
        >
          <Info size={16} />
        </button>
      </h3>

      {/* Mode Info */}
      <AnimatePresence>
        {showModeInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 rounded-xl bg-[var(--accent-color)]/5 border border-[var(--accent-color)]/20 text-xs text-[var(--text-secondary)]"
          >
            <p className="font-bold text-[var(--accent-color)] mb-2">ترتیب توصیه شده تمرین:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li><span className="text-amber-500">گرم کردن</span> - ۵-۱۵ دقیقه</li>
              <li><span className="text-[var(--accent-color)]">تمرین اصلی</span> (مقاومتی/کاردیو/پلایومتریک)</li>
              <li><span className="text-teal-500">اصلاحی</span> - در صورت نیاز</li>
              <li><span className="text-cyan-500">سرد کردن</span> - ۵-۱۰ دقیقه</li>
            </ol>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Tabs */}
      <div 
        className="flex flex-wrap gap-1.5 mb-5 bg-[var(--input-bg)] p-1.5 rounded-2xl border border-[var(--glass-border)]" 
        role="tablist" 
        aria-label="انتخاب نوع تمرین"
      >
        {MODE_TABS.map(tab => (
          <button 
            key={tab.mode}
            onClick={() => setActiveMode(tab.mode)} 
            className={`flex-1 min-w-[60px] text-[10px] font-bold py-2.5 rounded-xl transition-all duration-300 flex flex-col items-center gap-1 ${
              activeMode === tab.mode 
                ? 'text-white shadow-lg scale-105' 
                : 'text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:bg-[var(--text-primary)]/5'
            }`}
            style={activeMode === tab.mode ? { 
              background: `linear-gradient(135deg, ${tab.color}, ${tab.color}cc)`,
              boxShadow: `0 10px 30px ${tab.color}40`
            } : {}}
            role="tab"
            aria-selected={activeMode === tab.mode}
            aria-controls={`${tab.mode}-panel`}
            type="button"
          >
            <span className={activeMode === tab.mode ? 'text-white' : ''}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Mode Description */}
      {currentModeInfo && (
        <div 
          className="mb-4 p-2 rounded-lg text-xs text-center"
          style={{ 
            backgroundColor: `${currentModeInfo.color}10`,
            color: currentModeInfo.color,
            borderColor: `${currentModeInfo.color}30`,
            borderWidth: '1px'
          }}
        >
          {currentModeInfo.description}
        </div>
      )}

      {/* Form Content */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {activeMode === 'warmup' && (
            <motion.div
              key="warmup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <WarmupCooldownForm
                type="warmup"
                exercises={warmupExercises.length > 0 ? warmupExercises : exercises.slice(0, 20)}
                onAdd={handleAddExercise}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {activeMode === 'resistance' && (
            <motion.div
              key="resistance"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ResistanceForm
                exercises={adaptExercises(resistanceExercises)}
                onAdd={handleAddExercise}
                isLoading={isLoading}
                clientInjuries={clientInjuries}
              />
            </motion.div>
          )}

          {activeMode === 'cardio' && (
            <motion.div
              key="cardio"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <CardioForm
                exercises={cardioExercises.length > 0 ? cardioExercises : exercises.filter(ex => ex.category === 'cardio' || ex.equipment_standardized === 'treadmill' || ex.equipment_standardized === 'bike')}
                onAdd={handleAddExercise}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {activeMode === 'plyometric' && (
            <motion.div
              key="plyometric"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <PlyometricForm
                exercises={plyometricExercises.length > 0 ? plyometricExercises : resistanceExercises.slice(0, 20)}
                onAdd={handleAddExercise}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {activeMode === 'corrective' && (
            <motion.div
              key="corrective"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <CorrectiveForm
                exercises={correctiveExercises.length > 0 ? correctiveExercises : exercises.slice(0, 20)}
                onAdd={handleAddExercise}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {activeMode === 'cooldown' && (
            <motion.div
              key="cooldown"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <WarmupCooldownForm
                type="cooldown"
                exercises={cooldownExercises.length > 0 ? cooldownExercises : correctiveExercises}
                onAdd={handleAddExercise}
                isLoading={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Simple warmup/cooldown form
interface WarmupCooldownFormProps {
  type: 'warmup' | 'cooldown';
  exercises: ExerciseData[];
  onAdd: (set: WorkoutSet) => void;
  isLoading?: boolean;
}

const WarmupCooldownForm: React.FC<WarmupCooldownFormProps> = ({
  type,
  exercises,
  onAdd,
  isLoading
}) => {
  const [selectedExercise, setSelectedExercise] = useState('');
  const [duration, setDuration] = useState(type === 'warmup' ? 10 : 5);
  const [notes, setNotes] = useState('');

  const isWarmup = type === 'warmup';
  const color = isWarmup ? '#f59e0b' : '#06b6d4';

  const handleSubmit = () => {
    if (!selectedExercise) return;

    // Create a corrective set for warmup/cooldown
    const set: WorkoutSet = {
      id: `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'corrective',
      order_index: 0,
      exercise_name: selectedExercise,
      target_muscle: 'full_body',
      corrective_type: isWarmup ? 'dynamic_stretch' : 'static_stretch',
      duration_seconds: duration * 60,
      notes: notes || (isWarmup ? 'گرم کردن' : 'سرد کردن'),
      nasm_phase: isWarmup ? 'activate' : 'lengthen',
    };

    onAdd(set);
    setSelectedExercise('');
    setNotes('');
  };

  return (
    <div className="space-y-4">
      {/* Tips */}
      <div 
        className="p-3 rounded-xl text-xs"
        style={{ 
          backgroundColor: `${color}10`,
          borderColor: `${color}30`,
          borderWidth: '1px'
        }}
      >
        <p className="font-bold mb-1" style={{ color }}>
          {isWarmup ? '💡 نکات گرم کردن:' : '💡 نکات سرد کردن:'}
        </p>
        <ul className="space-y-1 text-[var(--text-secondary)]">
          {isWarmup ? (
            <>
              <li>• افزایش تدریجی ضربان قلب</li>
              <li>• کشش‌های پویا (دینامیک)</li>
              <li>• فعال‌سازی عضلات هدف</li>
              <li>• مدت: ۵-۱۵ دقیقه</li>
            </>
          ) : (
            <>
              <li>• کاهش تدریجی ضربان قلب</li>
              <li>• کشش‌های ایستا (استاتیک)</li>
              <li>• نگه‌داری هر کشش ۲۰-۳۰ ثانیه</li>
              <li>• مدت: ۵-۱۰ دقیقه</li>
            </>
          )}
        </ul>
      </div>

      {/* Exercise Selection */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text-primary)]">
          انتخاب {isWarmup ? 'حرکت گرم کردن' : 'حرکت سرد کردن'}
        </label>
        <select
          className="input-glass w-full font-bold"
          style={{ color }}
          value={selectedExercise}
          onChange={e => setSelectedExercise(e.target.value)}
        >
          <option value="">انتخاب کنید...</option>
          {isLoading ? (
            <option disabled>در حال بارگذاری...</option>
          ) : (
            exercises.map(ex => (
              <option key={ex.id} value={ex.name}>{ex.name}</option>
            ))
          )}
        </select>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text-primary)]">
          مدت زمان (دقیقه)
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(isWarmup ? [5, 10, 15, 20] : [5, 10, 15, 20]).map(mins => (
            <button
              key={mins}
              type="button"
              onClick={() => setDuration(mins)}
              className={`py-2 rounded-xl text-sm font-bold transition-all ${
                duration === mins
                  ? 'text-white shadow-lg'
                  : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:opacity-80 border border-[var(--glass-border)]'
              }`}
              style={duration === mins ? { 
                backgroundColor: color,
                boxShadow: `0 4px 15px ${color}40`
              } : {}}
            >
              {mins}′
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label className="text-xs text-[var(--text-secondary)]">یادداشت (اختیاری)</label>
        <input
          type="text"
          className="input-glass w-full text-sm"
          placeholder="توضیحات اضافی..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>

      {/* Submit */}
      <motion.button
        type="button"
        onClick={handleSubmit}
        disabled={!selectedExercise}
        className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
          selectedExercise
            ? 'hover:shadow-lg'
            : 'bg-gray-400 cursor-not-allowed opacity-50'
        }`}
        style={selectedExercise ? { 
          backgroundColor: color,
          boxShadow: `0 10px 30px ${color}40`
        } : {}}
        whileHover={selectedExercise ? { scale: 1.02 } : {}}
        whileTap={selectedExercise ? { scale: 0.98 } : {}}
      >
        {isWarmup ? '🔥' : '❄️'} افزودن {isWarmup ? 'گرم کردن' : 'سرد کردن'}
      </motion.button>
    </div>
  );
};

export default WorkoutBuilder;

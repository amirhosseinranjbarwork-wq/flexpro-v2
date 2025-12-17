import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Save, AlertTriangle, Plus, Search, Dumbbell, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { User, WorkoutItem, WorkoutMode } from '../types/index';
import type { ExercisesRow } from '../types/database';
import { EmptyState } from './ui/EmptyState';
// Removed import of riskyExercises - will be handled differently
import { useDebounce } from '../hooks/useDebounce';
import SavePlanModal from './SavePlanModal';
import TemplateLoader from './TemplateLoader';
import ExerciseRow from './TrainingPanel/ExerciseRow';
import MobileExerciseCard from './TrainingPanel/MobileExerciseCard';
import AddExerciseForm from './TrainingPanel/AddExerciseForm';
import { useExercises } from '../hooks/useExercises';
import { CardSkeleton, TextSkeleton } from '../components';

interface TrainingPanelProps {
  activeUser: User;
  onUpdateUser: (_user: User) => void;
}

const TrainingPanel: React.FC<TrainingPanelProps> = ({ activeUser, onUpdateUser }) => {
  const { hasPermission } = useApp();
  const canEdit = hasPermission('editProgram', activeUser.id);
  const [day, setDay] = useState(1);
  const [mode, setMode] = useState('resist'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  const initialFormState = {
    system: 'normal', muscle: '', subMuscle: '', ex1: '', ex2: '', name3: '', name4: '', sets: '3', reps: '10', 
    rest: '60', restUnit: 's', note: '',
    cCategory: '', cType: '', cTime: '', cInt: '', cIntensity: '', corrEx: '', corrType: '',
    dropCount: '', restPauseTime: '', tempo: '', holdTime: '',
    warmupType: '', cooldownType: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const [subMuscles, setSubMuscles] = useState<string[]>([]);
  const [exercises, setExercises] = useState<string[]>([]);
  const [corrExercisesList, setCorrExercisesList] = useState<string[]>([]);

  // بارگذاری داده‌های تمرینی از Supabase
  const { data: exercisesData, isLoading: exercisesLoading, error: exercisesError } = useExercises();

  // سازماندهی داده‌ها بر اساس ساختار قدیمی برای سازگاری
  const resistanceExercises = useMemo(() => {
    if (!exercisesData) return null;

    const resistance = exercisesData.filter((ex: ExercisesRow) => ex.type === 'resistance');
    const grouped: Record<string, Record<string, string[]>> = {};

    resistance.forEach((ex: ExercisesRow) => {
      if (!grouped[ex.muscle_group]) {
        grouped[ex.muscle_group] = {};
      }
      if (!grouped[ex.muscle_group][ex.sub_muscle_group || 'other']) {
        grouped[ex.muscle_group][ex.sub_muscle_group || 'other'] = [];
      }
      grouped[ex.muscle_group][ex.sub_muscle_group || 'other'].push(ex.name);
    });

    return grouped;
  }, [exercisesData]);

  const correctiveExercises = useMemo(() => {
    if (!exercisesData) return null;

    const corrective = exercisesData.filter((ex: ExercisesRow) => ex.type === 'corrective');
    const grouped: Record<string, string[]> = {};

    corrective.forEach((ex: ExercisesRow) => {
      if (!grouped[ex.muscle_group]) {
        grouped[ex.muscle_group] = [];
      }
      grouped[ex.muscle_group].push(ex.name);
    });

    return grouped;
  }, [exercisesData]);

  const cardioExercises = useMemo(() => {
    if (!exercisesData) return null;

    const cardio = exercisesData.filter((ex: ExercisesRow) => ex.type === 'cardio');
    const grouped: Record<string, Record<string, string[]>> = {};

    cardio.forEach((ex: ExercisesRow) => {
      // Group cardio exercises by equipment or category
      const category = ex.equipment || 'general';
      if (!grouped[category]) {
        grouped[category] = {};
      }
      if (!grouped[category][ex.muscle_group]) {
        grouped[category][ex.muscle_group] = [];
      }
      grouped[category][ex.muscle_group].push(ex.name);
    });

    return grouped;
  }, [exercisesData]);

  const warmupExercises = useMemo(() => {
    if (!exercisesData) return null;
    return exercisesData.filter((ex: ExercisesRow) => ex.type === 'warmup').map((ex: ExercisesRow) => ex.name);
  }, [exercisesData]);

  const cooldownExercises = useMemo(() => {
    if (!exercisesData) return null;
    return exercisesData.filter((ex: ExercisesRow) => ex.type === 'cooldown').map((ex: ExercisesRow) => ex.name);
  }, [exercisesData]);

  const dataLoaded = !exercisesLoading;
  const [warning, setWarning] = useState<string | null>(exercisesError ? 'خطا در بارگذاری داده‌های تمرینی' : null);

  // سنسورها برای drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.muscle && resistanceExercises && resistanceExercises[formData.muscle]) {
        setSubMuscles(Object.keys(resistanceExercises[formData.muscle]));
      } else setSubMuscles([]);
    }, 0);
    return () => clearTimeout(timer);
  }, [formData.muscle, resistanceExercises]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.subMuscle && formData.muscle && resistanceExercises && resistanceExercises[formData.muscle]) {
        setExercises(resistanceExercises[formData.muscle][formData.subMuscle] || []);
      } else setExercises([]);
    }, 0);
    return () => clearTimeout(timer);
  }, [formData.subMuscle, formData.muscle, resistanceExercises]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.corrType && correctiveExercises) setCorrExercisesList(correctiveExercises[formData.corrType] || []);
    }, 0);
    return () => clearTimeout(timer);
  }, [formData.corrType, correctiveExercises]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === 'resist' && formData.ex1 && activeUser.injuries?.length) {
        // Temporary injury check - will be moved to database later
        const riskyExercises: Record<string, string[]> = {
          "دیسک کمر": [
            "ددلیفت کلاسیک (Deadlift)", "اسکات هالتر از پشت (Squat)", "زیربغل هالتر خم (Barbell Row)",
            "سلام ژاپنی (Good Morning)", "ددلیفت رومانیایی (RDL)", "ددلیفت سومو (Sumo Deadlift)",
            "فیله کمر دستگاه (Back Extension)"
          ],
          "دیسک گردن": [
            "پرس سرشانه هالتر نظامی (Military Press)", "شراگ هالتر (Barbell Shrug)",
            "کول هالتر دست باز (Upright Row)", "پرس سرشانه هالتر از پشت (Behind-Neck Military Press)",
            "زیربغل سیم‌کش از پشت سر (Behind-Neck Lat Pulldown)"
          ],
          "زانو درد": [
            "جلو ران دستگاه (Leg Extension)", "لانگ دمبل (DB Lunges)", "اسکات عمیق", "اسکات با وزن زیاد",
            "پرس پا با زاویه بسته", "هاک پا با زاویه بسته"
          ],
          "شانه درد": [
            "پرس سرشانه هالتر نظامی (Military Press)", "پارالل (Dips)",
            "زیربغل سیم‌کش از پشت سر", "پرس سرشانه هالتر از پشت (Behind-Neck Military Press)",
            "نشر از جلو با زاویه نامناسب", "فلای معکوس با فرم نامناسب"
          ],
          "آرنج درد": [
            "جلو بازو لاری (Preacher Curl)", "پشت بازو هالتر خوابیده (Skullcrusher)",
            "دیپ نیمکت (Bench Dip)", "جلو بازو با فرم نامناسب", "پشت بازو با فرم نامناسب"
          ],
          "مچ درد": [
            "جلو بازو با میله صاف", "پشت بازو با میله صاف", "شراگ با فرم نامناسب", "کول با فرم نامناسب"
          ]
        };

        let conflict = null;
        activeUser.injuries.forEach(injury => {
          if (riskyExercises[injury]?.includes(formData.ex1)) conflict = `هشدار: مضر برای "${injury}"`;
        });
        setWarning(conflict);
      } else setWarning(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [formData.ex1, activeUser.injuries, mode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormData(prev => ({
        system: 'normal', muscle: '', subMuscle: '', ex1: '', ex2: '', name3: '', name4: '', sets: '3', reps: '10', 
        rest: prev.rest, restUnit: prev.restUnit, note: '',
        cCategory: '', cType: '', cTime: '', cInt: '', cIntensity: '', corrEx: '', corrType: '',
        dropCount: '', restPauseTime: '', tempo: '', holdTime: '',
        warmupType: '', cooldownType: ''
      }));
      setSubMuscles([]);
      setExercises([]);
      setCorrExercisesList([]);
      setSearchTerm('');
    }, 0);
    return () => clearTimeout(timer);
  }, [mode]);

  // فیلتر حرکات با جستجو - استفاده از useMemo و debounce برای بهینه‌سازی
  const filteredExercises = useMemo(() => {
    if (!debouncedSearch) return exercises;
    const lowerSearch = debouncedSearch.toLowerCase();
    return exercises.filter(ex => ex.toLowerCase().includes(lowerSearch));
  }, [exercises, debouncedSearch]);

  // هندلر جابجایی - استفاده از useCallback برای بهینه‌سازی
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (!canEdit) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(String(active.id).split('-')[1]) || 0;
    const newIndex = parseInt(String(over.id).split('-')[1]) || 0;
    if (isNaN(oldIndex) || isNaN(newIndex)) return;

    const newUser = { ...activeUser };
    if (!newUser.plans.workouts[day]) newUser.plans.workouts[day] = [];
    if (oldIndex < 0 || oldIndex >= newUser.plans.workouts[day].length) return;
    if (newIndex < 0 || newIndex >= newUser.plans.workouts[day].length) return;
    newUser.plans.workouts[day] = arrayMove(newUser.plans.workouts[day], oldIndex, newIndex);
    onUpdateUser(newUser);
  }, [canEdit, activeUser, day, onUpdateUser]);

  const handleDeleteExercise = useCallback((idx: number) => {
    if (!canEdit) {
      toast.error('دسترسی مربی لازم است');
      return;
    }
    const u = { ...activeUser };
    if (!u.plans?.workouts?.[day]) return;
    u.plans.workouts[day] = u.plans.workouts[day].filter((_, i) => i !== idx);
    onUpdateUser(u);
  }, [canEdit, activeUser, day, onUpdateUser]);

  const handleAddExercise = (): void => {
    if (!canEdit) {
      toast.error('دسترسی مربی لازم است');
      return;
    }
    const newUser = { ...activeUser };
    if (!newUser.plans.workouts[day]) newUser.plans.workouts[day] = [];
    
    let item: WorkoutItem = {
      mode: mode as WorkoutMode,
      note: formData.note,
      rest: formData.rest,
      restUnit: (formData.restUnit as WorkoutItem['restUnit']) || 's',
      name: ''
    };
    
    if (mode === 'resist') {
      if (!formData.ex1) {
        toast.error('لطفا حرکت را انتخاب کنید');
        return;
      }
      if (!formData.sets || !formData.reps) {
        toast.error('ست و تکرار الزامی است');
        return;
      }
      
      // Validation برای سیستم‌های مختلف
      if (formData.system === 'superset' && !formData.ex2) {
        toast.error('برای سوپرست، حرکت دوم الزامی است');
        return;
      }
      if (formData.system === 'triset' && (!formData.ex2 || !formData.name3)) {
        toast.error('برای تری‌ست، حرکت دوم و سوم الزامی است');
        return;
      }
      if (formData.system === 'giantset' && (!formData.ex2 || !formData.name3)) {
        toast.error('برای جاینت‌ست، حداقل 3 حرکت الزامی است');
        return;
      }
      if (formData.system === 'dropset' && !formData.dropCount) {
        toast.error('برای درآپ‌ست، تعداد درآپ الزامی است');
        return;
      }
      if (formData.system === 'restpause' && !formData.restPauseTime) {
        toast.error('برای رست-پاز، زمان استراحت بین پاز الزامی است');
        return;
      }
      if (formData.system === 'tempo' && !formData.tempo) {
        toast.error('برای تمپو، الگوی تمپو الزامی است (مثال: 3-1-2-0)');
        return;
      }
      if (formData.system === 'isometric' && !formData.holdTime) {
        toast.error('برای ایزومتریک، زمان نگه‌داری الزامی است');
        return;
      }
      
      item = { 
        ...item, 
        type: formData.system as WorkoutItem['type'], 
        name: formData.ex1, 
        name2: formData.ex2 || '', 
        name3: formData.name3 || '', 
        name4: formData.name4 || '',
        sets: formData.sets, 
        reps: formData.reps,
        dropCount: formData.dropCount || '',
        restPauseTime: formData.restPauseTime || '',
        tempo: formData.tempo || '',
        holdTime: formData.holdTime || ''
      };
      
      // Reset form after successful add
      setFormData(initialFormState);
    } else if (mode === 'cardio') {
      if (!formData.cType || !formData.cTime) {
        toast.error('نوع تمرین و مدت زمان الزامی است');
        return;
      }
      item = { ...item, type: 'normal', name: formData.cType, duration: formData.cTime, intensity: formData.cInt || formData.cIntensity || '' };
    } else if (mode === 'corrective') {
      if (!formData.corrEx) {
        toast.error('حرکت اصلاحی الزامی است');
        return;
      }
      item = { ...item, type: 'nasm-corrective', name: formData.corrEx, sets: formData.sets, reps: formData.reps };
    } else if (mode === 'warmup') {
      if (!formData.warmupType) {
        toast.error('نوع گرم کردن را انتخاب کنید');
        return;
      }
      item = { ...item, type: undefined, name: formData.warmupType, duration: formData.cTime || '5', sets: formData.sets, reps: formData.reps };
    } else if (mode === 'cooldown') {
      if (!formData.cooldownType) {
        toast.error('نوع سرد کردن را انتخاب کنید');
        return;
      }
      item = { ...item, type: undefined, name: formData.cooldownType, duration: formData.cTime || '5', sets: formData.sets, reps: formData.reps };
    }

    if (!item.name) {
      toast.error('حرکت نامعتبر است');
      return;
    }

    newUser.plans.workouts[day].push(item);
    onUpdateUser(newUser);
    setFormData(initialFormState);
    toast.success('ثبت شد');
  };

  const workoutItems = activeUser.plans?.workouts?.[day] || [];

  // Show enhanced loading state until data is loaded
  if (!dataLoaded) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton variant="shimmer" lines={4} />
          <CardSkeleton variant="wave" lines={3} />
        </div>

        <div className="space-y-4">
          <TextSkeleton lines={1} className="h-8" variant="pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} variant="bounce" lines={2} />
            ))}
          </div>
        </div>

        <CardSkeleton variant="shimmer" lines={1} className="h-32" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* نوار جلسات - طراحی مدرن و یکپارچه */}
      <div className="glass-panel p-4 rounded-3xl border border-[var(--glass-border)] shadow-lg backdrop-blur-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* دکمه‌های جلسات */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 flex-1">
            {[1, 2, 3, 4, 5, 6, 7].map(d => (
              <button 
                key={d} 
                onClick={() => setDay(d)} 
                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  day === d 
                    ? 'text-white shadow-lg scale-105' 
                    : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/10 hover:text-[var(--accent-color)] border border-[var(--glass-border)]'
                }`}
                style={day === d ? { background: `linear-gradient(135deg, var(--accent-color), var(--accent-secondary))`, boxShadow: `0 10px 30px var(--accent-color)/30` } : {}}
                aria-label={`جلسه ${d}`}
                type="button"
              >
                <span className="flex items-center gap-2">
                  <span>جلسه {d}</span>
                  {activeUser.plans?.workouts?.[d]?.length > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      day === d ? 'bg-white/30 text-white' : 'bg-[var(--accent-color)]/20 text-[var(--accent-color)]'
                    }`}>
                      {activeUser.plans.workouts[d].length}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
          
          {/* دکمه‌های عملیات */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowSaveModal(true)}
              disabled={!canEdit}
              className={`btn-glass bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs px-4 py-2 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-emerald-500/20 ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="ذخیره برنامه کامل"
              type="button"
            >
              <Save size={14} className="inline ml-1"/> ذخیره برنامه
            </button>
            <button
              onClick={() => setShowLoadModal(true)}
              disabled={!canEdit}
              className={`btn-glass bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs px-4 py-2 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/20 ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="بارگذاری برنامه ذخیره شده"
              type="button"
            >
              <Download size={14} className="inline ml-1"/> بارگذاری برنامه
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* فرم سمت راست - طراحی مدرن و فشرده */}
        <div className="lg:col-span-4">
          <AddExerciseForm
            onAdd={(exerciseData) => {
              // Convert the compact form data to the full form data expected by handleAddExercise
              const workoutItem = {
                mode: 'resist' as const,
                name: exerciseData.name || '',
                sets: exerciseData.sets,
                reps: exerciseData.reps,
                rest: exerciseData.rest,
                restUnit: exerciseData.restUnit,
                note: exerciseData.note,
                type: 'normal' as const
              };

              const newUser = { ...activeUser };
              if (!newUser.plans.workouts[day]) newUser.plans.workouts[day] = [];
              newUser.plans.workouts[day].push(workoutItem);
              onUpdateUser(newUser);
            }}
            canEdit={canEdit}
          />
        </div>

        {/* جدول سمت چپ - طراحی مدرن */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-0 overflow-hidden min-h-[500px] border border-[var(--glass-border)] shadow-xl backdrop-blur-xl">
          <div className="bg-gradient-to-r from-[var(--accent-color)]/10 via-[var(--accent-secondary)]/5 to-transparent px-6 py-4 border-b border-[var(--glass-border)] flex justify-between items-center backdrop-blur-sm transition-all duration-500">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-6 bg-gradient-to-b from-[var(--accent-color)] to-[var(--accent-secondary)] rounded-full animate-pulse-glow"></span>
              <span className="text-base font-bold text-[var(--text-primary)]">برنامه جلسه {day}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20">
              <span className="text-xs font-semibold text-[var(--accent-color)]">{workoutItems.length}</span>
              <span className="text-xs text-[var(--text-secondary)]">حرکت</span>
            </div>
          </div>
          
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            {workoutItems.length > 0 ? (
              <>
                {/* Desktop View - Table */}
                <div className="hidden md:block overflow-x-auto px-6 py-4">
                  <table className="w-full text-right text-xs sm:text-sm">
                    <thead className="bg-[var(--text-primary)]/3 text-[var(--text-secondary)] text-xs border-b border-[var(--glass-border)] sticky top-0 backdrop-blur-sm">
                      <tr>
                        <th className="p-3 w-12 text-center"></th>
                        <th className="p-4 font-bold">شرح حرکت</th>
                        <th className="p-4 w-20 text-center font-bold">ست</th>
                        <th className="p-4 w-24 text-center font-bold">تکرار</th>
                        <th className="p-4 w-28 text-center font-bold">استراحت</th>
                        <th className="p-4 w-12 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--glass-border)]">
                      <SortableContext items={workoutItems.map((_, idx) => `${day}-${idx}`)} strategy={verticalListSortingStrategy}>
                        {workoutItems.map((item, idx) => (
                          <motion.tr
                            key={`${day}-${idx}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <ExerciseRow
                              item={item}
                              idx={idx}
                              day={day}
                              onDelete={handleDeleteExercise}
                              canEdit={canEdit}
                            />
                          </motion.tr>
                        ))}
                      </SortableContext>
                    </tbody>
                  </table>
                </div>

                {/* Mobile View - Card Stack */}
                <div className="md:hidden p-4 sm:p-6 overflow-y-auto max-h-[600px]">
                  <SortableContext items={workoutItems.map((_, idx) => `${day}-${idx}`)} strategy={verticalListSortingStrategy}>
                    <AnimatePresence>
                      {workoutItems.map((item, idx) => (
                        <MobileExerciseCard
                          key={`${day}-${idx}`}
                          item={item}
                          idx={idx}
                          day={day}
                          onDelete={handleDeleteExercise}
                          canEdit={canEdit}
                        />
                      ))}
                    </AnimatePresence>
                  </SortableContext>
                </div>
              </>
            ) : (
              <div className="p-8 sm:p-12">
                <EmptyState
                  icon={<Dumbbell size={32} className="text-[var(--accent-color)]" />}
                  title="برنامه‌ای ثبت نشده است"
                  description="هنوز حرکتی برای این جلسه اضافه نشده است. می‌توانید از فرم سمت راست حرکت جدید اضافه کنید."
                />
              </div>
            )}
          </DndContext>
        </div>
      </div>

      {/* Save Plan Modal */}
      <SavePlanModal 
        isOpen={showSaveModal} 
        onClose={() => setShowSaveModal(false)} 
        fullWeekData={activeUser.plans?.workouts || {}}
      />

      {/* Load Template Modal */}
      <TemplateLoader 
        isOpen={showLoadModal} 
        onClose={() => setShowLoadModal(false)} 
        clientId={String(activeUser.id)}
        onTemplateLoaded={() => {
          // Refresh user data after loading template
          onUpdateUser(activeUser);
        }}
      />
    </div>
  );
};

export default TrainingPanel;

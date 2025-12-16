import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Save, AlertTriangle, Plus, Search, Dumbbell, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { User, WorkoutItem, WorkoutMode } from '../types/index';
import EmptyState from './EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import SavePlanModal from './SavePlanModal';
import TemplateLoader from './TemplateLoader';
import WorkoutDayTabs from './TrainingPanel/WorkoutDayTabs';
import ExerciseRow from './TrainingPanel/ExerciseRow';
import AddExerciseForm from './TrainingPanel/AddExerciseForm';
import { useExercises } from '../hooks/useExercises';

interface TrainingPanelProps {
  activeUser: User;
  onUpdateUser: (_user: User) => void;
}

const TrainingPanel: React.FC<TrainingPanelProps> = ({ activeUser, onUpdateUser }) => {
  const { templates, saveTemplate, deleteTemplate, theme, hasPermission } = useApp();
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

    const resistance = exercisesData.filter(ex => ex.type === 'resistance');
    const grouped: Record<string, Record<string, string[]>> = {};

    resistance.forEach(ex => {
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

    const corrective = exercisesData.filter(ex => ex.type === 'corrective');
    const grouped: Record<string, string[]> = {};

    corrective.forEach(ex => {
      if (!grouped[ex.muscle_group]) {
        grouped[ex.muscle_group] = [];
      }
      grouped[ex.muscle_group].push(ex.name);
    });

    return grouped;
  }, [exercisesData]);

  const cardioExercises = useMemo(() => {
    if (!exercisesData) return null;

    const cardio = exercisesData.filter(ex => ex.type === 'cardio');
    const grouped: Record<string, Record<string, string[]>> = {};

    cardio.forEach(ex => {
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
    return exercisesData.filter(ex => ex.type === 'warmup').map(ex => ex.name);
  }, [exercisesData]);

  const cooldownExercises = useMemo(() => {
    if (!exercisesData) return null;
    return exercisesData.filter(ex => ex.type === 'cooldown').map(ex => ex.name);
  }, [exercisesData]);

  const dataLoaded = !exercisesLoading;
  const warning = exercisesError ? 'خطا در بارگذاری داده‌های تمرینی' : null;

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
      if (mode === 'resist' && formData.ex1 && activeUser.injuries?.length && riskyExercises) {
        let conflict = null;
        activeUser.injuries.forEach(injury => {
          if (riskyExercises[injury]?.includes(formData.ex1)) conflict = `هشدار: مضر برای "${injury}"`;
        });
        setWarning(conflict);
      } else setWarning(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [formData.ex1, activeUser.injuries, mode, riskyExercises]);

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

  const handleAddExercise = () => {
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
      if (!formData.ex1) return toast.error('لطفا حرکت را انتخاب کنید');
      if (!formData.sets || !formData.reps) return toast.error('ست و تکرار الزامی است');
      
      // Validation برای سیستم‌های مختلف
      if (formData.system === 'superset' && !formData.ex2) {
        return toast.error('برای سوپرست، حرکت دوم الزامی است');
      }
      if (formData.system === 'triset' && (!formData.ex2 || !formData.name3)) {
        return toast.error('برای تری‌ست، حرکت دوم و سوم الزامی است');
      }
      if (formData.system === 'giantset' && (!formData.ex2 || !formData.name3)) {
        return toast.error('برای جاینت‌ست، حداقل 3 حرکت الزامی است');
      }
      if (formData.system === 'dropset' && !formData.dropCount) {
        return toast.error('برای درآپ‌ست، تعداد درآپ الزامی است');
      }
      if (formData.system === 'restpause' && !formData.restPauseTime) {
        return toast.error('برای رست-پاز، زمان استراحت بین پاز الزامی است');
      }
      if (formData.system === 'tempo' && !formData.tempo) {
        return toast.error('برای تمپو، الگوی تمپو الزامی است (مثال: 3-1-2-0)');
      }
      if (formData.system === 'isometric' && !formData.holdTime) {
        return toast.error('برای ایزومتریک، زمان نگه‌داری الزامی است');
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
      if (!formData.cType || !formData.cTime) return toast.error('نوع تمرین و مدت زمان الزامی است');
      item = { ...item, type: 'normal', name: formData.cType, duration: formData.cTime, intensity: formData.cInt || formData.cIntensity || '' };
    } else if (mode === 'corrective') {
      if (!formData.corrEx) return toast.error('حرکت اصلاحی الزامی است');
      item = { ...item, type: 'nasm-corrective', name: formData.corrEx, sets: formData.sets, reps: formData.reps };
    } else if (mode === 'warmup') {
      if (!formData.warmupType) return toast.error('نوع گرم کردن را انتخاب کنید');
      item = { ...item, type: undefined, name: formData.warmupType, duration: formData.cTime || '5', sets: formData.sets, reps: formData.reps };
    } else if (mode === 'cooldown') {
      if (!formData.cooldownType) return toast.error('نوع سرد کردن را انتخاب کنید');
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

  const handleSaveTemplate = async () => {
    if (!canEdit) {
      toast.error('دسترسی مربی لازم است');
      return;
    }
    const { value: name } = await Swal.fire({
      title: 'ذخیره الگو',
      input: 'text',
      inputPlaceholder: 'نام الگو را وارد کنید...',
      showCancelButton: true,
      confirmButtonText: 'ذخیره',
      cancelButtonText: 'لغو',
      background: theme === 'dark' ? '#1e293b' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000',
      inputValidator: (value) => {
        if (!value) return 'نام الگو الزامی است';
      }
    });
    if (name) saveTemplate(name, activeUser.plans.workouts[day]);
  };

  const handleLoadTemplate = (t: any) => {
    if (!canEdit) {
      toast.error('دسترسی مربی لازم است');
      return;
    }
    Swal.fire({
      title: 'جایگزینی برنامه روز انتخاب‌شده؟',
      text: 'برنامه فعلی این جلسه حذف و الگو جایگزین می‌شود.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'بله، جایگزین کن',
      cancelButtonText: 'لغو'
    }).then(res => {
      if (res.isConfirmed) {
        const newUser = { ...activeUser };
        if (!newUser.plans.workouts) newUser.plans.workouts = {};
        newUser.plans.workouts[day] = [...(t.workout || [])];
        onUpdateUser(newUser);
        toast.success('الگو با موفقیت بارگذاری شد');
      }
    });
  };

  const workoutItems = activeUser.plans?.workouts?.[day] || [];

  // Show loading state until data is loaded
  if (!dataLoaded) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-center p-8 bg-[var(--glass-bg)] rounded-2xl border border-[var(--glass-border)]">
          <div className="text-center space-y-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--accent-color)] border-r-transparent"></div>
            <p className="text-sm text-[var(--text-secondary)]">در حال بارگذاری داده‌های تمرینی...</p>
          </div>
        </div>
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
        {/* فرم سمت راست - طراحی مدرن */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl sticky top-6 border border-[var(--glass-border)] shadow-xl backdrop-blur-xl">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-gradient-to-b from-[var(--accent-color)] to-[var(--accent-secondary)] rounded-full animate-pulse-glow"></span>
              افزودن حرکت جدید
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-5 bg-[var(--input-bg)] p-1.5 rounded-2xl border border-[var(--glass-border)]" role="tablist" aria-label="انتخاب نوع تمرین">
              {['warmup', 'resist', 'cardio', 'corrective', 'cooldown'].map(m => (
                <button 
                  key={m} 
                  onClick={() => setMode(m)} 
                  className={`flex-1 text-[11px] font-bold py-2.5 rounded-xl transition-all duration-300 ${
                    mode === m 
                      ? 'text-white shadow-lg scale-105' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:bg-[var(--text-primary)]/5'
                  }`}
                  style={mode === m ? { background: `linear-gradient(135deg, var(--accent-color), var(--accent-secondary))`, boxShadow: `0 10px 30px var(--accent-color)/30` } : {}}
                  role="tab"
                  aria-selected={mode === m}
                  aria-controls={`${m}-panel`}
                  aria-label={`نوع تمرین: ${m === 'warmup' ? 'گرم کردن' : m === 'resist' ? 'مقاومتی' : m === 'cardio' ? 'هوازی' : m === 'corrective' ? 'اصلاحی' : 'سرد کردن'}`}
                  type="button"
                >
                  {m === 'warmup' ? '🔥 گرم' : m === 'resist' ? '💪 مقاومتی' : m === 'cardio' ? '🏃 هوازی' : m === 'corrective' ? '🩹 اصلاحی' : '❄️ سرد'}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {/* گرم کردن */}
              {mode === 'warmup' && (
                <>
                  <select className="input-glass font-bold" value={formData.warmupType} onChange={e => setFormData({ ...formData, warmupType: e.target.value })}>
                    <option value="">انتخاب نوع گرم کردن...</option>
                    {warmupExercises ? warmupExercises.map(ex => <option key={ex} value={ex}>{ex}</option>) : <option disabled>در حال بارگذاری...</option>}
                  </select>
                  <input className="input-glass" type="number" placeholder="مدت زمان (دقیقه)" value={formData.cTime} onChange={e => setFormData({ ...formData, cTime: e.target.value })} />
                  <div className="text-[10px] text-[var(--text-secondary)] bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                    💡 گرم کردن باید 5-15 دقیقه باشد و شامل افزایش تدریجی ضربان قلب و کشش‌های پویا شود.
                  </div>
                </>
              )}

              {/* سرد کردن */}
              {mode === 'cooldown' && (
                <>
                  <select className="input-glass font-bold" value={formData.cooldownType} onChange={e => setFormData({ ...formData, cooldownType: e.target.value })}>
                    <option value="">انتخاب نوع سرد کردن...</option>
                    {cooldownExercises ? cooldownExercises.map(ex => <option key={ex} value={ex}>{ex}</option>) : <option disabled>در حال بارگذاری...</option>}
                  </select>
                  <input className="input-glass" type="number" placeholder="مدت زمان (دقیقه)" value={formData.cTime} onChange={e => setFormData({ ...formData, cTime: e.target.value })} />
                  <div className="text-[10px] text-[var(--text-secondary)] bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 rounded-lg p-2">
                    💡 سرد کردن باید 5-10 دقیقه باشد و شامل کاهش تدریجی ضربان قلب و کشش‌های ایستا شود.
                  </div>
                </>
              )}

              {/* بدنسازی */}
              {mode === 'resist' && (
                <>
                  <select className="input-glass" value={formData.system} onChange={e => setFormData({ ...formData, system: e.target.value })}>
                    <option value="normal">سیستم ساده (Straight Set)</option>
                    <option value="superset">سوپرست (۲ حرکت پشت‌سرهم)</option>
                    <option value="triset">تری‌ست (۳ حرکت)</option>
                    <option value="giantset">جاینت‌ست (۴+ حرکت)</option>
                    <option value="dropset">درآپ‌ست (Drop Set)</option>
                    <option value="pyramid">هرمی (Pyramid)</option>
                    <option value="restpause">رست-پاز (Rest-Pause)</option>
                    <option value="german-volume">حجم آلمانی (10x10)</option>
                    <option value="fst7">FST-7</option>
                    <option value="5x5">5x5 (Stronglifts)</option>
                    <option value="cluster">کلاستر ست</option>
                    <option value="myorep">مایورپ (Myo-Reps)</option>
                    <option value="tempo">تمپو (Tempo)</option>
                    <option value="isometric">ایزومتریک</option>
                    <option value="negatives">نگاتیو</option>
                    <option value="21s">21s</option>
                  </select>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <select className="input-glass text-xs" value={formData.muscle} onChange={e => setFormData({ ...formData, muscle: e.target.value, subMuscle: '' })}>
                      <option value="">عضله...</option>
                      {resistanceExercises ? Object.keys(resistanceExercises).map(m => <option key={m} value={m}>{m}</option>) : null}
                    </select>
                    <select className="input-glass text-xs" value={formData.subMuscle} onChange={e => setFormData({ ...formData, subMuscle: e.target.value })}>
                      <option value="">ناحیه...</option>
                      {subMuscles.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* جستجوی حرکات */}
                  {exercises.length > 10 && (
                    <div className="relative">
                      <input
                        type="text"
                        className="input-glass pl-8 text-sm"
                        placeholder="جستجوی حرکت..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                      <Search size={14} className="absolute left-3 top-3.5 text-slate-400" />
                    </div>
                  )}

                  <select className="input-glass font-bold text-[var(--accent-color)]" value={formData.ex1} onChange={e => setFormData({ ...formData, ex1: e.target.value })}>
                    <option value="">انتخاب حرکت...</option>
                    {filteredExercises.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>

                  {/* سوپرست - نیاز به 2 حرکت */}
                  {formData.system === 'superset' && (
                    <select className="input-glass border-r-4 border-r-yellow-400 font-bold text-yellow-600 dark:text-yellow-400" value={formData.ex2} onChange={e => setFormData({ ...formData, ex2: e.target.value })}>
                      <option value="">+ انتخاب حرکت دوم (الزامی)</option>
                      {filteredExercises.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  )}

                  {/* تری‌ست - نیاز به 3 حرکت */}
                  {formData.system === 'triset' && (
                    <>
                      <select className="input-glass border-r-4 border-r-yellow-400 font-bold text-yellow-600 dark:text-yellow-400" value={formData.ex2} onChange={e => setFormData({ ...formData, ex2: e.target.value })}>
                        <option value="">+ انتخاب حرکت دوم (الزامی)</option>
                        {filteredExercises.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                      <select className="input-glass border-r-4 border-r-purple-400 font-bold text-purple-600 dark:text-purple-400" value={formData.name3} onChange={e => setFormData({ ...formData, name3: e.target.value })}>
                        <option value="">+ انتخاب حرکت سوم (الزامی)</option>
                        {filteredExercises.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </>
                  )}

                  {/* جاینت‌ست - نیاز به 4+ حرکت */}
                  {formData.system === 'giantset' && (
                    <>
                      <select className="input-glass border-r-4 border-r-yellow-400 font-bold text-yellow-600 dark:text-yellow-400" value={formData.ex2} onChange={e => setFormData({ ...formData, ex2: e.target.value })}>
                        <option value="">+ انتخاب حرکت دوم (الزامی)</option>
                        {filteredExercises.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                      <select className="input-glass border-r-4 border-r-purple-400 font-bold text-purple-600 dark:text-purple-400" value={formData.name3} onChange={e => setFormData({ ...formData, name3: e.target.value })}>
                        <option value="">+ انتخاب حرکت سوم (الزامی)</option>
                        {filteredExercises.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                      <select className="input-glass border-r-4 border-r-red-400 font-bold text-red-600 dark:text-red-400" value={formData.name4} onChange={e => setFormData({ ...formData, name4: e.target.value })}>
                        <option value="">+ انتخاب حرکت چهارم (اختیاری)</option>
                        {filteredExercises.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </>
                  )}

                  {/* درآپ‌ست - نیاز به تعداد درآپ */}
                  {formData.system === 'dropset' && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
                      <label className="text-xs text-yellow-600 dark:text-yellow-400 font-bold block mb-1">تعداد درآپ (Drop Count)</label>
                      <input className="input-glass text-center font-bold" type="number" placeholder="مثال: 2 یا 3" value={formData.dropCount} onChange={e => setFormData({ ...formData, dropCount: e.target.value })} />
                      <p className="text-[10px] text-yellow-600/70 mt-1">مثال: 2 درآپ = کاهش وزن 2 بار</p>
                    </div>
                  )}

                  {/* رست-پاز - نیاز به زمان استراحت بین پاز */}
                  {formData.system === 'restpause' && (
                    <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-lg">
                      <label className="text-xs text-purple-600 dark:text-purple-400 font-bold block mb-1">زمان استراحت بین پاز (ثانیه)</label>
                      <input className="input-glass text-center font-bold" type="number" placeholder="مثال: 15-20" value={formData.restPauseTime} onChange={e => setFormData({ ...formData, restPauseTime: e.target.value })} />
                      <p className="text-[10px] text-purple-600/70 mt-1">زمان استراحت کوتاه بین تکرارها</p>
                    </div>
                  )}

                  {/* تمپو - نیاز به الگوی تمپو */}
                  {formData.system === 'tempo' && (
                    <div className="bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 p-3 rounded-lg">
                      <label className="text-xs text-[var(--accent-color)] font-bold block mb-1">الگوی تمپو (مثال: 3-1-2-0)</label>
                      <input className="input-glass text-center font-mono font-bold" placeholder="3-1-2-0" value={formData.tempo} onChange={e => setFormData({ ...formData, tempo: e.target.value })} />
                      <p className="text-[10px] text-[var(--accent-color)]/70 mt-1">فرمت: پایین-نگه-بالا-استراحت (ثانیه)</p>
                    </div>
                  )}

                  {/* ایزومتریک - نیاز به زمان نگه‌داری */}
                  {formData.system === 'isometric' && (
                    <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg">
                      <label className="text-xs text-green-600 dark:text-green-400 font-bold block mb-1">زمان نگه‌داری (ثانیه)</label>
                      <input className="input-glass text-center font-bold" type="number" placeholder="مثال: 30-60" value={formData.holdTime} onChange={e => setFormData({ ...formData, holdTime: e.target.value })} />
                      <p className="text-[10px] text-green-600/70 mt-1">مدت زمان نگه‌داری در موقعیت</p>
                    </div>
                  )}

                  {/* هرمی - نیاز به توضیحات */}
                  {formData.system === 'pyramid' && (
                    <div className="bg-indigo-500/10 border border-indigo-500/30 p-3 rounded-lg">
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-1">سیستم هرمی</p>
                      <p className="text-[10px] text-indigo-600/70">افزایش/کاهش تدریجی وزن یا تکرار در هر ست</p>
                    </div>
                  )}

                  {/* حجم آلمانی - 10x10 */}
                  {formData.system === 'german-volume' && (
                    <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                      <p className="text-xs text-red-600 dark:text-red-400 font-bold mb-1">حجم آلمانی (10x10)</p>
                      <p className="text-[10px] text-red-600/70">10 ست × 10 تکرار با 60% 1RM</p>
                    </div>
                  )}

                  {/* FST-7 */}
                  {formData.system === 'fst7' && (
                    <div className="bg-pink-500/10 border border-pink-500/30 p-3 rounded-lg">
                      <p className="text-xs text-pink-600 dark:text-pink-400 font-bold mb-1">FST-7 (Fascia Stretch Training)</p>
                      <p className="text-[10px] text-pink-600/70">7 ست با استراحت 30-45 ثانیه</p>
                    </div>
                  )}

                  {/* 5x5 */}
                  {formData.system === '5x5' && (
                    <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1">5x5 (Stronglifts)</p>
                      <p className="text-[10px] text-blue-600/70">5 ست × 5 تکرار - افزایش وزن در هر جلسه</p>
                    </div>
                  )}

                  {/* کلاستر */}
                  {formData.system === 'cluster' && (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg">
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mb-1">کلاستر ست</p>
                      <p className="text-[10px] text-amber-600/70">تقسیم یک ست به چند بخش با استراحت کوتاه</p>
                    </div>
                  )}

                  {/* مایورپ */}
                  {formData.system === 'myorep' && (
                    <div className="bg-indigo-500/10 border border-indigo-500/30 p-3 rounded-lg">
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-1">مایورپ (Myo-Reps)</p>
                      <p className="text-[10px] text-indigo-600/70">ست فعال + چند ست کوتاه با استراحت 5-10 ثانیه</p>
                    </div>
                  )}

                  {/* نگاتیو */}
                  {formData.system === 'negatives' && (
                    <div className="bg-violet-500/10 border border-violet-500/30 p-3 rounded-lg">
                      <p className="text-xs text-violet-600 dark:text-violet-400 font-bold mb-1">نگاتیو (Eccentric)</p>
                      <p className="text-[10px] text-violet-600/70">تأکید بر فاز منفی حرکت (پایین آوردن)</p>
                    </div>
                  )}

                  {/* 21s */}
                  {formData.system === '21s' && (
                    <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-lg">
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-bold mb-1">21s</p>
                      <p className="text-[10px] text-rose-600/70">7 تکرار نیمه پایین + 7 تکرار نیمه بالا + 7 تکرار کامل</p>
                    </div>
                  )}

                  {warning && (
                    <div className="bg-red-500/10 border border-red-500/30 p-2 rounded-lg flex items-center gap-2 text-red-500 text-xs animate-pulse">
                      <AlertTriangle size={14} /> {warning}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <input className="input-glass text-center px-1" placeholder="ست" value={formData.sets} onChange={e => setFormData({ ...formData, sets: e.target.value })} />
                    <input className="input-glass text-center px-1 col-span-2" placeholder="تکرار" value={formData.reps} onChange={e => setFormData({ ...formData, reps: e.target.value })} />
                  </div>
                </>
              )}

              {/* هوازی */}
              {mode === 'cardio' && (
                <>
                  <select className="input-glass" value={formData.cCategory} onChange={e => setFormData({ ...formData, cCategory: e.target.value, cType: '' })}>
                    <option value="">انتخاب دسته...</option>
                    {cardioExercises ? Object.keys(cardioExercises).map(cat => <option key={cat} value={cat}>{cat}</option>) : <option disabled>در حال بارگذاری...</option>}
                  </select>
                  {formData.cCategory && (
                    <select className="input-glass font-bold" value={formData.cType} onChange={e => setFormData({ ...formData, cType: e.target.value })}>
                      <option value="">انتخاب نوع...</option>
                      {cardioExercises && (cardioExercises[formData.cCategory] as any)?.map((ex: any) => <option key={ex} value={ex}>{ex}</option>)}
                    </select>
                  )}
                  <input className="input-glass" placeholder="زمان (دقیقه)" type="number" value={formData.cTime} onChange={e => setFormData({ ...formData, cTime: e.target.value })} />
                  <select className="input-glass" value={formData.cIntensity} onChange={e => setFormData({ ...formData, cIntensity: e.target.value })}>
                    <option value="">سطح شدت...</option>
                    <option value="low">سبک (50-60%)</option>
                    <option value="moderate">متوسط (60-70%)</option>
                    <option value="high">سنگین (70-85%)</option>
                    <option value="very-high">خیلی سنگین (85%+)</option>
                  </select>
                </>
              )}

              {/* اصلاحی */}
              {mode === 'corrective' && (
                <>
                  <select className="input-glass" value={formData.corrType} onChange={e => setFormData({ ...formData, corrType: e.target.value })}>
                    <option value="">نوع ناهنجاری...</option>
                    {correctiveExercises ? Object.keys(correctiveExercises).map(k => <option key={k} value={k}>{k}</option>) : <option disabled>در حال بارگذاری...</option>}
                  </select>
                  <select className="input-glass" value={formData.corrEx} onChange={e => setFormData({ ...formData, corrEx: e.target.value })}>
                    <option value="">حرکت...</option>
                    {corrExercisesList.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                  <input className="input-glass" placeholder="تکرار/زمان" value={formData.reps} onChange={e => setFormData({ ...formData, reps: e.target.value })} />
                </>
              )}

              {/* فیلدهای مشترک */}
              {(mode === 'resist' || mode === 'corrective') && (
                <div className="flex gap-2">
                  <input className="input-glass flex-1 text-center" placeholder="استراحت" type="number" value={formData.rest} onChange={e => setFormData({ ...formData, rest: e.target.value })} />
                  <select className="input-glass w-24 text-center" value={formData.restUnit} onChange={e => setFormData({ ...formData, restUnit: e.target.value })}>
                    <option value="s">ثانیه</option>
                    <option value="m">دقیقه</option>
                  </select>
                </div>
              )}

              <input className="input-glass" placeholder="توضیحات فنی" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} />
            </div>
            
            <button
              onClick={handleAddExercise}
              disabled={!canEdit}
              className={`w-full btn-glass text-white mt-6 py-3.5 font-bold text-sm transition-all duration-300 hover:scale-[1.02] ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={!canEdit ? {} : { background: `linear-gradient(135deg, var(--accent-color), var(--accent-secondary))` }}
              aria-label="افزودن حرکت به برنامه"
              aria-disabled={!canEdit}
              type="button"
            >
              <Plus size={18} className="inline ml-2"/> ثبت در برنامه
            </button>
          </div>
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
              <div className="overflow-x-auto -mx-2 sm:-mx-4 md:mx-0 px-2 sm:px-4 md:px-0">
                <table className="w-full text-right text-xs sm:text-sm min-w-[500px] sm:min-w-[600px]">
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
                      <ExerciseRow
                        key={`${day}-${idx}`}
                        item={item}
                        idx={idx}
                        day={day}
                        onDelete={handleDeleteExercise}
                        canEdit={canEdit}
                      />
                    ))}
                  </SortableContext>
                </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={<Dumbbell size={32} className="text-[var(--accent-color)]" />}
                title="برنامه‌ای ثبت نشده است"
                description="هنوز حرکتی برای این جلسه اضافه نشده است. می‌توانید از فرم سمت راست حرکت جدید اضافه کنید."
              />
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

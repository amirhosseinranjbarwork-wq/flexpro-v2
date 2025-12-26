import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import type { WorkoutItem, WorkoutSystemType, WorkoutMode } from '../../types/index';
import { useDebounce } from '../../hooks/useDebounce';

interface AddExerciseFormProps {
  mode: WorkoutMode;
  canEdit: boolean;
  resistanceExercises?: Record<string, Record<string, string[]>>;
  correctiveExercises?: Record<string, string[]>;
  cardioExercises?: string[];
  warmupCooldown?: Record<string, string[]>;
  onAddExercise: (exercise: WorkoutItem) => void;
  warning: string | null;
}

interface FormData {
  system: WorkoutSystemType;
  muscle: string;
  subMuscle: string;
  ex1: string;
  ex2: string;
  name3: string;
  name4: string;
  sets: string;
  reps: string;
  rest: string;
  restUnit: 's' | 'm';
  note: string;
  cCategory: string;
  cType: string;
  cTime: string;
  cInt: string;
  cIntensity: string;
  corrEx: string;
  corrType: string;
  dropCount: string;
  restPauseTime: string;
  tempo: string;
  holdTime: string;
  warmupType: string;
  cooldownType: string;
  duration?: string;
}

const AddExerciseForm: React.FC<AddExerciseFormProps> = memo(({
  mode,
  canEdit,
  resistanceExercises,
  correctiveExercises,
  cardioExercises,
  warmupCooldown: _warmupCooldown,
  onAddExercise,
  warning
}) => {
  const [formData, setFormData] = useState<FormData>({
    system: 'normal',
    muscle: '',
    subMuscle: '',
    ex1: '',
    ex2: '',
    name3: '',
    name4: '',
    sets: '3',
    reps: '10',
    rest: '90',
    restUnit: 's',
    note: '',
    cCategory: '',
    cType: '',
    cTime: '20',
    cInt: '100',
    cIntensity: 'moderate',
    corrEx: '',
    corrType: '',
    dropCount: '',
    restPauseTime: '',
    tempo: '',
    holdTime: '',
    warmupType: '',
    cooldownType: '',
    duration: ''
  });

  const [subMuscles, setSubMuscles] = useState<string[]>([]);
  const [exercises, setExercises] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_corrExercisesList, setCorrExercisesList] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Update sub-muscles when muscle changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.muscle && resistanceExercises && resistanceExercises[formData.muscle]) {
        setSubMuscles(Object.keys(resistanceExercises[formData.muscle]));
      } else setSubMuscles([]);
    }, 0);
    return () => clearTimeout(timer);
  }, [formData.muscle, resistanceExercises]);

  // Update exercises when sub-muscle changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.subMuscle && formData.muscle && resistanceExercises && resistanceExercises[formData.muscle]) {
        setExercises(resistanceExercises[formData.muscle][formData.subMuscle] || []);
      } else setExercises([]);
    }, 0);
    return () => clearTimeout(timer);
  }, [formData.subMuscle, formData.muscle, resistanceExercises]);

  // Update corrective exercises when type changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.corrType && correctiveExercises) {
        setCorrExercisesList(correctiveExercises[formData.corrType] || []);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [formData.corrType, correctiveExercises]);

  // Reset form when mode changes
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

  // Filter exercises based on search
  const filteredExercises = useMemo(() => {
    if (!debouncedSearch) return exercises;
    const lowerSearch = debouncedSearch.toLowerCase();
    return exercises.filter(ex => ex.toLowerCase().includes(lowerSearch));
  }, [exercises, debouncedSearch]);

  const handleAddExercise = useCallback(() => {
    if (!canEdit) {
      toast.error('دسترسی مربی لازم است');
      return;
    }

    let exercise: WorkoutItem;

    if (mode === 'resist') {
      if (!formData.ex1) {
        toast.error('حداقل یک حرکت انتخاب کنید');
        return;
      }
      if (formData.system === 'superset' && !formData.ex2) {
        toast.error('برای سوپرست باید 2 حرکت انتخاب کنید');
        return;
      }
      if ((formData.system === 'triset' || formData.system === 'giantset') && (!formData.ex2 || !formData.name3)) {
        toast.error(`برای ${formData.system === 'triset' ? 'تری‌ست' : 'جاینت‌ست'} باید 3 حرکت انتخاب کنید`);
        return;
      }

      exercise = {
        type: formData.system,
        mode: 'resist',
        name: formData.ex1,
        name2: formData.ex2 || undefined,
        name3: formData.name3 || undefined,
        name4: formData.name4 || undefined,
        sets: formData.sets,
        reps: formData.reps,
        rest: formData.rest,
        restUnit: formData.restUnit,
        intensity: formData.system === 'pyramid' ? formData.cIntensity : undefined,
        dropCount: formData.dropCount || undefined,
        restPauseTime: formData.restPauseTime || undefined,
        tempo: formData.tempo || undefined,
        holdTime: formData.holdTime || undefined,
        note: formData.note || undefined,
      };
    } else if (mode === 'cardio') {
      if (!formData.cCategory) {
        toast.error('دسته‌بندی کاردیو انتخاب کنید');
        return;
      }
      exercise = {
        type: 'cardio',
        mode: 'cardio',
        name: formData.cCategory,
        duration: formData.cTime,
        intensity: formData.cIntensity,
        note: formData.note || undefined,
      };
    } else if (mode === 'corrective') {
      if (!formData.corrEx) {
        toast.error('یک حرکت اصلاحی انتخاب کنید');
        return;
      }
      exercise = {
        type: 'corrective',
        name: formData.corrEx,
        sets: formData.sets,
        reps: formData.reps,
        rest: formData.rest,
        restUnit: formData.restUnit,
        note: formData.note || undefined,
      };
    } else if (mode === 'warmup') {
      if (!formData.warmupType) {
        toast.error('یک حرکت گرم‌آپ انتخاب کنید');
        return;
      }
      exercise = {
        type: 'warmup',
        name: formData.warmupType,
        duration: formData.cTime,
        note: formData.note || undefined,
      };
    } else if (mode === 'cooldown') {
      if (!formData.cooldownType) {
        toast.error('یک حرکت سرد‌کننده انتخاب کنید');
        return;
      }
      exercise = {
        type: 'cooldown',
        name: formData.cooldownType,
        duration: formData.cTime,
        note: formData.note || undefined,
      };
    } else {
      toast.error('نوع ورزشی نامعتبر');
      return;
    }

    onAddExercise(exercise);
    toast.success('حرکت اضافه شد');
  }, [canEdit, mode, formData, onAddExercise]);

  if (!canEdit) {
    return (
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center text-yellow-600 dark:text-yellow-400 text-sm">
        صرفاً مربی می‌تواند حرکات اضافه کند
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl">
      {warning && (
        <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertTriangle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{warning}</p>
        </div>
      )}

      {/* Mode-specific form content */}
      {mode === 'resist' && (
        <div className="space-y-3">
          <select className="input-glass w-full" value={formData.system} onChange={e => setFormData({ ...formData, system: e.target.value as WorkoutSystemType })}>
            <option value="normal">سیستم عادی</option>
            <option value="superset">سوپرست</option>
            <option value="triset">تری‌ست</option>
            <option value="giantset">جاینت‌ست</option>
            <option value="dropset">درآپ‌ست</option>
            <option value="restpause">رست-پاز</option>
            <option value="pyramid">پیرامید</option>
            <option value="tempo">تمپو</option>
            <option value="isometric">ایزومتریک</option>
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

          {exercises.length > 10 && (
            <div className="relative">
              <input
                type="text"
                className="input-glass pl-8 w-full text-sm"
                placeholder="جستجوی حرکت..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Search size={14} className="absolute left-3 top-3.5 text-slate-400" />
            </div>
          )}

          <select className="input-glass w-full font-bold text-[var(--accent-color)]" value={formData.ex1} onChange={e => setFormData({ ...formData, ex1: e.target.value })}>
            <option value="">انتخاب حرکت...</option>
            {filteredExercises.map(e => <option key={e} value={e}>{e}</option>)}
          </select>

          {formData.system === 'superset' && (
            <select className="input-glass w-full border-r-4 border-r-yellow-400 font-bold text-yellow-600 dark:text-yellow-400" value={formData.ex2} onChange={e => setFormData({ ...formData, ex2: e.target.value })}>
              <option value="">+ انتخاب حرکت دوم (الزامی)</option>
              {filteredExercises.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          )}

          {(formData.system === 'triset' || formData.system === 'giantset') && (
            <>
              <select className="input-glass w-full border-r-4 border-r-yellow-400 font-bold text-yellow-600 dark:text-yellow-400" value={formData.ex2} onChange={e => setFormData({ ...formData, ex2: e.target.value })}>
                <option value="">+ انتخاب حرکت دوم (الزامی)</option>
                {filteredExercises.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <select className="input-glass w-full border-r-4 border-r-purple-400 font-bold text-purple-600 dark:text-purple-400" value={formData.name3} onChange={e => setFormData({ ...formData, name3: e.target.value })}>
                <option value="">+ انتخاب حرکت سوم (الزامی)</option>
                {filteredExercises.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              {formData.system === 'giantset' && (
                <select className="input-glass w-full border-r-4 border-r-red-400 font-bold text-red-600 dark:text-red-400" value={formData.name4} onChange={e => setFormData({ ...formData, name4: e.target.value })}>
                  <option value="">+ انتخاب حرکت چهارم (اختیاری)</option>
                  {filteredExercises.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              )}
            </>
          )}

          {formData.system === 'dropset' && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
              <label className="text-xs text-yellow-600 dark:text-yellow-400 font-bold block mb-1">تعداد درآپ</label>
              <input className="input-glass text-center w-full font-bold" type="number" placeholder="2 یا 3" value={formData.dropCount} onChange={e => setFormData({ ...formData, dropCount: e.target.value })} />
            </div>
          )}

          {formData.system === 'restpause' && (
            <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-lg">
              <label className="text-xs text-purple-600 dark:text-purple-400 font-bold block mb-1">زمان استراحت (ثانیه)</label>
              <input className="input-glass text-center w-full font-bold" type="number" placeholder="15-20" value={formData.restPauseTime} onChange={e => setFormData({ ...formData, restPauseTime: e.target.value })} />
            </div>
          )}

          {formData.system === 'tempo' && (
            <div className="bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 p-3 rounded-lg">
              <label className="text-xs text-[var(--accent-color)] font-bold block mb-1">تمپو</label>
              <input className="input-glass text-center w-full font-mono font-bold" placeholder="3-1-2-0" value={formData.tempo} onChange={e => setFormData({ ...formData, tempo: e.target.value })} />
            </div>
          )}

          {formData.system === 'isometric' && (
            <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg">
              <label className="text-xs text-green-600 dark:text-green-400 font-bold block mb-1">زمان نگه‌داری (ثانیه)</label>
              <input className="input-glass text-center w-full font-bold" type="number" placeholder="30-60" value={formData.holdTime} onChange={e => setFormData({ ...formData, holdTime: e.target.value })} />
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">ست</label>
              <input className="input-glass text-center w-full" type="number" value={formData.sets} onChange={e => setFormData({ ...formData, sets: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">تکرار</label>
              <input className="input-glass text-center w-full" type="number" value={formData.reps} onChange={e => setFormData({ ...formData, reps: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">استراحت</label>
              <div className="flex gap-1">
                <input className="input-glass text-center flex-1" type="number" value={formData.rest} onChange={e => setFormData({ ...formData, rest: e.target.value })} />
                <select className="input-glass w-12" value={formData.restUnit} onChange={e => setFormData({ ...formData, restUnit: e.target.value as 's' | 'm' })}>
                  <option value="s">ث</option>
                  <option value="m">د</option>
                </select>
              </div>
            </div>
          </div>

          <input className="input-glass w-full text-sm" type="text" placeholder="یادداشت..." value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} />
        </div>
      )}

      {/* Other modes... (cardio, corrective, warmup, cooldown) */}
      {mode === 'cardio' && cardioExercises && (
        <div className="space-y-3">
          <select className="input-glass w-full" value={formData.cCategory} onChange={e => setFormData({ ...formData, cCategory: e.target.value })}>
            <option value="">نوع کاردیو...</option>
            {cardioExercises.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">مدت (دقیقه)</label>
              <input className="input-glass w-full text-center" type="number" value={formData.cTime} onChange={e => setFormData({ ...formData, cTime: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">شدت</label>
              <select className="input-glass w-full" value={formData.cIntensity} onChange={e => setFormData({ ...formData, cIntensity: e.target.value })}>
                <option value="low">کم</option>
                <option value="moderate">متوسط</option>
                <option value="high">زیاد</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleAddExercise}
        className="btn-glass bg-[var(--accent-color)] text-white w-full py-2.5 rounded-xl font-bold transition-all hover:shadow-lg"
        type="button"
      >
        اضافه کردن حرکت
      </button>
    </div>
  );
});

AddExerciseForm.displayName = 'AddExerciseForm';
export default AddExerciseForm;

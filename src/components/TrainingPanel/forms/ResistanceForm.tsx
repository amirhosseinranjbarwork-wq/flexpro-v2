import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertTriangle, Info, Zap, Timer, Target, Dumbbell } from 'lucide-react';
import type { 
  ResistanceWorkoutSet, 
  TrainingSystemType,
  RPE,
  RIR,
  MuscleGroup,
  EquipmentType,
  DifficultyLevel 
} from '../../../types/training';
import { 
  RPE_DESCRIPTIONS, 
  RIR_DESCRIPTIONS,
  MUSCLE_GROUP_NAMES,
  EQUIPMENT_NAMES,
  createDefaultResistanceSet 
} from '../../../types/training';
import { useDebounce } from '../../../hooks/useDebounce';

interface ResistanceFormProps {
  onAdd: (set: ResistanceWorkoutSet) => void;
  exercises: ExerciseOption[];
  isLoading?: boolean;
  clientInjuries?: string[];
}

interface ExerciseOption {
  id: string;
  name: string;
  muscle_group: string;
  sub_muscle_group?: string;
  equipment?: string;
  category?: string;
  difficulty_level?: DifficultyLevel;
}

const TRAINING_SYSTEMS: { value: TrainingSystemType; label: string; description: string; icon: string }[] = [
  { value: 'straight_set', label: 'ست ساده', description: 'ست‌های معمولی با استراحت بین ست‌ها', icon: '📊' },
  { value: 'superset', label: 'سوپرست', description: '۲ حرکت متوالی بدون استراحت', icon: '⚡' },
  { value: 'triset', label: 'تری‌ست', description: '۳ حرکت متوالی بدون استراحت', icon: '🔥' },
  { value: 'giant_set', label: 'جاینت‌ست', description: '۴+ حرکت متوالی بدون استراحت', icon: '💥' },
  { value: 'drop_set', label: 'درآپ‌ست', description: 'کاهش وزن و ادامه بدون استراحت', icon: '📉' },
  { value: 'rest_pause', label: 'رست-پاز', description: 'استراحت کوتاه درون ست', icon: '⏸️' },
  { value: 'cluster_set', label: 'کلاستر', description: 'مینی‌ست‌های با استراحت کوتاه', icon: '🔗' },
  { value: 'myo_reps', label: 'مایورپ', description: 'ست فعال + مینی‌ست‌های ۳-۵ تکراری', icon: '💪' },
  { value: 'pyramid', label: 'هرمی', description: 'افزایش/کاهش وزن در هر ست', icon: '🔺' },
  { value: 'reverse_pyramid', label: 'هرمی معکوس', description: 'شروع سنگین، کاهش تدریجی', icon: '🔻' },
  { value: 'german_volume', label: 'حجم آلمانی', description: '۱۰ ست × ۱۰ تکرار', icon: '🇩🇪' },
  { value: 'fst7', label: 'FST-7', description: '۷ ست با استراحت ۳۰-۴۵ ثانیه', icon: '7️⃣' },
  { value: '5x5', label: '5×5', description: '۵ ست × ۵ تکرار - قدرت پایه', icon: '5️⃣' },
  { value: 'tempo', label: 'تمپو', description: 'کنترل سرعت حرکت', icon: '🎵' },
  { value: 'isometric', label: 'ایزومتریک', description: 'نگه‌داری استاتیک', icon: '🧘' },
  { value: 'eccentric', label: 'نگاتیو', description: 'تأکید بر فاز اکسنتریک', icon: '⬇️' },
  { value: 'pause_rep', label: 'مکث', description: 'مکث در نقاط مختلف حرکت', icon: '⏹️' },
  { value: 'blood_flow_restriction', label: 'BFR', description: 'محدودیت جریان خون', icon: '🩸' },
  { value: '21s', label: '21s', description: '۷+۷+۷ تکرار جزئی و کامل', icon: '🎯' },
];

const ResistanceForm: React.FC<ResistanceFormProps> = ({
  onAdd,
  exercises,
  isLoading,
  clientInjuries = []
}) => {
  const [formData, setFormData] = useState<Partial<ResistanceWorkoutSet>>(createDefaultResistanceSet());
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | ''>('');
  const [equipmentFilter, setEquipmentFilter] = useState<EquipmentType | ''>('');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | ''>('');
  const [warning, setWarning] = useState<string | null>(null);
  const [showRPEInfo, setShowRPEInfo] = useState(false);
  
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Filter exercises based on search and filters
  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      const matchesSearch = !debouncedSearch ||
        ex.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        ex.muscle_group?.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesMuscle = !muscleFilter || ex.muscle_group === muscleFilter;
      const matchesEquipment = !equipmentFilter || ex.equipment === equipmentFilter;
      const matchesDifficulty = !difficultyFilter || ex.difficulty_level === difficultyFilter;
      
      return matchesSearch && matchesMuscle && matchesEquipment && matchesDifficulty;
    });
  }, [exercises, debouncedSearch, muscleFilter, equipmentFilter, difficultyFilter]);

  // Get unique muscle groups from exercises
  const availableMuscles = useMemo(() => {
    const muscles = new Set(exercises.map(ex => ex.muscle_group).filter(Boolean));
    return Array.from(muscles);
  }, [exercises]);

  // Check for injury warnings
  React.useEffect(() => {
    if (formData.exercise_name && clientInjuries.length > 0) {
      // Simple injury check - in production this would be more sophisticated
      const exerciseName = formData.exercise_name.toLowerCase();
      const hasConflict = clientInjuries.some(injury => {
        const inj = injury.toLowerCase();
        // Basic mapping of injuries to risky exercises
        if (inj.includes('کمر') || inj.includes('back')) {
          return exerciseName.includes('ددلیفت') || exerciseName.includes('deadlift');
        }
        if (inj.includes('زانو') || inj.includes('knee')) {
          return exerciseName.includes('اسکات') || exerciseName.includes('squat');
        }
        if (inj.includes('شانه') || inj.includes('shoulder')) {
          return exerciseName.includes('پرس') || exerciseName.includes('press');
        }
        return false;
      });
      
      if (hasConflict) {
        setWarning('⚠️ این حرکت ممکن است با آسیب‌دیدگی شاگرد تداخل داشته باشد');
      } else {
        setWarning(null);
      }
    } else {
      setWarning(null);
    }
  }, [formData.exercise_name, clientInjuries]);

  const handleSubmit = () => {
    if (!formData.exercise_name) {
      return;
    }
    
    const newSet: ResistanceWorkoutSet = {
      ...createDefaultResistanceSet(),
      ...formData,
      exercise_name: formData.exercise_name!,
    };
    
    onAdd(newSet);
    setFormData(createDefaultResistanceSet());
    setSearchTerm('');
  };

  const selectedSystem = TRAINING_SYSTEMS.find(s => s.value === formData.training_system);

  return (
    <div className="space-y-4">
      {/* Training System Selection */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Zap size={14} className="text-[var(--accent-color)]" />
          سیستم تمرینی
        </label>
        <select
          className="input-glass w-full text-sm"
          value={formData.training_system || 'straight_set'}
          onChange={e => setFormData({ ...formData, training_system: e.target.value as TrainingSystemType })}
        >
          {TRAINING_SYSTEMS.map(system => (
            <option key={system.value} value={system.value}>
              {system.icon} {system.label}
            </option>
          ))}
        </select>
        {selectedSystem && (
          <p className="text-xs text-[var(--text-secondary)] bg-[var(--accent-color)]/5 p-2 rounded-lg">
            {selectedSystem.description}
          </p>
        )}
      </div>

      {/* Exercise Filters */}
      <div className="grid grid-cols-3 gap-2">
        <select
          className="input-glass text-xs"
          value={muscleFilter}
          onChange={e => setMuscleFilter(e.target.value as MuscleGroup | '')}
        >
          <option value="">همه عضلات</option>
          {availableMuscles.map(muscle => (
            <option key={muscle} value={muscle}>
              {MUSCLE_GROUP_NAMES[muscle as MuscleGroup] || muscle}
            </option>
          ))}
        </select>
        
        <select
          className="input-glass text-xs"
          value={equipmentFilter}
          onChange={e => setEquipmentFilter(e.target.value as EquipmentType | '')}
        >
          <option value="">همه تجهیزات</option>
          {Object.entries(EQUIPMENT_NAMES).map(([key, name]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
        
        <select
          className="input-glass text-xs"
          value={difficultyFilter}
          onChange={e => setDifficultyFilter(e.target.value as DifficultyLevel | '')}
        >
          <option value="">همه سطوح</option>
          <option value="beginner">مبتدی</option>
          <option value="intermediate">متوسط</option>
          <option value="advanced">پیشرفته</option>
        </select>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          className="input-glass w-full pr-4 pl-10 text-sm"
          placeholder="جستجوی حرکت..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Search size={16} className="absolute left-3 top-3 text-[var(--text-secondary)]" />
      </div>

      {/* Exercise Selection */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Dumbbell size={14} className="text-[var(--accent-color)]" />
          انتخاب حرکت
        </label>
        <select
          className="input-glass w-full font-bold text-[var(--accent-color)]"
          value={formData.exercise_name || ''}
          onChange={e => setFormData({ ...formData, exercise_name: e.target.value })}
        >
          <option value="">انتخاب کنید...</option>
          {isLoading ? (
            <option disabled>در حال بارگذاری...</option>
          ) : (
            filteredExercises.map(ex => (
              <option key={ex.id} value={ex.name}>{ex.name}</option>
            ))
          )}
        </select>
      </div>

      {/* Additional Exercises for Supersets/etc */}
      {['superset', 'triset', 'giant_set'].includes(formData.training_system || '') && (
        <div className="space-y-2">
          <select
            className="input-glass w-full border-r-4 border-r-yellow-400 font-semibold"
            value={formData.exercise_name_secondary || ''}
            onChange={e => setFormData({ ...formData, exercise_name_secondary: e.target.value })}
          >
            <option value="">+ حرکت دوم (الزامی)</option>
            {filteredExercises.map(ex => (
              <option key={ex.id} value={ex.name}>{ex.name}</option>
            ))}
          </select>
          
          {['triset', 'giant_set'].includes(formData.training_system || '') && (
            <select
              className="input-glass w-full border-r-4 border-r-purple-400 font-semibold"
              value={formData.exercise_name_tertiary || ''}
              onChange={e => setFormData({ ...formData, exercise_name_tertiary: e.target.value })}
            >
              <option value="">+ حرکت سوم (الزامی)</option>
              {filteredExercises.map(ex => (
                <option key={ex.id} value={ex.name}>{ex.name}</option>
              ))}
            </select>
          )}
          
          {formData.training_system === 'giant_set' && (
            <select
              className="input-glass w-full border-r-4 border-r-red-400 font-semibold"
              value={formData.exercise_name_quaternary || ''}
              onChange={e => setFormData({ ...formData, exercise_name_quaternary: e.target.value })}
            >
              <option value="">+ حرکت چهارم (اختیاری)</option>
              {filteredExercises.map(ex => (
                <option key={ex.id} value={ex.name}>{ex.name}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Warning */}
      {warning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl flex items-center gap-2 text-red-500 text-xs"
        >
          <AlertTriangle size={16} />
          {warning}
        </motion.div>
      )}

      {/* Sets, Reps, Weight */}
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <label className="text-xs text-[var(--text-secondary)]">ست</label>
          <input
            type="number"
            className="input-glass w-full text-center font-bold"
            value={formData.sets || 3}
            onChange={e => setFormData({ ...formData, sets: parseInt(e.target.value) || 3 })}
            min={1}
            max={20}
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-xs text-[var(--text-secondary)]">تکرار</label>
          <input
            type="text"
            className="input-glass w-full text-center font-bold"
            placeholder="8-12"
            value={formData.reps || ''}
            onChange={e => setFormData({ ...formData, reps: e.target.value })}
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-xs text-[var(--text-secondary)]">وزن (kg)</label>
          <input
            type="number"
            className="input-glass w-full text-center"
            placeholder="--"
            value={formData.weight || ''}
            onChange={e => setFormData({ ...formData, weight: parseFloat(e.target.value) || undefined })}
            step={0.5}
          />
        </div>
      </div>

      {/* RPE & RIR */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
            RPE
            <button
              type="button"
              onClick={() => setShowRPEInfo(!showRPEInfo)}
              className="text-[var(--accent-color)] hover:opacity-80"
            >
              <Info size={12} />
            </button>
          </label>
          <select
            className="input-glass w-full text-center"
            value={formData.rpe || ''}
            onChange={e => setFormData({ ...formData, rpe: parseInt(e.target.value) as RPE || undefined })}
          >
            <option value="">--</option>
            {([6, 7, 8, 9, 10] as RPE[]).map(rpe => (
              <option key={rpe} value={rpe}>
                {rpe} - {RPE_DESCRIPTIONS[rpe].slice(0, 15)}...
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-1">
          <label className="text-xs text-[var(--text-secondary)]">RIR</label>
          <select
            className="input-glass w-full text-center"
            value={formData.rir ?? ''}
            onChange={e => setFormData({ ...formData, rir: parseInt(e.target.value) as RIR })}
          >
            <option value="">--</option>
            {([0, 1, 2, 3, 4, 5] as RIR[]).map(rir => (
              <option key={rir} value={rir}>
                {rir} - {RIR_DESCRIPTIONS[rir].slice(0, 20)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RPE Info Tooltip */}
      {showRPEInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 p-3 rounded-xl text-xs space-y-1"
        >
          <p className="font-bold text-[var(--accent-color)]">راهنمای RPE:</p>
          <p><strong>6:</strong> می‌توانید ۴+ تکرار دیگر انجام دهید</p>
          <p><strong>7:</strong> می‌توانید ۳ تکرار دیگر انجام دهید</p>
          <p><strong>8:</strong> می‌توانید ۲ تکرار دیگر انجام دهید</p>
          <p><strong>9:</strong> می‌توانید ۱ تکرار دیگر انجام دهید</p>
          <p><strong>10:</strong> نمی‌توانید تکرار دیگری انجام دهید (شکست)</p>
        </motion.div>
      )}

      {/* Tempo */}
      <div className="space-y-1">
        <label className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
          <Timer size={12} />
          تمپو (اختیاری)
        </label>
        <input
          type="text"
          className="input-glass w-full text-center font-mono"
          placeholder="3-1-2-0"
          value={formData.tempo || ''}
          onChange={e => setFormData({ ...formData, tempo: e.target.value })}
        />
        <p className="text-[10px] text-[var(--text-secondary)]">
          فرمت: پایین-مکث-بالا-مکث (ثانیه)
        </p>
      </div>

      {/* Rest */}
      <div className="space-y-1">
        <label className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
          <Target size={12} />
          استراحت بین ست‌ها
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            className="input-glass flex-1 text-center"
            value={formData.rest_seconds || 90}
            onChange={e => setFormData({ ...formData, rest_seconds: parseInt(e.target.value) || 90 })}
            min={10}
            max={600}
          />
          <span className="flex items-center text-xs text-[var(--text-secondary)]">ثانیه</span>
        </div>
      </div>

      {/* System-specific inputs */}
      {formData.training_system === 'drop_set' && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl space-y-2">
          <label className="text-xs font-bold text-yellow-600 dark:text-yellow-400">تنظیمات درآپ‌ست</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-yellow-600/70">تعداد درآپ</label>
              <input
                type="number"
                className="input-glass w-full text-center"
                placeholder="2"
                value={formData.drop_count || ''}
                onChange={e => setFormData({ ...formData, drop_count: parseInt(e.target.value) })}
                min={1}
                max={5}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-yellow-600/70">درصد کاهش</label>
              <input
                type="number"
                className="input-glass w-full text-center"
                placeholder="20"
                value={formData.drop_percentage || ''}
                onChange={e => setFormData({ ...formData, drop_percentage: parseInt(e.target.value) })}
                min={10}
                max={50}
              />
            </div>
          </div>
        </div>
      )}

      {formData.training_system === 'rest_pause' && (
        <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-xl space-y-2">
          <label className="text-xs font-bold text-purple-600 dark:text-purple-400">تنظیمات رست-پاز</label>
          <div className="space-y-1">
            <label className="text-[10px] text-purple-600/70">استراحت درون ست (ثانیه)</label>
            <input
              type="number"
              className="input-glass w-full text-center"
              placeholder="15-20"
              value={formData.rest_pause_seconds || ''}
              onChange={e => setFormData({ ...formData, rest_pause_seconds: parseInt(e.target.value) })}
              min={5}
              max={30}
            />
          </div>
        </div>
      )}

      {formData.training_system === 'cluster_set' && (
        <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-xl space-y-2">
          <label className="text-xs font-bold text-blue-600 dark:text-blue-400">تنظیمات کلاستر</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-blue-600/70">تکرار هر مینی‌ست</label>
              <input
                type="number"
                className="input-glass w-full text-center"
                placeholder="2"
                value={formData.cluster_reps || ''}
                onChange={e => setFormData({ ...formData, cluster_reps: parseInt(e.target.value) })}
                min={1}
                max={5}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-blue-600/70">استراحت (ثانیه)</label>
              <input
                type="number"
                className="input-glass w-full text-center"
                placeholder="15"
                value={formData.cluster_rest || ''}
                onChange={e => setFormData({ ...formData, cluster_rest: parseInt(e.target.value) })}
                min={5}
                max={30}
              />
            </div>
          </div>
        </div>
      )}

      {formData.training_system === 'blood_flow_restriction' && (
        <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl space-y-2">
          <label className="text-xs font-bold text-red-600 dark:text-red-400">تنظیمات BFR</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-red-600/70">فشار (mmHg)</label>
              <input
                type="number"
                className="input-glass w-full text-center"
                placeholder="120-180"
                value={formData.bfr_pressure || ''}
                onChange={e => setFormData({ ...formData, bfr_pressure: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-red-600/70">عرض کاف</label>
              <select
                className="input-glass w-full text-center"
                value={formData.bfr_cuff_width || ''}
                onChange={e => setFormData({ ...formData, bfr_cuff_width: e.target.value as 'narrow' | 'wide' })}
              >
                <option value="">انتخاب...</option>
                <option value="narrow">باریک</option>
                <option value="wide">پهن</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="space-y-1">
        <label className="text-xs text-[var(--text-secondary)]">یادداشت (اختیاری)</label>
        <input
          type="text"
          className="input-glass w-full text-sm"
          placeholder="توضیحات اضافی..."
          value={formData.notes || ''}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      {/* Submit Button */}
      <motion.button
        type="button"
        onClick={handleSubmit}
        disabled={!formData.exercise_name}
        className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
          formData.exercise_name
            ? 'bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-secondary)] hover:shadow-lg hover:shadow-[var(--accent-color)]/30'
            : 'bg-gray-400 cursor-not-allowed opacity-50'
        }`}
        whileHover={formData.exercise_name ? { scale: 1.02 } : {}}
        whileTap={formData.exercise_name ? { scale: 0.98 } : {}}
      >
        💪 افزودن حرکت مقاومتی
      </motion.button>
    </div>
  );
};

export default ResistanceForm;

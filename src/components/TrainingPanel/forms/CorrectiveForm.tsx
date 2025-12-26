import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Wind, Target, MoveHorizontal, Info, Sparkles } from 'lucide-react';
import type { 
  CorrectiveWorkoutSet, 
  CorrectiveExerciseType,
  ContractionType,
  MuscleGroup,
} from '../../../types/training';
import { 
  CORRECTIVE_TYPE_INFO,
  MUSCLE_GROUP_NAMES,
  createDefaultCorrectiveSet,
} from '../../../types/training';

interface CorrectiveFormProps {
  onAdd: (set: CorrectiveWorkoutSet) => void;
  exercises: CorrectiveExerciseOption[];
  isLoading?: boolean;
}

interface CorrectiveExerciseOption {
  id: string;
  name: string;
  muscle_group?: string;
  type?: string;
}

const NASM_PHASES = [
  { value: 'inhibit', label: 'مهار (Inhibit)', description: 'فوم رولینگ، ریلیز نقاط ماشه‌ای', icon: '🔴', color: 'red' },
  { value: 'lengthen', label: 'کشش (Lengthen)', description: 'کشش‌های ایستا و PNF', icon: '📏', color: 'blue' },
  { value: 'activate', label: 'فعال‌سازی (Activate)', description: 'تمرینات ایزوله عضلات ضعیف', icon: '⚡', color: 'yellow' },
  { value: 'integrate', label: 'یکپارچه‌سازی (Integrate)', description: 'حرکات چند مفصلی عملکردی', icon: '🔗', color: 'green' },
];

const CONTRACTION_TYPES: { value: ContractionType; label: string; description: string }[] = [
  { value: 'isometric', label: 'ایزومتریک', description: 'نگه‌داری استاتیک بدون حرکت' },
  { value: 'isotonic', label: 'ایزوتونیک', description: 'حرکت با بار ثابت' },
  { value: 'eccentric', label: 'اکسنتریک', description: 'کشیدگی تحت تنش' },
  { value: 'concentric', label: 'کانسنتریک', description: 'انقباض و کوتاه شدن' },
  { value: 'pnf_contract_relax', label: 'PNF انقباض-رها', description: 'انقباض، سپس رها و کشش' },
  { value: 'pnf_hold_relax', label: 'PNF نگه-رها', description: 'نگه‌داری ایزومتریک، سپس کشش' },
];

const CorrectiveForm: React.FC<CorrectiveFormProps> = ({
  onAdd,
  exercises,
  isLoading
}) => {
  const [formData, setFormData] = useState<Partial<CorrectiveWorkoutSet>>(createDefaultCorrectiveSet());
  const [showNASMGuide, setShowNASMGuide] = useState(false);

  // Group exercises by type
  const groupedExercises = useMemo(() => {
    const groups: Record<string, CorrectiveExerciseOption[]> = {};
    exercises.forEach(ex => {
      const type = ex.type || ex.muscle_group || 'general';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(ex);
    });
    return groups;
  }, [exercises]);

  const handleSubmit = () => {
    if (!formData.exercise_name) {
      return;
    }

    const newSet: CorrectiveWorkoutSet = {
      ...createDefaultCorrectiveSet(),
      ...formData,
      exercise_name: formData.exercise_name!,
    };

    onAdd(newSet);
    setFormData(createDefaultCorrectiveSet());
  };

  const selectedType = formData.corrective_type ? CORRECTIVE_TYPE_INFO[formData.corrective_type] : null;
  const selectedNASMPhase = NASM_PHASES.find(p => p.value === formData.nasm_phase);

  return (
    <div className="space-y-4">
      {/* NASM Corrective Exercise Continuum */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Sparkles size={14} className="text-purple-500" />
          فاز اصلاحی NASM
          <button
            type="button"
            onClick={() => setShowNASMGuide(!showNASMGuide)}
            className="text-[var(--accent-color)]"
          >
            <Info size={12} />
          </button>
        </label>
        
        <div className="grid grid-cols-4 gap-1">
          {NASM_PHASES.map(phase => (
            <button
              key={phase.value}
              type="button"
              onClick={() => setFormData({ ...formData, nasm_phase: phase.value as 'inhibit' | 'lengthen' | 'activate' | 'integrate' })}
              className={`py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                formData.nasm_phase === phase.value
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:scale-105 border border-[var(--glass-border)]'
              }`}
              style={formData.nasm_phase === phase.value ? {
                background: `linear-gradient(135deg, ${
                  phase.color === 'red' ? '#ef4444, #dc2626' :
                  phase.color === 'blue' ? '#3b82f6, #2563eb' :
                  phase.color === 'yellow' ? '#eab308, #ca8a04' :
                  '#22c55e, #16a34a'
                })`
              } : {}}
            >
              <div className="flex flex-col items-center gap-1">
                <span>{phase.icon}</span>
                <span className="text-[10px]">{phase.label.split(' ')[0]}</span>
              </div>
            </button>
          ))}
        </div>

        {selectedNASMPhase && (
          <div className="p-3 rounded-xl text-xs bg-purple-500/10 border border-purple-500/30">
            <div className="font-bold text-purple-500">{selectedNASMPhase.label}</div>
            <div className="text-[var(--text-secondary)] mt-1">{selectedNASMPhase.description}</div>
          </div>
        )}

        {showNASMGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-[var(--glass-bg)] p-3 rounded-xl border border-[var(--glass-border)] text-xs space-y-2"
          >
            <p className="font-bold text-[var(--accent-color)]">زنجیره اصلاحی NASM:</p>
            <p><span className="text-red-500">1. مهار:</span> آزادسازی بافت نرم اورکتیو (فوم رولینگ)</p>
            <p><span className="text-blue-500">2. کشش:</span> افزایش طول بافت کوتاه شده</p>
            <p><span className="text-yellow-500">3. فعال‌سازی:</span> بیدار کردن عضلات آندرکتیو</p>
            <p><span className="text-green-500">4. یکپارچه‌سازی:</span> الگوهای حرکتی صحیح</p>
          </motion.div>
        )}
      </div>

      {/* Corrective Exercise Type */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Target size={14} className="text-teal-500" />
          نوع تمرین اصلاحی
        </label>
        <select
          className="input-glass w-full text-sm"
          value={formData.corrective_type || 'foam_rolling'}
          onChange={e => setFormData({ ...formData, corrective_type: e.target.value as CorrectiveExerciseType })}
        >
          {Object.entries(CORRECTIVE_TYPE_INFO).map(([key, info]) => (
            <option key={key} value={key}>{info.name}</option>
          ))}
        </select>
        {selectedType && (
          <p className="text-xs text-[var(--text-secondary)] bg-teal-500/5 p-2 rounded-lg">
            {selectedType.description}
          </p>
        )}
      </div>

      {/* Exercise Selection */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <MoveHorizontal size={14} className="text-cyan-500" />
          انتخاب حرکت
        </label>
        <select
          className="input-glass w-full font-bold text-teal-500"
          value={formData.exercise_name || ''}
          onChange={e => setFormData({ ...formData, exercise_name: e.target.value })}
        >
          <option value="">انتخاب کنید...</option>
          {isLoading ? (
            <option disabled>در حال بارگذاری...</option>
          ) : (
            Object.entries(groupedExercises).map(([type, exs]) => (
              <optgroup key={type} label={MUSCLE_GROUP_NAMES[type as MuscleGroup] || type}>
                {exs.map(ex => (
                  <option key={ex.id} value={ex.name}>{ex.name}</option>
                ))}
              </optgroup>
            ))
          )}
        </select>
      </div>

      {/* Foam Rolling Specific */}
      {formData.corrective_type === 'foam_rolling' && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl space-y-3">
          <label className="text-sm font-bold text-red-500 flex items-center gap-2">
            <Target size={14} />
            تنظیمات فوم رولینگ
          </label>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-red-600/70">تعداد پاس</label>
              <input
                type="number"
                className="input-glass w-full text-center"
                placeholder="10-15"
                value={formData.passes || ''}
                onChange={e => setFormData({ ...formData, passes: parseInt(e.target.value) })}
                min={5}
                max={30}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-red-600/70">فشار</label>
              <select
                className="input-glass w-full text-center"
                value={formData.pressure || 'moderate'}
                onChange={e => setFormData({ ...formData, pressure: e.target.value as 'light' | 'moderate' | 'deep' })}
              >
                <option value="light">سبک</option>
                <option value="moderate">متوسط</option>
                <option value="deep">عمیق</option>
              </select>
            </div>
          </div>
          
          <p className="text-[10px] text-red-600/70">
            💡 ۳۰-۹۰ ثانیه روی نقاط حساس مکث کنید
          </p>
        </div>
      )}

      {/* Stretching Specific */}
      {['static_stretch', 'dynamic_stretch', 'pnf_stretch'].includes(formData.corrective_type || '') && (
        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl space-y-3">
          <label className="text-sm font-bold text-blue-500 flex items-center gap-2">
            <MoveHorizontal size={14} />
            تنظیمات کشش
          </label>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-blue-600/70">ست</label>
              <input
                type="number"
                className="input-glass w-full text-center"
                value={formData.sets || 2}
                onChange={e => setFormData({ ...formData, sets: parseInt(e.target.value) })}
                min={1}
                max={5}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-blue-600/70">نگه‌داری (ث)</label>
              <input
                type="number"
                className="input-glass w-full text-center"
                value={formData.hold_seconds || 30}
                onChange={e => setFormData({ ...formData, hold_seconds: parseInt(e.target.value) })}
                min={10}
                max={120}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-blue-600/70">سمت</label>
              <select
                className="input-glass w-full text-center"
                value={formData.stretch_side || 'both'}
                onChange={e => setFormData({ ...formData, stretch_side: e.target.value as 'left' | 'right' | 'both' })}
              >
                <option value="both">هر دو</option>
                <option value="left">چپ</option>
                <option value="right">راست</option>
              </select>
            </div>
          </div>

          {formData.corrective_type === 'static_stretch' && (
            <p className="text-[10px] text-blue-600/70">
              💡 کشش ایستا: ۲۰-۳۰ ثانیه نگه‌داری، بدون پرش
            </p>
          )}
          
          {formData.corrective_type === 'pnf_stretch' && (
            <p className="text-[10px] text-blue-600/70">
              💡 PNF: انقباض ۵-۶ ثانیه، رها، سپس کشش عمیق‌تر
            </p>
          )}
        </div>
      )}

      {/* Contraction Type (for activation exercises) */}
      {['activation', 'stability'].includes(formData.corrective_type || '') && (
        <div className="space-y-2">
          <label className="text-xs text-[var(--text-secondary)]">نوع انقباض</label>
          <select
            className="input-glass w-full"
            value={formData.contraction_type || 'isometric'}
            onChange={e => setFormData({ ...formData, contraction_type: e.target.value as ContractionType })}
          >
            {CONTRACTION_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Activation/Stability Specific */}
      {['activation', 'stability'].includes(formData.corrective_type || '') && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl space-y-3">
          <label className="text-sm font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
            <Sparkles size={14} />
            تنظیمات فعال‌سازی
          </label>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-yellow-600/70">ست</label>
              <input
                type="number"
                className="input-glass w-full text-center"
                value={formData.sets || 2}
                onChange={e => setFormData({ ...formData, sets: parseInt(e.target.value) })}
                min={1}
                max={5}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-yellow-600/70">تکرار</label>
              <input
                type="number"
                className="input-glass w-full text-center"
                value={formData.reps || 10}
                onChange={e => setFormData({ ...formData, reps: parseInt(e.target.value) })}
                min={5}
                max={30}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-yellow-600/70">نگه‌داری (ث)</label>
              <input
                type="number"
                className="input-glass w-full text-center"
                value={formData.hold_seconds || 5}
                onChange={e => setFormData({ ...formData, hold_seconds: parseInt(e.target.value) })}
                min={1}
                max={30}
              />
            </div>
          </div>
          
          <p className="text-[10px] text-yellow-600/70">
            💡 تمرکز بر انقباض آگاهانه عضله هدف - نه حرکت!
          </p>
        </div>
      )}

      {/* Breathing Exercises */}
      {formData.corrective_type === 'breathing' && (
        <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-xl space-y-3">
          <label className="text-sm font-bold text-cyan-500 flex items-center gap-2">
            <Wind size={14} />
            تنظیمات تنفس
          </label>
          
          <div className="grid grid-cols-4 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-cyan-600/70">نفس</label>
              <input
                type="number"
                className="input-glass w-full text-center"
                value={formData.breath_count || 10}
                onChange={e => setFormData({ ...formData, breath_count: parseInt(e.target.value) })}
                min={5}
                max={30}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-cyan-600/70">دم (ث)</label>
              <input
                type="number"
                className="input-glass w-full text-center"
                value={formData.inhale_seconds || 4}
                onChange={e => setFormData({ ...formData, inhale_seconds: parseInt(e.target.value) })}
                min={2}
                max={10}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-cyan-600/70">نگه (ث)</label>
              <input
                type="number"
                className="input-glass w-full text-center"
                value={formData.breath_hold_seconds || 4}
                onChange={e => setFormData({ ...formData, breath_hold_seconds: parseInt(e.target.value) })}
                min={0}
                max={10}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-cyan-600/70">بازدم (ث)</label>
              <input
                type="number"
                className="input-glass w-full text-center"
                value={formData.exhale_seconds || 6}
                onChange={e => setFormData({ ...formData, exhale_seconds: parseInt(e.target.value) })}
                min={2}
                max={12}
              />
            </div>
          </div>
          
          <p className="text-[10px] text-cyan-600/70">
            💡 تنفس دیافراگمی: شکم باید هنگام دم بالا بیاید
          </p>
        </div>
      )}

      {/* General Duration (for non-rep based exercises) */}
      {['mobility', 'neural_flossing', 'active_release'].includes(formData.corrective_type || '') && (
        <div className="space-y-2">
          <label className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
            <Clock size={12} />
            مدت زمان (ثانیه)
          </label>
          <input
            type="number"
            className="input-glass w-full text-center"
            value={formData.duration_seconds || 60}
            onChange={e => setFormData({ ...formData, duration_seconds: parseInt(e.target.value) })}
            min={10}
            max={300}
          />
        </div>
      )}

      {/* Movement Dysfunction Target */}
      <div className="space-y-2">
        <label className="text-xs text-[var(--text-secondary)]">ناهنجاری هدف (اختیاری)</label>
        <select
          className="input-glass w-full"
          value={formData.movement_dysfunction || ''}
          onChange={e => setFormData({ ...formData, movement_dysfunction: e.target.value })}
        >
          <option value="">انتخاب کنید...</option>
          <option value="forward_head">سر به جلو</option>
          <option value="rounded_shoulders">شانه گرد</option>
          <option value="kyphosis">کیفوز (قوز)</option>
          <option value="lordosis">لوردوز (گودی کمر)</option>
          <option value="sway_back">کمر قوسی</option>
          <option value="anterior_pelvic_tilt">چرخش قدامی لگن</option>
          <option value="posterior_pelvic_tilt">چرخش خلفی لگن</option>
          <option value="knee_valgus">زانوی ضربدری</option>
          <option value="knee_varus">زانوی پرانتزی</option>
          <option value="flat_feet">کف پای صاف</option>
          <option value="high_arch">قوس زیاد پا</option>
        </select>
      </div>

      {/* Coaching Cues */}
      <div className="space-y-1">
        <label className="text-xs text-[var(--text-secondary)]">نکات مربیگری (اختیاری)</label>
        <input
          type="text"
          className="input-glass w-full text-sm"
          placeholder="نکات تکنیکی مهم..."
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
            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-lg hover:shadow-teal-500/30'
            : 'bg-gray-400 cursor-not-allowed opacity-50'
        }`}
        whileHover={formData.exercise_name ? { scale: 1.02 } : {}}
        whileTap={formData.exercise_name ? { scale: 0.98 } : {}}
      >
        🩹 افزودن حرکت اصلاحی
      </motion.button>
    </div>
  );
};

export default CorrectiveForm;

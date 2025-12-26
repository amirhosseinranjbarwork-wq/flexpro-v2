import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowUpCircle, Target, Clock, AlertTriangle, Info } from 'lucide-react';
import type { 
  PlyometricWorkoutSet, 
  PlyometricIntensity,
  MuscleGroup,
} from '../../../types/training';
import { 
  PLYOMETRIC_INTENSITY_INFO,
  MUSCLE_GROUP_NAMES,
  createDefaultPlyometricSet,
} from '../../../types/training';

interface PlyometricFormProps {
  onAdd: (set: PlyometricWorkoutSet) => void;
  exercises: PlyometricExerciseOption[];
  isLoading?: boolean;
}

interface PlyometricExerciseOption {
  id: string;
  name: string;
  muscle_group?: string;
  difficulty_level?: string;
}

const INTENSITY_COLORS: Record<PlyometricIntensity, string> = {
  low: 'green',
  moderate: 'blue',
  high: 'yellow',
  very_high: 'orange',
  shock: 'red',
};

const PlyometricForm: React.FC<PlyometricFormProps> = ({
  onAdd,
  exercises,
  isLoading
}) => {
  const [formData, setFormData] = useState<Partial<PlyometricWorkoutSet>>(createDefaultPlyometricSet());
  const [showIntensityGuide, setShowIntensityGuide] = useState(false);
  const [showSafetyTips, setShowSafetyTips] = useState(false);

  // Group exercises by muscle group
  const groupedExercises = useMemo(() => {
    const groups: Record<string, PlyometricExerciseOption[]> = {};
    exercises.forEach(ex => {
      const muscle = ex.muscle_group || 'general';
      if (!groups[muscle]) {
        groups[muscle] = [];
      }
      groups[muscle].push(ex);
    });
    return groups;
  }, [exercises]);

  const handleSubmit = () => {
    if (!formData.exercise_name || !formData.contacts) {
      return;
    }

    const newSet: PlyometricWorkoutSet = {
      ...createDefaultPlyometricSet(),
      ...formData,
      exercise_name: formData.exercise_name!,
      contacts: formData.contacts!,
    };

    onAdd(newSet);
    setFormData(createDefaultPlyometricSet());
  };

  const selectedIntensity = formData.intensity ? PLYOMETRIC_INTENSITY_INFO[formData.intensity] : null;
  const intensityColor = formData.intensity ? INTENSITY_COLORS[formData.intensity] : 'blue';

  // Calculate recommended contacts based on intensity
  const recommendedContacts = useMemo(() => {
    switch (formData.intensity) {
      case 'low': return { min: 60, max: 100 };
      case 'moderate': return { min: 40, max: 60 };
      case 'high': return { min: 25, max: 40 };
      case 'very_high': return { min: 15, max: 25 };
      case 'shock': return { min: 10, max: 15 };
      default: return { min: 40, max: 60 };
    }
  }, [formData.intensity]);

  // Calculate total volume (contacts × sets)
  const totalContacts = (formData.sets || 3) * (formData.contacts || 0);

  return (
    <div className="space-y-4">
      {/* Safety Warning */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl"
      >
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-600 dark:text-amber-400">
            <span className="font-bold">نکات ایمنی پلایومتریک:</span>
            <button
              type="button"
              onClick={() => setShowSafetyTips(!showSafetyTips)}
              className="mr-2 underline"
            >
              {showSafetyTips ? 'بستن' : 'نمایش'}
            </button>
          </div>
        </div>
        
        {showSafetyTips && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 text-xs text-amber-600/80 space-y-1"
          >
            <p>• قبل از پلایومتریک حتماً گرم کنید (۱۰-۱۵ دقیقه)</p>
            <p>• از سطح نرم یا تشک استفاده کنید</p>
            <p>• روی تکنیک فرود تمرکز کنید (نرم و کنترل شده)</p>
            <p>• بین جلسات ۴۸-۷۲ ساعت استراحت دهید</p>
            <p>• مبتدیان با شدت کم شروع کنند</p>
          </motion.div>
        )}
      </motion.div>

      {/* Exercise Selection */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Zap size={14} className="text-yellow-500" />
          انتخاب حرکت پلایومتریک
        </label>
        <select
          className="input-glass w-full font-bold text-yellow-500"
          value={formData.exercise_name || ''}
          onChange={e => setFormData({ ...formData, exercise_name: e.target.value })}
        >
          <option value="">انتخاب کنید...</option>
          {isLoading ? (
            <option disabled>در حال بارگذاری...</option>
          ) : (
            Object.entries(groupedExercises).map(([muscle, exs]) => (
              <optgroup key={muscle} label={MUSCLE_GROUP_NAMES[muscle as MuscleGroup] || muscle}>
                {exs.map(ex => (
                  <option key={ex.id} value={ex.name}>{ex.name}</option>
                ))}
              </optgroup>
            ))
          )}
        </select>
      </div>

      {/* Intensity Selection */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Target size={14} className="text-orange-500" />
          شدت پلایومتریک
          <button
            type="button"
            onClick={() => setShowIntensityGuide(!showIntensityGuide)}
            className="text-[var(--accent-color)]"
          >
            <Info size={12} />
          </button>
        </label>
        
        <div className="flex gap-1">
          {Object.entries(PLYOMETRIC_INTENSITY_INFO).map(([key, info]) => {
            const color = INTENSITY_COLORS[key as PlyometricIntensity];
            const isSelected = formData.intensity === key;
            
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFormData({ ...formData, intensity: key as PlyometricIntensity })}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:scale-105 border border-[var(--glass-border)]'
                }`}
                style={isSelected ? {
                  background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  backgroundImage: `linear-gradient(135deg, ${
                    color === 'green' ? '#22c55e, #16a34a' :
                    color === 'blue' ? '#3b82f6, #2563eb' :
                    color === 'yellow' ? '#eab308, #ca8a04' :
                    color === 'orange' ? '#f97316, #ea580c' :
                    '#ef4444, #dc2626'
                  })`
                } : {}}
              >
                {info.name}
              </button>
            );
          })}
        </div>

        {selectedIntensity && (
          <div className={`p-3 rounded-xl text-sm bg-${intensityColor}-500/10 border border-${intensityColor}-500/30`}
            style={{
              backgroundColor: `${
                intensityColor === 'green' ? 'rgba(34, 197, 94, 0.1)' :
                intensityColor === 'blue' ? 'rgba(59, 130, 246, 0.1)' :
                intensityColor === 'yellow' ? 'rgba(234, 179, 8, 0.1)' :
                intensityColor === 'orange' ? 'rgba(249, 115, 22, 0.1)' :
                'rgba(239, 68, 68, 0.1)'
              }`,
              borderColor: `${
                intensityColor === 'green' ? 'rgba(34, 197, 94, 0.3)' :
                intensityColor === 'blue' ? 'rgba(59, 130, 246, 0.3)' :
                intensityColor === 'yellow' ? 'rgba(234, 179, 8, 0.3)' :
                intensityColor === 'orange' ? 'rgba(249, 115, 22, 0.3)' :
                'rgba(239, 68, 68, 0.3)'
              }`
            }}
          >
            <div className="text-xs text-[var(--text-secondary)]">
              <span className="font-bold">مثال‌ها:</span> {selectedIntensity.examples}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              <span className="font-bold">برخورد توصیه شده:</span> {recommendedContacts.min}-{recommendedContacts.max} در هر جلسه
            </div>
          </div>
        )}

        {showIntensityGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-[var(--glass-bg)] p-3 rounded-xl border border-[var(--glass-border)] space-y-2 text-xs"
          >
            <p className="font-bold text-[var(--accent-color)]">راهنمای شدت پلایومتریک:</p>
            <p><span className="text-green-500">●</span> <strong>کم:</strong> پرش در جا، اسکیپ - مناسب مبتدیان</p>
            <p><span className="text-blue-500">●</span> <strong>متوسط:</strong> باکس جامپ کوتاه - تجربه ۶+ ماه</p>
            <p><span className="text-yellow-500">●</span> <strong>بالا:</strong> دپث جامپ - تجربه ۱+ سال</p>
            <p><span className="text-orange-500">●</span> <strong>خیلی بالا:</strong> پرش تک پا - ورزشکاران پیشرفته</p>
            <p><span className="text-red-500">●</span> <strong>شوک:</strong> تمرینات شوک - فقط آتلت‌های نخبه</p>
          </motion.div>
        )}
      </div>

      {/* Sets and Contacts */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-xs text-[var(--text-secondary)]">تعداد ست</label>
          <input
            type="number"
            className="input-glass w-full text-center font-bold"
            value={formData.sets || 3}
            onChange={e => setFormData({ ...formData, sets: parseInt(e.target.value) || 3 })}
            min={1}
            max={10}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs text-[var(--text-secondary)]">برخورد هر ست</label>
          <input
            type="number"
            className="input-glass w-full text-center font-bold"
            value={formData.contacts || ''}
            onChange={e => setFormData({ ...formData, contacts: parseInt(e.target.value) })}
            min={1}
            max={50}
            placeholder={`${Math.round(recommendedContacts.min / 3)}-${Math.round(recommendedContacts.max / 3)}`}
          />
        </div>
      </div>

      {/* Total Contacts Display */}
      {totalContacts > 0 && (
        <div className={`p-2 rounded-lg text-center text-sm ${
          totalContacts > recommendedContacts.max
            ? 'bg-red-500/10 border border-red-500/30 text-red-500'
            : totalContacts >= recommendedContacts.min
              ? 'bg-green-500/10 border border-green-500/30 text-green-500'
              : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-600'
        }`}>
          <span className="font-bold">کل برخورد:</span> {totalContacts}
          <span className="text-xs mr-2">
            (توصیه: {recommendedContacts.min}-{recommendedContacts.max})
          </span>
        </div>
      )}

      {/* Box Height (for box jumps) */}
      <div className="space-y-2">
        <label className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
          <ArrowUpCircle size={12} />
          ارتفاع باکس (اختیاری)
        </label>
        <div className="grid grid-cols-5 gap-1">
          {[30, 45, 60, 75, 90].map(height => (
            <button
              key={height}
              type="button"
              onClick={() => setFormData({ ...formData, box_height_cm: height })}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                formData.box_height_cm === height
                  ? 'bg-yellow-500 text-white shadow-lg'
                  : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-yellow-500/20 border border-[var(--glass-border)]'
              }`}
            >
              {height}cm
            </button>
          ))}
        </div>
        <input
          type="number"
          className="input-glass w-full text-center"
          placeholder="ارتفاع دلخواه (cm)"
          value={formData.box_height_cm || ''}
          onChange={e => setFormData({ ...formData, box_height_cm: parseInt(e.target.value) })}
          min={10}
          max={150}
        />
      </div>

      {/* Landing Type */}
      <div className="space-y-2">
        <label className="text-xs text-[var(--text-secondary)]">نوع فرود</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'step_down', label: 'پایین رفتن', icon: '⬇️' },
            { value: 'jump_down', label: 'پرش پایین', icon: '⤵️' },
            { value: 'rebound', label: 'ری‌باند', icon: '🔄' },
          ].map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, landing_type: option.value as 'step_down' | 'jump_down' | 'rebound' })}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                formData.landing_type === option.value
                  ? 'bg-yellow-500 text-white shadow-lg'
                  : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-yellow-500/20 border border-[var(--glass-border)]'
              }`}
            >
              {option.icon} {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Single Leg */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_single_leg || false}
            onChange={e => setFormData({ ...formData, is_single_leg: e.target.checked })}
            className="w-4 h-4 accent-yellow-500"
          />
          <span className="text-sm">حرکت تک پا</span>
        </label>
      </div>

      {/* Rest */}
      <div className="space-y-2">
        <label className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
          <Clock size={12} />
          استراحت بین ست‌ها
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            className="input-glass flex-1 text-center"
            value={formData.rest_seconds || 120}
            onChange={e => setFormData({ ...formData, rest_seconds: parseInt(e.target.value) || 120 })}
            min={30}
            max={300}
          />
          <span className="text-xs text-[var(--text-secondary)]">ثانیه</span>
        </div>
        <p className="text-[10px] text-[var(--text-secondary)]">
          💡 توصیه: ۹۰-۱۸۰ ثانیه استراحت برای ریکاوری کامل سیستم عصبی
        </p>
      </div>

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
        disabled={!formData.exercise_name || !formData.contacts}
        className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
          formData.exercise_name && formData.contacts
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-lg hover:shadow-yellow-500/30'
            : 'bg-gray-400 cursor-not-allowed opacity-50'
        }`}
        whileHover={formData.exercise_name && formData.contacts ? { scale: 1.02 } : {}}
        whileTap={formData.exercise_name && formData.contacts ? { scale: 0.98 } : {}}
      >
        ⚡ افزودن حرکت پلایومتریک
      </motion.button>
    </div>
  );
};

export default PlyometricForm;

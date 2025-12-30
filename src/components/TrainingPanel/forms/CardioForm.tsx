import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, Flame, Activity, Zap, BarChart2 } from 'lucide-react';
import type { 
  CardioWorkoutSet, 
  CardioMethod,
} from '../../../types/training';
import { 
  HEART_RATE_ZONES,
  CARDIO_METHOD_INFO,
  createDefaultCardioSet,
} from '../../../types/training';

interface CardioFormProps {
  onAdd: (set: CardioWorkoutSet) => void;
  exercises: CardioExerciseOption[];
  isLoading?: boolean;
}

interface CardioExerciseOption {
  id: string;
  name: string;
  equipment?: string;
  category?: string;
}

const CardioForm: React.FC<CardioFormProps> = ({
  onAdd,
  exercises,
  isLoading
}) => {
  const [formData, setFormData] = useState<Partial<CardioWorkoutSet>>(createDefaultCardioSet());
  const [showZoneDetails, setShowZoneDetails] = useState(false);

  // Group exercises by equipment/category
  const groupedExercises = useMemo(() => {
    const groups: Record<string, CardioExerciseOption[]> = {};
    exercises.forEach(ex => {
      const category = ex.equipment || ex.category || 'general';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(ex);
    });
    return groups;
  }, [exercises]);

  const handleSubmit = () => {
    if (!formData.exercise_name || !formData.duration_minutes) {
      return;
    }

    const newSet: CardioWorkoutSet = {
      ...createDefaultCardioSet(),
      ...formData,
      exercise_name: formData.exercise_name!,
      duration_minutes: formData.duration_minutes!,
    };

    onAdd(newSet);
    setFormData(createDefaultCardioSet());
  };

  const selectedMethod = formData.cardio_method ? CARDIO_METHOD_INFO[formData.cardio_method] : null;
  const selectedZone = HEART_RATE_ZONES.find(z => z.zone === formData.target_heart_rate_zone);

  // Calculate estimated calories (rough estimate)
  const estimatedCalories = useMemo(() => {
    const duration = formData.duration_minutes || 0;
    const zone = formData.target_heart_rate_zone || 2;
    const baseCalPerMin = [4, 6, 8, 10, 12][zone - 1]; // Rough estimate per zone
    return Math.round(duration * baseCalPerMin);
  }, [formData.duration_minutes, formData.target_heart_rate_zone]);

  return (
    <div className="space-y-4">
      {/* Cardio Method Selection */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Activity size={14} className="text-green-500" />
          روش تمرین کاردیو
        </label>
        <select
          className="input-glass w-full text-sm"
          value={formData.cardio_method || 'liss'}
          onChange={e => setFormData({ ...formData, cardio_method: e.target.value as CardioMethod })}
        >
          {Object.entries(CARDIO_METHOD_INFO).map(([key, info]) => (
            <option key={key} value={key}>{info.name}</option>
          ))}
        </select>
        {selectedMethod && (
          <p className="text-xs text-[var(--text-secondary)] bg-green-500/5 p-2 rounded-lg">
            {selectedMethod.description}
          </p>
        )}
      </div>

      {/* Exercise Selection */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Flame size={14} className="text-orange-500" />
          انتخاب تمرین
        </label>
        <select
          className="input-glass w-full font-bold text-green-500"
          value={formData.exercise_name || ''}
          onChange={e => setFormData({ ...formData, exercise_name: e.target.value })}
        >
          <option value="">انتخاب کنید...</option>
          {isLoading ? (
            <option disabled>در حال بارگذاری...</option>
          ) : (
            Object.entries(groupedExercises).map(([category, exs]) => (
              <optgroup key={category} label={category}>
                {exs.map(ex => (
                  <option key={ex.id} value={ex.name}>{ex.name}</option>
                ))}
              </optgroup>
            ))
          )}
        </select>
      </div>

      {/* Heart Rate Zone */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Heart size={14} className="text-red-500" />
          ناحیه ضربان قلب
          <button
            type="button"
            onClick={() => setShowZoneDetails(!showZoneDetails)}
            className="text-[var(--accent-color)] text-xs hover:underline"
          >
            {showZoneDetails ? 'بستن' : 'راهنما'}
          </button>
        </label>
        
        {/* Zone Selector */}
        <div className="flex gap-1">
          {HEART_RATE_ZONES.map(zone => (
            <button
              key={zone.zone}
              type="button"
              onClick={() => setFormData({ ...formData, target_heart_rate_zone: zone.zone })}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                formData.target_heart_rate_zone === zone.zone
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:scale-105 border border-[var(--glass-border)]'
              }`}
              style={formData.target_heart_rate_zone === zone.zone ? {
                background: `linear-gradient(135deg, ${
                  zone.zone === 1 ? '#22c55e' :
                  zone.zone === 2 ? '#84cc16' :
                  zone.zone === 3 ? '#eab308' :
                  zone.zone === 4 ? '#f97316' :
                  '#ef4444'
                }, ${
                  zone.zone === 1 ? '#16a34a' :
                  zone.zone === 2 ? '#65a30d' :
                  zone.zone === 3 ? '#ca8a04' :
                  zone.zone === 4 ? '#ea580c' :
                  '#dc2626'
                })`
              } : {}}
            >
              <div className="flex flex-col items-center gap-1">
                <span>Zone {zone.zone}</span>
                <span className="text-[10px] opacity-80">{zone.percentage}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Zone Info */}
        {selectedZone && (
          <div className={`p-3 rounded-xl text-sm ${
            selectedZone.zone === 1 ? 'bg-green-500/10 border border-green-500/30' :
            selectedZone.zone === 2 ? 'bg-lime-500/10 border border-lime-500/30' :
            selectedZone.zone === 3 ? 'bg-yellow-500/10 border border-yellow-500/30' :
            selectedZone.zone === 4 ? 'bg-orange-500/10 border border-orange-500/30' :
            'bg-red-500/10 border border-red-500/30'
          }`}>
            <div className="font-bold mb-1">{selectedZone.name}</div>
            <div className="text-xs text-[var(--text-secondary)]">{selectedZone.benefit}</div>
          </div>
        )}

        {/* Zone Details */}
        {showZoneDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-[var(--glass-bg)] p-3 rounded-xl border border-[var(--glass-border)] space-y-2"
          >
            <p className="text-xs font-bold text-[var(--accent-color)] mb-2">راهنمای زون‌های ضربان قلب:</p>
            {HEART_RATE_ZONES.map(zone => (
              <div key={zone.zone} className="text-xs flex gap-2">
                <span className="font-bold text-[var(--accent-color)]">Zone {zone.zone}:</span>
                <span>{zone.name} ({zone.percentage})</span>
                <span className="text-[var(--text-secondary)]">- {zone.description}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Clock size={14} className="text-blue-500" />
          مدت زمان
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[10, 20, 30, 45].map(mins => (
            <button
              key={mins}
              type="button"
              onClick={() => setFormData({ ...formData, duration_minutes: mins })}
              className={`py-2 rounded-xl text-sm font-bold transition-all ${
                formData.duration_minutes === mins
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-blue-500/20 border border-[var(--glass-border)]'
              }`}
            >
              {mins}′
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            className="input-glass flex-1 text-center font-bold"
            placeholder="سایر"
            value={formData.duration_minutes || ''}
            onChange={e => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
            min={1}
            max={180}
          />
          <span className="text-sm text-[var(--text-secondary)]">دقیقه</span>
        </div>
      </div>

      {/* HIIT/Interval Specific */}
      {['hiit', 'tabata', 'intervals'].includes(formData.cardio_method || '') && (
        <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl space-y-3">
          <label className="text-sm font-bold text-orange-500 flex items-center gap-2">
            <Zap size={14} />
            تنظیمات اینتروال
          </label>
          
          {formData.cardio_method === 'tabata' ? (
            <div className="text-xs text-[var(--text-secondary)]">
              ⚡ تاباتا: ۲۰ ثانیه کار / ۱۰ ثانیه استراحت × ۸ راند
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-orange-600/70">کار (ثانیه)</label>
                <input
                  type="number"
                  className="input-glass w-full text-center"
                  placeholder="30"
                  value={formData.work_duration_seconds || ''}
                  onChange={e => setFormData({ ...formData, work_duration_seconds: parseInt(e.target.value) })}
                  min={5}
                  max={300}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-orange-600/70">استراحت (ثانیه)</label>
                <input
                  type="number"
                  className="input-glass w-full text-center"
                  placeholder="30"
                  value={formData.rest_duration_seconds || ''}
                  onChange={e => setFormData({ ...formData, rest_duration_seconds: parseInt(e.target.value) })}
                  min={5}
                  max={300}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-orange-600/70">تعداد راند</label>
                <input
                  type="number"
                  className="input-glass w-full text-center"
                  placeholder="8"
                  value={formData.intervals || ''}
                  onChange={e => setFormData({ ...formData, intervals: parseInt(e.target.value) })}
                  min={1}
                  max={50}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Equipment-specific parameters */}
      {formData.exercise_name && (
        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl space-y-3">
          <label className="text-sm font-bold text-blue-500 flex items-center gap-2">
            <BarChart2 size={14} />
            تنظیمات دستگاه (اختیاری)
          </label>
          
          {/* Treadmill */}
          {(formData.exercise_name?.toLowerCase().includes('تردمیل') || 
            formData.exercise_name?.toLowerCase().includes('treadmill') ||
            formData.exercise_name?.toLowerCase().includes('دویدن')) && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-blue-600/70">سرعت (km/h)</label>
                <input
                  type="number"
                  className="input-glass w-full text-center"
                  placeholder="8"
                  value={formData.speed || ''}
                  onChange={e => setFormData({ ...formData, speed: parseFloat(e.target.value) })}
                  min={1}
                  max={30}
                  step={0.5}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-blue-600/70">شیب (%)</label>
                <input
                  type="number"
                  className="input-glass w-full text-center"
                  placeholder="0"
                  value={formData.incline || ''}
                  onChange={e => setFormData({ ...formData, incline: parseFloat(e.target.value) })}
                  min={0}
                  max={15}
                  step={0.5}
                />
              </div>
            </div>
          )}
          
          {/* Bike */}
          {(formData.exercise_name?.toLowerCase().includes('دوچرخه') || 
            formData.exercise_name?.toLowerCase().includes('bike') ||
            formData.exercise_name?.toLowerCase().includes('cycling')) && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-blue-600/70">مقاومت (1-10)</label>
                <input
                  type="number"
                  className="input-glass w-full text-center"
                  placeholder="5"
                  value={formData.resistance || ''}
                  onChange={e => setFormData({ ...formData, resistance: parseInt(e.target.value) })}
                  min={1}
                  max={10}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-blue-600/70">RPM</label>
                <input
                  type="number"
                  className="input-glass w-full text-center"
                  placeholder="80"
                  value={formData.rpm || ''}
                  onChange={e => setFormData({ ...formData, rpm: parseInt(e.target.value) })}
                  min={40}
                  max={120}
                />
              </div>
            </div>
          )}
          
          {/* Rowing */}
          {(formData.exercise_name?.toLowerCase().includes('روئینگ') || 
            formData.exercise_name?.toLowerCase().includes('rowing') ||
            formData.exercise_name?.toLowerCase().includes('rower')) && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-blue-600/70">مقاومت (1-10)</label>
                <input
                  type="number"
                  className="input-glass w-full text-center"
                  placeholder="5"
                  value={formData.resistance || ''}
                  onChange={e => setFormData({ ...formData, resistance: parseInt(e.target.value) })}
                  min={1}
                  max={10}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-blue-600/70">Stroke Rate (/min)</label>
                <input
                  type="number"
                  className="input-glass w-full text-center"
                  placeholder="24"
                  value={formData.stroke_rate || ''}
                  onChange={e => setFormData({ ...formData, stroke_rate: parseInt(e.target.value) })}
                  min={18}
                  max={40}
                />
              </div>
            </div>
          )}
          
          {/* Elliptical */}
          {(formData.exercise_name?.toLowerCase().includes('الپتیکال') || 
            formData.exercise_name?.toLowerCase().includes('elliptical')) && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-blue-600/70">مقاومت (1-10)</label>
                <input
                  type="number"
                  className="input-glass w-full text-center"
                  placeholder="5"
                  value={formData.resistance || ''}
                  onChange={e => setFormData({ ...formData, resistance: parseInt(e.target.value) })}
                  min={1}
                  max={10}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-blue-600/70">Stride Rate (/min)</label>
                <input
                  type="number"
                  className="input-glass w-full text-center"
                  placeholder="140"
                  value={formData.stride_rate || ''}
                  onChange={e => setFormData({ ...formData, stride_rate: parseInt(e.target.value) })}
                  min={100}
                  max={180}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Steady State Specific */}
      {['liss', 'miss', 'tempo_run'].includes(formData.cardio_method || '') && (
        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl space-y-3">
          <label className="text-sm font-bold text-blue-500 flex items-center gap-2">
            <BarChart2 size={14} />
            تنظیمات تردمیل/دستگاه (اختیاری)
          </label>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-blue-600/70">سرعت (km/h)</label>
              <input
                type="number"
                className="input-glass w-full text-center"
                placeholder="6.0"
                value={formData.target_speed || ''}
                onChange={e => setFormData({ ...formData, target_speed: parseFloat(e.target.value) })}
                step={0.5}
                min={1}
                max={25}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-blue-600/70">شیب (%)</label>
              <input
                type="number"
                className="input-glass w-full text-center"
                placeholder="1.0"
                value={formData.target_incline || ''}
                onChange={e => setFormData({ ...formData, target_incline: parseFloat(e.target.value) })}
                step={0.5}
                min={0}
                max={15}
              />
            </div>
          </div>
        </div>
      )}

      {/* Target Heart Rate (Optional) */}
      <div className="space-y-2">
        <label className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
          <Heart size={12} />
          ضربان قلب هدف (اختیاری)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] text-[var(--text-secondary)]">حداقل</label>
            <input
              type="number"
              className="input-glass w-full text-center"
              placeholder="120"
              value={formData.target_hr_min || ''}
              onChange={e => setFormData({ ...formData, target_hr_min: parseInt(e.target.value) })}
              min={60}
              max={220}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-[var(--text-secondary)]">حداکثر</label>
            <input
              type="number"
              className="input-glass w-full text-center"
              placeholder="150"
              value={formData.target_hr_max || ''}
              onChange={e => setFormData({ ...formData, target_hr_max: parseInt(e.target.value) })}
              min={60}
              max={220}
            />
          </div>
        </div>
      </div>

      {/* Target Calories */}
      <div className="space-y-2">
        <label className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
          <Flame size={12} />
          هدف کالری (اختیاری)
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            className="input-glass flex-1 text-center"
            placeholder={`تخمینی: ${estimatedCalories}`}
            value={formData.target_calories || ''}
            onChange={e => setFormData({ ...formData, target_calories: parseInt(e.target.value) })}
            min={10}
            max={2000}
          />
          <span className="text-xs text-[var(--text-secondary)]">kcal</span>
        </div>
        {estimatedCalories > 0 && !formData.target_calories && (
          <p className="text-[10px] text-[var(--text-secondary)]">
            🔥 کالری تخمینی: ~{estimatedCalories} kcal
          </p>
        )}
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
        disabled={!formData.exercise_name || !formData.duration_minutes}
        className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
          formData.exercise_name && formData.duration_minutes
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/30'
            : 'bg-gray-400 cursor-not-allowed opacity-50'
        }`}
        whileHover={formData.exercise_name && formData.duration_minutes ? { scale: 1.02 } : {}}
        whileTap={formData.exercise_name && formData.duration_minutes ? { scale: 0.98 } : {}}
      >
        🏃 افزودن تمرین کاردیو
      </motion.button>
    </div>
  );
};

export default CardioForm;

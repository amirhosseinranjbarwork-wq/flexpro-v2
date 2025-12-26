/**
 * ExerciseConfigCard Component
 * Dynamic configuration card for exercises in the workout canvas
 * Renders different inputs based on exercise type (Resistance, Cardio, Plyometric, Corrective)
 */

import React, { memo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown,
  Heart,
  Dumbbell,
  Zap,
  Target,
  Timer,
  Flame,
  Settings2,
  ChevronRight,
  Info,
  RotateCcw,
  Mountain,
  Footprints,
  Wind
} from 'lucide-react';
import { useWorkoutStore } from '../../store';
import type { 
  WorkoutExerciseInstance, 
  ResistanceConfig, 
  CardioConfig, 
  PlyometricConfig, 
  CorrectiveConfig 
} from '../../store/workoutStore';
import { 
  RPE_DESCRIPTIONS, 
  RIR_DESCRIPTIONS, 
  HEART_RATE_ZONES,
  CARDIO_METHOD_INFO,
  PLYOMETRIC_INTENSITY_INFO,
  CORRECTIVE_TYPE_INFO,
} from '../../types/training';
import type { 
  RPE, 
  RIR, 
  HeartRateZone, 
  CardioMethod, 
  PlyometricIntensity, 
  CorrectiveExerciseType, 
  TrainingSystemType 
} from '../../types/training';

// ========== Reusable Input Components ==========

interface NumberInputProps {
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  icon?: React.ReactNode;
  placeholder?: string;
}

const NumberInput: React.FC<NumberInputProps> = memo(({ 
  label, value, onChange, min = 0, max = 999, step = 1, unit, icon, placeholder 
}) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
      {icon}
      {label}
    </label>
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2
                   text-sm text-slate-100 text-center font-medium
                   focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60
                   transition-all duration-200 placeholder:text-slate-600"
      />
      {unit && (
        <span className="text-[11px] text-slate-500 font-medium min-w-[30px]">{unit}</span>
      )}
    </div>
  </div>
));

NumberInput.displayName = 'NumberInput';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

const TextInput: React.FC<TextInputProps> = memo(({ 
  label, value, onChange, placeholder, icon 
}) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
      {icon}
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2
                 text-sm text-slate-100 font-medium
                 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60
                 transition-all duration-200 placeholder:text-slate-600"
    />
  </div>
));

TextInput.displayName = 'TextInput';

interface SelectInputProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: { value: string | number; label: string; description?: string }[];
  icon?: React.ReactNode;
}

const SelectInput: React.FC<SelectInputProps> = memo(({ 
  label, value, onChange, options, icon 
}) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
      {icon}
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2
                 text-sm text-slate-100 font-medium
                 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60
                 transition-all duration-200 cursor-pointer"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
));

SelectInput.displayName = 'SelectInput';

// ========== Resistance Config Panel ==========

interface ResistanceConfigPanelProps {
  instanceId: string;
  config: ResistanceConfig;
}

const ResistanceConfigPanel: React.FC<ResistanceConfigPanelProps> = memo(({ instanceId, config }) => {
  const updateConfig = useWorkoutStore(state => state.updateResistanceConfig);

  const handleChange = useCallback(<K extends keyof ResistanceConfig>(
    field: K, 
    value: ResistanceConfig[K]
  ) => {
    updateConfig(instanceId, { [field]: value } as Partial<ResistanceConfig>);
  }, [instanceId, updateConfig]);

  const systemOptions = [
    { value: 'straight_set', label: '🎯 ست ساده' },
    { value: 'superset', label: '🔄 سوپرست' },
    { value: 'drop_set', label: '📉 درآپ‌ست' },
    { value: 'rest_pause', label: '⏸️ رست-پاز' },
    { value: 'pyramid', label: '🔺 هرمی' },
    { value: 'german_volume', label: '💪 10×10' },
    { value: 'tempo', label: '⏱️ تمپو' },
    { value: 'cluster_set', label: '🧩 کلاستر' },
  ];

  const rpeOptions = [
    { value: '', label: '—' },
    ...([6, 7, 8, 9, 10] as const).map(v => ({ 
      value: v, 
      label: `${v} - ${RPE_DESCRIPTIONS[v]?.slice(0, 20)}` 
    }))
  ];

  const rirOptions = [
    { value: '', label: '—' },
    ...([0, 1, 2, 3, 4, 5] as const).map(v => ({ 
      value: v, 
      label: `${v} - ${RIR_DESCRIPTIONS[v]?.slice(0, 25)}` 
    }))
  ];

  return (
    <div className="space-y-4">
      {/* Training System */}
      <SelectInput
        label="سیستم تمرینی"
        value={config.trainingSystem}
        onChange={(v) => handleChange('trainingSystem', v as TrainingSystemType)}
        options={systemOptions}
        icon={<Settings2 size={12} />}
      />

      {/* Sets, Reps, Weight Row */}
      <div className="grid grid-cols-3 gap-3">
        <NumberInput
          label="ست"
          value={config.sets}
          onChange={(v) => handleChange('sets', v)}
          min={1}
          max={20}
          icon={<RotateCcw size={12} />}
        />
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <Dumbbell size={12} />
            تکرار
          </label>
          <input
            type="text"
            value={config.reps}
            onChange={(e) => handleChange('reps', e.target.value)}
            placeholder="8-12"
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2
                       text-sm text-slate-100 text-center font-medium
                       focus:outline-none focus:ring-2 focus:ring-blue-500/40 placeholder:text-slate-600"
          />
        </div>
        <NumberInput
          label="وزن"
          value={config.weight}
          onChange={(v) => handleChange('weight', v)}
          step={0.5}
          unit={config.weightUnit}
          placeholder="0"
        />
      </div>

      {/* RPE & RIR Row - Key Scientific Parameters */}
      <div className="grid grid-cols-2 gap-3">
        <SelectInput
          label="RPE (شدت درک شده)"
          value={config.rpe ?? ''}
          onChange={(v) => handleChange('rpe', v ? parseInt(v as string) as RPE : undefined)}
          options={rpeOptions}
          icon={<Flame size={12} className="text-orange-400" />}
        />
        <SelectInput
          label="RIR (تکرار در ذخیره)"
          value={config.rir ?? ''}
          onChange={(v) => handleChange('rir', v !== '' ? parseInt(v as string) as RIR : undefined)}
          options={rirOptions}
          icon={<Target size={12} className="text-green-400" />}
        />
      </div>

      {/* Tempo & Rest Row */}
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="تمپو (فاز اکسنتریک-مکث-کانسنتریک-مکث)"
          value={config.tempo || ''}
          onChange={(v) => handleChange('tempo', v)}
          placeholder="3-1-2-0"
          icon={<Timer size={12} className="text-purple-400" />}
        />
        <NumberInput
          label="استراحت بین ست‌ها"
          value={config.restSeconds}
          onChange={(v) => handleChange('restSeconds', v)}
          min={10}
          max={600}
          unit="ثانیه"
          icon={<Timer size={12} />}
        />
      </div>

      {/* Notes */}
      <TextInput
        label="یادداشت مربی"
        value={config.notes || ''}
        onChange={(v) => handleChange('notes', v)}
        placeholder="نکات تکنیکی، احتیاط‌ها..."
        icon={<Info size={12} />}
      />
    </div>
  );
});

ResistanceConfigPanel.displayName = 'ResistanceConfigPanel';

// ========== Cardio Config Panel ==========

interface CardioConfigPanelProps {
  instanceId: string;
  config: CardioConfig;
}

const CardioConfigPanel: React.FC<CardioConfigPanelProps> = memo(({ instanceId, config }) => {
  const updateConfig = useWorkoutStore(state => state.updateCardioConfig);

  const handleChange = useCallback(<K extends keyof CardioConfig>(
    field: K, 
    value: CardioConfig[K]
  ) => {
    updateConfig(instanceId, { [field]: value } as Partial<CardioConfig>);
  }, [instanceId, updateConfig]);

  const methodOptions = Object.entries(CARDIO_METHOD_INFO).map(([key, info]) => ({
    value: key,
    label: `${key === 'liss' ? '🚶' : key === 'hiit' ? '🔥' : key === 'tabata' ? '⚡' : '🏃'} ${info.name}`,
  }));

  const zoneOptions = HEART_RATE_ZONES.map(zone => ({
    value: zone.zone,
    label: `Zone ${zone.zone} - ${zone.name} (${zone.percentage})`,
  }));

  const currentZone = HEART_RATE_ZONES.find(z => z.zone === config.targetZone);

  return (
    <div className="space-y-4">
      {/* Method Selection */}
      <SelectInput
        label="متد کاردیو"
        value={config.method}
        onChange={(v) => handleChange('method', v as CardioMethod)}
        options={methodOptions}
        icon={<Heart size={12} className="text-red-400" />}
      />

      {/* Duration & Zone */}
      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="مدت زمان کل"
          value={config.durationMinutes}
          onChange={(v) => handleChange('durationMinutes', v)}
          min={1}
          max={180}
          unit="دقیقه"
          icon={<Timer size={12} />}
        />
        <SelectInput
          label="ناحیه ضربان قلب هدف"
          value={config.targetZone}
          onChange={(v) => handleChange('targetZone', parseInt(v as string) as HeartRateZone)}
          options={zoneOptions}
          icon={<Heart size={12} className="text-red-400" />}
        />
      </div>

      {/* Zone Info Card */}
      {currentZone && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 
                     border border-red-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-red-400">{currentZone.name}</span>
              <p className="text-xs text-slate-400 mt-0.5">{currentZone.percentage} حداکثر ضربان قلب</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">مزیت اصلی:</span>
              <p className="text-xs text-slate-300">{currentZone.benefit}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* HIIT Specific Settings */}
      {['hiit', 'tabata', 'intervals'].includes(config.method) && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20"
        >
          <NumberInput
            label="زمان کار"
            value={config.workSeconds}
            onChange={(v) => handleChange('workSeconds', v)}
            min={5}
            max={300}
            unit="ثانیه"
            icon={<Zap size={12} className="text-yellow-400" />}
          />
          <NumberInput
            label="زمان استراحت"
            value={config.restSeconds}
            onChange={(v) => handleChange('restSeconds', v)}
            min={5}
            max={300}
            unit="ثانیه"
          />
          <NumberInput
            label="تعداد راند"
            value={config.intervals}
            onChange={(v) => handleChange('intervals', v)}
            min={1}
            max={50}
            icon={<RotateCcw size={12} />}
          />
        </motion.div>
      )}

      {/* Steady State Settings */}
      {['liss', 'miss', 'tempo_run'].includes(config.method) && (
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="سرعت هدف"
            value={config.targetSpeed}
            onChange={(v) => handleChange('targetSpeed', v)}
            step={0.5}
            unit="km/h"
            icon={<Wind size={12} />}
          />
          <NumberInput
            label="شیب"
            value={config.targetIncline}
            onChange={(v) => handleChange('targetIncline', v)}
            step={0.5}
            unit="%"
            icon={<Mountain size={12} />}
          />
        </div>
      )}

      {/* Notes */}
      <TextInput
        label="یادداشت"
        value={config.notes || ''}
        onChange={(v) => handleChange('notes', v)}
        placeholder="توضیحات اضافی..."
        icon={<Info size={12} />}
      />
    </div>
  );
});

CardioConfigPanel.displayName = 'CardioConfigPanel';

// ========== Plyometric Config Panel ==========

interface PlyometricConfigPanelProps {
  instanceId: string;
  config: PlyometricConfig;
}

const PlyometricConfigPanel: React.FC<PlyometricConfigPanelProps> = memo(({ instanceId, config }) => {
  const updateConfig = useWorkoutStore(state => state.updatePlyometricConfig);

  const handleChange = useCallback(<K extends keyof PlyometricConfig>(
    field: K, 
    value: PlyometricConfig[K]
  ) => {
    updateConfig(instanceId, { [field]: value } as Partial<PlyometricConfig>);
  }, [instanceId, updateConfig]);

  const intensityOptions = Object.entries(PLYOMETRIC_INTENSITY_INFO).map(([key, info]) => ({
    value: key,
    label: `${key === 'low' ? '🟢' : key === 'moderate' ? '🟡' : key === 'high' ? '🟠' : '🔴'} ${info.name}`,
  }));

  const landingOptions = [
    { value: '', label: '— انتخاب کنید —' },
    { value: 'step_down', label: '🚶 پایین رفتن آرام' },
    { value: 'jump_down', label: '⬇️ پرش پایین' },
    { value: 'rebound', label: '🔄 ری‌باند (بازگشت فوری)' },
  ];

  const currentIntensity = PLYOMETRIC_INTENSITY_INFO[config.intensity as PlyometricIntensity];

  return (
    <div className="space-y-4">
      {/* Intensity Selection */}
      <SelectInput
        label="سطح شدت"
        value={config.intensity}
        onChange={(v) => handleChange('intensity', v as PlyometricIntensity)}
        options={intensityOptions}
        icon={<Zap size={12} className="text-yellow-400" />}
      />

      {/* Intensity Info */}
      {currentIntensity && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
        >
          <span className="text-xs text-slate-400">مثال‌ها: </span>
          <span className="text-xs text-yellow-400">{currentIntensity.examples}</span>
        </motion.div>
      )}

      {/* Sets, Contacts, Rest */}
      <div className="grid grid-cols-3 gap-3">
        <NumberInput
          label="تعداد ست"
          value={config.sets}
          onChange={(v) => handleChange('sets', v)}
          min={1}
          max={10}
          icon={<RotateCcw size={12} />}
        />
        <NumberInput
          label="برخورد (Contacts)"
          value={config.contacts}
          onChange={(v) => handleChange('contacts', v)}
          min={1}
          max={50}
          icon={<Footprints size={12} className="text-blue-400" />}
        />
        <NumberInput
          label="استراحت"
          value={config.restSeconds}
          onChange={(v) => handleChange('restSeconds', v)}
          min={30}
          max={300}
          unit="ثانیه"
        />
      </div>

      {/* Box Height & Landing Type */}
      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="ارتفاع باکس/مانع"
          value={config.boxHeightCm}
          onChange={(v) => handleChange('boxHeightCm', v)}
          min={10}
          max={150}
          unit="cm"
          icon={<Mountain size={12} />}
        />
        <SelectInput
          label="نوع فرود"
          value={config.landingType || ''}
          onChange={(v) => handleChange('landingType', v as PlyometricConfig['landingType'])}
          options={landingOptions}
        />
      </div>

      {/* Single Leg Toggle */}
      <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:bg-slate-800/70 transition-colors">
        <input
          type="checkbox"
          checked={config.isSingleLeg || false}
          onChange={(e) => handleChange('isSingleLeg', e.target.checked)}
          className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-blue-500 
                     focus:ring-blue-500/50 focus:ring-offset-slate-900 cursor-pointer"
        />
        <div>
          <span className="text-sm font-medium text-slate-200">تمرین تک‌پا 🦵</span>
          <p className="text-[11px] text-slate-500">اجرای حرکت با یک پا برای چالش بیشتر</p>
        </div>
      </label>

      {/* Notes */}
      <TextInput
        label="یادداشت فنی"
        value={config.notes || ''}
        onChange={(v) => handleChange('notes', v)}
        placeholder="نکات تکنیکی، فرود نرم..."
        icon={<Info size={12} />}
      />
    </div>
  );
});

PlyometricConfigPanel.displayName = 'PlyometricConfigPanel';

// ========== Corrective Config Panel ==========

interface CorrectiveConfigPanelProps {
  instanceId: string;
  config: CorrectiveConfig;
}

const CorrectiveConfigPanel: React.FC<CorrectiveConfigPanelProps> = memo(({ instanceId, config }) => {
  const updateConfig = useWorkoutStore(state => state.updateCorrectiveConfig);

  const handleChange = useCallback(<K extends keyof CorrectiveConfig>(
    field: K, 
    value: CorrectiveConfig[K]
  ) => {
    updateConfig(instanceId, { [field]: value } as Partial<CorrectiveConfig>);
  }, [instanceId, updateConfig]);

  const typeOptions = Object.entries(CORRECTIVE_TYPE_INFO).map(([key, info]) => ({
    value: key,
    label: `${key === 'foam_rolling' ? '🧘' : key === 'static_stretch' ? '🧎' : key === 'dynamic_stretch' ? '💫' : key === 'activation' ? '⚡' : '🔗'} ${info.name}`,
  }));

  const phaseOptions = [
    { value: '', label: '— انتخاب کنید —' },
    { value: 'inhibit', label: '🔴 مهار (Inhibit) - فوم رولر' },
    { value: 'lengthen', label: '📏 کشش (Lengthen) - استرچ استاتیک' },
    { value: 'activate', label: '⚡ فعال‌سازی (Activate) - تمرینات ایزومتریک' },
    { value: 'integrate', label: '🔗 یکپارچه‌سازی (Integrate) - حرکات ترکیبی' },
  ];

  const sideOptions = [
    { value: 'both', label: 'هر دو طرف' },
    { value: 'left', label: 'فقط چپ' },
    { value: 'right', label: 'فقط راست' },
  ];

  const pressureOptions = [
    { value: 'light', label: '🟢 سبک' },
    { value: 'moderate', label: '🟡 متوسط' },
    { value: 'deep', label: '🔴 عمیق' },
  ];

  const currentType = CORRECTIVE_TYPE_INFO[config.correctiveType as CorrectiveExerciseType];

  return (
    <div className="space-y-4">
      {/* Type & NASM Phase */}
      <div className="grid grid-cols-2 gap-3">
        <SelectInput
          label="نوع تمرین اصلاحی"
          value={config.correctiveType}
          onChange={(v) => handleChange('correctiveType', v as CorrectiveExerciseType)}
          options={typeOptions}
          icon={<Target size={12} className="text-teal-400" />}
        />
        <SelectInput
          label="فاز NASM"
          value={config.nasmPhase || ''}
          onChange={(v) => handleChange('nasmPhase', v as CorrectiveConfig['nasmPhase'])}
          options={phaseOptions}
        />
      </div>

      {/* Type Info */}
      {currentType && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20"
        >
          <span className="text-xs text-slate-400">توضیح: </span>
          <span className="text-xs text-teal-400">{currentType.description}</span>
        </motion.div>
      )}

      {/* Foam Rolling Specific */}
      {config.correctiveType === 'foam_rolling' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20"
        >
          <NumberInput
            label="تعداد پاس"
            value={config.passes}
            onChange={(v) => handleChange('passes', v)}
            min={5}
            max={30}
            icon={<RotateCcw size={12} />}
          />
          <SelectInput
            label="میزان فشار"
            value={config.pressure || ''}
            onChange={(v) => handleChange('pressure', v as CorrectiveConfig['pressure'])}
            options={[{ value: '', label: '—' }, ...pressureOptions]}
          />
        </motion.div>
      )}

      {/* Stretch/Activation Specific */}
      {config.correctiveType !== 'foam_rolling' && (
        <div className="grid grid-cols-3 gap-3">
          <NumberInput
            label="تعداد ست"
            value={config.sets}
            onChange={(v) => handleChange('sets', v)}
            min={1}
            max={5}
          />
          <NumberInput
            label="تکرار"
            value={config.reps}
            onChange={(v) => handleChange('reps', v)}
            min={1}
            max={30}
          />
          <NumberInput
            label="نگه‌داری"
            value={config.holdSeconds}
            onChange={(v) => handleChange('holdSeconds', v)}
            min={5}
            max={120}
            unit="ثانیه"
            icon={<Timer size={12} />}
          />
        </div>
      )}

      {/* Side Selection */}
      <SelectInput
        label="سمت اجرا"
        value={config.stretchSide || 'both'}
        onChange={(v) => handleChange('stretchSide', v as CorrectiveConfig['stretchSide'])}
        options={sideOptions}
      />

      {/* Coaching Cues */}
      <TextInput
        label="نکات مربیگری (Cues)"
        value={config.notes || ''}
        onChange={(v) => handleChange('notes', v)}
        placeholder="تنفس آرام، حفظ وضعیت..."
        icon={<Info size={12} />}
      />
    </div>
  );
});

CorrectiveConfigPanel.displayName = 'CorrectiveConfigPanel';

// ========== Main ExerciseConfigCard Component ==========

interface ExerciseConfigCardProps {
  instance: WorkoutExerciseInstance;
  isSelected?: boolean;
}

const ExerciseConfigCard: React.FC<ExerciseConfigCardProps> = ({ instance, isSelected }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: instance.instanceId });

  const {
    removeExercise,
    duplicateExercise,
    moveExercise,
    selectExercise,
  } = useWorkoutStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const getTypeConfig = () => {
    switch (instance.exerciseType) {
      case 'cardio':
        return { 
          icon: <Heart size={16} />, 
          color: 'from-red-500 to-pink-500', 
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          label: 'کاردیو',
          textColor: 'text-red-400'
        };
      case 'plyometric':
        return { 
          icon: <Zap size={16} />, 
          color: 'from-yellow-500 to-orange-500', 
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          label: 'پلایومتریک',
          textColor: 'text-yellow-400'
        };
      case 'corrective':
        return { 
          icon: <Target size={16} />, 
          color: 'from-teal-500 to-cyan-500', 
          bgColor: 'bg-teal-500/10',
          borderColor: 'border-teal-500/30',
          label: 'اصلاحی',
          textColor: 'text-teal-400'
        };
      default:
        return { 
          icon: <Dumbbell size={16} />, 
          color: 'from-blue-500 to-indigo-500', 
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          label: 'مقاومتی',
          textColor: 'text-blue-400'
        };
    }
  };

  const typeConfig = getTypeConfig();

  const renderConfigPanel = () => {
    switch (instance.config.type) {
      case 'cardio':
        return <CardioConfigPanel instanceId={instance.instanceId} config={instance.config} />;
      case 'plyometric':
        return <PlyometricConfigPanel instanceId={instance.instanceId} config={instance.config} />;
      case 'corrective':
        return <CorrectiveConfigPanel instanceId={instance.instanceId} config={instance.config} />;
      case 'resistance':
      default:
        return <ResistanceConfigPanel instanceId={instance.instanceId} config={instance.config} />;
    }
  };

  // Get summary text based on config type
  const getSummaryText = () => {
    switch (instance.config.type) {
      case 'resistance': {
        const c = instance.config as ResistanceConfig;
        return `${c.sets} ست × ${c.reps} تکرار${c.weight ? ` @ ${c.weight}${c.weightUnit}` : ''}${c.rpe ? ` • RPE ${c.rpe}` : ''}`;
      }
      case 'cardio': {
        const c = instance.config as CardioConfig;
        return `${c.durationMinutes} دقیقه • Zone ${c.targetZone}`;
      }
      case 'plyometric': {
        const c = instance.config as PlyometricConfig;
        return `${c.sets} ست × ${c.contacts} برخورد`;
      }
      case 'corrective': {
        const c = instance.config as CorrectiveConfig;
        return c.holdSeconds ? `${c.holdSeconds} ثانیه نگه‌داری` : 'تمرین اصلاحی';
      }
      default:
        return '';
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      onClick={() => selectExercise(instance.instanceId)}
      className={`
        rounded-2xl border-2 transition-all duration-300 overflow-hidden
        ${isSelected 
          ? `${typeConfig.borderColor} ring-2 ring-offset-2 ring-offset-slate-900 ${typeConfig.borderColor.replace('border-', 'ring-')}` 
          : 'border-slate-700/50 hover:border-slate-600'
        }
        ${isDragging ? 'shadow-2xl shadow-blue-500/20 scale-105' : 'shadow-lg'}
        bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl
      `}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 p-4 ${typeConfig.bgColor} border-b ${typeConfig.borderColor}`}>
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <GripVertical size={18} className="text-slate-400" />
        </div>

        {/* Type Icon Badge */}
        <div className={`p-2 rounded-xl bg-gradient-to-br ${typeConfig.color} shadow-lg`}>
          <span className="text-white">{typeConfig.icon}</span>
        </div>

        {/* Exercise Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white truncate">
            {instance.exercise.name}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[11px] font-medium ${typeConfig.textColor}`}>
              {typeConfig.label}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400 truncate">
              {getSummaryText()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); moveExercise(instance.instanceId, 'up'); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            title="بالا بردن"
          >
            <ChevronUp size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); moveExercise(instance.instanceId, 'down'); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            title="پایین بردن"
          >
            <ChevronDown size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); duplicateExercise(instance.instanceId); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
            title="کپی"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); removeExercise(instance.instanceId); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="حذف"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            title={isExpanded ? 'بستن' : 'باز کردن'}
          >
            <ChevronRight size={16} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Config Panel (Expandable) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              {renderConfigPanel()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(ExerciseConfigCard);

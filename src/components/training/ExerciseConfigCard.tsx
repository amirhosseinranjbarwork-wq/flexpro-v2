/**
 * ExerciseConfigCard Component
 * Dynamic configuration card for exercises in the workout canvas
 * Shows different inputs based on exercise type
 */

import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
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
  Settings2
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
import type { RPE, RIR, HeartRateZone, CardioMethod, PlyometricIntensity, CorrectiveExerciseType, TrainingSystemType } from '../../types/training';

// ========== Input Components ==========

interface NumberInputProps {
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  icon?: React.ReactNode;
}

const NumberInput: React.FC<NumberInputProps> = memo(({ 
  label, value, onChange, min = 0, max = 999, step = 1, unit, icon 
}) => (
  <div className="space-y-1">
    <label className="text-[10px] text-slate-400 flex items-center gap-1">
      {icon}
      {label}
    </label>
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-2 py-1.5
                   text-sm text-slate-200 text-center focus:outline-none focus:ring-1 
                   focus:ring-blue-500/50 focus:border-blue-500/50"
      />
      {unit && <span className="text-[10px] text-slate-500">{unit}</span>}
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
  <div className="space-y-1">
    <label className="text-[10px] text-slate-400 flex items-center gap-1">
      {icon}
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-2 py-1.5
                 text-sm text-slate-200 focus:outline-none focus:ring-1 
                 focus:ring-blue-500/50 focus:border-blue-500/50"
    />
  </div>
));

TextInput.displayName = 'TextInput';

interface SelectInputProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: { value: string | number; label: string }[];
  icon?: React.ReactNode;
}

const SelectInput: React.FC<SelectInputProps> = memo(({ 
  label, value, onChange, options, icon 
}) => (
  <div className="space-y-1">
    <label className="text-[10px] text-slate-400 flex items-center gap-1">
      {icon}
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-2 py-1.5
                 text-sm text-slate-200 focus:outline-none focus:ring-1 
                 focus:ring-blue-500/50 focus:border-blue-500/50"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
));

SelectInput.displayName = 'SelectInput';

// ========== Type-Specific Config Panels ==========

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
    { value: 'straight_set', label: 'ست ساده' },
    { value: 'superset', label: 'سوپرست' },
    { value: 'drop_set', label: 'درآپ‌ست' },
    { value: 'rest_pause', label: 'رست-پاز' },
    { value: 'pyramid', label: 'هرمی' },
    { value: 'german_volume', label: '10×10' },
    { value: 'tempo', label: 'تمپو' },
    { value: 'cluster_set', label: 'کلاستر' },
  ];

  const rpeOptions = [6, 7, 8, 9, 10].map(v => ({ 
    value: v, 
    label: `${v} - ${RPE_DESCRIPTIONS[v as RPE]?.slice(0, 15)}...` 
  }));

  const rirOptions = [0, 1, 2, 3, 4, 5].map(v => ({ 
    value: v, 
    label: `${v} - ${RIR_DESCRIPTIONS[v as RIR]?.slice(0, 20)}` 
  }));

  return (
    <div className="space-y-3">
      {/* Training System */}
      <SelectInput
        label="سیستم تمرینی"
        value={config.trainingSystem}
        onChange={(v) => handleChange('trainingSystem', v as TrainingSystemType)}
        options={systemOptions}
        icon={<Settings2 size={10} />}
      />

      {/* Sets & Reps Row */}
      <div className="grid grid-cols-3 gap-2">
        <NumberInput
          label="ست"
          value={config.sets}
          onChange={(v) => handleChange('sets', v)}
          min={1}
          max={20}
        />
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400">تکرار</label>
          <input
            type="text"
            value={config.reps}
            onChange={(e) => handleChange('reps', e.target.value)}
            placeholder="8-12"
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-2 py-1.5
                       text-sm text-slate-200 text-center focus:outline-none focus:ring-1 
                       focus:ring-blue-500/50"
          />
        </div>
        <NumberInput
          label="وزن"
          value={config.weight}
          onChange={(v) => handleChange('weight', v)}
          step={0.5}
          unit={config.weightUnit}
        />
      </div>

      {/* RPE & RIR Row */}
      <div className="grid grid-cols-2 gap-2">
        <SelectInput
          label="RPE"
          value={config.rpe || ''}
          onChange={(v) => handleChange('rpe', parseInt(v as string) as RPE)}
          options={[{ value: '', label: '--' }, ...rpeOptions]}
          icon={<Flame size={10} />}
        />
        <SelectInput
          label="RIR"
          value={config.rir ?? ''}
          onChange={(v) => handleChange('rir', parseInt(v as string) as RIR)}
          options={[{ value: '', label: '--' }, ...rirOptions]}
        />
      </div>

      {/* Tempo & Rest Row */}
      <div className="grid grid-cols-2 gap-2">
        <TextInput
          label="تمپو"
          value={config.tempo || ''}
          onChange={(v) => handleChange('tempo', v)}
          placeholder="3-1-2-0"
          icon={<Timer size={10} />}
        />
        <NumberInput
          label="استراحت"
          value={config.restSeconds}
          onChange={(v) => handleChange('restSeconds', v)}
          min={10}
          max={600}
          unit="ث"
        />
      </div>

      {/* Notes */}
      <TextInput
        label="یادداشت"
        value={config.notes || ''}
        onChange={(v) => handleChange('notes', v)}
        placeholder="توضیحات..."
      />
    </div>
  );
});

ResistanceConfigPanel.displayName = 'ResistanceConfigPanel';

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
    label: info.name,
  }));

  const zoneOptions = HEART_RATE_ZONES.map(zone => ({
    value: zone.zone,
    label: `Zone ${zone.zone} - ${zone.name}`,
  }));

  return (
    <div className="space-y-3">
      {/* Method */}
      <SelectInput
        label="متد کاردیو"
        value={config.method}
        onChange={(v) => handleChange('method', v as CardioMethod)}
        options={methodOptions}
        icon={<Heart size={10} />}
      />

      {/* Duration & Zone */}
      <div className="grid grid-cols-2 gap-2">
        <NumberInput
          label="مدت زمان"
          value={config.durationMinutes}
          onChange={(v) => handleChange('durationMinutes', v)}
          min={1}
          max={180}
          unit="دقیقه"
          icon={<Timer size={10} />}
        />
        <SelectInput
          label="ناحیه ضربان قلب"
          value={config.targetZone}
          onChange={(v) => handleChange('targetZone', parseInt(v as string) as HeartRateZone)}
          options={zoneOptions}
          icon={<Heart size={10} />}
        />
      </div>

      {/* HIIT Settings (conditional) */}
      {['hiit', 'tabata', 'intervals'].includes(config.method) && (
        <div className="grid grid-cols-3 gap-2">
          <NumberInput
            label="کار (ث)"
            value={config.workSeconds}
            onChange={(v) => handleChange('workSeconds', v)}
            min={5}
            max={300}
          />
          <NumberInput
            label="استراحت (ث)"
            value={config.restSeconds}
            onChange={(v) => handleChange('restSeconds', v)}
            min={5}
            max={300}
          />
          <NumberInput
            label="راند"
            value={config.intervals}
            onChange={(v) => handleChange('intervals', v)}
            min={1}
            max={50}
          />
        </div>
      )}

      {/* Speed & Incline (for steady state) */}
      {['liss', 'miss', 'tempo_run'].includes(config.method) && (
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            label="سرعت"
            value={config.targetSpeed}
            onChange={(v) => handleChange('targetSpeed', v)}
            step={0.5}
            unit="km/h"
          />
          <NumberInput
            label="شیب"
            value={config.targetIncline}
            onChange={(v) => handleChange('targetIncline', v)}
            step={0.5}
            unit="%"
          />
        </div>
      )}

      {/* Notes */}
      <TextInput
        label="یادداشت"
        value={config.notes || ''}
        onChange={(v) => handleChange('notes', v)}
        placeholder="توضیحات..."
      />
    </div>
  );
});

CardioConfigPanel.displayName = 'CardioConfigPanel';

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
    label: info.name,
  }));

  const landingOptions = [
    { value: 'step_down', label: 'پایین رفتن' },
    { value: 'jump_down', label: 'پرش پایین' },
    { value: 'rebound', label: 'ری‌باند' },
  ];

  return (
    <div className="space-y-3">
      {/* Intensity */}
      <SelectInput
        label="شدت"
        value={config.intensity}
        onChange={(v) => handleChange('intensity', v as PlyometricIntensity)}
        options={intensityOptions}
        icon={<Zap size={10} />}
      />

      {/* Sets & Contacts */}
      <div className="grid grid-cols-3 gap-2">
        <NumberInput
          label="ست"
          value={config.sets}
          onChange={(v) => handleChange('sets', v)}
          min={1}
          max={10}
        />
        <NumberInput
          label="برخورد"
          value={config.contacts}
          onChange={(v) => handleChange('contacts', v)}
          min={1}
          max={50}
        />
        <NumberInput
          label="استراحت"
          value={config.restSeconds}
          onChange={(v) => handleChange('restSeconds', v)}
          min={30}
          max={300}
          unit="ث"
        />
      </div>

      {/* Box Height & Landing */}
      <div className="grid grid-cols-2 gap-2">
        <NumberInput
          label="ارتفاع باکس"
          value={config.boxHeightCm}
          onChange={(v) => handleChange('boxHeightCm', v)}
          min={10}
          max={150}
          unit="cm"
        />
        <SelectInput
          label="نوع فرود"
          value={config.landingType || ''}
          onChange={(v) => handleChange('landingType', v as PlyometricConfig['landingType'])}
          options={[{ value: '', label: '--' }, ...landingOptions]}
        />
      </div>

      {/* Single Leg Toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={config.isSingleLeg || false}
          onChange={(e) => handleChange('isSingleLeg', e.target.checked)}
          className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 
                     focus:ring-blue-500/50 focus:ring-offset-slate-900"
        />
        <span className="text-xs text-slate-300">تک پا 🦵</span>
      </label>

      {/* Notes */}
      <TextInput
        label="یادداشت"
        value={config.notes || ''}
        onChange={(v) => handleChange('notes', v)}
        placeholder="توضیحات..."
      />
    </div>
  );
});

PlyometricConfigPanel.displayName = 'PlyometricConfigPanel';

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
    label: info.name,
  }));

  const phaseOptions = [
    { value: 'inhibit', label: '🔴 مهار' },
    { value: 'lengthen', label: '📏 کشش' },
    { value: 'activate', label: '⚡ فعال‌سازی' },
    { value: 'integrate', label: '🔗 یکپارچه' },
  ];

  const sideOptions = [
    { value: 'both', label: 'هر دو' },
    { value: 'left', label: 'چپ' },
    { value: 'right', label: 'راست' },
  ];

  const pressureOptions = [
    { value: 'light', label: 'سبک' },
    { value: 'moderate', label: 'متوسط' },
    { value: 'deep', label: 'عمیق' },
  ];

  return (
    <div className="space-y-3">
      {/* Type & Phase */}
      <div className="grid grid-cols-2 gap-2">
        <SelectInput
          label="نوع"
          value={config.correctiveType}
          onChange={(v) => handleChange('correctiveType', v as CorrectiveExerciseType)}
          options={typeOptions}
          icon={<Target size={10} />}
        />
        <SelectInput
          label="فاز NASM"
          value={config.nasmPhase || ''}
          onChange={(v) => handleChange('nasmPhase', v as CorrectiveConfig['nasmPhase'])}
          options={[{ value: '', label: '--' }, ...phaseOptions]}
        />
      </div>

      {/* Sets/Reps or Duration based on type */}
      {config.correctiveType === 'foam_rolling' ? (
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            label="تعداد پاس"
            value={config.passes}
            onChange={(v) => handleChange('passes', v)}
            min={5}
            max={30}
          />
          <SelectInput
            label="فشار"
            value={config.pressure || ''}
            onChange={(v) => handleChange('pressure', v as CorrectiveConfig['pressure'])}
            options={[{ value: '', label: '--' }, ...pressureOptions]}
          />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <NumberInput
            label="ست"
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
            unit="ث"
          />
        </div>
      )}

      {/* Side */}
      <SelectInput
        label="سمت"
        value={config.stretchSide || 'both'}
        onChange={(v) => handleChange('stretchSide', v as CorrectiveConfig['stretchSide'])}
        options={sideOptions}
      />

      {/* Notes (Cues) */}
      <TextInput
        label="نکات مربیگری"
        value={config.notes || ''}
        onChange={(v) => handleChange('notes', v)}
        placeholder="نکات تکنیکی..."
      />
    </div>
  );
});

CorrectiveConfigPanel.displayName = 'CorrectiveConfigPanel';

// ========== Main Card Component ==========

interface ExerciseConfigCardProps {
  instance: WorkoutExerciseInstance;
  isSelected?: boolean;
}

const ExerciseConfigCard: React.FC<ExerciseConfigCardProps> = ({ instance, isSelected }) => {
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
  };

  const getTypeConfig = () => {
    switch (instance.exerciseType) {
      case 'cardio':
        return { icon: <Heart size={14} />, color: 'green', label: 'کاردیو' };
      case 'plyometric':
        return { icon: <Zap size={14} />, color: 'yellow', label: 'پلایومتریک' };
      case 'corrective':
        return { icon: <Target size={14} />, color: 'teal', label: 'اصلاحی' };
      default:
        return { icon: <Dumbbell size={14} />, color: 'blue', label: 'مقاومتی' };
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

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => selectExercise(instance.instanceId)}
      className={`
        bg-slate-800/50 rounded-xl border transition-all duration-200
        ${isSelected 
          ? 'border-blue-500/50 ring-2 ring-blue-500/20' 
          : 'border-slate-700/50 hover:border-slate-600'
        }
        ${isDragging ? 'shadow-lg shadow-blue-500/20' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-slate-700/30">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-400"
        >
          <GripVertical size={16} />
        </div>

        {/* Type Icon */}
        <div className={`p-1.5 rounded-lg bg-${typeConfig.color}-500/20 text-${typeConfig.color}-400`}
             style={{ 
               backgroundColor: `var(--${typeConfig.color}-500-20, rgba(59, 130, 246, 0.2))`,
               color: typeConfig.color === 'blue' ? '#60a5fa' : 
                      typeConfig.color === 'green' ? '#4ade80' :
                      typeConfig.color === 'yellow' ? '#facc15' : '#2dd4bf'
             }}>
          {typeConfig.icon}
        </div>

        {/* Exercise Name */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-200 truncate">
            {instance.exercise.name}
          </h4>
          <span className="text-[10px] text-slate-500">
            {typeConfig.label}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); moveExercise(instance.instanceId, 'up'); }}
            className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-700/50"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); moveExercise(instance.instanceId, 'down'); }}
            className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-700/50"
          >
            <ChevronDown size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); duplicateExercise(instance.instanceId); }}
            className="p-1 rounded text-slate-500 hover:text-blue-400 hover:bg-blue-500/10"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); removeExercise(instance.instanceId); }}
            className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Config Panel */}
      <div className="p-3">
        {renderConfigPanel()}
      </div>
    </motion.div>
  );
};

export default memo(ExerciseConfigCard);

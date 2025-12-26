import React, { memo } from 'react';
import { GripVertical, Trash2, Heart, Zap, Target, Flame } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { WorkoutItem } from '../../types/index';
import type { 
  WorkoutSet, 
  ResistanceWorkoutSet, 
  CardioWorkoutSet, 
  PlyometricWorkoutSet,
  CorrectiveWorkoutSet,
} from '../../types/training';
import { 
  HEART_RATE_ZONES, 
  CARDIO_METHOD_INFO,
  PLYOMETRIC_INTENSITY_INFO,
  CORRECTIVE_TYPE_INFO,
} from '../../types/training';

interface ExerciseRowProps {
  item: WorkoutItem | WorkoutSet;
  idx: number;
  day: number;
  onDelete: (idx: number) => void;
  canEdit: boolean;
}

// Type guard to check if item is new WorkoutSet format
function isNewWorkoutSet(item: WorkoutItem | WorkoutSet): item is WorkoutSet {
  return 'type' in item && ['resistance', 'cardio', 'plyometric', 'corrective'].includes(item.type as string);
}

const ExerciseRow: React.FC<ExerciseRowProps> = memo(({ item, idx: _idx, day, onDelete, canEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `${day}-${_idx}` });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  // Render based on new or legacy format
  if (isNewWorkoutSet(item)) {
    return (
      <tr ref={setNodeRef} style={style} className="hover:bg-gradient-to-r hover:from-[var(--accent-color)]/8 hover:to-transparent group border-b border-[var(--glass-border)]/50 transition-all duration-500">
        {/* Drag Handle */}
        <td className="p-3 text-center">
          <button 
            {...attributes} 
            {...listeners} 
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-[var(--accent-color)]/10 rounded-lg transition-all duration-500 group-hover:scale-110"
            aria-label={`جابجایی ${item.exercise_name || 'حرکت'}`}
            type="button"
            disabled={!canEdit}
          >
            <GripVertical size={18} className="text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors" aria-hidden="true" />
          </button>
        </td>

        {/* Exercise Details */}
        <td className="p-4 align-top">
          <NewFormatExerciseDetails item={item} />
        </td>

        {/* Sets/Volume Column */}
        <td className="p-4 text-center">
          <NewFormatSetsDisplay item={item} />
        </td>

        {/* Reps/Duration Column */}
        <td className="p-4 text-center">
          <NewFormatRepsDisplay item={item} />
        </td>

        {/* Rest Column */}
        <td className="p-4 text-center">
          <NewFormatRestDisplay item={item} />
        </td>

        {/* Delete Button */}
        <td className="p-4 text-center">
          <button
            onClick={() => onDelete(_idx)}
            disabled={!canEdit}
            className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
              canEdit
                ? 'hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 text-[var(--text-secondary)] hover:border-red-500/30 border border-transparent'
                : 'opacity-50 cursor-not-allowed'
            }`}
            aria-label="حذف"
            type="button"
          >
            <Trash2 size={18} />
          </button>
        </td>
      </tr>
    );
  }

  // Legacy format rendering
  return <LegacyExerciseRow item={item} idx={_idx} day={day} onDelete={onDelete} canEdit={canEdit} />;
});

// New format exercise details
const NewFormatExerciseDetails: React.FC<{ item: WorkoutSet }> = ({ item }) => {
  const getTypeConfig = () => {
    switch (item.type) {
      case 'resistance':
        return { 
          icon: <Zap size={12} />, 
          label: '💪 مقاومتی', 
          color: 'bg-[var(--accent-color)]/20 text-[var(--accent-color)] border-[var(--accent-color)]/30' 
        };
      case 'cardio':
        return { 
          icon: <Heart size={12} />, 
          label: '🏃 کاردیو', 
          color: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30' 
        };
      case 'plyometric':
        return { 
          icon: <Flame size={12} />, 
          label: '⚡ پلایومتریک', 
          color: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30' 
        };
      case 'corrective':
        return { 
          icon: <Target size={12} />, 
          label: '🩹 اصلاحی', 
          color: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30' 
        };
      default:
        return { icon: null, label: 'نامشخص', color: 'bg-gray-500/20 text-gray-500' };
    }
  };

  const typeConfig = getTypeConfig();

  return (
    <div className="space-y-2">
      {/* Type Badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border flex items-center gap-1 ${typeConfig.color}`}>
          {typeConfig.icon}
          {typeConfig.label}
        </span>
        
        {/* Type-specific badges */}
        {item.type === 'resistance' && (item as ResistanceWorkoutSet).training_system !== 'straight_set' && (
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-500 border border-indigo-500/30">
            {(item as ResistanceWorkoutSet).training_system}
          </span>
        )}
        
        {item.type === 'cardio' && (
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
            {CARDIO_METHOD_INFO[(item as CardioWorkoutSet).cardio_method]?.name.split(' ')[0] || (item as CardioWorkoutSet).cardio_method}
          </span>
        )}
        
        {item.type === 'plyometric' && (
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-orange-500/20 text-orange-500 border border-orange-500/30">
            شدت: {PLYOMETRIC_INTENSITY_INFO[(item as PlyometricWorkoutSet).intensity]?.name}
          </span>
        )}
        
        {item.type === 'corrective' && (item as CorrectiveWorkoutSet).nasm_phase && (
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-teal-500/20 text-teal-500 border border-teal-500/30">
            {(item as CorrectiveWorkoutSet).nasm_phase === 'inhibit' ? 'مهار' :
             (item as CorrectiveWorkoutSet).nasm_phase === 'lengthen' ? 'کشش' :
             (item as CorrectiveWorkoutSet).nasm_phase === 'activate' ? 'فعال‌سازی' : 'یکپارچه'}
          </span>
        )}
      </div>

      {/* Exercise Name */}
      <div className="font-bold text-[var(--text-primary)] text-sm">{item.exercise_name}</div>
      
      {/* Secondary/Tertiary Exercises (for supersets) */}
      {item.type === 'resistance' && (item as ResistanceWorkoutSet).exercise_name_secondary && (
        <div className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold bg-yellow-500/10 px-2 py-0.5 rounded inline-block border border-yellow-500/20">
          + {(item as ResistanceWorkoutSet).exercise_name_secondary}
        </div>
      )}
      {item.type === 'resistance' && (item as ResistanceWorkoutSet).exercise_name_tertiary && (
        <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded inline-block border border-purple-500/20 mr-1">
          + {(item as ResistanceWorkoutSet).exercise_name_tertiary}
        </div>
      )}

      {/* Type-specific details */}
      {item.type === 'resistance' && (
        <ResistanceDetails item={item as ResistanceWorkoutSet} />
      )}
      
      {item.type === 'cardio' && (
        <CardioDetails item={item as CardioWorkoutSet} />
      )}
      
      {item.type === 'plyometric' && (
        <PlyometricDetails item={item as PlyometricWorkoutSet} />
      )}
      
      {item.type === 'corrective' && (
        <CorrectiveDetails item={item as CorrectiveWorkoutSet} />
      )}

      {/* Notes */}
      {item.notes && (
        <div className="text-[10px] text-[var(--text-secondary)] mt-1 bg-[var(--text-primary)]/5 p-1 rounded inline-block">
          📝 {item.notes}
        </div>
      )}
    </div>
  );
};

// Resistance exercise details
const ResistanceDetails: React.FC<{ item: ResistanceWorkoutSet }> = ({ item }) => (
  <div className="flex flex-wrap gap-1 mt-1">
    {item.rpe && (
      <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
        RPE {item.rpe}
      </span>
    )}
    {item.rir !== undefined && (
      <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
        RIR {item.rir}
      </span>
    )}
    {item.tempo && (
      <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20 font-mono">
        🎵 {item.tempo}
      </span>
    )}
    {item.weight && (
      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-500/10 text-gray-500 border border-gray-500/20">
        {item.weight}{item.weight_unit || 'kg'}
      </span>
    )}
    {item.drop_count && (
      <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-600">
        {item.drop_count} درآپ
      </span>
    )}
    {item.rest_pause_seconds && (
      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-600">
        رست-پاز: {item.rest_pause_seconds}ث
      </span>
    )}
  </div>
);

// Cardio exercise details
const CardioDetails: React.FC<{ item: CardioWorkoutSet }> = ({ item }) => {
  const zone = HEART_RATE_ZONES.find(z => z.zone === item.target_heart_rate_zone);
  
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {zone && (
        <span className={`text-[10px] px-2 py-0.5 rounded border ${
          zone.zone === 1 ? 'bg-green-500/10 text-green-500 border-green-500/20' :
          zone.zone === 2 ? 'bg-lime-500/10 text-lime-500 border-lime-500/20' :
          zone.zone === 3 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
          zone.zone === 4 ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
          'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          ❤️ Zone {zone.zone} ({zone.percentage})
        </span>
      )}
      {item.target_hr_min && item.target_hr_max && (
        <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/10 text-pink-500 border border-pink-500/20">
          {item.target_hr_min}-{item.target_hr_max} bpm
        </span>
      )}
      {item.intervals && (
        <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
          {item.intervals} راند
        </span>
      )}
      {item.target_speed && (
        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
          {item.target_speed} km/h
        </span>
      )}
    </div>
  );
};

// Plyometric exercise details
const PlyometricDetails: React.FC<{ item: PlyometricWorkoutSet }> = ({ item }) => (
  <div className="flex flex-wrap gap-1 mt-1">
    {item.box_height_cm && (
      <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
        📦 {item.box_height_cm}cm
      </span>
    )}
    {item.landing_type && (
      <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
        فرود: {item.landing_type === 'step_down' ? 'پله' : item.landing_type === 'jump_down' ? 'پرش' : 'ری‌باند'}
      </span>
    )}
    {item.is_single_leg && (
      <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
        تک پا 🦵
      </span>
    )}
  </div>
);

// Corrective exercise details
const CorrectiveDetails: React.FC<{ item: CorrectiveWorkoutSet }> = ({ item }) => {
  const typeInfo = CORRECTIVE_TYPE_INFO[item.corrective_type];
  
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {typeInfo && (
        <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-500 border border-teal-500/20">
          {typeInfo.name}
        </span>
      )}
      {item.hold_seconds && (
        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
          نگه: {item.hold_seconds}ث
        </span>
      )}
      {item.stretch_side && item.stretch_side !== 'both' && (
        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 border border-purple-500/20">
          {item.stretch_side === 'left' ? 'چپ' : 'راست'}
        </span>
      )}
      {item.pressure && (
        <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
          فشار: {item.pressure === 'light' ? 'سبک' : item.pressure === 'moderate' ? 'متوسط' : 'عمیق'}
        </span>
      )}
      {item.movement_dysfunction && (
        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
          هدف: {item.movement_dysfunction}
        </span>
      )}
    </div>
  );
};

// Sets display for new format
const NewFormatSetsDisplay: React.FC<{ item: WorkoutSet }> = ({ item }) => {
  if (item.type === 'resistance') {
    return (
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 font-bold text-[var(--accent-color)]">
        {(item as ResistanceWorkoutSet).sets}
      </div>
    );
  }
  
  if (item.type === 'plyometric') {
    return (
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 font-bold text-yellow-500">
        {(item as PlyometricWorkoutSet).sets}
      </div>
    );
  }
  
  if (item.type === 'corrective') {
    const corrItem = item as CorrectiveWorkoutSet;
    if (corrItem.sets) {
      return (
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 font-bold text-teal-500">
          {corrItem.sets}
        </div>
      );
    }
  }
  
  return <span className="text-[var(--text-secondary)] opacity-50">-</span>;
};

// Reps display for new format
const NewFormatRepsDisplay: React.FC<{ item: WorkoutSet }> = ({ item }) => {
  if (item.type === 'resistance') {
    return (
      <div className="inline-flex items-center justify-center min-w-[60px] h-10 rounded-lg bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/20 font-bold text-[var(--accent-secondary)]">
        {(item as ResistanceWorkoutSet).reps}
      </div>
    );
  }
  
  if (item.type === 'cardio') {
    return (
      <div className="inline-flex items-center justify-center min-w-[60px] h-10 rounded-lg bg-green-500/10 border border-green-500/20 font-bold text-green-500">
        {(item as CardioWorkoutSet).duration_minutes}′
      </div>
    );
  }
  
  if (item.type === 'plyometric') {
    return (
      <div className="inline-flex flex-col items-center justify-center min-w-[60px] h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <span className="font-bold text-yellow-500 text-sm">{(item as PlyometricWorkoutSet).contacts}</span>
        <span className="text-[8px] text-yellow-500/70">برخورد</span>
      </div>
    );
  }
  
  if (item.type === 'corrective') {
    const corrItem = item as CorrectiveWorkoutSet;
    if (corrItem.reps) {
      return (
        <div className="inline-flex items-center justify-center min-w-[60px] h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 font-bold text-teal-500">
          {corrItem.reps}
        </div>
      );
    }
    if (corrItem.hold_seconds) {
      return (
        <div className="inline-flex flex-col items-center justify-center min-w-[60px] h-10 rounded-lg bg-teal-500/10 border border-teal-500/20">
          <span className="font-bold text-teal-500 text-sm">{corrItem.hold_seconds}ث</span>
          <span className="text-[8px] text-teal-500/70">نگه</span>
        </div>
      );
    }
    if (corrItem.duration_seconds) {
      return (
        <div className="inline-flex items-center justify-center min-w-[60px] h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 font-bold text-teal-500">
          {Math.round(corrItem.duration_seconds / 60)}′
        </div>
      );
    }
  }
  
  return <span className="text-[var(--text-secondary)] opacity-50">-</span>;
};

// Rest display for new format
const NewFormatRestDisplay: React.FC<{ item: WorkoutSet }> = ({ item }) => {
  if (item.type === 'resistance') {
    const restSec = (item as ResistanceWorkoutSet).rest_seconds;
    if (restSec) {
      const display = restSec >= 60 ? `${Math.floor(restSec / 60)}:${(restSec % 60).toString().padStart(2, '0')}` : `${restSec}ث`;
      return (
        <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-[var(--text-primary)]/5 border border-[var(--glass-border)] text-xs text-[var(--text-secondary)] font-semibold">
          {display}
        </div>
      );
    }
  }
  
  if (item.type === 'plyometric') {
    const restSec = (item as PlyometricWorkoutSet).rest_seconds;
    if (restSec) {
      const display = restSec >= 60 ? `${Math.floor(restSec / 60)}:${(restSec % 60).toString().padStart(2, '0')}` : `${restSec}ث`;
      return (
        <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-xs text-yellow-600 font-semibold">
          {display}
        </div>
      );
    }
  }
  
  return <span className="text-[var(--text-secondary)] opacity-50">-</span>;
};

// Legacy format row component (for backward compatibility)
const LegacyExerciseRow: React.FC<ExerciseRowProps> = memo(({ item, idx: _idx, day, onDelete, canEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `${day}-${_idx}` });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const legacyItem = item as WorkoutItem;

  const getTypeLabel = (type?: string, mode?: string) => {
    if (mode === 'cardio' || type === 'cardio') return '🏃 هوازی';
    if (mode === 'corrective' || type === 'nasm-corrective' || type === 'corrective') return '🩹 اصلاحی';
    if (mode === 'warmup' || type === 'warmup') return '🔥 گرم';
    if (mode === 'cooldown' || type === 'cooldown') return '❄️ سرد';
    if (mode === 'plyometric') return '⚡ پلایومتریک';
    return '💪 مقاومتی';
  };

  const getTypeStyles = (type?: string, mode?: string) => {
    if (mode === 'cardio' || type === 'cardio') return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30';
    if (mode === 'corrective' || type === 'nasm-corrective' || type === 'corrective') return 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30';
    if (mode === 'warmup' || type === 'warmup') return 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30';
    if (mode === 'cooldown' || type === 'cooldown') return 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30';
    if (mode === 'plyometric') return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30';
    return 'bg-[var(--accent-color)]/20 text-[var(--accent-color)] border-[var(--accent-color)]/30';
  };

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-gradient-to-r hover:from-[var(--accent-color)]/8 hover:to-transparent group border-b border-[var(--glass-border)]/50 transition-all duration-500">
      {/* Drag Handle */}
      <td className="p-3 text-center">
        <button 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-[var(--accent-color)]/10 rounded-lg transition-all duration-500 group-hover:scale-110"
          aria-label={`جابجایی ${legacyItem.name || 'حرکت'}`}
          type="button"
          disabled={!canEdit}
        >
          <GripVertical size={18} className="text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors" aria-hidden="true" />
        </button>
      </td>

      {/* Exercise Details */}
      <td className="p-4 align-top">
        {/* Type Badge */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border ${getTypeStyles(legacyItem.type, legacyItem.mode)}`}>
            {getTypeLabel(legacyItem.type, legacyItem.mode)}
          </span>
        </div>

        {/* Exercise Names */}
        <div className="font-bold text-[var(--text-primary)] text-sm mt-1.5 mb-1">{legacyItem.name}</div>
        {legacyItem.name2 && (
          <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-semibold bg-yellow-500/10 px-2 py-0.5 rounded inline-block border border-yellow-500/20">
            + {legacyItem.name2}
          </div>
        )}
        {legacyItem.name3 && (
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-semibold bg-purple-500/10 px-2 py-0.5 rounded inline-block border border-purple-500/20 mr-1">
            + {legacyItem.name3}
          </div>
        )}
        {legacyItem.name4 && (
          <div className="text-xs text-red-600 dark:text-red-400 mt-1 font-semibold bg-red-500/10 px-2 py-0.5 rounded inline-block border border-red-500/20 mr-1">
            + {legacyItem.name4}
          </div>
        )}

        {/* Scientific parameters */}
        <div className="flex flex-wrap gap-1 mt-1">
          {legacyItem.rpe && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
              RPE {legacyItem.rpe}
            </span>
          )}
          {legacyItem.rir !== undefined && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
              RIR {legacyItem.rir}
            </span>
          )}
          {legacyItem.tempo && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20 font-mono">
              🎵 {legacyItem.tempo}
            </span>
          )}
          {legacyItem.heartRateZone && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/10 text-pink-500 border border-pink-500/20">
              Zone {legacyItem.heartRateZone}
            </span>
          )}
        </div>

        {/* Special Type Info */}
        {legacyItem.type === 'dropset' && legacyItem.dropCount && (
          <div className="text-[10px] text-yellow-600 dark:text-yellow-400 mt-1 bg-yellow-500/10 px-2 py-0.5 rounded inline-block">
            {legacyItem.dropCount} درآپ
          </div>
        )}
        {legacyItem.type === 'restpause' && legacyItem.restPauseTime && (
          <div className="text-[10px] text-purple-600 dark:text-purple-400 mt-1 bg-purple-500/10 px-2 py-0.5 rounded inline-block">
            رست-پاز: {legacyItem.restPauseTime}ث
          </div>
        )}
        {legacyItem.type === 'isometric' && legacyItem.holdTime && (
          <div className="text-[10px] text-green-600 dark:text-green-400 mt-1 bg-green-500/10 px-2 py-0.5 rounded inline-block">
            نگه: {legacyItem.holdTime}ث
          </div>
        )}
        {legacyItem.note && <div className="text-[10px] text-[var(--text-secondary)] mt-1 bg-[var(--text-primary)]/5 p-1 rounded inline-block">{legacyItem.note}</div>}
      </td>

      {/* Sets */}
      <td className="p-4 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 font-bold text-[var(--accent-color)]">
          {legacyItem.sets || '-'}
        </div>
      </td>

      {/* Reps/Duration */}
      <td className="p-4 text-center">
        <div className="inline-flex items-center justify-center min-w-[60px] h-10 rounded-lg bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/20 font-bold text-[var(--accent-secondary)]">
          {legacyItem.mode === 'cardio' ? `${legacyItem.duration} min` : legacyItem.reps || '-'}
        </div>
      </td>

      {/* Rest */}
      <td className="p-4 text-center">
        {legacyItem.rest ? (
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-[var(--text-primary)]/5 border border-[var(--glass-border)] text-xs text-[var(--text-secondary)] font-semibold">
            {legacyItem.rest} {legacyItem.restUnit === 'm' ? 'دقیقه' : 'ثانیه'}
          </div>
        ) : (
          <span className="text-[var(--text-secondary)] opacity-50">-</span>
        )}
      </td>

      {/* Delete Button */}
      <td className="p-4 text-center">
        <button
          onClick={() => onDelete(_idx)}
          disabled={!canEdit}
          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
            canEdit
              ? 'hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 text-[var(--text-secondary)] hover:border-red-500/30 border border-transparent'
              : 'opacity-50 cursor-not-allowed'
          }`}
          aria-label="حذف"
          type="button"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
});

ExerciseRow.displayName = 'ExerciseRow';
LegacyExerciseRow.displayName = 'LegacyExerciseRow';

export default ExerciseRow;

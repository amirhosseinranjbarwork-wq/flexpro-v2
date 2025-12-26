import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical, Trash2 } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';
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

interface MobileExerciseCardProps {
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

export const MobileExerciseCard: React.FC<MobileExerciseCardProps> = ({
  item,
  idx,
  day,
  onDelete,
  canEdit,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${day}-${idx}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Type configuration
  const getTypeConfig = (item: WorkoutItem | WorkoutSet) => {
    if (isNewWorkoutSet(item)) {
      switch (item.type) {
        case 'resistance':
          return { 
            icon: '💪', 
            label: 'مقاومتی', 
            color: 'var(--accent-color)',
            bgColor: 'rgba(14, 165, 233, 0.15)',
          };
        case 'cardio':
          return { 
            icon: '🏃', 
            label: 'کاردیو', 
            color: '#22c55e',
            bgColor: 'rgba(34, 197, 94, 0.15)',
          };
        case 'plyometric':
          return { 
            icon: '⚡', 
            label: 'پلایومتریک', 
            color: '#eab308',
            bgColor: 'rgba(234, 179, 8, 0.15)',
          };
        case 'corrective':
          return { 
            icon: '🩹', 
            label: 'اصلاحی', 
            color: '#14b8a6',
            bgColor: 'rgba(20, 184, 166, 0.15)',
          };
      }
    }
    
    // Legacy format
    const legacyItem = item as WorkoutItem;
    const mode = legacyItem.mode || legacyItem.type;
    
    if (mode === 'cardio') return { icon: '🏃', label: 'کاردیو', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' };
    if (mode === 'corrective' || mode === 'nasm-corrective') return { icon: '🩹', label: 'اصلاحی', color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.15)' };
    if (mode === 'warmup') return { icon: '🔥', label: 'گرم کردن', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)' };
    if (mode === 'cooldown') return { icon: '❄️', label: 'سرد کردن', color: '#06b6d4', bgColor: 'rgba(6, 182, 212, 0.15)' };
    if (mode === 'plyometric') return { icon: '⚡', label: 'پلایومتریک', color: '#eab308', bgColor: 'rgba(234, 179, 8, 0.15)' };
    
    return { icon: '💪', label: 'مقاومتی', color: 'var(--accent-color)', bgColor: 'rgba(14, 165, 233, 0.15)' };
  };

  const typeConfig = getTypeConfig(item);
  const exerciseName = isNewWorkoutSet(item) ? item.exercise_name : (item as WorkoutItem).name;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-4"
    >
      <SpotlightCard
        className="p-4"
        spotlightColor={typeConfig.bgColor}
        interactive={false}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Drag Handle */}
          {canEdit && (
            <div
              {...attributes}
              {...listeners}
              className="flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors"
            >
              <GripVertical size={18} />
            </div>
          )}

          {/* Exercise Info */}
          <div className="flex-1 min-w-0">
            {/* Type Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span 
                className="text-[10px] px-2 py-1 rounded-lg font-bold"
                style={{ 
                  backgroundColor: typeConfig.bgColor, 
                  color: typeConfig.color,
                  border: `1px solid ${typeConfig.color}33`
                }}
              >
                {typeConfig.icon} {typeConfig.label}
              </span>
              
              {/* Sub-type badges */}
              {isNewWorkoutSet(item) && item.type === 'resistance' && (item as ResistanceWorkoutSet).training_system !== 'straight_set' && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-500 border border-indigo-500/30">
                  {(item as ResistanceWorkoutSet).training_system}
                </span>
              )}
              
              {isNewWorkoutSet(item) && item.type === 'cardio' && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                  {CARDIO_METHOD_INFO[(item as CardioWorkoutSet).cardio_method]?.name.split('-')[0].trim() || (item as CardioWorkoutSet).cardio_method}
                </span>
              )}
            </div>

            {/* Exercise Name */}
            <h3 className="font-bold text-sm text-[var(--text-primary)] mb-2 truncate">
              {exerciseName || 'حرکت نامشخص'}
            </h3>

            {/* Render based on type */}
            {isNewWorkoutSet(item) ? (
              <NewFormatBadges item={item} />
            ) : (
              <LegacyFormatBadges item={item as WorkoutItem} />
            )}

            {/* Notes */}
            {((isNewWorkoutSet(item) && item.notes) || (!isNewWorkoutSet(item) && (item as WorkoutItem).note)) && (
              <p className="mt-2 text-xs text-[var(--text-secondary)] line-clamp-2">
                📝 {isNewWorkoutSet(item) ? item.notes : (item as WorkoutItem).note}
              </p>
            )}
          </div>

          {/* Delete Button */}
          {canEdit && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(idx)}
              className="flex-shrink-0 p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
              type="button"
            >
              <Trash2 size={16} />
            </motion.button>
          )}
        </div>
      </SpotlightCard>
    </motion.div>
  );
};

// New format badges
const NewFormatBadges: React.FC<{ item: WorkoutSet }> = ({ item }) => {
  if (item.type === 'resistance') {
    const resistanceItem = item as ResistanceWorkoutSet;
    return (
      <div className="flex flex-wrap gap-2">
        <Badge color="blue" icon="📊">
          {resistanceItem.sets} ست
        </Badge>
        <Badge color="green" icon="🔄">
          {resistanceItem.reps} تکرار
        </Badge>
        {resistanceItem.rest_seconds && (
          <Badge color="purple" icon="⏱️">
            {resistanceItem.rest_seconds}ث استراحت
          </Badge>
        )}
        {resistanceItem.rpe && (
          <Badge color="red" icon="💯">
            RPE {resistanceItem.rpe}
          </Badge>
        )}
        {resistanceItem.tempo && (
          <Badge color="cyan" icon="🎵">
            {resistanceItem.tempo}
          </Badge>
        )}
        {resistanceItem.weight && (
          <Badge color="gray" icon="🏋️">
            {resistanceItem.weight}{resistanceItem.weight_unit || 'kg'}
          </Badge>
        )}
      </div>
    );
  }

  if (item.type === 'cardio') {
    const cardioItem = item as CardioWorkoutSet;
    const zone = HEART_RATE_ZONES.find(z => z.zone === cardioItem.target_heart_rate_zone);
    
    return (
      <div className="flex flex-wrap gap-2">
        <Badge color="green" icon="⏱️">
          {cardioItem.duration_minutes} دقیقه
        </Badge>
        {zone && (
          <Badge 
            color={zone.zone <= 2 ? 'green' : zone.zone <= 3 ? 'yellow' : 'red'} 
            icon="❤️"
          >
            Zone {zone.zone}
          </Badge>
        )}
        {cardioItem.intervals && (
          <Badge color="orange" icon="🔁">
            {cardioItem.intervals} راند
          </Badge>
        )}
        {cardioItem.target_speed && (
          <Badge color="blue" icon="🚀">
            {cardioItem.target_speed} km/h
          </Badge>
        )}
      </div>
    );
  }

  if (item.type === 'plyometric') {
    const plyoItem = item as PlyometricWorkoutSet;
    const intensityInfo = PLYOMETRIC_INTENSITY_INFO[plyoItem.intensity];
    
    return (
      <div className="flex flex-wrap gap-2">
        <Badge color="yellow" icon="📊">
          {plyoItem.sets} ست
        </Badge>
        <Badge color="orange" icon="👣">
          {plyoItem.contacts} برخورد
        </Badge>
        {intensityInfo && (
          <Badge color="red" icon="🔥">
            شدت: {intensityInfo.name}
          </Badge>
        )}
        {plyoItem.box_height_cm && (
          <Badge color="blue" icon="📦">
            {plyoItem.box_height_cm}cm
          </Badge>
        )}
        {plyoItem.rest_seconds && (
          <Badge color="purple" icon="⏱️">
            {plyoItem.rest_seconds}ث
          </Badge>
        )}
      </div>
    );
  }

  if (item.type === 'corrective') {
    const correctiveItem = item as CorrectiveWorkoutSet;
    const typeInfo = CORRECTIVE_TYPE_INFO[correctiveItem.corrective_type];
    
    return (
      <div className="flex flex-wrap gap-2">
        {typeInfo && (
          <Badge color="teal" icon="📋">
            {typeInfo.name}
          </Badge>
        )}
        {correctiveItem.sets && (
          <Badge color="blue" icon="📊">
            {correctiveItem.sets} ست
          </Badge>
        )}
        {correctiveItem.hold_seconds && (
          <Badge color="purple" icon="⏱️">
            {correctiveItem.hold_seconds}ث نگه
          </Badge>
        )}
        {correctiveItem.reps && (
          <Badge color="green" icon="🔄">
            {correctiveItem.reps} تکرار
          </Badge>
        )}
        {correctiveItem.nasm_phase && (
          <Badge color="indigo" icon="🎯">
            {correctiveItem.nasm_phase === 'inhibit' ? 'مهار' :
             correctiveItem.nasm_phase === 'lengthen' ? 'کشش' :
             correctiveItem.nasm_phase === 'activate' ? 'فعال‌سازی' : 'یکپارچه'}
          </Badge>
        )}
      </div>
    );
  }

  return null;
};

// Legacy format badges
const LegacyFormatBadges: React.FC<{ item: WorkoutItem }> = ({ item }) => {
  const formatSets = (sets: string | number | undefined) => {
    if (!sets) return null;
    const num = typeof sets === 'string' ? parseInt(sets) : sets;
    return num ? `${num} ست` : null;
  };

  const formatReps = (reps: string | number | undefined) => {
    if (!reps) return null;
    return `${reps} تکرار`;
  };

  const formatRest = (rest: string | number | undefined, unit: string = 's') => {
    if (!rest) return null;
    const num = typeof rest === 'string' ? parseInt(rest) : rest;
    return num ? `${num}${unit === 'm' ? 'd' : 'ث'}` : null;
  };

  const sets = formatSets(item.sets);
  const reps = formatReps(item.reps);
  const rest = formatRest(item.rest, item.restUnit);

  return (
    <div className="flex flex-wrap gap-2">
      {sets && (
        <Badge color="blue" icon="📊">
          {sets}
        </Badge>
      )}
      {item.mode === 'cardio' && item.duration ? (
        <Badge color="green" icon="⏱️">
          {item.duration} دقیقه
        </Badge>
      ) : reps && (
        <Badge color="green" icon="🔄">
          {reps}
        </Badge>
      )}
      {rest && (
        <Badge color="purple" icon="⏱️">
          {rest} استراحت
        </Badge>
      )}
      {item.rpe && (
        <Badge color="red" icon="💯">
          RPE {item.rpe}
        </Badge>
      )}
      {item.tempo && (
        <Badge color="cyan" icon="🎵">
          {item.tempo}
        </Badge>
      )}
      {item.heartRateZone && (
        <Badge color="pink" icon="❤️">
          Zone {item.heartRateZone}
        </Badge>
      )}
    </div>
  );
};

// Badge component
interface BadgeProps {
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'orange' | 'teal' | 'cyan' | 'pink' | 'gray' | 'indigo';
  icon?: string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ color, icon, children }) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
    green: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
    purple: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
    red: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
    orange: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30',
    teal: 'bg-teal-500/20 text-teal-600 dark:text-teal-400 border-teal-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    pink: 'bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-500/30',
    gray: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30',
    indigo: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold border ${colorClasses[color]}`}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

export default MobileExerciseCard;

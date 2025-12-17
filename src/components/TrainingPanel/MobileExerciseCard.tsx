import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical, Trash2 } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';
import type { WorkoutItem } from '../../types/index';

interface MobileExerciseCardProps {
  item: WorkoutItem;
  idx: number;
  day: number;
  onDelete: (idx: number) => void;
  canEdit: boolean;
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

  const formatSets = (sets: string | number) => {
    const num = typeof sets === 'string' ? parseInt(sets) : sets;
    return num ? `${num} ست` : '-';
  };

  const formatReps = (reps: string | number) => {
    const num = typeof reps === 'string' ? parseInt(reps) : reps;
    return num ? `${num} تکرار` : '-';
  };

  const formatRest = (rest: string | number, unit: string = 's') => {
    const num = typeof rest === 'string' ? parseInt(rest) : rest;
    return num ? `${num}${unit === 'm' ? 'd' : unit}` : '-';
  };

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
        spotlightColor="rgba(59, 130, 246, 0.15)"
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
            {/* Exercise Name */}
            <h3 className="font-bold text-sm text-[var(--text-primary)] mb-3 truncate">
              {item.name || 'حرکت نامشخص'}
            </h3>

            {/* Badges for Sets, Reps, Rest */}
            <div className="flex flex-wrap gap-2">
              {item.sets && (
                <span className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-500/30">
                  {formatSets(item.sets)}
                </span>
              )}
              {item.reps && (
                <span className="inline-flex items-center px-2 py-1 rounded-lg bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-semibold border border-green-500/30">
                  {formatReps(item.reps)}
                </span>
              )}
              {item.rest && (
                <span className="inline-flex items-center px-2 py-1 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-semibold border border-purple-500/30">
                  {formatRest(item.rest, item.restUnit)}
                </span>
              )}
            </div>

            {/* Additional Info */}
            {item.note && (
              <p className="mt-2 text-xs text-[var(--text-secondary)] line-clamp-2">
                📝 {item.note}
              </p>
            )}

            {/* Exercise Type Badge */}
            {item.type && item.type !== 'normal' && (
              <p className="mt-2 text-xs text-[var(--accent-color)] font-semibold">
                {item.type === 'nasm-corrective' ? '🩹 اصلاحی' : `📋 ${item.type}`}
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

export default MobileExerciseCard;

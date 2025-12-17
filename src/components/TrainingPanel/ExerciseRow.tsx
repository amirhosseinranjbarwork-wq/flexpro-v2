import React, { memo } from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { WorkoutItem } from '../../types/index';

interface ExerciseRowProps {
  item: WorkoutItem;
  idx: number;
  day: number;
  onDelete: (idx: number) => void;
  canEdit: boolean;
}

const ExerciseRow: React.FC<ExerciseRowProps> = memo(({ item, idx: _idx, day, onDelete, canEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `${day}-${_idx}` });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const getTypeLabel = (type?: string) => {
    return type === 'cardio' ? '🏃 هوازی' : 
           type === 'corrective' ? '🩹 اصلاحی' : 
           type === 'warmup' ? '🔥 گرم' :
           type === 'cooldown' ? '❄️ سرد' :
           '💪 مقاومتی';
  };

  const getTypeStyles = (type?: string) => {
    return type === 'cardio' ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30' :
           type === 'corrective' ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30' :
           type === 'warmup' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30' :
           type === 'cooldown' ? 'bg-[var(--accent-color)]/20 text-[var(--accent-color)] border-[var(--accent-color)]/30' :
           'bg-[var(--accent-color)]/20 text-[var(--accent-color)] border-[var(--accent-color)]/30';
  };

  return (
    <tr ref={setNodeRef} style={style} className={`${item.type === 'superset' ? 'border-l-4 border-yellow-500' : ''} mb-3`}>
      <td colSpan={6} className="p-0">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 mx-2 hover:bg-white/10 transition-all duration-300 group">
          {/* Drag Handle */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-shrink-0 mt-1">
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-2 hover:bg-[var(--accent-color)]/10 rounded-lg transition-all duration-500 group-hover:scale-110"
                aria-label={`جابجایی ${item.name || 'حرکت'}`}
                type="button"
                disabled={!canEdit}
              >
                <GripVertical size={18} className="text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors" aria-hidden="true" />
              </button>
            </div>

            {/* Exercise Details */}
            <div className="flex-1 min-w-0">
        {/* Type Badge */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border ${getTypeStyles(item.type)}`}>
            {getTypeLabel(item.type)}
          </span>
        </div>

        {/* Exercise Names */}
        <div className="font-bold text-[var(--text-primary)] text-sm mt-1.5 mb-1">{item.name}</div>
        {item.name2 && (
          <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-semibold bg-yellow-500/10 px-2 py-0.5 rounded inline-block border border-yellow-500/20">
            + {item.name2}
          </div>
        )}
        {item.name3 && (
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-semibold bg-purple-500/10 px-2 py-0.5 rounded inline-block border border-purple-500/20 mr-1">
            + {item.name3}
          </div>
        )}
        {item.name4 && (
          <div className="text-xs text-red-600 dark:text-red-400 mt-1 font-semibold bg-red-500/10 px-2 py-0.5 rounded inline-block border border-red-500/20 mr-1">
            + {item.name4}
          </div>
        )}

        {/* Special Type Info */}
        {item.type === 'dropset' && item.dropCount && (
          <div className="text-[10px] text-yellow-600 dark:text-yellow-400 mt-1 bg-yellow-500/10 px-2 py-0.5 rounded inline-block">
            {item.dropCount} درآپ
          </div>
        )}
        {item.type === 'restpause' && item.restPauseTime && (
          <div className="text-[10px] text-purple-600 dark:text-purple-400 mt-1 bg-purple-500/10 px-2 py-0.5 rounded inline-block">
            رست-پاز: {item.restPauseTime}ث
          </div>
        )}
        {item.type === 'tempo' && item.tempo && (
          <div className="text-[10px] text-[var(--accent-color)] mt-1 bg-[var(--accent-color)]/10 px-2 py-0.5 rounded inline-block font-mono">
            تمپو: {item.tempo}
          </div>
        )}
        {item.type === 'isometric' && item.holdTime && (
          <div className="text-[10px] text-green-600 dark:text-green-400 mt-1 bg-green-500/10 px-2 py-0.5 rounded inline-block">
            نگه: {item.holdTime}ث
          </div>
        )}
            {item.note && <div className="text-[10px] text-[var(--text-secondary)] mt-1 bg-[var(--text-primary)]/5 p-1 rounded inline-block">{item.note}</div>}
            </div>

            {/* Sets, Reps, Rest, Delete - Right side */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {item.sets && (
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-bold text-sm">
                  {item.sets}
                </div>
              )}
              {item.reps && (
                <div className="inline-flex items-center justify-center min-w-[60px] h-10 rounded-lg bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30 font-bold text-sm">
                  {item.mode === 'cardio' ? `${item.duration} min` : item.reps}
                </div>
              )}
              {item.rest && (
                <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs font-semibold">
                  {item.rest}{item.restUnit === 'm' ? 'د' : 'ث'}
                </div>
              )}
              {canEdit && (
                <button
                  onClick={() => onDelete(_idx)}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
                  aria-label="حذف"
                  type="button"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
});

ExerciseRow.displayName = 'ExerciseRow';
export default ExerciseRow;

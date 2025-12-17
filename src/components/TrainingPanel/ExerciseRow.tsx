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
    <tr ref={setNodeRef} style={style} className="hover:bg-gradient-to-r hover:from-[var(--accent-color)]/8 hover:to-transparent group border-b border-[var(--glass-border)]/50 transition-all duration-500">
      {/* Drag Handle */}
      <td className="p-3 text-center">
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
      </td>

      {/* Exercise Details */}
      <td className="p-4 align-top">
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
      </td>

      {/* Sets */}
      <td className="p-4 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 font-bold text-[var(--accent-color)]">
          {item.sets || '-'}
        </div>
      </td>

      {/* Reps/Duration */}
      <td className="p-4 text-center">
        <div className="inline-flex items-center justify-center min-w-[60px] h-10 rounded-lg bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/20 font-bold text-[var(--accent-secondary)]">
          {item.mode === 'cardio' ? `${item.duration} min` : item.reps || '-'}
        </div>
      </td>

      {/* Rest */}
      <td className="p-4 text-center">
        {item.rest ? (
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-[var(--text-primary)]/5 border border-[var(--glass-border)] text-xs text-[var(--text-secondary)] font-semibold">
            {item.rest} {item.restUnit === 'm' ? 'دقیقه' : 'ثانیه'}
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
export default ExerciseRow;

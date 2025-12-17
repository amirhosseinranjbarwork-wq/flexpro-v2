import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { useExercises } from '../../hooks/useExercises';
import { useDebounce } from '../../hooks/useDebounce';
import type { ExercisesRow } from '../../types/database';

interface AddExerciseFormProps {
  onAdd: (exercise: Partial<ExercisesRow> & { sets: string; reps: string; rest: string; restUnit: string; note: string }) => void;
  canEdit: boolean;
}

export const AddExerciseForm: React.FC<AddExerciseFormProps> = ({ onAdd, canEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<ExercisesRow | null>(null);
  const [formData, setFormData] = useState({
    sets: '3',
    reps: '10',
    rest: '60',
    restUnit: 's',
    note: ''
  });

  const { data: exercisesData } = useExercises();
  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredExercises = useMemo(() => {
    if (!debouncedSearch || !exercisesData) return [];
    const lowerSearch = debouncedSearch.toLowerCase();
    return exercisesData.filter(ex =>
      ex.name.toLowerCase().includes(lowerSearch) ||
      ex.muscle_group.toLowerCase().includes(lowerSearch)
    ).slice(0, 10); // Limit results
  }, [exercisesData, debouncedSearch]);

  const handleExerciseSelect = useCallback((exercise: ExercisesRow) => {
    setSelectedExercise(exercise);
    setIsExpanded(true);
    setSearchTerm(exercise.name);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!selectedExercise) return;

    onAdd({
      ...selectedExercise,
      sets: formData.sets,
      reps: formData.reps,
      rest: formData.rest,
      restUnit: formData.restUnit,
      note: formData.note
    });

    // Reset form
    setSelectedExercise(null);
    setSearchTerm('');
    setIsExpanded(false);
    setFormData({
      sets: '3',
      reps: '10',
      rest: '60',
      restUnit: 's',
      note: ''
    });
  }, [selectedExercise, formData, onAdd]);

  const handleCancel = useCallback(() => {
    setSelectedExercise(null);
    setSearchTerm('');
    setIsExpanded(false);
    setFormData({
      sets: '3',
      reps: '10',
      rest: '60',
      restUnit: 's',
      note: ''
    });
  }, []);

  if (!canEdit) return null;

  return (
    <div className="glass-panel p-4 rounded-3xl border border-[var(--glass-border)] shadow-xl backdrop-blur-xl">
      <div className="space-y-4">
        {/* Compact Search Bar */}
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                className="input-glass pl-10 pr-4 py-3 text-sm w-full"
                placeholder="جستجوی حرکت..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsExpanded(true)}
              />
              <Search size={16} className="absolute left-3 top-3.5 text-slate-400" />
            </div>
            {isExpanded && (
              <button
                onClick={handleCancel}
                className="btn-glass bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 px-4 py-3 rounded-xl"
                type="button"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isExpanded && searchTerm && filteredExercises.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-xl shadow-xl max-h-64 overflow-y-auto z-50">
              {filteredExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => handleExerciseSelect(exercise)}
                  className="w-full text-right p-3 hover:bg-[var(--accent-color)]/10 transition-colors border-b border-[var(--glass-border)]/50 last:border-b-0"
                  type="button"
                >
                  <div className="font-semibold text-[var(--text-primary)]">{exercise.name}</div>
                  <div className="text-xs text-[var(--text-secondary)]">{exercise.muscle_group}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Expanded Form */}
        {isExpanded && selectedExercise && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-3 bg-[var(--accent-color)]/5 rounded-xl border border-[var(--accent-color)]/20">
              <div className="font-semibold text-[var(--text-primary)]">{selectedExercise.name}</div>
              <div className="text-sm text-[var(--text-secondary)]">{selectedExercise.muscle_group}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[var(--text-secondary)] font-semibold block mb-1">ست</label>
                <input
                  type="number"
                  className="input-glass text-center"
                  value={formData.sets}
                  onChange={(e) => setFormData(prev => ({ ...prev, sets: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)] font-semibold block mb-1">تکرار</label>
                <input
                  type="text"
                  className="input-glass text-center"
                  value={formData.reps}
                  onChange={(e) => setFormData(prev => ({ ...prev, reps: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-[var(--text-secondary)] font-semibold block mb-1">استراحت</label>
                <input
                  type="number"
                  className="input-glass text-center"
                  value={formData.rest}
                  onChange={(e) => setFormData(prev => ({ ...prev, rest: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)] font-semibold block mb-1">واحد</label>
                <select
                  className="input-glass text-center"
                  value={formData.restUnit}
                  onChange={(e) => setFormData(prev => ({ ...prev, restUnit: e.target.value }))}
                >
                  <option value="s">ثانیه</option>
                  <option value="m">دقیقه</option>
                </select>
              </div>
            </div>

            <input
              type="text"
              className="input-glass"
              placeholder="توضیحات فنی (اختیاری)"
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
            />

            <button
              onClick={handleSubmit}
              className="w-full btn-glass text-white py-3 font-bold text-sm transition-all duration-300 hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, var(--accent-color), var(--accent-secondary))` }}
              type="button"
            >
              <Plus size={18} className="inline ml-2" /> افزودن به برنامه
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddExerciseForm;
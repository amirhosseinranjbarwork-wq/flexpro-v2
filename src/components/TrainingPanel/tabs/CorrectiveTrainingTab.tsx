/**
 * CORRECTIVE TRAINING TAB - تمرین اصلاحی
 * پارامترهای کامل: sets, reps, duration, focus area
 */

import React, { useState, useMemo } from 'react';
import { useWorkoutStore } from '../../../store/workoutStore';
import { Exercise, ExerciseCategory, CorrectiveParameters } from '../../../types/ultimate-training';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import Badge from '../../ui/Badge';
import { Plus, Trash2, GripVertical, Shield, Clock, Target } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { translateExerciseName } from '../../../utils/exerciseTranslations';

interface CorrectiveTrainingTabProps {
  activeUser?: any;
  onUpdateUser?: (user: any) => void;
}

interface ExerciseWithParams {
  id: string;
  exercise: Exercise;
  parameters: CorrectiveParameters;
}

const CorrectiveTrainingTab: React.FC<CorrectiveTrainingTabProps> = ({
  activeUser,
  onUpdateUser
}) => {
  const { currentProgram, activeDayId, addExerciseToDay, getFilteredExercises } = useWorkoutStore();
  const [exercises, setExercises] = useState<ExerciseWithParams[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showParamsForm, setShowParamsForm] = useState(false);
  const [params, setParams] = useState<CorrectiveParameters>({
    sets: 3,
    reps: 10,
    focus: '',
    duration: 30
  });

  const correctiveExercises = useMemo(() => {
    return getFilteredExercises().filter(ex => ex.category === ExerciseCategory.CORRECTIVE);
  }, [getFilteredExercises]);

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setParams({
      sets: 3,
      reps: 10,
      focus: exercise.description || '',
      duration: 30
    });
    setShowParamsForm(true);
  };

  const handleSaveExercise = () => {
    if (!selectedExercise) return;

    const newExercise: ExerciseWithParams = {
      id: `ex_${Date.now()}`,
      exercise: selectedExercise,
      parameters: params
    };

    setExercises([...exercises, newExercise]);
    
    if (activeDayId) {
      addExerciseToDay(activeDayId, selectedExercise);
    }

    toast.success('حرکت اصلاحی اضافه شد');
    setShowParamsForm(false);
    setSelectedExercise(null);
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
    toast.success('حرکت حذف شد');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = exercises.findIndex(ex => ex.id === active.id);
    const newIndex = exercises.findIndex(ex => ex.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newExercises = [...exercises];
      const [removed] = newExercises.splice(oldIndex, 1);
      newExercises.splice(newIndex, 0, removed);
      setExercises(newExercises);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-600" />
            تمرین اصلاحی
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            تمرینات اصلاحی برای بهبود الگوهای حرکتی و پیشگیری از آسیب
          </p>
        </div>
        <Button
          onClick={() => setShowParamsForm(true)}
          className="bg-gradient-to-r from-green-600 to-teal-600"
        >
          <Plus className="w-4 h-4 ml-2" />
          افزودن حرکت اصلاحی
        </Button>
      </div>

      {/* Parameters Form Modal */}
      {showParamsForm && (
        <Card className="border-2 border-green-500 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>تنظیم پارامترهای تمرین اصلاحی</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowParamsForm(false);
                  setSelectedExercise(null);
                }}
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Exercise Selection */}
            {!selectedExercise && (
              <div>
                <Label>انتخاب حرکت اصلاحی</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
                  {correctiveExercises.map(ex => (
                    <Button
                      key={ex.id}
                      variant="outline"
                      onClick={() => handleAddExercise(ex)}
                      className="justify-start text-right"
                    >
                      {translateExerciseName(ex.name)}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Parameters */}
            {selectedExercise && (
              <>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-bold text-lg mb-2">{translateExerciseName(selectedExercise.name)}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedExercise.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Sets */}
                  <div>
                    <Label htmlFor="sets">ست‌ها</Label>
                    <Input
                      id="sets"
                      type="number"
                      value={params.sets}
                      onChange={(e) => setParams({ ...params, sets: parseInt(e.target.value) || 0 })}
                      min="1"
                      max="10"
                    />
                  </div>

                  {/* Reps */}
                  <div>
                    <Label htmlFor="reps">تکرار</Label>
                    <Input
                      id="reps"
                      type="number"
                      value={params.reps || ''}
                      onChange={(e) => setParams({ ...params, reps: parseInt(e.target.value) || undefined })}
                      placeholder="اختیاری"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <Label htmlFor="duration" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      مدت زمان نگه‌داری (ثانیه)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      value={params.duration || ''}
                      onChange={(e) => setParams({ ...params, duration: parseInt(e.target.value) || undefined })}
                      placeholder="30"
                    />
                  </div>

                  {/* Focus Area */}
                  <div>
                    <Label htmlFor="focus" className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      ناحیه تمرکز
                    </Label>
                    <Input
                      id="focus"
                      type="text"
                      value={params.focus}
                      onChange={(e) => setParams({ ...params, focus: e.target.value })}
                      placeholder="مثلاً: ثبات کتف"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">یادداشت</Label>
                  <textarea
                    id="notes"
                    value={params.notes || ''}
                    onChange={(e) => setParams({ ...params, notes: e.target.value })}
                    className="w-full mt-2 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                    rows={3}
                    placeholder="یادداشت‌های اضافی..."
                  />
                </div>

                <Button
                  onClick={handleSaveExercise}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  افزودن به برنامه
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Exercises List */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={exercises.map(ex => ex.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {exercises.length === 0 ? (
              <Card className="p-12 text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">هنوز حرکت اصلاحی اضافه نشده است</p>
                <Button
                  onClick={() => setShowParamsForm(true)}
                  className="mt-4 bg-gradient-to-r from-green-600 to-teal-600"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  افزودن اولین حرکت
                </Button>
              </Card>
            ) : (
              exercises.map((item) => (
                <SortableExerciseRow
                  key={item.id}
                  item={item}
                  onDelete={handleDeleteExercise}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

// Sortable Exercise Row Component
interface SortableExerciseRowProps {
  item: ExerciseWithParams;
  onDelete: (id: string) => void;
}

const SortableExerciseRow: React.FC<SortableExerciseRowProps> = ({ item, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <Card ref={setNodeRef} style={style} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            <GripVertical className="w-5 h-5 text-slate-400" />
          </button>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">{translateExerciseName(item.exercise.name)}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {item.exercise.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Parameters Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">ست‌ها</div>
                <div className="font-bold text-lg">{item.parameters.sets}</div>
              </div>
              {item.parameters.reps && (
                <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">تکرار</div>
                  <div className="font-bold text-lg">{item.parameters.reps}</div>
                </div>
              )}
              {item.parameters.duration && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">مدت زمان</div>
                  <div className="font-bold text-lg">{item.parameters.duration}s</div>
                </div>
              )}
              {item.parameters.focus && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">تمرکز</div>
                  <div className="font-bold text-sm">{item.parameters.focus}</div>
                </div>
              )}
            </div>

            {item.parameters.notes && (
              <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-800 rounded text-sm">
                <strong>یادداشت:</strong> {item.parameters.notes}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrectiveTrainingTab;




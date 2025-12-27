/**
 * RESISTANCE TRAINING TAB - تمرین مقاومتی
 * پارامترهای کامل: sets, reps, weight, RPE, RIR, tempo, rest, drop sets, rest pause
 */

import React, { useState, useMemo } from 'react';
import { useWorkoutStore } from '../../../store/workoutStore';
import { Exercise, ExerciseCategory, ResistanceParameters } from '../../../types/ultimate-training';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import Badge from '../../ui/Badge';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Settings,
  TrendingUp,
  Clock,
  Zap,
  Target,
  Dumbbell
} from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';

interface ResistanceTrainingTabProps {
  activeUser?: any;
  onUpdateUser?: (user: any) => void;
}

interface ExerciseWithParams {
  id: string;
  exercise: Exercise;
  parameters: ResistanceParameters;
}

const ResistanceTrainingTab: React.FC<ResistanceTrainingTabProps> = ({
  activeUser,
  onUpdateUser
}) => {
  const { currentProgram, activeDayId, addExerciseToDay, getFilteredExercises } = useWorkoutStore();
  const [exercises, setExercises] = useState<ExerciseWithParams[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showParamsForm, setShowParamsForm] = useState(false);
  const [params, setParams] = useState<ResistanceParameters>({
    sets: 3,
    reps: 10,
    rest: 90,
    rpe: 7,
    rir: 3,
    tempo: '2-0-1-0'
  });

  const resistanceExercises = useMemo(() => {
    return getFilteredExercises().filter(ex => ex.category === ExerciseCategory.RESISTANCE);
  }, [getFilteredExercises]);

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setParams(exercise.defaultParameters || {
      sets: 3,
      reps: 10,
      rest: 90,
      rpe: 7,
      rir: 3,
      tempo: '2-0-1-0'
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

    toast.success('حرکت اضافه شد');
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
            <Dumbbell className="w-6 h-6 text-blue-600" />
            تمرین مقاومتی
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            طراحی برنامه تمرین مقاومتی با پارامترهای حرفه‌ای
          </p>
        </div>
        <Button
          onClick={() => setShowParamsForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Plus className="w-4 h-4 ml-2" />
          افزودن حرکت
        </Button>
      </div>

      {/* Parameters Form Modal */}
      {showParamsForm && (
        <Card className="border-2 border-blue-500 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>تنظیم پارامترهای تمرین</span>
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
                <Label>انتخاب حرکت</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
                  {resistanceExercises.map(ex => (
                    <Button
                      key={ex.id}
                      variant="outline"
                      onClick={() => handleAddExercise(ex)}
                      className="justify-start text-right"
                    >
                      {ex.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Parameters */}
            {selectedExercise && (
              <>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-bold text-lg mb-2">{selectedExercise.name}</h3>
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
                      type="text"
                      value={params.reps}
                      onChange={(e) => setParams({ ...params, reps: e.target.value })}
                      placeholder="10 یا 8-12 یا AMRAP"
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <Label htmlFor="weight">وزن (کیلوگرم)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={params.weight || ''}
                      onChange={(e) => setParams({ ...params, weight: parseFloat(e.target.value) || undefined })}
                      placeholder="اختیاری"
                    />
                  </div>

                  {/* RPE */}
                  <div>
                    <Label htmlFor="rpe" className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      RPE (1-10)
                    </Label>
                    <Input
                      id="rpe"
                      type="number"
                      value={params.rpe || ''}
                      onChange={(e) => setParams({ ...params, rpe: parseInt(e.target.value) || undefined })}
                      min="1"
                      max="10"
                      placeholder="7"
                    />
                  </div>

                  {/* RIR */}
                  <div>
                    <Label htmlFor="rir" className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      RIR (0-5)
                    </Label>
                    <Input
                      id="rir"
                      type="number"
                      value={params.rir || ''}
                      onChange={(e) => setParams({ ...params, rir: parseInt(e.target.value) || undefined })}
                      min="0"
                      max="5"
                      placeholder="3"
                    />
                  </div>

                  {/* Tempo */}
                  <div>
                    <Label htmlFor="tempo" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      تمپو (eccentric-pause-concentric-pause)
                    </Label>
                    <Input
                      id="tempo"
                      type="text"
                      value={params.tempo || ''}
                      onChange={(e) => setParams({ ...params, tempo: e.target.value })}
                      placeholder="2-0-1-0"
                    />
                  </div>

                  {/* Rest */}
                  <div>
                    <Label htmlFor="rest" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      استراحت (ثانیه)
                    </Label>
                    <Input
                      id="rest"
                      type="number"
                      value={params.rest}
                      onChange={(e) => setParams({ ...params, rest: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>

                  {/* %1RM */}
                  <div>
                    <Label htmlFor="oneRepMaxPercent">درصد یک تکرار حداکثر</Label>
                    <Input
                      id="oneRepMaxPercent"
                      type="number"
                      value={params.oneRepMaxPercent || ''}
                      onChange={(e) => setParams({ ...params, oneRepMaxPercent: parseFloat(e.target.value) || undefined })}
                      min="0"
                      max="100"
                      placeholder="75"
                    />
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="dropSets">دراپ ست</Label>
                    <Input
                      id="dropSets"
                      type="number"
                      value={params.dropSets || ''}
                      onChange={(e) => setParams({ ...params, dropSets: parseInt(e.target.value) || undefined })}
                      min="0"
                      placeholder="تعداد دراپ‌ها"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={params.restPause || false}
                        onChange={(e) => setParams({ ...params, restPause: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span>Rest Pause</span>
                    </label>
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
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
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
                <Dumbbell className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">هنوز حرکتی اضافه نشده است</p>
                <Button
                  onClick={() => setShowParamsForm(true)}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600"
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
                  onUpdate={(id, newParams) => {
                    setExercises(exercises.map(ex => 
                      ex.id === id ? { ...ex, parameters: newParams } : ex
                    ));
                  }}
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
  onUpdate: (id: string, params: ResistanceParameters) => void;
}

const SortableExerciseRow: React.FC<SortableExerciseRowProps> = ({ item, onDelete, onUpdate }) => {
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
                <h3 className="font-bold text-lg">{item.exercise.name}</h3>
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
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">ست‌ها</div>
                <div className="font-bold text-lg">{item.parameters.sets}</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">تکرار</div>
                <div className="font-bold text-lg">{item.parameters.reps}</div>
              </div>
              {item.parameters.weight && (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">وزن</div>
                  <div className="font-bold text-lg">{item.parameters.weight} kg</div>
                </div>
              )}
              {item.parameters.rpe && (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">RPE</div>
                  <div className="font-bold text-lg">{item.parameters.rpe}/10</div>
                </div>
              )}
              {item.parameters.rir !== undefined && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">RIR</div>
                  <div className="font-bold text-lg">{item.parameters.rir}</div>
                </div>
              )}
              {item.parameters.tempo && (
                <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">تمپو</div>
                  <div className="font-bold text-lg">{item.parameters.tempo}</div>
                </div>
              )}
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">استراحت</div>
                <div className="font-bold text-lg">{item.parameters.rest}s</div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              {item.parameters.dropSets && (
                <Badge variant="default" className="bg-red-500">
                  دراپ ست: {item.parameters.dropSets}
                </Badge>
              )}
              {item.parameters.restPause && (
                <Badge variant="default" className="bg-purple-500">
                  Rest Pause
                </Badge>
              )}
              {item.parameters.oneRepMaxPercent && (
                <Badge variant="default" className="bg-blue-500">
                  {item.parameters.oneRepMaxPercent}% 1RM
                </Badge>
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

export default ResistanceTrainingTab;


/**
 * OLYMPIC TRAINING TAB - تمرین المپیک
 * پارامترهای کامل: sets, reps, weight, %1RM, tempo, rest
 */

import React, { useState, useMemo } from 'react';
import { useWorkoutStore } from '../../../store/workoutStore';
import { Exercise, ExerciseCategory, ResistanceParameters } from '../../../types/ultimate-training';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import Badge from '../../ui/Badge';
import { Plus, Trash2, GripVertical, Target, Clock } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { translateExerciseName } from '../../../utils/exerciseTranslations';

interface OlympicTrainingTabProps {
  activeUser?: any;
  onUpdateUser?: (user: any) => void;
}

interface ExerciseWithParams {
  id: string;
  exercise: Exercise;
  parameters: ResistanceParameters;
}

const OlympicTrainingTab: React.FC<OlympicTrainingTabProps> = ({
  activeUser,
  onUpdateUser
}) => {
  const { currentProgram, activeDayId, addExerciseToDay, getFilteredExercises } = useWorkoutStore();
  const [exercises, setExercises] = useState<ExerciseWithParams[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showParamsForm, setShowParamsForm] = useState(false);
  const [params, setParams] = useState<ResistanceParameters>({
    sets: 5,
    reps: 3,
    rest: 180,
    rpe: 8
  });

  const olympicExercises = useMemo(() => {
    return getFilteredExercises().filter(ex => ex.category === ExerciseCategory.OLYMPIC);
  }, [getFilteredExercises]);

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setParams({
      sets: 5,
      reps: 3,
      rest: 180,
      rpe: 8
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

    toast.success('حرکت المپیک اضافه شد');
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-amber-600" />
            تمرین المپیک
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            تمرینات المپیک: Snatch و Clean & Jerk
          </p>
        </div>
        <Button
          onClick={() => setShowParamsForm(true)}
          className="bg-gradient-to-r from-amber-600 to-yellow-600"
        >
          <Plus className="w-4 h-4 ml-2" />
          افزودن حرکت المپیک
        </Button>
      </div>

      {showParamsForm && (
        <Card className="border-2 border-amber-500 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>تنظیم پارامترهای المپیک</span>
              <Button variant="ghost" size="sm" onClick={() => { setShowParamsForm(false); setSelectedExercise(null); }}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedExercise && (
              <div>
                <Label>انتخاب حرکت المپیک</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
                  {olympicExercises.map(ex => (
                    <Button key={ex.id} variant="outline" onClick={() => handleAddExercise(ex)} className="justify-start text-right">
                      {translateExerciseName(ex.name)}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {selectedExercise && (
              <>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h3 className="font-bold text-lg mb-2">{translateExerciseName(selectedExercise.name)}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedExercise.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sets">ست‌ها</Label>
                    <Input id="sets" type="number" value={params.sets} onChange={(e) => setParams({ ...params, sets: parseInt(e.target.value) || 0 })} min="1" />
                  </div>
                  <div>
                    <Label htmlFor="reps">تکرار</Label>
                    <Input id="reps" type="number" value={params.reps} onChange={(e) => setParams({ ...params, reps: parseInt(e.target.value) || 0 })} min="1" />
                  </div>
                  <div>
                    <Label htmlFor="weight">وزن (کیلوگرم)</Label>
                    <Input id="weight" type="number" value={params.weight || ''} onChange={(e) => setParams({ ...params, weight: parseFloat(e.target.value) || undefined })} />
                  </div>
                  <div>
                    <Label htmlFor="rest">استراحت (ثانیه)</Label>
                    <Input id="rest" type="number" value={params.rest} onChange={(e) => setParams({ ...params, rest: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <Label htmlFor="rpe">RPE</Label>
                    <Input id="rpe" type="number" value={params.rpe || ''} onChange={(e) => setParams({ ...params, rpe: parseInt(e.target.value) || undefined })} min="1" max="10" />
                  </div>
                  <div>
                    <Label htmlFor="tempo">تمپو</Label>
                    <Input id="tempo" type="text" value={params.tempo || ''} onChange={(e) => setParams({ ...params, tempo: e.target.value })} placeholder="1-0-1-0" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">یادداشت</Label>
                  <textarea id="notes" value={params.notes || ''} onChange={(e) => setParams({ ...params, notes: e.target.value })} className="w-full mt-2 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800" rows={3} />
                </div>

                <Button onClick={handleSaveExercise} className="w-full bg-gradient-to-r from-amber-600 to-yellow-600">
                  <Plus className="w-4 h-4 ml-2" />
                  افزودن به برنامه
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={exercises.map(ex => ex.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {exercises.length === 0 ? (
              <Card className="p-12 text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">هنوز حرکت المپیک اضافه نشده است</p>
                <Button onClick={() => setShowParamsForm(true)} className="mt-4 bg-gradient-to-r from-amber-600 to-yellow-600">
                  <Plus className="w-4 h-4 ml-2" />
                  افزودن اولین حرکت
                </Button>
              </Card>
            ) : (
              exercises.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{translateExerciseName(item.exercise.name)}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">ست‌ها</div>
                            <div className="font-bold text-lg">{item.parameters.sets}</div>
                          </div>
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">تکرار</div>
                            <div className="font-bold text-lg">{item.parameters.reps}</div>
                          </div>
                          {item.parameters.weight && (
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                              <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">وزن</div>
                              <div className="font-bold text-lg">{item.parameters.weight} kg</div>
                            </div>
                          )}
                          {item.parameters.rpe && (
                            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                              <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">RPE</div>
                              <div className="font-bold text-lg">{item.parameters.rpe}/10</div>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteExercise(item.id)} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default OlympicTrainingTab;




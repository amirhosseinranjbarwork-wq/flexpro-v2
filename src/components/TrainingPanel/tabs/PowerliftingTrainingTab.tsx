/**
 * POWERLIFTING TRAINING TAB - تمرین قدرتی
 * پارامترهای کامل: sets, reps, weight, %1RM, tempo, pause time, chains, bands
 */

import React, { useState, useMemo } from 'react';
import { useWorkoutStore } from '../../../store/workoutStore';
import { Exercise, ExerciseCategory, PowerliftingParameters } from '../../../types/ultimate-training';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import Badge from '../../ui/Badge';
import { Plus, Trash2, GripVertical, TrendingUp, Clock, Target } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { translateExerciseName } from '../../../utils/exerciseTranslations';

interface PowerliftingTrainingTabProps {
  activeUser?: any;
  onUpdateUser?: (user: any) => void;
}

interface ExerciseWithParams {
  id: string;
  exercise: Exercise;
  parameters: PowerliftingParameters;
}

const PowerliftingTrainingTab: React.FC<PowerliftingTrainingTabProps> = ({
  activeUser,
  onUpdateUser
}) => {
  const { currentProgram, activeDayId, addExerciseToDay, getFilteredExercises } = useWorkoutStore();
  const [exercises, setExercises] = useState<ExerciseWithParams[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showParamsForm, setShowParamsForm] = useState(false);
  const [params, setParams] = useState<PowerliftingParameters>({
    sets: 5,
    reps: 5,
    weight: 0,
    oneRepMaxPercent: 75,
    rest: 300
  });

  const powerliftingExercises = useMemo(() => {
    return getFilteredExercises().filter(ex => ex.category === ExerciseCategory.POWERLIFTING);
  }, [getFilteredExercises]);

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setParams({
      sets: 5,
      reps: 5,
      weight: 0,
      oneRepMaxPercent: 75,
      rest: 300
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

    toast.success('حرکت قدرتی اضافه شد');
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
            <TrendingUp className="w-6 h-6 text-purple-600" />
            تمرین قدرتی
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            تمرینات قدرتی تخصصی برای اسکوات، پرس سینه و ددلیفت
          </p>
        </div>
        <Button
          onClick={() => setShowParamsForm(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600"
        >
          <Plus className="w-4 h-4 ml-2" />
          افزودن حرکت قدرتی
        </Button>
      </div>

      {showParamsForm && (
        <Card className="border-2 border-purple-500 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>تنظیم پارامترهای قدرتی</span>
              <Button variant="ghost" size="sm" onClick={() => { setShowParamsForm(false); setSelectedExercise(null); }}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedExercise && (
              <div>
                <Label>انتخاب حرکت قدرتی</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
                  {powerliftingExercises.map(ex => (
                    <Button key={ex.id} variant="outline" onClick={() => handleAddExercise(ex)} className="justify-start text-right">
                      {translateExerciseName(ex.name)}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {selectedExercise && (
              <>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
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
                    <Input id="weight" type="number" value={params.weight} onChange={(e) => setParams({ ...params, weight: parseFloat(e.target.value) || 0 })} min="0" />
                  </div>
                  <div>
                    <Label htmlFor="oneRepMaxPercent" className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      درصد یک تکرار حداکثر
                    </Label>
                    <Input id="oneRepMaxPercent" type="number" value={params.oneRepMaxPercent} onChange={(e) => setParams({ ...params, oneRepMaxPercent: parseFloat(e.target.value) || 0 })} min="0" max="100" />
                  </div>
                  <div>
                    <Label htmlFor="rest" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      استراحت (ثانیه)
                    </Label>
                    <Input id="rest" type="number" value={params.rest} onChange={(e) => setParams({ ...params, rest: parseInt(e.target.value) || 0 })} min="0" />
                  </div>
                  <div>
                    <Label htmlFor="tempo">تمپو</Label>
                    <Input id="tempo" type="text" value={params.tempo || ''} onChange={(e) => setParams({ ...params, tempo: e.target.value })} placeholder="2-0-1-0" />
                  </div>
                  <div>
                    <Label htmlFor="pauseTime">زمان مکث در پایین (ثانیه)</Label>
                    <Input id="pauseTime" type="number" value={params.pauseTime || ''} onChange={(e) => setParams({ ...params, pauseTime: parseInt(e.target.value) || undefined })} placeholder="اختیاری" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={params.withChains || false} onChange={(e) => setParams({ ...params, withChains: e.target.checked })} className="w-4 h-4" />
                    <span>با زنجیر</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={params.withBands || false} onChange={(e) => setParams({ ...params, withBands: e.target.checked })} className="w-4 h-4" />
                    <span>با باند</span>
                  </label>
                </div>

                <div>
                  <Label htmlFor="notes">یادداشت</Label>
                  <textarea id="notes" value={params.notes || ''} onChange={(e) => setParams({ ...params, notes: e.target.value })} className="w-full mt-2 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800" rows={3} placeholder="یادداشت‌های اضافی..." />
                </div>

                <Button onClick={handleSaveExercise} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600">
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
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">هنوز حرکت قدرتی اضافه نشده است</p>
                <Button onClick={() => setShowParamsForm(true)} className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600">
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
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">ست‌ها</div>
                            <div className="font-bold text-lg">{item.parameters.sets}</div>
                          </div>
                          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">تکرار</div>
                            <div className="font-bold text-lg">{item.parameters.reps}</div>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">وزن</div>
                            <div className="font-bold text-lg">{item.parameters.weight} kg</div>
                          </div>
                          <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg">
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">%1RM</div>
                            <div className="font-bold text-lg">{item.parameters.oneRepMaxPercent}%</div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {item.parameters.withChains && <Badge className="bg-orange-500">زنجیر</Badge>}
                          {item.parameters.withBands && <Badge className="bg-red-500">باند</Badge>}
                          {item.parameters.pauseTime && <Badge className="bg-blue-500">مکث: {item.parameters.pauseTime}s</Badge>}
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

export default PowerliftingTrainingTab;



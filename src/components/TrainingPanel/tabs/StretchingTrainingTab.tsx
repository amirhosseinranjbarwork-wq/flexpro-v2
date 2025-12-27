/**
 * STRETCHING TRAINING TAB - تمرین کششی
 * پارامترهای کامل: duration, sets, type (static/dynamic/PNF/ballistic)
 */

import React, { useState, useMemo } from 'react';
import { useWorkoutStore } from '../../../store/workoutStore';
import { Exercise, ExerciseCategory, StretchingParameters } from '../../../types/ultimate-training';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import Badge from '../../ui/Badge';
import { Plus, Trash2, GripVertical, Wind, Clock } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { translateExerciseName } from '../../../utils/exerciseTranslations';

interface StretchingTrainingTabProps {
  activeUser?: any;
  onUpdateUser?: (user: any) => void;
}

interface ExerciseWithParams {
  id: string;
  exercise: Exercise;
  parameters: StretchingParameters;
}

const StretchingTrainingTab: React.FC<StretchingTrainingTabProps> = ({
  activeUser,
  onUpdateUser
}) => {
  const { currentProgram, activeDayId, addExerciseToDay, getFilteredExercises } = useWorkoutStore();
  const [exercises, setExercises] = useState<ExerciseWithParams[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showParamsForm, setShowParamsForm] = useState(false);
  const [params, setParams] = useState<StretchingParameters>({
    duration: 30,
    sets: 3,
    type: 'static'
  });

  const stretchingExercises = useMemo(() => {
    return getFilteredExercises().filter(ex => ex.category === ExerciseCategory.STRETCHING);
  }, [getFilteredExercises]);

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setParams({
      duration: 30,
      sets: 3,
      type: 'static'
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

    toast.success('حرکت کششی اضافه شد');
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'static': return 'ایستا';
      case 'dynamic': return 'پویا';
      case 'pnf': return 'PNF';
      case 'ballistic': return 'بالیستیک';
      default: return 'ایستا';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wind className="w-6 h-6 text-emerald-600" />
            تمرین کششی
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            تمرینات کششی برای بهبود انعطاف‌پذیری و تحرک
          </p>
        </div>
        <Button
          onClick={() => setShowParamsForm(true)}
          className="bg-gradient-to-r from-emerald-600 to-green-600"
        >
          <Plus className="w-4 h-4 ml-2" />
          افزودن حرکت کششی
        </Button>
      </div>

      {showParamsForm && (
        <Card className="border-2 border-emerald-500 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>تنظیم پارامترهای کششی</span>
              <Button variant="ghost" size="sm" onClick={() => { setShowParamsForm(false); setSelectedExercise(null); }}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedExercise && (
              <div>
                <Label>انتخاب حرکت کششی</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
                  {stretchingExercises.map(ex => (
                    <Button key={ex.id} variant="outline" onClick={() => handleAddExercise(ex)} className="justify-start text-right">
                      {translateExerciseName(ex.name)}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {selectedExercise && (
              <>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <h3 className="font-bold text-lg mb-2">{translateExerciseName(selectedExercise.name)}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedExercise.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">مدت زمان (ثانیه)</Label>
                    <Input id="duration" type="number" value={params.duration} onChange={(e) => setParams({ ...params, duration: parseInt(e.target.value) || 0 })} min="1" />
                  </div>
                  <div>
                    <Label htmlFor="sets">ست‌ها</Label>
                    <Input id="sets" type="number" value={params.sets} onChange={(e) => setParams({ ...params, sets: parseInt(e.target.value) || 0 })} min="1" />
                  </div>
                  <div>
                    <Label htmlFor="type">نوع کشش</Label>
                    <select id="type" value={params.type} onChange={(e) => setParams({ ...params, type: e.target.value as any })} className="w-full mt-2 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800">
                      <option value="static">ایستا</option>
                      <option value="dynamic">پویا</option>
                      <option value="pnf">PNF</option>
                      <option value="ballistic">بالیستیک</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">یادداشت</Label>
                  <textarea id="notes" value={params.notes || ''} onChange={(e) => setParams({ ...params, notes: e.target.value })} className="w-full mt-2 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800" rows={3} placeholder="یادداشت‌های اضافی..." />
                </div>

                <Button onClick={handleSaveExercise} className="w-full bg-gradient-to-r from-emerald-600 to-green-600">
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
                <Wind className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">هنوز حرکت کششی اضافه نشده است</p>
                <Button onClick={() => setShowParamsForm(true)} className="mt-4 bg-gradient-to-r from-emerald-600 to-green-600">
                  <Plus className="w-4 h-4 ml-2" />
                  افزودن اولین حرکت
                </Button>
              </Card>
            ) : (
              exercises.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{translateExerciseName(item.exercise.name)}</h3>
                        <div className="grid grid-cols-3 gap-3 mt-3">
                          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">مدت زمان</div>
                            <div className="font-bold text-lg">{item.parameters.duration}s</div>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">ست‌ها</div>
                            <div className="font-bold text-lg">{item.parameters.sets}</div>
                          </div>
                          <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">نوع</div>
                            <Badge>{getTypeLabel(item.parameters.type)}</Badge>
                          </div>
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

export default StretchingTrainingTab;




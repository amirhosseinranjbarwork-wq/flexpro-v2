/**
 * CARDIO TRAINING TAB - تمرین کاردیو
 * پارامترهای کامل: duration, distance, zone, speed, incline, intervals, target HR
 */

import React, { useState, useMemo } from 'react';
import { useWorkoutStore } from '../../../store/workoutStore';
import { Exercise, ExerciseCategory, CardioParameters, CardioZone } from '../../../types/ultimate-training';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import Badge from '../../ui/Badge';
import { Plus, Trash2, GripVertical, Heart, Clock, Target, TrendingUp } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { translateExerciseName } from '../../../utils/exerciseTranslations';

interface CardioTrainingTabProps {
  activeUser?: any;
  onUpdateUser?: (user: any) => void;
}

interface ExerciseWithParams {
  id: string;
  exercise: Exercise;
  parameters: CardioParameters;
}

const CardioTrainingTab: React.FC<CardioTrainingTabProps> = ({
  activeUser,
  onUpdateUser
}) => {
  const { currentProgram, activeDayId, addExerciseToDay, getFilteredExercises } = useWorkoutStore();
  const [exercises, setExercises] = useState<ExerciseWithParams[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showParamsForm, setShowParamsForm] = useState(false);
  const [params, setParams] = useState<CardioParameters>({
    duration: 30,
    zone: CardioZone.ZONE_2,
    rest: 0
  });

  const cardioExercises = useMemo(() => {
    return getFilteredExercises().filter(ex => ex.category === ExerciseCategory.CARDIO);
  }, [getFilteredExercises]);

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setParams({
      duration: 30,
      zone: CardioZone.ZONE_2,
      rest: 0
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

    toast.success('حرکت کاردیو اضافه شد');
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

  const getZoneLabel = (zone: CardioZone) => {
    switch (zone) {
      case CardioZone.ZONE_1: return 'زون 1: ریکاوری (50-60% HRmax)';
      case CardioZone.ZONE_2: return 'زون 2: پایه هوازی (60-70% HRmax)';
      case CardioZone.ZONE_3: return 'زون 3: تمپو (70-80% HRmax)';
      case CardioZone.ZONE_4: return 'زون 4: آستانه (80-90% HRmax)';
      case CardioZone.ZONE_5: return 'زون 5: VO2max (90-100% HRmax)';
      default: return 'زون 2';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-600" />
            تمرین کاردیو
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            طراحی برنامه کاردیو با زون‌های مختلف و اینتروال
          </p>
        </div>
        <Button
          onClick={() => setShowParamsForm(true)}
          className="bg-gradient-to-r from-red-600 to-pink-600"
        >
          <Plus className="w-4 h-4 ml-2" />
          افزودن حرکت کاردیو
        </Button>
      </div>

      {/* Parameters Form Modal */}
      {showParamsForm && (
        <Card className="border-2 border-red-500 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>تنظیم پارامترهای کاردیو</span>
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
                <Label>انتخاب حرکت کاردیو</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
                  {cardioExercises.map(ex => (
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
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="font-bold text-lg mb-2">{translateExerciseName(selectedExercise.name)}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedExercise.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Duration */}
                  <div>
                    <Label htmlFor="duration" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      مدت زمان (دقیقه)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      value={params.duration}
                      onChange={(e) => setParams({ ...params, duration: parseInt(e.target.value) || 0 })}
                      min="1"
                    />
                  </div>

                  {/* Zone */}
                  <div>
                    <Label htmlFor="zone" className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      زون تمرینی
                    </Label>
                    <select
                      id="zone"
                      value={params.zone}
                      onChange={(e) => setParams({ ...params, zone: parseInt(e.target.value) as CardioZone })}
                      className="w-full mt-2 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                    >
                      <option value={CardioZone.ZONE_1}>زون 1: ریکاوری</option>
                      <option value={CardioZone.ZONE_2}>زون 2: پایه هوازی</option>
                      <option value={CardioZone.ZONE_3}>زون 3: تمپو</option>
                      <option value={CardioZone.ZONE_4}>زون 4: آستانه</option>
                      <option value={CardioZone.ZONE_5}>زون 5: VO2max</option>
                    </select>
                  </div>

                  {/* Distance */}
                  <div>
                    <Label htmlFor="distance">مسافت (کیلومتر)</Label>
                    <Input
                      id="distance"
                      type="number"
                      value={params.distance || ''}
                      onChange={(e) => setParams({ ...params, distance: parseFloat(e.target.value) || undefined })}
                      placeholder="اختیاری"
                    />
                  </div>

                  {/* Speed */}
                  <div>
                    <Label htmlFor="speed">سرعت (کیلومتر بر ساعت)</Label>
                    <Input
                      id="speed"
                      type="number"
                      value={params.speed || ''}
                      onChange={(e) => setParams({ ...params, speed: parseFloat(e.target.value) || undefined })}
                      placeholder="اختیاری"
                    />
                  </div>

                  {/* Incline */}
                  <div>
                    <Label htmlFor="incline">شیب (درصد)</Label>
                    <Input
                      id="incline"
                      type="number"
                      value={params.incline || ''}
                      onChange={(e) => setParams({ ...params, incline: parseFloat(e.target.value) || undefined })}
                      placeholder="اختیاری"
                    />
                  </div>

                  {/* Target HR */}
                  <div>
                    <Label htmlFor="targetHR" className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      ضربان قلب هدف (bpm)
                    </Label>
                    <Input
                      id="targetHR"
                      type="number"
                      value={params.targetHeartRate || ''}
                      onChange={(e) => setParams({ ...params, targetHeartRate: parseInt(e.target.value) || undefined })}
                      placeholder="اختیاری"
                    />
                  </div>
                </div>

                {/* Intervals */}
                <div className="pt-4 border-t">
                  <Label className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4" />
                    اینتروال (اختیاری)
                  </Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="intervalWork">کار (ثانیه)</Label>
                      <Input
                        id="intervalWork"
                        type="number"
                        value={params.intervals?.work || ''}
                        onChange={(e) => setParams({
                          ...params,
                          intervals: {
                            ...params.intervals,
                            work: parseInt(e.target.value) || 0,
                            rest: params.intervals?.rest || 0,
                            rounds: params.intervals?.rounds || 0
                          } as any
                        })}
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="intervalRest">استراحت (ثانیه)</Label>
                      <Input
                        id="intervalRest"
                        type="number"
                        value={params.intervals?.rest || ''}
                        onChange={(e) => setParams({
                          ...params,
                          intervals: {
                            ...params.intervals,
                            work: params.intervals?.work || 0,
                            rest: parseInt(e.target.value) || 0,
                            rounds: params.intervals?.rounds || 0
                          } as any
                        })}
                        placeholder="60"
                      />
                    </div>
                    <div>
                      <Label htmlFor="intervalRounds">تعداد دور</Label>
                      <Input
                        id="intervalRounds"
                        type="number"
                        value={params.intervals?.rounds || ''}
                        onChange={(e) => setParams({
                          ...params,
                          intervals: {
                            ...params.intervals,
                            work: params.intervals?.work || 0,
                            rest: params.intervals?.rest || 0,
                            rounds: parseInt(e.target.value) || 0
                          } as any
                        })}
                        placeholder="10"
                      />
                    </div>
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
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600"
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
                <Heart className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">هنوز حرکت کاردیو اضافه نشده است</p>
                <Button
                  onClick={() => setShowParamsForm(true)}
                  className="mt-4 bg-gradient-to-r from-red-600 to-pink-600"
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

  const getZoneLabel = (zone: CardioZone) => {
    switch (zone) {
      case CardioZone.ZONE_1: return 'زون 1';
      case CardioZone.ZONE_2: return 'زون 2';
      case CardioZone.ZONE_3: return 'زون 3';
      case CardioZone.ZONE_4: return 'زون 4';
      case CardioZone.ZONE_5: return 'زون 5';
      default: return 'زون 2';
    }
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
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">مدت زمان</div>
                <div className="font-bold text-lg">{item.parameters.duration} دقیقه</div>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">زون</div>
                <div className="font-bold text-lg">{getZoneLabel(item.parameters.zone)}</div>
              </div>
              {item.parameters.distance && (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">مسافت</div>
                  <div className="font-bold text-lg">{item.parameters.distance} km</div>
                </div>
              )}
              {item.parameters.speed && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">سرعت</div>
                  <div className="font-bold text-lg">{item.parameters.speed} km/h</div>
                </div>
              )}
              {item.parameters.targetHeartRate && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">ضربان هدف</div>
                  <div className="font-bold text-lg">{item.parameters.targetHeartRate} bpm</div>
                </div>
              )}
            </div>

            {/* Intervals */}
            {item.parameters.intervals && (
              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded">
                <div className="text-sm font-semibold mb-2">اینتروال:</div>
                <div className="flex gap-4 text-sm">
                  <span>کار: {item.parameters.intervals.work}s</span>
                  <span>استراحت: {item.parameters.intervals.rest}s</span>
                  <span>دور: {item.parameters.intervals.rounds}</span>
                </div>
              </div>
            )}

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

export default CardioTrainingTab;




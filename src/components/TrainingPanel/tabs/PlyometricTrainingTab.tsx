/**
 * PLYOMETRIC TRAINING TAB - تمرین پلایومتریک
 * پارامترهای کامل: contacts, sets, height, distance, intensity, rest
 */

import React, { useState, useMemo } from 'react';
import { useWorkoutStore } from '../../../store/workoutStore';
import { Exercise, ExerciseCategory, PlyometricParameters } from '../../../types/ultimate-training';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import Badge from '../../ui/Badge';
import { Plus, Trash2, GripVertical, Zap, Clock, Target } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { translateExerciseName } from '../../../utils/exerciseTranslations';

interface PlyometricTrainingTabProps {
  activeUser?: any;
  onUpdateUser?: (user: any) => void;
}

interface ExerciseWithParams {
  id: string;
  exercise: Exercise;
  parameters: PlyometricParameters;
}

const PlyometricTrainingTab: React.FC<PlyometricTrainingTabProps> = ({
  activeUser,
  onUpdateUser
}) => {
  const { currentProgram, activeDayId, addExerciseToDay, getFilteredExercises } = useWorkoutStore();
  const [exercises, setExercises] = useState<ExerciseWithParams[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showParamsForm, setShowParamsForm] = useState(false);
  const [params, setParams] = useState<PlyometricParameters>({
    contacts: 20,
    sets: 3,
    intensity: 'medium',
    rest: 120
  });

  const plyometricExercises = useMemo(() => {
    return getFilteredExercises().filter(ex => ex.category === ExerciseCategory.PLYOMETRIC);
  }, [getFilteredExercises]);

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setParams({
      contacts: 20,
      sets: 3,
      intensity: 'medium',
      rest: 120
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

    toast.success('حرکت پلایومتریک اضافه شد');
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

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getIntensityLabel = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'کم';
      case 'medium': return 'متوسط';
      case 'high': return 'زیاد';
      default: return 'متوسط';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-600" />
            تمرین پلایومتریک
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            تمرینات انفجاری برای بهبود قدرت و سرعت
          </p>
        </div>
        <Button
          onClick={() => setShowParamsForm(true)}
          className="bg-gradient-to-r from-yellow-600 to-orange-600"
        >
          <Plus className="w-4 h-4 ml-2" />
          افزودن حرکت پلایومتریک
        </Button>
      </div>

      {/* Parameters Form Modal */}
      {showParamsForm && (
        <Card className="border-2 border-yellow-500 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>تنظیم پارامترهای پلایومتریک</span>
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
                <Label>انتخاب حرکت پلایومتریک</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
                  {plyometricExercises.map(ex => (
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
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h3 className="font-bold text-lg mb-2">{translateExerciseName(selectedExercise.name)}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedExercise.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Contacts */}
                  <div>
                    <Label htmlFor="contacts" className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      تعداد تماس با زمین
                    </Label>
                    <Input
                      id="contacts"
                      type="number"
                      value={params.contacts}
                      onChange={(e) => setParams({ ...params, contacts: parseInt(e.target.value) || 0 })}
                      min="1"
                    />
                  </div>

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

                  {/* Height */}
                  <div>
                    <Label htmlFor="height">ارتفاع جعبه (سانتی‌متر)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={params.height || ''}
                      onChange={(e) => setParams({ ...params, height: parseInt(e.target.value) || undefined })}
                      placeholder="اختیاری"
                    />
                  </div>

                  {/* Distance */}
                  <div>
                    <Label htmlFor="distance">مسافت پرش (متر)</Label>
                    <Input
                      id="distance"
                      type="number"
                      value={params.distance || ''}
                      onChange={(e) => setParams({ ...params, distance: parseFloat(e.target.value) || undefined })}
                      placeholder="اختیاری"
                    />
                  </div>

                  {/* Intensity */}
                  <div>
                    <Label htmlFor="intensity">شدت</Label>
                    <select
                      id="intensity"
                      value={params.intensity}
                      onChange={(e) => setParams({ ...params, intensity: e.target.value as 'low' | 'medium' | 'high' })}
                      className="w-full mt-2 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                    >
                      <option value="low">کم</option>
                      <option value="medium">متوسط</option>
                      <option value="high">زیاد</option>
                    </select>
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
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600"
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
                <Zap className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">هنوز حرکت پلایومتریک اضافه نشده است</p>
                <Button
                  onClick={() => setShowParamsForm(true)}
                  className="mt-4 bg-gradient-to-r from-yellow-600 to-orange-600"
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

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getIntensityLabel = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'کم';
      case 'medium': return 'متوسط';
      case 'high': return 'زیاد';
      default: return 'متوسط';
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
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">تماس با زمین</div>
                <div className="font-bold text-lg">{item.parameters.contacts}</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">ست‌ها</div>
                <div className="font-bold text-lg">{item.parameters.sets}</div>
              </div>
              {item.parameters.height && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">ارتفاع</div>
                  <div className="font-bold text-lg">{item.parameters.height} cm</div>
                </div>
              )}
              {item.parameters.distance && (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">مسافت</div>
                  <div className="font-bold text-lg">{item.parameters.distance} m</div>
                </div>
              )}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">شدت</div>
                <Badge className={`${getIntensityColor(item.parameters.intensity)} text-white`}>
                  {getIntensityLabel(item.parameters.intensity)}
                </Badge>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">استراحت</div>
                <div className="font-bold text-lg">{item.parameters.rest}s</div>
              </div>
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

export default PlyometricTrainingTab;



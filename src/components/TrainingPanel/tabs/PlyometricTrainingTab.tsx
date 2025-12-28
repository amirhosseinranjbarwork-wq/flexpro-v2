/**
 * PLYOMETRIC TRAINING TAB - تمرین پلایومتریک
 * انتخاب حرکت + تنظیم پارامترها در همان تب
 */

import React, { useState, useMemo } from 'react';
import { useWorkoutStore } from '../../../store/workoutStore';
import { Exercise, ExerciseCategory, PlyometricParameters } from '../../../types/ultimate-training';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import Badge from '../../ui/Badge';
import { Plus, Trash2, Zap, Search, X } from 'lucide-react';
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
  activeUser: _activeUser,
  onUpdateUser: _onUpdateUser
}) => {
  const { activeDayId, addExerciseToDay, getFilteredExercises } = useWorkoutStore();
  const [exercises, setExercises] = useState<ExerciseWithParams[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showParamsForm, setShowParamsForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [params, setParams] = useState<PlyometricParameters>({
    contacts: 20,
    sets: 3,
    intensity: 'medium',
    rest: 120
  });

  const plyometricExercises = useMemo(() => {
    return getFilteredExercises().filter(ex => ex.category === ExerciseCategory.PLYOMETRIC);
  }, [getFilteredExercises]);

  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) return plyometricExercises;
    const query = searchQuery.toLowerCase();
    return plyometricExercises.filter(ex => 
      ex.name.toLowerCase().includes(query) ||
      ex.description?.toLowerCase().includes(query)
    );
  }, [plyometricExercises, searchQuery]);

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseSelector(false);
    setShowParamsForm(true);
    setParams({
      contacts: 20,
      sets: 3,
      intensity: 'medium',
      rest: 120
    });
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
            انتخاب حرکت و تنظیم پارامترهای تمرین پلایومتریک
          </p>
        </div>
        <Button
          onClick={() => setShowExerciseSelector(true)}
          className="bg-gradient-to-r from-yellow-600 to-orange-600"
        >
          <Plus className="w-4 h-4 ml-2" />
          افزودن حرکت پلایومتریک
        </Button>
      </div>

      {/* Exercise Selector Modal */}
      {showExerciseSelector && (
        <Card className="border-2 border-yellow-500 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>انتخاب حرکت پلایومتریک</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowExerciseSelector(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="جستجوی حرکت پلایومتریک..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            {/* Exercise List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {filteredExercises.map(ex => (
                <Button
                  key={ex.id}
                  variant="outline"
                  onClick={() => handleSelectExercise(ex)}
                  className="justify-start text-right h-auto p-3"
                >
                  <div className="flex-1 text-right">
                    <div className="font-semibold">{translateExerciseName(ex.name)}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {ex.description?.substring(0, 50)}...
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parameters Form */}
      {showParamsForm && selectedExercise && (
        <Card className="border-2 border-yellow-500 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>تنظیم پارامترهای {translateExerciseName(selectedExercise.name)}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setShowParamsForm(false); setSelectedExercise(null); }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 className="font-bold text-lg mb-2">{translateExerciseName(selectedExercise.name)}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{selectedExercise.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contacts">تعداد برخورد</Label>
                <Input
                  id="contacts"
                  type="number"
                  value={params.contacts}
                  onChange={(e) => setParams({ ...params, contacts: parseInt(e.target.value) || 0 })}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="sets">ست‌ها</Label>
                <Input
                  id="sets"
                  type="number"
                  value={params.sets}
                  onChange={(e) => setParams({ ...params, sets: parseInt(e.target.value) || 0 })}
                  min="1"
                />
              </div>
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
              <div>
                <Label htmlFor="rest">استراحت (ثانیه)</Label>
                <Input
                  id="rest"
                  type="number"
                  value={params.rest}
                  onChange={(e) => setParams({ ...params, rest: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              {params.height !== undefined && (
                <div>
                  <Label htmlFor="height">ارتفاع جعبه (سانتی‌متر)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={params.height}
                    onChange={(e) => setParams({ ...params, height: parseInt(e.target.value) || undefined })}
                    min="0"
                  />
                </div>
              )}
              {params.distance !== undefined && (
                <div>
                  <Label htmlFor="distance">مسافت (متر)</Label>
                  <Input
                    id="distance"
                    type="number"
                    value={params.distance}
                    onChange={(e) => setParams({ ...params, distance: parseInt(e.target.value) || undefined })}
                    min="0"
                  />
                </div>
              )}
            </div>

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

            <Button onClick={handleSaveExercise} className="w-full bg-gradient-to-r from-yellow-600 to-orange-600">
              <Plus className="w-4 h-4 ml-2" />
              افزودن به برنامه
            </Button>
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
                  onClick={() => setShowExerciseSelector(true)}
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
                  getIntensityColor={getIntensityColor}
                  getIntensityLabel={getIntensityLabel}
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
  getIntensityColor: (intensity: string) => string;
  getIntensityLabel: (intensity: string) => string;
}

const SortableExerciseRow: React.FC<SortableExerciseRowProps> = ({ item, onDelete, getIntensityColor, getIntensityLabel }) => {
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
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded mt-1"
          >
            <Plus className="w-5 h-5 text-slate-400 rotate-45" />
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
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">ست‌ها</div>
                <div className="font-bold text-lg">{item.parameters.sets}</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">برخورد</div>
                <div className="font-bold text-lg">{item.parameters.contacts}</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">شدت</div>
                <Badge className={`${getIntensityColor(item.parameters.intensity)} text-white`}>
                  {getIntensityLabel(item.parameters.intensity)}
                </Badge>
              </div>
              {item.parameters.rest && (
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">استراحت</div>
                  <div className="font-bold text-lg">{item.parameters.rest}ث</div>
                </div>
              )}
              {item.parameters.height && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">ارتفاع</div>
                  <div className="font-bold text-lg">{item.parameters.height}cm</div>
                </div>
              )}
              {item.parameters.distance && (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">مسافت</div>
                  <div className="font-bold text-lg">{item.parameters.distance}m</div>
                </div>
              )}
            </div>
            {item.parameters.notes && (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                📝 {item.parameters.notes}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlyometricTrainingTab;

/**
 * WORKOUT EXERCISE CARD - Exercise in Workout with Smart Parameters
 * Displays exercise with category-specific parameter inputs
 */

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useWorkoutStore } from '../../store/workoutStore';
import {
  WorkoutExercise,
  ExerciseCategory,
  ResistanceParameters,
  CardioParameters,
  PlyometricParameters,
  CardioZone
} from '../../types/ultimate-training';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardHeader
} from '../ui/card';
import {
  GripVertical,
  Trash2,
  ChevronDown,
  ChevronUp,
  Link2,
  Unlink,
  Timer,
  Info
} from 'lucide-react';

interface WorkoutExerciseCardProps {
  workoutExercise: WorkoutExercise;
  dayId: string;
  index: number;
}

export const WorkoutExerciseCard: React.FC<WorkoutExerciseCardProps> = ({
  workoutExercise,
  dayId,
  index
}) => {
  const {
    removeExerciseFromDay,
    updateExerciseParameters,
    createSuperset,
    removeSuperset,
    getCurrentDay
  } = useWorkoutStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: workoutExercise.exerciseId
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const { exercise, parameters, supersetWith } = workoutExercise;

  const handleParameterChange = (key: string, value: any) => {
    updateExerciseParameters(dayId, workoutExercise.exerciseId, {
      [key]: value
    });
  };

  const handleDelete = () => {
    removeExerciseFromDay(dayId, workoutExercise.exerciseId);
  };

  const handleSuperset = () => {
    const currentDay = getCurrentDay();
    if (!currentDay) return;

    // Find next exercise to pair with
    const nextExercise = currentDay.exercises[index + 1];
    if (nextExercise && !supersetWith) {
      createSuperset(dayId, workoutExercise.exerciseId, nextExercise.exerciseId);
    } else if (supersetWith) {
      removeSuperset(dayId, workoutExercise.exerciseId);
    }
  };

  const startRestTimer = () => {
    const restTime = (parameters as any).rest || 60;
    setRestTimeRemaining(restTime);
    setShowRestTimer(true);

    const interval = setInterval(() => {
      setRestTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowRestTimer(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Render parameters based on category
  const renderParameters = () => {
    switch (exercise.category) {
      case ExerciseCategory.RESISTANCE:
        return <ResistanceParametersForm parameters={parameters as ResistanceParameters} onChange={handleParameterChange} />;
      case ExerciseCategory.CARDIO:
        return <CardioParametersForm parameters={parameters as CardioParameters} onChange={handleParameterChange} />;
      case ExerciseCategory.PLYOMETRIC:
        return <PlyometricParametersForm parameters={parameters as PlyometricParameters} onChange={handleParameterChange} />;
      default:
        return <ResistanceParametersForm parameters={parameters as ResistanceParameters} onChange={handleParameterChange} />;
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`
        ${supersetWith ? 'border-l-4 border-l-yellow-500' : ''}
        ${isDragging ? 'shadow-2xl' : 'shadow-sm'}
        hover:shadow-md transition-all
      `}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
            >
              <GripVertical className="w-5 h-5" />
            </div>

            {/* Exercise Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">
                  {index + 1}
                </Badge>
                <h3 className="font-semibold text-lg">{exercise.name}</h3>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span>{exercise.category}</span>
                <span>•</span>
                <span>{exercise.primaryMuscles.join(', ')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSuperset}
                title={supersetWith ? 'Remove from superset' : 'Create superset'}
              >
                {supersetWith ? <Unlink className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Superset Badge */}
          {supersetWith && (
            <Badge variant="default" className="bg-yellow-500 text-yellow-900 w-fit mt-2">
              In Superset
            </Badge>
          )}
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0 border-t border-slate-200 dark:border-slate-700">
            <div className="mt-4">
              {renderParameters()}

              {/* Rest Timer */}
              {'rest' in parameters && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Rest: {parameters.rest}s</span>
                    </div>
                    {!showRestTimer ? (
                      <Button size="sm" onClick={startRestTimer}>
                        Start Timer
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          {Math.floor(restTimeRemaining / 60)}:{(restTimeRemaining % 60).toString().padStart(2, '0')}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowRestTimer(false)}
                        >
                          Stop
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Coaching Cues */}
              {exercise.cues.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-sm">Coaching Cues</h4>
                  </div>
                  <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                    {exercise.cues.slice(0, 3).map((cue, idx) => (
                      <li key={idx}>• {cue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

// Resistance Parameters Form
interface ResistanceParametersFormProps {
  parameters: ResistanceParameters;
  onChange: (key: string, value: any) => void;
}

const ResistanceParametersForm: React.FC<ResistanceParametersFormProps> = ({
  parameters,
  onChange
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <Label htmlFor="sets">Sets</Label>
        <Input
          id="sets"
          type="number"
          value={parameters.sets}
          onChange={(e) => onChange('sets', parseInt(e.target.value))}
          min={1}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="reps">Reps</Label>
        <Input
          id="reps"
          type="text"
          value={parameters.reps}
          onChange={(e) => onChange('reps', e.target.value)}
          className="mt-1"
          placeholder="8-12"
        />
      </div>
      <div>
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          value={parameters.weight || ''}
          onChange={(e) => onChange('weight', parseFloat(e.target.value))}
          min={0}
          step={2.5}
          className="mt-1"
          placeholder="0"
        />
      </div>
      <div>
        <Label htmlFor="rest">Rest (s)</Label>
        <Input
          id="rest"
          type="number"
          value={parameters.rest}
          onChange={(e) => onChange('rest', parseInt(e.target.value))}
          min={0}
          step={15}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="rpe">RPE (1-10)</Label>
        <Input
          id="rpe"
          type="number"
          value={parameters.rpe || ''}
          onChange={(e) => onChange('rpe', parseInt(e.target.value))}
          min={1}
          max={10}
          className="mt-1"
          placeholder="8"
        />
      </div>
      <div>
        <Label htmlFor="tempo">Tempo</Label>
        <Input
          id="tempo"
          type="text"
          value={parameters.tempo || ''}
          onChange={(e) => onChange('tempo', e.target.value)}
          className="mt-1"
          placeholder="3-0-1-0"
        />
      </div>
      {parameters.oneRepMaxPercent !== undefined && (
        <div>
          <Label htmlFor="oneRepMax">% 1RM</Label>
          <Input
            id="oneRepMax"
            type="number"
            value={parameters.oneRepMaxPercent}
            onChange={(e) => onChange('oneRepMaxPercent', parseInt(e.target.value))}
            min={0}
            max={100}
            step={5}
            className="mt-1"
          />
        </div>
      )}
    </div>
  );
};

// Cardio Parameters Form
interface CardioParametersFormProps {
  parameters: CardioParameters;
  onChange: (key: string, value: any) => void;
}

const CardioParametersForm: React.FC<CardioParametersFormProps> = ({
  parameters,
  onChange
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <Label htmlFor="duration">Duration (min)</Label>
        <Input
          id="duration"
          type="number"
          value={parameters.duration}
          onChange={(e) => onChange('duration', parseInt(e.target.value))}
          min={1}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="zone">HR Zone</Label>
        <select
          id="zone"
          value={parameters.zone}
          onChange={(e) => onChange('zone', parseInt(e.target.value))}
          className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
        >
          <option value={CardioZone.ZONE_1}>Zone 1 (Recovery)</option>
          <option value={CardioZone.ZONE_2}>Zone 2 (Aerobic)</option>
          <option value={CardioZone.ZONE_3}>Zone 3 (Tempo)</option>
          <option value={CardioZone.ZONE_4}>Zone 4 (Threshold)</option>
          <option value={CardioZone.ZONE_5}>Zone 5 (VO2 Max)</option>
        </select>
      </div>
      {parameters.speed !== undefined && (
        <div>
          <Label htmlFor="speed">Speed (km/h)</Label>
          <Input
            id="speed"
            type="number"
            value={parameters.speed}
            onChange={(e) => onChange('speed', parseFloat(e.target.value))}
            min={0}
            step={0.5}
            className="mt-1"
          />
        </div>
      )}
      {parameters.incline !== undefined && (
        <div>
          <Label htmlFor="incline">Incline (%)</Label>
          <Input
            id="incline"
            type="number"
            value={parameters.incline}
            onChange={(e) => onChange('incline', parseInt(e.target.value))}
            min={0}
            max={15}
            className="mt-1"
          />
        </div>
      )}
    </div>
  );
};

// Plyometric Parameters Form
interface PlyometricParametersFormProps {
  parameters: PlyometricParameters;
  onChange: (key: string, value: any) => void;
}

const PlyometricParametersForm: React.FC<PlyometricParametersFormProps> = ({
  parameters,
  onChange
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <Label htmlFor="contacts">Contacts</Label>
        <Input
          id="contacts"
          type="number"
          value={parameters.contacts}
          onChange={(e) => onChange('contacts', parseInt(e.target.value))}
          min={1}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="sets">Sets</Label>
        <Input
          id="sets"
          type="number"
          value={parameters.sets}
          onChange={(e) => onChange('sets', parseInt(e.target.value))}
          min={1}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="rest">Rest (s)</Label>
        <Input
          id="rest"
          type="number"
          value={parameters.rest}
          onChange={(e) => onChange('rest', parseInt(e.target.value))}
          min={0}
          step={15}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="intensity">Intensity</Label>
        <select
          id="intensity"
          value={parameters.intensity}
          onChange={(e) => onChange('intensity', e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      {parameters.height !== undefined && (
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={parameters.height}
            onChange={(e) => onChange('height', parseInt(e.target.value))}
            min={0}
            className="mt-1"
          />
        </div>
      )}
    </div>
  );
};

export default WorkoutExerciseCard;

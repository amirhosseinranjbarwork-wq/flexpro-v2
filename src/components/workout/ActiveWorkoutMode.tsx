import React, { useState, useCallback } from 'react';
import { Check, Clock, Target } from 'lucide-react';
import { ActiveWorkoutModeProps, ActiveWorkoutSet, WorkoutLog, WorkoutSession } from '../../types/interactive';
import { useWorkoutLog } from '../../hooks/useWorkoutLog';

const ActiveWorkoutMode: React.FC<ActiveWorkoutModeProps> = ({
  workoutPlan,
  onSaveSession,
  onLogUpdate
}) => {
  const { saveLog, isLoading } = useWorkoutLog();
  const [workoutSets, setWorkoutSets] = useState<Record<string, ActiveWorkoutSet[]>>({});
  const [startTime] = useState(new Date());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_completedExercises, _setCompletedExercises] = useState<Set<string>>(new Set());

  // Initialize workout sets from plan
  React.useEffect(() => {
    const initialSets: Record<string, ActiveWorkoutSet[]> = {};

    Object.entries(workoutPlan || {}).forEach(([_day, exercises]) => {
      exercises?.forEach((exercise: any) => {
        const sets: ActiveWorkoutSet[] = [];
        for (let i = 1; i <= (exercise.sets || 1); i++) {
          sets.push({
            exerciseName: exercise.name,
            setNumber: i,
            plannedReps: exercise.reps || 0,
            plannedWeight: exercise.weight || 0,
            actualReps: undefined,
            actualWeight: undefined,
            rpe: undefined,
            completed: false,
            notes: ''
          });
        }
        initialSets[exercise.name] = sets;
      });
    });

    setWorkoutSets(initialSets);
  }, [workoutPlan]);

  const updateSet = useCallback((exerciseName: string, setNumber: number, updates: Partial<ActiveWorkoutSet>) => {
    setWorkoutSets(prev => ({
      ...prev,
      [exerciseName]: prev[exerciseName]?.map(set =>
        set.setNumber === setNumber ? { ...set, ...updates } : set
      ) || []
    }));
  }, []);

  const toggleSetComplete = useCallback((exerciseName: string, setNumber: number) => {
    updateSet(exerciseName, setNumber, { completed: !workoutSets[exerciseName]?.[setNumber - 1]?.completed });
  }, [workoutSets, updateSet]);

  const saveSet = useCallback(async (exerciseName: string, setNumber: number) => {
    const set = workoutSets[exerciseName]?.[setNumber - 1];
    if (!set || !set.actualReps) return;

    const logData: Omit<WorkoutLog, 'id' | 'created_at' | 'updated_at'> = {
      user_id: '', // Will be set by the hook
      workout_date: new Date().toISOString().split('T')[0],
      exercise_name: exerciseName,
      set_number: setNumber,
      reps_performed: set.actualReps,
      weight_used: set.actualWeight,
      rpe: set.rpe,
      notes: set.notes,
      completed: set.completed
    };

    try {
      await saveLog(logData);
      onLogUpdate([logData as WorkoutLog]);
    } catch (error) {
      console.error('Error saving workout log:', error);
    }
  }, [workoutSets, saveLog, onLogUpdate]);

  const finishWorkout = useCallback(async () => {
    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000); // minutes

    // Collect all completed sets
    const allLogs: WorkoutLog[] = [];
    Object.entries(workoutSets).forEach(([exerciseName, sets]) => {
      sets.forEach(set => {
        if (set.actualReps) {
          allLogs.push({
            id: '',
            user_id: '',
            workout_date: new Date().toISOString().split('T')[0],
            exercise_name: exerciseName,
            set_number: set.setNumber,
            reps_performed: set.actualReps,
            weight_used: set.actualWeight,
            rpe: set.rpe,
            notes: set.notes,
            completed: set.completed,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      });
    });

    const session: WorkoutSession = {
      date: new Date().toISOString().split('T')[0],
      exercises: allLogs,
      totalSets: Object.values(workoutSets).flat().length,
      completedSets: allLogs.length,
      duration
    };

    try {
      await onSaveSession(session);
    } catch (error) {
      console.error('Error saving workout session:', error);
    }
  }, [workoutSets, startTime, onSaveSession]);

  const getExerciseProgress = (exerciseName: string) => {
    const sets = workoutSets[exerciseName] || [];
    const completed = sets.filter(set => set.completed).length;
    return { completed, total: sets.length };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">تمرین فعال</h2>
          <p className="text-[var(--text-secondary)]">ورزش کنید و عملکرد خود را ثبت کنید</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{Math.floor((new Date().getTime() - startTime.getTime()) / 60000)} دقیقه</span>
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-8">
        {Object.entries(workoutSets).map(([exerciseName, sets]) => {
          const progress = getExerciseProgress(exerciseName);

          return (
            <div key={exerciseName} className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{exerciseName}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[var(--text-secondary)]">
                    {progress.completed}/{progress.total} ست
                  </span>
                  {progress.completed === progress.total && (
                    <Check className="text-green-500" size={16} />
                  )}
                </div>
              </div>

              {/* Sets */}
              <div className="space-y-3">
                {sets.map((set) => (
                  <div key={set.setNumber} className="flex items-center gap-4 p-3 bg-[var(--glass-bg)] rounded-lg">
                    <div className="flex items-center gap-2 min-w-[60px]">
                      <span className="text-sm font-medium text-[var(--text-secondary)]">
                        ست {set.setNumber}
                      </span>
                      <button
                        onClick={() => toggleSetComplete(exerciseName, set.setNumber)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                          set.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-[var(--glass-border)] hover:border-green-500'
                        }`}
                      >
                        {set.completed && <Check size={12} />}
                      </button>
                    </div>

                    <div className="flex items-center gap-3 flex-1">
                      {/* Planned */}
                      <div className="text-xs text-[var(--text-secondary)]">
                        برنامه: {set.plannedReps} تکرار
                        {set.plannedWeight && ` × ${set.plannedWeight}kg`}
                      </div>

                      {/* Actual Reps */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-[var(--text-secondary)]">تکرار:</label>
                        <input
                          type="number"
                          value={set.actualReps || ''}
                          onChange={(e) => updateSet(exerciseName, set.setNumber, {
                            actualReps: parseInt(e.target.value) || undefined
                          })}
                          className="w-16 px-2 py-1 text-sm bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded"
                          placeholder={set.plannedReps.toString()}
                          min="0"
                        />
                      </div>

                      {/* Actual Weight */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-[var(--text-secondary)]">وزن:</label>
                        <input
                          type="number"
                          value={set.actualWeight || ''}
                          onChange={(e) => updateSet(exerciseName, set.setNumber, {
                            actualWeight: parseFloat(e.target.value) || undefined
                          })}
                          className="w-16 px-2 py-1 text-sm bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded"
                          placeholder={set.plannedWeight?.toString() || '0'}
                          min="0"
                          step="0.5"
                        />
                        <span className="text-xs text-[var(--text-secondary)]">kg</span>
                      </div>

                      {/* RPE */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-[var(--text-secondary)]">RPE:</label>
                        <select
                          value={set.rpe || ''}
                          onChange={(e) => updateSet(exerciseName, set.setNumber, {
                            rpe: parseInt(e.target.value) || undefined
                          })}
                          className="w-16 px-2 py-1 text-sm bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded"
                        >
                          <option value="">-</option>
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(rpe => (
                            <option key={rpe} value={rpe}>{rpe}</option>
                          ))}
                        </select>
                      </div>

                      {/* Save Button */}
                      <button
                        onClick={() => saveSet(exerciseName, set.setNumber)}
                        disabled={!set.actualReps || isLoading}
                        className="px-3 py-1 text-xs bg-[var(--accent-color)] text-white rounded hover:bg-[var(--accent-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ذخیره
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div className="mt-4">
                <textarea
                  placeholder="یادداشت‌های این تمرین..."
                  className="w-full p-3 text-sm bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg resize-none"
                  rows={2}
                  onChange={(e) => {
                    // Update notes for all sets of this exercise
                    sets.forEach((_, index) => {
                      updateSet(exerciseName, index + 1, { notes: e.target.value });
                    });
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Finish Workout Button */}
      <div className="flex justify-center">
        <button
          onClick={finishWorkout}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center gap-2">
            <Target size={20} />
            <span>پایان تمرین</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ActiveWorkoutMode;
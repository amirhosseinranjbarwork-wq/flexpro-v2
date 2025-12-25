import React, { useState, useCallback } from 'react';
import { supabase, isSupabaseEnabled } from '../lib/supabaseClient';
import { WorkoutLog, WorkoutSession, UseWorkoutLogReturn } from '../types/interactive';
import { useAuth } from '../context/AuthContext';

// Local storage helpers
const STORAGE_KEY = 'flexpro_workout_logs';

function getLocalLogs(userId: string): WorkoutLog[] {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLocalLogs(userId: string, logs: WorkoutLog[]): void {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(logs));
  } catch (error) {
    console.warn('Failed to save logs to localStorage:', error);
  }
}

export function useWorkoutLog(): UseWorkoutLogReturn {
  const { user } = useAuth();
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save workout log
  const saveLog = useCallback(async (logData: Omit<WorkoutLog, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) return;

    const completeLogData = {
      ...logData,
      user_id: user.id
    };

    // Use local storage if Supabase is not enabled
    if (!isSupabaseEnabled || !supabase) {
      const localLogs = getLocalLogs(user.id);
      const newLog: WorkoutLog = {
        ...completeLogData,
        id: `log-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const existingIndex = localLogs.findIndex(log =>
        log.workout_date === newLog.workout_date &&
        log.exercise_name === newLog.exercise_name &&
        log.set_number === newLog.set_number
      );

      if (existingIndex >= 0) {
        localLogs[existingIndex] = newLog;
      } else {
        localLogs.push(newLog);
      }

      saveLocalLogs(user.id, localLogs);
      setLogs(localLogs);
      return newLog;
    }

    try {
      const { data, error: saveError } = await supabase
        .from('workout_logs')
        .upsert(completeLogData, {
          onConflict: 'user_id,workout_date,exercise_name,set_number'
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Update local state
      setLogs(prev => {
        const existingIndex = prev.findIndex(log =>
          log.workout_date === data.workout_date &&
          log.exercise_name === data.exercise_name &&
          log.set_number === data.set_number
        );

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = data;
          return updated;
        } else {
          return [...prev, data];
        }
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در ذخیره لاگ تمرین';
      setError(errorMessage);
      console.error('Error saving workout log:', err);
      throw err;
    }
  }, [user?.id]);

  // Save workout session
  const saveSession = useCallback(async (session: WorkoutSession) => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Save all logs for this session
      const logPromises = session.exercises.map(log =>
        supabase
          .from('workout_logs')
          .upsert({
            ...log,
            user_id: user.id
          }, {
            onConflict: 'user_id,workout_date,exercise_name,set_number'
          })
      );

      await Promise.all(logPromises);

      // Update local state
      setLogs(prev => {
        const updated = [...prev];
        session.exercises.forEach(newLog => {
          const existingIndex = updated.findIndex(log =>
            log.workout_date === newLog.workout_date &&
            log.exercise_name === newLog.exercise_name &&
            log.set_number === newLog.set_number
          );

          if (existingIndex >= 0) {
            updated[existingIndex] = newLog;
          } else {
            updated.push(newLog);
          }
        });
        return updated;
      });

      // Add session to sessions list
      setSessions(prev => {
        const existingIndex = prev.findIndex(s => s.date === session.date);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = session;
          return updated;
        } else {
          return [...prev, session];
        }
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در ذخیره جلسه تمرین';
      setError(errorMessage);
      console.error('Error saving workout session:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Get logs for specific date
  const getLogsForDate = useCallback((date: string): WorkoutLog[] => {
    return logs.filter(log => log.workout_date === date);
  }, [logs]);

  // Get logs for specific exercise
  const getLogsForExercise = useCallback((exerciseName: string): WorkoutLog[] => {
    return logs.filter(log => log.exercise_name === exerciseName);
  }, [logs]);

  // Load logs for user
  const loadLogs = useCallback(async (startDate?: string, endDate?: string) => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      let data: WorkoutLog[] = [];

      // Use local storage if Supabase is not enabled
      if (!isSupabaseEnabled || !supabase) {
        data = getLocalLogs(user.id);
      } else {
        let query = supabase
          .from('workout_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('workout_date', { ascending: false })
          .order('exercise_name', { ascending: true })
          .order('set_number', { ascending: true });

        if (startDate) {
          query = query.gte('workout_date', startDate);
        }

        if (endDate) {
          query = query.lte('workout_date', endDate);
        }

        const { data: fetchedData, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        data = fetchedData || [];
      }

      // Filter by date range if needed
      if (startDate || endDate) {
        data = data.filter(log => {
          if (startDate && log.workout_date < startDate) return false;
          if (endDate && log.workout_date > endDate) return false;
          return true;
        });
      }

      setLogs(data);

      // Group logs into sessions
      const sessionMap = new Map<string, WorkoutLog[]>();

      data.forEach(log => {
        if (!sessionMap.has(log.workout_date)) {
          sessionMap.set(log.workout_date, []);
        }
        sessionMap.get(log.workout_date)!.push(log);
      });

      const sessionsArray: WorkoutSession[] = Array.from(sessionMap.entries())
        .map(([date, exercises]) => ({
          date,
          exercises,
          totalSets: exercises.length,
          completedSets: exercises.filter(e => e.completed).length,
          duration: undefined // Could be calculated from timestamps if available
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setSessions(sessionsArray);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در بارگذاری لاگ‌های تمرین';
      setError(errorMessage);
      console.error('Error loading workout logs:', err);
      // Fallback to local storage on error
      const localLogs = getLocalLogs(user.id);
      setLogs(localLogs);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Load logs on mount
  React.useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return {
    logs,
    sessions,
    saveLog,
    saveSession,
    getLogsForDate,
    getLogsForExercise,
    isLoading,
    error
  };
}
/**
 * WORKOUT ANALYTICS FOOTER - Live Analytics Display
 * Shows volume, duration, muscle balance
 */

import React from 'react';
import { useWorkoutStore } from '../../store/workoutStore';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import {
  BarChart3,
  Clock,
  TrendingUp,
  Target,
  Zap,
  Activity
} from 'lucide-react';

interface WorkoutAnalyticsFooterProps {
  dayId: string;
}

export const WorkoutAnalyticsFooter: React.FC<WorkoutAnalyticsFooterProps> = ({
  dayId
}) => {
  const { getWorkoutAnalytics } = useWorkoutStore();
  const analytics = getWorkoutAnalytics(dayId);

  if (analytics.totalExercises === 0) {
    return null;
  }

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getIntensityColor = (score: number): string => {
    if (score >= 8.5) return 'text-red-600';
    if (score >= 7) return 'text-orange-600';
    if (score >= 5.5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getIntensityLabel = (score: number): string => {
    if (score >= 8.5) return 'Very High';
    if (score >= 7) return 'High';
    if (score >= 5.5) return 'Moderate';
    return 'Low';
  };

  return (
    <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 shadow-lg">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Exercises */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Exercises</p>
            <p className="text-lg font-bold">{analytics.totalExercises}</p>
          </div>
        </div>

        {/* Total Sets */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Total Sets</p>
            <p className="text-lg font-bold">{analytics.totalSets}</p>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Volume</p>
            <p className="text-lg font-bold">
              {analytics.totalVolume > 0 
                ? `${(analytics.totalVolume / 1000).toFixed(1)}k` 
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Duration</p>
            <p className="text-lg font-bold">{formatDuration(analytics.estimatedDuration)}</p>
          </div>
        </div>

        {/* Intensity */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Intensity</p>
            <p className={`text-lg font-bold ${getIntensityColor(analytics.intensityScore)}`}>
              {getIntensityLabel(analytics.intensityScore)}
            </p>
          </div>
        </div>
      </div>

      {/* Muscle Balance */}
      {analytics.muscleBalance.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-sm">Muscle Balance</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {analytics.muscleBalance.slice(0, 6).map((muscle) => (
              <div key={muscle.muscleGroup} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium capitalize">
                    {muscle.muscleGroup.replace('_', ' ')}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {muscle.exerciseCount}
                  </Badge>
                </div>
                <Progress value={muscle.percentage} className="h-2" />
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {muscle.volumeLoad} sets ({muscle.percentage.toFixed(0)}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutAnalyticsFooter;

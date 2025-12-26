/**
 * WORKOUT DAY SELECTOR - Simple Day Selection Component
 * For selecting active workout day
 */

import React from 'react';
import { useWorkoutStore } from '../../store/workoutStore';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Plus } from 'lucide-react';

export const WorkoutDaySelector: React.FC = () => {
  const { currentProgram, activeDayId, setActiveDay, addDay } = useWorkoutStore();

  if (!currentProgram) {
    return null;
  }

  const handleAddDay = () => {
    const dayNumber = currentProgram.weeklySchedule.length + 1;
    addDay(`Day ${dayNumber}`, `Training Day ${dayNumber}`);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {currentProgram.weeklySchedule.map(day => (
        <Button
          key={day.id}
          variant={activeDayId === day.id ? 'default' : 'outline'}
          onClick={() => setActiveDay(day.id)}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Calendar className="w-4 h-4" />
          {day.name}
          <Badge variant="secondary" className="ml-1">
            {day.exercises.length}
          </Badge>
        </Button>
      ))}
      <Button
        variant="outline"
        onClick={handleAddDay}
        className="flex items-center gap-2 whitespace-nowrap"
      >
        <Plus className="w-4 h-4" />
        Add Day
      </Button>
    </div>
  );
};

export default WorkoutDaySelector;

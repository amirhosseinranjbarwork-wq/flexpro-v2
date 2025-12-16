import React, { memo } from 'react';
import type { User } from '../../types/index';

interface WorkoutDayTabsProps {
  day: number;
  setDay: (day: number) => void;
  activeUser: User;
}

const WorkoutDayTabs: React.FC<WorkoutDayTabsProps> = memo(({ day, setDay, activeUser }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 flex-1">
      {[1, 2, 3, 4, 5, 6, 7].map(d => (
        <button 
          key={d} 
          onClick={() => setDay(d)} 
          className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
            day === d 
              ? 'text-white shadow-lg scale-105' 
              : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/10 hover:text-[var(--accent-color)] border border-[var(--glass-border)]'
          }`}
          style={day === d ? { background: `linear-gradient(135deg, var(--accent-color), var(--accent-secondary))`, boxShadow: `0 10px 30px var(--accent-color)/30` } : {}}
          aria-label={`جلسه ${d}`}
          type="button"
        >
          <span className="flex items-center gap-2">
            <span>جلسه {d}</span>
            {activeUser.plans?.workouts?.[d]?.length > 0 && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                day === d ? 'bg-white/30 text-white' : 'bg-[var(--accent-color)]/20 text-[var(--accent-color)]'
              }`}>
                {activeUser.plans.workouts[d].length}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
});

WorkoutDayTabs.displayName = 'WorkoutDayTabs';
export default WorkoutDayTabs;

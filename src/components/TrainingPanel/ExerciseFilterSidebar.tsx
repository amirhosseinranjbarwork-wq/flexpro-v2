/**
 * EXERCISE FILTER SIDEBAR
 * Advanced filtering with visual body map
 */

import React, { useState } from 'react';
import { useWorkoutStore } from '../../store/workoutStore';
import {
  ExerciseCategory,
  MuscleGroup,
  Equipment,
  DifficultyLevel
} from '../../types/ultimate-training';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Badge from '../ui/Badge';
import { ScrollArea } from '../ui/scroll-area';
import { VisualBodyMap } from './VisualBodyMap';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronRight,
  Target,
  Dumbbell,
  Activity
} from 'lucide-react';

export const ExerciseFilterSidebar: React.FC = () => {
  const { filters, setFilters, resetFilters, isSidebarCollapsed } = useWorkoutStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    bodyMap: true,
    category: true,
    equipment: false,
    movement: false,
    difficulty: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleMuscleClick = (muscle: MuscleGroup) => {
    const currentMuscles = filters.muscleGroups || [];
    const newMuscles = currentMuscles.includes(muscle)
      ? currentMuscles.filter(m => m !== muscle)
      : [...currentMuscles, muscle];
    setFilters({ ...filters, muscleGroups: newMuscles });
  };

  const handleCategoryToggle = (category: ExerciseCategory) => {
    const current = filters.categories || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    setFilters({ ...filters, categories: updated });
  };

  const handleEquipmentToggle = (equipment: Equipment) => {
    const current = filters.equipment || [];
    const updated = current.includes(equipment)
      ? current.filter(e => e !== equipment)
      : [...current, equipment];
    setFilters({ ...filters, equipment: updated });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, searchQuery: query });
  };

  const clearFilters = () => {
    setSearchQuery('');
    resetFilters();
  };

  const activeFilterCount = 
    (filters.categories?.length || 0) +
    (filters.muscleGroups?.length || 0) +
    (filters.equipment?.length || 0) +
    (filters.movementPatterns?.length || 0) +
    (filters.difficulty?.length || 0) +
    (filters.searchQuery ? 1 : 0);

  if (isSidebarCollapsed) {
    return (
      <div className="w-16 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col items-center py-4 gap-4">
        <Button variant="ghost" size="icon">
          <Filter className="w-5 h-5" />
        </Button>
        {activeFilterCount > 0 && (
          <Badge variant="destructive" className="rounded-full">
            {activeFilterCount}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-lg">Filters</h2>
          </div>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Body Map Section */}
          <div>
            <button
              onClick={() => toggleSection('bodyMap')}
              className="flex items-center justify-between w-full mb-3 group"
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold">Target Muscles</h3>
              </div>
              {expandedSections.bodyMap ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {expandedSections.bodyMap && (
              <div>
                <VisualBodyMap
                  selectedMuscles={filters.muscleGroups || []}
                  onMuscleClick={handleMuscleClick}
                />
                {filters.muscleGroups && filters.muscleGroups.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {filters.muscleGroups.map(muscle => (
                      <Badge
                        key={muscle}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100 dark:hover:bg-red-900"
                        onClick={() => handleMuscleClick(muscle)}
                      >
                        {muscle.replace('_', ' ')}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category Section */}
          <div>
            <button
              onClick={() => toggleSection('category')}
              className="flex items-center justify-between w-full mb-3 group"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <h3 className="font-semibold">Category</h3>
              </div>
              {expandedSections.category ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {expandedSections.category && (
              <div className="space-y-2">
                {Object.values(ExerciseCategory).map(category => (
                  <label
                    key={category}
                    className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-md transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories?.includes(category) || false}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm capitalize">
                      {category.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Equipment Section */}
          <div>
            <button
              onClick={() => toggleSection('equipment')}
              className="flex items-center justify-between w-full mb-3 group"
            >
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-green-600" />
                <h3 className="font-semibold">Equipment</h3>
              </div>
              {expandedSections.equipment ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {expandedSections.equipment && (
              <div className="grid grid-cols-2 gap-2">
                {Object.values(Equipment).map(equipment => (
                  <label
                    key={equipment}
                    className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-md transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.equipment?.includes(equipment) || false}
                      onChange={() => handleEquipmentToggle(equipment)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs capitalize">
                      {equipment.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Difficulty */}
          <div>
            <Label className="mb-2 block">Difficulty</Label>
            <div className="flex flex-wrap gap-2">
              {Object.values(DifficultyLevel).map(level => (
                <Badge
                  key={level}
                  variant={filters.difficulty?.includes(level) ? 'primary' : 'default'}
                  className="cursor-pointer"
                  onClick={() => {
                    const current = filters.difficulty || [];
                    const updated = current.includes(level)
                      ? current.filter(d => d !== level)
                      : [...current, level];
                    setFilters({ ...filters, difficulty: updated });
                  }}
                >
                  {level}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ExerciseFilterSidebar;

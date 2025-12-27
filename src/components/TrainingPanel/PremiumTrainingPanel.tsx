/**
 * PREMIUM TRAINING PANEL - Professional Exercise Prescription Interface
 * تب‌های مختلف: مقاومتی، اصلاحی، کاردیو، پلایومتریک، کششی، قدرتی، المپیک
 */

import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { useWorkoutStore } from '../../store/workoutStore';
import { Exercise, ExerciseCategory } from '../../types/ultimate-training';
import { ExerciseLibrary } from './ExerciseLibrary';
import { ExerciseCard } from './ExerciseCard';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { 
  Dumbbell, 
  Heart, 
  Shield, 
  Zap, 
  Wind,
  TrendingUp,
  Target,
  Save,
  Download,
  Plus,
  Settings,
  Sparkles
} from 'lucide-react';
import ResistanceTrainingTab from './tabs/ResistanceTrainingTab';
import CorrectiveTrainingTab from './tabs/CorrectiveTrainingTab';
import CardioTrainingTab from './tabs/CardioTrainingTab';
import PlyometricTrainingTab from './tabs/PlyometricTrainingTab';
import StretchingTrainingTab from './tabs/StretchingTrainingTab';
import PowerliftingTrainingTab from './tabs/PowerliftingTrainingTab';
import OlympicTrainingTab from './tabs/OlympicTrainingTab';

interface PremiumTrainingPanelProps {
  activeUser?: any;
  onUpdateUser?: (user: any) => void;
}

export const PremiumTrainingPanel: React.FC<PremiumTrainingPanelProps> = ({
  activeUser,
  onUpdateUser
}) => {
  const {
    currentProgram,
    activeDayId,
    isLibraryOpen,
    toggleLibrary,
    createProgram,
    addDay
  } = useWorkoutStore();

  const [activeTab, setActiveTab] = useState<ExerciseCategory>(ExerciseCategory.RESISTANCE);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [isLibraryVisible, setIsLibraryVisible] = useState(true);

  // Initialize program if none exists
  useEffect(() => {
    if (!currentProgram) {
      createProgram('برنامه تمرینی', 'hypertrophy');
      addDay('روز 1', 'تمرین بالاتنه');
    }
  }, [currentProgram, createProgram, addDay]);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const exerciseId = event.active.id as string;
    const exercise = useWorkoutStore.getState().getFilteredExercises()
      .find(ex => ex.id === exerciseId);
    if (exercise) {
      setActiveExercise(exercise);
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && activeDayId) {
      const exerciseId = active.id as string;
      const exercise = useWorkoutStore.getState().getFilteredExercises()
        .find(ex => ex.id === exerciseId);
      
      if (exercise) {
        useWorkoutStore.getState().addExerciseToDay(activeDayId, exercise);
      }
    }
    
    setActiveExercise(null);
  };

  const getTabIcon = (category: ExerciseCategory) => {
    switch (category) {
      case ExerciseCategory.RESISTANCE:
        return <Dumbbell className="w-4 h-4" />;
      case ExerciseCategory.CORRECTIVE:
        return <Shield className="w-4 h-4" />;
      case ExerciseCategory.CARDIO:
        return <Heart className="w-4 h-4" />;
      case ExerciseCategory.PLYOMETRIC:
        return <Zap className="w-4 h-4" />;
      case ExerciseCategory.STRETCHING:
        return <Wind className="w-4 h-4" />;
      case ExerciseCategory.POWERLIFTING:
        return <TrendingUp className="w-4 h-4" />;
      case ExerciseCategory.OLYMPIC:
        return <Target className="w-4 h-4" />;
      default:
        return <Dumbbell className="w-4 h-4" />;
    }
  };

  const getTabLabel = (category: ExerciseCategory) => {
    switch (category) {
      case ExerciseCategory.RESISTANCE:
        return 'مقاومتی';
      case ExerciseCategory.CORRECTIVE:
        return 'اصلاحی';
      case ExerciseCategory.CARDIO:
        return 'کاردیو';
      case ExerciseCategory.PLYOMETRIC:
        return 'پلایومتریک';
      case ExerciseCategory.STRETCHING:
        return 'کششی';
      case ExerciseCategory.POWERLIFTING:
        return 'قدرتی';
      case ExerciseCategory.OLYMPIC:
        return 'المپیک';
      default:
        return 'مقاومتی';
    }
  };

  if (!currentProgram) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">برنامه تمرینی یافت نشد</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">یک برنامه تمرینی جدید ایجاد کنید</p>
          <Button 
            onClick={() => {
              createProgram('برنامه تمرینی', 'hypertrophy');
              addDay('روز 1', 'تمرین بالاتنه');
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 ml-2" />
            ایجاد برنامه جدید
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Premium Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {currentProgram.name}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  پنل حرفه‌ای طراحی تمرین
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsLibraryVisible(!isLibraryVisible)}
              >
                {isLibraryVisible ? 'مخفی کردن' : 'نمایش'} کتابخانه
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 ml-2" />
                خروجی
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="w-4 h-4 ml-2" />
                ذخیره
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Exercise Library Sidebar */}
          {isLibraryVisible && (
            <div className="w-96 border-l border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm flex flex-col shadow-xl">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  کتابخانه حرکات
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  حرکات را بکشید و رها کنید
                </p>
              </div>
              <ExerciseLibrary categoryFilter={activeTab} />
            </div>
          )}

          {/* Training Tabs Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ExerciseCategory)}>
                <TabsList className="grid grid-cols-7 w-full bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-lg">
                  <TabsTrigger 
                    value={ExerciseCategory.RESISTANCE}
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                  >
                    {getTabIcon(ExerciseCategory.RESISTANCE)}
                    {getTabLabel(ExerciseCategory.RESISTANCE)}
                  </TabsTrigger>
                  <TabsTrigger 
                    value={ExerciseCategory.CORRECTIVE}
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-teal-600 data-[state=active]:text-white"
                  >
                    {getTabIcon(ExerciseCategory.CORRECTIVE)}
                    {getTabLabel(ExerciseCategory.CORRECTIVE)}
                  </TabsTrigger>
                  <TabsTrigger 
                    value={ExerciseCategory.CARDIO}
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
                  >
                    {getTabIcon(ExerciseCategory.CARDIO)}
                    {getTabLabel(ExerciseCategory.CARDIO)}
                  </TabsTrigger>
                  <TabsTrigger 
                    value={ExerciseCategory.PLYOMETRIC}
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-orange-600 data-[state=active]:text-white"
                  >
                    {getTabIcon(ExerciseCategory.PLYOMETRIC)}
                    {getTabLabel(ExerciseCategory.PLYOMETRIC)}
                  </TabsTrigger>
                  <TabsTrigger 
                    value={ExerciseCategory.STRETCHING}
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-green-600 data-[state=active]:text-white"
                  >
                    {getTabIcon(ExerciseCategory.STRETCHING)}
                    {getTabLabel(ExerciseCategory.STRETCHING)}
                  </TabsTrigger>
                  <TabsTrigger 
                    value={ExerciseCategory.POWERLIFTING}
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                  >
                    {getTabIcon(ExerciseCategory.POWERLIFTING)}
                    {getTabLabel(ExerciseCategory.POWERLIFTING)}
                  </TabsTrigger>
                  <TabsTrigger 
                    value={ExerciseCategory.OLYMPIC}
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-yellow-600 data-[state=active]:text-white"
                  >
                    {getTabIcon(ExerciseCategory.OLYMPIC)}
                    {getTabLabel(ExerciseCategory.OLYMPIC)}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto p-6">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ExerciseCategory)}>
                <TabsContent value={ExerciseCategory.RESISTANCE} className="mt-0">
                  <ResistanceTrainingTab activeUser={activeUser} onUpdateUser={onUpdateUser} />
                </TabsContent>
                <TabsContent value={ExerciseCategory.CORRECTIVE} className="mt-0">
                  <CorrectiveTrainingTab activeUser={activeUser} onUpdateUser={onUpdateUser} />
                </TabsContent>
                <TabsContent value={ExerciseCategory.CARDIO} className="mt-0">
                  <CardioTrainingTab activeUser={activeUser} onUpdateUser={onUpdateUser} />
                </TabsContent>
                <TabsContent value={ExerciseCategory.PLYOMETRIC} className="mt-0">
                  <PlyometricTrainingTab activeUser={activeUser} onUpdateUser={onUpdateUser} />
                </TabsContent>
                <TabsContent value={ExerciseCategory.STRETCHING} className="mt-0">
                  <StretchingTrainingTab activeUser={activeUser} onUpdateUser={onUpdateUser} />
                </TabsContent>
                <TabsContent value={ExerciseCategory.POWERLIFTING} className="mt-0">
                  <PowerliftingTrainingTab activeUser={activeUser} onUpdateUser={onUpdateUser} />
                </TabsContent>
                <TabsContent value={ExerciseCategory.OLYMPIC} className="mt-0">
                  <OlympicTrainingTab activeUser={activeUser} onUpdateUser={onUpdateUser} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeExercise && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-4 border-2 border-blue-500 opacity-90 transform rotate-2">
              <ExerciseCard exercise={activeExercise} isDragging />
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default PremiumTrainingPanel;


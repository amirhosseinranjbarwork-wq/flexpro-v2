/**
 * EXERCISE PARAMETER CONFIGURATOR
 * Complete parameter configuration system for all exercise types
 * with training systems, tempo, RPE, and advanced options
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Dumbbell, 
  Heart, 
  Zap, 
  Target,
  Plus,
  Minus,
  Info,
  Timer,
  Gauge
} from 'lucide-react';
import type {
  WorkoutSet,
  ResistanceWorkoutSet,
  CardioWorkoutSet,
  PlyometricWorkoutSet,
  CorrectiveWorkoutSet,
  ExerciseType,
  TrainingSystemType,
  CardioMethod,
  PlyometricIntensity,
  CorrectiveExerciseType,
  RPE,
  RIR,
  HeartRateZone,
  MuscleGroup
} from '../../types/training';
import {
  RPE_DESCRIPTIONS,
  RIR_DESCRIPTIONS,
  CARDIO_METHOD_INFO,
  PLYOMETRIC_INTENSITY_INFO,
  CORRECTIVE_TYPE_INFO,
  generateWorkoutSetId
} from '../../types/training';

interface ExerciseParameterConfigProps {
  exerciseType: ExerciseType;
  exerciseName: string;
  primaryMuscle: MuscleGroup;
  onSave: (set: WorkoutSet) => void;
  onCancel: () => void;
}

export const ExerciseParameterConfig: React.FC<ExerciseParameterConfigProps> = ({
  exerciseType,
  exerciseName,
  primaryMuscle,
  onSave,
  onCancel
}) => {
  // Render appropriate form based on exercise type
  switch (exerciseType) {
    case 'resistance':
      return (
        <ResistanceParameterForm
          exerciseName={exerciseName}
          primaryMuscle={primaryMuscle}
          onSave={onSave}
          onCancel={onCancel}
        />
      );
    case 'cardio':
      return (
        <CardioParameterForm
          exerciseName={exerciseName}
          onSave={onSave}
          onCancel={onCancel}
        />
      );
    case 'plyometric':
      return (
        <PlyometricParameterForm
          exerciseName={exerciseName}
          primaryMuscle={primaryMuscle}
          onSave={onSave}
          onCancel={onCancel}
        />
      );
    case 'corrective':
      return (
        <CorrectiveParameterForm
          exerciseName={exerciseName}
          primaryMuscle={primaryMuscle}
          onSave={onSave}
          onCancel={onCancel}
        />
      );
    default:
      return null;
  }
};

// ==================== RESISTANCE PARAMETER FORM ====================
interface ResistanceParameterFormProps {
  exerciseName: string;
  primaryMuscle: MuscleGroup;
  onSave: (set: ResistanceWorkoutSet) => void;
  onCancel: () => void;
}

const ResistanceParameterForm: React.FC<ResistanceParameterFormProps> = ({
  exerciseName,
  primaryMuscle,
  onSave,
  onCancel
}) => {
  const [trainingSystem, setTrainingSystem] = useState<TrainingSystemType>('straight_set');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [restSeconds, setRestSeconds] = useState(90);
  const [rpe, setRpe] = useState<RPE | undefined>(undefined);
  const [rir, setRir] = useState<RIR | undefined>(undefined);
  const [tempo, setTempo] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced parameters
  const [dropCount, setDropCount] = useState<number | undefined>(undefined);
  const [dropPercentage, setDropPercentage] = useState<number | undefined>(undefined);
  const [restPauseSeconds, setRestPauseSeconds] = useState<number | undefined>(undefined);
  const [clusterReps, setClusterReps] = useState<number | undefined>(undefined);
  const [clusterRest, setClusterRest] = useState<number | undefined>(undefined);

  const trainingSystems: { value: TrainingSystemType; label: string; description: string }[] = [
    { value: 'straight_set', label: 'ست معمولی', description: 'ست‌های استاندارد با استراحت' },
    { value: 'superset', label: 'سوپرست', description: '۲ حرکت پشت سر هم' },
    { value: 'drop_set', label: 'دراپ ست', description: 'کاهش تدریجی وزنه' },
    { value: 'rest_pause', label: 'رست-پاز', description: 'استراحت کوتاه در ست' },
    { value: 'cluster_set', label: 'کلاستر ست', description: 'مینی‌ست‌ها با استراحت' },
    { value: 'pyramid', label: 'هرمی', description: 'افزایش تدریجی وزنه' },
    { value: 'tempo', label: 'تمپو', description: 'کنترل سرعت اجرا' },
    { value: '21s', label: '21s', description: '۷+۷+۷ تکرار جزئی' },
  ];

  const handleSave = () => {
    const set: ResistanceWorkoutSet = {
      id: generateWorkoutSetId(),
      type: 'resistance',
      order_index: 0,
      exercise_name: exerciseName,
      target_muscle: primaryMuscle,
      training_system: trainingSystem,
      sets,
      reps,
      weight,
      rest_seconds: restSeconds,
      rpe,
      rir,
      tempo,
      notes,
      drop_count: dropCount,
      drop_percentage: dropPercentage,
      rest_pause_seconds: restPauseSeconds,
      cluster_reps: clusterReps,
      cluster_rest: clusterRest,
    };
    onSave(set);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Dumbbell className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              پارامترهای تمرین مقاومتی
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {exerciseName}
            </p>
          </div>
        </div>
      </div>

      {/* Training System */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          سیستم تمرینی
        </label>
        <div className="grid grid-cols-2 gap-2">
          {trainingSystems.map(system => (
            <button
              key={system.value}
              onClick={() => setTrainingSystem(system.value)}
              className={`p-3 text-right rounded-lg border-2 transition-all ${
                trainingSystem === system.value
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
              }`}
            >
              <div className="font-semibold text-sm">{system.label}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{system.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sets and Reps */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            تعداد ست
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSets(Math.max(1, sets - 1))}
              className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={sets}
              onChange={e => setSets(parseInt(e.target.value) || 1)}
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center"
              min="1"
              max="10"
            />
            <button
              onClick={() => setSets(Math.min(10, sets + 1))}
              className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            تکرار
          </label>
          <input
            type="text"
            value={reps}
            onChange={e => setReps(e.target.value)}
            placeholder="مثلاً: 8-12"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            وزنه (کیلوگرم)
          </label>
          <input
            type="number"
            value={weight || ''}
            onChange={e => setWeight(parseInt(e.target.value) || undefined)}
            placeholder="اختیاری"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center"
          />
        </div>
      </div>

      {/* Rest Time */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          استراحت بین ست‌ها (ثانیه)
        </label>
        <input
          type="range"
          value={restSeconds}
          onChange={e => setRestSeconds(parseInt(e.target.value))}
          min="15"
          max="300"
          step="15"
          className="w-full"
        />
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mt-1">
          <span>15 ثانیه</span>
          <span className="font-semibold text-blue-600">{restSeconds} ثانیه</span>
          <span>5 دقیقه</span>
        </div>
      </div>

      {/* RPE and RIR */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            RPE (شدت تمرین)
          </label>
          <select
            value={rpe || ''}
            onChange={e => setRpe(e.target.value ? parseInt(e.target.value) as RPE : undefined)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
          >
            <option value="">انتخاب کنید</option>
            {Object.entries(RPE_DESCRIPTIONS).map(([value, desc]) => (
              <option key={value} value={value}>
                RPE {value} - {desc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            RIR (تکرار مانده)
          </label>
          <select
            value={rir || ''}
            onChange={e => setRir(e.target.value ? parseInt(e.target.value) as RIR : undefined)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
          >
            <option value="">انتخاب کنید</option>
            {Object.entries(RIR_DESCRIPTIONS).map(([value, desc]) => (
              <option key={value} value={value}>
                RIR {value} - {desc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Options */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-4"
      >
        <Settings className="w-4 h-4" />
        {showAdvanced ? 'پنهان کردن' : 'نمایش'} تنظیمات پیشرفته
      </button>

      {showAdvanced && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="space-y-4 mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg"
        >
          {/* Tempo */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              تمپو (Eccentric-Pause-Concentric-Pause)
            </label>
            <input
              type="text"
              value={tempo || ''}
              onChange={e => setTempo(e.target.value || undefined)}
              placeholder="مثلاً: 3-1-2-0"
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
          </div>

          {/* Drop Set Parameters */}
          {trainingSystem === 'drop_set' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  تعداد دراپ
                </label>
                <input
                  type="number"
                  value={dropCount || ''}
                  onChange={e => setDropCount(parseInt(e.target.value) || undefined)}
                  min="1"
                  max="5"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  درصد کاهش وزنه
                </label>
                <input
                  type="number"
                  value={dropPercentage || ''}
                  onChange={e => setDropPercentage(parseInt(e.target.value) || undefined)}
                  min="10"
                  max="50"
                  step="5"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
            </>
          )}

          {/* Rest-Pause Parameters */}
          {trainingSystem === 'rest_pause' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                مدت استراحت در ست (ثانیه)
              </label>
              <input
                type="number"
                value={restPauseSeconds || ''}
                onChange={e => setRestPauseSeconds(parseInt(e.target.value) || undefined)}
                min="10"
                max="30"
                step="5"
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
          )}

          {/* Cluster Set Parameters */}
          {trainingSystem === 'cluster_set' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  تکرار در هر مینی‌ست
                </label>
                <input
                  type="number"
                  value={clusterReps || ''}
                  onChange={e => setClusterReps(parseInt(e.target.value) || undefined)}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  استراحت بین مینی‌ست‌ها (ثانیه)
                </label>
                <input
                  type="number"
                  value={clusterRest || ''}
                  onChange={e => setClusterRest(parseInt(e.target.value) || undefined)}
                  min="5"
                  max="30"
                  step="5"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          یادداشت
        </label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="توضیحات اضافی..."
          rows={3}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          ذخیره حرکت
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-semibold"
        >
          انصراف
        </button>
      </div>
    </div>
  );
};

// Placeholder forms for other types (to be implemented similarly)
const CardioParameterForm: React.FC<any> = ({ exerciseName, onSave, onCancel }) => {
  // Similar implementation for cardio parameters
  return <div>Cardio Form - To be implemented</div>;
};

const PlyometricParameterForm: React.FC<any> = ({ exerciseName, primaryMuscle, onSave, onCancel }) => {
  // Similar implementation for plyometric parameters
  return <div>Plyometric Form - To be implemented</div>;
};

const CorrectiveParameterForm: React.FC<any> = ({ exerciseName, primaryMuscle, onSave, onCancel }) => {
  // Similar implementation for corrective parameters
  return <div>Corrective Form - To be implemented</div>;
};

export default ExerciseParameterConfig;

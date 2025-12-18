import React from 'react';
import { Check, UserCheck, FileText, Lock } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps = 3
}) => {
  const steps: Step[] = [
    {
      id: 1,
      title: 'انتخاب نقش',
      description: 'انتخاب نوع حساب کاربری',
      icon: <UserCheck size={20} />
    },
    {
      id: 2,
      title: 'اطلاعات شخصی',
      description: 'نام کامل و نام کاربری',
      icon: <FileText size={20} />
    },
    {
      id: 3,
      title: 'رمز عبور',
      description: 'تنظیم رمز عبور امن',
      icon: <Lock size={20} />
    }
  ];

  const getStepStatus = (stepId: number): 'completed' | 'current' | 'pending' => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const getProgressPercentage = (): number => {
    return ((currentStep - 1) / (totalSteps - 1)) * 100;
  };

  return (
    <div className="w-full mb-8">
      {/* Progress Line */}
      <div className="relative mb-8">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-secondary)] transition-all duration-700 ease-out rounded-full"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const isLastStep = index === steps.length - 1;

            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`
                    relative w-10 h-10 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300 ease-in-out transform
                    ${status === 'completed'
                      ? 'bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-secondary)] border-transparent text-white shadow-lg scale-110'
                      : status === 'current'
                      ? 'border-[var(--accent-color)] bg-white dark:bg-gray-800 text-[var(--accent-color)] shadow-md scale-110 animate-pulse'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400'
                    }
                  `}
                >
                  {status === 'completed' ? (
                    <Check size={16} className="animate-in zoom-in duration-200" />
                  ) : (
                    <div className={status === 'current' ? 'animate-pulse' : ''}>
                      {step.icon}
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div className="mt-3 text-center max-w-[120px]">
                  <h3 className={`
                    text-sm font-semibold transition-colors duration-300
                    ${status === 'completed'
                      ? 'text-[var(--accent-color)]'
                      : status === 'current'
                      ? 'text-[var(--text-primary)]'
                      : 'text-gray-400'
                    }
                  `}>
                    {step.title}
                  </h3>
                  <p className={`
                    text-xs mt-1 transition-colors duration-300
                    ${status === 'completed' || status === 'current'
                      ? 'text-[var(--text-secondary)]'
                      : 'text-gray-400'
                    }
                  `}>
                    {step.description}
                  </p>
                </div>

                {/* Connection Line (except for last step) */}
                {!isLastStep && (
                  <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
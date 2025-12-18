import React from 'react';
import { ChevronLeft, ChevronRight, Loader2, Check } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  isLoading?: boolean;
  canProceed?: boolean;
  isLastStep?: boolean;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onComplete,
  isLoading = false,
  canProceed = false,
  isLastStep = false
}) => {
  const isFirstStep = currentStep === 1;
  const showComplete = isLastStep && canProceed;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
      {/* Previous Button */}
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstStep || isLoading}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200
          ${isFirstStep
            ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400'
            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-[var(--text-primary)] hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 active:scale-95'
          }
        `}
        aria-label="مرحله قبلی"
      >
        <ChevronRight size={16} />
        <span>قبلی</span>
      </button>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <span>مرحله</span>
        <span className="font-bold text-[var(--accent-color)]">{currentStep}</span>
        <span>از</span>
        <span className="font-bold">{totalSteps}</span>
      </div>

      {/* Next/Complete Button */}
      <button
        type="button"
        onClick={showComplete ? onComplete : onNext}
        disabled={!canProceed || isLoading}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white transition-all duration-200
          ${canProceed && !isLoading
            ? 'bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-secondary)] hover:shadow-lg hover:scale-105 active:scale-95'
            : 'bg-gray-400 cursor-not-allowed opacity-50'
          }
        `}
        aria-label={showComplete ? 'تکمیل ثبت‌نام' : 'مرحله بعدی'}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>در حال پردازش...</span>
          </>
        ) : showComplete ? (
          <>
            <Check size={16} />
            <span>تکمیل ثبت‌نام</span>
          </>
        ) : (
          <>
            <span>بعدی</span>
            <ChevronLeft size={16} />
          </>
        )}
      </button>
    </div>
  );
};

export default WizardNavigation;
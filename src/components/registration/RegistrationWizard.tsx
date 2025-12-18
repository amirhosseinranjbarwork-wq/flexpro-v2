import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ProgressBar from '../ProgressBar';
import RoleSelectionStep from './RoleSelectionStep';
import PersonalInfoStep from './PersonalInfoStep';
import PasswordSetupStep from './PasswordSetupStep';
import WizardNavigation from './WizardNavigation';

type RegistrationStep = 1 | 2 | 3;

interface FormData {
  role: 'coach' | 'client' | null;
  fullName: string;
  username: string;
  email: string;
  password: string;
}

interface FormErrors {
  role?: string;
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
}

const RegistrationWizard: React.FC = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1);
  const [formData, setFormData] = useState<FormData>({
    role: null,
    fullName: '',
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Validation functions
  const validateStep = useCallback((step: RegistrationStep): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.role) {
          newErrors.role = 'لطفا نقش خود را انتخاب کنید';
        }
        break;

      case 2:
        // Full Name validation
        if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
          newErrors.fullName = 'نام کامل باید حداقل 2 کاراکتر باشد';
        } else if (formData.fullName.trim().length > 100) {
          newErrors.fullName = 'نام کامل نمی‌تواند بیشتر از 100 کاراکتر باشد';
        }

        // Username validation
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!formData.username || !usernameRegex.test(formData.username)) {
          newErrors.username = 'نام کاربری باید 3 تا 20 کاراکتر و فقط شامل حروف انگلیسی، اعداد و خط زیر باشد';
        }

        // Email validation (optional but if provided must be valid)
        if (formData.email.trim().length > 0) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.email)) {
            newErrors.email = 'ایمیل وارد شده معتبر نیست';
          }
        }
        break;

      case 3:
        // Password validation
        if (!formData.password || formData.password.length < 8) {
          newErrors.password = 'رمز عبور باید حداقل 8 کاراکتر باشد';
        } else if (formData.password.length > 128) {
          newErrors.password = 'رمز عبور نمی‌تواند بیشتر از 128 کاراکتر باشد';
        } else {
          // Check password strength
          const hasUpperCase = /[A-Z]/.test(formData.password);
          const hasLowerCase = /[a-z]/.test(formData.password);
          const hasNumber = /[0-9]/.test(formData.password);
          if (!hasUpperCase || !hasLowerCase || hasNumber) {
            // Note: We allow passwords without numbers for better UX, but encourage strong passwords
            if (!hasUpperCase || !hasLowerCase) {
              newErrors.password = 'رمز عبور باید شامل حروف بزرگ و کوچک باشد';
            }
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3) as RegistrationStep);
    }
  }, [currentStep, validateStep]);

  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1) as RegistrationStep);
  }, []);

  // Form field handlers
  const updateFormData = useCallback((field: keyof FormData, value: string | 'coach' | 'client' | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // Submit handler
  const handleComplete = useCallback(async () => {
    if (!validateStep(3)) return;

    try {
      await register({
        email: formData.email || undefined,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role!,
        username: formData.username
      });

      toast.success('ثبت‌نام با موفقیت انجام شد! به FlexPro خوش آمدید.');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      // Error is already handled in AuthContext
      console.error('Registration error:', error);
    }
  }, [formData, register, navigate, validateStep]);

  // Step content renderer
  const renderStep = () => {
    const stepVariants = {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 }
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={stepVariants}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="min-h-[400px] flex items-center justify-center"
        >
          {currentStep === 1 && (
            <RoleSelectionStep
              selectedRole={formData.role}
              onRoleSelect={(role) => updateFormData('role', role)}
            />
          )}

          {currentStep === 2 && (
            <PersonalInfoStep
              fullName={formData.fullName}
              username={formData.username}
              email={formData.email}
              onFullNameChange={(value) => updateFormData('fullName', value)}
              onUsernameChange={(value) => updateFormData('username', value)}
              onEmailChange={(value) => updateFormData('email', value)}
              errors={{
                fullName: errors.fullName,
                username: errors.username,
                email: errors.email
              }}
            />
          )}

          {currentStep === 3 && (
            <PasswordSetupStep
              password={formData.password}
              onPasswordChange={(value) => updateFormData('password', value)}
              error={errors.password}
            />
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  // Check if current step is valid
  const isCurrentStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!formData.role;
      case 2:
        return !!(formData.fullName.trim() && formData.username && /^[a-zA-Z0-9_]{3,20}$/.test(formData.username));
      case 3:
        return !!(formData.password && formData.password.length >= 8);
      default:
        return false;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ProgressBar currentStep={currentStep} totalSteps={3} />

      <div className="mt-8">
        {renderStep()}

        <WizardNavigation
          currentStep={currentStep}
          totalSteps={3}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onComplete={handleComplete}
          isLoading={loading}
          canProceed={isCurrentStepValid()}
          isLastStep={currentStep === 3}
        />
      </div>
    </div>
  );
};

export default RegistrationWizard;
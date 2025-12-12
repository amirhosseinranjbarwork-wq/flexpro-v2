import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import type { User, UserInput } from '../types/index';
import { calculateFitnessMetrics, type MeasurementData, type CalculationResult } from '../utils/calculations';

export interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  age?: string;
  height?: string;
  weight?: string;
  [key: string]: string | undefined;
}

export interface UseUserFormReturn {
  formData: UserInput;
  errors: FormErrors;
  calculations: CalculationResult;
  isSubmitting: boolean;
  activeTab: string;
  setFormData: (data: UserInput | ((prev: UserInput) => UserInput)) => void;
  setActiveTab: (tab: string) => void;
  updateField: (field: keyof UserInput, value: any) => void;
  updateNestedField: (parent: keyof UserInput, field: string, value: any) => void;
  validateForm: () => boolean;
  handleSubmit: (onSave: (data: UserInput) => void | Promise<void>) => Promise<void>;
  resetForm: (initialData?: User | null) => void;
}

const initialFormState: UserInput = {
  name: '', phone: '', age: '', gender: 'male',
  height: '', weight: '', activity: '1.55',
  injuries: [], notes: '',
  exp: '', level: 'beginner', job: '', allergy: '',
  days: '', sleep: 'fair', smoke: 'no', alcohol: 'no', caffeine: 'no',
  financial: { startDate: '', duration: 1, amount: 0 },
  measurements: { neck: '', hip: '', thigh: '', arm: '', waist: '', wrist: '', calf: '', chest: '', shoulder: '' },
  email: '', address: '', education: '', maritalStatus: 'single',
  medicalConditions: [], medications: '', dietType: '', nutritionGoals: '',
  waterIntake: '', mealFrequency: '', foodPreferences: [],
  targetWeight: '', bodyFat: '',
  plans: { workouts: {}, diet: [], dietRest: [], supps: [], prog: [] }
};

export function useUserForm(initialData?: User | null): UseUserFormReturn {
  const [formData, setFormData] = useState<UserInput>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('identity');

  // Initialize form with data
  useEffect(() => {
    resetForm(initialData);
  }, [initialData]);

  // Calculate fitness metrics
  const calculations = useMemo(() => {
    const measurementData: MeasurementData = {
      weight: parseFloat(String(formData.weight || '')) || 0,
      height: parseFloat(String(formData.height || '')) || 0,
      age: parseFloat(String(formData.age || '')) || 0,
      gender: formData.gender || 'male',
      activity: parseFloat(String(formData.activity || '1.55')) || 1.55,
      waist: parseFloat(String(formData.measurements?.waist || '')) || 0,
      hip: parseFloat(String(formData.measurements?.hip || '')) || 0,
      neck: parseFloat(String(formData.measurements?.neck || '')) || 0,
      bodyFat: parseFloat(String(formData.bodyFat || '')) || 0,
      trainingDays: parseInt(String(formData.days || '3'), 10) || 3,
      goal: formData.nutritionGoals
    };

    return calculateFitnessMetrics(measurementData);
  }, [formData]);

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.name?.trim()) {
      newErrors.name = 'نام الزامی است';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'شماره تلفن الزامی است';
    } else if (!/^(\+98|0)?9\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'شماره تلفن معتبر نیست';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ایمیل معتبر نیست';
    }

    // Numeric validations
    const age = parseFloat(String(formData.age || ''));
    if (formData.age && (isNaN(age) || age < 10 || age > 120)) {
      newErrors.age = 'سن باید بین ۱۰ تا ۱۲۰ سال باشد';
    }

    const height = parseFloat(String(formData.height || ''));
    if (formData.height && (isNaN(height) || height < 100 || height > 250)) {
      newErrors.height = 'قد باید بین ۱۰۰ تا ۲۵۰ سانتی‌متر باشد';
    }

    const weight = parseFloat(String(formData.weight || ''));
    if (formData.weight && (isNaN(weight) || weight < 30 || weight > 300)) {
      newErrors.weight = 'وزن باید بین ۳۰ تا ۳۰۰ کیلوگرم باشد';
    }

    // Financial validation
    if (formData.financial?.amount && formData.financial.amount < 0) {
      newErrors.financial = 'مبلغ نمی‌تواند منفی باشد';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Update single field
  const updateField = useCallback((field: keyof UserInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // Update nested field (for objects like measurements, financial)
  const updateNestedField = useCallback((parent: keyof UserInput, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value
      }
    }));
  }, []);

  // Form submission
  const handleSubmit = useCallback(async (onSave: (data: UserInput) => void | Promise<void>) => {
    if (!validateForm()) {
      toast.error('لطفاً خطاهای فرم را برطرف کنید');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      toast.success('اطلاعات با موفقیت ذخیره شد');
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('خطا در ذخیره اطلاعات');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  // Reset form
  const resetForm = useCallback((data?: User | null) => {
    if (data) {
      // Convert User to UserInput format
      const userInput: UserInput = {
        ...initialFormState,
        ...data,
        // Ensure nested objects exist
        financial: { ...initialFormState.financial, ...(data.financial || {}) },
        measurements: { ...initialFormState.measurements, ...(data.measurements || {}) },
        plans: { ...initialFormState.plans, ...(data.plans || {}) }
      };
      setFormData(userInput);
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
    setActiveTab('identity');
  }, []);

  return {
    formData,
    errors,
    calculations,
    isSubmitting,
    activeTab,
    setFormData,
    setActiveTab,
    updateField,
    updateNestedField,
    validateForm,
    handleSubmit,
    resetForm
  };
}


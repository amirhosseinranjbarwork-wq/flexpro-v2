import React, { useState } from 'react';
import { useSaveTemplate } from '../hooks/useTemplates';
import { supabase, isSupabaseEnabled } from '../lib/supabaseClient';
import SuccessMessage from './ui/SuccessMessage';
import ErrorMessage from './ui/ErrorMessage';
import { toast } from 'react-hot-toast';

interface SavePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  fullWeekData: Record<string, any>;
}

/**
 * SavePlanModal Component
 * Modal for saving entire week's workout plan as a template
 * Supports both Supabase and Local Mock modes
 */
const SavePlanModal: React.FC<SavePlanModalProps> = ({ isOpen, onClose, fullWeekData }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const saveTemplateMutation = useSaveTemplate();

  const handleSave = async () => {
    if (!name.trim()) {
      setErrorMessage('لطفاً نام برنامه را وارد کنید');
      return;
    }

    // In local mode, save to localStorage
    if (!isSupabaseEnabled || !supabase) {
      try {
        const templates = JSON.parse(localStorage.getItem('flexpro_templates') || '[]');
        const newTemplate = {
          id: `template-${Date.now()}`,
          name: name.trim(),
          description: description.trim(),
          full_week_data: fullWeekData,
          created_by: 'local-user',
          created_at: new Date().toISOString(),
        };
        templates.push(newTemplate);
        localStorage.setItem('flexpro_templates', JSON.stringify(templates));
        
        setSuccessMessage('برنامه با موفقیت ذخیره شد (حالت محلی)');
        setTimeout(() => {
          setName('');
          setDescription('');
          setSuccessMessage('');
          onClose();
        }, 2000);
      } catch (error) {
        setErrorMessage('خطا در ذخیره برنامه');
      }
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setErrorMessage('کاربر یافت نشد');
        return;
      }

      await saveTemplateMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        full_week_data: fullWeekData,
        created_by: user.id,
      });

      setSuccessMessage('برنامه با موفقیت ذخیره شد');
      setTimeout(() => {
        setName('');
        setDescription('');
        setSuccessMessage('');
        onClose();
      }, 2000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'خطای نامشخص');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">ذخیره برنامه کامل</h2>

        {successMessage && <SuccessMessage message={successMessage} />}
        {errorMessage && <ErrorMessage message={errorMessage} />}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام برنامه</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: برنامه حجمی شامل ۷ روز"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات کلی برنامه..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saveTemplateMutation.isPending}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
            >
              {saveTemplateMutation.isPending ? 'درحال ذخیره...' : 'ذخیره'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400 font-semibold"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavePlanModal;

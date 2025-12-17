import React, { useState } from 'react';
import { useTemplates, useLoadTemplate, useDeleteTemplate } from '../hooks/useTemplates';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';
import SuccessMessage from './ui/SuccessMessage';

interface TemplateLoaderProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  onTemplateLoaded: () => void;
}

/**
 * TemplateLoader Component
 * Modal for browsing and loading full-week workout templates
 */
const TemplateLoader: React.FC<TemplateLoaderProps> = ({
  isOpen,
  onClose,
  clientId,
  onTemplateLoaded,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: templates, isLoading } = useTemplates();
  const loadTemplateMutation = useLoadTemplate();
  const deleteTemplateMutation = useDeleteTemplate();

  const selectedTemplate = templates?.find(t => t.id === selectedTemplateId);

  const handleLoadTemplate = () => {
    if (!selectedTemplate) return;

    setShowConfirmation(true);
  };

  const confirmLoadTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      await loadTemplateMutation.mutateAsync({
        clientId,
        templateId: selectedTemplate.id,
        fullWeekData: selectedTemplate.full_week_data,
      });

      setSuccessMessage('برنامه با موفقیت بارگذاری شد');
      setTimeout(() => {
        setShowConfirmation(false);
        setSelectedTemplateId(null);
        setSuccessMessage('');
        onTemplateLoaded();
        onClose();
      }, 2000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'خطا در بارگذاری برنامه');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('آیا از حذف این برنامه اطمینان دارید؟')) return;

    try {
      await deleteTemplateMutation.mutateAsync(templateId);
      if (selectedTemplateId === templateId) {
        setSelectedTemplateId(null);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'خطا در حذف برنامه');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <h2 className="text-xl font-bold text-gray-900">بارگذاری برنامه</h2>
        </div>

        {/* Messages */}
        <div className="px-4 pt-4">
          {successMessage && <SuccessMessage message={successMessage} />}
          {errorMessage && <ErrorMessage message={errorMessage} />}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : templates && templates.length > 0 ? (
            <div className="space-y-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`w-full text-right p-4 rounded-lg border-2 transition ${
                    selectedTemplateId === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{template.name}</div>
                  {template.description && (
                    <div className="text-sm text-gray-600 mt-1">{template.description}</div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    تاریخ: {new Date(template.created_at).toLocaleDateString('fa-IR')}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              هیچ برنامه ذخیره شده‌ای نیست
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex gap-3">
          <button
            onClick={handleLoadTemplate}
            disabled={!selectedTemplate || loadTemplateMutation.isPending}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
          >
            {loadTemplateMutation.isPending ? 'درحال بارگذاری...' : 'بارگذاری'}
          </button>
          {selectedTemplate && (
            <button
              onClick={() => handleDeleteTemplate(selectedTemplate.id)}
              disabled={deleteTemplateMutation.isPending}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              حذف
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400 font-semibold"
          >
            بستن
          </button>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmation && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">تایید بارگذاری برنامه</h3>
              <p className="text-gray-600 mb-2">
                آیا می‌خواهید برنامه "{selectedTemplate.name}" را بارگذاری کنید؟
              </p>
              <p className="text-red-600 text-sm mb-4">
                ⚠️ این عمل برنامه‌های فعلی کلیئنت را جایگزین خواهد کرد
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmLoadTemplate}
                  disabled={loadTemplateMutation.isPending}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loadTemplateMutation.isPending ? 'درحال پردازش...' : 'تایید'}
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateLoader;

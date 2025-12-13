import React, { useState, useCallback } from 'react';
import { Upload, X, Calendar, TrendingUp, Camera, Image as ImageIcon } from 'lucide-react';
import { GalleryPanelProps, ProgressPhoto } from '../../types/interactive';
import { useProgressPhotos } from '../../hooks/useProgressPhotos';
import { sanitizeFileName } from '../../utils/sanitization';

const GalleryPanel: React.FC<GalleryPanelProps> = ({
  userId,
  isCoach = false,
  className = ''
}) => {
  const {
    photos,
    uploadPhoto,
    deletePhoto,
    getPhotosByDateRange,
    getComparisons,
    isLoading,
    error
  } = useProgressPhotos(userId);

  const [selectedPhotos, setSelectedPhotos] = useState<ProgressPhoto[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('فقط فایل‌های تصویری مجاز هستند');
        continue;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('حجم فایل نباید بیشتر از ۱۰ مگابایت باشد');
        continue;
      }

      // Sanitize filename
      const sanitizedName = sanitizeFileName(file.name);

      try {
        const metadata: Partial<ProgressPhoto> = {
          photo_date: new Date().toISOString().split('T')[0],
          pose_type: 'front',
          weight: undefined,
          height: undefined,
          notes: ''
        };

        await uploadPhoto(file, metadata);
      } catch (error) {
        console.error('Error uploading photo:', error);
        alert('خطا در آپلود عکس');
      }
    }

    setUploadModalOpen(false);
  }, [uploadPhoto]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  // Group photos by month
  const groupedPhotos = React.useMemo(() => {
    const groups: Record<string, ProgressPhoto[]> = {};

    photos.forEach(photo => {
      const date = new Date(photo.photo_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(photo);
    });

    return groups;
  }, [photos]);

  // Get comparisons
  const comparisons = React.useMemo(() => getComparisons(), [getComparisons]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">گالری پیشرفت</h2>
          <p className="text-[var(--text-secondary)]">عکس‌های پیشرفت بدنی خود را آپلود و مقایسه کنید</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              comparisonMode
                ? 'bg-[var(--accent-color)] text-white'
                : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-[var(--glass-border)]'
            }`}
          >
            <TrendingUp size={16} className="inline mr-2" />
            مقایسه
          </button>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-secondary)] transition flex items-center gap-2"
          >
            <Upload size={16} />
            آپلود عکس
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">آپلود عکس پیشرفت</h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-2 rounded-lg hover:bg-[var(--glass-bg)]"
              >
                <X size={20} />
              </button>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                isDragOver
                  ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10'
                  : 'border-[var(--glass-border)] hover:border-[var(--accent-color)]/50'
              }`}
            >
              <Camera size={48} className="mx-auto mb-4 text-[var(--text-secondary)]" />
              <p className="text-[var(--text-primary)] mb-2">عکس‌های پیشرفت خود را اینجا رها کنید</p>
              <p className="text-sm text-[var(--text-secondary)] mb-4">یا کلیک کنید و انتخاب کنید</p>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="inline-block px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-secondary)] cursor-pointer transition"
              >
                انتخاب فایل
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Comparison View */}
      {comparisonMode && comparisons.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">مقایسه پیشرفت</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparisons.slice(0, 4).map((comparison, index) => (
              <div key={index} className="glass-card p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">
                    {comparison.dateDifference} روز تفاوت
                  </span>
                  {comparison.weightChange && (
                    <span className={`text-sm font-medium ${
                      comparison.weightChange > 0 ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {comparison.weightChange > 0 ? '+' : ''}{comparison.weightChange}kg
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <img
                      src={comparison.before.photo_url}
                      alt="Before"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <p className="text-xs text-center mt-1 text-[var(--text-secondary)]">قبل</p>
                  </div>
                  <div>
                    <img
                      src={comparison.after.photo_url}
                      alt="After"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <p className="text-xs text-center mt-1 text-[var(--text-secondary)]">بعد</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Gallery */}
      {!comparisonMode && (
        <div className="space-y-6">
          {Object.keys(groupedPhotos).length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon size={48} className="mx-auto mb-4 text-[var(--text-secondary)] opacity-50" />
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">عکسی آپلود نشده</h3>
              <p className="text-[var(--text-secondary)] mb-4">اولین عکس پیشرفت خود را آپلود کنید</p>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="px-6 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-secondary)] transition"
              >
                شروع کنید
              </button>
            </div>
          ) : (
            Object.entries(groupedPhotos)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([month, monthPhotos]) => (
                <div key={month}>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar size={16} className="text-[var(--text-secondary)]" />
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      {new Date(month + '-01').toLocaleDateString('fa-IR', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </h3>
                    <span className="text-sm text-[var(--text-secondary)] bg-[var(--glass-bg)] px-2 py-1 rounded">
                      {monthPhotos.length} عکس
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {monthPhotos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.photo_url}
                          alt={`Progress photo ${photo.photo_date}`}
                          className="w-full aspect-square object-cover rounded-lg border border-[var(--glass-border)]"
                        />

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="text-white text-center">
                            <p className="text-sm font-medium">
                              {new Date(photo.photo_date).toLocaleDateString('fa-IR')}
                            </p>
                            {photo.weight && (
                              <p className="text-xs">{photo.weight}kg</p>
                            )}
                            {photo.pose_type && (
                              <p className="text-xs capitalize">{photo.pose_type}</p>
                            )}
                          </div>
                        </div>

                        {isCoach && (
                          <button
                            onClick={() => deletePhoto(photo.id)}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryPanel;
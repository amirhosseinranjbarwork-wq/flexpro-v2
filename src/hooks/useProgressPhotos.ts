import React, { useState, useCallback } from 'react';
// Supabase removed - using local API
import { ProgressPhoto, PhotoComparison, UseProgressPhotosReturn } from '../types/interactive';
import { useAuth } from '../context/AuthContext';

// Local storage helpers
const STORAGE_KEY = 'flexpro_progress_photos';

function getLocalPhotos(userId: string): ProgressPhoto[] {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLocalPhotos(userId: string, photos: ProgressPhoto[]): void {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(photos));
  } catch (error) {
    console.warn('Failed to save photos to localStorage:', error);
  }
}

// Convert file to base64 for local storage
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

export function useProgressPhotos(userId: string): UseProgressPhotosReturn {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load photos
  const loadPhotos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let data: ProgressPhoto[] = [];

      // Use local storage if Supabase is not enabled
      if (!isSupabaseEnabled || !supabase) {
        data = getLocalPhotos(userId);
      } else {
        const { data: fetchedData, error: fetchError } = await supabase
          .from('progress_photos')
          .select('*')
          .eq('user_id', userId)
          .order('photo_date', { ascending: false });

        if (fetchError) throw fetchError;
        data = fetchedData || [];
      }

      setPhotos(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در بارگذاری عکس‌ها';
      setError(errorMessage);
      console.error('Error loading progress photos:', err);
      // Fallback to local storage
      const localPhotos = getLocalPhotos(userId);
      setPhotos(localPhotos);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Upload photo
  const uploadPhoto = useCallback(async (file: File, metadata: Partial<ProgressPhoto>) => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      let photoUrl: string;
      let photoData: ProgressPhoto;

      // Use local storage if Supabase is not enabled
      if (!isSupabaseEnabled || !supabase) {
        // Convert file to base64 for local storage
        photoUrl = await fileToBase64(file);
        
        photoData = {
          id: `photo-${Date.now()}`,
          user_id: userId,
          photo_url: photoUrl,
          photo_date: metadata.photo_date || new Date().toISOString().split('T')[0],
          pose_type: metadata.pose_type || 'front',
          weight: metadata.weight,
          height: metadata.height,
          body_fat_percentage: metadata.body_fat_percentage,
          notes: metadata.notes,
          is_private: metadata.is_private || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Save to local storage
        const localPhotos = getLocalPhotos(userId);
        localPhotos.unshift(photoData);
        saveLocalPhotos(userId, localPhotos);
      } else {
        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;

        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('progress-photos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('progress-photos')
          .getPublicUrl(fileName);

        if (!urlData.publicUrl) throw new Error('Failed to get photo URL');

        // Save metadata to database
        const photoPayload: Omit<ProgressPhoto, 'id' | 'created_at' | 'updated_at'> = {
          user_id: userId,
          photo_url: urlData.publicUrl,
          photo_date: metadata.photo_date || new Date().toISOString().split('T')[0],
          pose_type: metadata.pose_type || 'front',
          weight: metadata.weight,
          height: metadata.height,
          body_fat_percentage: metadata.body_fat_percentage,
          notes: metadata.notes,
          is_private: metadata.is_private || false
        };

        const { data, error: saveError } = await supabase
          .from('progress_photos')
          .insert(photoPayload)
          .select()
          .single();

        if (saveError) throw saveError;
        photoData = data;
      }

      // Add to local state
      setPhotos(prev => [photoData, ...prev]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در آپلود عکس';
      setError(errorMessage);
      console.error('Error uploading progress photo:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, userId]);

  // Delete photo
  const deletePhoto = useCallback(async (photoId: string) => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Use local storage if Supabase is not enabled
      if (!isSupabaseEnabled || !supabase) {
        const localPhotos = getLocalPhotos(userId);
        const filtered = localPhotos.filter(p => p.id !== photoId);
        saveLocalPhotos(userId, filtered);
        setPhotos(filtered);
        return;
      }

      // Get photo data first
      const { data: photo, error: fetchError } = await supabase
        .from('progress_photos')
        .select('*')
        .eq('id', photoId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const fileName = photo.photo_url.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('progress-photos')
          .remove([`${userId}/${fileName}`]);

        if (storageError) {
          console.warn('Failed to delete from storage:', storageError);
        }
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('progress_photos')
        .delete()
        .eq('id', photoId)
        .eq('user_id', userId); // Ensure user can only delete their own photos

      if (deleteError) throw deleteError;

      // Remove from local state
      setPhotos(prev => prev.filter(p => p.id !== photoId));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در حذف عکس';
      setError(errorMessage);
      console.error('Error deleting progress photo:', err);
      // Fallback: remove from local state anyway
      setPhotos(prev => prev.filter(p => p.id !== photoId));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, userId]);

  // Get photos by date range
  const getPhotosByDateRange = useCallback((startDate: string, endDate: string): ProgressPhoto[] => {
    return photos.filter(photo => {
      const photoDate = photo.photo_date;
      return photoDate >= startDate && photoDate <= endDate;
    });
  }, [photos]);

  // Get photo comparisons (before/after pairs)
  const getComparisons = useCallback((): PhotoComparison[] => {
    if (photos.length < 2) return [];

    const sortedPhotos = [...photos].sort((a, b) =>
      new Date(a.photo_date).getTime() - new Date(b.photo_date).getTime()
    );

    const comparisons: PhotoComparison[] = [];

    for (let i = 0; i < sortedPhotos.length - 1; i++) {
      for (let j = i + 1; j < sortedPhotos.length; j++) {
        const before = sortedPhotos[i];
        const after = sortedPhotos[j];

        // Only compare photos of the same pose
        if (before.pose_type === after.pose_type) {
          const dateDifference = Math.floor(
            (new Date(after.photo_date).getTime() - new Date(before.photo_date).getTime()) / (1000 * 60 * 60 * 24)
          );

          const weightChange = before.weight && after.weight ? after.weight - before.weight : undefined;

          comparisons.push({
            before,
            after,
            weightChange,
            dateDifference
          });
        }
      }
    }

    // Return top comparisons by date difference
    return comparisons
      .sort((a, b) => b.dateDifference - a.dateDifference)
      .slice(0, 10);
  }, [photos]);

  // Load photos on mount
  React.useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  return {
    photos,
    uploadPhoto,
    deletePhoto,
    getPhotosByDateRange,
    getComparisons,
    isLoading,
    error
  };
}
import { useState, useCallback } from 'react';
import { supabase, isSupabaseEnabled } from '../lib/supabaseClient';
import { DietTemplate, UseDietTemplatesReturn } from '../types/interactive';
import { useAuth } from '../context/AuthContext';

// Local storage helpers
const STORAGE_KEY = 'flexpro_diet_templates';

function getLocalDietTemplates(userId: string): DietTemplate[] {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLocalDietTemplate(userId: string, template: DietTemplate): void {
  try {
    const templates = getLocalDietTemplates(userId);
    templates.unshift(template);
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(templates));
  } catch (error) {
    console.warn('Failed to save diet template to localStorage:', error);
  }
}

function deleteLocalDietTemplate(userId: string, templateId: string): void {
  try {
    const templates = getLocalDietTemplates(userId);
    const filtered = templates.filter(t => t.id !== templateId);
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(filtered));
  } catch (error) {
    console.warn('Failed to delete diet template from localStorage:', error);
  }
}

export function useDietTemplates(): UseDietTemplatesReturn {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<DietTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load templates
  const loadTemplates = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      let data: DietTemplate[] = [];

      // Use local storage if Supabase is not enabled
      if (!isSupabaseEnabled || !supabase) {
        data = getLocalDietTemplates(user.id);
      } else {
        const { data: fetchedData, error: fetchError } = await supabase
          .from('diet_templates')
          .select('*')
          .or(`coach_id.eq.${user.id},is_public.eq.true`)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        data = fetchedData || [];
      }

      setTemplates(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در بارگذاری الگوها';
      setError(errorMessage);
      console.error('Error loading diet templates:', err);
      // Fallback to local storage
      const localTemplates = getLocalDietTemplates(user.id);
      setTemplates(localTemplates);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Save template
  const saveTemplate = useCallback(async (templateData: Omit<DietTemplate, 'id' | 'coach_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      let savedTemplate: DietTemplate;

      // Use local storage if Supabase is not enabled
      if (!isSupabaseEnabled || !supabase) {
        savedTemplate = {
          ...templateData,
          id: `diet-template-${Date.now()}`,
          coach_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        saveLocalDietTemplate(user.id, savedTemplate);
      } else {
        const { data, error: saveError } = await supabase
          .from('diet_templates')
          .insert({
            ...templateData,
            coach_id: user.id
          })
          .select()
          .single();

        if (saveError) throw saveError;
        savedTemplate = data;
      }

      // Add to local state
      setTemplates(prev => [savedTemplate, ...prev]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در ذخیره الگو';
      setError(errorMessage);
      console.error('Error saving diet template:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Load template
  const loadTemplate = useCallback(async (templateId: string): Promise<DietTemplate> => {
    setIsLoading(true);
    setError(null);

    try {
      // Use local storage if Supabase is not enabled
      if (!isSupabaseEnabled || !supabase) {
        const localTemplates = getLocalDietTemplates(user?.id || '');
        const template = localTemplates.find(t => t.id === templateId);
        if (!template) {
          throw new Error('Template not found');
        }
        return template;
      }

      const { data, error: fetchError } = await supabase
        .from('diet_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (fetchError) throw fetchError;

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در بارگذاری الگو';
      setError(errorMessage);
      console.error('Error loading diet template:', err);
      // Try local storage as fallback
      if (user?.id) {
        const localTemplates = getLocalDietTemplates(user.id);
        const template = localTemplates.find(t => t.id === templateId);
        if (template) return template;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Delete template
  const deleteTemplate = useCallback(async (templateId: string) => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Use local storage if Supabase is not enabled
      if (!isSupabaseEnabled || !supabase) {
        deleteLocalDietTemplate(user.id, templateId);
      } else {
        const { error: deleteError } = await supabase
          .from('diet_templates')
          .delete()
          .eq('id', templateId)
          .eq('coach_id', user.id); // Ensure user can only delete their own templates

        if (deleteError) throw deleteError;
      }

      // Remove from local state
      setTemplates(prev => prev.filter(t => t.id !== templateId));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در حذف الگو';
      setError(errorMessage);
      console.error('Error deleting diet template:', err);
      // Fallback: delete from local storage anyway
      deleteLocalDietTemplate(user.id, templateId);
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  return {
    templates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    isLoading,
    error
  };
}
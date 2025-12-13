import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { DietTemplate, UseDietTemplatesReturn } from '../types/interactive';
import { useAuth } from '../context/AuthContext';

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
      const { data, error: fetchError } = await supabase
        .from('diet_templates')
        .select('*')
        .or(`coach_id.eq.${user.id},is_public.eq.true`)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setTemplates(data || []);
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری الگوها');
      console.error('Error loading diet templates:', err);
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
      const { data, error: saveError } = await supabase
        .from('diet_templates')
        .insert({
          ...templateData,
          coach_id: user.id
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Add to local state
      setTemplates(prev => [data, ...prev]);

    } catch (err: any) {
      setError(err.message || 'خطا در ذخیره الگو');
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
      const { data, error: fetchError } = await supabase
        .from('diet_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (fetchError) throw fetchError;

      return data;
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری الگو');
      console.error('Error loading diet template:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete template
  const deleteTemplate = useCallback(async (templateId: string) => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('diet_templates')
        .delete()
        .eq('id', templateId)
        .eq('coach_id', user.id); // Ensure user can only delete their own templates

      if (deleteError) throw deleteError;

      // Remove from local state
      setTemplates(prev => prev.filter(t => t.id !== templateId));

    } catch (err: any) {
      setError(err.message || 'خطا در حذف الگو');
      console.error('Error deleting diet template:', err);
      throw err;
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
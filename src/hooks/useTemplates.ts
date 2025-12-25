import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseEnabled } from '../lib/supabaseClient';

export interface TemplateData {
  id: string;
  name: string;
  description?: string;
  full_week_data: Record<string, any>;
  is_full_program: boolean;
  created_by: string;
  created_at: string;
}

/**
 * Get templates from localStorage
 */
function getLocalTemplates(): TemplateData[] {
  try {
    const stored = localStorage.getItem('flexpro_templates');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save template to localStorage
 */
function saveLocalTemplate(template: Omit<TemplateData, 'id' | 'created_at'>): TemplateData {
  const templates = getLocalTemplates();
  const newTemplate: TemplateData = {
    ...template,
    id: `template-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  templates.push(newTemplate);
  localStorage.setItem('flexpro_templates', JSON.stringify(templates));
  return newTemplate;
}

/**
 * Delete template from localStorage
 */
function deleteLocalTemplate(templateId: string): void {
  const templates = getLocalTemplates();
  const filtered = templates.filter(t => t.id !== templateId);
  localStorage.setItem('flexpro_templates', JSON.stringify(filtered));
}

/**
 * Fetch all full-week templates
 */
export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      // Use local data if Supabase is not enabled
      if (!isSupabaseEnabled || !supabase) {
        return getLocalTemplates().filter(t => t.is_full_program);
      }

      try {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .eq('is_full_program', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as TemplateData[];
      } catch (error) {
        console.warn('Supabase fetch failed, using local templates:', error);
        return getLocalTemplates().filter(t => t.is_full_program);
      }
    },
  });
};

/**
 * Fetch templates created by current user
 */
export const useUserTemplates = (userId: string) => {
  return useQuery({
    queryKey: ['templates', userId],
    queryFn: async () => {
      // Use local data if Supabase is not enabled
      if (!isSupabaseEnabled || !supabase) {
        return getLocalTemplates().filter(t => t.created_by === userId && t.is_full_program);
      }

      try {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .eq('created_by', userId)
          .eq('is_full_program', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as TemplateData[];
      } catch (error) {
        console.warn('Supabase fetch failed, using local templates:', error);
        return getLocalTemplates().filter(t => t.created_by === userId && t.is_full_program);
      }
    },
    enabled: !!userId,
  });
};

/**
 * Save a full program as template
 */
export const useSaveTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateData: {
      name: string;
      description?: string;
      full_week_data: Record<string, any>;
      created_by: string;
    }) => {
      // Use local storage if Supabase is not enabled
      if (!isSupabaseEnabled || !supabase) {
        const saved = saveLocalTemplate({
          ...templateData,
          is_full_program: true,
        });
        return saved;
      }

      try {
        const { data, error } = await supabase
          .from('templates')
          .insert({
            ...templateData,
            is_full_program: true,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Supabase save failed, saving locally:', error);
        return saveLocalTemplate({
          ...templateData,
          is_full_program: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

/**
 * Load a template (overwrite client's current plan)
 */
export const useLoadTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      clientId: string;
      templateId: string;
      fullWeekData: Record<string, any>;
    }) => {
      // In local mode, just return success (plan update handled elsewhere)
      if (!isSupabaseEnabled || !supabase) {
        console.log('Template loaded in local mode');
        return data;
      }

      try {
        // Update user's plan in the profiles table
        const { error } = await supabase
          .from('profiles')
          .update({
            plans: {
              workouts: data.fullWeekData,
            },
          })
          .eq('id', data.clientId);

        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Supabase update failed:', error);
        return data; // Still return data for local mode compatibility
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
};

/**
 * Delete a template
 */
export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateId: string) => {
      // Use local storage if Supabase is not enabled
      if (!isSupabaseEnabled || !supabase) {
        deleteLocalTemplate(templateId);
        return;
      }

      try {
        const { error } = await supabase
          .from('templates')
          .delete()
          .eq('id', templateId);

        if (error) throw error;
      } catch (error) {
        console.warn('Supabase delete failed, deleting locally:', error);
        deleteLocalTemplate(templateId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

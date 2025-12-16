import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

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
 * Fetch all full-week templates
 */
export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('is_full_program', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TemplateData[];
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
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('created_by', userId)
        .eq('is_full_program', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TemplateData[];
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
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

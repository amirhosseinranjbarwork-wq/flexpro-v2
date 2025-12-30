import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Supabase removed - using local API

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
      // Use local data (offline mode)
      return getLocalTemplates().filter(t => t.is_full_program);
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
      // Use local data (offline mode)
      return getLocalTemplates().filter(t => t.created_by === userId && t.is_full_program);
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
      // Use local storage (offline mode)
      const saved = saveLocalTemplate({
        ...templateData,
        is_full_program: true,
      });
      return saved;
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
      console.log('Template loaded in local mode');
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
      // Use local storage (offline mode)
      deleteLocalTemplate(templateId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

import { create } from 'zustand';
import { apiClient } from '@/lib/api';
import type { WorkflowDefinition, Run, Task, PaginatedResponse } from '@/types';

interface WorkflowState {
  workflows: WorkflowDefinition[];
  runs: Run[];
  loading: boolean;
  error: string | null;
}

interface WorkflowActions {
  fetchWorkflows: (page?: number, limit?: number) => Promise<void>;
  createWorkflow: (data: { name: string; description?: string; nodes: any[]; edges: any[] }) => Promise<void>;
  updateWorkflow: (id: string, data: Partial<WorkflowDefinition>) => Promise<void>;
  deleteWorkflow: (id: string) => Promise<void>;
  fetchRuns: (workflowId?: string, page?: number, limit?: number) => Promise<void>;
  triggerRun: (workflowId: string, input: Record<string, any>) => Promise<void>;
  clearError: () => void;
}

type WorkflowStore = WorkflowState & WorkflowActions;

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  // State
  workflows: [],
  runs: [],
  loading: false,
  error: null,

  // Actions
  fetchWorkflows: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response: PaginatedResponse<WorkflowDefinition> = await apiClient.getWorkflows(page, limit);
      set({
        workflows: response.data,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.error || 'Failed to fetch workflows',
      });
    }
  },

  createWorkflow: async (data) => {
    set({ loading: true, error: null });
    try {
      await apiClient.createWorkflow(data);
      // Refresh workflows list
      await get().fetchWorkflows();
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.error || 'Failed to create workflow',
      });
      throw error;
    }
  },

  updateWorkflow: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await apiClient.updateWorkflow(id, data);
      // Refresh workflows list
      await get().fetchWorkflows();
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.error || 'Failed to update workflow',
      });
      throw error;
    }
  },

  deleteWorkflow: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiClient.deleteWorkflow(id);
      // Refresh workflows list
      await get().fetchWorkflows();
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.error || 'Failed to delete workflow',
      });
      throw error;
    }
  },

  fetchRuns: async (workflowId, page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response: PaginatedResponse<Run> = await apiClient.getRuns(workflowId, page, limit);
      set({
        runs: response.data,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.error || 'Failed to fetch runs',
      });
    }
  },

  triggerRun: async (workflowId, input) => {
    set({ loading: true, error: null });
    try {
      const run = await apiClient.triggerRun(workflowId, input);
      // Refresh runs list
      await get().fetchRuns();
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.error || 'Failed to trigger run',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

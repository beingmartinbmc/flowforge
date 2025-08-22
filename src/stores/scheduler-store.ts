import { create } from 'zustand';
import { apiClient } from '@/lib/api';
import type { SchedulerResponse, SchedulerConfig } from '@/types';

interface SchedulerState {
  isProcessing: boolean;
  lastResult: SchedulerResponse | null;
  error: string | null;
  processingHistory: SchedulerResponse[];
}

interface SchedulerActions {
  triggerScheduler: (config?: SchedulerConfig) => Promise<void>;
  triggerRedisScheduler: (config?: SchedulerConfig) => Promise<void>;
  triggerMongoScheduler: (config?: SchedulerConfig) => Promise<void>;
  triggerCronScheduler: () => Promise<void>;
  clearError: () => void;
  clearHistory: () => void;
}

type SchedulerStore = SchedulerState & SchedulerActions;

export const useSchedulerStore = create<SchedulerStore>((set, get) => ({
  // State
  isProcessing: false,
  lastResult: null,
  error: null,
  processingHistory: [],

  // Actions
  triggerScheduler: async (config) => {
    set({ isProcessing: true, error: null });
    try {
      const result = await apiClient.triggerScheduler(config);
      set((state) => ({
        lastResult: result,
        processingHistory: [result, ...state.processingHistory.slice(0, 9)], // Keep last 10
        isProcessing: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isProcessing: false,
        error: error.response?.data?.error || 'Failed to trigger scheduler',
      });
      throw error;
    }
  },

  triggerRedisScheduler: async (config) => {
    set({ isProcessing: true, error: null });
    try {
      const result = await apiClient.triggerRedisScheduler(config);
      set((state) => ({
        lastResult: result,
        processingHistory: [result, ...state.processingHistory.slice(0, 9)],
        isProcessing: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isProcessing: false,
        error: error.response?.data?.error || 'Failed to trigger Redis scheduler',
      });
      throw error;
    }
  },

  triggerMongoScheduler: async (config) => {
    set({ isProcessing: true, error: null });
    try {
      const result = await apiClient.triggerMongoScheduler(config);
      set((state) => ({
        lastResult: result,
        processingHistory: [result, ...state.processingHistory.slice(0, 9)],
        isProcessing: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isProcessing: false,
        error: error.response?.data?.error || 'Failed to trigger MongoDB scheduler',
      });
      throw error;
    }
  },

  triggerCronScheduler: async () => {
    set({ isProcessing: true, error: null });
    try {
      const result = await apiClient.triggerCronScheduler();
      set((state) => ({
        lastResult: result,
        processingHistory: [result, ...state.processingHistory.slice(0, 9)],
        isProcessing: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isProcessing: false,
        error: error.response?.data?.error || 'Failed to trigger cron scheduler',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearHistory: () => {
    set({ processingHistory: [] });
  },
}));

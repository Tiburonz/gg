import { create } from 'zustand';
import { ServerStatus } from '@/types';
import serverService from '@/services/server.service';

interface ServerState {
  status: ServerStatus | null;
  isLoading: boolean;
  error: string | null;
  fetchStatus: () => Promise<void>;
}

export const useServerStore = create<ServerState>((set) => ({
  status: null,
  isLoading: false,
  error: null,

  fetchStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const status = await serverService.getServerStatus();
      set({ status, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch server status',
        isLoading: false 
      });
    }
  },
}));
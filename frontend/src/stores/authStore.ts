import { create } from 'zustand';
import { Account } from '@/types';
import authService from '@/services/auth.service';

interface AuthState {
  account: Account | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAccount: (account: Account | null) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  account: authService.getAccount(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,

  setAccount: (account) => set({ 
    account, 
    isAuthenticated: !!account 
  }),

  logout: () => {
    authService.logout();
    set({ 
      account: null, 
      isAuthenticated: false 
    });
  },

  checkAuth: () => {
    const account = authService.getAccount();
    const isAuthenticated = authService.isAuthenticated();
    set({ account, isAuthenticated });
  },
}));
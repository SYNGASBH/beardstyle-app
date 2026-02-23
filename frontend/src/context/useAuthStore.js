import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      // State
      isAuthenticated: false,
      user: null,
      token: null,
      accountType: null, // 'user' or 'salon'

      // Actions
      login: (userData, token, accountType) => {
        set({
          isAuthenticated: true,
          user: userData,
          token,
          accountType,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          accountType: null,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;

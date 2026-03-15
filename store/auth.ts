import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  isAuthenticated: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    role: string;
    profilePic?: string;
  } | null;
  login: (user: { id: string; firstName: string; lastName: string; name: string; email: string; role: string; profilePic?: string }) => void;
  logout: () => void;
  updateUser: (data: Partial<{ firstName: string; lastName: string; name: string; profilePic: string }>) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
      updateUser: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      })),
    }),
    {
      name: "bistroflow-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

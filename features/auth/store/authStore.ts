import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "client" | "freelancer";

export interface MockUser {
  name: string;
  role: UserRole;
}

interface AuthState {
  user: MockUser | null;
  isLoggedIn: boolean;
}

interface AuthActions {
  mockLogin: (name: string, role: UserRole) => void;
  logout: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      mockLogin: (name, role) => {
        // ⏳ 나중에: supabase.auth.signInWithPassword 로 교체
        set({ user: { name, role }, isLoggedIn: true });
      },

      logout: () => {
        // ⏳ 나중에: supabase.auth.signOut() 추가
        set({ user: null, isLoggedIn: false });
      },
    }),
    {
      name: "auth-storage", // localStorage 키 — 새로고침 후에도 로그인 상태 유지
    }
  )
);

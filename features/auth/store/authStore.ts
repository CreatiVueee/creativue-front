import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/shared/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "client" | "freelancer" | "admin";

export interface User {
  id: string;
  email: string;
  user_id: string; // 사용자 가입 ID
  user_type: UserRole;
  name: string;    // UI 호환용 이름 필드
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

interface AuthActions {
  signUp: (
    email: string,
    password: string,
    userId: string,
    role: UserRole,
    extra?: {
      phone?: string;
      interestedFields?: string[]; // client 용
      nickname?: string;          // freelancer 용
      profileUrl?: string;
      role?: string;
      mainExpertise?: string[];
      experienceYears?: string;
    }
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  // ─── 하위 호환성 유지용 임시 Mock ───
  mockLogin: (name: string, role: UserRole) => void;
}

export const DEFAULT_USER: User = {
  id: "khm4275843-id",
  email: "khm4275843@gmail.com",
  user_id: "khm4275843",
  user_type: "client",
  name: "khm4275843",
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: DEFAULT_USER,
      isLoggedIn: true,
      isLoading: false,

      signUp: async (email, password, userId, role, extra) => {
        set({ isLoading: true });
        const supabase = createClient();
        try {
          // 1. Supabase Auth 회원가입 진행
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                user_type: role,
                user_id: userId,
              },
            },
          });

          if (error) throw error;
          if (!data.user) throw new Error("회원가입 처리 중 알 수 없는 오류가 발생했습니다.");

          // 2. public.user_profiles 테이블에 사용자 정보 직접 추가 (동시 생성 보장)
          // DB 트리거가 오동작하거나 미설정된 환경에서도 정확히 삽입되도록 함
          const { error: profileError } = await supabase
            .from("user_profiles")
            .upsert({
              id: data.user.id,
              user_id: userId,
              email: email,
              phone_number: extra?.phone ?? null,
              user_type: role,
            });
          if (profileError) throw profileError;

          // 3. 가입 성격(Role)에 따른 서브 프로필 테이블 추가 인서트
          if (role === "client") {
            const { error: clientError } = await supabase
              .from("clients")
              .insert({
                id: data.user.id,
                interested_fields: extra?.interestedFields ?? [],
              });
            if (clientError) throw clientError;
          } else if (role === "freelancer") {
            const { error: freelancerError } = await supabase
              .from("freelancers")
              .insert({
                id: data.user.id,
                nickname: extra?.nickname ?? userId,
                profile_url: extra?.profileUrl ?? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
                role: extra?.role ?? "designer",
                main_expertise: extra?.mainExpertise ?? [],
                experience_years: extra?.experienceYears ?? "신입",
              });
            if (freelancerError) throw freelancerError;
          }

          // 4. 상태 업데이트
          const newUser: User = {
            id: data.user.id,
            email: data.user.email!,
            user_id: userId,
            user_type: role,
            name: extra?.nickname ?? userId,
          };
          set({ user: newUser, isLoggedIn: true });
        } catch (err) {
          console.error("Signup error:", err);
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        const supabase = createClient();
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;
          if (!data.user) throw new Error("로그인에 실패했습니다.");

          // 추가 정보(이름 등) 조회를 위해 프로필 테이블도 함께 로드 시도
          let nickname = data.user.user_metadata?.user_id ?? "사용자";
          const userRole = data.user.user_metadata?.user_type ?? "client";

          if (userRole === "freelancer") {
            const { data: profile } = await supabase
              .from("freelancers")
              .select("nickname")
              .eq("id", data.user.id)
              .single();
            if (profile?.nickname) nickname = profile.nickname;
          }

          const loggedInUser: User = {
            id: data.user.id,
            email: data.user.email!,
            user_id: data.user.user_metadata?.user_id ?? "user",
            user_type: userRole,
            name: nickname,
          };
          set({ user: loggedInUser, isLoggedIn: true });
        } catch (err) {
          console.error("Login error:", err);
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        const supabase = createClient();
        try {
          await supabase.auth.signOut();
        } catch (err) {
          console.error("Logout error:", err);
        } finally {
          set({ user: null, isLoggedIn: false });
        }
      },

      initialize: async () => {
        const supabase = createClient();
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            let nickname = session.user.user_metadata?.user_id ?? "사용자";
            const userRole = session.user.user_metadata?.user_type ?? "client";

            if (userRole === "freelancer") {
              const { data: profile } = await supabase
                .from("freelancers")
                .select("nickname")
                .eq("id", session.user.id)
                .single();
              if (profile?.nickname) nickname = profile.nickname;
            }

            const currentUser: User = {
              id: session.user.id,
              email: session.user.email!,
              user_id: session.user.user_metadata?.user_id ?? "user",
              user_type: userRole,
              name: nickname,
            };
            set({ user: currentUser, isLoggedIn: true });
          } else {
            set({ user: DEFAULT_USER, isLoggedIn: true });
          }
        } catch (err) {
          console.error("Auth initialization error:", err);
        }
      },

      mockLogin: (name, role) => {
        set({
          user: {
            id: "mock-id",
            email: `${name}@mock.com`,
            user_id: name,
            user_type: role,
            name: name,
          },
          isLoggedIn: true,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

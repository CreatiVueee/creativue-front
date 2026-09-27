import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/shared/lib/supabase/client";
import { fetchClientByUserId, fetchFreelancerByUserId } from "@/shared/lib/supabase/queries";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// ⏳ 나중에: 로그인/회원가입 API가 실제 DB에 안정적으로 붙으면 .env.local에서
// NEXT_PUBLIC_USE_MOCK_AUTH를 제거(또는 false)하면 즉시 실제 Supabase 인증으로 복귀한다.
export const IS_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "client" | "freelancer";

export interface User {
  id: string;
  email: string;
  user_id: string;
  user_type: UserRole;
  name: string;
  displayName?: string;
}

export interface AuthUser {
  id: string;           // auth.users.id (UUID)
  email: string;
  displayName: string;  // 클라이언트: 아이디, 프리랜서: 닉네임
}

interface AuthState {
  user: User | AuthUser | null;
  role: UserRole | null;
  profileId: string | null;  // clients.id 또는 freelancers.id (=== auth.users.id)
  isLoggedIn: boolean;
  isInitialized: boolean;    // 세션 복원 완료 여부 (새로고침 후 깜빡임 방지)
  isLoading: boolean;
}

interface AuthActions {
  signUp: (email: string, password: string, userId: string, role: UserRole, extra?: Record<string, unknown>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  setAuth: (user: AuthUser, role: UserRole, profileId: string) => void;
  clearAuth: () => void;
  /** Mock 모드 전용: 실제 Supabase 호출 없이 즉시 로그인 상태로 전환 */
  mockLogin: (name: string, role: UserRole) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getAuthErrorMessage(message: string): string {
  if (message.includes("Invalid login credentials")) return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (message.includes("Email not confirmed"))       return "이메일 인증이 필요합니다. 받은 편지함을 확인해주세요.";
  if (message.includes("User already registered") || message.includes("already exists")) return "이미 가입된 이메일 주소입니다. 해당 계정으로 로그인하시거나 다른 이메일로 시도해 주세요.";
  if (message.includes("Password should be at least")) return "비밀번호는 6자 이상이어야 합니다.";
  if (message.includes("Unable to validate email")) return "올바른 이메일 형식을 입력해주세요.";
  return message;
}

/** auth.users 정보로 role + profileId 결정 후 store 업데이트 */
export async function resolveAndSetAuth(
  user: SupabaseUser,
  setAuth: AuthActions["setAuth"],
  clearAuth: AuthActions["clearAuth"]
) {
  const displayName = (user.user_metadata?.display_name as string | undefined)
    ?? user.email?.split("@")[0]
    ?? "";

  const client = await fetchClientByUserId(user.id);
  if (client) {
    setAuth({ id: user.id, email: user.email!, displayName }, "client", client.id);
    return;
  }

  const freelancer = await fetchFreelancerByUserId(user.id);
  if (freelancer) {
    setAuth(
      { id: user.id, email: user.email!, displayName: freelancer.nickname },
      "freelancer",
      freelancer.id
    );
    return;
  }

  // auth 계정은 있는데 프로필 테이블에 없는 경우 (가입 도중 실패)
  clearAuth();
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      profileId: null,
      isLoggedIn: false,
      isInitialized: false,
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
              phone_number: (extra?.phone as string | null | undefined) ?? null,
              user_type: role,
            });
          if (profileError) throw profileError;

          // 3. 가입 성격(Role)에 따른 서브 프로필 테이블 추가 인서트
          if (role === "client") {
            const { error: clientError } = await supabase
              .from("clients")
              .insert({
                id: data.user.id,
                interested_fields: (extra?.interestedFields as string[] | undefined) ?? [],
              });
            if (clientError) throw clientError;
          } else if (role === "freelancer") {
            const { error: freelancerError } = await supabase
              .from("freelancers")
              .insert({
                id: data.user.id,
                nickname: (extra?.nickname as string | undefined) ?? userId,
                profile_url: (extra?.profileUrl as string | undefined) ?? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
                role: (extra?.role as string | undefined) ?? "designer",
                main_expertise: (extra?.mainExpertise as string[] | undefined) ?? [],
                experience_years: (extra?.experienceYears as string | undefined) ?? "신입",
              });
            if (freelancerError) throw freelancerError;
          }

          // 4. 상태 업데이트
          const newUser: User = {
            id: data.user.id,
            email: data.user.email!,
            user_id: userId,
            user_type: role,
            name: (extra?.nickname as string | undefined) ?? userId,
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

          // 1. 공통 프로필 테이블에서 user_id 조회
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("user_id")
            .eq("id", data.user.id)
            .single();
          if (profile?.user_id) {
            nickname = profile.user_id;
          }

          // 2. 프리랜서인 경우 freelancers 테이블의 nickname 조회 (있을 경우 덮어씌움)
          if (userRole === "freelancer") {
            const { data: freelancerProfile } = await supabase
              .from("freelancers")
              .select("nickname")
              .eq("id", data.user.id)
              .single();
            if (freelancerProfile?.nickname) {
              nickname = freelancerProfile.nickname;
            }
          }

          const loggedInUser: User = {
            id: data.user.id,
            email: data.user.email!,
            user_id: nickname,
            user_type: userRole,
            name: nickname,
          };
          set({ user: loggedInUser, isLoggedIn: true });
        } catch (err) {
          console.error("Login error:", err);
          set({ user: null, isLoggedIn: false });
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

            // 1. 공통 프로필 테이블에서 user_id 조회
            const { data: profile } = await supabase
              .from("user_profiles")
              .select("user_id")
              .eq("id", session.user.id)
              .single();
            if (profile?.user_id) {
              nickname = profile.user_id;
            }

            // 2. 프리랜서인 경우 freelancers 테이블의 nickname 조회
            if (userRole === "freelancer") {
              const { data: freelancerProfile } = await supabase
                .from("freelancers")
                .select("nickname")
                .eq("id", session.user.id)
                .single();
              if (freelancerProfile?.nickname) {
                nickname = freelancerProfile.nickname;
              }
            }

            const currentUser: User = {
              id: session.user.id,
              email: session.user.email!,
              user_id: nickname,
              user_type: userRole,
              name: nickname,
            };
            set({ user: currentUser, isLoggedIn: true });
          } else {
            set({ user: null, isLoggedIn: false });
          }
        } catch (err) {
          console.error("Auth initialization error:", err);
        }
      },

      setAuth: (user, role, profileId) => {
        set({ user, role, profileId, isLoggedIn: true, isInitialized: true });
      },

      clearAuth: () => {
        set({ user: null, role: null, profileId: null, isLoggedIn: false, isInitialized: true });
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

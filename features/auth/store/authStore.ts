import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/shared/lib/supabase/client";
import { fetchClientByUserId, fetchFreelancerByUserId } from "@/shared/lib/supabase/queries";
import type { User } from "@supabase/supabase-js";

// ⏳ 나중에: 로그인/회원가입 API가 실제 DB에 안정적으로 붙으면 .env.local에서
// NEXT_PUBLIC_USE_MOCK_AUTH를 제거(또는 false)하면 즉시 실제 Supabase 인증으로 복귀한다.
export const IS_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "client" | "freelancer";

export interface AuthUser {
  id: string;           // auth.users.id (UUID)
  email: string;
  displayName: string;  // 클라이언트: 아이디, 프리랜서: 닉네임
}

interface AuthState {
  user: AuthUser | null;
  role: UserRole | null;
  profileId: string | null;  // clients.id 또는 freelancers.id (=== auth.users.id)
  isLoggedIn: boolean;
  isInitialized: boolean;    // 세션 복원 완료 여부 (새로고침 후 깜빡임 방지)
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setAuth: (user: AuthUser, role: UserRole, profileId: string) => void;
  clearAuth: () => void;
  /** Mock 모드 전용: 실제 Supabase 호출 없이 즉시 로그인 상태로 전환 */
  mockLogin: (name: string, role: UserRole) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getAuthErrorMessage(message: string): string {
  if (message.includes("Invalid login credentials")) return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (message.includes("Email not confirmed"))       return "이메일 인증이 필요합니다. 받은 편지함을 확인해주세요.";
  if (message.includes("User already registered"))   return "이미 가입된 이메일입니다.";
  if (message.includes("Password should be at least")) return "비밀번호는 6자 이상이어야 합니다.";
  if (message.includes("Unable to validate email")) return "올바른 이메일 형식을 입력해주세요.";
  return message;
}

/** auth.users 정보로 role + profileId 결정 후 store 업데이트 */
export async function resolveAndSetAuth(
  user: User,
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

const storeCreator: StateCreator<AuthState & AuthActions> = (set, get) => ({
  user: null,
  role: null,
  profileId: null,
  isLoggedIn: false,
  isInitialized: false,

  login: async (email: string, password: string) => {
    if (IS_MOCK_AUTH) {
      // Mock 모드: 이메일에 "freelancer"가 포함되면 프리랜서로, 아니면 클라이언트로 간주
      const role: UserRole = email.includes("freelancer") ? "freelancer" : "client";
      get().mockLogin(email.split("@")[0] || "테스트유저", role);
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(getAuthErrorMessage(error.message));

    await resolveAndSetAuth(data.user, get().setAuth, get().clearAuth);
  },

  logout: async () => {
    if (IS_MOCK_AUTH) {
      set({ user: null, role: null, profileId: null, isLoggedIn: false });
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, role: null, profileId: null, isLoggedIn: false });
  },

  setAuth: (user: AuthUser, role: UserRole, profileId: string) => {
    set({ user, role, profileId, isLoggedIn: true, isInitialized: true });
  },

  clearAuth: () => {
    set({ user: null, role: null, profileId: null, isLoggedIn: false, isInitialized: true });
  },

  mockLogin: (name: string, role: UserRole) => {
    const profileId = `mock-${role}-${Date.now()}`;
    set({
      user: { id: profileId, email: `${name}@mock.local`, displayName: name },
      role,
      profileId,
      isLoggedIn: true,
      isInitialized: true,
    });
  },
});

export const useAuthStore = IS_MOCK_AUTH
  ? create<AuthState & AuthActions>()(
      persist(storeCreator, { name: "auth-storage-mock" })
    )
  : create<AuthState & AuthActions>()(storeCreator);

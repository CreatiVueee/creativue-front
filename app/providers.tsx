"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/shared/lib/supabase/client";
import { useAuthStore, resolveAndSetAuth, IS_MOCK_AUTH } from "@/features/auth/store/authStore";

const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then((mod) => ({
      default: mod.ReactQueryDevtools,
    })),
  { ssr: false }
);

// ─── AuthInitializer ──────────────────────────────────────────────────────────
// 앱 마운트 시 Supabase 세션을 확인해 authStore를 복원한다.
// 새로고침 후에도 로그인 상태가 유지된다.

function AuthInitializer() {
  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    // Mock 모드에서는 authStore(persist)가 로그인 상태를 직접 관리하므로 스킵
    if (IS_MOCK_AUTH) return;

    const supabase = createClient();

    async function restore(user: User) {
      await resolveAndSetAuth(user, setAuth, clearAuth);
    }

    // 현재 세션 즉시 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        restore(session.user);
      } else {
        clearAuth();
      }
    });

    // 탭 전환·토큰 갱신·타 탭 로그아웃 등 세션 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          clearAuth();
        } else if (
          (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") &&
          session?.user
        ) {
          restore(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setAuth, clearAuth]);

  return null;
}

// ─── Providers ────────────────────────────────────────────────────────────────

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

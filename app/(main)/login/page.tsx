"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff, Sparkles, ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { mockLogin } = useAuthStore();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }
    setError("");
    setIsLoading(true);

    // ⏳ 나중에: supabase.auth.signInWithPassword 로 교체
    setTimeout(() => {
      mockLogin("사용자", "client");
      router.push("/client-profile");
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-gray-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* 배경 orb */}
      <div
        className="fixed -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #b26efd, #f3b0f2)" }}
      />
      <div
        className="fixed -bottom-24 -left-24 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #93b5f6, #b26efd)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* 브랜드 배지 */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{ background: "linear-gradient(135deg, #f3b0f2 0%, #b26efd 55%, #93b5f6 100%)" }}
          >
            <Sparkles size={15} className="text-white" />
            <span className="text-white text-sm font-extrabold tracking-tight">CreatiVue</span>
          </div>
          <h1 className="text-gray-900 font-extrabold text-3xl tracking-tight mb-1">
            다시 만나요 👋
          </h1>
          <p className="text-gray-400 text-sm">계정에 로그인해 공모전을 시작하세요</p>
        </div>

        {/* 카드 */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-7 py-8 space-y-5">

          {/* 에러 메시지 */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl px-4 py-3 text-sm font-semibold"
                style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fca5a5" }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 */}
            <div>
              <label className="block text-xs text-gray-500 font-semibold mb-1.5">
                이메일
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  disabled={isLoading}
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-gray-800 outline-none transition-all"
                  style={{ border: "1.5px solid #e5e7eb", background: "#fafafa", fontWeight: 500 }}
                  onFocus={(e) => (e.target.style.borderColor = "#b26efd")}
                  onBlur={(e)  => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-xs text-gray-500 font-semibold mb-1.5">
                비밀번호
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full pl-9 pr-10 py-3 rounded-xl text-sm text-gray-800 outline-none transition-all"
                  style={{ border: "1.5px solid #e5e7eb", background: "#fafafa", fontWeight: 500 }}
                  onFocus={(e) => (e.target.style.borderColor = "#b26efd")}
                  onBlur={(e)  => (e.target.style.borderColor = "#e5e7eb")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400 transition-colors"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                {/* ⏳ 나중에: 비밀번호 찾기 기능 연동 */}
                <button
                  type="button"
                  className="text-xs font-semibold transition-colors hover:opacity-80"
                  style={{ color: "#b26efd" }}
                >
                  비밀번호 찾기
                </button>
              </div>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white flex items-center justify-center gap-2 font-bold text-[0.95rem] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-75"
              style={{ background: "linear-gradient(135deg, #f3b0f2 0%, #b26efd 55%, #93b5f6 100%)" }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  로그인 중...
                </>
              ) : (
                <>
                  로그인
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* 구분선 */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-300 font-semibold">또는</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Google 로그인 (UI만 — 기능 추후 연동) */}
          <button
            type="button"
            disabled
            className="w-full py-3 rounded-xl text-sm text-gray-400 flex items-center justify-center gap-2.5 cursor-not-allowed"
            style={{ border: "1.5px solid #e5e7eb", fontWeight: 600, background: "#fafafa" }}
            title="Google 로그인은 추후 지원 예정입니다"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google로 계속하기
          </button>
        </div>

        {/* 가입 링크 */}
        <p className="text-center text-sm text-gray-400 mt-6">
          아직 계정이 없으신가요?{" "}
          <Link
            href="/client-signup"
            className="font-bold transition-colors hover:opacity-80"
            style={{ color: "#b26efd" }}
          >
            클라이언트 가입
          </Link>
          {" · "}
          <Link
            href="/freelancer-signup"
            className="font-bold transition-colors hover:opacity-80"
            style={{ color: "#93b5f6" }}
          >
            프리랜서 가입
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

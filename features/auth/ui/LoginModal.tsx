"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  X, LogIn, Mail, Lock, Eye, EyeOff, Sparkles, UserPlus,
} from "lucide-react";
import { useLoginModalStore } from "@/features/auth/store/loginModalStore";
import { useAuthStore } from "@/features/auth/store/authStore";

// ─── LoginModal ───────────────────────────────────────────────────────────────

export function LoginModal() {
  const router = useRouter();
  const { isOpen, redirectPath, close } = useLoginModalStore();
  const { mockLogin } = useAuthStore();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setShowPw(false);
    setError("");
    setIsLoading(false);
  };

  const handleClose = () => {
    close();
    resetForm();
  };

  const handleLogin = () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }
    setError("");
    setIsLoading(true);

    // ⏳ 나중에: supabase.auth.signInWithPassword 로 교체
    setTimeout(() => {
      mockLogin("사용자", "client");
      close();
      resetForm();
      if (redirectPath) router.push(redirectPath);
    }, 1000);
  };

  const handleSignup = () => {
    close();
    router.push("/client-signup");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 백드롭 */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* 모달 */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 pointer-events-auto relative"
              style={{ border: "1.5px solid #e9d5ff" }}
            >
              {/* 닫기 */}
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
              >
                <X size={16} />
              </button>

              {/* 헤더 */}
              <div className="text-center mb-8">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4 text-white font-bold"
                  style={{ background: "linear-gradient(135deg, #f3b0f2, #b26efd)" }}
                >
                  Start your brand with CreatiVue
                  <Sparkles size={11} />
                </div>
                <h2 className="text-gray-900 text-2xl font-extrabold tracking-tight mb-1">
                  로그인
                </h2>
                <p className="text-gray-400 text-sm">
                  {redirectPath === "/brand-review"
                    ? "브랜드 리뷰를 시작하려면 로그인이 필요해요 🎨"
                    : "계속하려면 로그인해 주세요"}
                </p>
              </div>

              {/* 폼 */}
              <div className="space-y-4 mb-6">
                {/* 이메일 */}
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1.5">
                    이메일
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="example@email.com"
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-gray-800 outline-none transition-all"
                      style={{ border: "1.5px solid #e9d5ff", background: "#fdfaff" }}
                      onFocus={(e)  => (e.currentTarget.style.borderColor = "#b26efd")}
                      onBlur={(e)   => (e.currentTarget.style.borderColor = "#e9d5ff")}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                  </div>
                </div>

                {/* 비밀번호 */}
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1.5">
                    비밀번호
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      placeholder="비밀번호를 입력해 주세요"
                      disabled={isLoading}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-gray-800 outline-none transition-all"
                      style={{ border: "1.5px solid #e9d5ff", background: "#fdfaff" }}
                      onFocus={(e)  => (e.currentTarget.style.borderColor = "#b26efd")}
                      onBlur={(e)   => (e.currentTarget.style.borderColor = "#e9d5ff")}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* 에러 메시지 */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-red-400 text-center"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* 로그인 버튼 */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-bold mb-4 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-75"
                style={{ background: "linear-gradient(135deg, #f3b0f2, #b26efd)" }}
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
                    <LogIn size={16} />
                    로그인
                  </>
                )}
              </button>

              {/* 구분선 */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-300">또는</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* 회원가입 CTA */}
              <div
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer group transition-all hover:shadow-sm"
                style={{ background: "linear-gradient(135deg, #fdf4ff, #ede9fe)", border: "1.5px solid #e9d5ff" }}
                onClick={handleSignup}
              >
                <div>
                  <p className="text-xs text-gray-500 font-semibold">아직 계정이 없으신가요?</p>
                  <p className="text-xs text-gray-400 mt-0.5">클라이언트로 가입하고 전문가를 만나보세요</p>
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white font-bold transition-all group-hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #f3b0f2, #b26efd)" }}
                >
                  <UserPlus size={13} />
                  회원가입
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

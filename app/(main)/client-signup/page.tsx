"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft, ArrowRight, User, Mail, Phone,
  Sparkles, CheckCircle2, Gift, ShieldCheck, Zap, Star,
  type LucideIcon,
} from "lucide-react";
import { PasswordInput }      from "@/shared/components/ui/PasswordInput";
import { ChipButton }         from "@/shared/components/ui/ChipButton";
import { SignupSuccessModal } from "@/features/auth/ui/SignupSuccessModal";
import { useAuthStore }       from "@/features/auth/store/authStore";

// ── Constants ─────────────────────────────────────────────────────────────────

const SERVICE_OPTIONS = [
  { value: "brand_strategy", label: "🧭 브랜드 전략" },
  { value: "logo",           label: "🎨 로고" },
  { value: "digital_ad",     label: "📱 디지털 광고" },
  { value: "poster",         label: "🖼️ 포스터 템플릿" },
  { value: "product_design", label: "📦 제품 디자인" },
  { value: "etc",            label: "✨ 기타 콘텐츠" },
] as const;

const BENEFITS: { icon: LucideIcon; title: string; desc: string; color: string }[] = [
  {
    icon: Gift,
    title: "첫 프로젝트 수수료 0%",
    desc: "가입 후 첫 프로젝트는 플랫폼 수수료 없이 진행할 수 있어요.",
    color: "#f3b0f2",
  },
  {
    icon: ShieldCheck,
    title: "에스크로 안전 결제",
    desc: "결제금은 결과물 확인 후 지급돼 안전하게 거래할 수 있어요.",
    color: "#b26efd",
  },
  {
    icon: Zap,
    title: "전문가 매칭 24h 이내",
    desc: "요청 후 24시간 안에 최적의 전문가를 연결해 드려요.",
    color: "#93b5f6",
  },
  {
    icon: Star,
    title: "재협업 최소 수수료",
    desc: "같은 전문가와 재협업 시 플랫폼 최저 수수료 혜택을 드려요.",
    color: "#fbbf24",
  },
];

// ── Input style helpers ───────────────────────────────────────────────────────

const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.currentTarget.style.borderColor = "#b26efd");
const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.currentTarget.style.borderColor = "#e9d5ff");
const INPUT_CLASS =
  "w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-gray-800 outline-none transition-all";
const INPUT_STYLE: React.CSSProperties = {
  border: "1.5px solid #e9d5ff",
  background: "#fff",
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ClientSignupPage() {
  const router = useRouter();
  const { mockLogin } = useAuthStore();

  const [userId,           setUserId]           = useState("");
  const [password,         setPassword]         = useState("");
  const [passwordConfirm,  setPasswordConfirm]  = useState("");
  const [email,            setEmail]            = useState("");
  const [phone,            setPhone]            = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [agreed,           setAgreed]           = useState(false);
  const [showModal,        setShowModal]        = useState(false);

  const pwMismatch =
    passwordConfirm.length > 0 && password !== passwordConfirm;

  const isReady =
    Boolean(userId && password && passwordConfirm && !pwMismatch && email && phone) &&
    selectedServices.length > 0 &&
    agreed;

  const toggleService = (val: string) =>
    setSelectedServices((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );

  const handleSubmit = () => {
    if (!isReady) return;
    // ⏳ 나중에: supabase.auth.signUp + profiles(role:'client') insert 교체
    mockLogin(userId, "client");
    setShowModal(true);
  };

  return (
    <div
      className="min-h-[calc(100vh-68px)] flex items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fdf4ff 0%, #ede9fe 50%, #dbeafe 100%)" }}
    >
      {/* 배경 블롭 */}
      <div
        className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: "linear-gradient(135deg, #f3b0f2, #b26efd)" }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "linear-gradient(135deg, #93b5f6, #b26efd)" }}
      />

      <div className="relative w-full max-w-5xl">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors"
        >
          <ChevronLeft size={15} />
          홈으로
        </button>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden"
          style={{ border: "1.5px solid #e9d5ff" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr]">

            {/* ── 왼쪽 패널 — 입력 폼 ── */}
            <div
              className="flex flex-col p-10"
              style={{
                borderRight: "1.5px solid #e9d5ff",
                background: "linear-gradient(160deg, #fdf4ff 0%, #ede9fe 100%)",
              }}
            >
              <div className="mb-7">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs text-white font-bold mb-5"
                  style={{ background: "linear-gradient(135deg, #f3b0f2, #b26efd)" }}
                >
                  <Sparkles size={11} />
                  클라이언트 가입
                </div>
                <h1
                  className="text-gray-900 font-extrabold leading-tight mb-3"
                  style={{ fontSize: "1.55rem", letterSpacing: "-0.02em" }}
                >
                  브랜드의 성장을<br />함께해요 🚀
                </h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  브랜드를 가장 잘 아는 사람이 만들고<br />
                  전문가, 창작자의 시선이 만나는 곳, CreatiVue
                </p>
              </div>

              <div className="space-y-3 flex-1">
                {/* 아이디 */}
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1.5">
                    아이디 <span style={{ color: "#b26efd" }}>*</span>
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="아이디를 입력해 주세요"
                      className={INPUT_CLASS}
                      style={INPUT_STYLE}
                      onFocus={onInputFocus}
                      onBlur={onInputBlur}
                    />
                  </div>
                </div>

                {/* 비밀번호 */}
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1.5">
                    비밀번호 <span style={{ color: "#b26efd" }}>*</span>
                  </label>
                  <PasswordInput
                    value={password}
                    onChange={setPassword}
                    placeholder="8자 이상 입력해 주세요"
                  />
                </div>

                {/* 비밀번호 확인 */}
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1.5">
                    비밀번호 확인 <span style={{ color: "#b26efd" }}>*</span>
                  </label>
                  <PasswordInput
                    value={passwordConfirm}
                    onChange={setPasswordConfirm}
                    placeholder="비밀번호를 다시 입력해 주세요"
                    hasError={pwMismatch}
                  />
                  <AnimatePresence>
                    {pwMismatch && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[11px] text-red-400 mt-1.5 font-medium"
                      >
                        비밀번호가 일치하지 않아요.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* 이메일 */}
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1.5">
                    이메일 <span style={{ color: "#b26efd" }}>*</span>
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      className={INPUT_CLASS}
                      style={INPUT_STYLE}
                      onFocus={onInputFocus}
                      onBlur={onInputBlur}
                    />
                  </div>
                </div>

                {/* 연락처 */}
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1.5">
                    연락처 <span style={{ color: "#b26efd" }}>*</span>
                  </label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010-0000-0000"
                      className={INPUT_CLASS}
                      style={INPUT_STYLE}
                      onFocus={onInputFocus}
                      onBlur={onInputBlur}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── 오른쪽 패널 — 서비스 선택 + 혜택 + 제출 ── */}
            <div className="p-10 flex flex-col">

              {/* 서비스 다중선택 */}
              <div className="mb-7">
                <h2 className="text-gray-800 font-extrabold text-lg mb-1">
                  필요한 서비스를 선택해 주세요
                </h2>
                <p className="text-xs text-gray-400 mb-4">관심 있는 분야를 복수 선택할 수 있어요.</p>
                <label className="block text-xs text-gray-500 font-semibold mb-3">
                  주요 목적 <span style={{ color: "#b26efd" }}>*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {SERVICE_OPTIONS.map((opt) => (
                    <ChipButton
                      key={opt.value}
                      active={selectedServices.includes(opt.value)}
                      onClick={() => toggleService(opt.value)}
                      variant="light"
                      showCheckIcon
                      className="px-4 py-3 text-sm"
                    >
                      {opt.label}
                    </ChipButton>
                  ))}
                </div>
                {selectedServices.length > 0 && (
                  <p className="text-[11px] mt-2 font-semibold" style={{ color: "#b26efd" }}>
                    {selectedServices.length}개 선택됨 ✓
                  </p>
                )}
              </div>

              {/* 혜택 카드 (2×2) */}
              <div className="mb-7">
                <h3 className="text-xs text-gray-500 font-bold mb-3">🎁 CreatiVue 가입 혜택</h3>
                <div className="grid grid-cols-2 gap-2">
                  {BENEFITS.map(({ icon: Icon, title, desc, color }) => (
                    <div
                      key={title}
                      className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
                      style={{ background: "#fafafa", border: "1.5px solid #f3e8ff" }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${color}22` }}
                      >
                        <Icon size={13} style={{ color }} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-700 font-bold leading-snug">{title}</p>
                        <p className="text-[10.5px] text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 약관 동의 + 제출 */}
              <div className="mt-auto space-y-3">
                <div
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() => setAgreed((v) => !v)}
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                    style={{
                      border: `1.5px solid ${agreed ? "#b26efd" : "#e9d5ff"}`,
                      background: agreed
                        ? "linear-gradient(135deg, #f3b0f2, #b26efd)"
                        : "#fff",
                    }}
                  >
                    {agreed && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                  <span className="text-xs text-gray-500 leading-relaxed select-none">
                    <span style={{ color: "#b26efd", fontWeight: 700 }}>이용약관</span> 및{" "}
                    <span style={{ color: "#b26efd", fontWeight: 700 }}>개인정보 처리방침</span>에 동의합니다. (필수)
                  </span>
                </div>

                <button
                  type="button"
                  disabled={!isReady}
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-[0.98]"
                  style={{
                    background: isReady
                      ? "linear-gradient(135deg, #f3b0f2, #b26efd)"
                      : "#e5e7eb",
                    color: isReady ? "#fff" : "#9ca3af",
                    cursor: isReady ? "pointer" : "not-allowed",
                  }}
                >
                  가입 완료하기
                  <ArrowRight size={15} />
                </button>

                <p className="text-center text-[11px] text-gray-400">
                  이미 계정이 있으신가요?{" "}
                  <Link href="/login" className="font-bold" style={{ color: "#b26efd" }}>
                    로그인하기
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <SignupSuccessModal
        isOpen={showModal}
        onBrandReview={() => router.push("/brand-review")}
        onLater={() => router.push("/")}
      />
    </div>
  );
}

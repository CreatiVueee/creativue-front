"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft, ArrowRight, Sparkles,
  BrainCircuit, Palette, CheckCircle2,
  ShieldCheck, Clock, AlertCircle, Trophy,
} from "lucide-react";
import { ChipButton }   from "@/shared/components/ui/ChipButton";
import { FileDropzone } from "@/shared/components/ui/FileDropzone";
import { useAuthStore } from "@/features/auth/store/authStore";

// ── Constants ─────────────────────────────────────────────────────────────────

type FreelancerRole = "expert" | "creator" | null;

const CAREER_OPTIONS = [
  { value: "0-1", label: "0 ~ 1년" },
  { value: "1-2", label: "1 ~ 2년" },
  { value: "3-5", label: "3 ~ 5년" },
  { value: "5+",  label: "5년 이상" },
] as const;

const CREATOR_CATEGORIES = [
  { value: "logo",      label: "🎨 로고" },
  { value: "naming",    label: "✏️ 네이밍" },
  { value: "package",   label: "📦 패키지" },
  { value: "poster",    label: "🖼️ 포스터" },
  { value: "video",     label: "🎬 영상" },
  { value: "sns",       label: "📱 SNS 콘텐츠" },
  { value: "ui",        label: "💻 UI/UX" },
  { value: "character", label: "🐣 캐릭터/일러스트" },
] as const;

// ── Input style helpers ───────────────────────────────────────────────────────

const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.currentTarget.style.borderColor = "#b26efd");
const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.currentTarget.style.borderColor = "#e9d5ff");
const INPUT_CLASS =
  "w-full px-4 py-2.5 rounded-xl text-sm text-gray-800 outline-none transition-all";
const INPUT_STYLE: React.CSSProperties = {
  border: "1.5px solid #e9d5ff",
  background: "#fff",
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FreelancerSignupPage() {
  const router = useRouter();
  const { mockLogin } = useAuthStore();

  // 공통 필드
  const [nickname, setNickname] = useState("");
  const [email,    setEmail]    = useState("");
  const [role,     setRole]     = useState<FreelancerRole>(null);

  // 브랜딩 전문가 필드
  const [career,   setCareer]   = useState("");
  const [certFile, setCertFile] = useState<File | null>(null);

  // 창작자 필드
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (val: string) =>
    setSelectedCategories((prev) =>
      prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]
    );

  const expertReady  = Boolean(nickname && email && career && certFile);
  const creatorReady = Boolean(nickname && email && selectedCategories.length > 0);

  const handleExpertSubmit = () => {
    if (!expertReady) return;
    // ⏳ 나중에: profiles(role:'freelancer') insert 교체
    mockLogin(nickname, "freelancer");
    router.push("/projects");
  };

  const handleCreatorSubmit = () => {
    if (!creatorReady) return;
    // ⏳ 나중에: profiles(role:'freelancer') insert 교체
    mockLogin(nickname, "freelancer");
    router.push("/projects");
  };

  return (
    <div
      className="min-h-[calc(100vh-68px)] flex items-center justify-center px-4 py-16 relative overflow-hidden"
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

      <div className="relative w-full max-w-6xl">
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
          transition={{ duration: 0.45 }}
          className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden"
          style={{ border: "1.5px solid #e9d5ff" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr]">

            {/* ── 왼쪽 패널 — 공통 필드 + 역할 선택 ── */}
            <div
              className="flex flex-col p-10"
              style={{
                borderRight: "1.5px solid #e9d5ff",
                background: "linear-gradient(160deg, #fdf4ff 0%, #ede9fe 100%)",
              }}
            >
              <div className="mb-10">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs text-white font-bold mb-5"
                  style={{ background: "linear-gradient(135deg, #f3b0f2, #b26efd)" }}
                >
                  <Sparkles size={11} />
                  프리랜서 등록
                </div>
                <h1
                  className="text-gray-900 font-extrabold leading-tight mb-2"
                  style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}
                >
                  CreatiVue에<br />합류하세요 🎉
                </h1>
                <p className="text-gray-400 text-sm mt-3">
                  역할을 선택하고, 당신만의 커리어를 시작해요!
                </p>
              </div>

              {/* 공통 입력 */}
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1.5">
                    닉네임 <span className="text-[#b26efd]">*</span>
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="활동명을 입력해 주세요"
                    className={INPUT_CLASS}
                    style={INPUT_STYLE}
                    onFocus={onInputFocus}
                    onBlur={onInputBlur}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1.5">
                    이메일 주소 <span className="text-[#b26efd]">*</span>
                  </label>
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

              {/* 역할 선택 */}
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-3">
                  역할 선택 <span className="text-[#b26efd]">*</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {/* 브랜딩 전문가 */}
                  <button
                    type="button"
                    onClick={() => setRole("expert")}
                    className="relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all"
                    style={{
                      borderColor: role === "expert" ? "#b26efd" : "#e9d5ff",
                      background: role === "expert"
                        ? "linear-gradient(135deg, #f9f0ff, #ede9fe)"
                        : "#fff",
                    }}
                  >
                    {role === "expert" && (
                      <CheckCircle2
                        size={15}
                        className="absolute top-2.5 right-2.5"
                        style={{ color: "#b26efd" }}
                      />
                    )}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: role === "expert"
                          ? "linear-gradient(135deg, #b26efd, #93b5f6)"
                          : "#f3e8ff",
                      }}
                    >
                      <BrainCircuit
                        size={22}
                        style={{ color: role === "expert" ? "#fff" : "#b26efd" }}
                      />
                    </div>
                    <span
                      className="text-xs text-center font-bold"
                      style={{ color: role === "expert" ? "#7c3aed" : "#374151" }}
                    >
                      브랜딩 전문가
                    </span>
                    <span className="text-[10px] text-gray-400 text-center leading-tight">
                      브랜드 전략·컨설팅
                    </span>
                  </button>

                  {/* 창작자 */}
                  <button
                    type="button"
                    onClick={() => setRole("creator")}
                    className="relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all"
                    style={{
                      borderColor: role === "creator" ? "#b26efd" : "#e9d5ff",
                      background: role === "creator"
                        ? "linear-gradient(135deg, #f9f0ff, #ede9fe)"
                        : "#fff",
                    }}
                  >
                    {role === "creator" && (
                      <CheckCircle2
                        size={15}
                        className="absolute top-2.5 right-2.5"
                        style={{ color: "#b26efd" }}
                      />
                    )}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: role === "creator"
                          ? "linear-gradient(135deg, #f3b0f2, #b26efd)"
                          : "#fce7f3",
                      }}
                    >
                      <Palette
                        size={22}
                        style={{ color: role === "creator" ? "#fff" : "#ec4899" }}
                      />
                    </div>
                    <span
                      className="text-xs text-center font-bold"
                      style={{ color: role === "creator" ? "#7c3aed" : "#374151" }}
                    >
                      창작자
                    </span>
                    <span className="text-[10px] text-gray-400 text-center leading-tight">
                      디자인·영상·콘텐츠
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── 오른쪽 패널 — 역할별 폼 ── */}
            <div className="p-10 flex flex-col min-h-[440px]">
              <AnimatePresence mode="wait">

                {/* 역할 미선택 상태 */}
                {!role && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center text-center gap-4"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="w-20 h-20 rounded-2xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #f3b0f2, #b26efd, #93b5f6)" }}
                    >
                      <span className="text-4xl">👈</span>
                    </motion.div>
                    <p className="text-gray-400 text-sm">
                      왼쪽에서 역할을 선택하면<br />추가 정보를 입력할 수 있어요!
                    </p>
                  </motion.div>
                )}

                {/* 브랜딩 전문가 폼 */}
                {role === "expert" && (
                  <motion.div
                    key="expert"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 flex-1 flex flex-col"
                  >
                    <div>
                      <h2 className="text-gray-800 font-extrabold text-lg mb-1">브랜딩 전문가 정보</h2>
                      <p className="text-xs text-gray-400">전문성 검증을 위해 아래 정보를 입력해 주세요.</p>
                    </div>

                    {/* 경력 기간 */}
                    <div>
                      <label className="block text-xs text-gray-500 font-semibold mb-2.5">
                        경력 기간 <span className="text-[#b26efd]">*</span>
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {CAREER_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setCareer(opt.value)}
                            className="py-2.5 rounded-xl text-xs transition-all"
                            style={{
                              border: `1.5px solid ${career === opt.value ? "#b26efd" : "#e9d5ff"}`,
                              background: career === opt.value
                                ? "linear-gradient(135deg, #f3b0f2, #b26efd)"
                                : "#fafafa",
                              color: career === opt.value ? "#fff" : "#6b7280",
                              fontWeight: career === opt.value ? 700 : 500,
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 증명서 첨부 */}
                    <div>
                      <label className="block text-xs text-gray-500 font-semibold mb-2.5">
                        증명서 첨부 <span className="text-[#b26efd]">*</span>
                        <span className="text-gray-300 ml-1.5 font-normal">PDF / JPG / PNG</span>
                      </label>
                      <FileDropzone
                        file={certFile}
                        onFile={setCertFile}
                        onClear={() => setCertFile(null)}
                      />
                    </div>

                    {/* 관리자 승인 안내 박스 */}
                    <div
                      className="flex items-start gap-3 px-4 py-4 rounded-2xl"
                      style={{
                        background: "linear-gradient(135deg, #fdf4ff, #ede9fe)",
                        border: "1.5px solid #d8b4fe",
                      }}
                    >
                      <AlertCircle
                        size={16}
                        style={{ color: "#b26efd", flexShrink: 0, marginTop: 1 }}
                      />
                      <div>
                        <p className="text-xs font-bold" style={{ color: "#7c3aed" }}>
                          관리자 승인 후 활동이 가능합니다
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                          제출한 서류를 검토한 뒤 영업일 기준 1~3일 내에 결과를 이메일로 알려드려요.
                          심사 중에는 일부 기능이 제한될 수 있습니다.
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto space-y-2 pt-2">
                      <button
                        type="button"
                        disabled={!expertReady}
                        onClick={handleExpertSubmit}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-[0.98]"
                        style={{
                          background: expertReady
                            ? "linear-gradient(135deg, #f3b0f2, #b26efd)"
                            : "#e5e7eb",
                          color: expertReady ? "#fff" : "#9ca3af",
                          cursor: expertReady ? "pointer" : "not-allowed",
                        }}
                      >
                        <ShieldCheck size={16} />
                        승인 신청하기
                        <ArrowRight size={14} />
                      </button>
                      <div className="flex items-center justify-center gap-1.5">
                        <Clock size={11} className="text-gray-300" />
                        <p className="text-[10px] text-gray-300">평균 심사 소요 시간: 1~3 영업일</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 창작자 폼 */}
                {role === "creator" && (
                  <motion.div
                    key="creator"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 flex-1 flex flex-col"
                  >
                    <div>
                      <h2 className="text-gray-800 font-extrabold text-lg mb-1">창작자 정보</h2>
                      <p className="text-xs text-gray-400">
                        관심 있는 창작 분야를 선택해 주세요. 복수 선택 가능해요!
                      </p>
                    </div>

                    {/* 창작 분야 (8종 멀티 칩) */}
                    <div>
                      <label className="block text-xs text-gray-500 font-semibold mb-3">
                        주요 분야 선택 <span className="text-[#b26efd]">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {CREATOR_CATEGORIES.map((cat) => (
                          <ChipButton
                            key={cat.value}
                            active={selectedCategories.includes(cat.value)}
                            onClick={() => toggleCategory(cat.value)}
                            variant="solid"
                            className="px-4 py-2 text-xs"
                          >
                            {cat.label}
                          </ChipButton>
                        ))}
                      </div>
                      {selectedCategories.length > 0 && (
                        <p className="text-[11px] mt-2.5 font-semibold" style={{ color: "#b26efd" }}>
                          {selectedCategories.length}개 선택됨 ✓
                        </p>
                      )}
                    </div>

                    {/* 즉시 활동 가능 안내 박스 */}
                    <div
                      className="flex items-start gap-3 px-4 py-4 rounded-2xl"
                      style={{
                        background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                        border: "1.5px solid #86efac",
                      }}
                    >
                      <CheckCircle2
                        size={16}
                        style={{ color: "#16a34a", flexShrink: 0, marginTop: 1 }}
                      />
                      <div>
                        <p className="text-xs font-bold" style={{ color: "#15803d" }}>
                          즉시 활동 가능해요! 🎉
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                          창작자는 별도의 관리자 승인 없이 가입 즉시 공모전에 참여하고
                          제출물을 업로드할 수 있어요.
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-2">
                      <button
                        type="button"
                        disabled={!creatorReady}
                        onClick={handleCreatorSubmit}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-[0.98]"
                        style={{
                          background: creatorReady
                            ? "linear-gradient(135deg, #f3b0f2, #b26efd)"
                            : "#e5e7eb",
                          color: creatorReady ? "#fff" : "#9ca3af",
                          cursor: creatorReady ? "pointer" : "not-allowed",
                        }}
                      >
                        <Trophy size={16} />
                        가입 완료 · 공모전 보러가기
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

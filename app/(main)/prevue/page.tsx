"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { AlertTriangle, Check, CheckCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Trophy } from "lucide-react";
import { submissions } from "@/data/submissions";
import type { Submission } from "@/shared/types";

// 기획 의도: 톤&매너 / 카피라이팅 / 추가 설명 3섹션만 노출
const rationaleLabels: [keyof Submission["rationale"], string][] = [
  ["tone", "톤 & 매너"],
  ["copy", "카피라이팅에 담긴 의미"],
  ["extra", "작품 추가 설명"],
];

// ─── 선정 확인 팝업 ──────────────────────────────────────────────────────────

function SelectConfirmModal({
  open, onClose, onConfirm,
}: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl pt-10 px-8 pb-8 pointer-events-auto overflow-hidden"
              style={{ border: "1.5px solid #e9d5ff" }}
            >
              {/* 상단 그라디언트 바 */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ background: "linear-gradient(90deg,#f3b0f2,#b26efd,#93b5f6)" }}
              />

              {/* 체크 아이콘 */}
              <div className="flex justify-center mb-6">
                <div className="relative flex items-center justify-center">
                  <div
                    className="absolute w-28 h-28 rounded-full"
                    style={{ background: "radial-gradient(circle,rgba(178,110,253,0.18) 0%,transparent 70%)" }}
                  />
                  <div
                    className="relative w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#c084fc,#a78bfa)" }}
                  >
                    <Check size={28} color="white" strokeWidth={3} />
                  </div>
                </div>
              </div>

              {/* 타이틀 */}
              <h2 className="text-center text-gray-900 text-xl font-extrabold mb-5">
                선택하신 콘텐츠를 선정하시겠습니까?
              </h2>

              {/* 경고 문구 */}
              <div
                className="flex items-start gap-3 rounded-2xl px-4 py-4 mb-7"
                style={{ background: "#f6f4fb" }}
              >
                <AlertTriangle size={16} className="text-gray-400 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-500 leading-relaxed text-center flex-1">
                  확인을 누르시면 계약서 작성으로 넘어가며,
                  <br />
                  계약서에 서명하신 후 계약 파기는 불가합니다.
                </p>
              </div>

              {/* 버튼 */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-purple-600 transition-colors hover:bg-purple-50"
                  style={{ border: "1.5px solid #e9d5ff" }}
                >
                  이전
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#b26efd,#93b5f6)" }}
                >
                  확인
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function PreVuePage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [active, setActive] = useState<Submission>(submissions[0]);
  const [rationaleOpen, setRationaleOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmSelection = () => {
    setConfirmOpen(false);
    toast.info("계약서 작성 기능은 곧 출시될 예정입니다.");
  };

  const activeIdx = submissions.findIndex((s) => s.id === active.id);

  const navPrev = () => {
    const idx = (activeIdx - 1 + submissions.length) % submissions.length;
    setActive(submissions[idx]);
    setRationaleOpen(false);
  };
  const navNext = () => {
    const idx = (activeIdx + 1) % submissions.length;
    setActive(submissions[idx]);
    setRationaleOpen(false);
  };

  const handleSelect = (id: number) => setSelected((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-[calc(100vh-68px)] bg-gray-50">
      {/* ── Hero — pastel blobs ── */}
      <div className="relative overflow-hidden" style={{ background: "#fff" }}>
        <div style={{ position: "absolute", top: -40, left: -40, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(252,180,210,0.22) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -20, right: 80, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(178,110,253,0.12) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -30, right: -20, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(147,181,246,0.18) 0%,transparent 65%)", pointerEvents: "none" }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10" style={{ paddingTop: 56, paddingBottom: 56 }}>
          <p style={{ color: "#b26efd", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
            TechStart Inc. · 브랜드 로고 & 디지털 광고 템플릿 공모전
          </p>
          <div className="flex items-end justify-between">
            <div>
              <h1 style={{ fontWeight: 900, fontSize: "1.8rem", color: "#374151", letterSpacing: "-0.02em", marginBottom: 6 }}>
                우리 브랜드에 가장 어울리는 콘텐츠를 선정해주세요
              </h1>
              <p style={{ color: "#9ca3af", fontSize: 13 }}>
                총 <span style={{ color: "#374151", fontWeight: 700 }}>{submissions.length}</span>개의 작품이 우리 브랜드에 맞추어 제작 후 제출되었습니다.
                {selected && (
                  <span style={{ marginLeft: 10, background: "linear-gradient(135deg,#b26efd,#93b5f6)", color: "white", padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>
                    ✓ 1개 선정됨
                  </span>
                )}
              </p>
            </div>
            {selected && (
              <button
                onClick={() => setConfirmOpen(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "linear-gradient(135deg,#b26efd,#93b5f6)", border: "none",
                  padding: "10px 20px", borderRadius: 12, color: "white",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(178,110,253,0.3)",
                }}
              >
                <Trophy size={14} /> 선정 완료하기
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Body: Left sidebar + Right detail ── */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-5 items-start">

        {/* ── LEFT: 2열 썸네일 그리드 ── */}
        <div style={{
          width: 260, flexShrink: 0,
          background: "white", borderRadius: 16,
          border: "1px solid #f0f0f6",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f0fb" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed" }}>전체 작품 ({submissions.length})</p>
          </div>
          <div style={{ padding: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxHeight: "calc(100vh - 260px)", overflowY: "auto" }}>
            {submissions.map((sub) => {
              const isActive = active.id === sub.id;
              const isSelected = selected === sub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => { setActive(sub); setRationaleOpen(false); }}
                  style={{
                    position: "relative", borderRadius: 10, overflow: "hidden",
                    aspectRatio: "1", cursor: "pointer",
                    outline: isActive ? "2.5px solid #b26efd" : isSelected ? "2.5px solid #22c55e" : "2px solid transparent",
                    outlineOffset: isActive ? 2 : 0,
                    transition: "all 0.15s",
                    boxShadow: isActive ? "0 0 0 4px rgba(178,110,253,0.15)" : "none",
                  }}
                >
                  <img src={sub.image} alt={sub.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  {isSelected && (
                    <div style={{ position: "absolute", top: 5, right: 5, width: 18, height: 18, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CheckCircle size={12} color="white" />
                    </div>
                  )}
                  {isActive && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(178,110,253,0.08)" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Detail panel ── */}
        <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 16, border: "1px solid #f0f0f6", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}>

          {/* Top nav bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #f3f0fb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={navPrev} style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid #e9d5ff", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronLeft size={14} color="#b26efd" />
              </button>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af" }}>{activeIdx + 1} / {submissions.length}</span>
              <button onClick={navNext} style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid #e9d5ff", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronRight size={14} color="#b26efd" />
              </button>
            </div>

            {/* 선정하기 버튼 */}
            <button
              onClick={() => handleSelect(active.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "13px 28px", borderRadius: 12, border: "none", cursor: "pointer",
                background: selected === active.id
                  ? "linear-gradient(135deg,#22c55e,#16a34a)"
                  : "linear-gradient(135deg,#f3b0f2,#b26efd)",
                color: "white", fontSize: 16, fontWeight: 800,
                boxShadow: selected === active.id
                  ? "0 4px 14px rgba(34,197,94,0.35)"
                  : "0 4px 14px rgba(178,110,253,0.35)",
                transition: "all 0.2s",
              }}
            >
              {selected === active.id
                ? <><CheckCircle size={18} /> 선정됨</>
                : <><Trophy size={18} /> 선정하기</>
              }
            </button>
          </div>

          {/* Main image */}
          <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#f5f3ff" }}>
            <img key={active.id} src={active.image} alt={active.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>

          {/* Info section: left narrow + right wide */}
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", borderTop: "1px solid #f3f0fb", minHeight: 260 }}>

            {/* Left: creator info */}
            <div style={{ padding: "18px 16px", borderRight: "1px solid #f3f0fb", display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Avatar */}
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#f3b0f2,#b26efd)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: "white" }}>
                {active.creatorHandle[1].toUpperCase()}
              </div>
              <p style={{ fontWeight: 700, fontSize: 13, color: "#1a0533" }}>{active.creatorHandle}</p>
              <span style={{ display: "inline-block", fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(178,110,253,0.1)", color: "#7c3aed", fontWeight: 600 }}>
                {active.type}
              </span>
              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                {active.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99, background: "#f3f4f6", color: "#6b7280" }}>
                    #{tag}
                  </span>
                ))}
              </div>
              {/* Date */}
              <p style={{ fontSize: 10, color: "#9ca3af", marginTop: "auto" }}>📅 {active.submittedAt}</p>
            </div>

            {/* Right: description + rationale */}
            <div style={{ padding: "24px 22px" }}>
              {/* Title + description */}
              <p style={{ fontWeight: 800, fontSize: 15, color: "#1a0533", lineHeight: 1.8, marginBottom: 20, minHeight: 72 }}>
                {active.description}
              </p>

              {/* 기획 의도 토글 */}
              <button
                onClick={() => setRationaleOpen((v) => !v)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: rationaleOpen ? "linear-gradient(135deg,#fdf4ff,#ede9fe)" : "#faf8ff",
                  border: `1px solid ${rationaleOpen ? "#d8b4fe" : "#ede8f8"}`,
                  borderRadius: 10, padding: "10px 14px", cursor: "pointer",
                  color: "#7c3aed", fontSize: 12, fontWeight: 700,
                  transition: "all 0.15s",
                }}
              >
                <span>기획 의도 보기</span>
                {rationaleOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              {rationaleOpen && (
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
                  {rationaleLabels.map(([key, label]) => (
                    <div key={key} style={{ background: "#faf8ff", borderRadius: 10, padding: "14px 16px", border: "1px solid #ede8f8" }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#b26efd", marginBottom: 6 }}>{label}</p>
                      <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.7 }}>
                        {active.rationale[key]}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SelectConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmSelection}
      />
    </div>
  );
}

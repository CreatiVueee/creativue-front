"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Bookmark, Clock, Award, Calendar, Info,
  PenLine, FileText, Lightbulb, Send, ChevronRight,
} from "lucide-react";
import { fetchProjectById, insertSubmission } from "@/shared/lib/supabase/queries";
import { calcDday, formatDday, getDdayColorClass } from "@/shared/lib/utils/date";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useLoginModalStore } from "@/features/auth/store/loginModalStore";
import { toast } from "sonner";
import { PortfolioDropzone } from "./_components/PortfolioDropzone";
import { SubmissionSuccessView } from "./_components/SubmissionSuccessView";

const MAX_LEN = 800;

// ─── Helper ──────────────────────────────────────────────────────────────────

function formatPrize(prize: number) {
  if (prize >= 10_000_000) return `${prize / 10_000_000}천만원`;
  if (prize >= 1_000_000) return `${prize / 1_000_000}백만원`;
  return `${(prize / 10_000).toFixed(0)}만원`;
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function RationaleField({
  icon, label, placeholder, value, onChange,
}: {
  icon: React.ReactNode; label: string; placeholder: string;
  value: string; onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-bold text-gray-800 mb-2">
        <span style={{ color: "#b26efd" }}>{icon}</span> {label}
      </label>
      <div className="relative rounded-xl" style={{ background: "#faf8ff", border: "1px solid #ede8f8" }}>
        <textarea
          value={value}
          maxLength={MAX_LEN}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-transparent resize-none outline-none text-sm text-gray-700 placeholder:text-gray-300 px-4 pt-3.5 pb-6"
        />
        <span className="absolute bottom-2 right-3 text-[10px] text-gray-300">
          {value.length} / {MAX_LEN}
        </span>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, valueClassName }: {
  icon: React.ReactNode; label: string; value: React.ReactNode; valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs">
      <span className="flex items-center gap-2 text-gray-400">{icon} {label}</span>
      <span className={`font-bold text-gray-800 ${valueClassName ?? ""}`}>{value}</span>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ContestSubmitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { isLoggedIn, role, profileId, user } = useAuthStore();
  const openLoginModal = useLoginModalStore((s) => s.open);

  const { data: project, isLoading } = useQuery({
    queryKey: ["contest", id],
    queryFn: () => fetchProjectById(Number(id)),
  });

  const [tone, setTone] = useState("");
  const [copy, setCopy] = useState("");
  const [extra, setExtra] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddFiles = (added: File[]) => setFiles((prev) => [...prev, ...added]);
  const handleRemoveFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!profileId || files.length === 0) {
      if (files.length === 0) toast.error("포트폴리오 파일을 1개 이상 업로드해 주세요.");
      return;
    }
    setIsSubmitting(true);
    try {
      // ⏳ 나중에: Supabase Storage 업로드 후 실제 파일 URL로 교체 (현재는 파일명만 저장)
      await insertSubmission({
        project_id: Number(id),
        freelancer_id: profileId,
        portfolio_file_urls: files.map((f) => f.name),
        tone_and_manner: tone || null,
        // ⏳ 나중에: DB에 카피라이팅 전용 컬럼이 추가되면 layout_rationale → 해당 컬럼으로 교체
        //           (현재 project_submissions 스키마엔 copy 전용 컬럼이 없어 layout_rationale에 저장)
        layout_rationale: copy || null,
        additional_description: extra || null,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error("작품 제출 실패:", err);
      toast.error("작품 제출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-68px)] flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full border-[3px] border-t-transparent animate-spin"
          style={{ borderColor: "#b26efd", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[calc(100vh-68px)] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">존재하지 않는 공모전입니다.</p>
        <Link href="/projects" className="text-sm text-purple-600 underline">
          공모전 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  if (!isLoggedIn || role !== "freelancer") {
    return (
      <div className="min-h-[calc(100vh-68px)] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-gray-500 text-sm">
          {isLoggedIn
            ? "프리랜서 계정으로만 작품을 제출할 수 있습니다."
            : "작품을 제출하려면 로그인이 필요합니다."}
        </p>
        {!isLoggedIn && (
          <button
            type="button"
            onClick={() => openLoginModal(`/projects/${id}/submit`)}
            className="text-sm font-bold text-white px-6 py-2.5 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#b26efd,#93b5f6)" }}
          >
            로그인하기
          </button>
        )}
        <Link href={`/projects/${id}`} className="text-sm text-purple-600 underline">
          공모전 상세로 돌아가기
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return <SubmissionSuccessView projectId={id} projectTitle={project.title} />;
  }

  const dday = calcDday(project.deadline_date);

  return (
    <div className="min-h-[calc(100vh-68px)] bg-gray-50">
      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-white">
        <div
          style={{
            position: "absolute", top: -60, right: -60, width: 360, height: 360,
            borderRadius: "50%", background: "radial-gradient(circle,rgba(178,110,253,0.10) 0%,transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10" style={{ paddingTop: 44, paddingBottom: 36 }}>
          <div className="flex items-center gap-2 text-xs font-bold mb-3" style={{ color: "#b26efd" }}>
            <span style={{ width: 14, height: 2, background: "#b26efd", display: "inline-block" }} />
            공모전 리스트 · 출품 제출
          </div>
          <h1 className="font-black text-gray-900 mb-2" style={{ fontSize: "1.8rem" }}>
            공모전{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#b26efd,#93b5f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              작품 제출
            </span>
          </h1>
          <p className="text-sm text-gray-400">
            제공된 브랜드 가이드라인을 기반으로 제작한 결과물과 핵심 기획 의도를 작성해 주세요.
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── LEFT ── */}
          <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col gap-5">
            {/* 제출자 정보 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <p className="text-sm font-extrabold text-gray-900">제출자 정보</p>
              </div>
              <div className="px-5 py-5 flex flex-col gap-3">
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
                    style={{ background: "linear-gradient(135deg,#f3b0f2,#b26efd)" }}
                  >
                    {(user?.displayName || user?.email || "?")[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                    <span
                      className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(178,110,253,0.1)", color: "#7c3aed" }}
                    >
                      공모전 참가 회원
                    </span>
                  </div>
                </div>

                <div>
                  <span className="flex items-center gap-2 text-xs text-gray-400">
                    <Bookmark size={12} /> 제출 공모전
                  </span>
                  <p className="text-sm font-extrabold text-gray-900 mt-1">{project.title}</p>
                </div>

                <InfoRow
                  icon={<Clock size={12} />}
                  label="마감일"
                  value={`${formatDday(dday)} (${project.deadline_date})`}
                  valueClassName={getDdayColorClass(dday)}
                />
                <InfoRow
                  icon={<Award size={12} />}
                  label="상금"
                  value={formatPrize(project.reward_amount)}
                />

                <p className="flex items-center gap-1.5 text-[11px] text-gray-300 pt-2 border-t border-gray-50">
                  <Calendar size={11} /> {format(new Date(), "yyyy-MM-dd")}
                </p>
              </div>
            </div>

            {/* 포트폴리오 업로드 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <p className="text-sm font-extrabold text-gray-900">포트폴리오 업로드</p>
              </div>
              <div className="px-5 py-5">
                <PortfolioDropzone files={files} onAdd={handleAddFiles} onRemove={handleRemoveFile} />
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-2xl px-4 py-3.5" style={{ background: "#f6f4fb" }}>
              <Info size={14} className="text-gray-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 leading-relaxed">
                업로드 파일은 클라이언트 및 플랫폼 이외에는 공개되지 않으며, 공모전 종료 후 90일간 보관됩니다.
              </p>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-7">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#b26efd" }}>
                기획 의도서
              </p>
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: "rgba(178,110,253,0.1)", color: "#7c3aed" }}
              >
                3개 항목
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-gray-900 mb-6">작품 기획 의도 작성</h2>

            <div className="flex flex-col gap-6">
              <RationaleField
                icon={<PenLine size={14} />}
                label="톤 & 매너 (Tone & Manner)"
                placeholder="브랜드 정체성에 맞추기 위해 설정한 시각적 분위기와 톤앤매너 구축 과정을 서술해 주세요."
                value={tone}
                onChange={setTone}
              />
              <RationaleField
                icon={<FileText size={14} />}
                label="카피라이팅에 담긴 의미"
                placeholder="핵심 문구(카피)의 타겟 전달 메시지와 의도를 설명해 주세요."
                value={copy}
                onChange={setCopy}
              />
              <RationaleField
                icon={<Lightbulb size={14} />}
                label="작품 추가 설명"
                placeholder="심사위원이 인지해야 할 테크닉, 디테일, 혹은 가이드라인 분석 비하인드를 자유롭게 적어주세요."
                value={extra}
                onChange={setExtra}
              />
            </div>
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-10 py-4 rounded-2xl text-white text-sm font-extrabold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg,#b26efd,#93b5f6)",
              boxShadow: "0 8px 20px rgba(178,110,253,0.35)",
            }}
          >
            <Send size={15} />
            {isSubmitting ? "제출 중..." : "출품작 최종 제출하기"}
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

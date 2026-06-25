"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Trophy, Calendar, Bot, BotOff, CheckCircle,
  Upload, X, Plus, Megaphone,
} from "lucide-react";
import { ChipButton } from "@/shared/components/ui/ChipButton";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContestFormState {
  contentTypes: string[];
  contentTypeOther: string;
  prize: string;
  deadline: string;
  aiAllowed: "가능" | "불가능" | "";
  purposes: string[];
  purposeOther: string;
  priceRange: string;
  differentiation: string;
  images: File[];
  additionalNotes: string;
}

interface ContestFormPanelProps {
  form: ContestFormState;
  isSubmitting: boolean;
  onUpdate: (patch: Partial<ContestFormState>) => void;
  onSubmit: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CONTENT_TYPE_OPTIONS = [
  "로고", "상세페이지", "DA", "해외 광고",
  "포스터 템플릿", "디지털 광고 템플릿", "제품 디자인", "리플렛", "기타",
] as const;

const PURPOSE_OPTIONS = [
  "전환 유도", "제품 상세 설명", "브랜드 인지도 향상", "제품 디자인", "기타",
] as const;

const AI_OPTIONS = [
  { value: "가능" as const, icon: Bot, hint: "AI 생성 도구(Midjourney, DALL·E 등) 활용이 허용됩니다." },
  { value: "불가능" as const, icon: BotOff, hint: "AI 생성 도구 없이 순수 창작물로 제출해야 합니다." },
] as const;

const MAX_IMAGES = 5;
const TODAY_ISO = new Date().toISOString().split("T")[0];

// ─── FieldGroup wrapper ───────────────────────────────────────────────────────

function FieldGroup({
  num,
  label,
  sub,
  required,
  children,
}: {
  num: string;
  label: string;
  sub?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-start gap-2.5 mb-4">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0 mt-0.5"
          style={{ background: "linear-gradient(135deg, #b26efd, #93b5f6)" }}
        >
          {num}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── ImageUploader ────────────────────────────────────────────────────────────

function ImageUploader({
  images,
  onAdd,
  onRemove,
}: {
  images: File[];
  onAdd: (files: FileList) => void;
  onRemove: (idx: number) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const canAdd = images.length < MAX_IMAGES;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) onAdd(e.dataTransfer.files);
  };

  return (
    <>
      {canAdd && (
        <div
          role="button"
          tabIndex={0}
          className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all hover:border-[#b26efd] hover:bg-purple-50/30 mb-4"
          style={{ borderColor: "#d1d5db" }}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-2.5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#f3e8ff" }}>
              <Upload size={22} style={{ color: "#b26efd" }} />
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-semibold" style={{ color: "#b26efd" }}>클릭</span>하거나 파일을 드래그하세요
            </p>
            <p className="text-xs text-gray-400">{images.length} / {MAX_IMAGES} 업로드됨</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && onAdd(e.target.files)}
          />
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {images.map((file, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(idx)}
                aria-label="이미지 삭제"
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-1.5 py-0.5">
                <p className="text-[9px] text-white truncate">{file.name}</p>
              </div>
            </div>
          ))}
          {canAdd && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center hover:border-[#b26efd] transition-colors"
            >
              <Plus size={18} className="text-gray-300" />
            </button>
          )}
        </div>
      )}
    </>
  );
}

// ─── ContestFormPanel ─────────────────────────────────────────────────────────

export function ContestFormPanel({ form, isSubmitting, onUpdate, onSubmit }: ContestFormPanelProps) {
  const toggleContentType = (ct: string) =>
    onUpdate({
      contentTypes: form.contentTypes.includes(ct)
        ? form.contentTypes.filter((t) => t !== ct)
        : [...form.contentTypes, ct],
    });

  const togglePurpose = (p: string) =>
    onUpdate({
      purposes: form.purposes.includes(p)
        ? form.purposes.filter((x) => x !== p)
        : [...form.purposes, p],
    });

  const addImages = (files: FileList) => {
    const remaining = MAX_IMAGES - form.images.length;
    const newFiles = Array.from(files).slice(0, remaining);
    onUpdate({ images: [...form.images, ...newFiles] });
  };

  const removeImage = (idx: number) =>
    onUpdate({ images: form.images.filter((_, i) => i !== idx) });

  const prizeNumber = Number(form.prize.replace(/,/g, ""));
  const isFormValid =
    form.contentTypes.length > 0 &&
    form.prize.length > 0 &&
    form.deadline.length > 0 &&
    form.aiAllowed !== "" &&
    form.purposes.length > 0 &&
    form.priceRange.length > 0 &&
    form.differentiation.length > 0;

  return (
    <div className="space-y-5">
      {/* 1. 콘텐츠 타입 */}
      <FieldGroup num="1" label="원하는 제작 콘텐츠" sub="복수 선택 가능 · '기타' 선택 시 직접 입력" required>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
          {CONTENT_TYPE_OPTIONS.map((ct) => (
            <ChipButton
              key={ct}
              active={form.contentTypes.includes(ct)}
              onClick={() => toggleContentType(ct)}
              variant="light"
              showCheckIcon
              className="px-3 py-2.5 text-xs"
            >
              {ct}
            </ChipButton>
          ))}
        </div>
        <AnimatePresence>
          {form.contentTypes.includes("기타") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <input
                value={form.contentTypeOther}
                onChange={(e) => onUpdate({ contentTypeOther: e.target.value })}
                placeholder="기타 콘텐츠 종류를 입력해 주세요"
                className="w-full rounded-xl border-2 px-4 py-2.5 text-sm text-gray-700 focus:outline-none transition-colors placeholder-gray-300"
                style={{ borderColor: form.contentTypeOther ? "#b26efd" : "#e5e7eb" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {form.contentTypes.length > 0 && (
          <p className="text-[11px] mt-2 font-semibold" style={{ color: "#b26efd" }}>
            {form.contentTypes.length}개 선택됨 ✓
          </p>
        )}
      </FieldGroup>

      {/* 2 & 3. 상금 + 마감일 */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 상금 */}
          <div>
            <div className="flex items-start gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0 mt-0.5" style={{ background: "linear-gradient(135deg, #b26efd, #93b5f6)" }}>2</div>
              <div>
                <p className="text-sm font-semibold text-gray-800">상금 <span className="text-red-400">*</span></p>
                <p className="text-xs text-gray-400 mt-0.5">숫자로 입력 (단위: 원)</p>
              </div>
            </div>
            <div
              className="flex items-center border-2 rounded-xl px-4 py-3 transition-colors"
              style={{ borderColor: form.prize ? "#b26efd" : "#e5e7eb" }}
            >
              <Trophy size={15} className="text-gray-300 mr-2 flex-shrink-0" />
              <span className="text-gray-400 text-sm mr-1">₩</span>
              <input
                type="number"
                value={form.prize}
                onChange={(e) => onUpdate({ prize: e.target.value })}
                placeholder="예: 3000000"
                min="0"
                className="flex-1 text-sm text-gray-800 focus:outline-none bg-transparent placeholder-gray-300"
              />
            </div>
            {form.prize && (
              <p className="text-xs mt-1.5 font-medium" style={{ color: "#b26efd" }}>
                ₩{prizeNumber.toLocaleString()}원
              </p>
            )}
          </div>

          {/* 마감일 */}
          <div>
            <div className="flex items-start gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0 mt-0.5" style={{ background: "linear-gradient(135deg, #b26efd, #93b5f6)" }}>3</div>
              <div>
                <p className="text-sm font-semibold text-gray-800">마감일자 <span className="text-red-400">*</span></p>
                <p className="text-xs text-gray-400 mt-0.5">달력 또는 직접 입력</p>
              </div>
            </div>
            <div
              className="flex items-center border-2 rounded-xl px-4 py-3 transition-colors"
              style={{ borderColor: form.deadline ? "#b26efd" : "#e5e7eb" }}
            >
              <Calendar size={15} className="text-gray-300 mr-2 flex-shrink-0" />
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => onUpdate({ deadline: e.target.value })}
                min={TODAY_ISO}
                className="flex-1 text-sm text-gray-700 focus:outline-none bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. AI 허용 여부 */}
      <FieldGroup num="4" label="AI툴 사용 가능 여부" sub="AI 생성 도구 활용 허용 여부를 선택해 주세요" required>
        <div className="flex gap-3">
          {AI_OPTIONS.map(({ value, icon: Icon, hint }) => {
            const isActive = form.aiAllowed === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onUpdate({ aiAllowed: isActive ? "" : value })}
                className="flex items-center justify-center gap-2 flex-1 px-5 py-3 rounded-xl border-2 text-sm font-semibold transition-all"
                style={{
                  borderColor: isActive ? "#b26efd" : "#e5e7eb",
                  background: isActive ? "rgba(178,110,253,0.06)" : "#fafafa",
                  color: isActive ? "#7c3aed" : "#6b7280",
                }}
              >
                <Icon size={15} style={{ color: isActive ? "#b26efd" : "#9ca3af", flexShrink: 0 }} />
                AI {value}
                {isActive && <CheckCircle size={13} style={{ color: "#b26efd" }} />}
              </button>
            );
          })}
        </div>
        <AnimatePresence>
          {form.aiAllowed && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs mt-2.5 font-medium"
              style={{ color: "#b26efd" }}
            >
              ✓ {AI_OPTIONS.find((o) => o.value === form.aiAllowed)?.hint}
            </motion.p>
          )}
        </AnimatePresence>
      </FieldGroup>

      {/* 5. 콘텐츠 제작 목적 */}
      <FieldGroup num="5" label="콘텐츠 제작 목적" sub="복수 선택 가능 · '기타' 선택 시 직접 입력" required>
        <div className="flex flex-wrap gap-2 mb-3">
          {PURPOSE_OPTIONS.map((p) => (
            <ChipButton
              key={p}
              active={form.purposes.includes(p)}
              onClick={() => togglePurpose(p)}
              variant="light"
              showCheckIcon
              className="px-4 py-2.5 text-sm"
            >
              {p}
            </ChipButton>
          ))}
        </div>
        <AnimatePresence>
          {form.purposes.includes("기타") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <input
                value={form.purposeOther}
                onChange={(e) => onUpdate({ purposeOther: e.target.value })}
                placeholder="기타 목적을 직접 입력해주세요"
                className="w-full rounded-xl border-2 px-4 py-2.5 text-sm text-gray-700 focus:outline-none transition-colors placeholder-gray-300"
                style={{ borderColor: form.purposeOther ? "#b26efd" : "#e5e7eb" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {form.purposes.length > 0 && (
          <p className="text-[11px] mt-2 font-semibold" style={{ color: "#b26efd" }}>
            {form.purposes.length}개 선택됨 ✓
          </p>
        )}
      </FieldGroup>

      {/* 6. 제품 가격대 */}
      <FieldGroup num="6" label="제품 가격대" sub="제품의 판매 가격 범위를 입력해주세요 (예: 10,000원 ~ 50,000원)" required>
        <input
          value={form.priceRange}
          onChange={(e) => onUpdate({ priceRange: e.target.value })}
          placeholder="예: 30,000원 ~ 100,000원"
          className="w-full rounded-xl border-2 px-4 py-2.5 text-sm text-gray-700 focus:outline-none transition-colors placeholder-gray-300"
          style={{ borderColor: form.priceRange ? "#b26efd" : "#e5e7eb" }}
        />
      </FieldGroup>

      {/* 7. 차별화 포인트 */}
      <FieldGroup num="7" label="차별화 포인트" sub="경쟁 제품 대비 우리 브랜드/제품의 강점을 입력해주세요" required>
        <textarea
          value={form.differentiation}
          onChange={(e) => onUpdate({ differentiation: e.target.value })}
          rows={3}
          placeholder="예: 국내 유기농 원료 100% 사용, 제로 웨이스트 포장"
          className="w-full rounded-xl border-2 px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none transition-colors placeholder-gray-300 leading-relaxed"
          style={{ borderColor: form.differentiation ? "#b26efd" : "#e5e7eb" }}
        />
      </FieldGroup>

      {/* 8. 이미지 업로드 */}
      <FieldGroup
        num="8"
        label="관련 이미지 업로드"
        sub={`최대 ${MAX_IMAGES}장 · PNG, JPG, GIF 지원 · 브랜드 레퍼런스, 무드보드 등`}
      >
        <ImageUploader images={form.images} onAdd={addImages} onRemove={removeImage} />
      </FieldGroup>

      {/* 9. 추가 사항 */}
      <FieldGroup num="9" label="추가 사항" sub="프리랜서에게 전달할 안내 사항을 자유롭게 작성해 주세요">
        <textarea
          value={form.additionalNotes}
          onChange={(e) => onUpdate({ additionalNotes: e.target.value })}
          rows={5}
          placeholder={"예:\n\"브랜드 컬러 가이드라인을 반드시 준수해 주세요.\n수정은 최대 2회까지 가능합니다.\""}
          className="w-full rounded-xl border-2 px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none transition-colors placeholder-gray-300 leading-relaxed"
          style={{ borderColor: form.additionalNotes ? "#b26efd" : "#e5e7eb" }}
        />
      </FieldGroup>

      {/* 제출 버튼 */}
      <div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isFormValid || isSubmitting}
          className="w-full py-4 rounded-2xl text-white flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #f3b0f2, #b26efd, #93b5f6)",
            fontWeight: 800,
            fontSize: "1.05rem",
            boxShadow: isFormValid ? "0 8px 24px rgba(178,110,253,0.35)" : "none",
          }}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              등록 중...
            </>
          ) : (
            <>
              <Megaphone size={20} />
              공모전 개최하기
            </>
          )}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          개최 후에도 마감일 전까지 내용을 수정할 수 있습니다.
        </p>
      </div>
    </div>
  );
}

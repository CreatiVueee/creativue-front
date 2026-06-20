"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useBrandReviewStore } from "@/features/auth/store/brandReviewStore";
import { BrandReviewPanel } from "./_components/BrandReviewPanel";
import { ContestFormPanel, type ContestFormState } from "./_components/ContestFormPanel";
import { ContestSuccessView } from "./_components/ContestSuccessView";

const INITIAL_FORM: ContestFormState = {
  contentTypes: [],
  contentTypeOther: "",
  prize: "",
  deadline: "",
  aiAllowed: "",
  images: [],
  additionalNotes: "",
};

export default function ContestCreatePage() {
  const router = useRouter();
  const { data: brandData } = useBrandReviewStore();

  const [form, setForm] = useState<ContestFormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const update = (patch: Partial<ContestFormState>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = () => {
    setIsSubmitting(true);
    // ⏳ 나중에: Supabase contests 테이블 insert
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  if (isSuccess) {
    return <ContestSuccessView brandName={brandData.brandName} />;
  }

  return (
    <div className="min-h-[calc(100vh-68px)] bg-gray-50">
      {/* 페이지 헤더 */}
      <div
        className="px-6 pt-8 pb-7"
        style={{ background: "linear-gradient(135deg, #f3b0f2 0%, #b26efd 55%, #93b5f6 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-white/80 text-sm mb-4 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            이전으로
          </button>
          <p className="text-white/70 text-sm mb-1">PreVue & Pick · 미리 보고 선택하세요.</p>
          <h1 className="text-white font-black mb-1" style={{ fontSize: "1.8rem" }}>
            공모전 개최하기
          </h1>
          <p className="text-white/80 text-sm">
            브랜드 리뷰를 기반으로, 다양한 창작자들의 관점에서 브랜드에 맞는 독창적인 콘텐츠를 받아볼 수 있어요.
          </p>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-7">
          {/* 왼쪽: 브랜드 정보 (읽기전용) */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-bold uppercase mb-4" style={{ color: "#b26efd", letterSpacing: "0.1em" }}>
              브랜드 리뷰 요약
            </h2>
            <BrandReviewPanel />
          </div>

          {/* 오른쪽: 공모전 등록 폼 */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase mb-4" style={{ color: "#b26efd", letterSpacing: "0.1em" }}>
              공모전 세부 사항
            </h2>
            <ContestFormPanel
              form={form}
              isSubmitting={isSubmitting}
              onUpdate={update}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

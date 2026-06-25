"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useBrandReviewStore } from "@/features/auth/store/brandReviewStore";
import { insertBrand, insertProject } from "@/shared/lib/supabase/queries";
import { BrandReviewPanel } from "./_components/BrandReviewPanel";
import { ContestFormPanel, type ContestFormState } from "./_components/ContestFormPanel";
import { ContestSuccessView } from "./_components/ContestSuccessView";

const INITIAL_FORM: ContestFormState = {
  contentTypes: [],
  contentTypeOther: "",
  prize: "",
  deadline: "",
  aiAllowed: "",
  purposes: [],
  purposeOther: "",
  priceRange: "",
  differentiation: "",
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. brands INSERT
      // ⏳ 나중에: client_id → 실제 로그인 유저 ID, brand_image → Storage 업로드 URL
      const brandId = await insertBrand({
        brand_name: brandData.brandName,
        brand_identity: brandData.brandIdentity,
        brand_story: brandData.brandStory,
        brand_core_keywords: brandData.keywords,
        brand_image: "",
        industries: brandData.industries,
        input_type: "form",
        client_id: 1,
        target_market: brandData.market || null,
        target_gender: brandData.gender || null,
        target_ages: brandData.ageGroups.length > 0 ? brandData.ageGroups : null,
        target_interests: brandData.interests.length > 0 ? brandData.interests : null,
        target_jobs: brandData.occupation || null,
        extra_notes: brandData.additionalNotes || null,
        extra_notes_etc: brandData.desiredPerception || null,
      });

      // 2. projects INSERT
      // ⏳ 나중에: reference_image_url → Supabase Storage 업로드 후 URL 배열
      const contentTypes = form.contentTypes.includes("기타") && form.contentTypeOther
        ? [...form.contentTypes.filter((t) => t !== "기타"), form.contentTypeOther]
        : form.contentTypes;

      const purposes = form.purposes.includes("기타") && form.purposeOther
        ? [...form.purposes.filter((p) => p !== "기타"), form.purposeOther]
        : form.purposes;

      await insertProject({
        brand_id: brandId,
        title: brandData.brandName,
        content_categories: contentTypes,
        content_purpose: purposes,
        deadline_date: form.deadline,
        reward_amount: Number(form.prize.replace(/,/g, "")),
        paid_amount: 0,
        price_range: form.priceRange,
        differentiation_point: form.differentiation,
        required_content: contentTypes,
        is_ai_allowed: form.aiAllowed === "가능",
        reference_image_url: [],
        additional_info: form.additionalNotes || null,
      });

      setIsSuccess(true);
    } catch (err) {
      console.error("공모전 등록 실패:", err);
      toast.error("공모전 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
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

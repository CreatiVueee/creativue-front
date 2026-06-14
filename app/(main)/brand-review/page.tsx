"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import {
  useBrandReviewStore,
  INITIAL_BRAND_REVIEW_DATA,
  type BrandReviewData,
} from "@/features/auth/store/brandReviewStore";
import { BrandReviewCompleteModal } from "@/features/auth/ui/BrandReviewCompleteModal";
import { StepNavigator, STEPS } from "./_components/StepNavigator";
import { Step1BrandInfo } from "./_components/steps/Step1BrandInfo";
import { Step2BrandStory } from "./_components/steps/Step2BrandStory";
import { Step3BrandIdentity } from "./_components/steps/Step3BrandIdentity";
import { Step4BrandImage } from "./_components/steps/Step4BrandImage";
import { Step5TargetConsumer } from "./_components/steps/Step5TargetConsumer";

// ─── Validation ───────────────────────────────────────────────────────────────

function isStepValid(step: number, data: BrandReviewData): boolean {
  switch (step) {
    case 1:
      return data.brandName.trim().length > 0 && data.industries.length > 0;
    case 2:
      return data.brandStory.trim().length > 0;
    case 3:
      return data.brandIdentity.trim().length > 0;
    default:
      return true;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BrandReviewPage() {
  const router = useRouter();
  const { data: savedData, saveBrandReview } = useBrandReviewStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BrandReviewData>(() => ({
    ...INITIAL_BRAND_REVIEW_DATA,
    ...savedData,
    logoFile: null, // File 객체는 localStorage에서 복원 불가
  }));
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const updateForm = useCallback((partial: Partial<BrandReviewData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  }, []);

  const canGoNext = useMemo(
    () => isStepValid(currentStep, formData),
    [currentStep, formData]
  );

  const goNext = () =>
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));

  const goPrev = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    } else {
      router.back();
    }
  };

  const handleComplete = () => {
    saveBrandReview(formData);
    setShowCompleteModal(true);
  };

  const handleContestCreate = () => {
    setShowCompleteModal(false);
    router.push("/projects/create");
  };

  const handleModalClose = () => {
    setShowCompleteModal(false);
    router.push("/");
  };

  const stepContent: Record<number, React.ReactNode> = {
    1: <Step1BrandInfo data={formData} onChange={updateForm} />,
    2: <Step2BrandStory data={formData} onChange={updateForm} />,
    3: <Step3BrandIdentity data={formData} onChange={updateForm} />,
    4: <Step4BrandImage data={formData} onChange={updateForm} />,
    5: <Step5TargetConsumer data={formData} onChange={updateForm} />,
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-gray-50">
      {/* 페이지 배너 */}
      <div
        className="w-full py-10 px-6"
        style={{
          background:
            "linear-gradient(135deg, #f3b0f2 0%, #b26efd 55%, #93b5f6 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-white/70 text-xs mb-1">
            ReVue My Brand · 브랜드 기준점
          </p>
          <h1
            className="text-white mb-1"
            style={{ fontWeight: 800, fontSize: "1.75rem" }}
          >
            브랜드 리뷰(Brand ReVue)
          </h1>
          <p className="text-white/80 text-sm">
            브랜드를 가장 잘 아는 사람이 만드는 브랜드의 기준
          </p>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* 스텝 네비게이터 */}
        <StepNavigator
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />

        {/* 폼 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {/* 카드 헤더 */}
          <div className="px-6 sm:px-8 py-6 border-b border-gray-100 flex items-center gap-3">
            <span
              className="text-xs px-2.5 py-1 rounded-full font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #f3b0f2, #b26efd)",
              }}
            >
              Step {currentStep} / {STEPS.length}
            </span>
            <h2
              className="text-gray-900"
              style={{ fontWeight: 800, fontSize: "1.15rem" }}
            >
              {STEPS[currentStep - 1].label}
            </h2>
          </div>

          {/* 스텝 컨텐츠 */}
          <div className="px-6 sm:px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {stepContent[currentStep]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 네비게이션 푸터 */}
          <div className="px-6 sm:px-8 py-5 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={goPrev}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 text-sm hover:border-gray-300 hover:text-gray-700 transition-all"
              style={{ fontWeight: 600 }}
            >
              <ChevronLeft size={16} />
              {currentStep === 1 ? "돌아가기" : "이전 단계"}
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm shadow-md transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #b26efd, #93b5f6)",
                  fontWeight: 700,
                }}
              >
                다음 단계
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm shadow-md transition-all hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, #f3b0f2, #b26efd, #93b5f6)",
                  fontWeight: 700,
                }}
              >
                <CheckCircle size={16} />
                브랜딩 완성
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 완성 팝업 */}
      <BrandReviewCompleteModal
        isOpen={showCompleteModal}
        onContestCreate={handleContestCreate}
        onClose={handleModalClose}
      />
    </div>
  );
}

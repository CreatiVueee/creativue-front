import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BrandsInsert } from "@/shared/lib/supabase/queries";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BrandReviewData {
  brandName: string;
  industries: string[];
  logoFile: File | null;
  brandStory: string;
  brandIdentity: string;
  desiredPerception: string;
  keywords: string[];
  market: string;
  gender: string;
  ageGroups: string[];
  interests: string[];
  occupation: string;
  additionalNotes: string;
}

interface BrandReviewState {
  data: BrandReviewData;
  isSaved: boolean;
  /** DB brands.id — 한 클라이언트당 하나의 브랜드 row를 재사용하기 위한 참조 */
  brandId: number | null;
  saveBrandReview: (data: BrandReviewData) => void;
  setBrandId: (brandId: number) => void;
  clearBrandReview: () => void;
}

/** BrandReviewData(camelCase, UI) → brands 테이블 Insert/Update payload(snake_case, DB) 변환 */
export function toBrandsInsert(data: BrandReviewData, clientId: string): BrandsInsert {
  return {
    client_id: clientId,
    brand_name: data.brandName,
    brand_identity: data.brandIdentity,
    brand_story: data.brandStory,
    brand_core_keywords: data.keywords,
    brand_image: "", // ⏳ 나중에: Supabase Storage 업로드 URL
    industries: data.industries,
    input_type: "form",
    target_market: data.market || null,
    target_gender: data.gender || null,
    target_ages: data.ageGroups.length > 0 ? data.ageGroups : null,
    target_interests: data.interests.length > 0 ? data.interests : null,
    target_jobs: data.occupation || null,
    extra_notes: data.additionalNotes || null,
    extra_notes_etc: data.desiredPerception || null,
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const INITIAL_BRAND_REVIEW_DATA: BrandReviewData = {
  brandName: "",
  industries: [],
  logoFile: null,
  brandStory: "",
  brandIdentity: "",
  desiredPerception: "",
  keywords: [],
  market: "",
  gender: "",
  ageGroups: [],
  interests: [],
  occupation: "",
  additionalNotes: "",
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBrandReviewStore = create<BrandReviewState>()(
  persist(
    (set) => ({
      data: INITIAL_BRAND_REVIEW_DATA,
      isSaved: false,
      brandId: null,

      saveBrandReview: (data) => set({ data, isSaved: true }),
      setBrandId: (brandId) => set({ brandId }),

      clearBrandReview: () =>
        set({ data: INITIAL_BRAND_REVIEW_DATA, isSaved: false, brandId: null }),
    }),
    {
      name: "brand-review-storage",
      // File 객체는 직렬화 불가 — logoFile은 persist에서 제외
      partialize: ({ data, isSaved, brandId }) => ({
        data: { ...data, logoFile: null },
        isSaved,
        brandId,
      }),
    }
  )
);

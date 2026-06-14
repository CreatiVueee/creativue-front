import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  saveBrandReview: (data: BrandReviewData) => void;
  clearBrandReview: () => void;
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

      saveBrandReview: (data) => set({ data, isSaved: true }),

      clearBrandReview: () =>
        set({ data: INITIAL_BRAND_REVIEW_DATA, isSaved: false }),
    }),
    {
      name: "brand-review-storage",
      // File 객체는 직렬화 불가 — logoFile은 persist에서 제외
      partialize: ({ data, isSaved }) => ({
        data: { ...data, logoFile: null },
        isSaved,
      }),
    }
  )
);

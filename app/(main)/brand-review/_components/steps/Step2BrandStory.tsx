"use client";

import type { BrandReviewData } from "@/features/auth/store/brandReviewStore";
import { QLabel } from "../QLabel";

const MAX_LEN = 1000;

const GUIDE_TIPS = [
  "브랜드가 탄생한 계기나 배경",
  "고객이 겪는 문제와 우리의 해결책",
  "5년 후 브랜드가 이루고 싶은 목표",
];

const PLACEHOLDER = `예:
"우리 브랜드는 2020년, 소규모 카페 사장님들이 전문적인 브랜딩을 갖기 어렵다는 문제에서 시작되었습니다.

우리는 누구나 쉽고 합리적으로 자신만의 브랜드 정체성을 만들 수 있어야 한다고 믿습니다.

앞으로 아시아 전역의 소상공인들에게 가장 신뢰받는 브랜딩 파트너가 되는 것이 우리의 비전입니다."`;

// ─── Component ────────────────────────────────────────────────────────────────

interface Step2Props {
  data: BrandReviewData;
  onChange: (partial: Partial<BrandReviewData>) => void;
}

export function Step2BrandStory({ data, onChange }: Step2Props) {
  return (
    <div className="space-y-6">
      <div>
        <QLabel
          num="1"
          text="브랜드 스토리를 작성해주세요"
          sub="브랜드의 시작, 해결하는 문제, 그리고 미래 비전을 자유롭게 서술해주세요"
        />
        <div className="relative">
          <textarea
            value={data.brandStory}
            onChange={(e) =>
              onChange({ brandStory: e.target.value.slice(0, MAX_LEN) })
            }
            placeholder={PLACEHOLDER}
            rows={12}
            className="w-full rounded-xl border-2 px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none transition placeholder-gray-300 leading-relaxed"
            style={{
              borderColor: data.brandStory.length > 0 ? "#b26efd" : "#e5e7eb",
            }}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-300">
            {data.brandStory.length} / {MAX_LEN}
          </div>
        </div>
      </div>

      {/* 가이드 팁 박스 */}
      <div
        className="rounded-xl p-4 border"
        style={{ backgroundColor: "#faf5ff", borderColor: "#e9d5ff" }}
      >
        <p
          className="text-xs mb-2"
          style={{ color: "#7c3aed", fontWeight: 700 }}
        >
          ✍️ 작성 가이드
        </p>
        <ul className="space-y-1">
          {GUIDE_TIPS.map((tip) => (
            <li
              key={tip}
              className="text-xs text-gray-500 flex items-start gap-1.5"
            >
              <span className="mt-0.5" style={{ color: "#b26efd" }}>•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

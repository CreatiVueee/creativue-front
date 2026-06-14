"use client";

import { motion } from "motion/react";
import { UserCheck, MessageCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import type { BrandReviewData } from "@/features/auth/store/brandReviewStore";
import { QLabel } from "../QLabel";

const MAX_LEN = 800;

const PLACEHOLDER = `예:
"CreatiVue는 브랜드의 본질을 먼저 확립하는 데 집중합니다. 구조화된 플랫폼을 통해 타인의 결과물이 아닌 '우리 브랜드의 정체성'을 기준으로 일관된 선택을 할 수 있도록 도움을 제공합니다.

Core Values: 🤝 신뢰 (Trust) · 💎 다양성 (Diversity) · 🚀 성장 (Growth)"`;

// ─── Component ────────────────────────────────────────────────────────────────

interface Step3Props {
  data: BrandReviewData;
  onChange: (partial: Partial<BrandReviewData>) => void;
}

export function Step3BrandIdentity({ data, onChange }: Step3Props) {
  const handleConsultClick = () => {
    toast.info("전문가 상담 기능은 곧 출시될 예정입니다.");
  };

  return (
    <div className="space-y-6">
      <div>
        <QLabel
          num="1"
          text="브랜드가 가진 고유한 정체성을 설명해주세요"
          sub="브랜드의 개성, 고유한 특징, 차별화 포인트를 구체적으로 기술해주세요"
        />
        <div className="relative">
          <textarea
            value={data.brandIdentity}
            onChange={(e) =>
              onChange({ brandIdentity: e.target.value.slice(0, MAX_LEN) })
            }
            placeholder={PLACEHOLDER}
            rows={9}
            className="w-full rounded-xl border-2 px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none transition placeholder-gray-300 leading-relaxed"
            style={{
              borderColor:
                data.brandIdentity.length > 0 ? "#b26efd" : "#e5e7eb",
            }}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-300">
            {data.brandIdentity.length} / {MAX_LEN}
          </div>
        </div>
      </div>

      {/* 전문가 상담 CTA 카드 (UI 전용) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #f3b0f2 0%, #b26efd 55%, #93b5f6 100%)",
        }}
      >
        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <UserCheck size={20} className="text-white" strokeWidth={1.5} />
            </div>
            <div>
              <span className="inline-block text-white text-[11px] px-2 py-0.5 bg-white/25 rounded-full font-semibold mb-1">
                📣 전문가 상담 안내
              </span>
              <h4
                className="text-white mb-0.5"
                style={{ fontWeight: 700, fontSize: "0.95rem" }}
              >
                30분 전문가와의 상담으로 더 깊은 브랜딩을 완성하세요.
              </h4>
              <p className="text-white/80 text-xs leading-relaxed">
                창업자의 이야기에 전문가의 관점을 추가해 더 명확하고 강력한
                브랜드를 만들 수 있어요.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {["브랜드 전략", "차별화 전략", "가격 전략"].map((item) => (
              <div
                key={item}
                className="bg-white/15 rounded-xl py-2 text-center text-white text-sm"
                style={{ fontWeight: 500 }}
              >
                {item}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleConsultClick}
            className="w-full bg-white rounded-xl py-2.5 flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
            style={{ fontWeight: 700, color: "#7c3aed", fontSize: "0.875rem" }}
          >
            <MessageCircle size={15} />
            30분 상담 신청하기
            <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

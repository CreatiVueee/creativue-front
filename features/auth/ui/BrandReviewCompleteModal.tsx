"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle, ArrowRight } from "lucide-react";

interface BrandReviewCompleteModalProps {
  isOpen: boolean;
  onContestCreate: () => void;
  onClose: () => void;
}

export function BrandReviewCompleteModal({
  isOpen,
  onContestCreate,
  onClose,
}: BrandReviewCompleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-sm"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[201] flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
              style={{ border: "1.5px solid #e9d5ff" }}
            >
              {/* 상단 그라디언트 바 */}
              <div
                className="h-2 w-full"
                style={{
                  background:
                    "linear-gradient(90deg, #f3b0f2, #b26efd, #93b5f6)",
                }}
              />

              <div className="px-8 py-8 flex flex-col items-center text-center gap-5">
                {/* 아이콘 */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #f3b0f2, #b26efd)",
                  }}
                >
                  <CheckCircle size={32} className="text-white" />
                </div>

                {/* 메시지 */}
                <div>
                  <h3
                    className="text-gray-900 mb-2 leading-snug"
                    style={{ fontWeight: 800, fontSize: "1.25rem" }}
                  >
                    🎉 브랜드의 기준을 완성하셨네요!
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    이제 이 기준을 토대로 다양한 제작자들로부터
                    <br />
                    브랜드에 어울리는 독창적인 콘텐츠들을 받아보세요.
                  </p>
                </div>

                {/* CTA 버튼 */}
                <div className="flex flex-col gap-2.5 w-full">
                  <button
                    onClick={onContestCreate}
                    className="w-full py-3 rounded-xl text-white text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                    style={{
                      background:
                        "linear-gradient(135deg, #b26efd, #93b5f6)",
                      fontWeight: 700,
                      boxShadow: "0 6px 20px rgba(178,110,253,0.3)",
                    }}
                  >
                    공모전 개최하러 가기
                    <ArrowRight size={15} />
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl text-gray-400 text-sm hover:bg-gray-50 hover:text-gray-600 transition-all"
                    style={{ border: "1.5px solid #e9d5ff", fontWeight: 600 }}
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

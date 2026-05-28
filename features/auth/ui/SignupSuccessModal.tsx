"use client";

import { AnimatePresence, motion } from "motion/react";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

interface SignupSuccessModalProps {
  isOpen: boolean;
  onBrandReview: () => void;
  onLater: () => void;
}

export function SignupSuccessModal({ isOpen, onBrandReview, onLater }: SignupSuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
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
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 pointer-events-auto text-center"
              style={{ border: "1.5px solid #e9d5ff" }}
            >
              {/* Sparkles 부유 아이콘 */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg"
                style={{ background: "linear-gradient(135deg, #f3b0f2, #b26efd, #93b5f6)" }}
              >
                <Sparkles size={28} className="text-white" />
              </motion.div>

              <h2 className="text-gray-900 font-extrabold tracking-tight mb-2 leading-snug"
                style={{ fontSize: "1.2rem" }}>
                CreatiVue의 회원이 되신 걸<br />환영합니다! 🎉
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-7">
                귀사 브랜드의 방향성을 확인하기 위해서<br />
                <span style={{ color: "#b26efd", fontWeight: 700 }}>브랜드 리뷰</span>를 작성하시겠습니까?
              </p>

              <div className="flex flex-col gap-2.5">
                {/* CTA 1 — 브랜드 리뷰로 이동 */}
                <button
                  onClick={onBrandReview}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-extrabold text-[0.95rem] transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #f3b0f2 0%, #b26efd 60%, #93b5f6 100%)",
                    boxShadow: "0 6px 24px 0 rgba(178,110,253,0.35)",
                  }}
                >
                  <CheckCircle2 size={16} />
                  네, 지금 바로 작성할게요!
                  <ArrowRight size={14} />
                </button>

                {/* CTA 2 — 나중에 */}
                <button
                  onClick={onLater}
                  className="w-full py-3 rounded-2xl text-sm font-semibold text-gray-400 transition-all hover:bg-gray-50 hover:text-gray-600"
                  style={{ border: "1.5px solid #e9d5ff" }}
                >
                  다음에 작성할게요
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

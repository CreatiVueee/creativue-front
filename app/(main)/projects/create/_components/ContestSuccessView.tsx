import { motion } from "motion/react";
import { Trophy, Megaphone } from "lucide-react";
import Link from "next/link";

interface ContestSuccessViewProps {
  brandName: string;
}

export function ContestSuccessView({ brandName }: ContestSuccessViewProps) {
  return (
    <div
      className="min-h-[calc(100vh-68px)] flex items-center justify-center px-4"
      style={{ background: "#f8f8fc" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* 상단 그라디언트 바 */}
        <div className="h-2 w-full" style={{ background: "linear-gradient(90deg, #f3b0f2, #b26efd, #93b5f6)" }} />

        <div className="px-8 py-10 flex flex-col items-center text-center gap-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #f3b0f2, #b26efd)" }}
          >
            <Megaphone size={38} className="text-white" />
          </div>

          <div>
            <h3 className="font-black text-gray-900 mb-2" style={{ fontSize: "1.3rem" }}>
              🎉 공모전이 개최되었습니다!
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              <span className="font-bold" style={{ color: "#b26efd" }}>
                {brandName || "브랜드"}
              </span>
              의 공모전이 성공적으로 등록되었습니다.
              <br />
              프리랜서들이 브랜드에 맞는 콘텐츠를 제안할 예정입니다.
            </p>
          </div>

          <div className="w-full space-y-2.5 pt-1">
            <Link
              href="/projects"
              className="w-full py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #b26efd, #93b5f6)" }}
            >
              <Trophy size={15} />
              공모전 리스트 보러가기
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 rounded-xl border-2 border-gray-200 text-gray-400 text-sm font-semibold flex items-center justify-center hover:border-gray-300 hover:text-gray-500 transition-colors"
            >
              홈으로 가기
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

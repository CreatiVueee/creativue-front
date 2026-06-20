import { ProfileHero } from "./_components/ProfileHero";
import { BrandAccordion } from "./_components/BrandAccordion";
import { MyContestsSidebar } from "./_components/MyContestsSidebar";
import { Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ClientProfilePage() {
  return (
    <div className="min-h-[calc(100vh-68px)] bg-gray-50">
      <ProfileHero />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* 사이드바 — sticky */}
          <aside className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-6">
            <MyContestsSidebar />
          </aside>

          {/* 메인 컨텐츠 */}
          <main className="flex-1 min-w-0 space-y-5">
            <BrandAccordion />
            <ContestCTA />
          </main>
        </div>
      </div>
    </div>
  );
}

// ─── ContestCTA ───────────────────────────────────────────────────────────────

function ContestCTA() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #fdf4ff 0%, #f0e8ff 40%, #e8f4ff 100%)",
        border: "1px solid rgba(178,110,253,0.15)",
      }}
    >
      <div className="px-6 py-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-black text-gray-900 mb-1" style={{ fontSize: "1rem" }}>
            공모전을 개최해보세요
          </p>
          <p className="text-sm text-gray-400">
            브랜드에 맞는 창작자를 찾아 결과물을 미리 보고 선택하세요.
          </p>
        </div>
        <Link
          href="/projects/create"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 whitespace-nowrap"
          style={{ background: "linear-gradient(135deg, #b26efd, #93b5f6)", boxShadow: "0 4px 14px rgba(178,110,253,0.3)" }}
        >
          <Trophy size={14} />
          공모전 개최하기
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

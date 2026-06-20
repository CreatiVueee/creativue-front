"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Trophy, Calendar, Users, Bot, BotOff,
  Target, ShoppingBag, MessageSquare, Sparkles,
} from "lucide-react";
import { contests } from "@/data/contests";
import { calcDday, formatDday, getDdayColorClass } from "@/shared/lib/utils/date";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useLoginModalStore } from "@/features/auth/store/loginModalStore";
import { ImageGallery } from "./_components/ImageGallery";

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatPrize(prize: number) {
  if (prize >= 10_000_000) return `${prize / 10_000_000}천만원`;
  if (prize >= 1_000_000)  return `${prize / 1_000_000}백만원`;
  return `${(prize / 10_000).toFixed(0)}만원`;
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function SectionCard({ title, icon, children }: {
  title: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span style={{ color: "#b26efd" }}>{icon}</span>
        <h2 className="font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 w-20 shrink-0 mt-0.5">{label}</span>
      <span className="text-sm text-gray-800 font-medium flex-1">{value}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const openLoginModal = useLoginModalStore((s) => s.open);

  const contest = contests.find((c) => c.id === Number(id));

  if (!contest) {
    return (
      <div className="min-h-[calc(100vh-68px)] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">존재하지 않는 공모전입니다.</p>
        <Link href="/projects" className="text-sm text-purple-600 underline">
          공모전 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const dday = calcDday(contest.deadline);
  const ddayLabel = formatDday(dday);

  const handleApply = () => {
    if (!isLoggedIn) {
      openLoginModal(`/projects/${id}`);
      return;
    }
    // ⏳ 나중에: Supabase 지원 신청 처리
    alert("지원이 완료되었습니다!");
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-gray-50 pb-16">
      {/* Hero */}
      <div className="relative h-72 sm:h-80">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${contest.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute top-5 left-5 flex items-center gap-1.5 text-white/80 text-sm hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          목록으로
        </button>

        {/* D-day Badge */}
        <span
          className={`absolute top-5 right-5 text-sm font-bold px-3 py-1 rounded-full ${getDdayColorClass(dday)}`}
        >
          {ddayLabel}
        </span>

        {/* Brand Info */}
        <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 pb-6">
          <span className="inline-block text-xs bg-white/20 text-white border border-white/30 rounded-full px-3 py-1 mb-2">
            {contest.industry}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {contest.brand}
          </h1>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {contest.contentTypes.map((ct) => (
              <span key={ct} className="text-xs text-white/70 bg-white/10 rounded-full px-2 py-0.5">
                {ct}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div
        className="px-5 sm:px-8 py-5"
        style={{ background: "linear-gradient(135deg, #b26efd 0%, #9a7ef5 50%, #93b5f6 100%)" }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4 text-white text-center">
          <div>
            <p className="text-white/70 text-xs mb-0.5">총 상금</p>
            <p className="font-black text-lg">{formatPrize(contest.prize)}</p>
          </div>
          <div>
            <p className="text-white/70 text-xs mb-0.5">마감일</p>
            <p className="font-bold text-sm">{contest.deadline}</p>
          </div>
          <div>
            <p className="text-white/70 text-xs mb-0.5">지원자</p>
            <p className="font-black text-lg">{contest.applicants}명</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* AI 활용 여부 */}
            <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
              {contest.aiAllowed ? (
                <>
                  <Bot size={22} style={{ color: "#b26efd" }} />
                  <div>
                    <p className="text-sm font-bold text-gray-900">AI 활용 가능</p>
                    <p className="text-xs text-gray-400">이 공모전은 AI 도구 사용을 허용합니다.</p>
                  </div>
                  <span className="ml-auto text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-1 rounded-full">
                    허용
                  </span>
                </>
              ) : (
                <>
                  <BotOff size={22} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">AI 활용 불가</p>
                    <p className="text-xs text-gray-400">이 공모전은 AI 도구 사용을 금지합니다.</p>
                  </div>
                  <span className="ml-auto text-xs bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-full">
                    금지
                  </span>
                </>
              )}
            </div>

            {/* Reference Gallery */}
            {contest.brandImages.length > 0 && (
              <SectionCard title="브랜드 레퍼런스" icon={<Sparkles size={18} />}>
                <ImageGallery images={contest.brandImages} alt={contest.brand} />
              </SectionCard>
            )}

            {/* Brand Story */}
            <SectionCard title="브랜드 스토리" icon={<MessageSquare size={18} />}>
              <p className="text-sm text-gray-700 leading-relaxed">{contest.brandStory}</p>
              {contest.brandIdentity && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1.5">
                    브랜드 아이덴티티
                  </p>
                  <p className="text-sm text-gray-700">{contest.brandIdentity}</p>
                </div>
              )}
            </SectionCard>

            {/* Keywords & Colors */}
            <SectionCard title="브랜드 키워드 · 색상" icon={<Sparkles size={18} />}>
              <div className="flex flex-wrap gap-2 mb-5">
                {contest.brandKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-sm font-medium px-3 py-1 rounded-full border"
                    style={{ borderColor: "#b26efd", color: "#b26efd", background: "#faf5ff" }}
                  >
                    # {kw}
                  </span>
                ))}
              </div>
              {contest.brandColors.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2.5">브랜드 색상</p>
                  <div className="flex gap-3">
                    {contest.brandColors.map((hex) => (
                      <div key={hex} className="flex flex-col items-center gap-1">
                        <div
                          className="w-10 h-10 rounded-xl border border-gray-200 shadow-sm"
                          style={{ background: hex }}
                        />
                        <span className="text-[10px] text-gray-500 font-mono">{hex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Apply CTA */}
            <div
              className="rounded-2xl p-6 text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, #f3b0f2 0%, #b26efd 55%, #93b5f6 100%)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={18} />
                <span className="font-bold">총 상금</span>
              </div>
              <p className="text-3xl font-black mb-1">{formatPrize(contest.prize)}</p>
              <p className="text-white/80 text-sm mb-5">마감 {ddayLabel}</p>
              <button
                type="button"
                onClick={handleApply}
                className="w-full py-3 rounded-xl bg-white font-bold text-sm transition-opacity hover:opacity-90"
                style={{ color: "#b26efd" }}
              >
                {isLoggedIn ? "지금 지원하기" : "로그인 후 지원하기"}
              </button>
              <div className="flex items-center justify-center gap-4 mt-4 text-white/70 text-xs">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {contest.deadline}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={12} /> {contest.applicants}명 지원
                </span>
              </div>
            </div>

            {/* Target Consumer */}
            <SectionCard title="타겟 소비자" icon={<Target size={18} />}>
              <InfoRow label="나이" value={contest.targetConsumer.ageRange} />
              <InfoRow label="성별" value={contest.targetConsumer.gender} />
              <InfoRow label="직업" value={contest.targetConsumer.occupation} />
              <InfoRow label="지역" value={contest.targetConsumer.region} />
              {contest.targetConsumer.interests.length > 0 && (
                <div className="pt-3">
                  <p className="text-xs text-gray-400 mb-2">관심사</p>
                  <div className="flex flex-wrap gap-1.5">
                    {contest.targetConsumer.interests.map((interest) => (
                      <span
                        key={interest}
                        className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>

            {/* Product Details */}
            <SectionCard title="제품 정보" icon={<ShoppingBag size={18} />}>
              <InfoRow label="가격대" value={contest.product.priceRange} />
              {contest.product.differentiation && (
                <div className="py-2 border-b border-gray-50">
                  <p className="text-xs text-gray-400 mb-1">차별화 포인트</p>
                  <p className="text-sm text-gray-800">{contest.product.differentiation}</p>
                </div>
              )}
              {contest.product.additionalInfo && (
                <div className="py-2">
                  <p className="text-xs text-gray-400 mb-1">추가 정보</p>
                  <p className="text-sm text-gray-800">{contest.product.additionalInfo}</p>
                </div>
              )}
            </SectionCard>

            {/* Additional Requests */}
            {contest.additionalRequests && (
              <SectionCard title="추가 요청사항" icon={<MessageSquare size={18} />}>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {contest.additionalRequests}
                </p>
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

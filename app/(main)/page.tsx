"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Skeleton } from "@/components/ui/skeleton";
import { carouselSlides } from "@/data/carousel";
import { useLatestContests } from "@/features/contests/hooks/useLatestContests";
import { ContestCard } from "@/features/contests/ui/ContestCard";

// ── Carousel SVG 일러스트 (data/carousel.ts에서 분리 — JSX 포함) ─────────────
const ILLUSTRATIONS = [
  // Problem 01 — 주관적 시각
  <svg key={1} viewBox="0 0 320 160" style={{ width: "100%", height: "auto" }} xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="20" width="72" height="96" rx="8" fill="#f8f4ff" stroke="#ddd6fe" strokeWidth="1.5"/>
    <rect x="17" y="28" width="58" height="38" rx="4" fill="#ede9fe" opacity="0.6"/>
    <rect x="17" y="72" width="42" height="6" rx="3" fill="#ddd6fe"/>
    <rect x="17" y="82" width="30" height="6" rx="3" fill="#ede9fe"/>
    <rect x="124" y="8" width="72" height="112" rx="8" fill="white" stroke="#b26efd" strokeWidth="2.5"/>
    <rect x="131" y="16" width="58" height="38" rx="4" fill="#f0e4ff"/>
    <rect x="131" y="60" width="42" height="6" rx="3" fill="#d8b4fe"/>
    <rect x="133" y="94" width="56" height="20" rx="10" fill="#b26efd"/>
    <text x="161" y="108" textAnchor="middle" fontSize="9" fill="white" fontFamily="sans-serif" fontWeight="bold">대표자 선택 ✓</text>
    <rect x="238" y="20" width="72" height="96" rx="8" fill="#f8f4ff" stroke="#ddd6fe" strokeWidth="1.5"/>
    <rect x="245" y="28" width="58" height="38" rx="4" fill="#ede9fe" opacity="0.6"/>
    <text x="160" y="150" textAnchor="middle" fontSize="10" fill="#9ca3af" fontFamily="sans-serif">브랜드 전략 없이 취향으로만 결정</text>
  </svg>,

  // Problem 02 — 불명확한 브랜드 정의
  <svg key={2} viewBox="0 0 320 160" style={{ width: "100%", height: "auto" }} xmlns="http://www.w3.org/2000/svg">
    <rect x="105" y="30" width="110" height="90" rx="10" fill="white" stroke="#e5e7eb" strokeWidth="1.5"/>
    <rect x="115" y="40" width="90" height="10" rx="4" fill="#f3f4f6"/>
    <rect x="115" y="55" width="70" height="7" rx="3" fill="#f3f4f6"/>
    <text x="160" y="110" textAnchor="middle" fontSize="44" fill="#e9d5ff" fontFamily="sans-serif" fontWeight="900">?</text>
    <text x="160" y="132" textAnchor="middle" fontSize="10" fill="#9ca3af" fontFamily="sans-serif">브랜드 정의 없음</text>
    <rect x="8" y="14" width="82" height="44" rx="8" fill="#f8f4ff" stroke="#ddd6fe" strokeWidth="1.5"/>
    <circle cx="28" cy="36" r="14" fill="#ede9fe"/>
    <text x="47" y="41" fontSize="11" fill="#b26efd" fontFamily="sans-serif" fontWeight="bold">★ 4.9</text>
    <line x1="90" y1="36" x2="103" y2="55" stroke="#ddd6fe" strokeWidth="1.5" strokeDasharray="4,3"/>
    <rect x="230" y="14" width="82" height="44" rx="8" fill="#f8f4ff" stroke="#ddd6fe" strokeWidth="1.5"/>
    <circle cx="250" cy="36" r="14" fill="#ede9fe"/>
    <text x="269" y="41" fontSize="11" fill="#b26efd" fontFamily="sans-serif" fontWeight="bold">★ 4.8</text>
    <line x1="230" y1="36" x2="217" y2="55" stroke="#ddd6fe" strokeWidth="1.5" strokeDasharray="4,3"/>
  </svg>,

  // Problem 03 — 브랜딩 = 로고?
  <svg key={3} viewBox="0 0 320 160" style={{ width: "100%", height: "auto" }} xmlns="http://www.w3.org/2000/svg">
    <circle cx="72" cy="80" r="54" fill="#f5f3ff" stroke="#b26efd" strokeWidth="2.5"/>
    <text x="72" y="72" textAnchor="middle" fontSize="28" fill="#b26efd" fontFamily="sans-serif" fontWeight="900">W</text>
    <text x="72" y="90" textAnchor="middle" fontSize="11" fill="#b26efd" fontFamily="sans-serif" fontWeight="bold">LOGO</text>
    <line x1="130" y1="80" x2="152" y2="80" stroke="#d1d5db" strokeWidth="2"/>
    <polygon points="148,75 158,80 148,85" fill="#d1d5db"/>
    <rect x="168" y="14" width="138" height="34" rx="7" fill="none" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="5,4"/>
    <text x="237" y="35" textAnchor="middle" fontSize="10" fill="#d1d5db" fontFamily="sans-serif">컬러 시스템?</text>
    <rect x="168" y="63" width="138" height="34" rx="7" fill="none" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="5,4"/>
    <text x="237" y="84" textAnchor="middle" fontSize="10" fill="#d1d5db" fontFamily="sans-serif">타겟 페르소나?</text>
    <rect x="168" y="112" width="138" height="34" rx="7" fill="none" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="5,4"/>
    <text x="237" y="133" textAnchor="middle" fontSize="10" fill="#d1d5db" fontFamily="sans-serif">브랜드 가이드?</text>
  </svg>,

  // Problem 04 — 불명확한 타게팅
  <svg key={4} viewBox="0 0 320 160" style={{ width: "100%", height: "auto" }} xmlns="http://www.w3.org/2000/svg">
    <circle cx="160" cy="80" r="70" fill="none" stroke="#fee2e2" strokeWidth="1.5"/>
    <circle cx="160" cy="80" r="50" fill="none" stroke="#fca5a5" strokeWidth="1.5"/>
    <circle cx="160" cy="80" r="30" fill="none" stroke="#f87171" strokeWidth="2"/>
    <circle cx="160" cy="80" r="10" fill="#ef4444" opacity="0.2"/>
    <text x="160" y="85" textAnchor="middle" fontSize="11" fill="#ef4444" fontFamily="sans-serif" fontWeight="bold">?</text>
    <text x="78" y="12" textAnchor="middle" fontSize="9" fill="#fca5a5" fontFamily="sans-serif">20대?</text>
    <text x="248" y="12" textAnchor="middle" fontSize="9" fill="#fca5a5" fontFamily="sans-serif">30대?</text>
    <text x="279" y="84" textAnchor="middle" fontSize="9" fill="#fca5a5" fontFamily="sans-serif">누구나</text>
  </svg>,

  // Problem 05 — 해외 시장의 장벽
  <svg key={5} viewBox="0 0 320 160" style={{ width: "100%", height: "auto" }} xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="18" width="82" height="110" rx="10" fill="#f0fdf4" stroke="#a7f3d0" strokeWidth="1.5"/>
    <rect x="16" y="28" width="66" height="50" rx="4" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
    <text x="49" y="94" textAnchor="middle" fontSize="9" fill="#059669" fontFamily="sans-serif" fontWeight="bold">🇰🇷 KR 원본</text>
    <line x1="94" y1="73" x2="116" y2="73" stroke="#d1d5db" strokeWidth="1.5"/>
    <polygon points="113,68 122,73 113,78" fill="#d1d5db"/>
    <rect x="122" y="18" width="82" height="110" rx="10" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1.5"/>
    <text x="163" y="94" textAnchor="middle" fontSize="9" fill="#d97706" fontFamily="sans-serif" fontWeight="bold">🇺🇸 US 번역본</text>
    <circle cx="199" cy="22" r="13" fill="#ef4444"/>
    <text x="199" y="28" textAnchor="middle" fontSize="15" fill="white" fontFamily="sans-serif" fontWeight="bold">!</text>
    <rect x="238" y="36" width="74" height="76" rx="10" fill="#fff0f0" stroke="#fca5a5" strokeWidth="1.5"/>
    <text x="275" y="122" textAnchor="middle" fontSize="9" fill="#ef4444" fontFamily="sans-serif" fontWeight="bold">문화·언어 충돌</text>
  </svg>,
];

// ── Why CreatiVue 데이터 ──────────────────────────────────────────────────────
const WHY_ITEMS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="17" x2="12" y2="22"/>
        <path d="M5 17h14v-1.76a2 2 0 00-1.11-1.79l-1.78-.9A2 2 0 0115 10.76V6h1a2 2 0 000-4H8a2 2 0 000 4h1v4.76a2 2 0 01-1.11 1.79l-1.78.9A2 2 0 005 15.24V17z"/>
      </svg>
    ),
    label: "직접 만드는 브랜드의 기준점",
    desc: "플랫폼 밖에서도 계속적 기준이 될 수 있게, 우리 브랜드를 직접 만들어가는 프로세스를 제공합니다.",
    badge: null,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
    label: "합리적 비용, 최상의 결과물",
    desc: "결과물을 미리 볼 수 있는 공모전을 통해 우리 브랜드의 가이드라인에 맞는 작업물을 선택할 수 있습니다.",
    badge: null,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9"/>
        <path d="M3 11V9a4 4 0 014-4h14"/>
        <polyline points="7 23 3 19 7 15"/>
        <path d="M21 13v2a4 4 0 01-4 4H3"/>
      </svg>
    ),
    label: "동일 프리랜서와 재협업 시 최소 수수료 혜택",
    desc: "이미 우리 브랜드에 대해 잘 알고 있는 프리랜서와 재협업 시 플랫폼 수수료를 대폭 절감할 수 있습니다.",
    badge: null,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="7" r="3"/>
        <path d="M3 19a5 5 0 018 0"/>
        <circle cx="18" cy="14" r="4.5"/>
        <line x1="21.5" y1="17.5" x2="24" y2="20"/>
      </svg>
    ),
    label: "타겟 소비자의 인사이트를 얻는 검수(QC)",
    desc: "해외 시장을 타겟팅한 콘텐츠 제작 시, 놓칠 수 있는 현지 소비자들의 문화·언어 인사이트를 검수합니다.",
    badge: "Overseas-Targeted Content Only",
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const { data: latestContests, isLoading } = useLatestContests();

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", background: "#f8f8fc" }}>

      {/* ── HERO: 왼쪽 패널 + 오른쪽 캐러셀 ─────────────────────────────── */}
      <div
        className="flex flex-col lg:flex-row items-stretch gap-6"
        style={{ padding: "32px 32px 0" }}
      >
        {/* 왼쪽 — 보라 그라디언트 카드 */}
        <div
          className="w-full lg:w-[360px] lg:flex-shrink-0 flex flex-col justify-center items-center text-center rounded-[20px]"
          style={{
            background: "linear-gradient(160deg, #c084fc 0%, #b26efd 45%, #93b5f6 100%)",
            padding: "56px 44px",
            boxShadow: "0 8px 32px rgba(178,110,253,0.25)",
          }}
        >
          {/* 배지 */}
          <div
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white rounded-full mb-6"
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.4)",
              padding: "6px 14px",
            }}
          >
            <span>💡</span>
            우리 브랜드만의 템플릿을 찾아보세요!
          </div>

          {/* 헤드라인 */}
          <h1
            className="text-white font-black leading-tight mb-3.5"
            style={{ fontSize: "2.1rem", letterSpacing: "-0.03em" }}
          >
            Broaden your<br />world with{" "}
            <span className="text-white">CreatiVue</span>
          </h1>
          <p
            className="text-sm leading-relaxed mb-10"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            브랜드를 가장 잘 아는 곳에서 시작해,<br />
            다양한 관점으로 쌓아가는 브랜드 자산
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => router.push("/client-signup")}
              className="flex items-center justify-center gap-2 h-[52px] rounded-[14px] font-bold text-[15px] transition-opacity hover:opacity-90"
              style={{
                background: "white",
                color: "#b26efd",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#b26efd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="15" rx="2"/>
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                <line x1="12" y1="12" x2="12" y2="12.01"/>
                <path d="M8 12h8M8 16h8"/>
              </svg>
              기업/대표자 등록
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#b26efd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>

            <button
              onClick={() => router.push("/freelancer-signup")}
              className="flex items-center justify-center gap-2 h-[52px] rounded-[14px] font-bold text-[15px] text-white transition-opacity hover:opacity-90"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.6)",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/>
              </svg>
              프리랜서 등록
            </button>
          </div>
        </div>

        {/* 오른쪽 — Swiper 캐러셀 */}
        <div className="flex-1 min-w-0">
          <div
            className="w-full h-full rounded-[20px] overflow-hidden bg-white"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
          >
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              loop
              onSwiper={(swiper) => { swiperRef.current = swiper; }}
              onSlideChange={(swiper) => setActiveIdx(swiper.realIndex)}
            >
              {carouselSlides.map((slide, i) => (
                <SwiperSlide key={slide.id}>
                  <div className="flex" style={{ minHeight: 460 }}>
                    {/* 일러스트 */}
                    <div
                      className="hidden sm:flex items-center justify-center flex-shrink-0"
                      style={{ width: "46%", background: slide.bg, padding: 36 }}
                    >
                      {ILLUSTRATIONS[i]}
                    </div>

                    {/* 텍스트 */}
                    <div
                      className="flex-1 flex flex-col justify-center"
                      style={{ padding: "44px 36px" }}
                    >
                      <span
                        className="text-[11px] font-bold text-white rounded-full w-fit mb-4"
                        style={{
                          background: "linear-gradient(135deg, #f3b0f2, #b26efd, #93b5f6)",
                          padding: "3px 12px",
                        }}
                      >
                        {slide.tag}
                      </span>
                      <h3
                        className="font-black mb-2"
                        style={{ fontSize: 24, color: "#1a0533", letterSpacing: "-0.02em" }}
                      >
                        {slide.title}
                      </h3>
                      <p className="text-sm font-medium mb-4" style={{ color: "#9ca3af" }}>
                        &quot;{slide.subtitle}&quot;
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                        {slide.desc}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* 컨트롤 바 — 이전/도트/다음 */}
            <div
              className="flex items-center justify-between"
              style={{ padding: "14px 28px" }}
            >
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="flex items-center justify-center transition-colors hover:bg-purple-50"
                style={{
                  width: 36, height: 36,
                  borderRadius: 99,
                  border: "1.5px solid #e9d5ff",
                  background: "white",
                }}
                aria-label="이전 슬라이드"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b26efd" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>

              {/* 도트 인디케이터 */}
              <div className="flex items-center gap-1.5">
                {carouselSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => swiperRef.current?.slideToLoop(i)}
                    aria-label={`슬라이드 ${i + 1}`}
                    className="h-2 rounded-full border-none cursor-pointer transition-all duration-300"
                    style={{
                      width: i === activeIdx ? 28 : 8,
                      background:
                        i === activeIdx
                          ? "linear-gradient(90deg, #b26efd, #93b5f6)"
                          : "#e9d5ff",
                      padding: 0,
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="flex items-center justify-center transition-colors hover:bg-purple-50"
                style={{
                  width: 36, height: 36,
                  borderRadius: 99,
                  border: "1.5px solid #e9d5ff",
                  background: "white",
                }}
                aria-label="다음 슬라이드"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b26efd" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 메인 콘텐츠 영역 ──────────────────────────────────────────────── */}
      <div style={{ padding: "64px 40px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* ── 공모전 섹션 ─────────────────────────────────────────────── */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b26efd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2c0 0-5 4-5 9a5 5 0 0010 0c0-3-2-6-2-6s-1 2-2 3c-1-2-1-6-1-6z"/>
                </svg>
                <span
                  className="text-[11px] font-bold uppercase"
                  style={{ color: "#b26efd", letterSpacing: "0.08em" }}
                >
                  Live Now
                </span>
              </div>
              <h2
                className="font-black"
                style={{ fontSize: 22, color: "#1a0533", letterSpacing: "-0.02em" }}
              >
                최근 진행 중인 콘테스트
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-sm font-bold transition-opacity hover:opacity-70"
              style={{ color: "#b26efd" }}
            >
              전체 보기 →
            </Link>
          </div>

          {/* 3×2 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white overflow-hidden"
                    style={{ borderRadius: 18, border: "1px solid #f0f0f6" }}
                  >
                    <Skeleton className="w-full" style={{ height: 160 }} />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-10 w-full mt-3" />
                    </div>
                  </div>
                ))
              : latestContests?.map((contest) => (
                  <ContestCard key={contest.id} contest={contest} />
                ))}
          </div>

          {/* ── Why CreatiVue ────────────────────────────────────────────── */}
          <div className="text-center" style={{ marginTop: 120 }}>
            <h2
              className="font-black mb-2"
              style={{ fontSize: 26, color: "#1a0533", letterSpacing: "-0.02em" }}
            >
              왜{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #b26efd, #93b5f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                CreatiVue
              </span>
              인가요?
            </h2>
            <p className="text-sm mb-10" style={{ color: "#9ca3af" }}>
              브랜딩 시작부터 콘텐츠 제작까지, 전 과정을 하나의 플랫폼에서
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WHY_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-3.5 text-left"
                  style={{
                    background: "white",
                    borderRadius: 18,
                    border: "1px solid #f0f0f6",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    padding: "28px 24px",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 48, height: 48,
                        borderRadius: 14,
                        background: "linear-gradient(135deg, #c084fc, #b26efd)",
                      }}
                    >
                      {item.icon}
                    </div>
                    {item.badge && (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold rounded-full"
                        style={{
                          color: "#92400e",
                          background: "#fef9c3",
                          border: "1px solid #fde68a",
                          padding: "3px 10px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="2" y1="12" x2="22" y2="12"/>
                          <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
                        </svg>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <p
                      className="font-extrabold mb-1.5 leading-snug"
                      style={{ fontSize: 15, color: "#1a0533" }}
                    >
                      {item.label}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 여백 */}
          <div style={{ height: 72 }} />
        </div>
      </div>
    </div>
  );
}

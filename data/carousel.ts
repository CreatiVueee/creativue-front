import type { CarouselSlide } from "@/shared/types";

// ─── Landing Page Carousel (Problem 01~05) ────────────────────────────────────
// 각 슬라이드의 illustration SVG는 features/landing/ui/CarouselSlide.tsx 에서 inline으로 정의
// (JSX 포함 복잡한 SVG이므로 데이터 파일에서 분리)

export const carouselSlides: CarouselSlide[] = [
  {
    id: 1,
    tag: "Problem 01",
    title: "주관적 시각",
    subtitle: "대표자의 눈에 예쁜 포스터가 정답?",
    desc: "브랜드 전략 없이 대표자 개인의 취향으로 디자인을 선택하면, 정작 소비자에게는 전혀 다른 메시지가 전달됩니다.",
    bg: "linear-gradient(135deg, #fdf4ff 0%, #f0e4ff 100%)",
  },
  {
    id: 2,
    tag: "Problem 02",
    title: "불명확한 브랜드 정의",
    subtitle: "자사 브랜드를 모른 채 마케팅 시작",
    desc: "브랜드 아이덴티티 없이 프리랜서 평점만 보고 의뢰하면 매번 다른 결과물이 나옵니다. 일관성 있는 브랜드를 만들 수 없어요.",
    bg: "linear-gradient(135deg, #eef4ff 0%, #dde8ff 100%)",
  },
  {
    id: 3,
    tag: "Problem 03",
    title: "브랜딩 = 로고?",
    subtitle: "로고 하나로 마케팅을 시작하는 함정",
    desc: "로고는 브랜딩의 시작일 뿐입니다. 색상 체계, 톤앤매너, 타겟 페르소나 없이는 로고조차 제 역할을 못합니다.",
    bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
  },
  {
    id: 4,
    tag: "Problem 04",
    title: "불명확한 타게팅",
    subtitle: '"누구에게 팔고 싶으세요?" → 침묵',
    desc: "타겟 고객을 명확히 정의하지 못하면 어떤 마케팅도 효과를 내기 어렵습니다. 모두를 타겟으로 삼으면 아무도 잡을 수 없습니다.",
    bg: "linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%)",
  },
  {
    id: 5,
    tag: "Problem 05",
    title: "해외 시장의 장벽",
    subtitle: "현지 정서를 모르는 글로벌 콘텐츠",
    desc: "해외 소비자를 대상으로 한 콘텐츠에 정서적·문화적·언어적 오류가 있으면 브랜드 이미지가 심각하게 손상될 수 있습니다.",
    bg: "linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)",
  },
];

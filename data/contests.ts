import type { Contest } from "@/shared/types";

// ─── Contest Dummy Data ───────────────────────────────────────────────────────
// ⚠️ dday 필드 없음 — 렌더링 시 calcDday(deadline) 로 실시간 계산
// ⏳ 나중에: Supabase `contests` 테이블 쿼리로 교체

export const contests: Contest[] = [
  {
    id: 1,
    brand: "TechStart Inc.",
    industry: "IT / 테크",
    contentTypes: ["로고", "디지털 광고 템플릿"],
    deadline: "2026-06-13",
    prize: 3000000,
    applicants: 47,
    hot: true,
    aiAllowed: true,
    image:
      "https://images.unsplash.com/photo-1590102426275-8d1c367070d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    brandImages: [
      "https://images.unsplash.com/photo-1622465911894-1e73cbdc293a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1642132652866-6fa262d3161f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    ],
    categoryId: "logo",
    brandIdentity: "혁신적이고 신뢰할 수 있는 B2B SaaS 스타트업",
    brandStory:
      "TechStart Inc.는 2021년 서울에서 설립된 B2B SaaS 스타트업으로, 중소기업의 디지털 전환을 돕는 솔루션을 제공합니다. '기술로 더 나은 비즈니스를'이라는 슬로건 아래, 복잡한 업무 흐름을 단순하게 만드는 것을 목표로 합니다. 현재 50여 개 기업과 파트너십을 맺고 빠르게 성장 중입니다.",
    brandKeywords: ["혁신", "신뢰", "미래지향적", "심플", "전문적"],
    brandColors: ["#1e3a5f", "#3b82f6", "#e0f2fe"],
    targetConsumer: {
      ageRange: "28-45세",
      gender: "성별 무관",
      occupation: "중소기업 경영진 · IT 담당자",
      interests: ["기술 트렌드", "비즈니스 혁신", "생산성"],
      region: "국내 (서울 / 수도권 중심)",
    },
    product: {
      priceRange: "월 구독 ₩49,000 ~ ₩299,000 (플랜별)",
      differentiation:
        "국내 중소기업에 최적화된 한국어 UX와 국세청 연동 자동화 기능으로, 해외 SaaS 대비 온보딩 시간을 70% 단축합니다.",
      additionalInfo:
        "현재 무료 체험 30일 제공 중이며, 연간 결제 시 20% 할인 혜택이 있습니다. 엔터프라이즈 플랜은 별도 문의 가능합니다.",
    },
    additionalRequests:
      "브랜드 컬러인 네이비와 블루 계열을 유지해 주세요. 너무 화려하거나 유머러스한 톤은 지양하고, 신뢰감과 전문성이 느껴지는 방향으로 제작 부탁드립니다.",
  },
  {
    id: 2,
    brand: "GreenPack Co.",
    industry: "환경 / 지속가능성",
    contentTypes: ["제품 디자인", "상세페이지"],
    deadline: "2026-06-18",
    prize: 2000000,
    applicants: 32,
    hot: false,
    aiAllowed: false,
    image:
      "https://images.unsplash.com/photo-1684326156737-4755d6d03524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    brandImages: [
      "https://images.unsplash.com/photo-1739949381110-81f449e5a494?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1760368104753-fe0994f94ff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    ],
    categoryId: "product",
    brandIdentity: "자연 친화적이고 지속 가능한 패키징 브랜드",
    brandStory:
      "GreenPack Co.는 '포장재도 지구의 일부'라는 철학으로 2020년 창업했습니다. 100% 생분해 소재를 사용하며, 버려진 해양 플라스틱을 업사이클링한 제품 라인을 운영하고 있습니다. 환경을 생각하는 소비자와 기업을 연결하는 것이 핵심 미션입니다.",
    brandKeywords: ["친환경", "자연", "지속가능성", "따뜻함", "책임감"],
    brandColors: ["#166534", "#4ade80", "#f0fdf4"],
    targetConsumer: {
      ageRange: "22-40세",
      gender: "여성 60% · 남성 40%",
      occupation: "환경 의식 있는 일반 소비자 · 친환경 기업",
      interests: ["제로웨이스트", "비건", "지속가능한 라이프스타일"],
      region: "국내 전국 · 유럽 일부",
    },
    product: {
      priceRange: "₩2,500 ~ ₩18,000 (단품 기준) / 기업 대량 주문 별도 협의",
      differentiation:
        "해양 폐플라스틱 업사이클링 소재를 세계 최초로 상용화한 식품용 포장재로, 일반 종이백 대비 탄소 배출량 58% 절감 인증을 받았습니다.",
      additionalInfo:
        "B2B 기업 고객에게는 전용 패키징 디자인 커스터마이징 서비스도 제공하며, MOQ(최소 주문 수량)는 500개입니다.",
    },
    additionalRequests:
      "그린 계열 색상을 중심으로, 너무 딱딱하거나 기업스럽지 않게 따뜻하고 유기적인 느낌으로 표현해 주세요. 손글씨 느낌의 폰트도 환영합니다.",
  },
  {
    id: 3,
    brand: "Glow Beauty",
    industry: "패션 / 뷰티",
    contentTypes: ["DA", "배너 광고", "해외 광고"],
    deadline: "2026-06-07",
    prize: 5000000,
    applicants: 89,
    hot: true,
    aiAllowed: true,
    image:
      "https://images.unsplash.com/photo-1776015036380-4022fe844ed8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    brandImages: [
      "https://images.unsplash.com/photo-1765887986673-953fccf56464?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1764698192249-641a17d7a4fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    ],
    categoryId: "da",
    brandIdentity: "감각적이고 자신감 넘치는 K-뷰티 럭셔리 브랜드",
    brandStory:
      "Glow Beauty는 2019년 론칭한 프리미엄 K-뷰티 브랜드입니다. '당신의 빛을 발견하라'는 메시지를 중심으로, 피부 본연의 아름다움을 극대화하는 스킨케어 라인을 선보이고 있습니다. 현재 일본·동남아시아 시장에 활발히 진출 중입니다.",
    brandKeywords: ["글로우", "럭셔리", "자신감", "감각적", "K-뷰티"],
    brandColors: ["#831843", "#f9a8d4", "#fff1f2"],
    targetConsumer: {
      ageRange: "20-35세",
      gender: "여성 중심",
      occupation: "뷰티·패션에 관심 높은 직장인 · 대학생",
      interests: ["스킨케어", "메이크업", "K-pop", "인스타그램"],
      region: "한국 · 일본 · 동남아시아",
    },
    product: {
      priceRange:
        "₩28,000 ~ ₩120,000 (스킨케어 라인) / 세트 구성 시 최대 30% 할인",
      differentiation:
        "국내 특허 발효 성분 'Glow-X™'를 독점 적용해 4주 만에 피부 광도 42% 개선 효과를 임상으로 입증했습니다. 파라벤·합성향 무첨가 클린 뷰티 인증 보유.",
      additionalInfo:
        "일본 라쿠텐·라자다 동남아 입점 완료. 면세점 전용 한정 패키지 라인업도 운영 중입니다.",
    },
    additionalRequests:
      "로즈 핑크와 골드 컬러 조합을 선호합니다. 광고 이미지에 제품이 중심에 오도록 구성해 주시고, 해외 광고는 영문 카피도 함께 제안해 주세요.",
  },
  {
    id: 4,
    brand: "Brew House",
    industry: "푸드 / 음료",
    contentTypes: ["로고", "포스터 템플릿"],
    deadline: "2026-06-25",
    prize: 1500000,
    applicants: 21,
    hot: false,
    aiAllowed: false,
    image:
      "https://images.unsplash.com/photo-1774921676744-4c4133c44bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    brandImages: [
      "https://images.unsplash.com/photo-1622465911894-1e73cbdc293a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1760368104753-fe0994f94ff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    ],
    categoryId: "logo",
    brandIdentity: "동네 사람들이 편하게 드나드는 아날로그 감성 카페",
    brandStory:
      "Brew House는 2018년 성수동 골목에서 시작한 카페 브랜드입니다. 바리스타가 직접 로스팅한 원두와 제철 재료를 활용한 음료로 입소문을 탔고, 현재 전국 8개 지점으로 성장했습니다. 브랜드 리뉴얼을 통해 레트로하면서도 세련된 감각으로 정체성을 재정비하고자 합니다.",
    brandKeywords: ["아날로그", "따뜻함", "레트로", "정직함", "동네 감성"],
    brandColors: ["#78350f", "#d97706", "#fffbeb"],
    targetConsumer: {
      ageRange: "22-38세",
      gender: "성별 무관",
      occupation: "카페를 즐겨 찾는 직장인 · 프리랜서",
      interests: ["커피", "독서", "로컬 문화", "빈티지"],
      region: "국내 전국",
    },
    product: {
      priceRange:
        "음료 ₩4,500 ~ ₩8,500 / 베이커리 ₩3,000 ~ ₩7,000 / 원두 소분 판매 ₩12,000~",
      differentiation:
        "전국 소농가와 직접 계약한 단일 원산지 원두를 사용하며, 주문 즉시 핸드드립으로 제공합니다. 스페셜티 커피 협회(SCA) 공인 바리스타가 상주합니다.",
      additionalInfo:
        "멤버십 가입 시 음료 10% 상시 할인 적용. 매월 한정판 시즌 메뉴와 원두 구독 서비스도 운영 중입니다.",
    },
    additionalRequests:
      "너무 트렌디하거나 모던한 방향보다는, 오래된 커피숍 느낌의 따뜻하고 정감 있는 스타일로 부탁드립니다. 영문과 한글 로고 버전 모두 제안해 주세요.",
  },
  {
    id: 5,
    brand: "DigitalMake",
    industry: "IT / 테크",
    contentTypes: ["디지털 광고 템플릿", "배너 광고"],
    deadline: "2026-06-01",
    prize: 4000000,
    applicants: 156,
    hot: true,
    aiAllowed: true,
    image:
      "https://images.unsplash.com/photo-1767449441925-737379bc2c4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    brandImages: [
      "https://images.unsplash.com/photo-1642132652866-6fa262d3161f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1622465911894-1e73cbdc293a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    ],
    categoryId: "digital",
    brandIdentity: "크리에이터를 위한 올인원 디지털 마케팅 플랫폼",
    brandStory:
      "DigitalMake는 소규모 크리에이터와 1인 기업이 손쉽게 디지털 광고를 제작·집행할 수 있도록 돕는 플랫폼입니다. 2022년 출시 이후 MAU 50만을 돌파하며 급성장 중이며, 현재 시리즈 B 투자를 완료한 상태입니다.",
    brandKeywords: ["역동적", "테크", "접근성", "크리에이티브", "성장"],
    brandColors: ["#4f46e5", "#818cf8", "#eef2ff"],
    targetConsumer: {
      ageRange: "20–35세",
      gender: "성별 무관",
      occupation: "1인 크리에이터 · 스타트업 마케터",
      interests: ["SNS 마케팅", "콘텐츠 제작", "디지털 트렌드"],
      region: "국내 전국",
    },
    product: {
      priceRange: "무료 플랜 / 프로 ₩15,900/월 / 비즈니스 ₩49,000/월",
      differentiation:
        "AI 자동 광고 소재 생성 기능으로 평균 제작 시간을 90% 단축하며, 국내 주요 플랫폼(카카오·네이버·메타) 동시 집행 연동을 단일 대시보드에서 지원합니다.",
      additionalInfo:
        "비즈니스 플랜 이상 구독 시 전담 마케팅 컨설턴트 배정. 연간 결제 시 2개월 무료 제공됩니다.",
    },
    additionalRequests:
      "퍼플·인디고 계열의 브랜드 컬러를 활용하되, 역동적이고 생동감 있는 구성을 원합니다. 다양한 사이즈(PC·모바일·인스타그램 스토리)에 맞는 템플릿 세트로 제안해 주세요.",
  },
  {
    id: 6,
    brand: "StyleMe",
    industry: "패션 / 뷰티",
    contentTypes: ["슬로건", "포스터 템플릿"],
    deadline: "2026-07-04",
    prize: 800000,
    applicants: 14,
    hot: false,
    aiAllowed: true,
    image:
      "https://images.unsplash.com/photo-1763069228076-c7e3995e1769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    brandImages: [
      "https://images.unsplash.com/photo-1764698192249-641a17d7a4fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1765887986673-953fccf56464?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    ],
    categoryId: "slogan",
    brandIdentity: "나만의 스타일을 찾아가는 패션 큐레이션 플랫폼",
    brandStory:
      "StyleMe는 AI 기반 퍼스널 스타일링 서비스로, 사용자의 체형·취향·라이프스타일 데이터를 분석해 최적의 코디를 추천합니다. '패션은 자기표현'이라는 철학 아래, 누구나 자신에게 어울리는 스타일을 쉽게 찾을 수 있도록 돕습니다.",
    brandKeywords: ["개성", "자유", "세련됨", "자기표현", "트렌디"],
    brandColors: ["#111827", "#f3f4f6", "#ec4899"],
    targetConsumer: {
      ageRange: "18-30세",
      gender: "여성 70% · 남성 30%",
      occupation: "패션에 관심 많은 대학생 · 사회초년생",
      interests: ["패션", "SNS", "쇼핑", "트렌드"],
      region: "국내 전국",
    },
    product: {
      priceRange: "앱 무료 사용 / 프리미엄 스타일링 서비스 ₩29,000/월",
      differentiation:
        "체형 데이터 기반 AI가 약 800만 가지 코디 조합 중 개인 최적안을 제시하며, 제휴 브랜드 상품을 앱 내에서 바로 구매 연동할 수 있습니다.",
      additionalInfo:
        "현재 무신사·29CM·에이블리와 데이터 파트너십 체결. 스타일리스트 1:1 화상 컨설팅 서비스도 월 2회 제공됩니다.",
    },
    additionalRequests:
      "모노크롬(블랙·화이트)에 포인트 핑크 조합을 선호합니다. 슬로건은 짧고 강렬하게, 포스터는 여백이 있는 미니멀한 스타일로 부탁드립니다.",
  },
  {
    id: 7,
    brand: "FreshFood",
    industry: "푸드 / 음료",
    contentTypes: ["상세페이지", "DA"],
    deadline: "2026-06-11",
    prize: 1200000,
    applicants: 38,
    hot: false,
    aiAllowed: false,
    image:
      "https://images.unsplash.com/photo-1650533184111-7f18c86be34a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    brandImages: [
      "https://images.unsplash.com/photo-1760368104753-fe0994f94ff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1739949381110-81f449e5a494?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    ],
    categoryId: "detail",
    brandIdentity: "산지 직송 신선 식품의 건강한 즐거움",
    brandStory:
      "FreshFood는 전국 농가와 직거래해 신선한 제철 식재료를 당일 배송하는 서비스입니다. '농부의 정성, 식탁까지'라는 슬로건으로 2020년 런칭해 현재 월 주문 30만 건을 달성했습니다. 건강한 먹거리에 대한 소비자 신뢰를 최우선 가치로 삼습니다.",
    brandKeywords: ["신선함", "건강", "정직", "자연", "따뜻한 식탁"],
    brandColors: ["#15803d", "#fbbf24", "#f0fdf4"],
    targetConsumer: {
      ageRange: "28-50세",
      gender: "여성 65% · 남성 35%",
      occupation: "건강을 챙기는 주부 · 맞벌이 가정",
      interests: ["건강식", "요리", "육아", "친환경 소비"],
      region: "국내 전국",
    },
    product: {
      priceRange:
        "정기구독 ₩39,000/주 ~ ₩89,000/주 (박스 구성별) / 단품 주문 별도",
      differentiation:
        "산지 출발 후 12시간 내 새벽 배송 완료를 보장하는 콜드체인 시스템을 독자 구축했습니다. 전국 230개 제휴 농가와의 직거래로 유통 마진 없이 최저가 제공합니다.",
      additionalInfo:
        "첫 주문 50% 할인 이벤트 상시 운영 중. 가족 구성원 수와 식단 선호도를 입력하면 맞춤형 박스가 자동 구성됩니다.",
    },
    additionalRequests:
      "신선함과 자연스러움이 느껴지도록, 음식 자체의 비주얼이 중심이 되는 구성으로 부탁드립니다. 상세페이지는 모바일 최적화 버전으로 제작해 주세요.",
  },
  {
    id: 8,
    brand: "TechCorp Korea",
    industry: "IT / 테크",
    contentTypes: ["해외 광고", "디지털 광고 템플릿", "배너 광고"],
    deadline: "2026-05-29",
    prize: 6000000,
    applicants: 203,
    hot: true,
    aiAllowed: true,
    image:
      "https://images.unsplash.com/photo-1764123108291-0f48d2c7e563?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    brandImages: [
      "https://images.unsplash.com/photo-1762163516269-3c143e04175c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1642132652866-6fa262d3161f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    ],
    categoryId: "global",
    brandIdentity: "글로벌 시장을 선도하는 한국 대표 IT 기업",
    brandStory:
      "TechCorp Korea는 1998년 설립된 종합 IT 솔루션 기업으로, 클라우드·AI·보안 분야에서 아시아 10개국에 서비스를 제공하고 있습니다. 창립 이후 꾸준한 R&D 투자로 국내 IT 특허 1위를 기록하고 있으며, 2026년 북미 시장 진출을 본격화할 예정입니다.",
    brandKeywords: ["글로벌", "리더십", "신뢰", "혁신", "첨단기술"],
    brandColors: ["#0f172a", "#3b82f6", "#dbeafe"],
    targetConsumer: {
      ageRange: "30-55세",
      gender: "성별 무관",
      occupation: "대기업 IT 담당자 · 해외 기업 의사결정자",
      interests: ["클라우드 전환", "AI 솔루션", "사이버보안"],
      region: "한국 · 일본 · 동남아 · 북미",
    },
    product: {
      priceRange:
        "클라우드 플랜 $500~/월 (USD) / 엔터프라이즈 솔루션 별도 견적",
      differentiation:
        "자체 개발 AI 보안 엔진 'ShieldAI 3.0'으로 사이버 위협 탐지 정확도 99.7%를 달성했으며, ISMS·ISO27001 국제 인증을 동시 보유한 국내 유일 기업입니다.",
      additionalInfo:
        "POC(개념 검증) 무료 제공 후 도입 여부 결정 가능. 글로벌 고객사 전용 24/7 다국어 기술 지원 센터를 운영합니다.",
    },
    additionalRequests:
      "글로벌 B2B 톤앤매너를 유지해 주세요. 영문 카피가 포함된 버전과 각 국가별 현지화 버전을 별도로 제안해 주시면 좋겠습니다. 다크 배경 위 블루 컬러 조합을 선호합니다.",
  },
];

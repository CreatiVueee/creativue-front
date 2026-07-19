import type { Submission } from "@/shared/types";

// ─── Submission Dummy Data (PreVue) ────────────────────────────────────────────
// ⏳ 나중에: Supabase `project_submissions` 테이블 쿼리로 교체

export const submissions: Submission[] = [
  {
    id: 1, creatorHandle: "@jiwoo.design", title: "네이비 심볼 워드마크 로고",
    description: "브랜드의 신뢰성과 미래지향성을 담아 기하학적 심볼과 세리프 워드마크를 조합했습니다. 다양한 사이즈에서도 가독성이 유지되도록 설계했습니다.",
    tags: ["로고", "심볼", "네이비"], type: "로고", submittedAt: "2026-05-02",
    image: "https://images.unsplash.com/photo-1759563869318-54434b2abc68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rationale: { tone: "딥 네이비와 클린 화이트를 중심 톤으로 신뢰감과 미래지향성을 표현했습니다.", color: "네이비(#0D2B55)는 신뢰·전문성, 포인트 블루(#3A7BF7)는 혁신을 상징합니다.", layout: "심볼 좌측·워드마크 우측 수평 조합으로 확장성과 균형을 고려했습니다.", copy: "슬로건 없이 워드마크 레터링만으로 브랜드를 대변하도록 설계했습니다.", extra: "파비콘·앱 아이콘용 심볼 단독 버전과 모노크롬 버전도 함께 제작했습니다." },
  },
  {
    id: 2, creatorHandle: "@soomin.works", title: "그리드 기반 포스터 시리즈",
    description: "스위스 그리드 시스템을 기반으로 한 포스터 3종 세트입니다. 타이포그래피를 중심에 두고 여백을 적극 활용해 세련된 이미지를 표현했습니다.",
    tags: ["포스터", "그리드", "타이포그래피"], type: "포스터 템플릿", submittedAt: "2026-05-03",
    image: "https://images.unsplash.com/photo-1770581939371-326fc1537f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rationale: { tone: "헬베티카 계열 산세리프와 넓은 여백으로 군더더기 없는 이미지를 구현했습니다.", color: "블랙·화이트 베이스에 브랜드 블루 1포인트만 사용해 집중도를 높였습니다.", layout: "12컬럼 그리드로 시리즈 전체의 통일감을 유지했습니다.", copy: "핵심 메시지를 가장 큰 타입으로, 보조 정보는 작게 처리했습니다.", extra: "A1·A3·디지털(1920×1080) 세 가지 포맷으로 제작했습니다." },
  },
  {
    id: 3, creatorHandle: "@hyunseo.creative", title: "디지털 광고 모션 배너 세트",
    description: "SNS 및 디스플레이 광고에 최적화된 배너 시리즈입니다. 클릭율을 높이는 구성을 목표로 했습니다.",
    tags: ["배너", "디지털광고", "SNS"], type: "디지털 광고", submittedAt: "2026-05-04",
    image: "https://images.unsplash.com/photo-1571247999058-3b9e7b7f5047?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rationale: { tone: "다이나믹하고 에너지감 있는 톤으로 스크롤 중 시선을 멈추게 합니다.", color: "브랜드 블루 그라디언트(#1A73E8→#0D47A1)로 존재감을 강조했습니다.", layout: "CTA 우하단 고정, 메인 비주얼 상단 배치로 시선 흐름을 유도했습니다.", copy: "행동 유발형 카피와 15자 이내 헤드라인으로 가독성을 확보했습니다.", extra: "인스타그램·네이버GFA·카카오모먼트 사이즈 모두 포함되어 있습니다." },
  },
  {
    id: 4, creatorHandle: "@daaeun.studio", title: "미니멀 패키징 & 아이덴티티",
    description: "절제된 색상과 깔끔한 레이아웃으로 브랜드의 프리미엄 이미지를 표현했습니다.",
    tags: ["패키징", "아이덴티티", "미니멀"], type: "제품디자인", submittedAt: "2026-05-04",
    image: "https://images.unsplash.com/photo-1658387518136-703378fb6f48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rationale: { tone: "프리미엄·미니멀리즘을 키워드로 소재감과 여백으로 고급감을 표현했습니다.", color: "오프화이트(#F8F5F0)와 딥 차콜(#1C1C1E)의 투톤으로 감성을 유지했습니다.", layout: "로고를 중앙 엠보싱 처리하고 정보 텍스트를 최소화했습니다.", copy: "외면엔 브랜드명만, 내면엔 브랜드 스토리 한 문장으로 언박싱 경험을 설계했습니다.", extra: "박스·파우치·쇼핑백·명함·봉투 5종 세트입니다." },
  },
  {
    id: 5, creatorHandle: "@woojin.pixels", title: "소셜미디어 콘텐츠 패키지",
    description: "인스타그램 피드·릴스·스토리 모두를 아우르는 콘텐츠 패키지입니다.",
    tags: ["소셜미디어", "인스타그램", "그라데이션"], type: "소셜미디어", submittedAt: "2026-05-05",
    image: "https://images.unsplash.com/photo-1722172597269-d911054badb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rationale: { tone: "Z세대 감성의 비비드 컬러와 다이나믹한 레이아웃으로 트렌디한 이미지를 구현했습니다.", color: "퍼플-핑크 그라디언트를 시그니처로 피드에서 즉시 식별 가능하도록 했습니다.", layout: "9-grid 피드 레이아웃을 고려해 단독·연결형 게시물을 혼합 설계했습니다.", copy: "짧고 임팩트 있는 카피와 이모지를 조합해 저장률을 높이는 전략을 적용했습니다.", extra: "하이라이트 커버 12종, 스토리 템플릿 6종, 릴스 썸네일 3종 포함입니다." },
  },
  {
    id: 6, creatorHandle: "@harin.visual", title: "비주얼 아이덴티티 풀 패키지",
    description: "로고, 컬러 팔레트, 타이포그래피, 사진 스타일 가이드를 포함한 종합 아이덴티티 패키지입니다.",
    tags: ["아이덴티티", "가이드라인", "풀패키지"], type: "로고", submittedAt: "2026-05-06",
    image: "https://images.unsplash.com/photo-1777652918753-d66882b15391?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rationale: { tone: "'프로페셔널 웜'으로 브랜드 톤을 설정해 모든 접점에서 일관성을 유지했습니다.", color: "메인 3색(딥 퍼플, 라벤더, 오프화이트)과 서브 2색(카본, 골드)으로 시스템을 구축했습니다.", layout: "8px 그리드와 표준화된 여백 비율로 일관된 결과물을 보장합니다.", copy: "DO/DON'T 카피 예시 20쌍을 가이드에 포함해 브랜드 보이스를 구체화했습니다.", extra: "Adobe CC·Figma·Canva 세 가지 포맷으로 제공합니다." },
  },
  {
    id: 7, creatorHandle: "@minjun.lab", title: "브랜드 모션 인트로 패키지",
    description: "유튜브·발표자료·SNS 영상 인트로에 활용 가능한 모션 그래픽 패키지입니다.",
    tags: ["모션", "영상", "인트로"], type: "영상", submittedAt: "2026-05-07",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rationale: { tone: "브랜드 컬러를 활용한 부드러운 트랜지션으로 전문적이면서도 역동적인 느낌을 표현했습니다.", color: "브랜드 메인 컬러에 화이트 파티클 효과를 더해 프리미엄 감성을 강조했습니다.", layout: "로고 등장 → 슬로건 페이드인 → 아웃트로 순서로 3초 이내에 완결되도록 설계했습니다.", copy: "슬로건을 자막으로 표시해 무음 환경에서도 메시지가 전달되도록 했습니다.", extra: "After Effects 원본 파일과 MP4(투명배경 포함) 두 포맷으로 제공합니다." },
  },
  {
    id: 8, creatorHandle: "@sera.type", title: "타이포그래피 중심 광고 시리즈",
    description: "텍스트 자체가 비주얼이 되는 타이포그래피 광고 시리즈입니다. 강렬한 인상을 남깁니다.",
    tags: ["타이포", "광고", "레터링"], type: "디지털 광고", submittedAt: "2026-05-08",
    image: "https://images.unsplash.com/photo-1522543558187-768b6df7c25c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rationale: { tone: "Bold Italic 타입과 극단적인 크기 대비로 강렬하고 기억에 남는 톤을 구현했습니다.", color: "모노크롬 베이스에 한 가지 형광 포인트 컬러로 시선을 집중시킵니다.", layout: "텍스트를 페이지 전면에 배치하고 이미지를 배경으로 처리해 레이어링 효과를 냈습니다.", copy: "5단어 이내의 임팩트 있는 카피로 즉각적인 감정 반응을 유도했습니다.", extra: "OOH(옥외광고)·디지털 배너·SNS 세 가지 포맷이 모두 포함되어 있습니다." },
  },
];
